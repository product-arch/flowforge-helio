import { cn } from '@/lib/utils';

export const nodeBaseClasses = {
  container: (selected: boolean, hasConfiguration: boolean) => cn(
    "relative group bg-card border-2 rounded-lg shadow-lg transition-all duration-200 hover:shadow-xl",
    selected ? "border-primary shadow-primary/20" : "border-primary/50",
    hasConfiguration ? "p-3 min-w-[160px] max-w-[200px]" : "p-2 w-[120px]"
  ),
  
  deleteButton: "absolute -top-2 -right-2 w-6 h-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-full",
  
  configButton: "absolute -bottom-2 -right-2 w-6 h-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity bg-primary text-primary-foreground hover:bg-primary/90 rounded-full",
  
  header: "flex items-center gap-2 mb-2",
  
  iconContainer: (hasConfiguration: boolean) => cn(
    "rounded-md bg-primary/10",
    hasConfiguration ? "p-1.5" : "p-1"
  ),
  
  icon: (hasConfiguration: boolean) => cn(
    "text-primary",
    hasConfiguration ? "w-4 h-4" : "w-3 h-3"
  ),
  
  title: (hasConfiguration: boolean) => cn(
    hasConfiguration ? "text-sm font-medium truncate text-primary" : "font-medium text-xs text-primary"
  ),
  
  subtitle: "text-xs text-muted-foreground truncate",
  
  unconfiguredNotice: "text-center mb-2",
  unconfiguredText: "text-xs text-muted-foreground",
  
  configurationDetails: "space-y-2 mb-3",
  configBlock: "bg-accent/30 rounded p-2",
  configBlockHeader: "flex items-center justify-between",
  configBlockTitle: "text-xs font-medium",
  configBlockContent: "text-xs text-muted-foreground mt-1 truncate",
  
  vendorChip: "text-xs bg-primary/10 px-1 py-0.5 rounded",
  
  fallbackIndicator: "bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded p-1",
  fallbackText: "text-xs text-blue-700 dark:text-blue-400 font-medium"
};

export const badgeVariants = {
  templateType: {
    text: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
    media: 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400',
    interactive: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
    authentication: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
  },
  
  voiceType: {
    'text-to-speech': 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
    'pre-recorded': 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
    'interactive': 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400'
  },
  
  spilloverMode: {
    capacity_based: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
    performance_based: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
    cost_based: 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400',
    geographic: 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400',
    time_based: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
  }
};

export const handleClasses = {
  invisible: "w-3 h-3 opacity-0",
  visible: "w-3 h-3",
  connectionDot: "w-2 h-2 bg-primary border-2 border-background rounded-full opacity-60 hover:opacity-100 hover:scale-125 transition-all duration-200 shadow-sm",
  connectionDotActive: "w-2 h-2 bg-primary border-2 border-background rounded-full opacity-100 scale-110 shadow-md"
};