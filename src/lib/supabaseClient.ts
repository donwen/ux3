import { createClient } from '@supabase/supabase-js';
import sampleVideos from '../data/sampleVideos'; // 導入示例視頻數據

// 生產環境中使用環境變量或回退到模擬API
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://public-data-yicqaqyuyq-df.a.run.app';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'public-access-only';

if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
  console.warn('Supabase credentials not found. Please click "Connect to Supabase" button to set up your database connection.');
}

// 創建Supabase客戶端
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

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

// 提供後備方法，在API失敗時使用本地數據
export const getVideosWithFallback = async (options = {}) => {
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