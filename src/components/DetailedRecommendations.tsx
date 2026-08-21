
import React from 'react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Apple,
  Dumbbell,
  Heart,
  Brain,
  Thermometer,
  Pill,
  Activity,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { useUserData } from '@/context/UserDataContext';
import FadeIn from '@/components/FadeIn';

interface RecommendationItem {
  title: string;
  description: string;
  importance: 'high' | 'medium' | 'low';
  followUp?: string;
  idealValue?: string;
  currentValue?: string | number;
  status?: 'good' | 'warning' | 'alert';
}

const DetailedRecommendations = () => {
  const { userData } = useUserData();
  
  const getAgeBasedRecommendations = (): RecommendationItem[] => {
    const age = userData.age || 0;
    const diabeticRecommendations: RecommendationItem[] = [];
    
    // General diabetes recommendations for all ages
    diabeticRecommendations.push({
      title: 'Regular Glucose Monitoring',
      description: 'Monitor your blood glucose levels regularly to keep them within target range.',
      importance: 'high',
      followUp: 'Consult with your healthcare provider about the frequency of glucose monitoring based on your specific condition.',
      idealValue: 'Fasting: 80-130 mg/dL, Post-meal: <180 mg/dL'
    });
    
    diabeticRecommendations.push({
      title: 'HbA1c Testing',
      description: 'Get your HbA1c tested every 3-6 months to monitor long-term glucose control.',
      importance: 'high',
      idealValue: '<7.0% for most adults with diabetes'
    });
    
    // Age-specific recommendations
    if (age < 40) {
      diabeticRecommendations.push({
        title: 'Early Complication Screening',
        description: 'Begin regular screenings for diabetes complications early, as early detection can prevent progression.',
        importance: 'medium',
        followUp: 'Annual eye examinations, kidney function tests, and foot examinations are recommended.'
      });
      
      diabeticRecommendations.push({
        title: 'Fertility and Family Planning',
        description: 'For those considering pregnancy, optimal glucose control before and during pregnancy is crucial.',
        importance: 'medium',
        followUp: 'Consult with both your endocrinologist and an obstetrician experienced in managing diabetes during pregnancy.'
      });
    }
    else if (age >= 40 && age < 60) {
      diabeticRecommendations.push({
        title: 'Cardiovascular Risk Management',
        description: 'Increased focus on cardiovascular health as risk increases with age and diabetes duration.',
        importance: 'high',
        followUp: 'Regular blood pressure checks, lipid panel testing, and discussion of preventive medications with your doctor.'
      });
      
      diabeticRecommendations.push({
        title: 'Stress Management',
        description: 'Mid-life stressors can affect glucose control. Implement stress reduction techniques.',
        importance: 'medium',
        followUp: 'Consider mind-body therapies like meditation, yoga, or counseling if stress affects your diabetes management.'
      });
    }
    else {
      diabeticRecommendations.push({
        title: 'Fall Prevention',
        description: 'Older adults with diabetes have higher risk of falls due to possible neuropathy or vision issues.',
        importance: 'high',
        followUp: 'Home safety assessment, balance exercises, and proper footwear are recommended.'
      });
      
      diabeticRecommendations.push({
        title: 'Medication Review',
        description: 'Regular review of all medications to prevent adverse interactions and adjust dosages based on kidney function.',
        importance: 'high',
        followUp: "Bring all your medications to each doctor's appointment for a comprehensive review."
      });
      
      diabeticRecommendations.push({
        title: 'Simplified Regimen',
        description: 'Consider working with your healthcare provider to simplify your diabetes management regimen if needed.',
        importance: 'medium',
        followUp: 'Discuss options for less complex insulin schedules or medication routines if managing multiple daily injections becomes difficult.'
      });
    }
    
    return diabeticRecommendations;
  };
  
  const getDietRecommendations = (): RecommendationItem[] => {
    const dietRecs: RecommendationItem[] = [];
    
    // Basic diabetes diet recommendations
    dietRecs.push({
      title: 'Carbohydrate Management',
      description: 'Monitor and manage carbohydrate intake to help control blood glucose levels.',
      importance: 'high',
      followUp: 'Consider working with a registered dietitian to develop a personalized meal plan.'
    });
    
    dietRecs.push({
      title: 'Regular Meal Schedule',
      description: 'Maintain consistent meal timing to help regulate blood glucose levels.',
      importance: 'medium',
      followUp: 'Aim for 3 balanced meals and 2-3 healthy snacks at regular intervals throughout the day.'
    });
    
    dietRecs.push({
      title: 'Fiber-Rich Foods',
      description: 'Incorporate more fiber-rich foods to help improve blood glucose control and digestive health.',
      importance: 'medium',
      followUp: 'Aim for 25-30g of fiber daily from sources like vegetables, fruits, whole grains, and legumes.'
    });
    
    // Based on BMI
    if (userData.weight && userData.height) {
      const heightInM = userData.height / 100;
      const bmi = userData.weight / (heightInM * heightInM);
      
      if (bmi >= 30) {
        dietRecs.push({
          title: 'Weight Management',
          description: 'A modest weight loss of 5-10% can significantly improve blood glucose control.',
          importance: 'high',
          currentValue: bmi.toFixed(1),
          status: 'alert',
          followUp: 'Consider consulting with a dietitian and your healthcare provider about a safe weight loss plan.'
        });
      } else if (bmi >= 25) {
        dietRecs.push({
          title: 'Weight Maintenance Strategy',
          description: 'Maintaining a stable weight through balanced nutrition can help manage diabetes.',
          importance: 'medium',
          currentValue: bmi.toFixed(1),
          status: 'warning',
          followUp: 'Focus on nutrient-dense foods and portion control.'
        });
      } else {
        dietRecs.push({
          title: 'Nutritional Adequacy',
          description: "Ensure you're getting adequate nutrition while managing diabetes.",
          importance: 'medium',
          currentValue: bmi.toFixed(1),
          status: 'good',
          followUp: 'Continue balanced eating while monitoring carbohydrate intake.'
        });
      }
    }
    
    // Diet type recommendations
    if (userData.dietType) {
      if (userData.dietType === 'vegetarian' || userData.dietType === 'vegan') {
        dietRecs.push({
          title: 'Plant-Based Protein Sources',
          description: 'Ensure adequate protein intake from plant sources.',
          importance: 'medium',
          followUp: 'Include legumes, tofu, tempeh, nuts, and seeds regularly. Consider vitamin B12 supplementation.'
        });
      }
      else if (userData.dietType === 'low-carb' || userData.dietType === 'keto') {
        dietRecs.push({
          title: 'Balanced Low-Carb Approach',
          description: "While reducing carbs can help with glucose control, ensure it's done in a balanced way.",
          importance: 'medium',
          followUp: 'Focus on healthy fats, adequate protein, and non-starchy vegetables. Regular monitoring is important with low-carb diets.'
        });
      }
    }
    
    return dietRecs;
  };
  
  const getExerciseRecommendations = (): RecommendationItem[] => {
    const exerciseRecs: RecommendationItem[] = [];
    
    // Basic diabetes exercise recommendations
    exerciseRecs.push({
      title: 'Regular Physical Activity',
      description: 'Regular physical activity can improve insulin sensitivity and help manage blood glucose levels.',
      importance: 'high',
      followUp: 'Aim for at least 150 minutes of moderate-intensity aerobic activity weekly, spread over at least 3 days.'
    });
    
    exerciseRecs.push({
      title: 'Strength Training',
      description: 'Resistance or weight training can improve insulin sensitivity and help maintain muscle mass.',
      importance: 'medium',
      followUp: 'Include strength training 2-3 times per week, targeting all major muscle groups.'
    });
    
    exerciseRecs.push({
      title: 'Glucose Monitoring During Exercise',
      description: 'Monitor your blood glucose before, during, and after exercise to prevent hypoglycemia.',
      importance: 'high',
      followUp: 'Carry fast-acting carbohydrates during exercise in case of low blood sugar.'
    });
    
    // Based on activity level
    if (userData.exerciseFrequency) {
      if (userData.exerciseFrequency === 'sedentary') {
        exerciseRecs.push({
          title: 'Start Slowly',
          description: 'Begin with short, low-intensity activities and gradually increase duration and intensity.',
          importance: 'high',
          followUp: 'Consider activities like walking, swimming, or cycling for 10-15 minutes daily, then gradually build up.'
        });
      } else if (userData.exerciseFrequency === 'lightly-active') {
        exerciseRecs.push({
          title: 'Increase Intensity',
          description: 'Gradually increase the intensity of your physical activities to improve cardiovascular fitness.',
          importance: 'medium',
          followUp: 'Try adding interval training or increasing the pace of your current activities.'
        });
      } else {
        exerciseRecs.push({
          title: 'Exercise Variation',
          description: 'Incorporate different types of activities to prevent overuse injuries and maintain motivation.',
          importance: 'medium',
          followUp: 'Mix cardiovascular exercise, strength training, flexibility work, and balance activities.'
        });
      }
    }
    
    return exerciseRecs;
  };
  
  const getMedicalRecommendations = (): RecommendationItem[] => {
    const medicalRecs: RecommendationItem[] = [];
    
    // Regular check-ups and tests
    medicalRecs.push({
      title: 'Regular Medical Check-ups',
      description: 'Regular visits with your healthcare team are essential for managing diabetes.',
      importance: 'high',
      followUp: 'Schedule visits with your primary care provider every 3-6 months and specialists as recommended.'
    });
    
    medicalRecs.push({
      title: 'Annual Eye Examination',
      description: 'Annual comprehensive dilated eye exams are crucial for detecting diabetic retinopathy early.',
      importance: 'high',
      followUp: 'See an ophthalmologist or optometrist who specializes in diabetic eye care.'
    });
    
    medicalRecs.push({
      title: 'Kidney Function Tests',
      description: 'Regular tests to monitor kidney function and detect early signs of diabetic nephropathy.',
      importance: 'high',
      followUp: 'Ask your doctor about urine albumin tests and eGFR blood tests at least once a year.'
    });
    
    medicalRecs.push({
      title: 'Foot Examinations',
      description: 'Regular foot examinations can help prevent complications from diabetic neuropathy.',
      importance: 'high',
      followUp: 'Check your feet daily and have a comprehensive foot exam at least once a year.'
    });
    
    // Vaccination recommendations
    medicalRecs.push({
      title: 'Vaccination Schedule',
      description: 'People with diabetes should stay up to date with recommended vaccinations.',
      importance: 'medium',
      followUp: 'Discuss annual flu shots, pneumococcal vaccine, hepatitis B vaccine, and COVID-19 vaccines with your doctor.'
    });
    
    // Based on medications
    if (userData.medications && userData.medications.length > 0) {
      medicalRecs.push({
        title: 'Medication Review',
        description: "Regular review of your medications to ensure they're still effective and appropriate.",
        importance: 'high',
        followUp: 'Discuss any side effects or concerns with your healthcare provider.'
      });
      
      // Check for insulin
      const takingInsulin = userData.medications.some(med => 
        med.name.toLowerCase().includes('insulin'));
      
      if (takingInsulin) {
        medicalRecs.push({
          title: 'Hypoglycemia Management',
          description: 'Know how to recognize and treat low blood sugar (hypoglycemia).',
          importance: 'high',
          followUp: 'Always carry fast-acting glucose and make sure friends and family know how to help if needed.'
        });
      }
      
      // Check for metformin
      const takingMetformin = userData.medications.some(med => 
        med.name.toLowerCase().includes('metformin'));
      
      if (takingMetformin) {
        medicalRecs.push({
          title: 'Vitamin B12 Levels',
          description: 'Long-term metformin use can lead to vitamin B12 deficiency.',
          importance: 'medium',
          followUp: 'Ask your doctor about periodic vitamin B12 testing and consider supplementation if recommended.'
        });
      }
    }
    
    return medicalRecs;
  };
  
  const renderRecommendationList = (recommendations: RecommendationItem[]) => {
    return (
      <div className="space-y-6">
        {recommendations.map((rec, index) => (
          <FadeIn key={index} delay={100 * index}>
            <Card className="p-4 border-l-4 hover:shadow-md transition-all duration-300">
              <div className="flex items-start">
                {rec.status === 'good' ? (
                  <CheckCircle className="h-5 w-5 text-green-500 mt-1 mr-3 flex-shrink-0" />
                ) : rec.status === 'warning' ? (
                  <AlertCircle className="h-5 w-5 text-amber-500 mt-1 mr-3 flex-shrink-0" />
                ) : rec.status === 'alert' ? (
                  <AlertCircle className="h-5 w-5 text-red-500 mt-1 mr-3 flex-shrink-0" />
                ) : rec.importance === 'high' ? (
                  <AlertCircle className="h-5 w-5 text-red-500 mt-1 mr-3 flex-shrink-0" />
                ) : (
                  <CheckCircle className="h-5 w-5 text-blue-500 mt-1 mr-3 flex-shrink-0" />
                )}
                
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-lg text-gray-900 dark:text-white">{rec.title}</h3>
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                      rec.importance === 'high' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' :
                      rec.importance === 'medium' ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300' :
                      'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                    }`}>
                      {rec.importance.charAt(0).toUpperCase() + rec.importance.slice(1)} Priority
                    </span>
                  </div>
                  
                  <p className="mt-2 text-gray-600 dark:text-gray-300">{rec.description}</p>
                  
                  {(rec.currentValue || rec.idealValue) && (
                    <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-800/40 rounded-md">
                      {rec.currentValue && (
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600 dark:text-gray-300">Your value:</span>
                          <span className={`font-medium ${
                            rec.status === 'good' ? 'text-green-600 dark:text-green-400' :
                            rec.status === 'warning' ? 'text-amber-600 dark:text-amber-400' :
                            rec.status === 'alert' ? 'text-red-600 dark:text-red-400' :
                            'text-gray-900 dark:text-gray-100'
                          }`}>{rec.currentValue}</span>
                        </div>
                      )}
                      {rec.idealValue && (
                        <div className="flex items-center justify-between text-sm mt-1">
                          <span className="text-gray-600 dark:text-gray-300">Target:</span>
                          <span className="font-medium text-blue-600 dark:text-blue-400">{rec.idealValue}</span>
                        </div>
                      )}
                    </div>
                  )}
                  
                  {rec.followUp && (
                    <div className="mt-3 text-sm text-gray-600 dark:text-gray-300 border-t border-gray-200 dark:border-gray-700 pt-2">
                      <span className="font-medium text-gray-900 dark:text-white">Action step: </span>
                      {rec.followUp}
                    </div>
                  )}
                </div>
              </div>
            </Card>
          </FadeIn>
        ))}
      </div>
    );
  };
  
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-medical-gray-900 dark:text-white">
        Personalized Health Recommendations
      </h2>
      
      <p className="text-medical-gray-600 dark:text-gray-300">
        Based on your health profile and assessment data, we've created detailed recommendations to help
        you manage your diabetes effectively. These suggestions are tailored to your specific needs and current health status.
      </p>
      
      <Tabs defaultValue="medical">
        <TabsList className="mb-6">
          <TabsTrigger value="medical">
            <Thermometer className="h-4 w-4 mr-2" />
            Medical
          </TabsTrigger>
          <TabsTrigger value="diet">
            <Apple className="h-4 w-4 mr-2" />
            Diet
          </TabsTrigger>
          <TabsTrigger value="exercise">
            <Dumbbell className="h-4 w-4 mr-2" />
            Exercise
          </TabsTrigger>
          <TabsTrigger value="age">
            <Heart className="h-4 w-4 mr-2" />
            Age-specific
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="medical" className="pt-2">
          {renderRecommendationList(getMedicalRecommendations())}
        </TabsContent>
        
        <TabsContent value="diet" className="pt-2">
          {renderRecommendationList(getDietRecommendations())}
        </TabsContent>
        
        <TabsContent value="exercise" className="pt-2">
          {renderRecommendationList(getExerciseRecommendations())}
        </TabsContent>
        
        <TabsContent value="age" className="pt-2">
          {renderRecommendationList(getAgeBasedRecommendations())}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DetailedRecommendations;
