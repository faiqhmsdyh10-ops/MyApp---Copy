import { coreApi, snap } from "../config/midtransClient.js";
import crypto from "crypto";

// Generate unique order ID
const generateOrderId = () => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `DONASI-${timestamp}-${random}`;
};

// Create QRIS Payment (Dynamic QR Code)
const createQrisPayment = async (req, res) => {
  try {
    const { amount, donorName, donorEmail, donorPhone, aksiId, aksiTitle } = req.body;

    // Validate required fields
    if (!amount || !donorName || !donorEmail || !aksiId) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: amount, donorName, donorEmail, aksiId",
      });
    }

    // Validate minimum amount (Midtrans minimum is Rp 1)
    if (amount < 1) {
      return res.status(400).json({
        success: false,
        message: "Minimum donation amount is Rp 1",
      });
    }

    const orderId = generateOrderId();

    // Create QRIS transaction parameters
    const parameter = {
      payment_type: "qris",
      transaction_details: {
        order_id: orderId,
        gross_amount: parseInt(amount),
      },
      customer_details: {
        first_name: donorName,
        email: donorEmail,
        phone: donorPhone || "",
      },
      item_details: [
        {
          id: `AKSI-${aksiId}`,
          price: parseInt(amount),
          quantity: 1,
          name: `Donasi: ${aksiTitle || "Aksi Sosial"}`.substring(0, 50), // Max 50 chars
        },
      ],
      qris: {
        acquirer: "gopay", // Options: gopay, airpay shopee (optional)
      },
      custom_expiry: {
        expiry_duration: 15, // 15 minutes
        unit: "minute",
      },
    };

    console.log("Creating QRIS transaction with params:", JSON.stringify(parameter, null, 2));

    // Call Midtrans Core API
    const chargeResponse = await coreApi.charge(parameter);

    console.log("Midtrans QRIS Response:", JSON.stringify(chargeResponse, null, 2));

    // Extract QR code URL - try multiple possible locations
    let qrCodeUrl = null;
    
    // Try from actions array
    if (chargeResponse.actions && Array.isArray(chargeResponse.actions)) {
      const qrAction = chargeResponse.actions.find(
        (action) => action.name === "generate-qr-code" || action.name === "generate-qr-code-v2"
      );
      qrCodeUrl = qrAction?.url;
    }
    
    // If still null, try direct qr_code_url property
    if (!qrCodeUrl && chargeResponse.qr_code_url) {
      qrCodeUrl = chargeResponse.qr_code_url;
    }

    console.log("✅ Extracted QR Code URL:", qrCodeUrl);

    res.json({
      success: true,
      data: {
        orderId: chargeResponse.order_id,
        transactionId: chargeResponse.transaction_id,
        transactionStatus: chargeResponse.transaction_status,
        grossAmount: chargeResponse.gross_amount,
        qrCodeUrl: qrCodeUrl,
        qrString: chargeResponse.qr_string,
        expiryTime: chargeResponse.expiry_time,
        paymentType: chargeResponse.payment_type,
      },
    });
  } catch (error) {
    console.error("Error creating QRIS payment:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to create payment",
      details: error.ApiResponse || null,
    });
  }
};

// Alternative: Create Snap Payment (Popup Payment Page)
const createSnapPayment = async (req, res) => {
  try {
    const { amount, donorName, donorEmail, donorPhone, aksiId, aksiTitle } = req.body;

    if (!amount || !donorName || !donorEmail || !aksiId) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    const orderId = generateOrderId();

    const parameter = {
      transaction_details: {
        order_id: orderId,
        gross_amount: parseInt(amount),
      },
      customer_details: {
        first_name: donorName,
        email: donorEmail,
        phone: donorPhone || "",
      },
      item_details: [
        {
          id: `AKSI-${aksiId}`,
          price: parseInt(amount),
          quantity: 1,
          name: `Donasi: ${aksiTitle || "Aksi Sosial"}`.substring(0, 50),
        },
      ],
      enabled_payments: ["gopay", "shopeepay", "qris", "other_qris"],
      expiry: {
        unit: "minutes",
        duration: 15,
      },
    };

    const snapResponse = await snap.createTransaction(parameter);

    res.json({
      success: true,
      data: {
        orderId: orderId,
        snapToken: snapResponse.token,
        redirectUrl: snapResponse.redirect_url,
      },
    });
  } catch (error) {
    console.error("Error creating Snap payment:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to create payment",
    });
  }
};

// Check Payment Status
const checkPaymentStatus = async (req, res) => {
  try {
    const { orderId } = req.params;

    if (!orderId) {
      return res.status(400).json({
        success: false,
        message: "Order ID is required",
      });
    }

    const statusResponse = await coreApi.transaction.status(orderId);

    res.json({
      success: true,
      data: {
        orderId: statusResponse.order_id,
        transactionId: statusResponse.transaction_id,
        transactionStatus: statusResponse.transaction_status,
        fraudStatus: statusResponse.fraud_status,
        paymentType: statusResponse.payment_type,
        grossAmount: statusResponse.gross_amount,
        transactionTime: statusResponse.transaction_time,
        settlementTime: statusResponse.settlement_time,
      },
    });
  } catch (error) {
    console.error("Error checking payment status:", error);
    
    // Handle case where transaction not found
    if (error.httpStatusCode === 404) {
      return res.status(404).json({
        success: false,
        message: "Transaction not found",
      });
    }

    res.status(500).json({
      success: false,
      message: error.message || "Failed to check payment status",
    });
  }
};

// Webhook Handler for Payment Notification from Midtrans
const handleWebhook = async (req, res) => {
  try {
    const notification = req.body;

    console.log("Received Midtrans webhook:", JSON.stringify(notification, null, 2));

    // Verify signature (important for security!)
    const serverKey = process.env.MIDTRANS_SERVER_KEY;
    const orderId = notification.order_id;
    const statusCode = notification.status_code;
    const grossAmount = notification.gross_amount;
    const signatureKey = notification.signature_key;

    // Create signature for verification
    const payload = orderId + statusCode + grossAmount + serverKey;
    const expectedSignature = crypto
      .createHash("sha512")
      .update(payload)
      .digest("hex");

    if (signatureKey !== expectedSignature) {
      console.error("Invalid signature!");
      return res.status(403).json({
        success: false,
        message: "Invalid signature",
      });
    }

    // Get transaction status
    const transactionStatus = notification.transaction_status;
    const fraudStatus = notification.fraud_status;

    let paymentStatus = "pending";

    if (transactionStatus === "capture") {
      if (fraudStatus === "accept") {
        paymentStatus = "success";
      } else if (fraudStatus === "challenge") {
        paymentStatus = "challenge";
      }
    } else if (transactionStatus === "settlement") {
      paymentStatus = "success";
    } else if (transactionStatus === "cancel" || transactionStatus === "deny" || transactionStatus === "expire") {
      paymentStatus = "failed";
    } else if (transactionStatus === "pending") {
      paymentStatus = "pending";
    }

    console.log(`Order ${orderId} payment status: ${paymentStatus}`);

    // Here you would typically:
    // 1. Update donation status in database
    // 2. Send notification to user
    // 3. Update aksi donation amount if successful

    // For now, we'll just log and return success
    // In production, implement your business logic here

    res.status(200).json({
      success: true,
      message: "Webhook processed",
      data: {
        orderId,
        paymentStatus,
        transactionStatus,
      },
    });
  } catch (error) {
    console.error("Error processing webhook:", error);
    res.status(500).json({
      success: false,
      message: "Failed to process webhook",
    });
  }
};

// Cancel Payment
const cancelPayment = async (req, res) => {
  try {
    const { orderId } = req.params;

    const cancelResponse = await coreApi.transaction.cancel(orderId);

    res.json({
      success: true,
      data: cancelResponse,
    });
  } catch (error) {
    console.error("Error canceling payment:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to cancel payment",
    });
  }
};

export {
  createQrisPayment,
  createSnapPayment,
  checkPaymentStatus,
  handleWebhook,
  cancelPayment,
};
