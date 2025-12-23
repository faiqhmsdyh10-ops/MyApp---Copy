import React, { useState, useEffect, useRef, useCallback } from "react";
import { Bell } from "lucide-react";

const NotificationBell = ({ isScrolled }) => {
  const [notifications, setNotifications] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const dropdownRef = useRef(null);

  // Load notifications from localStorage
  const loadNotifications = useCallback(() => {
    const userEmail = localStorage.getItem("userEmail");
    if (!userEmail) return;

    const allNotifications = JSON.parse(localStorage.getItem("userNotifications") || "[]");
    // Filter notifications for current user
    const userNotifications = allNotifications.filter(n => n.userEmail === userEmail);
    
    // Sort by date (newest first)
    userNotifications.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    setNotifications(userNotifications);
    setUnreadCount(userNotifications.filter(n => !n.isRead).length);
  }, []);

  // Check for status changes from admin (approved/rejected) - defined BEFORE useEffect
  const checkForStatusChanges = useCallback(() => {
    const userEmail = localStorage.getItem("userEmail");
    if (!userEmail) return;

    const allNotifications = JSON.parse(localStorage.getItem("userNotifications") || "[]");
    const pengajuanAksiList = JSON.parse(localStorage.getItem("pengajuanAksiList") || "[]");
    const pengajuanJasaList = JSON.parse(localStorage.getItem("pengajuanJasaList") || "[]");

    let hasNewNotifications = false;

    // Check pengajuan aksi status changes
    const userPengajuanAksi = pengajuanAksiList.filter(p => p.createdByEmail === userEmail);
    userPengajuanAksi.forEach(pengajuan => {
      const notificationId = `aksi-status-${pengajuan.id}`;
      const existingNotification = allNotifications.find(n => n.id === notificationId);

      if (pengajuan.status === "approved" && !existingNotification) {
        const newNotification = {
          id: notificationId,
          userEmail: userEmail,
          type: "aksi_approved",
          title: "Pengajuan Galang Dana Diterima",
          message: `Pengajuan galang dana "${pengajuan.judul}" telah disetujui oleh admin. Aksi Anda sekarang aktif!`,
          isRead: false,
          createdAt: pengajuan.approvalDate || new Date().toISOString(),
        };
        allNotifications.push(newNotification);
        hasNewNotifications = true;
      } else if (pengajuan.status === "rejected" && !existingNotification) {
        const newNotification = {
          id: notificationId,
          userEmail: userEmail,
          type: "aksi_rejected",
          title: "Pengajuan Galang Dana Ditolak",
          message: `Pengajuan galang dana "${pengajuan.judul}" telah ditolak oleh admin.`,
          isRead: false,
          createdAt: pengajuan.rejectionDate || new Date().toISOString(),
        };
        allNotifications.push(newNotification);
        hasNewNotifications = true;
      }
    });

    // Check pengajuan jasa status changes (if admin marks as approved/rejected)
    const userPengajuanJasa = pengajuanJasaList.filter(p => p.email === userEmail);
    userPengajuanJasa.forEach(pengajuan => {
      const notificationId = `jasa-status-${pengajuan.id}`;
      const existingNotification = allNotifications.find(n => n.id === notificationId);

      if (pengajuan.status === "approved" && !existingNotification) {
        const newNotification = {
          id: notificationId,
          userEmail: userEmail,
          type: "jasa_approved",
          title: "Pengajuan Relawan Diterima",
          message: `Pengajuan relawan Anda telah diterima. Anda sekarang terdaftar sebagai relawan!`,
          isRead: false,
          createdAt: new Date().toISOString(),
        };
        allNotifications.push(newNotification);
        hasNewNotifications = true;
      } else if (pengajuan.status === "rejected" && !existingNotification) {
        const newNotification = {
          id: notificationId,
          userEmail: userEmail,
          type: "jasa_rejected",
          title: "Pengajuan Relawan Ditolak",
          message: `Pengajuan relawan Anda telah ditolak oleh admin.`,
          isRead: false,
          createdAt: new Date().toISOString(),
        };
        allNotifications.push(newNotification);
        hasNewNotifications = true;
      }
    });

    if (hasNewNotifications) {
      localStorage.setItem("userNotifications", JSON.stringify(allNotifications));
      window.dispatchEvent(new Event("notificationUpdated"));
    }

    loadNotifications();
  }, [loadNotifications]);

  // Main useEffect - now checkForStatusChanges is already defined
  useEffect(() => {
    loadNotifications();

    // Listen for notification updates
    const handleNotificationUpdate = () => {
      loadNotifications();
    };

    window.addEventListener("notificationUpdated", handleNotificationUpdate);
    window.addEventListener("storage", handleNotificationUpdate);

    // Polling every 3 seconds for new notifications (check status changes from admin)
    const interval = setInterval(() => {
      checkForStatusChanges();
    }, 3000);

    return () => {
      window.removeEventListener("notificationUpdated", handleNotificationUpdate);
      window.removeEventListener("storage", handleNotificationUpdate);
      clearInterval(interval);
    };
  }, [checkForStatusChanges, loadNotifications]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Auto mark all as read when dropdown is opened
  useEffect(() => {
    if (showDropdown && unreadCount > 0) {
      // Mark as read immediately when dropdown is opened (no delay)
      const userEmail = localStorage.getItem("userEmail");
      const allNotifications = JSON.parse(localStorage.getItem("userNotifications") || "[]");
      const updatedNotifications = allNotifications.map(n => 
        n.userEmail === userEmail ? { ...n, isRead: true } : n
      );
      localStorage.setItem("userNotifications", JSON.stringify(updatedNotifications));
      loadNotifications();
    }
  }, [showDropdown, unreadCount, loadNotifications]);

  // Mark notification as read
  const markAsRead = (notificationId) => {
    const allNotifications = JSON.parse(localStorage.getItem("userNotifications") || "[]");
    const updatedNotifications = allNotifications.map(n => 
      n.id === notificationId ? { ...n, isRead: true } : n
    );
    localStorage.setItem("userNotifications", JSON.stringify(updatedNotifications));
    loadNotifications();
  };

  // Mark all as read
  const markAllAsRead = () => {
    const userEmail = localStorage.getItem("userEmail");
    const allNotifications = JSON.parse(localStorage.getItem("userNotifications") || "[]");
    const updatedNotifications = allNotifications.map(n => 
      n.userEmail === userEmail ? { ...n, isRead: true } : n
    );
    localStorage.setItem("userNotifications", JSON.stringify(updatedNotifications));
    loadNotifications();
  };

  // Get background color based on notification type
  const getNotificationBgColor = (type) => {
    switch (type) {
      case "donation_success":
      case "aksi_approved":
      case "jasa_approved":
        return "bg-green-50 border-green-600 hover:bg-green-100";
      case "pengajuan_aksi":
      case "pengajuan_jasa":
        return "bg-blue-50 border-blue-600 hover:bg-blue-100";
      case "aksi_rejected":
      case "jasa_rejected":
        return "bg-red-50 border-red-600 hover:bg-red-100";
      default:
        return "bg-gray-50 border-gray-600 hover:bg-gray-100";
    }
  };

  // Format time ago
  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) return "Baru saja";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} menit lalu`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} jam lalu`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} hari lalu`;
    return date.toLocaleDateString("id-ID");
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Icon Button */}
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className={`relative p-2 rounded-full transition-colors ${
          isScrolled 
            ? "text-gray-700 hover:bg-gray-100" 
            : "text-white hover:bg-white/20"
        }`}
      >
        <Bell className="w-5 h-5" />
        
        {/* Red Badge with Count */}
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {showDropdown && (
        <div className="absolute right-0 mt-2 w-96 bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden z-50">
          {/* Header */}
          <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
            <h3 className="font-semibold text-gray-800">Notifikasi</h3>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-xs text-blue-600 hover:text-blue-800 font-medium"
              >
                Tandai semua dibaca
              </button>
            )}
          </div>

          {/* Notification List */}
          <div className="max-h-96 overflow-y-auto hide-scrollbar">
            {notifications.length === 0 ? (
              <div className="px-4 py-8 text-center text-gray-500">
                <Bell className="w-10 h-10 mx-auto mb-2 text-gray-300" />
                <p className="text-sm">Belum ada notifikasi</p>
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  onClick={() => markAsRead(notification.id)}
                  className={`px-4 py-3 cursor-pointer transition-colors border mt-4 mx-4 rounded-lg ${getNotificationBgColor(notification.type)}`}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className={`text-sm font-bold mb-2 ${!notification.isRead ? "text-gray-900" : "text-gray-700"}`}>
                          {notification.title}
                        </p>
                        {!notification.isRead && (
                          <span className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></span>
                        )}
                      </div>
                      <p className="text-xs text-gray-600 mt-0.5 line-clamp-2">
                        {notification.message}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {formatTimeAgo(notification.createdAt)}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="px-4 py-2 bg-gray-50 border-t border-gray-200 text-center">
              <span className="text-xs text-gray-500">
                {notifications.length} notifikasi
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
