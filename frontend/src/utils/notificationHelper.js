// Helper function to create notifications
export const createNotification = (userEmail, type, title, message) => {
  const allNotifications = JSON.parse(localStorage.getItem("userNotifications") || "[]");
  
  const newNotification = {
    id: `${type}-${Date.now()}`,
    userEmail,
    type,
    title,
    message,
    isRead: false,
    createdAt: new Date().toISOString(),
  };

  allNotifications.push(newNotification);
  localStorage.setItem("userNotifications", JSON.stringify(allNotifications));
  
  // Dispatch event to update notification bell
  window.dispatchEvent(new Event("notificationUpdated"));
};
