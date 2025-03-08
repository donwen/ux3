import React, { useState, useRef, useEffect } from 'react';
import { Volume2, VolumeX, Maximize, Play } from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';

interface VideoPlayerProps {
  url: string;
  title: string;
  thumbnailUrl?: string;
  duration?: number;
  videoId?: string;
  previewMode?: boolean;
  hoverPlay?: boolean;
}

// 支援的視頻平台類型
type VideoPlatform = 'youtube' | 'vimeo' | 'unknown';

const VideoPlayer: React.FC<VideoPlayerProps> = ({ url, title, thumbnailUrl, duration, previewMode = false, hoverPlay = false }) => {
  const { t } = useTranslation();
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isHovering, setIsHovering] = useState(false);
  const [showControls, setShowControls] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [isUserSeeking, setIsUserSeeking] = useState(false);
  const playerRef = useRef<HTMLIFrameElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const autoPlayTimerRef = useRef<NodeJS.Timeout | null>(null);
  
  // 从 URL 获取平台和视频 ID
  const getPlatformAndId = (url: string): { platform: VideoPlatform, videoId: string | null } => {
    // YouTube
    const youtubeRegex = /(?:youtu\.be\/|youtube\.com(?:\/embed\/|\/v\/|\/watch\?v=|\/user\/\S+|\/ytscreeningroom\?v=|\/sandalsResorts#\w\/\w\/.*\/))([^\/&\?]{10,12})/;
    const youtubeMatch = url.match(youtubeRegex);
    if (youtubeMatch) {
      return { platform: 'youtube', videoId: youtubeMatch[1] };
    }
    
    // Vimeo
    const vimeoRegex = /vimeo\.com\/(?:video\/)?(\d+)/;
    const vimeoMatch = url.match(vimeoRegex);
    if (vimeoMatch) {
      return { platform: 'vimeo', videoId: vimeoMatch[1] };
    }
    
    return { platform: 'unknown', videoId: null };
  };
  
  const { platform, videoId } = getPlatformAndId(url);
  
  // 获取嵌入 URL
  const getEmbedUrl = (platform: VideoPlatform, videoId: string | null): string => {
    if (!videoId) return '';
    
    switch (platform) {
      case 'youtube':
        return `https://www.youtube.com/embed/${videoId}?autoplay=${isPlaying ? '1' : '0'}&mute=${isMuted ? '1' : '0'}&enablejsapi=1&playsinline=1&rel=0&controls=0&origin=${window.location.origin}`;
      case 'vimeo':
        return `https://player.vimeo.com/video/${videoId}?autoplay=${isPlaying ? '1' : '0'}&muted=${isMuted ? '1' : '0'}&playsinline=1&api=1&controls=0`;
      default:
        return '';
    }
  };
  
  // 获取缩略图
  const getThumbnail = (): string => {
    if (thumbnailUrl) return thumbnailUrl;
    
    if (platform === 'youtube' && videoId) {
      return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
    } else if (platform === 'vimeo' && videoId) {
      // Vimeo 的缩略图需要通过 API 获取，这里简化处理
      return '';
    }
    
    return '';
  };
  
  // 控制播放
  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };
  
  // 控制音量
  const toggleMute = () => {
    setIsMuted(!isMuted);
  };
  
  // 处理全屏
  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      containerRef.current.requestFullscreen();
    }
  };
  
  // 格式化时长
  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };
  
  // 鼠标事件处理
  const handleMouseEnter = () => {
    setIsHovering(true);
    setShowControls(true);
    
    // 如果啟用了懸停播放功能，設置延遲自動播放
    if (hoverPlay && !isPlaying) {
      autoPlayTimerRef.current = setTimeout(() => {
        setIsPlaying(true);
      }, 700); // 延遲700毫秒開始播放，避免快速划過時觸發
    }
  };
  
  const handleMouseLeave = () => {
    setIsHovering(false);
    
    // 清除自動播放計時器
    if (autoPlayTimerRef.current) {
      clearTimeout(autoPlayTimerRef.current);
      autoPlayTimerRef.current = null;
    }
    
    // 如果是懸停播放，離開時暫停
    if (hoverPlay && isPlaying) {
      setIsPlaying(false);
    }
    
    if (isPlaying && !hoverPlay) {
      setShowControls(false);
    }
  };
  
  const handleMouseMove = () => {
    if (isPlaying) {
      setShowControls(true);
      resetControlsTimer();
    }
  };
  
  // 控制自动隐藏
  const controlsTimerRef = useRef<NodeJS.Timeout | null>(null);
  
  const resetControlsTimer = () => {
    if (controlsTimerRef.current) {
      clearTimeout(controlsTimerRef.current);
    }
    
    controlsTimerRef.current = setTimeout(() => {
      if (isPlaying && !isHovering) {
        setShowControls(false);
      }
    }, 2500);
  };
  
  // 处理时间轴拖动
  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressRef.current || !duration) return;
    
    const rect = progressRef.current.getBoundingClientRect();
    const position = (e.clientX - rect.left) / rect.width;
    const newTime = Math.max(0, Math.min(position * duration, duration));
    
    setCurrentTime(newTime);
    
    // 如果支持，則發送消息到iframe來更新播放時間
    if (playerRef.current && playerRef.current.contentWindow) {
      if (platform === 'youtube') {
        playerRef.current.contentWindow.postMessage(
          JSON.stringify({
            event: 'command',
            func: 'seekTo',
            args: [newTime, true]
          }), '*'
        );
      } else if (platform === 'vimeo') {
        playerRef.current.contentWindow.postMessage(
          JSON.stringify({
            method: 'setCurrentTime',
            value: newTime
          }), '*'
        );
      }
    }
  };
  
  const handleProgressDragStart = (e: React.MouseEvent) => {
    setIsUserSeeking(true);
    document.addEventListener('mousemove', handleProgressDragMove);
    document.addEventListener('mouseup', handleProgressDragEnd);
    // 立即定位播放頭到當前位置
    handleProgressDragMove(e);
  };
  
  const handleProgressDragMove = (e: MouseEvent | React.MouseEvent) => {
    if (!progressRef.current || !duration) return;
    
    const rect = progressRef.current.getBoundingClientRect();
    const position = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const newTime = position * duration;
    
    setCurrentTime(newTime);
    
    // 實時視覺更新，但不立即發送跳轉命令到播放器
    // 這樣可以平滑地預覽進度條的位置，而不會頻繁地改變視頻播放位置
  };
  
  const handleProgressDragEnd = (e: MouseEvent | React.MouseEvent) => {
    setIsUserSeeking(false);
    document.removeEventListener('mousemove', handleProgressDragMove);
    document.removeEventListener('mouseup', handleProgressDragEnd);
    
    // 拖動結束後設置最終位置
    if (!progressRef.current || !duration) return;
    
    const rect = progressRef.current.getBoundingClientRect();
    const position = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const newTime = position * duration;
    
    // 發送消息到iframe來更新播放位置
    if (playerRef.current && playerRef.current.contentWindow) {
      if (platform === 'youtube') {
        playerRef.current.contentWindow.postMessage(
          JSON.stringify({
            event: 'command',
            func: 'seekTo',
            args: [newTime, true]
          }), '*'
        );
      } else if (platform === 'vimeo') {
        playerRef.current.contentWindow.postMessage(
          JSON.stringify({
            method: 'setCurrentTime',
            value: newTime
          }), '*'
        );
      }
    }
  };
  
  const embedUrl = getEmbedUrl(platform, videoId);
  const thumbnail = getThumbnail();
  
  // 清理定时器
  useEffect(() => {
    return () => {
      if (controlsTimerRef.current) {
        clearTimeout(controlsTimerRef.current);
      }
      if (autoPlayTimerRef.current) {
        clearTimeout(autoPlayTimerRef.current);
      }
    };
  }, []);
  
  return (
    <div 
      ref={containerRef}
      className="relative aspect-video bg-gray-900 rounded-t-kawaii overflow-hidden"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
    >
      {/* 视频播放器或缩略图 */}
      {isPlaying && embedUrl ? (
        <iframe
          ref={playerRef}
          src={embedUrl}
          className="absolute inset-0 w-full h-full"
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          frameBorder="0"
        />
      ) : (
        <div 
          className="absolute inset-0 w-full cursor-pointer touch-manipulation"
          onClick={previewMode ? togglePlay : undefined}
        >
          <img
            src={thumbnail}
            alt={title}
            className="w-full h-full object-cover"
            draggable="false"
          />
          
          {/* 播放按钮覆盖层 - 只在鼠標懸停時顯示 */}
          {isHovering && (
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center animate-fade-in">
              <div className="w-16 h-16 bg-primary-500/80 rounded-full flex items-center justify-center 
                            transform transition-transform duration-200 hover:scale-110">
                <Play className="w-8 h-8 text-white ml-1" />
              </div>
            </div>
          )}
        </div>
      )}
      
      {/* 视频控制栏 */}
      <div 
        className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3
                  transform transition-all duration-300
                  ${showControls ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
      >
        {/* 进度条 */}
        {previewMode && (
          <div 
            ref={progressRef}
            className="video-progress-bar"
            onClick={handleProgressClick}
            onMouseDown={handleProgressDragStart}
          >
            <div 
              className="progress-fill"
              style={{ width: `${duration ? (currentTime / duration * 100) : 0}%` }}
            />
            {/* 播放頭指示器 */}
            <div 
              className={`progress-handle ${isUserSeeking ? 'active' : ''}`}
              style={{ left: `calc(${duration ? (currentTime / duration * 100) : 0}% - 6px)` }}
            />
          </div>
        )}

        <div className="flex items-center justify-between text-white">
          <div className="flex items-center space-x-3">
            <button 
              onClick={togglePlay}
              className="p-1.5 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
            >
              {isPlaying ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="6" y="4" width="4" height="16"></rect>
                  <rect x="14" y="4" width="4" height="16"></rect>
                </svg>
              ) : (
                <Play className="w-4 h-4 ml-0.5" />
              )}
            </button>
            
            <button
              onClick={toggleMute}
              className="p-1.5 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
            
            {/* 顯示當前時間 */}
            {previewMode && duration && (
              <span className="text-xs">
                {formatDuration(currentTime)}/{formatDuration(duration)}
              </span>
            )}
          </div>
          
          <div className="flex items-center space-x-3">
            {!previewMode && duration && (
              <span className="text-xs">{formatDuration(duration)}</span>
            )}
            
            <button
              onClick={toggleFullscreen}
              className="p-1.5 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
            >
              <Maximize className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;