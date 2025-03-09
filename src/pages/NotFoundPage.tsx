import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 text-center">
      <h1 className="text-6xl font-bold text-pink-500 mb-6">404</h1>
      <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-200 mb-6">
        頁面未找到
      </h2>
      <p className="text-gray-600 dark:text-gray-300 mb-8 max-w-md">
        您請求的頁面不存在或已被移動。請返回首頁或嘗試其他頁面。
      </p>
      <div className="animate-bounce mb-8">
        <span className="text-4xl">🌸</span>
      </div>
      <Link
        to="/"
        className="px-6 py-2 bg-pink-500 text-white rounded-full hover:bg-pink-600 transition-all duration-300"
      >
        返回首頁
      </Link>
    </div>
  );
};

export default NotFoundPage; 