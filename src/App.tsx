import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Search } from 'lucide-react';
import VideoGrid from './components/VideoGrid';
import HeaderControls from './components/HeaderControls';
import ScrollToTop from './components/ScrollToTop';
import Logo from './components/Logo';
import VideoPage from './pages/VideoPage';
import SortControl, { SortOption } from './components/SortControl';
import { Video } from './types';
import { supabase } from './lib/supabaseClient';
import { useTranslation } from './hooks/useTranslation';

function App() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [sortBy, setSortBy] = useState<SortOption>('date');
  const { t } = useTranslation();
  
  const videosPerPage = 24;

  const loadVideos = async (pageNumber: number) => {
    try {
      setIsLoading(true);
      const from = (pageNumber - 1) * videosPerPage;
      const to = from + videosPerPage - 1;

      let query = supabase
        .from('videos')
        .select('*')
        .range(from, to);

      // Apply sorting
      switch (sortBy) {
        case 'title':
          query = query.order('title', { ascending: true });
          break;
        case 'likes':
          query = query.order('likes_count', { ascending: false });
          break;
        case 'date':
        default:
          query = query.order('created_at', { ascending: false });
      }

      const { data, error } = await query;

      if (!error) {
        if (pageNumber === 1) {
          setVideos(data || []);
        } else {
          setVideos(prev => [...prev, ...(data || [])]);
        }
        setHasMore((data || []).length === videosPerPage);
      } else {
        console.warn('Error fetching videos:', error.message);
      }
    } catch (error) {
      console.warn('Error loading videos:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setPage(1);
    loadVideos(1);
  }, [sortBy]);

  const handleLoadMore = () => {
    if (hasMore && !isLoading) {
      setPage(prev => prev + 1);
      loadVideos(page + 1);
    }
  };

  const filteredVideos = videos.filter(video =>
    video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    video.creator.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Router>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="parallax-bg" />
        
        {/* Header */}
        <header className="sticky top-0 z-50 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <Logo className="animate-fade-in -ml-3" />
              <div className="flex items-center space-x-6">
                <div className="relative w-64">
                  <input
                    type="text"
                    placeholder={t('searchPlaceholder')}
                    className="input pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400 dark:text-gray-300" />
                </div>
                <SortControl currentSort={sortBy} onSortChange={setSortBy} />
                <HeaderControls />
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Routes>
            <Route path="/video/:videoId" element={<VideoPage />} />
            <Route
              path="/"
              element={
                isLoading && videos.length === 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6">
                    {[...Array(8)].map((_, i) => (
                      <div key={i} className="card animate-pulse">
                        <div className="aspect-video bg-gray-200 dark:bg-gray-700 skeleton" />
                        <div className="p-6 space-y-3">
                          <div className="h-6 w-3/4 bg-gray-200 dark:bg-gray-700 rounded skeleton" />
                          <div className="h-4 w-1/2 bg-gray-200 dark:bg-gray-700 rounded skeleton" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <VideoGrid 
                    videos={filteredVideos}
                    onLoadMore={handleLoadMore}
                    hasMore={hasMore && !searchTerm}
                  />
                )
              }
            />
          </Routes>
        </main>

        <ScrollToTop />
      </div>
    </Router>
  );
}

export default App;