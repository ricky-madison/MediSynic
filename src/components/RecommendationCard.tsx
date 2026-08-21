
import React from 'react';
import { Recommendation } from '@/context/UserDataContext';
import { cn } from '@/lib/utils';
import ProFeatureLock from './ProFeatureLock';
import { 
  Activity, 
  Clipboard, 
  Heart, 
  Brain, 
  Moon, 
  Salad, 
  Droplets, 
  ShieldCheck,
  Bird,
  Dumbbell,
  Apple,
  Pill,
  Clock,
  Sun,
  Eye
} from 'lucide-react';

interface RecommendationCardProps {
  recommendation: Recommendation;
  delay?: number;
  isPro?: boolean;
}

const RecommendationCard: React.FC<RecommendationCardProps> = ({ 
  recommendation,
  delay = 0,
  isPro = false
}) => {
  const { title, description, category, priority, icon } = recommendation;
  
  // Define color schemes based on category with diabetes-specific emphasis
  const categoryStyles = {
    lifestyle: {
      bg: 'bg-blue-50 dark:bg-blue-950/30',
      iconBg: 'bg-blue-100 dark:bg-blue-900/50',
      iconColor: 'text-blue-600 dark:text-blue-400',
      priorityColor: getPriorityColor(priority, 'blue')
    },
    diet: {
      bg: 'bg-green-50 dark:bg-green-950/30',
      iconBg: 'bg-green-100 dark:bg-green-900/50', 
      iconColor: 'text-green-600 dark:text-green-400',
      priorityColor: getPriorityColor(priority, 'green')
    },
    exercise: {
      bg: 'bg-orange-50 dark:bg-orange-950/30',
      iconBg: 'bg-orange-100 dark:bg-orange-900/50',
      iconColor: 'text-orange-600 dark:text-orange-400',
      priorityColor: getPriorityColor(priority, 'orange')
    },
    medical: {
      bg: 'bg-red-50 dark:bg-red-950/30',
      iconBg: 'bg-red-100 dark:bg-red-900/50',
      iconColor: 'text-red-600 dark:text-red-400',
      priorityColor: getPriorityColor(priority, 'red')
    },
    preventive: {
      bg: 'bg-purple-50 dark:bg-purple-950/30',
      iconBg: 'bg-purple-100 dark:bg-purple-900/50',
      iconColor: 'text-purple-600 dark:text-purple-400',
      priorityColor: getPriorityColor(priority, 'purple')
    },
    supplement: {
      bg: 'bg-amber-50 dark:bg-amber-950/30',
      iconBg: 'bg-amber-100 dark:bg-amber-900/50',
      iconColor: 'text-amber-600 dark:text-amber-400',
      priorityColor: getPriorityColor(priority, 'amber')
    }
  };
  
  const styles = categoryStyles[category];
  
  return (
    <div 
      className={cn(
        "card-glass transition-all duration-500 animate-fade-in-up relative",
        styles.bg
      )}
      style={{ 
        animationDelay: `${delay}ms`,
        animationFillMode: 'both' 
      }}
    >
      {isPro && (
        <div className="absolute top-2 right-2">
          <ProFeatureLock 
            feature="Advanced Recommendation" 
            description="Unlock detailed guidance and personalized insights" 
          />
        </div>
      )}
      <div className="flex items-start">
        <div className={cn("p-3 rounded-xl mr-4", styles.iconBg)}>
          {getIcon(icon, cn("w-6 h-6", styles.iconColor))}
        </div>
        <div className="flex-1">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-semibold text-lg text-medical-gray-900 dark:text-white">{title}</h3>
            <span className={cn(
              "chip text-xs px-2 py-0.5",
              styles.priorityColor
            )}>
              {priority.charAt(0).toUpperCase() + priority.slice(1)}
            </span>
          </div>
          <p className="text-medical-gray-600 dark:text-gray-300 text-sm">{description}</p>
          {isPro && (
            <div className="mt-2 p-2 bg-gray-100 dark:bg-gray-800/50 rounded-md backdrop-blur-sm">
              <p className="text-xs text-gray-500 dark:text-gray-400">Additional details available with Pro plan</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Helper function to get the appropriate icon
function getIcon(iconName: string, className: string) {
  const icons: Record<string, React.ReactNode> = {
    Activity: <Activity className={className} />,
    Clipboard: <Clipboard className={className} />,
    Heart: <Heart className={className} />,
    Brain: <Brain className={className} />,
    Moon: <Moon className={className} />,
    Salad: <Salad className={className} />,
    Droplets: <Droplets className={className} />,
    ShieldCheck: <ShieldCheck className={className} />,
    Bird: <Bird className={className} />,
    Dumbbell: <Dumbbell className={className} />,
    Apple: <Apple className={className} />,
    Pill: <Pill className={className} />,
    Clock: <Clock className={className} />,
    Sun: <Sun className={className} />,
    Eye: <Eye className={className} />
  };
  
  return icons[iconName] || <Activity className={className} />;
}

// Helper function to get priority color based on priority level and base color
function getPriorityColor(priority: string, baseColor: string) {
  if (priority === 'high') {
    return `bg-${baseColor}-200 text-${baseColor}-800 dark:bg-${baseColor}-900/50 dark:text-${baseColor}-300`;
  } else if (priority === 'medium') {
    return `bg-${baseColor}-100 text-${baseColor}-700 dark:bg-${baseColor}-900/30 dark:text-${baseColor}-300`;
  } else {
    return `bg-${baseColor}-50 text-${baseColor}-600 dark:bg-${baseColor}-900/20 dark:text-${baseColor}-300`;
  }
}

export default RecommendationCard;
