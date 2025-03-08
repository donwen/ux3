export interface Video {
  id?: string;
  title: string;
  description: string;
  url: string;
  uploadDate: string;
  creator: string;
  duration?: number;
  thumbnailUrl?: string;
  likes?: number;
  views_count?: number;
  articleUrl?: string;
  category?: string;
}

export interface VideoLike {
  id: string;
  video_id: string;
  created_at: string;
}

export interface Comment {
  id: string;
  video_id: string;
  content: string;
  author_name?: string;
  created_at: string;
}