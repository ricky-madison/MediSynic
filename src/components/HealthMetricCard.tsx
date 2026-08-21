
import React from 'react';
import { AlertCircle, CheckCircle, AlertTriangle } from 'lucide-react';

interface HealthMetricCardProps {
  title: string;
  value: string;
  status: 'good' | 'attention' | 'warning';
  icon: React.ReactNode;
  color: 'blue' | 'green' | 'orange' | 'purple' | 'red';
}

const HealthMetricCard: React.FC<HealthMetricCardProps> = ({
  title,
  value,
  status,
  icon,
  color
}) => {
  // Define color schemes based on status and color
  const getColorClasses = () => {
    const baseColors = {
      blue: {
        bg: 'bg-blue-50',
        iconBg: 'bg-blue-100',
        iconColor: 'text-blue-600',
        valueColor: 'text-blue-600'
      },
      green: {
        bg: 'bg-green-50',
        iconBg: 'bg-green-100',
        iconColor: 'text-green-600',
        valueColor: 'text-green-600'
      },
      orange: {
        bg: 'bg-orange-50',
        iconBg: 'bg-orange-100',
        iconColor: 'text-orange-600',
        valueColor: 'text-orange-600'
      },
      purple: {
        bg: 'bg-purple-50',
        iconBg: 'bg-purple-100',
        iconColor: 'text-purple-600',
        valueColor: 'text-purple-600'
      },
      red: {
        bg: 'bg-red-50',
        iconBg: 'bg-red-100',
        iconColor: 'text-red-600',
        valueColor: 'text-red-600'
      }
    };
    
    return baseColors[color];
  };
  
  const colors = getColorClasses();
  
  const getStatusIcon = () => {
    switch (status) {
      case 'good':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'attention':
        return <AlertTriangle className="h-5 w-5 text-amber-500" />;
      case 'warning':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      default:
        return null;
    }
  };
  
  return (
    <div className={`card-glass ${colors.bg} p-4 rounded-xl shadow-sm h-full`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <div className={`p-2 rounded-lg mr-3 ${colors.iconBg}`}>
            <span className={colors.iconColor}>{icon}</span>
          </div>
          <h3 className="font-medium text-medical-gray-900">{title}</h3>
        </div>
        <div className="flex-shrink-0">
          {getStatusIcon()}
        </div>
      </div>
      
      <div className="flex items-end justify-between">
        <div className={`text-2xl font-bold ${colors.valueColor}`}>
          {value}
        </div>
        <div className="text-xs text-medical-gray-500 capitalize">
          {status}
        </div>
      </div>
    </div>
  );
};

export default HealthMetricCard;
