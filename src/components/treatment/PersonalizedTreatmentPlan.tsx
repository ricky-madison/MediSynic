
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { 
  Pill, Clock, CalendarClock, AlertCircle, ArrowUpRight, 
  ArrowDownRight, Activity, Heart, ThumbsUp, ThumbsDown, 
  ChevronRight, BookOpen, BarChart4, Brain, Lightbulb
} from "lucide-react";
import AlertCard from "@/components/dashboard/AlertCard";
import { useOptimizedQuery } from "@/hooks/useOptimizedQuery";
import { toast } from "sonner";

interface PersonalizedTreatmentPlanProps {
  userId?: string;
}

// Mock medication data
const mockMedications = [
  {
    id: 'med1',
    name: 'Metformin',
    dosage: '500mg',
    schedule: 'Twice daily with meals',
    timeOfDay: ['morning', 'evening'],
    effectiveness: 85,
    adherence: 92,
    sideEffects: []
  },
  {
    id: 'med2',
    name: 'Glipizide',
    dosage: '10mg',
    schedule: 'Once daily before breakfast',
    timeOfDay: ['morning'],
    effectiveness: 70,
    adherence: 85,
    sideEffects: ['Occasional dizziness']
  },
  {
    id: 'med3',
    name: 'Vitamin D',
    dosage: '1000 IU',
    schedule: 'Once daily',
    timeOfDay: ['morning'],
    effectiveness: null,  // supplements don't have effectiveness ratings
    adherence: 65,
    sideEffects: []
  }
];

// Mock recommendations
const mockRecommendations = [
  {
    id: 'rec1',
    type: 'medication',
    title: 'Adjust Metformin timing',
    description: 'Taking with food may reduce side effects. Consider taking with dinner instead of after.',
    confidence: 89,
    impact: 'Medium',
    source: 'ML Algorithm',
    accepted: null
  },
  {
    id: 'rec2',
    type: 'lifestyle',
    title: 'Morning walk recommendation',
    description: 'A 15-minute walk after breakfast could lower morning glucose spikes by an estimated 18%.',
    confidence: 92,
    impact: 'High',
    source: 'ML Algorithm',
    accepted: true
  },
  {
    id: 'rec3',
    type: 'routine',
    title: 'Bedtime glucose check',
    description: 'Adding a bedtime glucose check may help identify overnight patterns.',
    confidence: 75,
    impact: 'Medium',
    source: 'Care Team',
    accepted: false
  }
];

// Mock glucose response data
const mockGlucoseResponse = [
  { time: '8:00 AM', medication: true, level: 145 },
  { time: '10:00 AM', medication: false, level: 118 },
  { time: '12:00 PM', medication: false, level: 132 },
  { time: '2:00 PM', medication: true, level: 128 },
  { time: '4:00 PM', medication: false, level: 109 },
  { time: '6:00 PM', medication: false, level: 115 },
  { time: '8:00 PM', medication: true, level: 125 },
  { time: '10:00 PM', medication: false, level: 105 },
];

// Mock predictive alerts
const mockPredictiveAlerts = [
  {
    id: 'alert1',
    title: 'Potential Hypoglycemia Risk',
    message: 'Your overnight glucose patterns suggest a 70% chance of low glucose between 2-4 AM.',
    level: 'warning',
    probability: 70,
    timeframe: 'Tonight',
    recommendation: 'Consider a small protein snack before bed or reducing evening insulin.'
  },
  {
    id: 'alert2',
    title: 'Medication Effectiveness Decreasing',
    message: 'Your Glipizide appears to be 30% less effective than 3 months ago.',
    level: 'info',
    probability: 85,
    timeframe: 'Ongoing',
    recommendation: 'Schedule an appointment with your doctor to review medication.'
  }
];

const PersonalizedTreatmentPlan: React.FC<PersonalizedTreatmentPlanProps> = ({ userId }) => {
  const [activeTab, setActiveTab] = useState('medications');
  const [expandedMedId, setExpandedMedId] = useState<string | null>(null);
  
  // In a real app, these would be API calls
  const { data: medications } = useOptimizedQuery(
    ['user', userId, 'medications'],
    async () => {
      await new Promise(resolve => setTimeout(resolve, 500));
      return mockMedications;
    }
  );
  
  const { data: recommendations } = useOptimizedQuery(
    ['user', userId, 'recommendations'],
    async () => {
      await new Promise(resolve => setTimeout(resolve, 600));
      return mockRecommendations;
    }
  );
  
  const { data: glucoseResponse } = useOptimizedQuery(
    ['user', userId, 'glucose-response'],
    async () => {
      await new Promise(resolve => setTimeout(resolve, 700));
      return mockGlucoseResponse;
    }
  );
  
  const { data: predictiveAlerts } = useOptimizedQuery(
    ['user', userId, 'predictive-alerts'],
    async () => {
      await new Promise(resolve => setTimeout(resolve, 400));
      return mockPredictiveAlerts;
    }
  );

  const handleAcceptRecommendation = (recId: string) => {
    toast.success('Recommendation accepted and added to your plan');
  };
  
  const handleRejectRecommendation = (recId: string) => {
    toast.success('Recommendation declined');
  };
  
  const handleViewMedicationDetails = (medId: string) => {
    setExpandedMedId(expandedMedId === medId ? null : medId);
  };
  
  const handleAddMedication = () => {
    toast.success('Add medication flow initiated');
  };
  
  const handleUpdateTreatmentPlan = () => {
    toast.success('Treatment plan updated successfully');
  };

  const getMedicationIcon = (timeOfDay: string) => {
    if (timeOfDay === 'morning') {
      return <Clock className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />;
    } else if (timeOfDay === 'afternoon') {
      return <Clock className="h-4 w-4 text-blue-600 dark:text-blue-400" />;
    } else {
      return <Clock className="h-4 w-4 text-purple-600 dark:text-purple-400" />;
    }
  };

  const getRecommendationIcon = (type: string) => {
    switch (type) {
      case 'medication': return <Pill className="h-5 w-5" />;
      case 'lifestyle': return <Activity className="h-5 w-5" />;
      case 'routine': return <CalendarClock className="h-5 w-5" />;
      default: return <Lightbulb className="h-5 w-5" />;
    }
  };

  const renderMedications = () => {
    if (!medications) return null;
    
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">Your Current Medications</h3>
          <Button size="sm" onClick={handleAddMedication}>
            <Pill className="h-4 w-4 mr-2" />
            Add Medication
          </Button>
        </div>
        
        <div className="space-y-3">
          {medications.map(medication => (
            <Card 
              key={medication.id} 
              className={`overflow-hidden transition-all ${
                expandedMedId === medication.id 
                  ? 'ring-1 ring-primary' 
                  : ''
              }`}
            >
              <div className="bg-slate-50 dark:bg-slate-900 px-4 py-3">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-medium flex items-center">
                      <Pill className="inline h-4 w-4 mr-2 text-blue-600 dark:text-blue-400" />
                      {medication.name} ({medication.dosage})
                    </h4>
                    <p className="text-sm text-muted-foreground">{medication.schedule}</p>
                  </div>
                  
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleViewMedicationDetails(medication.id)}
                  >
                    {expandedMedId === medication.id ? 'Less' : 'More'} Details
                    <ChevronRight className={`h-4 w-4 ml-1 transition-transform ${
                      expandedMedId === medication.id ? 'rotate-90' : ''
                    }`} />
                  </Button>
                </div>
              </div>
              
              {expandedMedId === medication.id && (
                <CardContent className="p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <h5 className="text-sm font-medium">Timing</h5>
                      <div className="flex gap-2">
                        {medication.timeOfDay.map((time, idx) => (
                          <Badge key={idx} variant="outline" className="flex items-center">
                            {getMedicationIcon(time)}
                            <span className="ml-1 capitalize">{time}</span>
                          </Badge>
                        ))}
                      </div>
                      
                      <h5 className="text-sm font-medium">Adherence</h5>
                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span>Past 30 days</span>
                          <span>{medication.adherence}%</span>
                        </div>
                        <Progress value={medication.adherence} className="h-2" />
                      </div>
                      
                      {medication.sideEffects.length > 0 && (
                        <>
                          <h5 className="text-sm font-medium">Reported Side Effects</h5>
                          <div className="flex flex-wrap gap-2">
                            {medication.sideEffects.map((effect, idx) => (
                              <Badge key={idx} variant="destructive" className="text-xs">
                                {effect}
                              </Badge>
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                    
                    {medication.effectiveness !== null && (
                      <div>
                        <h5 className="text-sm font-medium mb-3">Effectiveness</h5>
                        <div className="flex flex-col gap-2">
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-muted-foreground">Overall effectiveness</span>
                            <span className="text-sm font-medium">{medication.effectiveness}%</span>
                          </div>
                          <Progress value={medication.effectiveness} className="h-2" />
                          
                          <div className="bg-slate-50 dark:bg-slate-900 rounded-md p-3 mt-2">
                            <div className="flex items-center gap-2">
                              <Brain className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                              <span className="text-xs font-medium">AI Insight</span>
                            </div>
                            <p className="text-xs mt-1">
                              This medication appears most effective when taken with a meal containing protein.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      </div>
    );
  };

  const renderRecommendations = () => {
    if (!recommendations) return null;
    
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-medium flex items-center">
          <Lightbulb className="h-5 w-5 mr-2 text-amber-500" />
          AI-Powered Recommendations
        </h3>
        
        <div className="space-y-3">
          {recommendations.map(rec => (
            <Card key={rec.id} className="overflow-hidden">
              <div className={`px-4 py-3 flex items-center gap-3 ${
                rec.type === 'medication' 
                  ? 'bg-blue-50 dark:bg-blue-950/30' 
                  : rec.type === 'lifestyle'
                    ? 'bg-green-50 dark:bg-green-950/30'
                    : 'bg-purple-50 dark:bg-purple-950/30'
              }`}>
                <div className={`rounded-full p-2 ${
                  rec.type === 'medication' 
                    ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300' 
                    : rec.type === 'lifestyle'
                      ? 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300'
                      : 'bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300'
                }`}>
                  {getRecommendationIcon(rec.type)}
                </div>
                
                <div>
                  <h4 className="font-medium">{rec.title}</h4>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      {rec.impact} Impact
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {rec.confidence}% confidence
                    </span>
                    <span className="text-xs text-muted-foreground">
                      Source: {rec.source}
                    </span>
                  </div>
                </div>
              </div>
              
              <CardContent className="p-4">
                <p className="text-sm mb-4">{rec.description}</p>
                
                {rec.accepted === null ? (
                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => handleAcceptRecommendation(rec.id)}>
                      <ThumbsUp className="h-4 w-4 mr-2" />
                      Accept
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleRejectRecommendation(rec.id)}>
                      <ThumbsDown className="h-4 w-4 mr-2" />
                      Not Helpful
                    </Button>
                  </div>
                ) : rec.accepted ? (
                  <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                    Recommendation Accepted
                  </Badge>
                ) : (
                  <Badge variant="outline" className="bg-slate-100 text-slate-800 dark:bg-slate-900 dark:text-slate-200">
                    Recommendation Declined
                  </Badge>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
        
        <Button variant="outline" className="w-full">
          <BarChart4 className="h-4 w-4 mr-2" />
          Generate More Insights
        </Button>
      </div>
    );
  };

  const renderGlucoseResponse = () => {
    if (!glucoseResponse) return null;
    
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-medium flex items-center">
          <Activity className="h-5 w-5 mr-2 text-blue-600 dark:text-blue-400" />
          Medication Response Analysis
        </h3>
        
        <Card>
          <CardContent className="p-4">
            <div className="mb-4">
              <p className="text-sm">
                This chart shows how your glucose levels respond to medication over time.
                Points marked in blue indicate times when medication was taken.
              </p>
            </div>
            
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={glucoseResponse} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value, name) => [`${value} mg/dL`, 'Glucose Level']}
                    labelFormatter={(label) => `Time: ${label}`}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="level" 
                    stroke="#4f46e5"
                    strokeWidth={2}
                    dot={(props) => {
                      const { cx, cy, payload } = props;
                      return payload.medication ? (
                        <svg x={cx - 5} y={cy - 5} width={10} height={10} fill="#4f46e5">
                          <circle cx="5" cy="5" r="5" />
                        </svg>
                      ) : (
                        <svg x={cx - 3} y={cy - 3} width={6} height={6} fill="#4f46e5" fillOpacity={0.6}>
                          <circle cx="3" cy="3" r="3" />
                        </svg>
                      );
                    }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            
            <div className="mt-4 bg-blue-50 dark:bg-blue-950/30 p-3 rounded-md">
              <div className="flex items-center gap-2 mb-2">
                <Brain className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                <span className="font-medium text-sm">ML Analysis</span>
              </div>
              <p className="text-sm">
                Your morning medication appears to be most effective, reducing glucose by an average of 28mg/dL within 2 hours.
                Evening dosage shows less effect, possibly due to timing relative to dinner.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderPredictiveAlerts = () => {
    if (!predictiveAlerts) return null;
    
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-medium flex items-center">
          <AlertCircle className="h-5 w-5 mr-2 text-amber-500" />
          Predictive Health Alerts
        </h3>
        
        <div className="space-y-3">
          {predictiveAlerts.map(alert => (
            <AlertCard
              key={alert.id}
              title={alert.title}
              message={alert.message}
              level={alert.level as "info" | "warning" | "error" | "success"}
              onViewDetails={() => {}}
              actionLabel="View Details"
              secondaryActionLabel="Remind Later"
              onSecondaryAction={() => {}}
            />
          ))}
        </div>
      </div>
    );
  };

  return (
    <Card className="shadow-md">
      <CardHeader className="bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-950/40 dark:to-indigo-950/40">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>Personalized Treatment Plan</CardTitle>
            <CardDescription>
              AI-optimized medication and lifestyle recommendations based on your health data
            </CardDescription>
          </div>
          <Button size="sm" onClick={handleUpdateTreatmentPlan}>
            Update Plan
          </Button>
        </div>
      </CardHeader>
      
      <CardContent>
        <Tabs defaultValue="medications" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
            <TabsTrigger value="medications">
              <Pill className="h-4 w-4 mr-2" />
              Medications
            </TabsTrigger>
            <TabsTrigger value="recommendations">
              <Lightbulb className="h-4 w-4 mr-2" />
              Recommendations
            </TabsTrigger>
            <TabsTrigger value="response">
              <Activity className="h-4 w-4 mr-2" />
              Response Analysis
            </TabsTrigger>
            <TabsTrigger value="alerts">
              <AlertCircle className="h-4 w-4 mr-2" />
              Predictive Alerts
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="medications" className="pt-4">
            {renderMedications()}
          </TabsContent>
          
          <TabsContent value="recommendations" className="pt-4">
            {renderRecommendations()}
          </TabsContent>
          
          <TabsContent value="response" className="pt-4">
            {renderGlucoseResponse()}
          </TabsContent>
          
          <TabsContent value="alerts" className="pt-4">
            {renderPredictiveAlerts()}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default PersonalizedTreatmentPlan;
