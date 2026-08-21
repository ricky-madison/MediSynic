
import React from 'react';
import { Lock } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface ProFeatureLockProps {
  feature: string;
  description?: string;
  className?: string;
  variant?: 'badge' | 'inline' | 'button';
  size?: 'sm' | 'md' | 'lg';
}

const ProFeatureLock: React.FC<ProFeatureLockProps> = ({ 
  feature,
  description = "Upgrade to Pro to unlock this feature",
  className = "",
  variant = "badge",
  size = "md"
}) => {
  // Size classes for different components
  const sizeClasses = {
    sm: {
      badge: "text-[10px] px-1.5 py-0.5 gap-0.5",
      inline: "text-xs",
      button: "text-xs py-1 px-2",
      icon: "h-2.5 w-2.5"
    },
    md: {
      badge: "text-xs px-2 py-0.5 gap-1",
      inline: "text-sm",
      button: "text-sm py-1.5 px-3",
      icon: "h-3 w-3"
    },
    lg: {
      badge: "text-sm px-2.5 py-1 gap-1.5",
      inline: "text-base",
      button: "text-base py-2 px-4",
      icon: "h-4 w-4"
    }
  };

  // Get the appropriate size classes
  const currentSize = sizeClasses[size];

  // Render different variants
  const renderContent = () => {
    switch (variant) {
      case "inline":
        return (
          <span className={`inline-flex items-center gap-1 text-purple-700 dark:text-purple-300 font-medium ${currentSize.inline} ${className}`}>
            <Lock className={currentSize.icon} />
            <span>Pro</span>
          </span>
        );
      
      case "button":
        return (
          <div className={`flex items-center justify-center gap-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-md ${currentSize.button} ${className}`}>
            <Lock className={currentSize.icon} />
            <span>Upgrade to Pro</span>
          </div>
        );
        
      // Default badge variant
      default:
        return (
          <div className={`inline-flex items-center ${currentSize.badge} rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 font-medium ${className}`}>
            <Lock className={currentSize.icon} />
            <span>Pro</span>
          </div>
        );
    }
  };

  return (
    <TooltipProvider>
      <Tooltip delayDuration={300}>
        <TooltipTrigger asChild>
          {renderContent()}
        </TooltipTrigger>
        <TooltipContent side="top" className="max-w-xs">
          <div className="space-y-1">
            <p className="font-medium">{feature}</p>
            <p className="text-xs text-muted-foreground">{description}</p>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default ProFeatureLock;
