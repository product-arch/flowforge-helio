import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Zap } from 'lucide-react';

interface IslandNavbarProps {
  onSignInClick?: () => void;
  onScheduleDemoClick?: () => void;
}

export const IslandNavbar: React.FC<IslandNavbarProps> = ({
  onSignInClick,
  onScheduleDemoClick
}) => {
  return (
    <motion.header 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="sticky top-0 z-50 pt-4"
    >
      <div className="container mx-auto px-6">
        <div className="bg-card/80 backdrop-blur-xl border border-border/50 rounded-2xl shadow-lg shadow-black/5 px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/80 rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
                Hub
              </h1>
            </div>
            
            {/* Action Buttons */}
            <div className="flex items-center gap-3">
              <Button 
                variant="ghost" 
                className="text-sm font-medium"
                onClick={onSignInClick}
              >
                Sign In
              </Button>
              <Button 
                className="bg-gradient-primary hover:opacity-90 text-sm font-medium px-6"
                onClick={onScheduleDemoClick}
              >
                Schedule a Demo
              </Button>
            </div>
          </div>
        </div>
      </div>
    </motion.header>
  );
};