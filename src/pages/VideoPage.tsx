import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { MessageSquare, Share2, ThumbsUp, Eye } from 'lucide-react';
import { Video, Comment } from '../types';
import { supabase } from '../lib/supabaseClient';
import { useTranslation } from '../hooks/useTranslation';
import { videoTitleTranslations } from '../translations';
import CommentSection from '../components/CommentSection';

const VideoPage: React.FC = () => {
  const { videoId } = useParams<{ videoId: string }>();
  const { t, currentLanguage } = useTranslation();
  const [video, setVideo] = useState<Video | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [likeCount, setLikeCount] = useState(0);

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

        // Get initial like count
        const { data: likes } = await supabase
          .rpc('get_anonymous_likes_count', { video_id: videoId });
        setLikeCount(likes || 0);
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
    
    try {
      const { error } = await supabase
        .from('anonymous_likes')
        .insert({ video_id: videoId });
      
      if (error) throw error;

      const { data: likes } = await supabase
        .rpc('get_anonymous_likes_count', { video_id: videoId });
      setLikeCount(likes || 0);
    } catch (error) {
      console.error('Error updating like:', error);
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="aspect-video bg-gray-200 dark:bg-gray-700 rounded-lg mb-6" />
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4" />
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !video) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            {error || 'Video not found'}
          </h2>
        </div>
      </div>
    );
  }

  const translatedTitle = videoTitleTranslations[video.title]?.[currentLanguage] || video.title;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Video Player */}
        <div className="aspect-video bg-black rounded-lg overflow-hidden mb-6">
          <iframe
            src={`${video.url}?autoplay=1`}
            title={translatedTitle}
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>

        {/* Video Info */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            {translatedTitle}
          </h1>
          
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center space-x-4">
              <span className="flex items-center text-gray-600 dark:text-gray-300">
                <Eye className="h-5 w-5 mr-2" />
                {t('viewsCount', { count: video.views_count || 0 })}
              </span>
              <button
                onClick={handleLike}
                className="flex items-center space-x-2 text-gray-600 dark:text-gray-300 
                         hover:text-red-500 dark:hover:text-red-400 transition-colors"
              >
                <ThumbsUp className="h-5 w-5" />
                <span>{t('likesCount', { count: likeCount })}</span>
              </button>
              <button
                onClick={handleShare}
                className="flex items-center space-x-2 text-gray-600 dark:text-gray-300 
                         hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
              >
                <Share2 className="h-5 w-5" />
                <span>Share</span>
              </button>
            </div>
            
            <div className="flex items-center space-x-4">
              <span className="text-gray-600 dark:text-gray-300">
                {video.creator}
              </span>
              <span className="text-gray-500 dark:text-gray-400">
                {video.uploadDate}
              </span>
            </div>
          </div>

          {/* Description */}
          <div className="mt-6 p-4 bg-white dark:bg-gray-800 rounded-lg">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Description
            </h2>
            <p className="text-gray-600 dark:text-gray-300 whitespace-pre-wrap">
              {video.description}
            </p>
          </div>
        </div>

        {/* Comments Section */}
        <div className="mt-8">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
            <MessageSquare className="h-6 w-6 mr-2" />
            Comments
          </h2>
          <CommentSection videoId={videoId} />
        </div>
      </div>
    </div>
  );
};

export default VideoPage;