let clickedImages: string[] = [];
let startTime = 0;
let hasSentLeave = false;

export function recordImageClick(imageTitle: string): void {
  const cleanTitle = imageTitle.trim() || 'Ảnh không tên';
  if (!clickedImages.includes(cleanTitle)) {
    clickedImages.push(cleanTitle);
  }
}

export function initAnalytics(): () => void {
  if (typeof window === 'undefined') {
    return () => {};
  }

  startTime = Date.now();
  hasSentLeave = false;
  clickedImages = [];

  // Gửi thông báo khi khách vừa vào trang (kể cả F5)
  try {
    fetch('/api/visit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'enter' }),
      keepalive: true,
    }).catch(() => {});
  } catch {
    // Không làm gián đoạn người dùng
  }

  // Gửi thông báo khi khách rời đi
  const sendLeaveEvent = () => {
    if (hasSentLeave) return;
    hasSentLeave = true;

    const duration = Math.max(1, Math.round((Date.now() - startTime) / 1000));

    try {
      fetch('/api/visit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'leave',
          duration,
          clickedImages,
        }),
        keepalive: true,
      }).catch(() => {});
    } catch {
      // Bỏ qua lỗi
    }
  };

  const handleVisibilityChange = () => {
    if (document.visibilityState === 'hidden') {
      sendLeaveEvent();
    }
  };

  window.addEventListener('pagehide', sendLeaveEvent);
  document.addEventListener('visibilitychange', handleVisibilityChange);

  return () => {
    window.removeEventListener('pagehide', sendLeaveEvent);
    document.removeEventListener('visibilitychange', handleVisibilityChange);
  };
}
