import React, { useRef, useCallback, useState } from 'react';
import { Eye, Heart, Share2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import VideoPlayer from './VideoPlayer';
import { Video } from '../types';
import { supabase } from '../lib/supabaseClient';
import { useTranslation } from '../hooks/useTranslation';
import { videoTitleTranslations } from '../translations';

interface VideoGridProps {
  videos: Video[];
  onLoadMore: () => void;
  hasMore: boolean;
}

const VideoGrid: React.FC<VideoGridProps> = ({ videos, onLoadMore, hasMore }) => {
  const { t, currentLanguage } = useTranslation();
  const observer = useRef<IntersectionObserver>();
  const [likeCounts, setLikeCounts] = useState<Record<string, number>>({});
  const [shareTooltip, setShareTooltip] = useState<string | null>(null);

  const lastVideoRef = useCallback((node: HTMLDivElement) => {
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        onLoadMore();
      }
    });
    if (node) observer.current.observe(node);
  }, [hasMore, onLoadMore]);

  const handleLike = async (videoId: string, event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    
    if (!videoId) return;
    
    try {
      const button = document.querySelector(`[data-like-button="${videoId}"]`);
      button?.classList.add('animate-scale-in');
      
      const { error } = await supabase.from('anonymous_likes').insert({ video_id: videoId });
      if (error) throw error;

      const { data: likes } = await supabase
        .rpc('get_anonymous_likes_count', { video_id: videoId });
      
      setLikeCounts(prev => ({
        ...prev,
        [videoId]: likes || 0
      }));
      
      setTimeout(() => {
        button?.classList.remove('animate-scale-in');
      }, 300);
    } catch (error) {
      console.error('Error updating like:', error);
    }
  };

  const handleShare = async (videoId: string, title: string, event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    
    const shareUrl = `${window.location.origin}/video/${videoId}`;
    
    try {
      const isSecureContext = window.isSecureContext;
      
      if (isSecureContext && navigator.share && /mobile|android|iphone|ipad/i.test(navigator.userAgent)) {
        try {
          await navigator.share({
            title,
            url: shareUrl
          });
          return;
        } catch (shareError) {
          console.log('Native share failed, falling back to clipboard:', shareError);
        }
      }
      
      await navigator.clipboard.writeText(shareUrl);
      setShareTooltip(videoId);
      setTimeout(() => setShareTooltip(null), 2000);
    } catch (error) {
      console.error('Share fallback failed:', error);
      window.prompt(t('copyShareLink'), shareUrl);
    }
  };

  const getTranslatedTitle = (title: string) => {
    return videoTitleTranslations[title]?.[currentLanguage] || title;
  };

  const handleVideoClick = async (video: Video, event: React.MouseEvent | React.KeyboardEvent) => {
    event.preventDefault();
    
    if (!video.id) return;
    
    try {
      // 在新視窗中打開影片
      window.open(video.url, '_blank', 'noopener,noreferrer');
      
      // 非同步增加觀看次數
      await supabase.rpc('increment_video_views', { video_id: video.id })
        .then(() => {
          console.log('View count incremented');
        })
        .catch((error) => {
          console.error('Error incrementing view count:', error);
        });
    } catch (error) {
      console.error('Error handling video click:', error);
      // 確保即使出錯也能打開影片
      window.open(video.url, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6">
      {videos.map((video, index) => {
        const key = video.id || `video-${index}-${Date.now()}`;
        const translatedTitle = getTranslatedTitle(video.title);
        const likeCount = (likeCounts[video.id || '']) ?? (video.likes || 0);
        
        return (
          <div
            key={key}
            ref={index === videos.length - 1 ? lastVideoRef : null}
            className="card group animate-fade-in"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <a
              href={video.url}
              onClick={(e) => handleVideoClick(video, e)}
              className="block w-full cursor-pointer focus:outline-none focus:ring-2 
                       focus:ring-primary-500 rounded-t-lg overflow-hidden
                       active:opacity-90 touch-manipulation"
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Play ${translatedTitle}`}
            >
              <VideoPlayer 
                url={video.url} 
                title={translatedTitle}
                thumbnailUrl={video.thumbnailUrl}
                duration={video.duration}
                videoId={video.id}
              />
            </a>
            
            <div className="p-6">
              <a
                href={video.description}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full text-left text-xl font-bold text-primary-600 
                         dark:text-primary-400 hover:text-primary-700 
                         dark:hover:text-primary-300 mb-3 group-hover:underline 
                         transition-colors duration-200 transform 
                         group-hover:translate-x-1 touch-manipulation"
              >
                {translatedTitle}
              </a>
              
              <p className="text-base text-gray-600 dark:text-gray-300 mb-2">
                {video.creator}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {video.uploadDate}
              </p>
              
              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center space-x-4">
                  <span className="flex items-center text-gray-600 dark:text-gray-300">
                    <Eye className="h-5 w-5 mr-2" />
                    {t('viewsCount', { count: video.views_count || 0 })}
                  </span>
                  <button
                    type="button"
                    data-like-button={video.id}
                    onClick={(e) => handleLike(video.id || '', e)}
                    className="flex items-center text-gray-600 dark:text-gray-300 
                             hover:text-red-500 dark:hover:text-red-400
                             transition-all duration-200 cursor-pointer
                             transform hover:scale-110 active:scale-95
                             focus:outline-none focus:ring-2 focus:ring-red-500 
                             focus:ring-opacity-50 rounded-lg px-2 py-1 
                             touch-manipulation"
                    aria-label={`Like ${translatedTitle}`}
                  >
                    <Heart className={`h-5 w-5 mr-2 transition-colors duration-200
                                    ${likeCount > 0 ? 'text-red-500 dark:text-red-400' : ''}`} />
                    {t('likesCount', { count: likeCount })}
                  </button>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={(e) => handleShare(video.id || '', translatedTitle, e)}
                      className="flex items-center text-gray-600 dark:text-gray-300 
                               hover:text-blue-500 dark:hover:text-blue-400
                               transition-all duration-200 cursor-pointer
                               transform hover:scale-110 active:scale-95
                               focus:outline-none focus:ring-2 focus:ring-blue-500 
                               focus:ring-opacity-50 rounded-lg px-2 py-1 
                               touch-manipulation"
                      aria-label={t('share')}
                    >
                      <Share2 className="h-5 w-5" />
                    </button>
                    {shareTooltip === video.id && (
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2
                                    bg-gray-900 text-white text-sm px-3 py-1 rounded-lg
                                    animate-fade-in whitespace-nowrap z-10">
                        {t('linkCopied')}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default VideoGrid;