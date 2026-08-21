
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Thermometer, ArrowRight, Activity, Droplet, Heart, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ProFeatureLock from '@/components/ProFeatureLock';
import { useToast } from '@/components/ui/use-toast';
import { useUserData } from '@/context/UserDataContext';

const HealthDataLogging = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { userData, setUserData } = useUserData();
  
  const [bloodPressureSystolic, setBloodPressureSystolic] = useState<string>(
    userData.vitalSigns?.bloodPressureSystolic?.toString() || ''
  );
  const [bloodPressureDiastolic, setBloodPressureDiastolic] = useState<string>(
    userData.vitalSigns?.bloodPressureDiastolic?.toString() || ''
  );
  const [heartRate, setHeartRate] = useState<string>(
    userData.vitalSigns?.heartRate?.toString() || ''
  );
  const [oxygenLevel, setOxygenLevel] = useState<string>(
    userData.vitalSigns?.oxygenLevel?.toString() || ''
  );
  const [glucoseLevel, setGlucoseLevel] = useState<string>(
    userData.vitalSigns?.glucoseLevel?.toString() || ''
  );

  const showProFeatureToast = () => {
    toast({
      title: "Pro Feature",
      description: "Advanced health data tracking is available only in the Pro plan.",
      variant: "default",
      duration: 3000,
    });
  };

  const saveVitalSigns = () => {
    // Update user data with new vital signs
    setUserData(prevData => ({
      ...prevData,
      vitalSigns: {
        ...prevData.vitalSigns,
        bloodPressureSystolic: bloodPressureSystolic ? parseInt(bloodPressureSystolic) : undefined,
        bloodPressureDiastolic: bloodPressureDiastolic ? parseInt(bloodPressureDiastolic) : undefined,
        heartRate: heartRate ? parseInt(heartRate) : undefined,
        oxygenLevel: oxygenLevel ? parseInt(oxygenLevel) : undefined,
        glucoseLevel: glucoseLevel ? parseInt(glucoseLevel) : undefined,
      }
    }));

    toast({
      title: "Vital Signs Updated",
      description: "Your health data has been successfully saved.",
      variant: "default",
    });
  };

  return (
    <div className="container py-8 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
            <Thermometer className="h-8 w-8 text-blue-600" />
            Health Data Logging
          </h1>
          <p className="text-lg text-muted-foreground">
            Track your vital signs and health metrics over time
          </p>
        </div>
      </div>

      <Tabs defaultValue="vitals" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger value="vitals">Vital Signs</TabsTrigger>
          <TabsTrigger value="trends">
            Trends
            <ProFeatureLock 
              feature="Health Trends Analysis" 
              variant="inline" 
              className="ml-2"
              size="sm"
            />
          </TabsTrigger>
          <TabsTrigger value="goals">
            Health Goals
            <ProFeatureLock 
              feature="Personalized Health Goals" 
              variant="inline" 
              className="ml-2"
              size="sm"
            />
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="vitals">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-5 w-5 text-red-500" />
                  Cardiovascular
                </CardTitle>
                <CardDescription>Record your blood pressure and heart rate</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="systolic">Systolic (mmHg)</Label>
                    <Input
                      id="systolic"
                      placeholder="120"
                      value={bloodPressureSystolic}
                      onChange={(e) => setBloodPressureSystolic(e.target.value)}
                      type="number"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="diastolic">Diastolic (mmHg)</Label>
                    <Input
                      id="diastolic"
                      placeholder="80"
                      value={bloodPressureDiastolic}
                      onChange={(e) => setBloodPressureDiastolic(e.target.value)}
                      type="number"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="heartRate">Heart Rate (BPM)</Label>
                  <Input
                    id="heartRate"
                    placeholder="72"
                    value={heartRate}
                    onChange={(e) => setHeartRate(e.target.value)}
                    type="number"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-blue-500" />
                  Other Vitals
                </CardTitle>
                <CardDescription>Record oxygen saturation and glucose levels</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="oxygenLevel">Oxygen Saturation (%)</Label>
                  <Input
                    id="oxygenLevel"
                    placeholder="98"
                    value={oxygenLevel}
                    onChange={(e) => setOxygenLevel(e.target.value)}
                    type="number"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="glucoseLevel">Blood Glucose (mg/dL)</Label>
                  <Input
                    id="glucoseLevel"
                    placeholder="90"
                    value={glucoseLevel}
                    onChange={(e) => setGlucoseLevel(e.target.value)}
                    type="number"
                  />
                </div>
              </CardContent>
            </Card>
            
            <div className="lg:col-span-2 flex justify-end">
              <Button onClick={saveVitalSigns} size="lg">
                Save Health Data
              </Button>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="trends">
          <div className="grid place-items-center py-12">
            <div className="text-center max-w-lg mx-auto">
              <div className="bg-purple-100 dark:bg-purple-900/30 p-4 rounded-full inline-block mb-4">
                <Clock className="h-8 w-8 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-2xl font-semibold mb-2">Health Trends Analysis</h3>
              <p className="text-muted-foreground mb-6">
                Visualize your health data trends over time, identify patterns, and track your progress with our advanced analytics.
              </p>
              <Button 
                onClick={showProFeatureToast}
                className="bg-purple-600 hover:bg-purple-700"
              >
                Upgrade to Pro <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="goals">
          <div className="grid place-items-center py-12">
            <div className="text-center max-w-lg mx-auto">
              <div className="bg-purple-100 dark:bg-purple-900/30 p-4 rounded-full inline-block mb-4">
                <Droplet className="h-8 w-8 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-2xl font-semibold mb-2">Personalized Health Goals</h3>
              <p className="text-muted-foreground mb-6">
                Set custom health targets, receive personalized recommendations, and get notifications to help you stay on track.
              </p>
              <Button 
                onClick={showProFeatureToast}
                className="bg-purple-600 hover:bg-purple-700"
              >
                Upgrade to Pro <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Daily Logging</CardTitle>
            <CardDescription>Track your data consistently</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm">Regular logging helps identify trends and patterns in your health data.</p>
          </CardContent>
          <CardFooter className="border-t pt-3 pb-1">
            <Button variant="ghost" size="sm" className="w-full">
              Set Reminders
              <ProFeatureLock 
                feature="Daily Reminders" 
                variant="inline" 
                className="ml-2"
                size="sm"
              />
            </Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Health Reports</CardTitle>
            <CardDescription>Generate detailed reports</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm">Share your health data reports with healthcare providers for better care.</p>
          </CardContent>
          <CardFooter className="border-t pt-3 pb-1">
            <Button variant="ghost" size="sm" className="w-full" onClick={showProFeatureToast}>
              Generate Report
              <ProFeatureLock 
                feature="Health Reports" 
                variant="inline" 
                className="ml-2"
                size="sm"
              />
            </Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Health Insights</CardTitle>
            <CardDescription>AI-powered analysis</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm">Receive personalized insights and recommendations based on your health data.</p>
          </CardContent>
          <CardFooter className="border-t pt-3 pb-1">
            <Button variant="ghost" size="sm" className="w-full" onClick={showProFeatureToast}>
              View Insights
              <ProFeatureLock 
                feature="AI Health Insights" 
                variant="inline" 
                className="ml-2"
                size="sm"
              />
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default HealthDataLogging;
