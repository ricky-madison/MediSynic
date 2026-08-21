
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import HealthAssessmentForm from '@/components/assessment/HealthAssessmentForm';
import AssessmentHistory from '@/components/assessment/AssessmentHistory';

const Form = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-background dark:bg-gray-900">
      <Header />
      
      <main className="pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
              Comprehensive Health Assessment
            </h1>
            <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
              Complete this detailed health assessment to receive personalized recommendations based on your comprehensive health profile
            </p>
            
            {!isAuthenticated && (
              <Card className="mt-6 border-amber-200 bg-amber-50/50 dark:bg-amber-900/20 dark:border-amber-800">
                <CardContent className="p-4">
                  <div className="flex items-start">
                    <AlertCircle className="w-5 h-5 text-amber-500 mt-0.5 mr-3 flex-shrink-0" />
                    <div>
                      <h3 className="text-base font-medium text-amber-800 dark:text-amber-300 mb-1">Authentication Required</h3>
                      <p className="text-sm text-amber-700 dark:text-amber-400 mb-3">
                        You need to be logged in to save your assessment results and view your history.
                      </p>
                      <Button
                        onClick={() => navigate('/auth')}
                        className="text-sm px-4 py-2 h-9"
                      >
                        Sign In
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
          
          <div className="grid grid-cols-1 gap-8">
            {/* Assessment Form Card - Takes full width now */}
            <Card className="shadow-sm border bg-white/80 backdrop-blur-sm dark:bg-gray-800/90">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-indigo-700 dark:text-indigo-400">
                  Complete Health Assessment
                </CardTitle>
                <CardDescription>
                  Fill out the detailed health assessment below to receive personalized recommendations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <HealthAssessmentForm />
              </CardContent>
            </Card>
            
            {/* Assessment History Card */}
            <Card className="shadow-sm border bg-white/80 backdrop-blur-sm dark:bg-gray-800/90">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-indigo-700 dark:text-indigo-400">
                  Assessment History
                </CardTitle>
                <CardDescription>
                  Review your past assessments and track your health progress
                </CardDescription>
              </CardHeader>
              <CardContent>
                <AssessmentHistory />
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Form;
