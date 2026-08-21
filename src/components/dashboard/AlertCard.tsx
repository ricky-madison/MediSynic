
import React from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Bell, AlertTriangle, Calendar, Info } from 'lucide-react';

interface AlertCardProps {
  title: string;
  message: string;
  date?: string;
  time?: string;
  level?: 'info' | 'warning' | 'critical' | 'error' | 'success';
  onViewDetails?: () => void;
  actionLabel?: string;
  secondaryActionLabel?: string;
  onSecondaryAction?: () => void;
}

const AlertCard = ({
  title,
  message,
  date,
  time,
  level = 'info',
  onViewDetails,
  actionLabel = 'View Details',
  secondaryActionLabel,
  onSecondaryAction
}: AlertCardProps) => {
  const getAlertStyles = () => {
    switch (level) {
      case 'critical':
      case 'error':
        return {
          bg: 'bg-red-50 dark:bg-red-900/20',
          border: 'border-red-200 dark:border-red-800',
          iconBg: 'bg-red-100 dark:bg-red-900/40',
          iconColor: 'text-red-600 dark:text-red-400',
          buttonVariant: 'outline' as const,
          buttonClass: 'border-red-200 text-red-700 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-900/30'
        };
      case 'warning':
        return {
          bg: 'bg-amber-50 dark:bg-amber-900/20',
          border: 'border-amber-200 dark:border-amber-800',
          iconBg: 'bg-amber-100 dark:bg-amber-900/40',
          iconColor: 'text-amber-600 dark:text-amber-400',
          buttonVariant: 'outline' as const,
          buttonClass: 'border-amber-200 text-amber-700 hover:bg-amber-50 dark:border-amber-800 dark:text-amber-400 dark:hover:bg-amber-900/30'
        };
      case 'success':
        return {
          bg: 'bg-green-50 dark:bg-green-900/20',
          border: 'border-green-200 dark:border-green-800',
          iconBg: 'bg-green-100 dark:bg-green-900/40',
          iconColor: 'text-green-600 dark:text-green-400',
          buttonVariant: 'outline' as const,
          buttonClass: 'border-green-200 text-green-700 hover:bg-green-50 dark:border-green-800 dark:text-green-400 dark:hover:bg-green-900/30'
        };
      case 'info':
      default:
        return {
          bg: 'bg-blue-50 dark:bg-blue-900/20',
          border: 'border-blue-200 dark:border-blue-800',
          iconBg: 'bg-blue-100 dark:bg-blue-900/40',
          iconColor: 'text-blue-600 dark:text-blue-400',
          buttonVariant: 'outline' as const,
          buttonClass: 'border-blue-200 text-blue-700 hover:bg-blue-50 dark:border-blue-800 dark:text-blue-400 dark:hover:bg-blue-900/30'
        };
    }
  };

  const styles = getAlertStyles();
  
  const renderIcon = () => {
    switch (level) {
      case 'critical':
      case 'error':
        return <AlertTriangle className="h-5 w-5" />;
      case 'warning':
        return <Info className="h-5 w-5" />;
      case 'success':
        return <Bell className="h-5 w-5" />;
      case 'info':
      default:
        return <Bell className="h-5 w-5" />;
    }
  };

  return (
    <Card className={`shadow-sm border ${styles.bg} ${styles.border}`}>
      <CardContent className="p-4">
        <div className="flex items-start">
          <div className={`p-2 rounded-full mr-4 ${styles.iconBg}`}>
            <div className={styles.iconColor}>
              {renderIcon()}
            </div>
          </div>
          <div>
            <h3 className="font-medium text-gray-900 dark:text-gray-100">{title}</h3>
            <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">{message}</p>
            
            {(date || time) && (
              <div className="flex items-center mt-2 text-xs text-gray-600 dark:text-gray-400">
                {date && (
                  <div className="flex items-center mr-3">
                    <Calendar className="h-3.5 w-3.5 mr-1 opacity-70" />
                    {date}
                  </div>
                )}
                {time && time}
              </div>
            )}
          </div>
        </div>
      </CardContent>
      
      {(onViewDetails || onSecondaryAction) && (
        <CardFooter className="pt-0 px-4 pb-4">
          <div className="flex flex-col sm:flex-row gap-2 w-full">
            {onViewDetails && (
              <Button 
                variant={styles.buttonVariant} 
                size="sm" 
                onClick={onViewDetails}
                className={`w-full text-sm mt-2 ${styles.buttonClass}`}
              >
                {actionLabel}
              </Button>
            )}
            
            {onSecondaryAction && secondaryActionLabel && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={onSecondaryAction}
                className="w-full text-sm mt-2"
              >
                {secondaryActionLabel}
              </Button>
            )}
          </div>
        </CardFooter>
      )}
    </Card>
  );
};

export default AlertCard;
