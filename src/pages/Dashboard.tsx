
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import FadeIn from '@/components/FadeIn';
import { useUserData } from '@/context/UserDataContext';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, AreaChart, Area } from 'recharts';
import { Activity, Heart, Brain, Moon, Droplets, Salad, Dumbbell, ShieldCheck, AlertTriangle, Pill, Leaf, User, GaugeCircle, LayoutDashboard, Bell, Clock, Calendar, CheckCircle, CheckCircle2, AlertCircle, TrendingUp, TrendingDown, Coffee, Zap, Circle } from 'lucide-react';
import HealthMetricCard from '@/components/HealthMetricCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MedicationManager from '@/components/MedicationManager';
import VitaminRecommendations from '@/components/VitaminRecommendations';
import WelcomeGuide from '@/components/WelcomeGuide';
import QuickActions from '@/components/QuickActions';
import StepByStep from '@/components/StepByStep';

const Dashboard = () => {
  const { userData, recommendations, vitaminRecommendations } = useUserData();
  const navigate = useNavigate();
  const location = useLocation();
  
  const queryParams = new URLSearchParams(location.search);
  const tabFromUrl = queryParams.get('tab');
  const [activeTab, setActiveTab] = useState(tabFromUrl || "overview");
  
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    const newSearchParams = new URLSearchParams(location.search);
    newSearchParams.set('tab', value);
    navigate({ search: newSearchParams.toString() }, { replace: true });
  };
  
  useEffect(() => {
    if (Object.keys(userData).length === 0) {
      navigate('/form');
    }
  }, [userData, navigate]);
  
  useEffect(() => {
    if (tabFromUrl && tabFromUrl !== activeTab) {
      setActiveTab(tabFromUrl);
    }
  }, [tabFromUrl, activeTab]);
  
  const calculateBMI = () => {
    if (!userData.weight || !userData.height) return null;
    
    const heightInMeters = userData.height / 100;
    const bmi = userData.weight / (heightInMeters * heightInMeters);
    return bmi.toFixed(1);
  };
  
  const bmi = calculateBMI();
  
  const getBMICategory = (bmi: number) => {
    if (bmi < 18.5) return { category: "Underweight", color: "#3B82F6" };
    if (bmi < 25) return { category: "Normal", color: "#10B981" };
    if (bmi < 30) return { category: "Overweight", color: "#F59E0B" };
    return { category: "Obese", color: "#EF4444" };
  };
  
  const bmiCategory = bmi ? getBMICategory(parseFloat(bmi)) : null;
  
  const healthScoreData = [
    { name: 'Lifestyle', value: 75, color: '#3B82F6' },
    { name: 'Nutrition', value: 65, color: '#10B981' },
    { name: 'Physical', value: 85, color: '#F59E0B' },
    { name: 'Mental', value: 70, color: '#8B5CF6' }
  ];
  
  const sleepQualityData = [
    { name: 'Mon', quality: 85 },
    { name: 'Tue', quality: 75 },
    { name: 'Wed', quality: 90 },
    { name: 'Thu', quality: 65 },
    { name: 'Fri', quality: 80 },
    { name: 'Sat', quality: 95 },
    { name: 'Sun', quality: 85 }
  ];
  
  const recommendationCategories = recommendations.reduce((acc, rec) => {
    acc[rec.category] = (acc[rec.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  const recommendationCategoryData = Object.entries(recommendationCategories).map(([category, count]) => ({
    name: category.charAt(0).toUpperCase() + category.slice(1),
    value: count
  }));
  
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];
  
  return (
    <div className="container-tight mx-auto p-6">
      <FadeIn delay={100} className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-2 text-medical-gray-900 dark:text-white">
          Health Dashboard
        </h1>
        <p className="text-lg text-medical-gray-600 dark:text-gray-400 max-w-2xl">
          Track your health metrics and view personalized recommendations based on your profile.
        </p>
      </FadeIn>
      
      <FadeIn delay={150} className="mb-8">
        <WelcomeGuide />
      </FadeIn>
      
      <FadeIn delay={200} className="mb-8">
        <h2 className="text-xl font-semibold mb-4 text-medical-gray-900 dark:text-white">Quick Actions</h2>
        <QuickActions />
      </FadeIn>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <div className="lg:col-span-2">
          <FadeIn delay={250}>
            <Tabs defaultValue={activeTab} className="w-full" onValueChange={handleTabChange}>
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="overview">
                  <LayoutDashboard className="h-4 w-4 mr-2" />
                  Overview
                </TabsTrigger>
                <TabsTrigger value="metrics">
                  <GaugeCircle className="h-4 w-4 mr-2" />
                  Health Metrics
                </TabsTrigger>
                <TabsTrigger value="medications">
                  <Pill className="h-4 w-4 mr-2" />
                  Medications
                </TabsTrigger>
                <TabsTrigger value="vitamins">
                  <Leaf className="h-4 w-4 mr-2" />
                  Vitamins
                </TabsTrigger>
                <TabsTrigger value="recommendations">
                  <Heart className="h-4 w-4 mr-2" />
                  Recommendations
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="mt-6">
                <div className="card-glass mb-8">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                    <div className="flex items-center mb-4 md:mb-0">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-r from-medical-blue to-medical-blue-light flex items-center justify-center mr-4">
                        <User className="h-8 w-8 text-white" />
                      </div>
                      <div>
                        <h2 className="text-xl font-semibold text-medical-gray-900 dark:text-white">{userData.name || 'User'}</h2>
                        <p className="text-medical-gray-600 dark:text-gray-400">
                          {userData.age} years old • {userData.sex} • {userData.region || 'Unknown Region'}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-4">
                      <div className="bg-medical-gray-100 dark:bg-gray-800 rounded-lg px-4 py-2">
                        <p className="text-xs text-medical-gray-500 dark:text-gray-400">Height</p>
                        <p className="text-lg font-semibold text-medical-gray-900 dark:text-white">{userData.height} cm</p>
                      </div>
                      <div className="bg-medical-gray-100 dark:bg-gray-800 rounded-lg px-4 py-2">
                        <p className="text-xs text-medical-gray-500 dark:text-gray-400">Weight</p>
                        <p className="text-lg font-semibold text-medical-gray-900 dark:text-white">{userData.weight} kg</p>
                      </div>
                      <div className="bg-medical-gray-100 dark:bg-gray-800 rounded-lg px-4 py-2">
                        <p className="text-xs text-medical-gray-500 dark:text-gray-400">BMI</p>
                        <p className="text-lg font-semibold text-medical-gray-900 dark:text-white">{bmi || 'N/A'}</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  <HealthMetricCard 
                    title="Sleep Quality" 
                    value={`${userData.sleepHours || 0}h`}
                    status={userData.sleepHours && userData.sleepHours >= 7 ? "good" : "attention"}
                    icon={<Moon className="h-5 w-5" />}
                    color="blue"
                  />
                  
                  <HealthMetricCard 
                    title="Stress Level" 
                    value={userData.stressLevel || "Medium"}
                    status={userData.stressLevel === "low" ? "good" : (userData.stressLevel === "high" ? "warning" : "attention")}
                    icon={<Brain className="h-5 w-5" />}
                    color="purple"
                  />
                  
                  <HealthMetricCard 
                    title="Activity Level" 
                    value={userData.exerciseFrequency || "Low"}
                    status={userData.exerciseFrequency === "frequent" ? "good" : (userData.exerciseFrequency === "never" ? "warning" : "attention")}
                    icon={<Activity className="h-5 w-5" />}
                    color="orange"
                  />
                  
                  <HealthMetricCard 
                    title="Diet Quality" 
                    value={userData.dietType || "Regular"}
                    status={userData.dietType === "balanced" ? "good" : (userData.dietType === "irregular" ? "warning" : "attention")}
                    icon={<Salad className="h-5 w-5" />}
                    color="green"
                  />
                </div>
                
                <div className="card-glass">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-medical-gray-900 dark:text-white flex items-center">
                      <Leaf className="mr-2 h-5 w-5 text-green-600" />
                      Top Vitamin Recommendations
                    </h3>
                    <button 
                      onClick={() => handleTabChange("vitamins")}
                      className="text-sm font-medium text-medical-blue hover:underline"
                    >
                      View All
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {vitaminRecommendations && vitaminRecommendations.length > 0 ? (
                      vitaminRecommendations.slice(0, 3).map((vitamin, index) => (
                        <div key={index} className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/30 dark:to-blue-900/30 rounded-lg p-4 border border-medical-blue-light/20 dark:border-blue-900/50">
                          <h4 className="font-semibold text-gray-800 dark:text-gray-100 flex items-center mb-1">
                            <Pill className="h-4 w-4 mr-2 text-green-600" />
                            {vitamin.name}
                          </h4>
                          <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">{vitamin.dosage}</p>
                          <p className="text-sm text-gray-700 dark:text-gray-300 mb-2 line-clamp-2">
                            {vitamin.reason}
                          </p>
                        </div>
                      ))
                    ) : (
                      <div className="col-span-3 flex items-center justify-center p-6 text-center">
                        <div>
                          <AlertTriangle className="h-8 w-8 text-amber-500 mx-auto mb-2" />
                          <p className="text-gray-600 dark:text-gray-400">Complete your health profile to get personalized vitamin recommendations</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="metrics" className="mt-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                  <div className="card-glass">
                    <h3 className="text-lg font-semibold mb-4 text-medical-gray-900">Body Mass Index (BMI)</h3>
                    {bmi ? (
                      <div>
                        <div className="flex justify-between items-center mb-4">
                          <span className="text-3xl font-bold" style={{ color: bmiCategory?.color }}>{bmi}</span>
                          <span className="chip" style={{ backgroundColor: `${bmiCategory?.color}20`, color: bmiCategory?.color }}>
                            {bmiCategory?.category}
                          </span>
                        </div>
                        
                        <div className="w-full h-3 bg-medical-gray-200 rounded-full mb-4">
                          <div 
                            className="h-3 rounded-full transition-all duration-500" 
                            style={{ 
                              width: `${Math.min(100, parseFloat(bmi) * 2.5)}%`,
                              backgroundColor: bmiCategory?.color
                            }}
                          ></div>
                        </div>
                        
                        <div className="flex justify-between text-xs text-medical-gray-500">
                          <span>Underweight</span>
                          <span>Normal</span>
                          <span>Overweight</span>
                          <span>Obese</span>
                        </div>
                        
                        <div className="mt-4 p-3 rounded-lg bg-medical-gray-100">
                          <p className="text-sm text-medical-gray-700">
                            {bmiCategory?.category === "Normal" ? (
                              "Your BMI is within the healthy range. Maintain your current weight through balanced diet and regular exercise."
                            ) : bmiCategory?.category === "Underweight" ? (
                              "Your BMI indicates you may be underweight. Consider consulting with a healthcare provider about healthy weight gain strategies."
                            ) : bmiCategory?.category === "Overweight" ? (
                              "Your BMI indicates you may be overweight. Focus on balanced nutrition and increased physical activity."
                            ) : (
                              "Your BMI indicates obesity, which increases risk for certain health conditions. Consider consulting with a healthcare provider."
                            )}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center p-6">
                        <AlertTriangle className="h-12 w-12 text-medical-gray-400 mb-3" />
                        <p className="text-medical-gray-500 text-center">
                          We need your height and weight to calculate your BMI.
                        </p>
                        <button 
                          onClick={() => navigate('/form')}
                          className="mt-4 btn-secondary py-2"
                        >
                          Update Profile
                        </button>
                      </div>
                    )}
                  </div>
                  
                  <div className="card-glass">
                    <h3 className="text-lg font-semibold mb-4 text-medical-gray-900">Sleep Quality Trend</h3>
                    <ResponsiveContainer width="100%" height={220}>
                      <BarChart data={sleepQualityData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="name" />
                        <YAxis domain={[0, 100]} />
                        <Tooltip formatter={(value) => [`${value}%`, 'Quality']} />
                        <Bar dataKey="quality" fill="#3B82F6" />
                      </BarChart>
                    </ResponsiveContainer>
                    
                    <div className="mt-4 flex items-center p-3 rounded-lg bg-medical-blue-light/20">
                      <Moon className="h-5 w-5 text-medical-blue mr-2" />
                      <p className="text-sm text-medical-gray-700">
                        You reported sleeping {userData.sleepHours || "?"} hours per night. Adults typically need 7-9 hours for optimal health.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                  <div className="card-glass">
                    <div className="flex items-start mb-4">
                      <div className="p-3 rounded-xl mr-4 bg-medical-green-light/50">
                        <Dumbbell className="w-5 h-5 text-medical-green" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-medical-gray-900">Physical Activity</h3>
                        <p className="text-sm text-medical-gray-600">Based on your profile</p>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-xs text-medical-gray-600">Current Level</span>
                          <span className="text-xs font-medium">{userData.exerciseFrequency || "Unknown"}</span>
                        </div>
                        <div className="w-full h-2 bg-medical-gray-200 rounded-full">
                          <div 
                            className="h-2 rounded-full bg-medical-green transition-all duration-500" 
                            style={{ 
                              width: userData.exerciseFrequency === "frequent" ? "90%" : 
                                 userData.exerciseFrequency === "moderate" ? "60%" : 
                                 userData.exerciseFrequency === "occasional" ? "30%" : "10%"
                            }}
                          ></div>
                        </div>
                      </div>
                      
                      <div className="p-3 rounded-lg bg-medical-gray-100">
                        <p className="text-sm text-medical-gray-700">
                          {userData.exerciseFrequency === "frequent" ? 
                            "Great job maintaining regular exercise! Continue your routine for optimal health benefits." : 
                            "Aim for at least 150 minutes of moderate activity weekly for better health outcomes."}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="card-glass">
                    <div className="flex items-start mb-4">
                      <div className="p-3 rounded-xl mr-4 bg-blue-100">
                        <Heart className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-medical-gray-900">Cardiovascular Health</h3>
                        <p className="text-sm text-medical-gray-600">Estimated based on factors</p>
                      </div>
                    </div>
                    
                    <div className="flex justify-center mb-3">
                      <div className="relative w-32 h-32">
                        <div className="w-full h-full rounded-full flex items-center justify-center bg-white border-8 border-blue-200">
                          <span className="text-4xl font-bold text-blue-600">75%</span>
                        </div>
                        <svg className="absolute inset-0" viewBox="0 0 100 100">
                          <circle 
                            cx="50" 
                            cy="50" 
                            r="46" 
                            fill="none" 
                            stroke="#3B82F6" 
                            strokeWidth="8"
                            strokeDasharray="289.02652413026095" 
                            strokeDashoffset="72.25663103256524"
                            transform="rotate(-90 50 50)"
                            className="drop-shadow-md"
                          />
                        </svg>
                      </div>
                    </div>
                    
                    <div className="p-3 rounded-lg bg-medical-gray-100">
                      <p className="text-sm text-medical-gray-700">
                        Your cardiovascular health estimate is based on your age, BMI, activity level, and other factors.
                      </p>
                    </div>
                  </div>
                  
                  <div className="card-glass">
                    <div className="flex items-start mb-4">
                      <div className="p-3 rounded-xl mr-4 bg-purple-100">
                        <Brain className="w-5 h-5 text-purple-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-medical-gray-900">Mental Wellbeing</h3>
                        <p className="text-sm text-medical-gray-600">Based on stress levels</p>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-xs text-medical-gray-600">Stress Level</span>
                          <span className="text-xs font-medium">{userData.stressLevel || "Medium"}</span>
                        </div>
                        <div className="w-full h-2 bg-medical-gray-200 rounded-full">
                          <div 
                            className="h-2 rounded-full transition-all duration-500" 
                            style={{ 
                              width: userData.stressLevel === "low" ? "25%" : 
                                 userData.stressLevel === "medium" ? "60%" : "90%",
                              backgroundColor: userData.stressLevel === "low" ? "#10B981" : 
                                              userData.stressLevel === "medium" ? "#F59E0B" : "#EF4444" 
                            }}
                          ></div>
                        </div>
                      </div>
                      
                      <div className="p-3 rounded-lg bg-medical-gray-100">
                        <p className="text-sm text-medical-gray-700">
                          {userData.stressLevel === "low" ? 
                            "Your stress level is low, which is excellent for overall health. Continue your stress management practices." : 
                            "Consider incorporating stress-reduction techniques like meditation, deep breathing, or physical activity."}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="card-glass">
                  <h3 className="text-lg font-semibold mb-4 text-medical-gray-900">Work-Life Balance</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="col-span-1">
                      <div className="mb-4">
                        <span className="text-sm text-medical-gray-600">Job Type</span>
                        <p className="text-lg font-medium text-medical-gray-900 capitalize">{userData.jobType || "Not specified"}</p>
                      </div>
                      
                      <div className="mb-4">
                        <span className="text-sm text-medical-gray-600">Working Hours</span>
                        <p className="text-lg font-medium text-medical-gray-900">{userData.workingHours || 0} hours/week</p>
                      </div>
                      
                      <div>
                        <span className="text-sm text-medical-gray-600">Work Impact</span>
                        <p className="text-lg font-medium" style={{ 
                          color: userData.workingHours && userData.workingHours > 50 ? "#EF4444" : 
                                 userData.workingHours && userData.workingHours > 40 ? "#F59E0B" : "#10B981"
                        }}>
                          {userData.workingHours && userData.workingHours > 50 ? "High" : 
                           userData.workingHours && userData.workingHours > 40 ? "Moderate" : "Low"}
                        </p>
                      </div>
                    </div>
                    
                    <div className="col-span-1 md:col-span-2">
                      <div className="p-4 rounded-lg bg-medical-gray-100 h-full">
                        <h4 className="font-medium text-medical-gray-900 mb-2">Insights & Recommendations</h4>
                        <ul className="space-y-2 text-sm text-medical-gray-700">
                          {userData.workingHours && userData.workingHours > 50 && (
                            <li className="flex items-start">
                              <AlertTriangle className="h-4 w-4 text-red-500 mt-0.5 mr-2 flex-shrink-0" />
                              <p>Working more than 50 hours per week is associated with increased stress and reduced wellbeing.</p>
                            </li>
                          )}
                          
                          {userData.jobType === "sedentary" && (
                            <li className="flex items-start">
                              <AlertTriangle className="h-4 w-4 text-amber-500 mt-0.5 mr-2 flex-shrink-0" />
                              <p>Sedentary work increases health risks. Take regular movement breaks (5 minutes every hour).</p>
                            </li>
                          )}
                          
                          <li className="flex items-start">
                            <ShieldCheck className="h-4 w-4 text-medical-blue mt-0.5 mr-2 flex-shrink-0" />
                            <p>Establish clear boundaries between work and personal time to improve mental wellbeing.</p>
                          </li>
                          
                          <li className="flex items-start">
                            <ShieldCheck className="h-4 w-4 text-medical-blue mt-0.5 mr-2 flex-shrink-0" />
                            <p>Schedule regular physical activity to counteract the effects of {userData.jobType || "your"} work.</p>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="medications" className="mt-6">
                <FadeIn delay={300}>
                  <div className="mb-8">
                    <h2 className="text-2xl font-bold mb-6 flex items-center text-medical-gray-900">
                      <Pill size={24} className="mr-2 text-medical-blue" />
                      Medication Management
                    </h2>
                    
                    <p className="text-medical-gray-600 mb-6">
                      Track your medications, get interaction warnings, and view personalized vitamin recommendations 
                      based on your medication profile.
                    </p>
                    
                    <MedicationManager />
                  </div>
                  
                  {userData.medications && userData.medications.length > 0 && (
                    <div className="mt-12">
                      <h2 className="text-2xl font-bold mb-6 flex items-center text-medical-gray-900">
                        <Activity size={24} className="mr-2 text-medical-green" />
                        Your Vitamin Recommendations
                      </h2>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {vitaminRecommendations && vitaminRecommendations.length > 0 ? (
                          vitaminRecommendations.map((vitamin, index) => (
                            <div key={index} className="card-glass">
                              <div className="bg-medical-green-50 px-4 py-3 rounded-t-lg border-b border-medical-green-200">
                                <h3 className="font-semibold text-medical-green-800 flex items-center">
                                  <Pill className="h-4 w-4 mr-2" />
                                  {vitamin.name} ({vitamin.dosage})
                                </h3>
                              </div>
                              <div className="p-4">
                                <p className="text-sm text-medical-gray-700 mb-3">
                                  <span className="font-medium">Why it's recommended:</span> {vitamin.reason}
                                </p>
                                
                                <div className="mb-3">
                                  <h4 className="text-sm font-semibold text-medical-gray-700 mb-2">
                                    Food Sources:
                                  </h4>
                                  <ul className="list-disc pl-5 text-sm text-medical-gray-600 grid grid-cols-2 gap-x-2">
                                    {vitamin.foodSources.map((food, idx) => (
                                      <li key={idx}>{food}</li>
                                    ))}
                                  </ul>
                                </div>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="col-span-full text-center p-8 border border-dashed rounded-lg">
                            <AlertTriangle className="h-12 w-12 text-medical-gray-400 mx-auto mb-3" />
                            <p className="text-medical-gray-500 mb-2">
                              No vitamin recommendations yet
                            </p>
                            <p className="text-sm text-medical-gray-400">
                              Add your medications to get personalized vitamin recommendations
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </FadeIn>
              </TabsContent>
              
              <TabsContent value="vitamins" className="mt-6">
                <FadeIn delay={300}>
                  <div className="mb-8">
                    <h2 className="text-2xl font-bold mb-6 flex items-center text-medical-gray-900">
                      <Leaf size={24} className="mr-2 text-green-600" />
                      Vitamin & Supplement Recommendations
                    </h2>
                    
                    <p className="text-medical-gray-600 mb-6">
                      Based on your age, health conditions, medications, and lifestyle factors, here are personalized 
                      vitamin and supplement recommendations to support your health goals.
                    </p>
                    
                    <VitaminRecommendations />
                  </div>
                </FadeIn>
              </TabsContent>
              
              <TabsContent value="recommendations" className="mt-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                  <div className="card-glass col-span-1">
                    <h3 className="text-lg font-semibold mb-4 text-medical-gray-900">Recommendation Breakdown</h3>
                    <ResponsiveContainer width="100%" height={200}>
                      <PieChart>
                        <Pie
                          data={recommendationCategoryData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={70}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, value }) => `${name} (${value})`}
                        >
                          {recommendationCategoryData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                    
                    <div className="mt-4 p-3 rounded-lg bg-medical-gray-100">
                      <p className="text-sm text-medical-gray-700">
                        Your personalized recommendations are based on your health profile data.
                      </p>
                    </div>
                  </div>
                  
                  <div className="card-glass col-span-1 lg:col-span-2">
                    <h3 className="text-lg font-semibold mb-4 text-medical-gray-900">Priority Recommendations</h3>
                    
                    <div className="space-y-4">
                      {recommendations.length > 0 ? (
                        recommendations
                          .filter(rec => rec.priority === 'high')
                          .slice(0, 3)
                          .map((rec, index) => (
                            <div key={index} className="flex items-start p-3 rounded-lg bg-medical-gray-100">
                              <div className={`p-2 rounded-full mr-3 ${
                                rec.category === 'lifestyle' ? 'bg-blue-100 text-blue-600' :
                                rec.category === 'diet' ? 'bg-green-100 text-green-600' :
                                rec.category === 'exercise' ? 'bg-orange-100 text-orange-600' :
                                rec.category === 'medical' ? 'bg-red-100 text-red-600' :
                                'bg-purple-100 text-purple-600'
                              }`}>
                                {rec.icon === 'Activity' && <Activity className="h-5 w-5" />}
                                {rec.icon === 'Moon' && <Moon className="h-5 w-5" />}
                                {rec.icon === 'Salad' && <Salad className="h-5 w-5" />}
                                {rec.icon === 'Heart' && <Heart className="h-5 w-5" />}
                                {rec.icon === 'Brain' && <Brain className="h-5 w-5" />}
                                {rec.icon === 'ShieldCheck' && <ShieldCheck className="h-5 w-5" />}
                                {rec.icon === 'Droplets' && <Droplets className="h-5 w-5" />}
                              </div>
                              <div>
                                <h4 className="font-medium text-medical-gray-900">{rec.title}</h4>
                                <p className="text-sm text-medical-gray-600">{rec.description}</p>
                              </div>
                            </div>
                          ))
                      ) : (
                        <div className="flex flex-col items-center justify-center p-6">
                          <AlertTriangle className="h-12 w-12 text-medical-gray-400 mb-3" />
                          <p className="text-medical-gray-500 text-center">
                            No recommendations generated yet.
                          </p>
                          <button 
                            onClick={() => navigate('/recommendations')}
                            className="mt-4 btn-primary py-2"
                          >
                            View All Recommendations
                          </button>
                        </div>
                      )}
                    </div>
                    
                    {recommendations.length > 0 && (
                      <div className="mt-6 text-center">
                        <button 
                          onClick={() => navigate('/recommendations')}
                          className="btn-secondary py-2"
                        >
                          View All Recommendations
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="card-glass">
                  <h3 className="text-lg font-semibold mb-4 text-medical-gray-900">Health Goals</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="col-span-1 md:col-span-3">
                      <p className="text-medical-gray-600 mb-4">
                        Based on your profile, here are some suggested health goals to focus on:
                      </p>
                      
                      <div className="space-y-4">
                        {userData.stressLevel === "high" && (
                          <div className="flex items-start p-3 rounded-lg bg-medical-gray-100">
                            <Brain className="h-5 w-5 text-purple-600 mt-1 mr-3" />
                            <div>
                              <h4 className="font-medium text-medical-gray-900">Reduce Stress Levels</h4>
                              <p className="text-sm text-medical-gray-600">
                                Try to incorporate stress reduction techniques like meditation, deep breathing exercises, or yoga into your daily routine.
                              </p>
                            </div>
                          </div>
                        )}
                        
                        {userData.exerciseFrequency !== "frequent" && (
                          <div className="flex items-start p-3 rounded-lg bg-medical-gray-100">
                            <Dumbbell className="h-5 w-5 text-orange-600 mt-1 mr-3" />
                            <div>
                              <h4 className="font-medium text-medical-gray-900">Increase Physical Activity</h4>
                              <p className="text-sm text-medical-gray-600">
                                Aim for at least 150 minutes of moderate exercise per week, or about 30 minutes most days.
                              </p>
                            </div>
                          </div>
                        )}
                        
                        {userData.sleepHours && userData.sleepHours < 7 && (
                          <div className="flex items-start p-3 rounded-lg bg-medical-gray-100">
                            <Moon className="h-5 w-5 text-blue-600 mt-1 mr-3" />
                            <div>
                              <h4 className="font-medium text-medical-gray-900">Improve Sleep Quality</h4>
                              <p className="text-sm text-medical-gray-600">
                                Work on getting 7-9 hours of quality sleep each night by establishing a consistent sleep schedule.
                              </p>
                            </div>
                          </div>
                        )}
                        
                        {bmi && parseFloat(bmi) > 25 && (
                          <div className="flex items-start p-3 rounded-lg bg-medical-gray-100">
                            <Activity className="h-5 w-5 text-green-600 mt-1 mr-3" />
                            <div>
                              <h4 className="font-medium text-medical-gray-900">Weight Management</h4>
                              <p className="text-sm text-medical-gray-600">
                                Focus on gradual weight loss through balanced nutrition and regular physical activity.
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </FadeIn>
        </div>
        
        <div className="lg:col-span-1">
          <FadeIn delay={300}>
            <StepByStep />
          </FadeIn>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
