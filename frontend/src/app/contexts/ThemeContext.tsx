import React, { createContext, useContext, useState, ReactNode } from 'react';
import { ThemeConfig, themes } from '../themes.config';

interface ThemeContextType {
  currentTheme: ThemeConfig;
  setTheme: (themeId: string) => void;
  themeId: string;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [themeId, setThemeId] = useState<string>('snoopy');

  const setTheme = (id: string) => {
    setThemeId(id);
  };

  const currentTheme = themes[themeId];

  return (
    <ThemeContext.Provider value={{ currentTheme, setTheme, themeId }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};
