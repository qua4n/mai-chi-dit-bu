
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import handleMessage from './api/messages';

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'local-messages-api',
      configureServer(server) {
        const env = loadEnv(server.config.mode, server.config.root, '');
        process.env.RESEND_API_KEY ??= env.RESEND_API_KEY;
        process.env.MESSAGE_TO_EMAIL ??= env.MESSAGE_TO_EMAIL;
        server.middlewares.use(async (req, res, next) => {
          if (req.url?.split('?')[0] !== '/api/messages') return next();
          try {
            const chunks: Buffer[] = [];
            for await (const chunk of req) chunks.push(Buffer.from(chunk));
            const response = await handleMessage(new Request('http://localhost/api/messages', {
              method: req.method,
              headers: { 'Content-Type': req.headers['content-type'] ?? 'application/json' },
              ...(req.method === 'POST' ? { body: Buffer.concat(chunks) } : {}),
            }));
            res.statusCode = response.status;
            response.headers.forEach((value, key) => res.setHeader(key, value));
            res.end(Buffer.from(await response.arrayBuffer()));
          } catch (error) {
            console.error('Không thể xử lý lời nhắn:', error);
            res.statusCode = 500;
            res.end();
          }
        });
      },
    },
  ],
  define: {
    'process.env.API_KEY': JSON.stringify(process.env.API_KEY),
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    rollupOptions: {
      input: {
        main: './index.html',
      },
    },
  },
});
