import React, { createContext, useState, useContext, ReactNode } from 'react';
import CherryBlossomFall from '../components/CherryBlossomFall';

interface CherryBlossomContextType {
  addBlossoms: (count: number) => void;
  totalBlossoms: number;
}

const CherryBlossomContext = createContext<CherryBlossomContextType | undefined>(undefined);

export const useCherryBlossom = () => {
  const context = useContext(CherryBlossomContext);
  if (context === undefined) {
    throw new Error('useCherryBlossom must be used within a CherryBlossomProvider');
  }
  return context;
};

interface CherryBlossomProviderProps {
  children: ReactNode;
}

export const CherryBlossomProvider: React.FC<CherryBlossomProviderProps> = ({ children }) => {
  const [totalBlossoms, setTotalBlossoms] = useState(0);
  const [blossomEvents, setBlossomEvents] = useState<{ id: number; count: number }[]>([]);

  const addBlossoms = (count: number) => {
    const limitedCount = Math.min(Math.max(count, 3), 10);
    const eventId = Date.now();
    
    setTotalBlossoms(prev => prev + limitedCount);
    
    setBlossomEvents(prev => [...prev, { id: eventId, count: limitedCount }]);
    
    setTimeout(() => {
      setBlossomEvents(prev => prev.filter(event => event.id !== eventId));
    }, 4000);
  };

  return (
    <CherryBlossomContext.Provider value={{ addBlossoms, totalBlossoms }}>
      {children}
      <div className="fixed inset-0 pointer-events-none z-40">
        {blossomEvents.map(event => (
          <CherryBlossomFall key={event.id} count={event.count} />
        ))}
      </div>
    </CherryBlossomContext.Provider>
  );
};

export default CherryBlossomProvider; 