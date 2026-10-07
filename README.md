<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/15BdaL8cGKmhXecQR-5uCzUktj6RKyP-8

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## Giao diện album

Giao diện theo phong cách album biên tập, dùng cỡ chữ nền 17px: ảnh Cloudinary được sắp theo cột, giữ nguyên tỉ lệ ảnh, có lớp thông tin khi hover/focus. Bấm ảnh để mở chế độ xem toàn màn hình với thông tin ảnh ở phía dưới; đóng bằng nút luôn hiển thị, nền ngoài ảnh hoặc `Esc`. Tiêu đề album có biểu tượng quả cam chuyển động; hiệu ứng dừng khi người dùng bật chế độ giảm chuyển động. Trang chỉ có album, không còn tab Kỷ niệm. Bố cục ảnh tự điều chỉnh theo kích thước màn hình.

Bộ đếm được dừng ở ngày 24/9/2026, hiển thị nổi bật 522 ngày tính từ 20/4/2025 và không tiếp tục tăng theo thời gian thực; khối màu đỏ trầm làm nổi con số, biểu tượng pause và hai mốc bắt đầu/tạm dừng. Hiệu ứng xuất hiện và đường thời gian tắt khi người dùng bật chế độ giảm chuyển động. Khi cuộn xuống, nút nổi ở góc màn hình đưa về đầu trang.

## Nhận lời nhắn qua email

Form **Gửi một lời nhắn** đặt trước album. Khách chỉ nhập nội dung; lời nhắn được gửi riêng tới email của chủ trang, không lưu hoặc công khai trên trang.

Để bật tính năng trên Vercel, đặt các biến môi trường trong Vercel Project Settings → Environment Variables:

- `RESEND_API_KEY`: API key do [Resend](https://resend.com/) cấp (chỉ đặt trên máy chủ).
- `MESSAGE_TO_EMAIL`: email nhận lời nhắn. Khi chưa xác minh domain trên Resend, địa chỉ này phải là email đăng ký tài khoản Resend.

Máy chủ gửi từ địa chỉ thử nghiệm `onboarding@resend.dev` của Resend; không cần đặt email gửi. Resend chỉ cho gửi từ địa chỉ này tới email đăng ký tài khoản. Nếu sau này muốn gửi tới email khác, cần xác minh domain trên Resend và đổi địa chỉ `from` trong `api/messages.ts` sang domain đó.

Triển khai lại sau khi đặt biến. Nếu chưa cấu hình hoặc Resend từ chối gửi, khách sẽ thấy thông báo lỗi và nội dung vừa nhập vẫn được giữ nguyên để thử lại. Khi chạy `npm run dev`, Vite phục vụ `/api/messages` cục bộ bằng cùng handler với Vercel; đặt `RESEND_API_KEY` và `MESSAGE_TO_EMAIL` trong `.env.local` (hoặc môi trường máy chủ) để thử gửi email thật.
