
import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { Crown } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';

interface SubscriptionBadgeProps {
  className?: string;
  showLabel?: boolean;
}

const SubscriptionBadge: React.FC<SubscriptionBadgeProps> = ({ 
  className = '',
  showLabel = true
}) => {
  const { isAuthenticated, isPro, subscription } = useAuth();
  
  if (!isAuthenticated) {
    return null;
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Link 
            to="/subscribe"
            className={cn(
              "flex items-center gap-1.5 px-2.5 py-1 rounded-full transition-colors", 
              isPro 
                ? "bg-gradient-to-r from-purple-500/20 to-blue-500/20 text-purple-700 dark:text-purple-300 hover:from-purple-500/30 hover:to-blue-500/30" 
                : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700",
              className
            )}
          >
            <Crown 
              className={cn(
                "h-4 w-4", 
                isPro ? "text-purple-500" : "text-gray-500"
              )} 
            />
            {showLabel && (
              <span className="text-xs font-medium">
                {isPro ? 'Pro' : 'Free'}
              </span>
            )}
          </Link>
        </TooltipTrigger>
        <TooltipContent>
          {isPro 
            ? (
              <div className="text-center">
                <p className="font-medium">Pro Plan Active</p>
                {subscription?.expiresAt && (
                  <p className="text-xs text-muted-foreground">
                    Renews on {subscription.expiresAt.toLocaleDateString()}
                  </p>
                )}
              </div>
            )
            : "Upgrade to Pro for advanced diabetes features"
          }
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default SubscriptionBadge;
