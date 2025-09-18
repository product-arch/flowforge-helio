import { cn } from '@/lib/utils';

export const nodeBaseClasses = {
  container: (selected: boolean, hasConfiguration: boolean) => cn(
    "relative group bg-card border rounded-lg transition-all duration-200",
    selected ? "border-primary shadow-sm" : "border-border hover:border-border/60",
    hasConfiguration ? "p-2 min-w-[100px] max-w-[140px]" : "p-2 w-[80px]"
  ),
  
  deleteButton: "absolute -top-1 -right-1 w-4 h-4 p-0 opacity-0 group-hover:opacity-100 transition-opacity bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-full text-xs",
  
  configButton: "absolute -bottom-1 -right-1 w-4 h-4 p-0 opacity-0 group-hover:opacity-100 transition-opacity bg-primary text-primary-foreground hover:bg-primary/90 rounded-full text-xs",
  
  header: "flex items-center gap-1.5 mb-1",
  
  iconContainer: (hasConfiguration: boolean) => cn(
    "rounded bg-primary/10 flex items-center justify-center",
    hasConfiguration ? "p-1" : "p-0.5"
  ),
  
  icon: (hasConfiguration: boolean) => cn(
    "text-primary",
    hasConfiguration ? "w-3 h-3" : "w-2.5 h-2.5"
  ),
  
  title: (hasConfiguration: boolean) => cn(
    hasConfiguration ? "text-xs font-medium truncate text-foreground" : "font-medium text-[10px] text-foreground"
  ),
  
  subtitle: "text-[10px] text-muted-foreground truncate",
  
  unconfiguredNotice: "text-center",
  unconfiguredText: "text-[10px] text-muted-foreground",
  
  configurationDetails: "space-y-1 mb-1",
  configBlock: "bg-muted/30 rounded p-1",
  configBlockHeader: "flex items-center justify-between",
  configBlockTitle: "text-[10px] font-medium",
  configBlockContent: "text-[10px] text-muted-foreground mt-0.5 truncate",
  
  vendorChip: "text-[9px] bg-primary/10 px-1 py-0.5 rounded",
  
  fallbackIndicator: "bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded p-1",
  fallbackText: "text-[10px] text-blue-700 dark:text-blue-400 font-medium"
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
  invisible: "w-2 h-2 opacity-0",
  visible: "w-2 h-2",
  connectionDot: "w-1.5 h-1.5 bg-primary border border-background rounded-full opacity-40 hover:opacity-100 hover:scale-110 transition-all duration-200",
  connectionDotActive: "w-1.5 h-1.5 bg-primary border border-background rounded-full opacity-100 scale-105"
};