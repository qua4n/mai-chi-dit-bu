import { useState, type FormEvent } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

export default function MessageForm() {
  const reduceMotion = useReducedMotion();
  const [content, setContent] = useState('');
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState('');
  const [sent, setSent] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (sending || !content.trim()) return;
    setSending(true);
    setSent(false);
    setSendError('');
    try {
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: content.trim() }),
      });
      const result = await response.json().catch(() => null);
      if (!response.ok || result?.sent !== true) {
        throw new Error(typeof result?.error === 'string' ? result.error : 'Chưa gửi được lời nhắn. Vui lòng thử lại sau.');
      }
      setContent('');
      setSent(true);
    } catch (error) {
      setSendError(error instanceof Error ? error.message : 'Chưa gửi được lời nhắn. Vui lòng thử lại sau.');
    } finally {
      setSending(false);
    }
  }

  return (
    <section id="loi-nhan" className="mx-auto max-w-7xl scroll-mt-24 px-5 pb-24 sm:px-8 lg:px-12 lg:pb-36" aria-labelledby="message-title">
      <div className="border-t border-[#ded8cc] pt-10 sm:pt-14">
        <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.25em] text-[#873f43]">01 / Lời nhắn</p>
        <h2 id="message-title" className="text-serif text-4xl leading-tight sm:text-5xl">Gửi một lời nhắn</h2>
        <p className="mt-4 max-w-xl text-sm leading-7 text-[#66645d]">Nếu có điều gì muốn nói, có thể gửi cho anh ở dưới đây.</p>
      </div>

      <motion.div
        className="mt-10"
        initial={reduceMotion ? false : { opacity: 0, y: 24 }}
        whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
      >
        <form onSubmit={submit} className="border border-[#d6c9b8] border-t-4 border-t-[#873f43] bg-[#fffaf2] p-5 shadow-[0_20px_60px_-35px_rgba(40,39,34,0.35)] sm:p-10">
          <label htmlFor="guest-message" className="mb-3 block text-xs font-semibold uppercase tracking-[0.14em] text-[#873f43]">Điều muốn nói</label>
          <textarea id="guest-message" value={content} onChange={(event) => setContent(event.target.value)} maxLength={2000} required rows={6} className="block min-h-[160px] max-h-[400px] w-full resize-y border border-[#d6c9b8] bg-[#fffdf8] p-4 text-base leading-7 text-[#282722] shadow-inner transition-[border-color,box-shadow] duration-200 focus:border-[#873f43] focus:outline-none focus:ring-2 focus:ring-[#873f43]/20 sm:p-5" />
          {sendError && <p role="alert" className="mt-4 text-sm text-[#873f43]">{sendError}</p>}
          {sent && <p role="status" className="mt-4 text-sm text-[#426345]">Lời nhắn đã được gửi đi.</p>}
          <button type="submit" disabled={sending} className="mt-7 min-h-12 w-full bg-[#873f43] px-7 py-3 text-sm font-semibold text-white shadow-[0_8px_20px_-10px_rgba(135,63,67,0.8)] transition-[background-color,box-shadow] duration-200 hover:bg-[#6e3036] hover:shadow-[0_12px_25px_-10px_rgba(135,63,67,0.8)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#873f43] disabled:cursor-wait disabled:opacity-60 sm:w-auto">
            {sending ? 'Đang gửi...' : 'Gửi lời nhắn ↗'}
          </button>
        </form>
      </motion.div>
    </section>
  );
}
