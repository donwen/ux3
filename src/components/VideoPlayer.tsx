import React from 'react';
import { Play } from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';

interface VideoPlayerProps {
  url: string;
  title: string;
  thumbnailUrl?: string;
  duration?: number;
  videoId?: string;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ url, title, thumbnailUrl, duration }) => {
  const { t } = useTranslation();

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getYouTubeThumbnail = (url: string) => {
    const videoId = url.match(/(?:youtu\.be\/|youtube\.com(?:\/embed\/|\/v\/|\/watch\?v=|\/user\/\S+|\/ytscreeningroom\?v=|\/sandalsResorts#\w\/\w\/.*\/))([^\/&\?]{10,12})/);
    return videoId ? `https://img.youtube.com/vi/${videoId[1]}/hqdefault.jpg` : thumbnailUrl;
  };

  return (
    <div className="relative aspect-video bg-gray-900 rounded-lg overflow-hidden">
      <div 
        className="absolute inset-0 w-full cursor-pointer group focus:outline-none focus:ring-2 focus:ring-primary-500 touch-manipulation"
        title={t('watchVideo')}
      >
        <img
          src={getYouTubeThumbnail(url)}
          alt={title}
          className="w-full h-full object-cover"
          draggable="false"
        />
        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center group-hover:bg-opacity-50 transition-all">
          <div className="bg-white bg-opacity-90 rounded-full p-4 transform group-hover:scale-110 transition-transform">
            <Play className="w-8 h-8 text-gray-900" />
          </div>
        </div>
        {duration && (
          <div className="absolute bottom-2 right-2 bg-black bg-opacity-80 text-white px-2 py-1 rounded text-sm">
            {formatDuration(duration)}
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoPlayer;