import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  LineChart, Line, BarChart, Bar, AreaChart, Area, 
  PieChart, Pie, RadarChart, Radar, PolarGrid,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  ResponsiveContainer, PolarAngleAxis, PolarRadiusAxis 
} from 'recharts';
import { useOptimizedQuery } from "@/hooks/useOptimizedQuery";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

// Define data types
interface GlucoseData {
  timestamp: string;
  value: number;
  meal?: string;
  medication?: string;
}

interface PatternData {
  pattern: string;
  description: string;
  probability: number;
  recommendation: string;
}

interface AdvancedDataVisualizationProps {
  userId?: string;
  timeRange?: 'day' | 'week' | 'month' | 'quarter' | 'year';
}

const AdvancedDataVisualization: React.FC<AdvancedDataVisualizationProps> = ({ 
  userId,
  timeRange = 'week'
}) => {
  const [activeTab, setActiveTab] = useState('glucose');
  const [chartType, setChartType] = useState<'line' | 'area' | 'bar'>('line');

  // Mock data - in a real app, this would come from the API
  const mockGlucoseData = [
    { name: 'Mon', value: 65, meal: 'After breakfast', medication: 'Metformin' },
    { name: 'Tue', value: 59, meal: 'Before lunch', medication: 'Metformin' },
    { name: 'Wed', value: 80, meal: 'After dinner', medication: 'Insulin' },
    { name: 'Thu', value: 81, meal: 'Before breakfast', medication: 'Metformin' },
    { name: 'Fri', value: 56, meal: 'After lunch', medication: 'None' },
    { name: 'Sat', value: 55, meal: 'Before dinner', medication: 'Insulin' },
    { name: 'Sun', value: 78, meal: 'Bedtime', medication: 'Metformin' },
  ];

  const mockPatternData = [
    { pattern: 'Morning Spike', probability: 75, impact: 'High' },
    { pattern: 'Post-Meal Drop', probability: 60, impact: 'Medium' },
    { pattern: 'Overnight Rise', probability: 45, impact: 'Low' },
    { pattern: 'Exercise Effect', probability: 85, impact: 'High' },
  ];

  const correlationData = [
    { factor: 'Exercise', correlation: 0.8 },
    { factor: 'Carb Intake', correlation: 0.65 },
    { factor: 'Stress', correlation: 0.4 },
    { factor: 'Sleep', correlation: 0.55 },
    { factor: 'Medication', correlation: 0.75 },
  ];
  
  // This would be a real query in a production app
  const { data: glucoseData, isLoading, error } = useOptimizedQuery(
    ['user', 'glucose-data', userId, timeRange],
    async () => {
      // In production this would call an API
      await new Promise(resolve => setTimeout(resolve, 500));
      return mockGlucoseData;
    }
  );

  // AI pattern detection - mock API call
  const { data: patterns } = useOptimizedQuery(
    ['user', 'glucose-patterns', userId, timeRange],
    async () => {
      await new Promise(resolve => setTimeout(resolve, 700));
      return mockPatternData;
    }
  );

  const renderChart = () => {
    if (isLoading) {
      return <div className="w-full h-[300px]"><Skeleton className="w-full h-full" /></div>;
    }
    
    if (error || !glucoseData) {
      return (
        <div className="flex flex-col items-center justify-center h-[300px] text-center">
          <AlertCircle className="h-10 w-10 text-red-500 mb-2" />
          <p className="text-muted-foreground">Unable to load glucose data</p>
          <Button variant="outline" size="sm" className="mt-4">Retry</Button>
        </div>
      );
    }

    return (
      <ResponsiveContainer width="100%" height={300}>
        {chartType === 'line' ? (
          <LineChart data={glucoseData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="name" stroke="#888" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke="#888" fontSize={12} tickLine={false} axisLine={false} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'white', 
                borderRadius: '8px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                border: '1px solid #f0f0f0'
              }}
              formatter={(value, name) => [`${value} mg/dL`, 'Glucose Level']}
            />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="value" 
              stroke="#4f46e5" 
              strokeWidth={3}
              dot={{ stroke: '#4f46e5', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, strokeWidth: 0 }}
              name="Glucose Level"
            />
          </LineChart>
        ) : chartType === 'area' ? (
          <AreaChart data={glucoseData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="name" stroke="#888" fontSize={12} />
            <YAxis stroke="#888" fontSize={12} />
            <Tooltip />
            <Legend />
            <Area type="monotone" dataKey="value" stroke="#4f46e5" fill="#4f46e5" fillOpacity={0.2} name="Glucose Level" />
          </AreaChart>
        ) : (
          <BarChart data={glucoseData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="name" stroke="#888" fontSize={12} />
            <YAxis stroke="#888" fontSize={12} />
            <Tooltip />
            <Legend />
            <Bar dataKey="value" fill="#4f46e5" name="Glucose Level" />
          </BarChart>
        )}
      </ResponsiveContainer>
    );
  };

  const renderPatternAnalysis = () => {
    if (!patterns) return <Skeleton className="w-full h-[200px]" />;
    
    return (
      <div className="mt-4 space-y-4">
        <h3 className="text-sm font-medium">AI-Detected Patterns</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {patterns.map((pattern, idx) => (
            <Card key={idx} className="bg-muted/40">
              <CardContent className="p-4">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-medium">{pattern.pattern}</h4>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    pattern.impact === 'High' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300' :
                    pattern.impact === 'Medium' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300' :
                    'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                  }`}>
                    {pattern.impact} Impact
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mb-2">
                  <div 
                    className="bg-blue-600 dark:bg-blue-500 h-2.5 rounded-full" 
                    style={{ width: `${pattern.probability}%` }}
                  ></div>
                </div>
                <p className="text-xs text-muted-foreground">Confidence: {pattern.probability}%</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  };

  const renderCorrelationInsights = () => {
    return (
      <div className="mt-4">
        <h3 className="text-sm font-medium mb-4">Factor Correlation Analysis</h3>
        <ResponsiveContainer width="100%" height={300}>
          <RadarChart outerRadius={90} data={correlationData}>
            <PolarGrid />
            <PolarAngleAxis dataKey="factor" />
            <PolarRadiusAxis angle={30} domain={[0, 1]} />
            <Radar 
              name="Correlation" 
              dataKey="correlation" 
              stroke="#4f46e5" 
              fill="#4f46e5" 
              fillOpacity={0.6} 
            />
            <Tooltip />
            <Legend />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    );
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle>Advanced Health Analytics</CardTitle>
        <CardDescription>
          AI-powered insights into your glucose patterns and health trends
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="glucose" value={activeTab} onValueChange={setActiveTab}>
          <div className="flex justify-between items-center mb-4">
            <TabsList>
              <TabsTrigger value="glucose">Glucose Trends</TabsTrigger>
              <TabsTrigger value="patterns">Pattern Analysis</TabsTrigger>
              <TabsTrigger value="correlations">Correlations</TabsTrigger>
            </TabsList>
            
            {activeTab === 'glucose' && (
              <div className="flex items-center space-x-1">
                <Button 
                  variant={chartType === 'line' ? 'default' : 'outline'} 
                  size="sm"
                  onClick={() => setChartType('line')}
                  className="text-xs h-8"
                >
                  Line
                </Button>
                <Button 
                  variant={chartType === 'area' ? 'default' : 'outline'} 
                  size="sm"
                  onClick={() => setChartType('area')}
                  className="text-xs h-8"
                >
                  Area
                </Button>
                <Button 
                  variant={chartType === 'bar' ? 'default' : 'outline'} 
                  size="sm"
                  onClick={() => setChartType('bar')}
                  className="text-xs h-8"
                >
                  Bar
                </Button>
              </div>
            )}
          </div>
          
          <TabsContent value="glucose" className="mt-0">
            {renderChart()}
          </TabsContent>
          
          <TabsContent value="patterns" className="mt-0">
            {renderPatternAnalysis()}
          </TabsContent>
          
          <TabsContent value="correlations" className="mt-0">
            {renderCorrelationInsights()}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default AdvancedDataVisualization;
