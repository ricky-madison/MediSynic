
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { formatDistanceToNow, format } from 'date-fns';
import {
  Activity,
  Calendar,
  ChevronRight,
  ChevronLeft,
  Info,
  Loader2,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent
} from '@/components/ui/card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface Assessment {
  id: string;
  created_at: string;
  assessment_data: any;
  score: number | null;
}

const AssessmentHistory: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAssessment, setSelectedAssessment] = useState<Assessment | null>(null);
  const [showFullScreenView, setShowFullScreenView] = useState(false);
  const [insights, setInsights] = useState<string[]>([]);
  
  // Fetch assessments
  useEffect(() => {
    const fetchAssessments = async () => {
      if (!isAuthenticated || !user) {
        setLoading(false);
        return;
      }
      
      try {
        const { data, error } = await supabase
          .from('diabetes_assessments')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });
          
        if (error) throw error;
        
        setAssessments(data || []);
        
        // Generate insights if there are assessments
        if (data && data.length > 0) {
          generateInsights(data);
        }
      } catch (error) {
        console.error('Error fetching assessments:', error);
        toast.error('Failed to load your assessment history');
      } finally {
        setLoading(false);
      }
    };
    
    fetchAssessments();
  }, [isAuthenticated, user]);
  
  // Generate insights based on assessment history
  const generateInsights = (assessmentData: Assessment[]) => {
    const newInsights: string[] = [];
    
    if (assessmentData.length === 0) return;
    
    const latestAssessment = assessmentData[0];
    
    // Most recent assessment insight
    newInsights.push(`Your latest health assessment was completed ${formatDistanceToNow(new Date(latestAssessment.created_at))} ago.`);
    
    // Risk score insight
    const riskScore = latestAssessment.score;
    if (riskScore !== null) {
      if (riskScore <= 3) {
        newInsights.push("Your risk score is in the low-risk category. Keep up your healthy habits!");
      } else if (riskScore <= 6) {
        newInsights.push("Your risk score indicates moderate risk. Consider discussing lifestyle changes with your doctor.");
      } else {
        newInsights.push("Your risk score suggests a higher health risk. We recommend consulting with a healthcare professional soon.");
      }
    }
    
    if (assessmentData.length >= 2) {
      const previousAssessment = assessmentData[1];
      
      // Compare with previous assessment
      if (previousAssessment.score !== null && latestAssessment.score !== null) {
        if (latestAssessment.score < previousAssessment.score) {
          newInsights.push(`Your risk score has improved since your previous assessment (from ${previousAssessment.score} to ${latestAssessment.score}).`);
        } else if (latestAssessment.score > previousAssessment.score) {
          newInsights.push(`Your risk score has increased since your previous assessment (from ${previousAssessment.score} to ${latestAssessment.score}).`);
        } else {
          newInsights.push(`Your risk score has remained stable at ${latestAssessment.score} since your last assessment.`);
        }
      }
      
      // Compare specific metrics
      const latest = latestAssessment.assessment_data;
      const previous = previousAssessment.assessment_data;
      
      if (latest && previous) {
        // Blood pressure changes
        if (latest.bloodPressureSystolic && previous.bloodPressureSystolic) {
          const bpDiff = latest.bloodPressureSystolic - previous.bloodPressureSystolic;
          if (Math.abs(bpDiff) > 10) {
            newInsights.push(`Your systolic blood pressure has ${bpDiff < 0 ? 'decreased' : 'increased'} by ${Math.abs(bpDiff)} mmHg since your last assessment.`);
          }
        }
        
        // Weight changes
        if (latest.weight && previous.weight) {
          const weightDiff = latest.weight - previous.weight;
          if (Math.abs(weightDiff) > 2) {
            newInsights.push(`Your weight has ${weightDiff < 0 ? 'decreased' : 'increased'} by ${Math.abs(weightDiff).toFixed(1)} kg since your last assessment.`);
          }
        }
      }
    }
    
    // Generate a random tip
    const tips = [
      "Regular exercise can help improve your blood pressure and overall health.",
      "A balanced diet rich in fruits and vegetables can help manage blood sugar levels.",
      "Getting 7-9 hours of sleep per night supports better overall health outcomes.",
      "Staying hydrated can help with energy levels and overall well-being.",
      "Regular health check-ups are important for early detection and prevention."
    ];
    
    newInsights.push(tips[Math.floor(Math.random() * tips.length)]);
    
    setInsights(newInsights);
  };
  
  // Handle viewing assessment details
  const viewAssessmentDetails = (assessment: Assessment) => {
    setSelectedAssessment(assessment);
    setShowFullScreenView(true);
    // Add body class to prevent scrolling when full screen view is active
    document.body.classList.add('overflow-hidden');
  };
  
  // Close full screen view
  const closeFullScreenView = () => {
    setShowFullScreenView(false);
    // Remove body class to re-enable scrolling
    document.body.classList.remove('overflow-hidden');
  };
  
  // Get color based on risk score
  const getRiskColor = (score: number | null) => {
    if (score === null) return "gray";
    if (score <= 3) return "green";
    if (score <= 6) return "amber";
    if (score <= 10) return "orange";
    return "red";
  };
  
  // Get risk category based on score
  const getRiskCategory = (score: number | null) => {
    if (score === null) return "Unknown";
    if (score <= 3) return "Low";
    if (score <= 6) return "Moderate";
    if (score <= 10) return "High";
    return "Very High";
  };
  
  // Format date for display
  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'MMM d, yyyy');
  };
  
  // Render loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    );
  }
  
  // Render empty state
  if (!isAuthenticated || !user) {
    return (
      <div className="text-center py-12">
        <Activity className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">No assessment history</h3>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          Sign in to track your health assessment history
        </p>
      </div>
    );
  }
  
  if (assessments.length === 0) {
    return (
      <div className="text-center py-12">
        <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">No assessments yet</h3>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          Complete your first health assessment to start tracking your progress
        </p>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      {/* Insights accordion */}
      {insights.length > 0 && (
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="insights">
            <AccordionTrigger className="text-sm font-medium">
              Health Insights & Tips
            </AccordionTrigger>
            <AccordionContent>
              <ul className="space-y-2 pl-5 list-disc text-sm text-gray-600 dark:text-gray-400">
                {insights.map((insight, index) => (
                  <li key={index}>{insight}</li>
                ))}
              </ul>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      )}
      
      {/* Recent assessments */}
      <div>
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          Recent Assessments
        </h3>
        
        <div className="space-y-3">
          {assessments.slice(0, 3).map((assessment) => (
            <Card key={assessment.id} className="overflow-hidden">
              <CardContent className="p-0">
                <div className="flex items-center">
                  <div 
                    className={`w-2 self-stretch bg-${getRiskColor(assessment.score)}-500`}
                  ></div>
                  <div className="flex-grow p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm font-medium">
                          {formatDate(assessment.created_at)}
                        </p>
                        <div className="flex items-center mt-1">
                          <span className={`inline-block h-2 w-2 rounded-full bg-${getRiskColor(assessment.score)}-500 mr-2`}></span>
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            {getRiskCategory(assessment.score)} Risk
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex items-center">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div className="bg-gray-100 dark:bg-gray-800 rounded-full px-3 py-1 text-sm font-medium">
                                {assessment.score}
                              </div>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Risk Score</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => viewAssessmentDetails(assessment)}
                          className="ml-2"
                        >
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {assessments.length > 3 && (
          <div className="mt-4 text-center">
            <Button variant="outline" size="sm" onClick={() => toast.info("View all assessments feature coming soon!")}>
              View All ({assessments.length})
            </Button>
          </div>
        )}
      </div>
      
      {/* Full screen assessment details view */}
      {showFullScreenView && selectedAssessment && (
        <div className="fixed inset-0 bg-background z-50 overflow-y-auto">
          <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-2">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={closeFullScreenView}
                  className="mr-2"
                >
                  <ChevronLeft className="h-5 w-5" />
                </Button>
                <h2 className="text-2xl font-bold">Assessment Details</h2>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={closeFullScreenView}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              {/* Date displayed at top */}
              <div className="mb-6 text-center">
                <p className="text-lg text-gray-500">
                  {formatDate(selectedAssessment.created_at)}
                </p>
              </div>
              
              <div className="space-y-8">
                {/* Risk score summary */}
                <div className="flex flex-col md:flex-row items-center md:items-start gap-6 justify-center md:justify-start">
                  <div 
                    className={`h-32 w-32 rounded-full bg-${getRiskColor(selectedAssessment.score)}-100 flex items-center justify-center`}
                  >
                    <span className={`text-5xl font-bold text-${getRiskColor(selectedAssessment.score)}-600`}>
                      {selectedAssessment.score}
                    </span>
                  </div>
                  <div className="text-center md:text-left md:mt-8">
                    <h3 className="text-2xl font-semibold mb-2">
                      {getRiskCategory(selectedAssessment.score)} Risk
                    </h3>
                    <p className="text-gray-500">
                      Based on your assessment data
                    </p>
                  </div>
                </div>
                
                {/* Assessment data */}
                {selectedAssessment.assessment_data && (
                  <div className="space-y-8">
                    {/* Personal metrics */}
                    <div>
                      <h4 className="text-lg font-medium text-gray-500 mb-4">Personal Metrics</h4>
                      <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4">
                        <Table>
                          <TableBody>
                            <TableRow>
                              <TableCell className="font-medium">Age</TableCell>
                              <TableCell>{selectedAssessment.assessment_data.age}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="font-medium">Gender</TableCell>
                              <TableCell className="capitalize">{selectedAssessment.assessment_data.gender}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="font-medium">Weight</TableCell>
                              <TableCell>{selectedAssessment.assessment_data.weight} kg</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="font-medium">Height</TableCell>
                              <TableCell>{selectedAssessment.assessment_data.height} cm</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="font-medium">BMI</TableCell>
                              <TableCell>
                                {selectedAssessment.assessment_data.bmi ? 
                                  selectedAssessment.assessment_data.bmi.toFixed(1) :
                                  (selectedAssessment.assessment_data.weight / Math.pow(selectedAssessment.assessment_data.height / 100, 2)).toFixed(1)
                                }
                              </TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      </div>
                    </div>
                    
                    {/* Health metrics */}
                    <div>
                      <h4 className="text-lg font-medium text-gray-500 mb-4">Health Metrics</h4>
                      <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4">
                        <Table>
                          <TableBody>
                            <TableRow>
                              <TableCell className="font-medium">Blood Pressure</TableCell>
                              <TableCell>
                                {selectedAssessment.assessment_data.bloodPressureSystolic}/
                                {selectedAssessment.assessment_data.bloodPressureDiastolic} mmHg
                              </TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="font-medium">Blood Sugar</TableCell>
                              <TableCell>{selectedAssessment.assessment_data.bloodSugar} mg/dL</TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      </div>
                    </div>
                    
                    {/* Lifestyle factors */}
                    <div>
                      <h4 className="text-lg font-medium text-gray-500 mb-4">Lifestyle Factors</h4>
                      <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4">
                        <Table>
                          <TableBody>
                            <TableRow>
                              <TableCell className="font-medium">Activity Level</TableCell>
                              <TableCell className="capitalize">
                                {selectedAssessment.assessment_data.activityLevel.replace('_', ' ')}
                              </TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="font-medium">Smoking</TableCell>
                              <TableCell className="capitalize">
                                {selectedAssessment.assessment_data.smokingStatus}
                              </TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="font-medium">Alcohol</TableCell>
                              <TableCell className="capitalize">
                                {selectedAssessment.assessment_data.alcoholConsumption}
                              </TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="font-medium">Sleep</TableCell>
                              <TableCell>{selectedAssessment.assessment_data.sleepHours} hours per night</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="font-medium">Stress Level</TableCell>
                              <TableCell>{selectedAssessment.assessment_data.stressLevel}/10</TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      </div>
                    </div>
                    
                    {/* Family History */}
                    <div>
                      <h4 className="text-lg font-medium text-gray-500 mb-4">Family History</h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className={`p-4 rounded-lg ${selectedAssessment.assessment_data.familyHistoryDiabetes ? 'bg-amber-50 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300' : 'bg-gray-50 text-gray-500 dark:bg-gray-800'}`}>
                          <p className="text-sm font-medium">Diabetes</p>
                          <p className="text-xs mt-1">{selectedAssessment.assessment_data.familyHistoryDiabetes ? 'Yes' : 'No'}</p>
                        </div>
                        <div className={`p-4 rounded-lg ${selectedAssessment.assessment_data.familyHistoryHeartDisease ? 'bg-amber-50 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300' : 'bg-gray-50 text-gray-500 dark:bg-gray-800'}`}>
                          <p className="text-sm font-medium">Heart Disease</p>
                          <p className="text-xs mt-1">{selectedAssessment.assessment_data.familyHistoryHeartDisease ? 'Yes' : 'No'}</p>
                        </div>
                        <div className={`p-4 rounded-lg ${selectedAssessment.assessment_data.familyHistoryHypertension ? 'bg-amber-50 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300' : 'bg-gray-50 text-gray-500 dark:bg-gray-800'}`}>
                          <p className="text-sm font-medium">Hypertension</p>
                          <p className="text-xs mt-1">{selectedAssessment.assessment_data.familyHistoryHypertension ? 'Yes' : 'No'}</p>
                        </div>
                        <div className={`p-4 rounded-lg ${selectedAssessment.assessment_data.familyHistoryCancer ? 'bg-amber-50 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300' : 'bg-gray-50 text-gray-500 dark:bg-gray-800'}`}>
                          <p className="text-sm font-medium">Cancer</p>
                          <p className="text-xs mt-1">{selectedAssessment.assessment_data.familyHistoryCancer ? 'Yes' : 'No'}</p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Additional Medical Information */}
                    {(selectedAssessment.assessment_data.medications || 
                      selectedAssessment.assessment_data.allergies ||
                      selectedAssessment.assessment_data.recentIllnesses ||
                      selectedAssessment.assessment_data.additionalNotes) && (
                      <div>
                        <h4 className="text-lg font-medium text-gray-500 mb-4">Additional Medical Information</h4>
                        <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4 space-y-4">
                          {selectedAssessment.assessment_data.medications && (
                            <div>
                              <p className="font-medium mb-1">Current Medications:</p>
                              <p className="text-gray-700 dark:text-gray-300">{selectedAssessment.assessment_data.medications || "None"}</p>
                            </div>
                          )}
                          {selectedAssessment.assessment_data.allergies && (
                            <div>
                              <p className="font-medium mb-1">Allergies:</p>
                              <p className="text-gray-700 dark:text-gray-300">{selectedAssessment.assessment_data.allergies || "None"}</p>
                            </div>
                          )}
                          {selectedAssessment.assessment_data.recentIllnesses && (
                            <div>
                              <p className="font-medium mb-1">Recent Illnesses:</p>
                              <p className="text-gray-700 dark:text-gray-300">{selectedAssessment.assessment_data.recentIllnesses || "None"}</p>
                            </div>
                          )}
                          {selectedAssessment.assessment_data.additionalNotes && (
                            <div>
                              <p className="font-medium mb-1">Additional Notes:</p>
                              <p className="text-gray-700 dark:text-gray-300">{selectedAssessment.assessment_data.additionalNotes || "None"}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}
                
                {/* Back button at bottom */}
                <div className="mt-8 flex justify-center">
                  <Button onClick={closeFullScreenView} className="px-8">
                    Back to History
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssessmentHistory;
