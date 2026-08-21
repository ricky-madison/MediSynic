
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Info, Shield, Zap, Heart, Users, ArrowRight, Activity } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import FadeIn from '@/components/FadeIn';

const Subscribe = () => {
  const { isPro } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const handleMonthlySubscribe = () => {
    // Mock subscription for now
    toast({
      title: "Coming Soon",
      description: "Monthly subscription will be available soon.",
    });
  };
  
  const handleAnnualSubscribe = () => {
    // Mock subscription for now
    toast({
      title: "Coming Soon",
      description: "Annual subscription will be available soon.",
    });
  };

  const proFeatures = [
    {
      text: "Advanced diabetes-specific recommendations",
      icon: Heart
    },
    {
      text: "Blood glucose pattern analysis with charts and insights",
      icon: Activity
    },
    {
      text: "Medication reminders and interaction alerts",
      icon: Zap
    },
    {
      text: "Meal plan suggestions tailored to glucose levels",
      icon: CheckCircle
    },
    {
      text: "Detailed health reports for doctor visits",
      icon: Shield
    },
    {
      text: "AI-powered glucose trend predictions",
      icon: Activity
    },
    {
      text: "Premium support from diabetes specialists",
      icon: Users
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-purple-50 dark:from-gray-900 dark:to-purple-950/20">
      <div className="container max-w-7xl mx-auto py-12 px-4 md:px-6">
        <FadeIn delay={100} className="text-center max-w-3xl mx-auto mb-12">
          <span className="inline-block bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 px-3 py-1 rounded-full text-sm font-medium mb-4 relative z-10">Premium Features</span>
          <h1 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
            Upgrade to Pro
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Unlock advanced diabetes management features to optimize your health journey
          </p>
        </FadeIn>
        
        <FadeIn delay={200}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <Card className="border-2 border-purple-200 dark:border-purple-800 hover:shadow-lg transition-shadow relative">
              <CardHeader className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/30 dark:to-blue-900/30">
                <CardTitle className="text-2xl">Monthly Plan</CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="mb-6">
                  <p className="text-4xl font-bold">$14.99<span className="text-xl text-muted-foreground">/month</span></p>
                  <p className="text-sm text-muted-foreground">Billed monthly</p>
                </div>
                
                <ul className="space-y-3 mb-6">
                  {proFeatures.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <feature.icon className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>{feature.text}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button className="w-full bg-purple-600 hover:bg-purple-700" onClick={handleMonthlySubscribe}>
                  Subscribe Monthly
                </Button>
              </CardFooter>
            </Card>
            
            <Card className="border-2 border-purple-500 dark:border-purple-600 relative hover:shadow-lg transition-shadow">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-1 rounded-full text-sm font-bold z-10">
                Best Value
              </div>
              <CardHeader className="bg-gradient-to-r from-purple-100 to-blue-100 dark:from-purple-900/50 dark:to-blue-900/50">
                <CardTitle className="text-2xl">Annual Plan</CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="mb-6">
                  <div className="flex items-baseline gap-2">
                    <p className="text-4xl font-bold">$9.99<span className="text-xl text-muted-foreground">/month</span></p>
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded font-medium">Save 33%</span>
                  </div>
                  <p className="text-sm text-muted-foreground">Billed annually ($119.88/year)</p>
                </div>
                
                <ul className="space-y-3 mb-6">
                  {proFeatures.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <feature.icon className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>{feature.text}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700" onClick={handleAnnualSubscribe}>
                  Subscribe Annually
                </Button>
              </CardFooter>
            </Card>
          </div>
        </FadeIn>
        
        <FadeIn delay={300} className="mt-12">
          {/* Benefits section */}
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl font-bold text-center mb-8">Why Upgrade to Pro?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
                <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center mb-4">
                  <Activity className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Better Health Insights</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Get personalized analytics and AI-powered insights about your glucose patterns and health trends.
                </p>
              </div>
              
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
                <div className="h-12 w-12 rounded-full bg-purple-100 dark:bg-purple-900/50 flex items-center justify-center mb-4">
                  <Shield className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Premium Support</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Connect with diabetes specialists who can help answer your questions and provide guidance.
                </p>
              </div>
              
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
                <div className="h-12 w-12 rounded-full bg-green-100 dark:bg-green-900/50 flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Caregiver Integration</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Share access with family members or caregivers to help monitor your health and medication adherence.
                </p>
              </div>
            </div>
          </div>
        </FadeIn>
        
        <FadeIn delay={400} className="mt-12 max-w-5xl mx-auto">
          <div className="flex items-center justify-center p-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <div className="flex items-start gap-3">
              <Info className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-blue-900 dark:text-blue-100">Need help choosing the right plan?</h4>
                <p className="text-blue-800 dark:text-blue-300 text-sm mt-1">
                  Contact our support team to discuss which plan is best for your diabetes management needs.
                </p>
                <Button 
                  variant="link" 
                  className="p-0 h-auto mt-2 text-blue-700 dark:text-blue-400" 
                  onClick={() => navigate('/contact')}
                >
                  Contact Support <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </FadeIn>
      </div>
    </div>
  );
};

export default Subscribe;
