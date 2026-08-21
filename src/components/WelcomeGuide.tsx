
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, ClipboardCheck, Brain, Lock } from 'lucide-react';
import { useUserData } from '@/context/UserDataContext';
import { Button } from '@/components/ui/button';
import ProFeatureLock from './ProFeatureLock';

const WelcomeGuide = () => {
  const { userData } = useUserData();
  const navigate = useNavigate();
  
  // Determine what step the user is on based on their data
  const getCompletionStatus = () => {
    // If they have recommendations, they've completed the assessment
    if (userData.name && userData.age && userData.sex) {
      return {
        profileComplete: true,
        hasRecommendations: true,
        needsVitamins: !userData.medications || userData.medications.length === 0
      };
    }
    
    // Default for new users
    return {
      profileComplete: false,
      hasRecommendations: false,
      needsVitamins: true
    };
  };
  
  const status = getCompletionStatus();
  
  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900 rounded-xl p-4 sm:p-6 shadow-sm border border-blue-100 dark:border-gray-700">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
        {userData.name ? `Welcome back, ${userData.name}!` : 'Welcome to MediSynic!'}
      </h2>
      
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-start">
          <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center mr-3 mb-2 sm:mb-0 ${
            status.profileComplete ? 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-400' : 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400'
          }`}>
            {status.profileComplete ? '✓' : '1'}
          </div>
          <div className="flex-1">
            <h3 className="font-medium text-gray-900 dark:text-white">Complete Health Profile</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
              {status.profileComplete 
                ? 'Your health profile is complete. You can update it anytime.' 
                : 'Fill out your health information to get personalized recommendations.'}
            </p>
            {!status.profileComplete ? (
              <Button 
                variant="default" 
                className="w-full mt-1 bg-blue-600 hover:bg-blue-700"
                onClick={() => navigate('/form')}
              >
                Complete Profile <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            ) : (
              <Button 
                variant="outline" 
                className="w-full mt-1"
                onClick={() => navigate('/form')}
              >
                Update Profile <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row sm:items-start">
          <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center mr-3 mb-2 sm:mb-0 ${
            status.hasRecommendations ? 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-400' : 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400'
          }`}>
            {status.hasRecommendations ? '✓' : '2'}
          </div>
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <h3 className="font-medium text-gray-900 dark:text-white">View Health Recommendations</h3>
              <ProFeatureLock 
                feature="Premium Recommendations" 
                description="Upgrade to Pro for detailed analysis and advanced recommendations" 
              />
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
              {status.hasRecommendations
                ? 'Your personalized health recommendations are ready to view.'
                : 'After completing your profile, you\'ll receive personalized health insights.'}
            </p>
            {status.hasRecommendations ? (
              <Button 
                variant="default" 
                className="w-full mt-1 bg-blue-600 hover:bg-blue-700"
                onClick={() => navigate('/recommendations')}
              >
                View Recommendations <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            ) : (
              <Button 
                variant="outline" 
                className="w-full mt-1"
                disabled
              >
                Complete Profile First <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row sm:items-start">
          <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center mr-3 mb-2 sm:mb-0 ${
            !status.needsVitamins ? 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-400' : 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400'
          }`}>
            {!status.needsVitamins ? '✓' : '3'}
          </div>
          <div className="flex-1">
            <h3 className="font-medium text-gray-900 dark:text-white">Add Medications</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
              {!status.needsVitamins
                ? 'Your medications have been added. You can update them anytime.'
                : 'Add your current medications to check for interactions and get vitamin recommendations.'}
            </p>
            {status.hasRecommendations ? (
              <Button 
                variant={status.needsVitamins ? "default" : "outline"}
                className={`w-full mt-1 ${status.needsVitamins ? "bg-blue-600 hover:bg-blue-700" : ""}`}
                onClick={() => navigate('/dashboard?tab=medications')}
              >
                {status.needsVitamins ? 'Add Medications' : 'Update Medications'} <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            ) : (
              <Button 
                variant="outline" 
                className="w-full mt-1"
                disabled
              >
                Complete Profile First <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row sm:items-start">
          <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center mr-3 mb-2 sm:mb-0 bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400">
            4
          </div>
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <h3 className="font-medium text-gray-900 dark:text-white">Ask AI Pharmacist</h3>
              <ProFeatureLock 
                feature="Priority AI Access" 
                description="Upgrade to Pro for unlimited AI questions and priority responses" 
              />
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
              Have questions about your medications? Our AI Pharmacist can help.
            </p>
            <Button 
              variant="default" 
              className="w-full mt-1 bg-blue-600 hover:bg-blue-700"
              onClick={() => navigate('/ai-pharmacist')}
            >
              Talk to AI Pharmacist <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
      
      {/* New primary CTA button for next relevant action, wrapped in a container for better mobile display */}
      {!status.profileComplete && (
        <div className="mt-6">
          <Button 
            variant="default" 
            size="lg"
            className="w-full bg-blue-600 hover:bg-blue-700"
            onClick={() => navigate('/form')}
          >
            <span className="hidden sm:inline">Get Started Now</span>
            <span className="sm:hidden">Start Now</span>
            <ArrowRight className="ml-1 h-5 w-5" />
          </Button>
        </div>
      )}

      {/* Pro upgrade teaser */}
      {status.profileComplete && (
        <div className="mt-6 p-4 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-purple-700 dark:text-purple-300 mb-1">Unlock Premium Features</h3>
              <p className="text-sm text-purple-600 dark:text-purple-400">Get advanced recommendations and unlimited AI access</p>
            </div>
            <Button 
              className="bg-purple-600 hover:bg-purple-700"
              onClick={() => alert('Pro features coming soon!')}
              size="sm"
            >
              Upgrade
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default WelcomeGuide;
