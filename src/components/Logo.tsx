import React from 'react';
import { useTranslation } from '../hooks/useTranslation';

interface LogoProps {
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ className = '' }) => {
  const { t } = useTranslation();
  
  return (
    <div className={`flex items-center ${className}`}>
      <img
        src="https://i.imgur.com/SMJTt2P.png"
        alt={t('title')}
        className="h-24 w-auto object-contain transition-transform duration-200 hover:scale-105"
        style={{
          imageRendering: 'high-quality',
        }}
      />
    </div>
  );
};

export default Logo;