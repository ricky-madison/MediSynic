
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Pill, 
  FileText, 
  ChevronRight,
  ClipboardList,
} from 'lucide-react';
import { useUserData } from '@/context/UserDataContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const QuickActions = () => {
  const navigate = useNavigate();
  const { userData } = useUserData();
  
  const actions = [
    {
      title: 'Health Assessment',
      description: 'Update your health profile',
      icon: <FileText className="h-5 w-5 text-indigo-500" />,
      path: '/form',
      color: 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300'
    },
    {
      title: 'Recommendations',
      description: 'View your health insights',
      icon: <ClipboardList className="h-5 w-5 text-emerald-500" />,
      path: '/recommendations',
      color: 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300'
    },
    {
      title: 'Medications',
      description: 'Manage your medications',
      icon: <Pill className="h-5 w-5 text-purple-500" />,
      path: '/medications',
      color: 'bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300'
    }
  ];
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
      {actions.map((action, index) => (
        <Card 
          key={index}
          className="border shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden"
        >
          <CardContent className="p-0">
            <Button
              variant="ghost" 
              onClick={() => navigate(action.path)}
              className={`w-full h-full text-left flex items-center p-4 ${action.color} hover:opacity-90`}
            >
              <div className="mr-4 bg-white/70 dark:bg-gray-800/70 p-2.5 rounded-lg shadow-sm">
                {action.icon}
              </div>
              <div className="flex-1">
                <h3 className="font-medium">{action.title}</h3>
                <p className="text-sm opacity-80">{action.description}</p>
              </div>
              <ChevronRight className="h-4 w-4 opacity-50" />
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default QuickActions;
