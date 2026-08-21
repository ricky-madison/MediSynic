
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ClipboardCheck, ArrowRight, Activity, Brain, Heart, Pill } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useUserData } from '@/context/UserDataContext';

const StepByStep = () => {
  const navigate = useNavigate();
  const { userData } = useUserData();
  
  // Calculate the percentage of profile completion
  const getCompletionPercentage = () => {
    let totalFields = 0;
    let completedFields = 0;
    
    // Count essential fields
    const essentialFields = [
      'name', 'age', 'sex', 'weight', 'height', 
      'dietType', 'exerciseFrequency', 'sleepHours'
    ];
    
    essentialFields.forEach(field => {
      totalFields++;
      if (userData[field as keyof typeof userData]) {
        completedFields++;
      }
    });
    
    return Math.round((completedFields / totalFields) * 100);
  };
  
  const completionPercentage = getCompletionPercentage();
  
  const getNextAction = () => {
    if (completionPercentage < 100) {
      return {
        text: 'Complete Your Health Profile',
        description: 'Fill in the missing information to get personalized recommendations',
        path: '/form',
        icon: <ClipboardCheck className="h-5 w-5" />
      };
    } else if (!userData.medications || userData.medications.length === 0) {
      return {
        text: 'Add Your Medications',
        description: 'Track your medications and check for potential interactions',
        path: '/dashboard?tab=medications',
        icon: <Pill className="h-5 w-5" />
      };
    } else {
      return {
        text: 'Explore Health Recommendations',
        description: 'View personalized health insights based on your profile',
        path: '/recommendations',
        icon: <Heart className="h-5 w-5" />
      };
    }
  };
  
  const nextAction = getNextAction();
  
  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
      <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Your Next Steps</h2>
      
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Profile Completion</span>
          <span className="text-sm font-medium text-blue-600 dark:text-blue-400">{completionPercentage}%</span>
        </div>
        <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div 
            className="h-full bg-blue-500 rounded-full transition-all duration-500"
            style={{ width: `${completionPercentage}%` }}
          ></div>
        </div>
      </div>
      
      <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg mb-4">
        <div className="flex items-center">
          <div className="p-2 bg-blue-100 dark:bg-blue-800 rounded-full mr-4">
            {nextAction.icon}
          </div>
          <div>
            <h3 className="font-medium text-gray-900 dark:text-white">{nextAction.text}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">{nextAction.description}</p>
          </div>
        </div>
        <Button 
          className="w-full mt-4"
          onClick={() => navigate(nextAction.path)}
        >
          Continue <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
      
      <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
        <h3 className="font-medium text-gray-900 dark:text-white mb-3">Quick Health Tips</h3>
        <ul className="space-y-2">
          <li className="flex items-start">
            <Activity className="h-4 w-4 text-green-500 mt-1 mr-2 flex-shrink-0" />
            <span className="text-sm text-gray-600 dark:text-gray-400">Aim for at least 30 minutes of moderate exercise daily</span>
          </li>
          <li className="flex items-start">
            <Brain className="h-4 w-4 text-purple-500 mt-1 mr-2 flex-shrink-0" />
            <span className="text-sm text-gray-600 dark:text-gray-400">Take short breaks during work to reduce mental fatigue</span>
          </li>
          <li className="flex items-start">
            <Heart className="h-4 w-4 text-red-500 mt-1 mr-2 flex-shrink-0" />
            <span className="text-sm text-gray-600 dark:text-gray-400">Stay hydrated by drinking at least 8 glasses of water daily</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default StepByStep;
