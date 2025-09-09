import React from 'react';
import { Palette, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import { useTheme } from '@/contexts/ThemeContext';
import { THEMES } from '@/constants/themes';

interface ThemeSelectorProps {
  variant?: 'ghost' | 'outline' | 'default';
  size?: 'default' | 'sm' | 'lg';
  showLabel?: boolean;
}

export const ThemeSelector: React.FC<ThemeSelectorProps> = ({ 
  variant = 'ghost',
  size = 'default',
  showLabel = false
}) => {
  const { theme, setTheme, mode, setMode } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={variant} size={size} className="gap-2">
          <Palette className="w-4 h-4" />
          {showLabel && 'Theme'}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuLabel>Choose Theme</DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        {/* Mode Selection */}
        <div className="p-2">
          <div className="text-sm font-medium mb-2">Mode</div>
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant={mode === 'light' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setMode('light')}
              className="justify-start gap-2"
            >
              {mode === 'light' && <Check className="w-3 h-3" />}
              Light
            </Button>
            <Button
              variant={mode === 'dark' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setMode('dark')}
              className="justify-start gap-2"
            >
              {mode === 'dark' && <Check className="w-3 h-3" />}
              Dark
            </Button>
          </div>
        </div>

        <DropdownMenuSeparator />

        {/* Theme Selection */}
        <div className="p-2">
          <div className="text-sm font-medium mb-2">Color Scheme</div>
          <div className="space-y-1">
            {THEMES.map((themeOption) => (
              <Button
                key={themeOption.value}
                variant={theme === themeOption.value ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setTheme(themeOption.value)}
                className="w-full justify-start gap-3"
              >
                <div className={`w-4 h-4 rounded-full ${themeOption.preview}`} />
                <div className="flex-1 text-left">
                  <div className="font-medium">{themeOption.name}</div>
                  <div className="text-xs text-muted-foreground">{themeOption.description}</div>
                </div>
                {theme === themeOption.value && <Check className="w-3 h-3" />}
              </Button>
            ))}
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};