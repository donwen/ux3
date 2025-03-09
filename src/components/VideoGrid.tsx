import React, { useRef, useCallback, useState, useEffect } from 'react';
import { Eye, Share2, ExternalLink } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import VideoPlayer from './VideoPlayer';
import { Video } from '../types';
import { supabase } from '../lib/supabaseClient';
import { useTranslation } from '../hooks/useTranslation';
import { videoTitleTranslations } from '../translations';
import CherryBlossom from './CherryBlossom';
import { useCherryBlossom } from '../contexts/CherryBlossomContext';
import articleService from '../services/ArticleService';

interface VideoGridProps {
  videos: Video[];
  onLoadMore: () => void;
  hasMore: boolean;
}

const VideoGrid: React.FC<VideoGridProps> = ({ videos, onLoadMore, hasMore }) => {
  const { t, currentLanguage } = useTranslation();
  const navigate = useNavigate();
  const observer = useRef<IntersectionObserver>();
  const [likeCounts, setLikeCounts] = useState<Record<string, number>>({});
  const [localLikeCount, setLocalLikeCount] = useState<Record<string, number>>({});
  const [shareTooltip, setShareTooltip] = useState<string | null>(null);
  const [animatingVideos, setAnimatingVideos] = useState<Record<string, boolean>>({});
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const { addBlossoms } = useCherryBlossom();

  // 添加調試日誌
  useEffect(() => {
    console.log('VideoGrid mounted. 視頻數量:', videos.length);
    if (videos.length > 0) {
      console.log('首個視頻示例:', videos[0]);
    }
  }, [videos]);

  // 從 localStorage 加載之前的點讚數據
  useEffect(() => {
    try {
      const savedLikes = localStorage.getItem('video_likes');
      if (savedLikes) {
        const parsedLikes = JSON.parse(savedLikes);
        setLocalLikeCount(parsedLikes);
      }
    } catch (error) {
      console.error('Error loading likes from localStorage', error);
    }
  }, []);

  // 將點讚數據保存到 localStorage
  useEffect(() => {
    if (Object.keys(localLikeCount).length > 0) {
      try {
        localStorage.setItem('video_likes', JSON.stringify(localLikeCount));
      } catch (error) {
        console.error('Error saving likes to localStorage', error);
      }
    }
  }, [localLikeCount]);

  const lastVideoRef = useCallback((node: HTMLDivElement) => {
    if (observer.current) observer.current.disconnect();
    
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore && !isLoadingMore) {
        setIsLoadingMore(true);
        
        // 使用短延遲，讓用戶感知到加載過程
        setTimeout(() => {
          onLoadMore();
          setIsLoadingMore(false);
        }, 500);
      }
    }, {
      rootMargin: '200px', // 提前200像素觸發，讓加載更平滑
      threshold: 0.1
    });
    
    if (node) observer.current.observe(node);
  }, [hasMore, onLoadMore, isLoadingMore]);

  const handleLike = async (videoId: string, event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    
    if (!videoId) return;
    
    try {
      const button = document.querySelector(`[data-like-button="${videoId}"]`);
      button?.classList.add('animate-cherry-blossom');
      
      // 更新動畫狀態
      setAnimatingVideos(prev => ({
        ...prev,
        [videoId]: true
      }));
      
      // 本地增加點讚數，無需等待伺服器回應
      const incrementAmount = 1;
      setLocalLikeCount(prev => ({
        ...prev,
        [videoId]: (prev[videoId] || 0) + incrementAmount
      }));
      
      // 觸發櫻花飄落效果 - 適量的櫻花
      addBlossoms(6); // 使用適中的櫻花數量
      
      // 仍然發送到伺服器用於分析，但不強制依賴響應
      try {
        await supabase.from('anonymous_likes').insert({ video_id: videoId });
      } catch (error) {
        console.error('Failed to record like on server, but counted locally:', error);
      }
      
      setTimeout(() => {
        button?.classList.remove('animate-cherry-blossom');
        setAnimatingVideos(prev => ({
          ...prev,
          [videoId]: false
        }));
      }, 800);
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

  // 提取描述摘要
  const getDescriptionSummary = (description: string, maxLength = 60) => {
    if (!description) return '';
    
    if (description.length <= maxLength) return description;
    
    // 截斷描述並添加省略號
    const truncated = description.substring(0, maxLength);
    const lastSpace = truncated.lastIndexOf(' ');
    
    return lastSpace > 0 
      ? description.substring(0, lastSpace) + '...' 
      : truncated + '...';
  };

  // 更新標題點擊事件
  const handleTitleClick = (videoId: string) => {
    if (!videoId) return;
    
    // 跳轉到詳情頁
    navigate(`/video/${videoId}`);
  };

  return (
    <div className="kawaii-grid animate-fade-in">
      {videos.map((video, index) => {
        const key = video.id || `video-${index}-${Date.now()}`;
        const translatedTitle = getTranslatedTitle(video.title);
        
        // 結合服務器點讚數和本地點讚數
        const serverLikeCount = likeCounts[video.id || ''] !== undefined 
          ? likeCounts[video.id || ''] 
          : (video.likes || 0);
        const localCount = localLikeCount[video.id || ''] || 0;
        const totalLikeCount = serverLikeCount + localCount;
        
        const isAnimating = animatingVideos[video.id || ''];
        
        // 計算隨機的主題色彩 (不再使用)
        const colors = ['pink', 'mint', 'peach', 'lavender', 'sky', 'yellow'];
        const videoColor = colors[index % colors.length] as 'pink' | 'mint' | 'peach' | 'lavender' | 'sky' | 'yellow';
        
        return (
          <div
            key={key}
            ref={index === videos.length - 1 ? lastVideoRef : null}
            className="card group animate-fade-in h-full"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div className="relative">
              <div className="block w-full focus:outline-none focus:ring-2 
                         focus:ring-primary-500 rounded-t-kawaii overflow-hidden
                         active:opacity-90 touch-manipulation">
                <VideoPlayer 
                  url={video.url} 
                  title={translatedTitle}
                  thumbnailUrl={video.thumbnailUrl}
                  duration={video.duration}
                  videoId={video.id}
                  hoverPlay={true}
                />
              </div>
            </div>
            
            <div className="p-3 pb-2">
              <h3 
                onClick={() => handleTitleClick(video.id || '')}
                className="block w-full text-left text-xs font-kawaii text-primary-700 
                         dark:text-primary-400 hover:text-primary-600 cursor-pointer
                         dark:hover:text-primary-300 mb-1 hover:underline
                         transition-all duration-200 transform touch-manipulation
                         line-clamp-3 h-[3.5rem]"
              >
                {translatedTitle}
                {isAnimating && (
                  <span className="inline-block ml-1 animate-pop text-pink-400">🌸</span>
                )}
              </h3>
              
              <p className="text-xs font-kawaii text-gray-600 dark:text-gray-300 mb-0.5 line-clamp-1">
                {video.creator}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {video.uploadDate}
              </p>
              
              <div className="kawaii-divider my-2 opacity-50"></div>
              
              <div className="kawaii-flex-between">
                <span className="flex items-center text-gray-600 dark:text-gray-300 text-xs">
                  <Eye className="h-3 w-3 mr-1" />
                  {t('viewsCount', { count: video.views_count || 0 })}
                </span>
                
                <div className="flex items-center gap-4">
                  <div className="flex justify-between mt-2">
                    <div className="flex space-x-2">
                      <button
                        onClick={(e) => handleLike(video.id || '', e)}
                        className="kawaii-icon-btn flex items-center text-gray-600 dark:text-gray-300 
                                 hover:text-pink-400 dark:hover:text-pink-300 p-1"
                        aria-label={t('like')}
                        data-like-button={video.id}
                      >
                        <CherryBlossom className="h-4 w-4" />
                        <span className="ml-1 text-xs">{totalLikeCount}</span>
                      </button>
                      
                      <button
                        onClick={(e) => handleShare(video.id || '', video.title || '', e)}
                        className="kawaii-icon-btn flex items-center text-gray-600 dark:text-gray-300 
                                 hover:text-blue-500 dark:hover:text-blue-400 p-1"
                        aria-label={t('share')}
                      >
                        <Share2 className="h-4 w-4" />
                        {shareTooltip === video.id && (
                          <span className="absolute mt-8 ml-[-30px] bg-gray-800 text-white 
                                           text-xs py-1 px-2 rounded whitespace-nowrap z-10">
                            {t('linkCopied')}
                          </span>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
      
      {isLoadingMore && (
        <div className="col-span-full flex justify-center py-4">
          <div className="kawaii-loading"></div>
        </div>
      )}
    </div>
  );
};

export default VideoGrid;