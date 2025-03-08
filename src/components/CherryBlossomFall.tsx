import React, { useEffect, useState } from 'react';
import CherryBlossom from './CherryBlossom';

interface CherryBlossomFallProps {
  count: number;
}

interface Petal {
  id: number;
  left: number;
  top: number;
  size: number;
  delay: number;
  duration: number;
  rotation: number;
  color: string;
  opacity: number;
}

const CherryBlossomFall: React.FC<CherryBlossomFallProps> = ({ count }) => {
  // 限制櫻花數量
  const actualCount = Math.min(Math.max(count, 3), 10);
  const [petals, setPetals] = useState<Petal[]>([]);

  // 櫻花顏色變化 - 保持柔和顏色
  const colors = [
    '#ffcce6', // 淺粉
    '#ffb3d9', // 粉紅
    '#ff99cc', // 中粉
    '#ff80bf', // 深粉
  ];

  useEffect(() => {
    // 創建新的櫻花花瓣
    const createPetals = () => {
      const newPetals: Petal[] = [];
      
      // 使用適中數量的櫻花
      for (let i = 0; i < actualCount * 3; i++) {
        // 計算隨機的出現位置 - 只在頂部區域
        const left = Math.random() * 100; // 0-100%
        const top = -5; // 頂部上方
        
        // 正常大小的櫻花
        const size = Math.random() * 20 + 10; // 10-30px 
        
        // 隨機延遲，讓出現更自然
        const delay = Math.random() * 2; // 0-2s 延遲
        
        // 動畫時長
        const duration = Math.random() * 3 + 5; // 5-8秒
        
        // 隨機初始旋轉角度
        const rotation = Math.random() * 360;
        
        // 隨機顏色
        const color = colors[Math.floor(Math.random() * colors.length)];
        
        // 透明度
        const opacity = Math.random() * 0.3 + 0.6; // 0.6-0.9

        newPetals.push({
          id: Date.now() + i,
          left,
          top,
          size,
          delay,
          duration,
          rotation,
          color,
          opacity
        });
      }
      
      setPetals(prev => [...prev, ...newPetals]);
      
      // 動畫結束後移除花瓣
      setTimeout(() => {
        setPetals(prev => prev.filter(p => p.id !== newPetals[0].id));
      }, 8000); // 8秒後移除
    };
    
    // 創建花瓣
    createPetals();
    
    // 定期添加新花瓣
    const interval = setInterval(createPetals, 2000); // 每2秒添加一批
    
    return () => clearInterval(interval); // 清理定時器
  }, [actualCount]);

  return (
    <div className="cherry-blossom-container fixed inset-0 pointer-events-none z-40 overflow-hidden">
      {petals.map(petal => (
        <div
          key={petal.id}
          className="cherry-blossom-petal absolute pointer-events-none"
          style={{
            left: `${petal.left}%`,
            top: `${petal.top}%`,
            width: `${petal.size}px`,
            height: `${petal.size}px`,
            opacity: petal.opacity,
            animation: `fall ${petal.duration}s ease-in-out forwards`,
            animationDelay: `${petal.delay}s`,
            transform: `rotate(${petal.rotation}deg)`,
          }}
        >
          <CherryBlossom size={petal.size} color={petal.color} />
        </div>
      ))}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes fall {
          0% { transform: translateY(0) rotate(0deg); opacity: 0; }
          10% { opacity: 1; }
          30% { transform: translateY(30vh) translateX(${Math.random() * 10 - 5}vw) rotate(${Math.random() * 90}deg); }
          60% { transform: translateY(60vh) translateX(${Math.random() * 20 - 10}vw) rotate(${Math.random() * 180}deg); }
          90% { opacity: 0.8; }
          100% { transform: translateY(120vh) translateX(${Math.random() * 30 - 15}vw) rotate(${Math.random() * 360}deg); opacity: 0; }
        }
      `}} />
    </div>
  );
};

export default CherryBlossomFall; 