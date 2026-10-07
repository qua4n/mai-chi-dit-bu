export const config = { runtime: 'edge' };

export default async function handler(request: Request): Promise<Response> {
  if (request.method !== 'POST') {
    return Response.json({ error: 'Phương thức không được hỗ trợ' }, { status: 405, headers: { Allow: 'POST' } });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: 'Dữ liệu gửi không hợp lệ' }, { status: 400 });
  }
  if (!body || typeof body !== 'object') {
    return Response.json({ error: 'Dữ liệu gửi không hợp lệ' }, { status: 400 });
  }
  const { content } = body as Record<string, unknown>;
  if (typeof content !== 'string' || !content.trim() || content.trim().length > 2000) {
    return Response.json({ error: 'Lời nhắn không hợp lệ' }, { status: 400 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.MESSAGE_TO_EMAIL;
  if (!apiKey || !to) {
    console.error('Thiếu cấu hình email');
    return Response.json({ error: 'Chưa cấu hình nơi nhận lời nhắn.' }, { status: 503 });
  }

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'onboarding@resend.dev',
        to: [to],
        subject: 'Lời nhắn mới từ trang kỷ niệm',
        text: content.trim(),
      }),
    });
    if (!response.ok) {
      console.error('Resend gửi mail thất bại:', response.status);
      throw new Error('Mail delivery failed');
    }
    return Response.json({ sent: true }, { headers: { 'Cache-Control': 'no-store' } });
  } catch (error) {
    console.error('Không thể gửi lời nhắn:', error);
    return Response.json({ error: 'Chưa gửi được lời nhắn. Vui lòng thử lại sau.' }, { status: 502 });
  }
}
