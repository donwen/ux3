import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MessageSquare, Share2, Eye, ArrowLeft, ChevronDown, ChevronUp, ExternalLink } from 'lucide-react';
import { Video, Comment } from '../types';
import { supabase } from '../lib/supabaseClient';
import { useTranslation } from '../hooks/useTranslation';
import { videoTitleTranslations } from '../translations';
import CommentSection from '../components/CommentSection';
import VideoPlayer from '../components/VideoPlayer';
import CherryBlossom from '../components/CherryBlossom';
import { useCherryBlossom } from '../contexts/CherryBlossomContext';
import articleService from '../services/ArticleService';

const VideoPage: React.FC = () => {
  const { videoId } = useParams<{ videoId: string }>();
  const navigate = useNavigate();
  const { t, currentLanguage } = useTranslation();
  const [video, setVideo] = useState<Video | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [likeCount, setLikeCount] = useState(0);
  const [localLiked, setLocalLiked] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const { addBlossoms } = useCherryBlossom();

  useEffect(() => {
    const fetchVideo = async () => {
      if (!videoId) return;

      try {
        const { data, error } = await supabase
          .from('videos')
          .select('*')
          .eq('id', videoId)
          .single();

        if (error) throw error;
        if (data) {
          setVideo(data);
          // Increment view count
          await supabase.rpc('increment_video_views', { video_id: videoId });
        }

        // 獲取服務器上的點讚數
        const { data: likes } = await supabase
          .rpc('get_anonymous_likes_count', { video_id: videoId });
        
        // 檢查本地點讚狀態
        const savedLikes = localStorage.getItem('video_likes');
        let localLikeValue = 0;
        
        if (savedLikes) {
          const parsedLikes = JSON.parse(savedLikes);
          if (parsedLikes[videoId]) {
            localLikeValue = parsedLikes[videoId];
            setLocalLiked(true);
          }
        }
        
        // 設置點讚數顯示
        setLikeCount((likes || 0) + localLikeValue);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load video');
      } finally {
        setIsLoading(false);
      }
    };

    fetchVideo();
  }, [videoId]);

  const handleLike = async () => {
    if (!videoId) return;
    
    if (!localLiked) {
      try {
        const savedLikes = localStorage.getItem('video_likes') || '{}';
        const parsedLikes = JSON.parse(savedLikes);
        parsedLikes[videoId] = (parsedLikes[videoId] || 0) + 1;
        localStorage.setItem('video_likes', JSON.stringify(parsedLikes));
        
        setLocalLiked(true);
        setLikeCount(prev => prev + 1);
        
        // 適量的櫻花飄落效果
        addBlossoms(8); // 使用適中的櫻花數量
        
        const { error } = await supabase
          .from('anonymous_likes')
          .insert({ video_id: videoId });
        
        if (error) throw error;
      } catch (error) {
        console.error('Error updating like:', error);
      }
    } else {
      // 再次點擊也會有較少的櫻花效果
      addBlossoms(5);
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
  };
  
  const handleGoBack = () => {
    navigate(-1);
  };

  const handleReadArticle = () => {
    if (video) {
      // 構建Google搜索URL，使用視頻標題作為查詢，並在標題前後添加引號
      const searchQuery = encodeURIComponent(`"${video.title}"`);
      const googleSearchUrl = `https://www.google.com/search?q=${searchQuery}`;
      
      // 打開新窗口進行搜索
      window.open(googleSearchUrl, '_blank');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="kawaii-container">
          <div className="animate-pulse">
            <div className="aspect-video bg-gray-200 dark:bg-gray-700 rounded-kawaii mb-6" />
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded-kawaii w-3/4 mb-4" />
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-kawaii w-1/2" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !video) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold text-primary-700 dark:text-primary-300 mb-4">
            {error || 'Video not found'}
          </h2>
          <button 
            onClick={handleGoBack}
            className="btn btn-primary"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t('goBack')}
          </button>
        </div>
      </div>
    );
  }

  const translatedTitle = videoTitleTranslations[video.title]?.[currentLanguage] || video.title;

  return (
    <div className="min-h-screen bg-pink-50 dark:bg-gray-900 py-6 kawaii-dot-pattern">
      <div className="kawaii-container">
        <button 
          onClick={handleGoBack}
          className="kawaii-icon-btn mb-4 flex items-center"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          <span className="text-sm">{t('goBack')}</span>
        </button>
        
        {/* Video Player */}
        <div className="rounded-kawaii overflow-hidden mb-5 shadow-kawaii">
          <VideoPlayer 
            url={video.url}
            title={translatedTitle}
            thumbnailUrl={video.thumbnailUrl}
            duration={video.duration}
            videoId={video.id}
            previewMode={true}
          />
        </div>

        {/* Video Info */}
        <div className="mb-5">
          <h1 
            className="text-xl font-bold cursor-pointer hover:underline hover:text-primary-500 dark:hover:text-primary-300 mb-3 line-clamp-2 transition-colors duration-200"
            onClick={handleReadArticle}
            title={t('readArticle')}
          >
            {translatedTitle}
            <ExternalLink className="inline-block ml-2 h-4 w-4 opacity-70" />
          </h1>
          
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center space-x-4">
              <span className="flex items-center text-gray-600 dark:text-gray-300 text-sm">
                <Eye className="h-4 w-4 mr-1" />
                {t('viewsCount', { count: video.views_count || 0 })}
              </span>
              <button
                onClick={handleLike}
                className="kawaii-icon-btn p-1.5 flex items-center text-gray-600 dark:text-gray-300 
                         hover:text-pink-400 dark:hover:text-pink-300"
                aria-label={t('like')}
              >
                <CherryBlossom className="h-4 w-4" />
                <span className="ml-1 text-xs">{likeCount}</span>
              </button>
              <button
                onClick={handleShare}
                className="kawaii-icon-btn p-1.5 flex items-center text-gray-600 dark:text-gray-300 
                         hover:text-blue-500 dark:hover:text-blue-400"
                aria-label={t('share')}
              >
                <Share2 className="h-4 w-4" />
              </button>
            </div>
            
            <div className="flex items-center space-x-3 text-sm">
              <span className="text-gray-600 dark:text-gray-300 font-kawaii">
                {video.creator}
              </span>
              <span className="text-gray-500 dark:text-gray-400">
                {video.uploadDate}
              </span>
            </div>
          </div>
        </div>

        {/* Comments Section */}
        <div className="mt-6">
          <h2 className="text-lg font-bold text-primary-700 dark:text-primary-300 mb-4 flex items-center">
            <MessageSquare className="h-5 w-5 mr-2" />
            {t('comments')}
          </h2>
          <CommentSection videoId={videoId || ''} />
        </div>
      </div>
    </div>
  );
};

export default VideoPage;