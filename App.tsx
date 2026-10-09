
import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import Background from './components/Background';
import GalleryGrid from './components/GalleryGrid';
import Lightbox from './components/Lightbox';
import LoveTimer from './components/LoveTimer';
import MessageForm from './components/MessageForm';
import { GalleryImage } from './types';
import { fetchImagesFromCloudinary } from './services/cloudinaryService';
import { initAnalytics, recordImageClick } from './services/analyticsService';

const App: React.FC = () => {
  const [activeImage, setActiveImage] = useState<GalleryImage | null>(null);
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    return initAnalytics();
  }, []);

  const handleImageClick = useCallback((image: GalleryImage) => {
    setActiveImage(image);
    recordImageClick(image.title || image.id || 'Ảnh kỷ niệm');
  }, []);

  const loadImages = useCallback(async () => {
    setIsLoading(true);
    try {
      const fetchedImages = await fetchImagesFromCloudinary();
      setImages(fetchedImages);
    } catch (err) {
      console.error("Failed to load images");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadImages();
  }, [loadImages]);

  useEffect(() => {
    const updateBackToTop = () => setShowBackToTop(window.scrollY > 500);
    updateBackToTop();
    window.addEventListener('scroll', updateBackToTop, { passive: true });
    return () => window.removeEventListener('scroll', updateBackToTop);
  }, []);

  return (
    <div className="min-h-screen selection:bg-[#873f43] selection:text-white">
      <Background />
      <Header />

      <main id="top">
        <section className="mx-auto max-w-7xl px-5 pb-8 pt-12 sm:px-8 sm:pb-10 sm:pt-16 lg:px-12 lg:pb-14 lg:pt-20">
          <div className="grid items-center gap-12 border-b border-[#ded8cc] pb-14 lg:grid-cols-[minmax(0,1fr)_420px] lg:gap-14 lg:pb-20">
            <div>
              <p className="mb-8 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.25em] text-[#873f43]">
                <span className="h-px w-8 bg-[#873f43]" />
                A Love Story with...
              </p>
              <h1 className="max-w-4xl text-serif text-[clamp(3.7rem,9vw,8.5rem)] font-normal leading-[1.02] tracking-[-0.06em] text-[#282722]">
                Mai Chi <span className="block italic text-[#873f43]">đít bự.
                  <svg aria-hidden="true" viewBox="0 0 64 64" className="ml-3 inline-block h-[0.52em] w-[0.52em] animate-bounce align-middle not-italic" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="32" cy="36" r="23" fill="#ed913f" />
                    <path d="M32 14c2-7 8-10 15-8-2 7-7 11-15 10" fill="#67815c" />
                    <path d="M30 17c-3-3-7-4-11-3" fill="none" stroke="#67815c" strokeWidth="3" strokeLinecap="round" />
                    <circle cx="23" cy="28" r="5" fill="#ffb873" opacity=".7" />
                  </svg>
                </span>
              </h1>
              <p className="mt-8 max-w-lg text-base leading-7 text-[#77766e]">
                “It wasn't a long journey, but it wasn't a short one either. There were good days, difficult ones, plenty to remember, and a lot we learned as we grew up together.”
              </p>
            </div>
            <div className="relative overflow-hidden bg-[#f0ece3] p-6 sm:p-9">
              <div aria-hidden="true" className="pointer-events-none absolute -right-16 -top-16 h-52 w-52 rounded-full border border-[#fffaf2]/15" />
              <LoveTimer />
            </div>
          </div>
        </section>

        <MessageForm />

        <section className="mx-auto max-w-7xl px-5 pb-24 sm:px-8 lg:px-12 lg:pb-36" aria-labelledby="album-title">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4 sm:mb-12">
            <div>
              <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.25em] text-[#873f43]">02 / Album</p>
              <h2 id="album-title" className="text-serif text-4xl leading-tight sm:text-5xl">Us</h2>
            </div>
            {!isLoading && images.length > 0 && (
              <p className="text-xs uppercase tracking-[0.18em] text-[#77766e]">{images.length} bức ảnh</p>
            )}
          </div>
          {isLoading ? (
            <div aria-live="polite" className="grid grid-cols-2 gap-4 sm:gap-7 lg:grid-cols-3">
              <span className="sr-only">Đang tải ảnh...</span>
              {[...Array(6)].map((_, i) => (
                <div key={i} className="aspect-[4/5] animate-pulse bg-[#e9e3d8]" />
              ))}
            </div>
          ) : images.length > 0 ? (
            <GalleryGrid images={images} onImageClick={handleImageClick} />
          ) : (
            <div className="border-y border-[#ded8cc] py-20 text-center sm:py-28">
              <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#873f43]">Album đang chờ ảnh</p>
              <h3 className="text-serif text-3xl italic sm:text-4xl">Chưa có khoảnh khắc nào được tải.</h3>
              <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-[#77766e]">Hãy thử tải lại bộ sưu tập.</p>
              <button type="button" onClick={loadImages} className="mt-8 border-b border-[#873f43] pb-1 text-xs font-semibold uppercase tracking-[0.16em] text-[#873f43] hover:text-[#282722]">
                Tải lại ảnh ↗
              </button>
            </div>
          )}
        </section>
      </main>

      <Lightbox image={activeImage} onClose={() => setActiveImage(null)} />
      {showBackToTop && (
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' })}
          aria-label="Về đầu trang"
          className="fixed bottom-5 right-5 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-[#873f43] text-white shadow-[0_8px_24px_rgba(40,39,34,0.3)] transition-colors hover:bg-[#6e3036] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#873f43] sm:bottom-8 sm:right-8"
        >
          <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 sm:h-6 sm:w-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m6 12 6-6 6 6M12 6v12" />
          </svg>
        </button>
      )}

      <footer className="bg-[#282722] text-[#f6f2e9]">
        <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8 sm:py-14 lg:px-12 lg:py-16">
          <p className="text-center text-serif text-base italic leading-snug text-[#f6f2e9] sm:text-lg">
            A quiet archive of us.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;
