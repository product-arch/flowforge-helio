import React, { createContext, useContext, useState, useEffect } from 'react';

export type Theme = 'blue' | 'emerald' | 'purple' | 'orange' | 'rose' | 'indigo';
export type Mode = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  mode: Mode;
  setTheme: (theme: Theme) => void;
  setMode: (mode: Mode) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>('blue');
  const [mode, setMode] = useState<Mode>('light');

  useEffect(() => {
    const root = document.documentElement;
    
    // Remove all theme classes
    root.classList.remove('blue', 'emerald', 'purple', 'orange', 'rose', 'indigo');
    root.classList.remove('light', 'dark');
    
    // Add current theme and mode
    if (theme !== 'blue') {
      root.setAttribute('data-theme', theme);
    } else {
      root.removeAttribute('data-theme');
    }
    
    if (mode === 'dark') {
      root.classList.add('dark');
    }
  }, [theme, mode]);

  return (
    <ThemeContext.Provider value={{ theme, mode, setTheme, setMode }}>
      {children}
    </ThemeContext.Provider>
  );
};