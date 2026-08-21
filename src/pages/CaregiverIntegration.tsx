
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, ArrowRight, CalendarClock, Bell, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import ProFeatureLock from '@/components/ProFeatureLock';
import { useToast } from '@/components/ui/use-toast';

const CaregiverIntegration = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const showProFeatureToast = () => {
    toast({
      title: "Pro Feature",
      description: "The Caregiver Integration feature is available only in the Pro plan.",
      variant: "default",
      duration: 3000,
    });
  };

  return (
    <div className="container py-8 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
            <Users className="h-8 w-8 text-blue-600" />
            Caregiver Integration
            <ProFeatureLock 
              feature="Caregiver Access" 
              description="Connect with family members or care providers to share your health information"
              variant="badge"
              size="md"
            />
          </h1>
          <p className="text-lg text-muted-foreground">
            Connect with caregivers to help monitor and manage your medications and health data
          </p>
        </div>
        <Button 
          className="mt-4 md:mt-0 bg-purple-600 hover:bg-purple-700" 
          onClick={showProFeatureToast}
          size="lg"
        >
          <span>Upgrade to Pro</span>
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <Card className="border-2 border-purple-100 dark:border-purple-900/30">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Medication Management
              <Users className="h-5 w-5 text-blue-600" />
            </CardTitle>
            <CardDescription>Share your medication schedule with caregivers</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Allow trusted caregivers to monitor your medication adherence and receive notifications when medications are missed.</p>
          </CardContent>
          <CardFooter>
            <Button 
              variant="outline" 
              className="w-full border-purple-200 text-purple-700"
              onClick={showProFeatureToast}
            >
              Setup Sharing
              <ProFeatureLock 
                feature="Medication Sharing" 
                variant="inline" 
                className="ml-2"
                size="sm"
              />
            </Button>
          </CardFooter>
        </Card>

        <Card className="border-2 border-purple-100 dark:border-purple-900/30">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Health Data Access
              <CalendarClock className="h-5 w-5 text-blue-600" />
            </CardTitle>
            <CardDescription>Share health metrics with your care team</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Provide access to your vital signs, lab results, and other health data to healthcare providers or family members.</p>
          </CardContent>
          <CardFooter>
            <Button 
              variant="outline" 
              className="w-full border-purple-200 text-purple-700"
              onClick={showProFeatureToast}
            >
              Configure Access
              <ProFeatureLock 
                feature="Health Data Sharing" 
                variant="inline" 
                className="ml-2"
                size="sm"
              />
            </Button>
          </CardFooter>
        </Card>

        <Card className="border-2 border-purple-100 dark:border-purple-900/30">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Emergency Alerts
              <Bell className="h-5 w-5 text-blue-600" />
            </CardTitle>
            <CardDescription>Set up emergency notifications</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Configure alerts for caregivers when certain health metrics fall outside of normal ranges or when assistance is needed.</p>
          </CardContent>
          <CardFooter>
            <Button 
              variant="outline" 
              className="w-full border-purple-200 text-purple-700"
              onClick={showProFeatureToast}
            >
              Set Alert Rules
              <ProFeatureLock 
                feature="Emergency Alerts" 
                variant="inline" 
                className="ml-2"
                size="sm"
              />
            </Button>
          </CardFooter>
        </Card>
      </div>

      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900 rounded-xl p-6 shadow-sm border border-blue-100 dark:border-gray-700">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Caregiver Benefits</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-start gap-3">
            <div className="bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400 p-2 rounded-lg">
              <Bell className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-medium">Medication Reminders</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">Caregivers can send reminders and verify medication adherence</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400 p-2 rounded-lg">
              <CalendarClock className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-medium">Appointment Management</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">Help schedule and track healthcare appointments</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400 p-2 rounded-lg">
              <MessageSquare className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-medium">Secure Messaging</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">Communicate securely with your healthcare team</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400 p-2 rounded-lg">
              <Users className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-medium">Care Coordination</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">Coordinate care among multiple caregivers and providers</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 p-6 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-xl font-semibold text-purple-700 dark:text-purple-300 mb-1">Unlock Premium Caregiver Features</h3>
            <p className="text-purple-600 dark:text-purple-400">Connect up to 5 caregivers with Pro Plan</p>
          </div>
          <Button 
            className="w-full md:w-auto bg-purple-600 hover:bg-purple-700"
            onClick={showProFeatureToast}
            size="lg"
          >
            Upgrade to Pro
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CaregiverIntegration;
