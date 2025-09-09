export type Theme = 'blue' | 'emerald' | 'purple' | 'orange' | 'rose' | 'indigo' | 'solarized-osaka' | 'monochrome';

export const THEMES = [
  {
    name: 'Blue',
    value: 'blue' as const,
    description: 'Classic blue theme',
    preview: 'bg-blue-500'
  },
  {
    name: 'Emerald',
    value: 'emerald' as const,
    description: 'Fresh emerald green',
    preview: 'bg-emerald-500'
  },
  {
    name: 'Purple',
    value: 'purple' as const,
    description: 'Royal purple theme',
    preview: 'bg-purple-500'
  },
  {
    name: 'Orange',
    value: 'orange' as const,
    description: 'Vibrant orange theme',
    preview: 'bg-orange-500'
  },
  {
    name: 'Rose',
    value: 'rose' as const,
    description: 'Elegant rose theme',
    preview: 'bg-rose-500'
  },
  {
    name: 'Indigo',
    value: 'indigo' as const,
    description: 'Deep indigo theme',
    preview: 'bg-indigo-500'
  },
  {
    name: 'Solarized Osaka',
    value: 'solarized-osaka' as const,
    description: 'Solarized color scheme',
    preview: 'bg-yellow-600'
  },
  {
    name: 'Monochrome',
    value: 'monochrome' as const,
    description: 'Black and white theme',
    preview: 'bg-gray-900'
  }
] as const;