importScripts("https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.sw.js");

// ★ 알림 클릭 시 같은 채팅방(tag)의 알림 모두 제거
self.addEventListener('notificationclick', function(event) {
  const tag = event.notification.tag;
  if (tag) {
    event.waitUntil(
      self.registration.getNotifications({ tag: tag }).then(function(notifications) {
        notifications.forEach(function(n) { n.close(); });
      })
    );
  }
});
