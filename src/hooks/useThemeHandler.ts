import { useTheme } from '@/contexts/ThemeContext';
import { useToast } from '@/hooks/use-toast';
import { THEMES, Theme } from '@/constants/themes';

export const useThemeHandler = () => {
  const { theme, mode, setTheme, setMode } = useTheme();
  const { toast } = useToast();

  const handleThemeChange = (newTheme: Theme) => {
    setTheme(newTheme);
    const themeName = THEMES.find(t => t.value === newTheme)?.name || 'Unknown';
    toast({
      title: "Theme Changed",
      description: `Switched to ${themeName}`,
      className: "border-status-success bg-status-success/10 text-status-success"
    });
  };

  const toggleMode = () => {
    const newMode = mode === 'light' ? 'dark' : 'light';
    setMode(newMode);
    toast({
      title: `${newMode === 'dark' ? 'Dark' : 'Light'} Mode Enabled`,
      description: `Switched to ${newMode} mode`,
      className: "border-status-info bg-status-info/10 text-status-info"
    });
  };

  return {
    theme,
    mode,
    setTheme,
    setMode,
    handleThemeChange,
    toggleMode,
    themes: THEMES
  };
};