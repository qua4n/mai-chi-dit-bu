import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GalleryImage } from '../types';
import { getCloudinaryUrl } from '../services/cloudinaryService';

interface LightboxProps {
  image: GalleryImage | null;
  onClose: () => void;
}

const Lightbox: React.FC<LightboxProps> = ({ image, onClose }) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
  }, [image?.id]);

  useEffect(() => {
    if (!image) return;

    const originalHtmlOverflow = document.documentElement.style.overflow;
    const originalBodyOverflow = document.body.style.overflow;
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';

    return () => {
      document.documentElement.style.overflow = originalHtmlOverflow;
      document.body.style.overflow = originalBodyOverflow;
    };
  }, [image]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && image) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [image, onClose]);

  return (
    <AnimatePresence>
      {image && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-[#282722]"
          role="dialog"
          aria-modal="true"
          aria-label={image.title}
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0"
            onClick={onClose}
          />

          {/* Close button */}
          <motion.button
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            type="button"
            className="fixed right-4 top-4 z-[120] flex h-11 w-11 items-center justify-center rounded-full border border-[#f6f2e9] bg-[#f6f2e9] text-[#282722] shadow-[0_8px_30px_rgba(0,0,0,0.4)] transition-colors duration-200 hover:border-[#873f43] hover:bg-[#873f43] hover:text-[#f6f2e9] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f6f2e9] focus-visible:ring-offset-2 focus-visible:ring-offset-[#282722] md:right-8 md:top-8 md:h-12 md:w-12"
            onClick={onClose}
            aria-label="Đóng"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="md:h-6 md:w-6"
              aria-hidden="true"
            >
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          </motion.button>

          {/* Main image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-[110] flex h-full w-full items-center justify-center p-4 pb-24 md:p-8 md:pb-28"
          >
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="h-10 w-10 animate-spin rounded-full border-2 border-[#f6f2e9]/30 border-t-[#f6f2e9]" aria-label="Đang tải ảnh" />
              </div>
            )}
            <img
              src={getCloudinaryUrl(image.url)}
              alt={image.title}
              onLoad={() => setIsLoading(false)}
              className={`max-h-[78vh] w-auto max-w-[92vw] rounded-sm object-contain shadow-[0_32px_80px_-20px_rgba(0,0,0,0.45)] md:max-h-[82vh] md:max-w-[88vw] ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-500`}
            />
          </motion.div>

          {/* Floating metadata panel */}
          <motion.aside
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ delay: 0.05, duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="fixed bottom-0 left-0 right-0 z-[115] border-t border-[#f6f2e9]/10 bg-[#282722]/80 backdrop-blur-md"
          >
            <div className="mx-auto flex max-w-screen-xl flex-col gap-3 px-5 py-4 md:flex-row md:items-end md:justify-between md:px-8 md:py-5">
              <div className="min-w-0">
                <span className="block text-[10px] font-semibold uppercase tracking-[0.2em] text-[#e6bdb0]">
                  {image.category}
                </span>
                <h2 className="mt-1 font-['Playfair_Display'] text-xl leading-tight tracking-tight text-[#f6f2e9] md:text-2xl">
                  {image.title}
                </h2>
                <p className="mt-1 truncate text-sm text-[#c9c1b6]">
                  {image.artist}
                </p>
              </div>

              <dl className="flex flex-wrap items-center gap-x-6 gap-y-1 text-xs text-[#c9c1b6]">
                <div className="flex items-center gap-2">
                  <dt className="font-medium text-[#77766e]">Kích thước</dt>
                  <dd className="text-[#f6f2e9]">
                    {image.width} × {image.height}
                  </dd>
                </div>
                {image.cloudinaryData?.format && (
                  <div className="flex items-center gap-2">
                    <dt className="font-medium text-[#77766e]">Định dạng</dt>
                    <dd className="uppercase text-[#f6f2e9]">
                      {image.cloudinaryData.format}
                    </dd>
                  </div>
                )}
              </dl>
            </div>
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
};

export default Lightbox;
