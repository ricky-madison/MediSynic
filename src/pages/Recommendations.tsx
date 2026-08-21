import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserData } from '@/context/UserDataContext';
import { useAuth } from '@/context/AuthContext';
import FadeIn from '@/components/FadeIn';
import { ArrowLeft, AlertTriangle, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { calculateBMI, calculateHealthRisk } from '@/utils/healthCalculations';
import HealthProgressChart from '@/components/HealthProgressChart';
import DetailedRecommendations from '@/components/DetailedRecommendations';
import VitaminRecommendations from '@/components/VitaminRecommendations';

interface AssessmentData {
  height?: number;
  weight?: number;
  [key: string]: any;
}

const Recommendations = () => {
  const { userData, recommendations, drugInteractions, vitaminRecommendations, setUserData, generateRecommendations } = useUserData();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // Fetch assessment data from Supabase
  useEffect(() => {
    const fetchAssessmentData = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('diabetes_assessments')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(1);
          
        if (error) throw error;
        
        if (data && data.length > 0) {
          const latestAssessment = data[0];
          
          // Update the assessment data with calculated metrics if they're missing
          if (latestAssessment.assessment_data) {
            const assessmentData = latestAssessment.assessment_data as AssessmentData;
            
            // Calculate and save BMI if not present
            if (!latestAssessment.bmi && assessmentData.height && assessmentData.weight) {
              const bmi = calculateBMI(
                assessmentData.height,
                assessmentData.weight
              );
              
              // Update the database with the calculated BMI
              await supabase
                .from('diabetes_assessments')
                .update({ bmi })
                .eq('id', latestAssessment.id);
              
              latestAssessment.bmi = bmi;
            }
            
            // Calculate and save health score if not present
            if (!latestAssessment.health_score) {
              const healthScore = calculateHealthRisk(assessmentData);
              
              // Update the database with the calculated health score
              await supabase
                .from('diabetes_assessments')
                .update({ health_score: healthScore })
                .eq('id', latestAssessment.id);
              
              latestAssessment.health_score = healthScore;
            }
            
            // Set the user data from the latest assessment
            setUserData({
              ...assessmentData,
              // Keep any existing data that might not be in the assessment
              ...userData
            });
            
            // Generate recommendations based on the updated data
            generateRecommendations();
          }
        }
      } catch (error) {
        console.error('Error fetching assessment data:', error);
      }
    };
    
    fetchAssessmentData();
  }, [user, setUserData, generateRecommendations, userData]);
  
  // If there's no userData, redirect to the form
  useEffect(() => {
    if (!userData || Object.keys(userData).length === 0) {
      navigate('/form');
    }
  }, [userData, navigate]);
  
  return (
    <div className="container-tight p-6">
      <FadeIn delay={100}>
        <Button 
          variant="ghost" 
          onClick={() => navigate('/dashboard/home')}
          className="mb-6 text-medical-gray-600 hover:text-medical-gray-900"
        >
          <ArrowLeft size={16} className="mr-2" />
          Back to Dashboard
        </Button>
        
        <h1 className="text-3xl md:text-4xl font-bold mb-4 text-medical-gray-900 dark:text-white">
          Your Health Recommendations
        </h1>
        
        <p className="text-lg text-medical-gray-600 dark:text-gray-300 mb-8">
          Based on your assessments and health profile, we&apos;ve generated personalized 
          recommendations to help improve your health and manage diabetes effectively.
        </p>
      </FadeIn>
      
      {/* Health Progress Chart */}
      <section className="mb-12">
        <FadeIn delay={200}>
          <h2 className="text-2xl font-bold mb-6 text-medical-gray-900 dark:text-white">
            Health Metrics Tracking
          </h2>
          <HealthProgressChart />
        </FadeIn>
      </section>
      
      {/* Detailed Recommendations */}
      <section className="mb-12">
        <FadeIn delay={300}>
          <DetailedRecommendations />
        </FadeIn>
      </section>
      
      {/* Vitamin Recommendations */}
      <section className="mb-12">
        <FadeIn delay={400}>
          <VitaminRecommendations />
        </FadeIn>
      </section>
      
      {/* Drug Interactions Section - show only if there are interactions */}
      {drugInteractions && drugInteractions.length > 0 && (
        <section className="mb-12">
          <FadeIn delay={500}>
            <h2 className="text-2xl font-bold mb-6 flex items-center text-medical-gray-900 dark:text-white">
              <AlertTriangle size={24} className="mr-2 text-amber-500" />
              Potential Drug Interactions
            </h2>
            
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-card overflow-hidden mb-6">
              <div className="p-6">
                <p className="text-medical-gray-600 dark:text-gray-300 mb-4">
                  Based on the medications you&apos;ve listed, we&apos;ve identified the following potential interactions.
                  Always consult your healthcare provider before making any changes to your medication regimen.
                </p>
                
                <div className="space-y-4 mt-6">
                  {drugInteractions.map((interaction, index) => (
                    <FadeIn key={index} delay={400 + (index * 100)}>
                      <div className={`border rounded-lg p-4 ${
                        interaction.severity === 'high' ? 'bg-red-50 border-red-200 text-red-800 dark:bg-red-900/20 dark:text-red-300' : 
                        interaction.severity === 'medium' ? 'bg-amber-50 border-amber-200 text-amber-800 dark:bg-amber-900/20 dark:border-amber-800 dark:text-amber-300' : 
                        'bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-300'
                      }`}>
                        <div className="flex items-start">
                          <div className="flex-shrink-0">
                            <AlertTriangle 
                              size={20} 
                              className={interaction.severity === 'high' ? 'text-red-600 dark:text-red-400' : 
                                interaction.severity === 'medium' ? 'text-amber-600 dark:text-amber-400' : 'text-blue-600 dark:text-blue-400'}
                            />
                          </div>
                          <div className="ml-3">
                            <h3 className="text-base font-semibold">
                              {interaction.medication1} + {interaction.medication2}
                            </h3>
                            <p className="mt-1 text-sm">
                              {interaction.description}
                            </p>
                            <div className="mt-2">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium 
                                ${interaction.severity === 'high' ? 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300' : 
                                interaction.severity === 'medium' ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300' : 
                                'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300'}`}>
                                {interaction.severity === 'high' ? 'High Risk' : 
                                  interaction.severity === 'medium' ? 'Medium Risk' : 'Low Risk'}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </FadeIn>
                  ))}
                </div>
              </div>
            </div>
          </FadeIn>
        </section>
      )}
      
      {/* Disclaimer */}
      <FadeIn delay={600}>
        <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800/60 rounded-xl p-6 flex items-start">
          <Info size={24} className="text-blue-500 dark:text-blue-400 flex-shrink-0 mt-1 mr-4" />
          <div>
            <h3 className="font-semibold text-medical-gray-900 dark:text-white mb-2">
              Important Medical Disclaimer
            </h3>
            <p className="text-medical-gray-700 dark:text-gray-300 text-sm">
              The recommendations provided are based on the information you&apos;ve shared and general health guidelines. 
              They are not a substitute for professional medical advice, diagnosis, or treatment. 
              Always seek the advice of your physician or other qualified health provider with any questions 
              you may have regarding a medical condition or before starting any new health regimen.
            </p>
          </div>
        </div>
      </FadeIn>
      
      {/* Action Buttons */}
      <FadeIn delay={700}>
        <div className="flex flex-col sm:flex-row justify-center gap-4 mt-12">
          <Button
            onClick={() => navigate('/form')}
            variant="outline"
            className="w-full sm:w-auto"
          >
            Update Health Profile
          </Button>
          
          <Button
            onClick={() => window.print()}
            className="w-full sm:w-auto"
          >
            Print Recommendations
          </Button>
        </div>
      </FadeIn>
    </div>
  );
};

export default Recommendations;
