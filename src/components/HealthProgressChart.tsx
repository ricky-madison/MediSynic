
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import { Json } from '@/integrations/supabase/types';

interface HealthMetric {
  date: string;
  bmi: number | null;
  weight: number | null;
  healthScore: number | null;
  glucoseLevel: number | null;
}

interface AssessmentData {
  id: string;
  created_at: string;
  user_id: string;
  assessment_data: Json;
  health_score: number | null;
  bmi: number | null;
  glucose_level: number | null;
  score: number | null;
}

const HealthProgressChart = () => {
  const [healthData, setHealthData] = useState<HealthMetric[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  
  useEffect(() => {
    const fetchHealthData = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('diabetes_assessments')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: true });
          
        if (error) throw error;
        
        if (data && data.length > 0) {
          const formattedData: HealthMetric[] = data.map((assessment: AssessmentData) => {
            const formattedDate = format(new Date(assessment.created_at), 'MMM d');
            
            // Get height/weight from assessment_data 
            // Cast assessment_data to Record<string, any> to access properties safely
            const assessmentData = assessment.assessment_data as Record<string, any>;
            
            const height = assessmentData?.height ? Number(assessmentData.height) : null;
            const weight = assessmentData?.weight ? Number(assessmentData.weight) : null;
            
            // Calculate BMI if we have height and weight but no BMI recorded
            const bmi = assessment.bmi || (height && weight ? Number((weight / ((height / 100) ** 2)).toFixed(1)) : null);
            
            // Get health score
            const healthScore = assessment.health_score || 
                               (assessmentData?.score ? Number(assessmentData.score) : null);
            
            // Get glucose level
            const glucoseLevel = assessment.glucose_level || 
                               (assessmentData?.glucoseLevel ? Number(assessmentData.glucoseLevel) : 
                               (assessmentData?.bloodSugar ? Number(assessmentData.bloodSugar) : null));
            
            return {
              date: formattedDate,
              bmi,
              weight,
              healthScore,
              glucoseLevel
            };
          });
          
          setHealthData(formattedData);
        }
      } catch (error) {
        console.error('Error fetching health data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchHealthData();
  }, [user]);
  
  const renderCustomTooltip = (props: any) => {
    const { active, payload, label } = props;
    if (active && payload && payload.length) {
      return (
        <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-md">
          <CardHeader>
            <CardTitle className="text-sm font-medium">{label}</CardTitle>
            <CardDescription className="text-xs text-gray-500 dark:text-gray-400">Health Metrics</CardDescription>
          </CardHeader>
          <CardContent className="p-2 text-sm">
            {payload.map((item: any) => (
              <div key={item.dataKey} className="mb-1">
                <span className="font-semibold">{item.name}:</span> {item.value !== null ? item.value : 'N/A'}
              </div>
            ))}
          </CardContent>
        </Card>
      );
    }
    return null;
  };
  
  return (
    <Card className="bg-white dark:bg-gray-900 shadow-md rounded-lg">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">
          Health Metrics Over Time
        </CardTitle>
        <CardDescription>
          Track your BMI, weight, health score, and glucose levels.
        </CardDescription>
      </CardHeader>
      <CardContent className="overflow-auto">
        {loading ? (
          <div className="text-center py-4">Loading data...</div>
        ) : healthData.length === 0 ? (
          <div className="text-center py-4">No data available.</div>
        ) : (
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={healthData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
              <XAxis dataKey="date" className="text-xs text-gray-600 dark:text-gray-300" />
              <YAxis className="text-xs text-gray-600 dark:text-gray-300" />
              <Tooltip content={renderCustomTooltip} />
              <Legend className="text-xs text-gray-600 dark:text-gray-300" />
              <Line type="monotone" dataKey="bmi" name="BMI" stroke="#8884d8" activeDot={{ r: 8 }} />
              <Line type="monotone" dataKey="weight" name="Weight" stroke="#82ca9d" activeDot={{ r: 8 }} />
              <Line type="monotone" dataKey="healthScore" name="Health Score" stroke="#ffc658" activeDot={{ r: 8 }} />
              <Line type="monotone" dataKey="glucoseLevel" name="Glucose Level" stroke="#e45641" activeDot={{ r: 8 }} />
            </LineChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
};

export default HealthProgressChart;
