
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const PricingTeaser: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isPro } = useAuth();

  const proFeatures = [
    "Advanced diabetes-specific recommendations",
    "Blood glucose pattern analysis",
    "Medication interaction alerts",
    "Meal plan suggestions",
    "Export health reports"
  ];

  const handleFreePlanClick = () => {
    if (isAuthenticated) {
      navigate('/dashboard');
    } else {
      navigate('/auth');
    }
  };

  const handleProPlanClick = () => {
    if (!isAuthenticated) {
      navigate('/auth');
    } else if (isPro) {
      navigate('/dashboard');
    } else {
      navigate('/subscribe');
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">Take Your Diabetes Management to the Next Level</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-2 border-gray-200 dark:border-gray-800">
          <CardHeader>
            <CardTitle className="text-xl">Free Plan</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-3xl font-bold">$0<span className="text-base font-normal text-muted-foreground">/month</span></p>
            <ul className="space-y-2">
              <li className="flex items-center gap-2">
                <div className="h-5 w-5 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                  <span className="text-green-600 dark:text-green-400 text-sm">✓</span>
                </div>
                <span>Basic diabetes profile</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="h-5 w-5 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                  <span className="text-green-600 dark:text-green-400 text-sm">✓</span>
                </div>
                <span>Limited health recommendations</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="h-5 w-5 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                  <span className="text-green-600 dark:text-green-400 text-sm">✓</span>
                </div>
                <span>Basic medication tracking</span>
              </li>
            </ul>
          </CardContent>
          <CardFooter>
            <Button 
              variant="outline" 
              className="w-full"
              onClick={handleFreePlanClick}
            >
              {isAuthenticated ? 'Access Dashboard' : 'Get Started'}
            </Button>
          </CardFooter>
        </Card>

        <Card className="border-2 border-purple-500 dark:border-purple-400 relative">
          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-purple-500 text-white px-4 py-1 rounded-full text-sm font-medium">
            Recommended
          </div>
          <CardHeader>
            <CardTitle className="text-xl">Pro Plan</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-center space-x-2">
              <p className="text-3xl font-bold">$9.99<span className="text-base font-normal text-muted-foreground">/month</span></p>
              <TooltipProvider delayDuration={300}>
                <Tooltip>
                  <TooltipTrigger className="text-xs text-green-600 underline cursor-help">
                    Annual plan
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>$9.99/month billed annually or $14.99 monthly</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <ul className="space-y-2">
              {proFeatures.map((feature, i) => (
                <li key={i} className="flex items-center gap-2">
                  <div className="h-5 w-5 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
                    <span className="text-purple-600 dark:text-purple-400 text-sm">✓</span>
                  </div>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </CardContent>
          <CardFooter>
            <Button 
              className="w-full bg-purple-600 hover:bg-purple-700"
              onClick={handleProPlanClick}
            >
              {isPro ? 'Access Premium Features' : isAuthenticated ? 'Upgrade to Pro' : 'Start Free Trial'}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default PricingTeaser;
