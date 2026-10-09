let clickedImageIndices: number[] = [];
let startTime = 0;
let hasSentLeave = false;

export function recordImageClick(imageOrder: number): void {
  if (typeof imageOrder === 'number' && imageOrder > 0) {
    if (!clickedImageIndices.includes(imageOrder)) {
      clickedImageIndices.push(imageOrder);
      clickedImageIndices.sort((a, b) => a - b);
    }
  }
}

export function initAnalytics(): () => void {
  if (typeof window === 'undefined') {
    return () => {};
  }

  startTime = Date.now();
  hasSentLeave = false;
  clickedImageIndices = [];

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
          clickedImages: clickedImageIndices,
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
