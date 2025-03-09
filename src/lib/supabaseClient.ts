import { createClient, SupabaseClient } from '@supabase/supabase-js';
import sampleVideos from '../data/sampleVideos'; // 導入示例視頻數據

// 檢查是否在GitHub Pages環境中運行
const isGitHubPages = window.location.hostname.includes('github.io');

// 定義模擬Supabase客戶端類型
interface MockPromise<T> extends Promise<T> {
  catch: (callback: (error: Error) => any) => Promise<any>;
}

// 如果在GitHub Pages中，直接使用本地數據
let supabase: SupabaseClient | any;

if (isGitHubPages) {
  console.info('檢測到GitHub Pages環境，直接使用本地數據');
  
  // 創建模擬Promise
  const createMockPromise = <T>(data: T): MockPromise<T> => {
    const promise = Promise.resolve(data) as MockPromise<T>;
    promise.catch = (callback) => Promise.resolve(data);
    return promise;
  };
  
  // 創建一個模擬的Supabase客戶端
  supabase = {
    from: () => ({
      select: (query?: string, options?: any) => {
        // 處理計數查詢
        if (query === 'count') {
          return createMockPromise({ count: sampleVideos.length, error: null });
        }
        
        return {
          order: () => ({
            range: () => createMockPromise({ data: sampleVideos, error: null }),
          }),
          then: (callback: any) => {
            return callback({ data: sampleVideos, error: null });
          },
        };
      },
      insert: () => createMockPromise({ error: null }),
    }),
  };
} else {
  // 在本地開發環境中使用真實的Supabase
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://public-data-yicqaqyuyq-df.a.run.app';
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'public-access-only';
  supabase = createClient(supabaseUrl, supabaseAnonKey);
}

export { supabase };

// 不再需要嘗試連接測試，直接使用正確的數據源
if (isGitHubPages) {
  console.info(`使用本地示例數據，共有 ${sampleVideos.length} 條視頻記錄`);
} else {
  // 在非GitHub Pages環境中測試連接
  supabase.from('videos').select('count', { count: 'exact' })
    .then((response: { count: number | null, error: any }) => {
      if (response.error) {
        console.warn('Supabase連接錯誤:', response.error.message);
        console.info('將使用本地示例數據作為後備選項');
      } else {
        console.info(`Supabase連接成功，數據庫中有 ${response.count} 條視頻記錄`);
      }
    })
    .catch((err: Error) => {
      console.warn('Supabase連接嘗試失敗:', err.message);
    });
}

// 提供後備方法，在任何情況下都能獲取數據
export const getVideosWithFallback = async (options = {}) => {
  if (isGitHubPages) {
    // 在GitHub Pages中直接返回示例數據
    console.info('使用本地示例數據');
    return sampleVideos;
  }
  
  try {
    // 嘗試從Supabase獲取數據
    const response = await supabase
      .from('videos')
      .select('*')
      .order('created_at', { ascending: false });
    
    // 如果成功，返回API數據
    if (!response.error && response.data) {
      return response.data;
    }
    
    // 如果有錯誤，拋出以便使用後備數據
    throw new Error(response.error?.message || 'Failed to fetch from API');
  } catch (error: any) {
    console.warn('使用後備視頻數據:', error);
    // 返回示例數據作為後備
    return sampleVideos;
  }
};