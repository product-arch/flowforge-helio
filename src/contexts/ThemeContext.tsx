import React, { createContext, useContext, useState, useEffect } from 'react';

export type Theme = 'blue' | 'emerald' | 'purple' | 'orange' | 'rose' | 'indigo' | 'solarized-osaka' | 'monochrome';
export type Mode = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  mode: Mode;
  setTheme: (theme: Theme) => void;
  setMode: (mode: Mode) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// eslint-disable-next-line react-refresh/only-export-components
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>('blue');
  const [mode, setModeState] = useState<Mode>('light');

  // Load theme from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('hub-theme') as Theme;
    const savedMode = localStorage.getItem('hub-mode') as Mode;
    
    if (savedTheme && ['blue', 'emerald', 'purple', 'orange', 'rose', 'indigo', 'solarized-osaka', 'monochrome'].includes(savedTheme)) {
      setThemeState(savedTheme);
    }
    
    if (savedMode && ['light', 'dark'].includes(savedMode)) {
      setModeState(savedMode);
    }
  }, []);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem('hub-theme', newTheme);
  };

  const setMode = (newMode: Mode) => {
    setModeState(newMode);
    localStorage.setItem('hub-mode', newMode);
  };

  useEffect(() => {
    const root = document.documentElement;
    
    // Remove all theme classes
    root.classList.remove('blue', 'emerald', 'purple', 'orange', 'rose', 'indigo', 'solarized-osaka', 'monochrome');
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
    
    // Add mode class for theme-specific styling
    root.classList.add(mode);
  }, [theme, mode]);

  return (
    <ThemeContext.Provider value={{ theme, mode, setTheme, setMode }}>
      {children}
    </ThemeContext.Provider>
  );
};