
import React from 'react';
import { format } from 'date-fns';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow
} from '@/components/ui/table';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { CalendarIcon, Activity, EyeIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Assessment {
  id: string;
  created_at: string;
  assessment_data: any;
  score: number | null;
}

interface AssessmentHistoryProps {
  assessments: Assessment[];
  isLoading: boolean;
}

const AssessmentHistory: React.FC<AssessmentHistoryProps> = ({ assessments, isLoading }) => {
  // Helper to format date
  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'MMM d, yyyy');
  };
  
  // Helper to format time
  const formatTime = (dateString: string) => {
    return format(new Date(dateString), 'h:mm a');
  };
  
  // Helper to get score color
  const getScoreColor = (score: number | null) => {
    if (score === null) return 'bg-gray-100 text-gray-600 border-gray-200';
    if (score < 4) return 'bg-green-50 text-green-700 border-green-200';
    if (score < 7) return 'bg-amber-50 text-amber-700 border-amber-200';
    return 'bg-red-50 text-red-700 border-red-200';
  };
  
  // Helper to get score label
  const getScoreLabel = (score: number | null) => {
    if (score === null) return 'Not Available';
    if (score < 4) return 'Low Risk';
    if (score < 7) return 'Moderate Risk';
    return 'High Risk';
  };
  
  if (isLoading) {
    return (
      <Card className="shadow-sm border bg-white/80 backdrop-blur-sm dark:bg-gray-800/90">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-medium text-indigo-700 dark:text-indigo-400 flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Assessment History
          </CardTitle>
          <CardDescription>Loading your past health assessments</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex flex-col gap-2">
                <Skeleton className="h-5 w-1/3" />
                <Skeleton className="h-10 w-full" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }
  
  if (assessments.length === 0) {
    return (
      <Card className="shadow-sm border bg-white/80 backdrop-blur-sm dark:bg-gray-800/90">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-medium text-indigo-700 dark:text-indigo-400 flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Assessment History
          </CardTitle>
          <CardDescription>Your health assessment records will appear here</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="text-center max-w-sm">
              <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-full p-3 mb-3 mx-auto w-fit">
                <CalendarIcon className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
              </div>
              <h3 className="text-base font-medium text-gray-900 dark:text-gray-100 mb-1">No Assessments Yet</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 max-w-sm">
                Complete your first health assessment to start tracking your well-being journey.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="shadow-sm border bg-white/80 backdrop-blur-sm dark:bg-gray-800/90">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-medium text-indigo-700 dark:text-indigo-400 flex items-center gap-2">
          <Activity className="h-4 w-4" /> 
          Assessment History
        </CardTitle>
        <CardDescription>
          Track your health risk assessments over time
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50/50 dark:bg-gray-800/50">
                <TableHead className="font-medium">Date</TableHead>
                <TableHead className="font-medium">Time</TableHead>
                <TableHead className="font-medium">Risk Score</TableHead>
                <TableHead className="w-[80px] font-medium">Details</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {assessments.map((assessment) => (
                <TableRow key={assessment.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/40">
                  <TableCell className="font-medium">
                    {formatDate(assessment.created_at)}
                  </TableCell>
                  <TableCell>{formatTime(assessment.created_at)}</TableCell>
                  <TableCell>
                    <Badge className={`${getScoreColor(assessment.score)} border`} variant="outline">
                      {assessment.score !== null ? assessment.score : 'N/A'} - {getScoreLabel(assessment.score)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button 
                      variant="ghost"
                      size="sm"
                      className="text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 p-1 h-auto"
                    >
                      <EyeIcon size={14} className="mr-1" />
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default AssessmentHistory;
