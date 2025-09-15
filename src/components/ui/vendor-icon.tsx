import React, { useState } from 'react';
import { Building2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface VendorIconProps {
  vendorId: string;
  vendorName: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const sizeClasses = {
  sm: 'h-8 w-8',
  md: 'h-12 w-12',
  lg: 'h-16 w-16'
};

export const VendorIcon: React.FC<VendorIconProps> = ({ 
  vendorId, 
  vendorName, 
  className,
  size = 'md'
}) => {
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const handleImageLoad = () => {
    setIsLoading(false);
    setHasError(false);
  };

  const handleImageError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  if (hasError) {
    return (
      <div className={cn(
        'flex items-center justify-center bg-muted rounded-lg border',
        sizeClasses[size],
        className
      )}>
        <Building2 className="h-1/2 w-1/2 text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className={cn('relative', sizeClasses[size], className)}>
      {isLoading && (
        <div className={cn(
          'absolute inset-0 bg-muted animate-pulse rounded-lg',
          sizeClasses[size]
        )} />
      )}
      <img
        src={`/vendors/${vendorId}.svg`}
        alt={`${vendorName} logo`}
        className={cn(
          'rounded-lg object-contain transition-opacity',
          sizeClasses[size],
          isLoading ? 'opacity-0' : 'opacity-100'
        )}
        onLoad={handleImageLoad}
        onError={handleImageError}
      />
    </div>
  );
};