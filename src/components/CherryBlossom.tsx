import React from 'react';

interface CherryBlossomProps {
  size?: number | string;
  color?: string;
  strokeWidth?: number;
  className?: string;
}

const CherryBlossom: React.FC<CherryBlossomProps> = ({
  size = 24,
  color = 'currentColor',
  strokeWidth = 2,
  className = '',
  ...props
}) => {
  // 計算顏色陰影和深度
  const darkColor = typeof color === 'string' && color.startsWith('#') 
    ? color.replace(/^#/, '#d')
    : 'rgba(255, 105, 180, 0.8)';
  
  const centerColor = typeof color === 'string' && color.startsWith('#')
    ? color.replace(/^#/, '#f')
    : 'rgba(255, 230, 120, 0.9)';

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      {/* 更簡單明確的櫻花形狀 - 正面視圖 */}
      {/* 五個主要花瓣 */}
      <path d="M12 3 L14 8 L12 12 L10 8 Z" fill={color} />
      <path d="M12 21 L14 16 L12 12 L10 16 Z" fill={color} />
      <path d="M3 12 L8 14 L12 12 L8 10 Z" fill={color} />
      <path d="M21 12 L16 14 L12 12 L16 10 Z" fill={color} />
      
      {/* 四個對角花瓣 */}
      <path d="M5.5 5.5 L9 8 L12 12 L8 9 Z" fill={color} />
      <path d="M18.5 5.5 L16 8 L12 12 L15 9 Z" fill={color} />
      <path d="M5.5 18.5 L9 16 L12 12 L8 15 Z" fill={color} />
      <path d="M18.5 18.5 L16 16 L12 12 L15 15 Z" fill={color} />
      
      {/* 花心 */}
      <circle cx="12" cy="12" r="2.5" fill={centerColor} />
      
      {/* 添加花瓣的輪廓，使其更容易識別 */}
      <path d="M12 3 L14 8 L12 12 L10 8 Z" stroke={darkColor} strokeWidth="0.5" />
      <path d="M12 21 L14 16 L12 12 L10 16 Z" stroke={darkColor} strokeWidth="0.5" />
      <path d="M3 12 L8 14 L12 12 L8 10 Z" stroke={darkColor} strokeWidth="0.5" />
      <path d="M21 12 L16 14 L12 12 L16 10 Z" stroke={darkColor} strokeWidth="0.5" />
      <path d="M5.5 5.5 L9 8 L12 12 L8 9 Z" stroke={darkColor} strokeWidth="0.5" />
      <path d="M18.5 5.5 L16 8 L12 12 L15 9 Z" stroke={darkColor} strokeWidth="0.5" />
      <path d="M5.5 18.5 L9 16 L12 12 L8 15 Z" stroke={darkColor} strokeWidth="0.5" />
      <path d="M18.5 18.5 L16 16 L12 12 L15 15 Z" stroke={darkColor} strokeWidth="0.5" />
    </svg>
  );
};

export default CherryBlossom; 