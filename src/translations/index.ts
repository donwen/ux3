// Language definitions
export type Language = 'en' | 'zh';

export const SUPPORTED_LANGUAGES: Record<Language, string> = {
  en: 'English',
  zh: '中文'
};

// Translation keys type
export type TranslationKey = keyof typeof translations.en;

// Helper function for message formatting
export function formatMessage(message: string, values?: Record<string, string | number>): string {
  if (!values) return message;
  return Object.entries(values).reduce(
    (acc, [key, value]) => acc.replace(`{${key}}`, String(value)),
    message
  );
}

// Video title translations
export const videoTitleTranslations: Record<string, { en: string; zh: string }> = {
  'Getting Started with UX Design': {
    en: 'Getting Started with UX Design',
    zh: 'UX 設計入門'
  },
  'User Research Methods': {
    en: 'User Research Methods',
    zh: '使用者研究方法'
  },
  'Prototyping Best Practices': {
    en: 'Prototyping Best Practices',
    zh: '原型設計最佳實踐'
  },
  'Design Systems Workshop': {
    en: 'Design Systems Workshop',
    zh: '設計系統工作坊'
  },
  'Usability Testing Guide': {
    en: 'Usability Testing Guide',
    zh: '可用性測試指南'
  }
};

// Translations object
export const translations = {
  en: {
    title: 'UX3 Midterm Case Studies',
    searchPlaceholder: 'Search videos...',
    connectionWarning: 'Please click the "Connect to Supabase" button in the top right corner to set up your database connection.',
    views: 'views',
    likes: 'likes',
    uploadDate: 'Upload date',
    creator: 'Creator',
    page: 'Page',
    darkMode: 'Toggle dark mode',
    lightMode: 'Toggle light mode',
    language: 'Change language',
    watchVideo: 'Watch video',
    loading: 'Loading...',
    error: 'An error occurred',
    retry: 'Retry',
    noResults: 'No videos found',
    viewsCount: '{count} views',
    likesCount: '{count} likes',
    uploadVideo: 'Upload Video',
    settings: 'Settings',
    profile: 'Profile',
    logout: 'Logout',
    sortByDate: 'Sort by Date',
    sortByTitle: 'Sort by Title',
    sortByLikes: 'Sort by Likes',
    shareVideo: 'Share Video',
    linkCopied: 'Link copied!',
    share: 'Share',
    copyShareLink: 'Copy this link to share:',
    preview: 'Preview',
    scrollForMore: 'Scroll for more',
    goBack: 'Go back',
    description: 'Description',
    comments: 'Comments',
    readMore: 'Read more',
    showLess: 'Show less',
    readArticle: 'Read article',
    like: 'Like'
  },
  zh: {
    title: 'UX3 期中報告案例影片',
    searchPlaceholder: '搜尋影片...',
    connectionWarning: '請點擊右上角的 "Connect to Supabase" 按鈕來設置資料庫連接。',
    views: '觀看次數',
    likes: '喜歡',
    uploadDate: '上傳日期',
    creator: '創作者',
    page: '頁面',
    darkMode: '切換深色模式',
    lightMode: '切換淺色模式',
    language: '切換語言',
    watchVideo: '觀看影片',
    loading: '載入中...',
    error: '發生錯誤',
    retry: '重試',
    noResults: '找不到影片',
    viewsCount: '{count} 次觀看',
    likesCount: '{count} 個喜歡',
    uploadVideo: '上傳影片',
    settings: '設定',
    profile: '個人檔案',
    logout: '登出',
    sortByDate: '依日期排序',
    sortByTitle: '依標題排序',
    sortByLikes: '依喜歡數排序',
    shareVideo: '分享影片',
    linkCopied: '已複製連結！',
    share: '分享',
    copyShareLink: '複製此連結以分享：',
    preview: '預覽',
    scrollForMore: '下滑載入更多',
    goBack: '返回',
    description: '詳細描述',
    comments: '評論',
    readMore: '閱讀更多',
    showLess: '收起',
    readArticle: '閱讀文章',
    like: '喜歡'
  }
} as const;