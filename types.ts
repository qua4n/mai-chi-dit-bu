
export interface GalleryImage {
  id: string;
  url: string; // This can be the public_id or a full URL
  title: string;
  artist: string;
  category: string;
  width: number;
  height: number;
  cloudinaryData?: {
    public_id: string;
    format: string;
  };
}
