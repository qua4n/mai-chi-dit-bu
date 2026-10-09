export const config = { runtime: 'edge' };

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function parseUserAgent(ua: string) {
  let os = 'Không xác định';
  if (/iphone|ipad|ipod/i.test(ua)) os = 'iOS';
  else if (/android/i.test(ua)) os = 'Android';
  else if (/macintosh|mac os x/i.test(ua)) os = 'macOS';
  else if (/windows/i.test(ua)) os = 'Windows';
  else if (/linux/i.test(ua)) os = 'Linux';

  let browser = 'Không xác định';
  if (/edg/i.test(ua)) browser = 'Edge';
  else if (/chrome|crios/i.test(ua)) browser = 'Chrome';
  else if (/firefox|fxios/i.test(ua)) browser = 'Firefox';
  else if (/safari/i.test(ua) && !/chrome/i.test(ua)) browser = 'Safari';
  else if (/facebook/i.test(ua)) browser = 'Facebook In-App';
  else if (/zalo/i.test(ua)) browser = 'Zalo In-App';

  const isMobile = /mobile|iphone|android/i.test(ua);
  return { os, browser, type: isMobile ? 'Điện thoại' : 'Máy tính' };
}

function formatDuration(seconds: number): string {
  if (seconds <= 0) return '1 giây';
  if (seconds < 60) return `${seconds} giây`;
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return s > 0 ? `${m} phút ${s} giây` : `${m} phút`;
}

export default async function handler(request: Request): Promise<Response> {
  if (request.method !== 'POST') {
    return Response.json({ error: 'Phương thức không được hỗ trợ' }, { status: 405 });
  }

  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!botToken || !chatId) {
    console.warn('Chưa cấu hình TELEGRAM_BOT_TOKEN hoặc TELEGRAM_CHAT_ID');
    return Response.json({ skipped: true, reason: 'Missing credentials' }, { status: 200 });
  }

  let body: Record<string, unknown> = {};
  try {
    body = await request.json();
  } catch {
    body = {};
  }

  const headers = request.headers;
  const ip = headers.get('x-forwarded-for')?.split(',')[0]?.trim() || headers.get('x-real-ip') || 'Không rõ IP';
  const city = headers.get('x-vercel-ip-city') ? decodeURIComponent(headers.get('x-vercel-ip-city')!) : '';
  const country = headers.get('x-vercel-ip-country') || '';
  const region = headers.get('x-vercel-ip-country-region') || '';
  const uaString = headers.get('user-agent') || '';

  const locationParts = [city, region, country].filter(Boolean);
  const location = locationParts.length > 0 ? locationParts.join(', ') : 'Không xác định';

  const { os, browser, type } = parseUserAgent(uaString);

  const eventType = body.type === 'leave' ? 'leave' : 'enter';

  let message = '';

  if (eventType === 'enter') {
    const visitTime = new Intl.DateTimeFormat('vi-VN', {
      timeZone: 'Asia/Ho_Chi_Minh',
      hourCycle: 'h23',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    }).format(new Date());

    message = [
      '🟢 <b>Khách truy cập website</b>',
      '',
      `⏰ <b>Thời gian:</b> ${escapeHtml(visitTime)} (GMT+7)`,
      `📍 <b>Vị trí:</b> ${escapeHtml(location)}`,
      `🌐 <b>IP:</b> <code>${escapeHtml(ip)}</code>`,
      `📱 <b>Thiết bị:</b> ${type} (${os} • ${browser})`,
    ].join('\n');
  } else {
    // Sự kiện khi khách rời đi
    const durationNum = typeof body.duration === 'number' ? Math.round(body.duration) : 0;
    const durationStr = formatDuration(durationNum);

    const clickedImages = Array.isArray(body.clickedImages) ? body.clickedImages : [];
    let imagesContent = 'Chưa click xem ảnh nào';
    if (clickedImages.length > 0) {
      imagesContent = `${clickedImages.length} ảnh (Ảnh số: ${clickedImages.join(', ')})`;
    }

    message = [
      '🔴 <b>Khách rời trang</b>',
      '',
      `⏱ <b>Thời gian ở lại:</b> ${escapeHtml(durationStr)}`,
      `🖼 <b>Ảnh đã xem:</b> ${imagesContent}`,
      `📍 <b>Vị trí:</b> ${escapeHtml(location)} (IP: <code>${escapeHtml(ip)}</code>)`,
      `📱 <b>Thiết bị:</b> ${type} (${os} • ${browser})`,
    ].join('\n');
  }

  try {
    const telegramRes = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: 'HTML',
        disable_web_page_preview: true,
      }),
    });

    if (!telegramRes.ok) {
      const errorText = await telegramRes.text();
      console.error('Lỗi gửi Telegram:', telegramRes.status, errorText);
      return Response.json({ error: 'Gửi Telegram thất bại' }, { status: 502 });
    }

    return Response.json({ success: true });
  } catch (err) {
    console.error('Lỗi khi xử lý visit log:', err);
    return Response.json({ error: 'Lỗi server' }, { status: 500 });
  }
}
