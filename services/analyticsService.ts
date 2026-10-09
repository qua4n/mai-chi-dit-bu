const SESSION_LOG_KEY = 'maichi_visit_logged';

export function trackVisitor(): void {
  if (typeof window === 'undefined') return;

  try {
    // Chỉ ghi nhận 1 lần trong mỗi phiên (session) để tránh spam khi F5
    if (sessionStorage.getItem(SESSION_LOG_KEY)) {
      return;
    }
    sessionStorage.setItem(SESSION_LOG_KEY, 'true');

    const data = {
      screen: `${window.screen?.width || 0}x${window.screen?.height || 0}`,
      viewport: `${window.innerWidth || 0}x${window.innerHeight || 0}`,
      language: navigator.language || 'vi',
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'Asia/Ho_Chi_Minh',
      referrer: document.referrer || 'Trực tiếp / Không có',
      pathname: `${window.location.pathname}${window.location.search}`,
    };

    fetch('/api/visit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
      keepalive: true,
    }).catch(() => {
      // Không ném lỗi ra ngoài để đảm bảo trải nghiệm người dùng
    });
  } catch {
    // Phòng ngừa trường hợp trình duyệt chặn sessionStorage
  }
}
