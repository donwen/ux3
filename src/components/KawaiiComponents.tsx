import React, { useState, useEffect } from 'react';

// 可愛氣泡按鈕
export const KawaiiBubbleButton: React.FC<{
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  color?: 'pink' | 'mint' | 'peach' | 'lavender' | 'sky' | 'yellow';
}> = ({ children, onClick, className = '', color = 'pink' }) => {
  const [isPressed, setIsPressed] = useState(false);
  
  const colorClasses = {
    pink: 'bg-kawaii-pink text-white hover:bg-kawaii-pink/90',
    mint: 'bg-kawaii-mint text-primary-800 hover:bg-kawaii-mint/90',
    peach: 'bg-kawaii-peach text-primary-800 hover:bg-kawaii-peach/90',
    lavender: 'bg-kawaii-lavender text-primary-800 hover:bg-kawaii-lavender/90',
    sky: 'bg-kawaii-sky text-primary-800 hover:bg-kawaii-sky/90',
    yellow: 'bg-kawaii-yellow text-primary-800 hover:bg-kawaii-yellow/90',
  };
  
  return (
    <button
      onClick={onClick}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onMouseLeave={() => isPressed && setIsPressed(false)}
      className={`${colorClasses[color]} font-kawaii px-5 py-3 rounded-kawaii
                 transition-all duration-200 transform
                 ${isPressed ? 'translate-y-1 shadow-sm scale-95' : 'shadow-kawaii hover:-translate-y-1'}
                 ${className}`}
    >
      {children}
    </button>
  );
};

// 可愛氣泡標籤
export const KawaiiBadge: React.FC<{
  children: React.ReactNode;
  color?: 'pink' | 'mint' | 'peach' | 'lavender' | 'sky' | 'yellow';
  className?: string;
}> = ({ children, color = 'pink', className = '' }) => {
  const colorClasses = {
    pink: 'bg-kawaii-pink/20 text-primary-700 border-kawaii-pink/30',
    mint: 'bg-kawaii-mint/20 text-primary-700 border-kawaii-mint/30',
    peach: 'bg-kawaii-peach/20 text-primary-700 border-kawaii-peach/30',
    lavender: 'bg-kawaii-lavender/20 text-primary-700 border-kawaii-lavender/30',
    sky: 'bg-kawaii-sky/20 text-primary-700 border-kawaii-sky/30',
    yellow: 'bg-kawaii-yellow/20 text-primary-700 border-kawaii-yellow/30',
  };
  
  return (
    <span className={`kawaii-badge ${colorClasses[color]} ${className}`}>
      {children}
    </span>
  );
};

// 可愛氣泡卡片
export const KawaiiCard: React.FC<{
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}> = ({ children, className = '', hover = true }) => {
  return (
    <div className={`card ${hover ? 'group hover:scale-[1.02]' : ''} ${className}`}>
      {children}
    </div>
  );
};

// 可愛提示框
export const KawaiiTooltip: React.FC<{
  children: React.ReactNode;
  tooltip: string;
  className?: string;
}> = ({ children, tooltip, className = '' }) => {
  return (
    <div className={`kawaii-tooltip ${className}`} data-tooltip={tooltip}>
      {children}
    </div>
  );
};

// 可愛開關
export const KawaiiToggle: React.FC<{
  isChecked: boolean;
  onChange: () => void;
  className?: string;
}> = ({ isChecked, onChange, className = '' }) => {
  return (
    <button
      onClick={onChange}
      className={`relative w-12 h-6 rounded-full transition-all duration-300 ${className}
                 ${isChecked ? 'bg-primary-500' : 'bg-gray-300 dark:bg-gray-600'}`}
    >
      <span 
        className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-md
                   transition-all duration-300 transform
                   ${isChecked ? 'translate-x-6 animate-jelly' : ''}`}
      />
    </button>
  );
};

// 可愛加載動畫
export const KawaiiLoading: React.FC<{
  className?: string;
}> = ({ className = '' }) => {
  return (
    <div className={`flex items-center justify-center space-x-1 ${className}`}>
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className={`w-3 h-3 rounded-full bg-primary-500 animate-bounce`}
          style={{ animationDelay: `${i * 0.1}s` }}
        />
      ))}
    </div>
  );
};

// 可愛浮動元素
export const KawaiiFloatingElement: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = '' }) => {
  return (
    <div className={`animate-float ${className}`}>
      {children}
    </div>
  );
};

// 可愛彈出效果
export const KawaiiPopIn: React.FC<{
  children: React.ReactNode;
  show: boolean;
  className?: string;
}> = ({ children, show, className = '' }) => {
  return (
    <div className={`transition-all duration-300 transform ${className}
                    ${show ? 'scale-100 opacity-100 animate-pop' : 'scale-0 opacity-0'}`}>
      {children}
    </div>
  );
};

export default {
  KawaiiBubbleButton,
  KawaiiBadge,
  KawaiiCard,
  KawaiiTooltip,
  KawaiiToggle,
  KawaiiLoading,
  KawaiiFloatingElement,
  KawaiiPopIn
}; 