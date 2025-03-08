import React, { useState } from 'react';
import CherryBlossom from '../components/CherryBlossom';
import CherryBlossomFall from '../components/CherryBlossomFall';

const TestPage: React.FC = () => {
  const [showPetals, setShowPetals] = useState(true);
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-purple-100 flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold mb-8 text-pink-500">櫻花測試頁面</h1>
      
      <div className="mb-8 flex gap-4">
        <button 
          className="px-4 py-2 bg-pink-500 text-white rounded hover:bg-pink-600"
          onClick={() => setShowPetals(true)}
        >
          顯示櫻花
        </button>
        <button 
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          onClick={() => setShowPetals(false)}
        >
          隱藏櫻花
        </button>
      </div>
      
      <div className="border border-pink-200 rounded p-8 bg-white shadow-md">
        <h2 className="text-xl mb-4">櫻花圖標測試</h2>
        <div className="flex gap-4 mb-8">
          <CherryBlossom size={24} color="#ff80bf" />
          <CherryBlossom size={36} color="#ffb3d9" />
          <CherryBlossom size={48} color="#ff99cc" />
          <CherryBlossom size={64} color="#ff66b3" />
        </div>
      </div>
      
      {showPetals && (
        <div className="fixed inset-0 pointer-events-none">
          <CherryBlossomFall count={10} />
        </div>
      )}
    </div>
  );
};

export default TestPage; 