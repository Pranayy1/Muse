import React, { createContext, useContext } from 'react';

const MusicContext = createContext();

export const useMusic = () => {
  const context = useContext(MusicContext);
  if (!context) {
    throw new Error('useMusic must be used within a MusicProvider');
  }
  return context;
};

export const MusicProvider = ({ children, value }) => {
  return (
    <MusicContext.Provider value={value}>
      {children}
    </MusicContext.Provider>
  );
};
