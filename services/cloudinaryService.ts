
/**
 * Cloudinary Frontend Delivery Service
 */

const CLOUD_NAME = 'ezn0gp0q';
// Ưu tiên lấy Tag từ biến môi trường, mặc định là 'all' hoặc 'maichi'
const TAG_NAME = (process.env as any).CLOUDINARY_TAG || 'all'; 

export const getCloudinaryUrl = (publicId: string, options: { width?: number; height?: number; crop?: string } = {}) => {
  if (!publicId) return '';
  if (publicId.startsWith('http')) return publicId;

  const { width, height, crop = 'fill' } = options;
  
  const transformations = [
    'f_auto',
    'q_auto',
    width ? `w_${width}` : '',
    height ? `h_${height}` : '',
    width || height ? `c_${crop}` : '',
  ].filter(Boolean).join(',');

  return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/${transformations}/${publicId}`;
};

export const fetchImagesFromCloudinary = async () => {
  try {
    // Cloudinary yêu cầu Resource List phải thông qua Tag để bảo mật phía Client
    const url = `https://res.cloudinary.com/${CLOUD_NAME}/image/list/${TAG_NAME}.json`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: { 'Accept': 'application/json' },
    });

    if (!response.ok) {
      console.warn(`Không tìm thấy ảnh với tag: ${TAG_NAME}`);
      return [];
    }

    const data = await response.json();
    if (!data.resources) return [];

    return data.resources.map((res: any) => ({
      id: res.public_id,
      url: res.public_id,
      title: 'Khoảnh khắc',
      artist: 'Mai Chi',
      category: 'Archive',
      width: res.width || 1200,
      height: res.height || 800,
      cloudinaryData: {
        public_id: res.public_id,
        format: res.format
      }
    }));
  } catch (error: any) {
    console.error('Cloudinary Fetch Error:', error);
    return [];
  }
};
