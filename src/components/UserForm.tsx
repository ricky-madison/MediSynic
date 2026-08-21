
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserData } from '@/context/UserDataContext';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import FadeIn from './FadeIn';
import { toast } from "sonner";
import { 
  User, 
  Heart, 
  MapPin, 
  Briefcase, 
  Home, 
  Pill, 
  Moon, 
  AlertCircle,
  ChevronRight,
  ChevronLeft,
  Activity,
  TestTube,
  FlaskConical,
  Stethoscope
} from 'lucide-react';

interface UserFormProps {
  onAssessmentComplete?: () => void;
}

const UserForm: React.FC<UserFormProps> = ({ onAssessmentComplete }) => {
  const { userData, setUserData, generateRecommendations } = useUserData();
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const totalSteps = 6; // Increased from 4 to 6 to add medical tests
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    if (type === 'number') {
      setUserData(prev => ({
        ...prev,
        [name]: value === '' ? undefined : Number(value)
      }));
    } else {
      setUserData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };
  
  // Handle nested data like bloodWork or cancerMarkers
  const handleNestedInputChange = (category: string, field: string, value: string | number) => {
    const numValue = typeof value === 'string' && !isNaN(Number(value)) ? 
      Number(value) : value;
    
    setUserData(prev => ({
      ...prev,
      [category]: {
        ...(prev[category as keyof typeof prev] as object || {}),
        [field]: numValue === '' ? undefined : numValue
      }
    }));
  };
  
  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setUserData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Updated to handle string arrays for conditions, allergies, etc.
  const handleMultiSelectChange = (e: React.ChangeEvent<HTMLSelectElement>, field: string) => {
    const options = e.target.options;
    const selectedValues = [];
    
    for (let i = 0; i < options.length; i++) {
      if (options[i].selected) {
        selectedValues.push(options[i].value);
      }
    }
    
    setUserData(prev => ({
      ...prev,
      [field]: selectedValues
    }));
  };
  
  const saveAssessmentToSupabase = async () => {
    try {
      if (!isAuthenticated || !user?.id) {
        console.log('User not authenticated, skipping Supabase save');
        return;
      }
      
      // Calculate a simple diabetes risk score based on userData
      // This is a placeholder - in a real app, you'd use a medically validated algorithm
      let riskScore = 0;
      
      // Age factor - older age increases risk
      if (userData.age) {
        if (userData.age > 45) riskScore += 1;
        if (userData.age > 60) riskScore += 1;
      }
      
      // BMI calculation if both height and weight are available
      if (userData.height && userData.weight) {
        const heightInMeters = userData.height / 100;
        const bmi = userData.weight / (heightInMeters * heightInMeters);
        if (bmi > 25) riskScore += 1;
        if (bmi > 30) riskScore += 2;
      }
      
      // Waist circumference factor
      if (userData.waist) {
        const highWaist = (userData.sex === 'male' && userData.waist > 102) || 
                        (userData.sex === 'female' && userData.waist > 88);
        if (highWaist) riskScore += 2;
      }
      
      // Family history of diabetes
      if (userData.familyHistory?.includes('diabetes')) {
        riskScore += 2;
      }
      
      // Exercise factor
      if (userData.exerciseFrequency === 'sedentary' || userData.exerciseFrequency === 'light') {
        riskScore += 1;
      }
      
      // Blood pressure factor
      if (userData.vitalSigns?.bloodPressureSystolic > 130 || userData.vitalSigns?.bloodPressureDiastolic > 85) {
        riskScore += 1;
      }
      
      // Create a JSON-safe version of userData
      // This converts any complex objects to a JSON-compatible format
      const jsonSafeData = JSON.parse(JSON.stringify(userData));
      
      // Save the assessment to Supabase
      const { data, error } = await supabase
        .from('diabetes_assessments')
        .insert({
          user_id: user.id,
          assessment_data: jsonSafeData,
          score: riskScore
        });
        
      if (error) {
        throw error;
      }
      
      return data;
    } catch (error) {
      console.error('Error saving assessment to Supabase:', error);
      throw error;
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Generate local recommendations
      generateRecommendations();
      
      // Save assessment to Supabase if user is authenticated
      if (isAuthenticated) {
        await saveAssessmentToSupabase();
        toast.success("Assessment saved successfully!");
        
        // Call the callback function if provided
        if (onAssessmentComplete) {
          onAssessmentComplete();
        }
      } else {
        toast.warning("Sign in to save your assessment history");
      }
      
      navigate('/recommendations');
    } catch (error) {
      console.error('Error in handleSubmit:', error);
      toast.error("Failed to save assessment. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(prev => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };
  
  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };
  
  const renderStepIndicators = () => {
    return (
      <div className="flex justify-center mb-8">
        {Array.from({ length: totalSteps }).map((_, index) => (
          <div 
            key={index}
            className={`relative flex items-center ${index > 0 ? 'flex-1' : ''}`}
          >
            {index > 0 && (
              <div 
                className={`h-1 flex-grow transition-all duration-500 ${
                  index < currentStep ? 'bg-medical-blue' : 'bg-medical-gray-300'
                }`}
              />
            )}
            
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-300 ${
                index + 1 === currentStep
                  ? 'bg-medical-blue text-white shadow-button'
                  : index + 1 < currentStep
                  ? 'bg-medical-blue text-white'
                  : 'bg-white text-medical-gray-500 border border-medical-gray-300'
              }`}
            >
              {index + 1 < currentStep ? '✓' : index + 1}
            </div>
            
            <div 
              className={`absolute -bottom-6 text-xs font-medium left-1/2 transform -translate-x-1/2 whitespace-nowrap ${
                index + 1 === currentStep ? 'text-medical-blue' : 'text-medical-gray-500'
              }`}
            >
              {['Personal', 'Lifestyle', 'Location', 'Medical', 'Blood Tests', 'Cancer Markers'][index]}
            </div>
          </div>
        ))}
      </div>
    );
  };
  
  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1: // Personal Information
        return (
          <div className="space-y-6 animate-fade-in">
            <FadeIn delay={100}>
              <div className="flex items-center mb-2">
                <User size={18} className="text-medical-blue mr-2" />
                <h2 className="text-xl font-semibold text-medical-gray-900">Personal Information</h2>
              </div>
              <p className="text-sm text-medical-gray-500 mb-6">
                Basic information helps us personalize your recommendations.
              </p>
            </FadeIn>
            
            <FadeIn delay={200} className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-medical-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={userData.name || ''}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="John Doe"
                />
              </div>
              
              <div>
                <label htmlFor="age" className="block text-sm font-medium text-medical-gray-700 mb-1">
                  Age
                </label>
                <input
                  type="number"
                  id="age"
                  name="age"
                  value={userData.age || ''}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="35"
                  min="0"
                  max="120"
                />
              </div>
            </FadeIn>
            
            <FadeIn delay={300} className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label htmlFor="sex" className="block text-sm font-medium text-medical-gray-700 mb-1">
                  Sex
                </label>
                <select
                  id="sex"
                  name="sex"
                  value={userData.sex || ''}
                  onChange={handleSelectChange}
                  className="form-input"
                >
                  <option value="">Select...</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="weight" className="block text-sm font-medium text-medical-gray-700 mb-1">
                  Weight (kg)
                </label>
                <input
                  type="number"
                  id="weight"
                  name="weight"
                  value={userData.weight || ''}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="70"
                  min="0"
                  max="300"
                />
              </div>
            </FadeIn>
            
            <FadeIn delay={400} className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label htmlFor="height" className="block text-sm font-medium text-medical-gray-700 mb-1">
                  Height (cm)
                </label>
                <input
                  type="number"
                  id="height"
                  name="height"
                  value={userData.height || ''}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="175"
                  min="0"
                  max="250"
                />
              </div>
              
              <div>
                <label htmlFor="waist" className="block text-sm font-medium text-medical-gray-700 mb-1">
                  Waist Circumference (cm)
                </label>
                <input
                  type="number"
                  id="waist"
                  name="waist"
                  value={userData.waist || ''}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="85"
                  min="0"
                  max="200"
                />
              </div>
            </FadeIn>
          </div>
        );
        
      case 2: // Lifestyle Information
        return (
          <div className="space-y-6 animate-fade-in">
            <FadeIn delay={100}>
              <div className="flex items-center mb-2">
                <Heart size={18} className="text-medical-blue mr-2" />
                <h2 className="text-xl font-semibold text-medical-gray-900">Lifestyle Information</h2>
              </div>
              <p className="text-sm text-medical-gray-500 mb-6">
                Your lifestyle details help us understand your health context better.
              </p>
            </FadeIn>
            
            <FadeIn delay={200} className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label htmlFor="maritalStatus" className="block text-sm font-medium text-medical-gray-700 mb-1">
                  Marital Status
                </label>
                <select
                  id="maritalStatus"
                  name="maritalStatus"
                  value={userData.maritalStatus || ''}
                  onChange={handleSelectChange}
                  className="form-input"
                >
                  <option value="">Select...</option>
                  <option value="single">Single</option>
                  <option value="married">Married</option>
                  <option value="divorced">Divorced</option>
                  <option value="widowed">Widowed</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="children" className="block text-sm font-medium text-medical-gray-700 mb-1">
                  Number of Children
                </label>
                <input
                  type="number"
                  id="children"
                  name="children"
                  value={userData.children || ''}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="0"
                  min="0"
                  max="20"
                />
              </div>
            </FadeIn>
            
            <FadeIn delay={300} className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label htmlFor="jobType" className="block text-sm font-medium text-medical-gray-700 mb-1">
                  Job Type
                </label>
                <select
                  id="jobType"
                  name="jobType"
                  value={userData.jobType || ''}
                  onChange={handleSelectChange}
                  className="form-input"
                >
                  <option value="">Select...</option>
                  <option value="sedentary">Sedentary (Office Job)</option>
                  <option value="light-activity">Light Activity</option>
                  <option value="moderate-activity">Moderate Activity</option>
                  <option value="heavy-activity">Heavy Activity</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="workingHours" className="block text-sm font-medium text-medical-gray-700 mb-1">
                  Working Hours per Week
                </label>
                <input
                  type="number"
                  id="workingHours"
                  name="workingHours"
                  value={userData.workingHours || ''}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="40"
                  min="0"
                  max="168"
                />
              </div>
            </FadeIn>
            
            <FadeIn delay={400} className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label htmlFor="sleepHours" className="block text-sm font-medium text-medical-gray-700 mb-1">
                  Average Sleep Hours per Night
                </label>
                <input
                  type="number"
                  id="sleepHours"
                  name="sleepHours"
                  value={userData.sleepHours || ''}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="7"
                  min="0"
                  max="24"
                  step="0.5"
                />
              </div>
              
              <div>
                <label htmlFor="stressLevel" className="block text-sm font-medium text-medical-gray-700 mb-1">
                  Perceived Stress Level
                </label>
                <select
                  id="stressLevel"
                  name="stressLevel"
                  value={userData.stressLevel || ''}
                  onChange={handleSelectChange}
                  className="form-input"
                >
                  <option value="">Select...</option>
                  <option value="low">Low</option>
                  <option value="moderate">Moderate</option>
                  <option value="high">High</option>
                  <option value="very-high">Very High</option>
                </select>
              </div>
            </FadeIn>

            <FadeIn delay={500} className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label htmlFor="smokingStatus" className="block text-sm font-medium text-medical-gray-700 mb-1">
                  Smoking Status
                </label>
                <select
                  id="smokingStatus"
                  name="smokingStatus"
                  value={userData.smokingStatus || ''}
                  onChange={handleSelectChange}
                  className="form-input"
                >
                  <option value="">Select...</option>
                  <option value="never">Never Smoked</option>
                  <option value="former">Former Smoker</option>
                  <option value="occasional">Occasional Smoker</option>
                  <option value="regular">Regular Smoker</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="alcoholConsumption" className="block text-sm font-medium text-medical-gray-700 mb-1">
                  Alcohol Consumption
                </label>
                <select
                  id="alcoholConsumption"
                  name="alcoholConsumption"
                  value={userData.alcoholConsumption || ''}
                  onChange={handleSelectChange}
                  className="form-input"
                >
                  <option value="">Select...</option>
                  <option value="none">None</option>
                  <option value="occasional">Occasional (1-2 drinks/week)</option>
                  <option value="moderate">Moderate (3-7 drinks/week)</option>
                  <option value="heavy">Heavy (8+ drinks/week)</option>
                </select>
              </div>
            </FadeIn>
          </div>
        );
        
      case 3: // Location
        return (
          <div className="space-y-6 animate-fade-in">
            <FadeIn delay={100}>
              <div className="flex items-center mb-2">
                <MapPin size={18} className="text-medical-blue mr-2" />
                <h2 className="text-xl font-semibold text-medical-gray-900">Location Information</h2>
              </div>
              <p className="text-sm text-medical-gray-500 mb-6">
                Your region can influence health recommendations due to environmental factors.
              </p>
            </FadeIn>
            
            <FadeIn delay={200}>
              <div>
                <label htmlFor="region" className="block text-sm font-medium text-medical-gray-700 mb-1">
                  Region/Country
                </label>
                <select
                  id="region"
                  name="region"
                  value={userData.region || ''}
                  onChange={handleSelectChange}
                  className="form-input"
                >
                  <option value="">Select...</option>
                  <option value="north-america">North America</option>
                  <option value="south-america">South America</option>
                  <option value="europe">Europe</option>
                  <option value="asia">Asia</option>
                  <option value="africa">Africa</option>
                  <option value="australia">Australia</option>
                </select>
              </div>
            </FadeIn>
            
            <FadeIn delay={300} className="bg-blue-50 p-6 rounded-xl">
              <div className="flex items-start">
                <AlertCircle size={20} className="text-medical-blue mr-3 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-medium text-medical-gray-900 mb-1">Why we ask for location</h3>
                  <p className="text-sm text-medical-gray-600">
                    Different regions have different health risks, environments, and access to healthcare. 
                    This information helps us provide more relevant recommendations based on regional factors 
                    like climate, endemic health issues, and available healthcare resources.
                  </p>
                </div>
              </div>
            </FadeIn>
          </div>
        );
        
      case 4: // Medical Information
        return (
          <div className="space-y-6 animate-fade-in">
            <FadeIn delay={100}>
              <div className="flex items-center mb-2">
                <Pill size={18} className="text-medical-blue mr-2" />
                <h2 className="text-xl font-semibold text-medical-gray-900">Medical Information</h2>
              </div>
              <p className="text-sm text-medical-gray-500 mb-6">
                Your medical details help us provide more accurate recommendations and identify potential drug interactions.
              </p>
            </FadeIn>
            
            <FadeIn delay={200}>
              <div>
                <label htmlFor="conditions" className="block text-sm font-medium text-medical-gray-700 mb-1">
                  Medical Conditions (Select multiple if applicable)
                </label>
                <select
                  id="conditions"
                  name="conditions"
                  multiple
                  value={userData.conditions || []}
                  onChange={(e) => handleMultiSelectChange(e, 'conditions')}
                  className="form-input h-32"
                >
                  <option value="none">None</option>
                  <option value="hypertension">Hypertension (High Blood Pressure)</option>
                  <option value="diabetes">Diabetes</option>
                  <option value="hypercholesterolemia">High Cholesterol</option>
                  <option value="hypothyroidism">Hypothyroidism</option>
                  <option value="hyperthyroidism">Hyperthyroidism</option>
                  <option value="heart_disease">Heart Disease</option>
                  <option value="asthma">Asthma</option>
                  <option value="copd">COPD</option>
                  <option value="arthritis">Arthritis</option>
                  <option value="depression">Depression</option>
                  <option value="anxiety">Anxiety</option>
                  <option value="ibs">Irritable Bowel Syndrome</option>
                  <option value="gerd">GERD (Acid Reflux)</option>
                  <option value="cancer">Cancer (Past or Present)</option>
                  <option value="autoimmune">Autoimmune Disorder</option>
                  <option value="kidney_disease">Kidney Disease</option>
                  <option value="liver_disease">Liver Disease</option>
                  <option value="migraine">Migraines</option>
                  <option value="other">Other</option>
                </select>
                <p className="text-xs text-medical-gray-500 mt-1">Hold Ctrl/Cmd to select multiple options</p>
              </div>
            </FadeIn>
            
            <FadeIn delay={400}>
              <div>
                <label htmlFor="allergies" className="block text-sm font-medium text-medical-gray-700 mb-1">
                  Allergies (Select multiple if applicable)
                </label>
                <select
                  id="allergies"
                  name="allergies"
                  multiple
                  value={userData.allergies || []}
                  onChange={(e) => handleMultiSelectChange(e, 'allergies')}
                  className="form-input h-24"
                >
                  <option value="none">None</option>
                  <option value="peanuts">Peanuts</option>
                  <option value="tree_nuts">Tree Nuts</option>
                  <option value="shellfish">Shellfish</option>
                  <option value="fish">Fish</option>
                  <option value="eggs">Eggs</option>
                  <option value="milk">Milk/Dairy</option>
                  <option value="wheat">Wheat</option>
                  <option value="soy">Soy</option>
                  <option value="penicillin">Penicillin</option>
                  <option value="sulfa">Sulfa Drugs</option>
                  <option value="nsaids">NSAIDs</option>
                  <option value="pollen">Pollen</option>
                  <option value="dust">Dust</option>
                  <option value="mold">Mold</option>
                  <option value="other">Other</option>
                </select>
                <p className="text-xs text-medical-gray-500 mt-1">Hold Ctrl/Cmd to select multiple options</p>
              </div>
            </FadeIn>
            
            <FadeIn delay={500}>
              <div>
                <label htmlFor="familyHistory" className="block text-sm font-medium text-medical-gray-700 mb-1">
                  Family History (Select multiple if applicable)
                </label>
                <select
                  id="familyHistory"
                  name="familyHistory"
                  multiple
                  value={userData.familyHistory || []}
                  onChange={(e) => handleMultiSelectChange(e, 'familyHistory')}
                  className="form-input h-24"
                >
                  <option value="none">None</option>
                  <option value="heart_disease">Heart Disease</option>
                  <option value="stroke">Stroke</option>
                  <option value="diabetes">Diabetes</option>
                  <option value="cancer_breast">Breast Cancer</option>
                  <option value="cancer_colon">Colorectal Cancer</option>
                  <option value="cancer_prostate">Prostate Cancer</option>
                  <option value="cancer_lung">Lung Cancer</option>
                  <option value="cancer_other">Other Cancer</option>
                  <option value="alzheimers">Alzheimer's Disease</option>
                  <option value="parkinsons">Parkinson's Disease</option>
                  <option value="autoimmune">Autoimmune Disorders</option>
                  <option value="thyroid">Thyroid Disorders</option>
                  <option value="high_blood_pressure">High Blood Pressure</option>
                  <option value="high_cholesterol">High Cholesterol</option>
                  <option value="other">Other</option>
                </select>
                <p className="text-xs text-medical-gray-500 mt-1">Hold Ctrl/Cmd to select multiple options</p>
              </div>
            </FadeIn>
            
            <FadeIn delay={600}>
              <div>
                <label htmlFor="dietType" className="block text-sm font-medium text-medical-gray-700 mb-1">
                  Diet Type
                </label>
                <select
                  id="dietType"
                  name="dietType"
                  value={userData.dietType || ''}
                  onChange={handleSelectChange}
                  className="form-input"
                >
                  <option value="">Select...</option>
                  <option value="omnivore">Omnivore (Mixed Diet)</option>
                  <option value="vegetarian">Vegetarian</option>
                  <option value="vegan">Vegan</option>
                  <option value="pescatarian">Pescatarian</option>
                  <option value="keto">Keto</option>
                  <option value="paleo">Paleo</option>
                  <option value="mediterranean">Mediterranean</option>
                  <option value="gluten_free">Gluten-Free</option>
                  <option value="low_carb">Low Carb</option>
                  <option value="irregular">Irregular</option>
                </select>
              </div>
            </FadeIn>
            
            <FadeIn delay={700}>
              <div>
                <label htmlFor="exerciseFrequency" className="block text-sm font-medium text-medical-gray-700 mb-1">
                  Exercise Frequency
                </label>
                <select
                  id="exerciseFrequency"
                  name="exerciseFrequency"
                  value={userData.exerciseFrequency || ''}
                  onChange={handleSelectChange}
                  className="form-input"
                >
                  <option value="">Select...</option>
                  <option value="sedentary">Sedentary (Rarely Exercise)</option>
                  <option value="light">Light (1-2 days/week)</option>
                  <option value="moderate">Moderate (3-4 days/week)</option>
                  <option value="active">Active (5+ days/week)</option>
                  <option value="very-active">Very Active (Daily intense exercise)</option>
                </select>
              </div>
            </FadeIn>
            
            <FadeIn delay={800} className="bg-medical-green-light p-6 rounded-xl">
              <div className="flex items-start">
                <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center mr-3 flex-shrink-0">
                  <Heart size={18} className="text-medical-green" />
                </div>
                <div>
                  <h3 className="font-medium text-medical-gray-900 mb-1">Privacy Notice</h3>
                  <p className="text-sm text-medical-gray-600">
                    Your medical information is kept private and secure. We use this data only to 
                    generate personalized recommendations and do not share it with third parties.
                  </p>
                </div>
              </div>
            </FadeIn>
          </div>
        );

      case 5: // Blood Test Data
        return (
          <div className="space-y-6 animate-fade-in">
            <FadeIn delay={100}>
              <div className="flex items-center mb-2">
                <TestTube size={18} className="text-medical-blue mr-2" />
                <h2 className="text-xl font-semibold text-medical-gray-900">Complete Blood Count (CBC)</h2>
              </div>
              <p className="text-sm text-medical-gray-500 mb-6">
                Enter your most recent blood test results if available. These values help us provide more accurate health recommendations.
              </p>
            </FadeIn>
            
            <FadeIn delay={200}>
              <div>
                <label htmlFor="bloodWorkLastTestDate" className="block text-sm font-medium text-medical-gray-700 mb-1">
                  Date of Last Blood Test
                </label>
                <input
                  type="date"
                  id="bloodWorkLastTestDate"
                  name="lastTestDate"
                  value={(userData.bloodWork?.lastTestDate) || ''}
                  onChange={(e) => handleNestedInputChange('bloodWork', 'lastTestDate', e.target.value)}
                  className="form-input"
                />
              </div>
            </FadeIn>
            
            <FadeIn delay={300} className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label htmlFor="redBloodCellCount" className="block text-sm font-medium text-medical-gray-700 mb-1">
                  Red Blood Cell Count (RBC) (million cells/µL)
                </label>
                <input
                  type="number"
                  id="redBloodCellCount"
                  name="redBloodCellCount"
                  value={(userData.bloodWork?.redBloodCellCount) || ''}
                  onChange={(e) => handleNestedInputChange('bloodWork', 'redBloodCellCount', e.target.value)}
                  className="form-input"
                  placeholder="4.5"
                  step="0.1"
                  min="0"
                />
                <p className="text-xs text-medical-gray-500 mt-1">Normal range: 4.5-5.9 for men, 4.1-5.1 for women</p>
              </div>
              
              <div>
                <label htmlFor="whiteBloodCellCount" className="block text-sm font-medium text-medical-gray-700 mb-1">
                  White Blood Cell Count (WBC) (cells/µL)
                </label>
                <input
                  type="number"
                  id="whiteBloodCellCount"
                  name="whiteBloodCellCount"
                  value={(userData.bloodWork?.whiteBloodCellCount) || ''}
                  onChange={(e) => handleNestedInputChange('bloodWork', 'whiteBloodCellCount', e.target.value)}
                  className="form-input"
                  placeholder="7500"
                  step="100"
                  min="0"
                />
                <p className="text-xs text-medical-gray-500 mt-1">Normal range: 4,500-11,000 cells/µL</p>
              </div>
            </FadeIn>
            
            <FadeIn delay={400} className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label htmlFor="plateletCount" className="block text-sm font-medium text-medical-gray-700 mb-1">
                  Platelet Count (1000s/µL)
                </label>
                <input
                  type="number"
                  id="plateletCount"
                  name="plateletCount"
                  value={(userData.bloodWork?.plateletCount) || ''}
                  onChange={(e) => handleNestedInputChange('bloodWork', 'plateletCount', e.target.value)}
                  className="form-input"
                  placeholder="250"
                  step="5"
                  min="0"
                />
                <p className="text-xs text-medical-gray-500 mt-1">Normal range: 150-450 thousand/µL</p>
              </div>
              
              <div>
                <label htmlFor="hemoglobin" className="block text-sm font-medium text-medical-gray-700 mb-1">
                  Hemoglobin (g/dL)
                </label>
                <input
                  type="number"
                  id="hemoglobin"
                  name="hemoglobin"
                  value={(userData.bloodWork?.hemoglobin) || ''}
                  onChange={(e) => handleNestedInputChange('bloodWork', 'hemoglobin', e.target.value)}
                  className="form-input"
                  placeholder="14"
                  step="0.1"
                  min="0"
                />
                <p className="text-xs text-medical-gray-500 mt-1">Normal range: 13.5-17.5 for men, 12.0-15.5 for women</p>
              </div>
            </FadeIn>
            
            <FadeIn delay={500} className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label htmlFor="hematocrit" className="block text-sm font-medium text-medical-gray-700 mb-1">
                  Hematocrit (%)
                </label>
                <input
                  type="number"
                  id="hematocrit"
                  name="hematocrit"
                  value={(userData.bloodWork?.hematocrit) || ''}
                  onChange={(e) => handleNestedInputChange('bloodWork', 'hematocrit', e.target.value)}
                  className="form-input"
                  placeholder="42"
                  step="0.1"
                  min="0"
                  max="100"
                />
                <p className="text-xs text-medical-gray-500 mt-1">Normal range: 38.8-50% for men, 34.9-44.5% for women</p>
              </div>
              
              <div>
                <label htmlFor="mcv" className="block text-sm font-medium text-medical-gray-700 mb-1">
                  Mean Corpuscular Volume (MCV) (fL)
                </label>
                <input
                  type="number"
                  id="mcv"
                  name="mcv"
                  value={(userData.bloodWork?.mcv) || ''}
                  onChange={(e) => handleNestedInputChange('bloodWork', 'mcv', e.target.value)}
                  className="form-input"
                  placeholder="90"
                  step="0.1"
                  min="0"
                />
                <p className="text-xs text-medical-gray-500 mt-1">Normal range: 80-100 fL</p>
              </div>
            </FadeIn>
            
            <FadeIn delay={600} className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label htmlFor="mch" className="block text-sm font-medium text-medical-gray-700 mb-1">
                  Mean Corpuscular Hemoglobin (MCH) (pg)
                </label>
                <input
                  type="number"
                  id="mch"
                  name="mch"
                  value={(userData.bloodWork?.mch) || ''}
                  onChange={(e) => handleNestedInputChange('bloodWork', 'mch', e.target.value)}
                  className="form-input"
                  placeholder="30"
                  step="0.1"
                  min="0"
                />
                <p className="text-xs text-medical-gray-500 mt-1">Normal range: 27-33 pg</p>
              </div>
              
              <div>
                <label htmlFor="mchc" className="block text-sm font-medium text-medical-gray-700 mb-1">
                  Mean Corpuscular Hemoglobin Concentration (MCHC) (g/dL)
                </label>
                <input
                  type="number"
                  id="mchc"
                  name="mchc"
                  value={(userData.bloodWork?.mchc) || ''}
                  onChange={(e) => handleNestedInputChange('bloodWork', 'mchc', e.target.value)}
                  className="form-input"
                  placeholder="33"
                  step="0.1"
                  min="0"
                />
                <p className="text-xs text-medical-gray-500 mt-1">Normal range: 32-36 g/dL</p>
              </div>
            </FadeIn>
            
            <FadeIn delay={700} className="bg-blue-50 p-6 rounded-xl">
              <div className="flex items-start">
                <Stethoscope size={20} className="text-medical-blue mr-3 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-medium text-medical-gray-900 mb-1">Why We Ask For Blood Test Data</h3>
                  <p className="text-sm text-medical-gray-600">
                    Your blood test results provide valuable insights into your overall health. They help us identify potential 
                    nutrient deficiencies, disease risks, and areas where dietary or lifestyle changes might be beneficial. 
                    This is optional, but providing this data enables more personalized recommendations.
                  </p>
                </div>
              </div>
            </FadeIn>
          </div>
        );

      case 6: // Cancer Markers
        return (
          <div className="space-y-6 animate-fade-in">
            <FadeIn delay={100}>
              <div className="flex items-center mb-2">
                <FlaskConical size={18} className="text-medical-blue mr-2" />
                <h2 className="text-xl font-semibold text-medical-gray-900">Cancer Biomarkers</h2>
              </div>
              <p className="text-sm text-medical-gray-500 mb-6">
                Enter any cancer biomarker test results if available. This is completely optional but can help provide more targeted health recommendations.
              </p>
            </FadeIn>
            
            <FadeIn delay={200}>
              <div>
                <label htmlFor="cancerMarkersLastTestDate" className="block text-sm font-medium text-medical-gray-700 mb-1">
                  Date of Last Biomarker Test
                </label>
                <input
                  type="date"
                  id="cancerMarkersLastTestDate"
                  name="lastTestDate"
                  value={(userData.cancerMarkers?.lastTestDate) || ''}
                  onChange={(e) => handleNestedInputChange('cancerMarkers', 'lastTestDate', e.target.value)}
                  className="form-input"
                />
              </div>
            </FadeIn>
            
            <FadeIn delay={300} className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label htmlFor="cea" className="block text-sm font-medium text-medical-gray-700 mb-1">
                  CEA (Carcinoembryonic Antigen) (ng/mL)
                </label>
                <input
                  type="number"
                  id="cea"
                  name="cea"
                  value={(userData.cancerMarkers?.cea) || ''}
                  onChange={(e) => handleNestedInputChange('cancerMarkers', 'cea', e.target.value)}
                  className="form-input"
                  placeholder="2.5"
                  step="0.1"
                  min="0"
                />
                <p className="text-xs text-medical-gray-500 mt-1">Normal range: 0-2.5 ng/mL for non-smokers, 0-5.0 ng/mL for smokers</p>
              </div>
              
              <div>
                <label htmlFor="ca125" className="block text-sm font-medium text-medical-gray-700 mb-1">
                  CA-125 (Cancer Antigen 125) (U/mL)
                </label>
                <input
                  type="number"
                  id="ca125"
                  name="ca125"
                  value={(userData.cancerMarkers?.ca125) || ''}
                  onChange={(e) => handleNestedInputChange('cancerMarkers', 'ca125', e.target.value)}
                  className="form-input"
                  placeholder="15"
                  step="0.1"
                  min="0"
                />
                <p className="text-xs text-medical-gray-500 mt-1">Normal range: 0-35 U/mL</p>
              </div>
            </FadeIn>
            
            <FadeIn delay={400} className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label htmlFor="ca199" className="block text-sm font-medium text-medical-gray-700 mb-1">
                  CA 19-9 (Cancer Antigen 19-9) (U/mL)
                </label>
                <input
                  type="number"
                  id="ca199"
                  name="ca199"
                  value={(userData.cancerMarkers?.ca199) || ''}
                  onChange={(e) => handleNestedInputChange('cancerMarkers', 'ca199', e.target.value)}
                  className="form-input"
                  placeholder="20"
                  step="0.1"
                  min="0"
                />
                <p className="text-xs text-medical-gray-500 mt-1">Normal range: 0-37 U/mL</p>
              </div>
              
              <div>
                <label htmlFor="psa" className="block text-sm font-medium text-medical-gray-700 mb-1">
                  PSA (Prostate-Specific Antigen) (ng/mL)
                </label>
                <input
                  type="number"
                  id="psa"
                  name="psa"
                  value={(userData.cancerMarkers?.psa) || ''}
                  onChange={(e) => handleNestedInputChange('cancerMarkers', 'psa', e.target.value)}
                  className="form-input"
                  placeholder="1.5"
                  step="0.1"
                  min="0"
                />
                <p className="text-xs text-medical-gray-500 mt-1">Normal range: 0-4.0 ng/mL (varies by age)</p>
              </div>
            </FadeIn>
            
            <FadeIn delay={500} className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label htmlFor="afp" className="block text-sm font-medium text-medical-gray-700 mb-1">
                  AFP (Alpha-Fetoprotein) (ng/mL)
                </label>
                <input
                  type="number"
                  id="afp"
                  name="afp"
                  value={(userData.cancerMarkers?.afp) || ''}
                  onChange={(e) => handleNestedInputChange('cancerMarkers', 'afp', e.target.value)}
                  className="form-input"
                  placeholder="5"
                  step="0.1"
                  min="0"
                />
                <p className="text-xs text-medical-gray-500 mt-1">Normal range: 0-10 ng/mL</p>
              </div>
              
              <div>
                <label htmlFor="vitalSigns" className="block text-sm font-medium text-medical-gray-700 mb-1">
                  Vital Signs
                </label>
                <div className="space-y-2">
                  <input
                    type="number"
                    placeholder="Blood Pressure (Systolic) mmHg"
                    value={(userData.vitalSigns?.bloodPressureSystolic) || ''}
                    onChange={(e) => handleNestedInputChange('vitalSigns', 'bloodPressureSystolic', e.target.value)}
                    className="form-input mb-2 w-full"
                  />
                  <input
                    type="number"
                    placeholder="Blood Pressure (Diastolic) mmHg"
                    value={(userData.vitalSigns?.bloodPressureDiastolic) || ''}
                    onChange={(e) => handleNestedInputChange('vitalSigns', 'bloodPressureDiastolic', e.target.value)}
                    className="form-input w-full"
                  />
                </div>
              </div>
            </FadeIn>
            
            <FadeIn delay={600} className="grid grid-cols-1 gap-6">
              <div>
                <label className="block text-sm font-medium text-medical-gray-700 mb-1">
                  Additional Vital Signs (Optional)
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <input
                    type="number"
                    placeholder="Heart Rate (bpm)"
                    value={(userData.vitalSigns?.heartRate) || ''}
                    onChange={(e) => handleNestedInputChange('vitalSigns', 'heartRate', e.target.value)}
                    className="form-input"
                  />
                  <input
                    type="number"
                    placeholder="Oxygen Level (%)"
                    value={(userData.vitalSigns?.oxygenLevel) || ''}
                    onChange={(e) => handleNestedInputChange('vitalSigns', 'oxygenLevel', e.target.value)}
                    className="form-input"
                  />
                  <input
                    type="number"
                    placeholder="Glucose Level (mg/dL)"
                    value={(userData.vitalSigns?.glucoseLevel) || ''}
                    onChange={(e) => handleNestedInputChange('vitalSigns', 'glucoseLevel', e.target.value)}
                    className="form-input"
                  />
                </div>
              </div>
            </FadeIn>
            
            <FadeIn delay={700} className="bg-blue-50 p-6 rounded-xl">
              <div className="flex items-start">
                <Activity size={20} className="text-medical-blue mr-3 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-medium text-medical-gray-900 mb-1">Important Notice</h3>
                  <p className="text-sm text-medical-gray-600">
                    The recommendations provided based on these markers are not a substitute for medical advice. 
                    Always consult with a healthcare professional for interpretation of test results and appropriate 
                    follow-up care. Abnormal values may require medical attention.
                  </p>
                </div>
              </div>
            </FadeIn>
          </div>
        );
        
      default:
        return null;
    }
  };
  
  return (
    <div className="w-full max-w-4xl mx-auto">
      <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6 md:p-8">
        {renderStepIndicators()}
        
        <div className="mt-12">
          {renderCurrentStep()}
        </div>
        
        <div className="mt-12 flex justify-between items-center">
          {currentStep > 1 ? (
            <button 
              type="button" 
              onClick={prevStep}
              className="btn-secondary flex items-center"
              disabled={isSubmitting}
            >
              <ChevronLeft size={18} className="mr-1" />
              Previous
            </button>
          ) : (
            <div></div>
          )}
          
          {currentStep < totalSteps ? (
            <button 
              type="button" 
              onClick={nextStep}
              className="btn-primary flex items-center"
              disabled={isSubmitting}
            >
              Next
              <ChevronRight size={18} className="ml-1" />
            </button>
          ) : (
            <button 
              type="submit" 
              className="btn-primary flex items-center"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
                  Processing...
                </>
              ) : (
                <>
                  Generate Recommendations
                  <ChevronRight size={18} className="ml-1" />
                </>
              )}
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default UserForm;
