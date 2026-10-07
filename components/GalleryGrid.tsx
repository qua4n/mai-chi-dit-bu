import React from 'react';
import { motion, Variants } from 'framer-motion';
import { GalleryImage } from '../types';
import { getCloudinaryUrl } from '../services/cloudinaryService';

interface GalleryGridProps {
  images: GalleryImage[];
  onImageClick: (image: GalleryImage) => void;
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.05,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 64 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 1.1,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

const GalleryGrid: React.FC<GalleryGridProps> = ({ images, onImageClick }) => {

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="columns-2 lg:columns-3 gap-3 sm:gap-5 md:gap-7 py-8 md:py-14"
    >
      {images.map((image, index) => {
        const featured = index % 7 === 0;
        return (
          <motion.button
            type="button"
            key={image.id}
            variants={itemVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className={`group mb-3 block w-full break-inside-avoid text-left sm:mb-5 md:mb-7 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#873f43] ${featured ? 'border border-[#ded8cc] bg-[#fffaf2] p-1.5 shadow-[0_18px_45px_-20px_rgba(40,39,34,0.24)] sm:p-2 lg:p-3' : ''}`}
            onClick={() => onImageClick(image)}
            aria-label={`Xem ảnh: ${image.title}`}
          >
            <div className="relative overflow-hidden border border-[#ded8cc] bg-[#e8e3d6] transition-all duration-500 ease-out group-hover:border-[#c4bcb0] group-hover:shadow-[0_20px_50px_-12px_rgba(40,39,34,0.18)]">
              <img
                src={getCloudinaryUrl(image.url, { width: 900 })}
                width={image.width}
                height={image.height}
                alt={image.title}
                className="block h-auto w-full transition-transform duration-700 ease-out group-hover:scale-[1.05]"
                loading="lazy"
                decoding="async"
              />
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#282722]/40 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100 group-focus-visible:opacity-100"
              />
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 ring-2 ring-inset ring-[#873f43] ring-offset-2 ring-offset-[#f6f2e9] opacity-0 transition-opacity duration-200 group-focus-visible:opacity-100"
              />
            </div>
          </motion.button>
        );
      })}
    </motion.div>
  );
};

export default GalleryGrid;
