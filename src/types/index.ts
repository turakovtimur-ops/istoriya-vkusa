export interface MenuItem {
  id: string;
  name: string;
  description?: string;
  weight?: string;
  price?: number;
  image?: string;
  category: string;
  featured?: boolean;
}

export interface Review {
  id: string;
  author: string;
  text: string;
  date?: string;
}

export interface GalleryImage {
  id: string;
  src: string;
  alt: string;
  category: 'restaurant' | 'dishes' | 'team' | 'guests' | 'sea';
  span?: 'full' | 'large' | 'medium' | 'small';
}

export interface BookingForm {
  name: string;
  phone: string;
  date: string;
  time: string;
  guests: number;
  comment: string;
}