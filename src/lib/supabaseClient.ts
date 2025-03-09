import { createClient } from '@supabase/supabase-js';
import sampleVideos from '../data/sampleVideos'; // 導入示例視頻數據

// 檢查是否在GitHub Pages環境中運行
const isGitHubPages = window.location.hostname.includes('github.io');

// 如果在GitHub Pages中，直接使用本地數據
let supabase;

if (isGitHubPages) {
  console.info('檢測到GitHub Pages環境，直接使用本地數據');
  // 創建一個模擬的Supabase客戶端
  supabase = {
    from: () => ({
      select: () => ({
        order: () => ({
          range: () => new Promise(resolve => resolve({ data: sampleVideos, error: null })),
          then: (callback) => callback({ data: sampleVideos, error: null }),
        }),
        then: (callback) => callback({ data: sampleVideos, error: null }),
        count: () => new Promise(resolve => resolve({ count: sampleVideos.length, error: null })),
      }),
      insert: () => new Promise(resolve => resolve({ error: null })),
    }),
  };
} else {
  // 在本地開發環境中使用真實的Supabase
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://public-data-yicqaqyuyq-df.a.run.app';
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'public-access-only';
  supabase = createClient(supabaseUrl, supabaseAnonKey);
}

export { supabase };

// 測試連接並在控制台輸出結果
supabase.from('videos').select('count', { count: 'exact' }).then(
  ({ count, error }) => {
    if (error) {
      console.warn('Supabase連接錯誤:', error.message);
      console.info('將使用本地示例數據作為後備選項');
    } else {
      console.info(`Supabase連接成功，數據庫中有 ${count} 條視頻記錄`);
    }
  }
).catch(err => {
  console.warn('Supabase連接嘗試失敗:', err.message);
});

// 提供後備方法，在任何情況下都能獲取數據
export const getVideosWithFallback = async (options = {}) => {
  if (isGitHubPages) {
    // 在GitHub Pages中直接返回示例數據
    console.info('使用本地示例數據');
    return sampleVideos;
  }
  
  try {
    // 嘗試從Supabase獲取數據
    const { data, error } = await supabase
      .from('videos')
      .select('*')
      .order('created_at', { ascending: false });
    
    // 如果成功，返回API數據
    if (!error && data) {
      return data;
    }
    
    // 如果有錯誤，拋出以便使用後備數據
    throw new Error(error?.message || 'Failed to fetch from API');
  } catch (error) {
    console.warn('使用後備視頻數據:', error);
    // 返回示例數據作為後備
    return sampleVideos;
  }
};