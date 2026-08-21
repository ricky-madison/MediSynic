import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { calculateBMI, calculateHealthRisk } from '@/utils/healthCalculations';
import { 
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage 
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2 } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

// Schema for form validation
const formSchema = z.object({
  // Personal Information
  age: z.coerce.number().int().min(18, "You must be at least 18").max(120, "Please enter a valid age"),
  gender: z.enum(["male", "female", "other"], {
    required_error: "Please select a gender",
  }),
  height: z.coerce.number().min(100, "Height must be at least 100cm").max(250, "Height must be less than 250cm"),
  weight: z.coerce.number().min(30, "Weight must be at least 30kg").max(300, "Weight must be less than 300kg"),
  
  // Health Metrics
  bloodPressureSystolic: z.coerce.number().min(70, "Systolic pressure must be at least 70").max(250, "Systolic pressure must be less than 250"),
  bloodPressureDiastolic: z.coerce.number().min(40, "Diastolic pressure must be at least 40").max(150, "Diastolic pressure must be less than 150"),
  bloodSugar: z.coerce.number().min(50, "Blood sugar must be at least 50 mg/dL").max(500, "Blood sugar must be less than 500 mg/dL"),
  cholesterolTotal: z.coerce.number().optional(),
  cholesterolHDL: z.coerce.number().optional(),
  cholesterolLDL: z.coerce.number().optional(),
  
  // Lifestyle Factors
  activityLevel: z.enum(["sedentary", "lightly_active", "moderately_active", "very_active", "extremely_active"], {
    required_error: "Please select an activity level",
  }),
  smokingStatus: z.enum(["never", "former", "current_light", "current_heavy"], {
    required_error: "Please select smoking status",
  }),
  alcoholConsumption: z.enum(["none", "light", "moderate", "heavy"], {
    required_error: "Please select alcohol consumption level",
  }),
  sleepHours: z.coerce.number().min(3, "Sleep hours must be at least 3").max(14, "Sleep hours must be less than 14"),
  stressLevel: z.coerce.number().min(1, "Stress level must be at least 1").max(10, "Stress level must be less than or equal to 10"),
  
  // Medical History
  familyHistoryDiabetes: z.boolean().default(false),
  familyHistoryHeartDisease: z.boolean().default(false),
  familyHistoryHypertension: z.boolean().default(false),
  familyHistoryCancer: z.boolean().default(false),
  
  // Existing Conditions
  hasDiabetes: z.boolean().default(false),
  hasHeartDisease: z.boolean().default(false),
  hasHypertension: z.boolean().default(false),
  hasAsthma: z.boolean().default(false),
  hasCancer: z.boolean().default(false),
  
  // Diet & Nutrition
  dietType: z.enum([
    "omnivore", 
    "vegetarian", 
    "vegan", 
    "pescatarian", 
    "keto", 
    "paleo", 
    "mediterranean", 
    "other"
  ], {
    required_error: "Please select a diet type",
  }),
  waterIntake: z.coerce.number().min(0, "Water intake cannot be negative").max(20, "Water intake must be less than 20"),
  fruitsVegetablesIntake: z.enum(["low", "moderate", "high"], {
    required_error: "Please select fruits/vegetables intake level",
  }),
  
  // Mental Health
  mentalHealthIssues: z.array(z.string()).optional(),
  feelingsDepression: z.coerce.number().min(1).max(5),
  feelingsAnxiety: z.coerce.number().min(1).max(5),
  overallMoodRating: z.coerce.number().min(1).max(5),
  
  // Additional Info - moved to other tabs
  recentIllnesses: z.string().optional(),
  medications: z.string().optional(),
  allergies: z.string().optional(),
  additionalNotes: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const defaultValues: Partial<FormValues> = {
  age: 30,
  gender: "male",
  height: 170,
  weight: 70,
  bloodPressureSystolic: 120,
  bloodPressureDiastolic: 80,
  bloodSugar: 100,
  activityLevel: "moderately_active",
  smokingStatus: "never",
  alcoholConsumption: "light",
  sleepHours: 7,
  stressLevel: 4,
  dietType: "omnivore",
  waterIntake: 8,
  fruitsVegetablesIntake: "moderate",
  feelingsDepression: 1,
  feelingsAnxiety: 1,
  overallMoodRating: 3,
};

const HealthAssessmentForm: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>("personal");
  const [riskScore, setRiskScore] = useState<number | null>(null);
  const [showResults, setShowResults] = useState<boolean>(false);
  const [formCompleted, setFormCompleted] = useState<boolean>(false);
  
  // Initialize form with hook-form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });
  
  const { watch, handleSubmit, control, formState: { errors, isValid } } = form;
  
  // Calculate BMI based on current form values
  const height = watch('height');
  const weight = watch('weight');
  const bmi = calculateBMI(height, weight);
  
  // Handle tabs navigation
  const handleNextTab = (current: string, next: string) => {
    if (
      (current === "personal" && !errors.age && !errors.gender && !errors.height && !errors.weight) ||
      (current === "health" && !errors.bloodPressureSystolic && !errors.bloodPressureDiastolic && !errors.bloodSugar) ||
      (current === "lifestyle" && !errors.activityLevel && !errors.smokingStatus && !errors.alcoholConsumption && !errors.sleepHours) ||
      (current === "medical") ||
      (current === "diet" && !errors.dietType) ||
      (current === "mental" && !errors.feelingsDepression && !errors.feelingsAnxiety && !errors.overallMoodRating)
    ) {
      setActiveTab(next);
    }
  };
  
  // Handle form submission
  const onSubmit = async (data: FormValues) => {
    try {
      setIsLoading(true);
      
      // Calculate health risk score with the updated function that accepts Partial<HealthData>
      const calculatedRiskScore = calculateHealthRisk(data);
      setRiskScore(calculatedRiskScore);
      
      // Add BMI to the data
      const assessmentData = {
        ...data,
        bmi: bmi
      };
      
      // Save to Supabase if user is authenticated
      if (isAuthenticated && user) {
        const { error } = await supabase
          .from('diabetes_assessments')
          .insert({
            user_id: user.id,
            assessment_data: assessmentData,
            score: calculatedRiskScore
          });
        
        if (error) {
          throw error;
        }
        
        toast.success('Assessment saved successfully!');
      } else {
        // Just show results without saving if not authenticated
        toast.info('Assessment completed! Sign in to save your results.');
      }
      
      setShowResults(true);
      setFormCompleted(true);
    } catch (error) {
      console.error('Error submitting assessment:', error);
      toast.error('Failed to submit assessment. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div>
      {showResults ? (
        <AssessmentResults 
          riskScore={riskScore} 
          formData={form.getValues()} 
          onRetake={() => {
            setShowResults(false);
            setFormCompleted(false);
            setRiskScore(null);
          }}
        />
      ) : (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-6 mb-6">
            <TabsTrigger value="personal">Personal</TabsTrigger>
            <TabsTrigger value="health">Health</TabsTrigger>
            <TabsTrigger value="lifestyle">Lifestyle</TabsTrigger>
            <TabsTrigger value="medical">Medical</TabsTrigger>
            <TabsTrigger value="diet">Diet</TabsTrigger>
            <TabsTrigger value="mental">Mental</TabsTrigger>
          </TabsList>
          
          <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Personal Information Tab */}
              <TabsContent value="personal" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={control}
                    name="age"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Age</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={control}
                    name="gender"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Gender</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select gender" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="male">Male</SelectItem>
                            <SelectItem value="female">Female</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={control}
                    name="height"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Height (cm)</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={control}
                    name="weight"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Weight (kg)</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                {/* Display BMI */}
                <div className="bg-indigo-50 dark:bg-indigo-950/30 p-3 rounded-md">
                  <p className="text-sm font-medium text-indigo-700 dark:text-indigo-300">
                    Your BMI: {bmi.toFixed(1)}
                  </p>
                  <p className="text-xs text-indigo-600/70 dark:text-indigo-400/70">
                    {bmi < 18.5 
                      ? "Underweight" 
                      : bmi < 25 
                      ? "Normal weight" 
                      : bmi < 30 
                      ? "Overweight" 
                      : "Obese"}
                  </p>
                </div>
                
                <div className="pt-4">
                  <Button 
                    type="button"
                    onClick={() => handleNextTab("personal", "health")}
                    className="w-full"
                  >
                    Next: Health Metrics
                  </Button>
                </div>
              </TabsContent>
              
              {/* Health Metrics Tab */}
              <TabsContent value="health" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={control}
                    name="bloodPressureSystolic"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Systolic Blood Pressure (mmHg)</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                        <FormDescription>
                          The top number in a blood pressure reading
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={control}
                    name="bloodPressureDiastolic"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Diastolic Blood Pressure (mmHg)</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                        <FormDescription>
                          The bottom number in a blood pressure reading
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={control}
                    name="bloodSugar"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Blood Sugar (mg/dL)</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                        <FormDescription>
                          Fasting blood glucose level
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Adding medications field moved from Additional tab */}
                  <FormField
                    control={control}
                    name="medications"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Current Medications</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormDescription>
                          List any medications you are currently taking
                        </FormDescription>
                      </FormItem>
                    )}
                  />
                </div>
                
                <Accordion type="single" collapsible>
                  <AccordionItem value="cholesterol">
                    <AccordionTrigger>Optional: Cholesterol Information</AccordionTrigger>
                    <AccordionContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                        <FormField
                          control={control}
                          name="cholesterolTotal"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Total Cholesterol (mg/dL)</FormLabel>
                              <FormControl>
                                <Input type="number" {...field} />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={control}
                          name="cholesterolHDL"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>HDL Cholesterol (mg/dL)</FormLabel>
                              <FormControl>
                                <Input type="number" {...field} />
                              </FormControl>
                              <FormDescription>
                                "Good" cholesterol
                              </FormDescription>
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={control}
                          name="cholesterolLDL"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>LDL Cholesterol (mg/dL)</FormLabel>
                              <FormControl>
                                <Input type="number" {...field} />
                              </FormControl>
                              <FormDescription>
                                "Bad" cholesterol
                              </FormDescription>
                            </FormItem>
                          )}
                        />
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
                
                <div className="flex justify-between pt-4">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setActiveTab("personal")}
                  >
                    Previous
                  </Button>
                  <Button 
                    type="button"
                    onClick={() => handleNextTab("health", "lifestyle")}
                  >
                    Next: Lifestyle
                  </Button>
                </div>
              </TabsContent>
              
              {/* Lifestyle Tab */}
              <TabsContent value="lifestyle" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={control}
                    name="activityLevel"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Physical Activity Level</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select activity level" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="sedentary">Sedentary (little or no exercise)</SelectItem>
                            <SelectItem value="lightly_active">Lightly active (light exercise 1-3 days/week)</SelectItem>
                            <SelectItem value="moderately_active">Moderately active (moderate exercise 3-5 days/week)</SelectItem>
                            <SelectItem value="very_active">Very active (hard exercise 6-7 days/week)</SelectItem>
                            <SelectItem value="extremely_active">Extremely active (strenuous training 2x/day)</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={control}
                    name="smokingStatus"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Smoking Status</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select smoking status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="never">Never smoked</SelectItem>
                            <SelectItem value="former">Former smoker</SelectItem>
                            <SelectItem value="current_light">Current light smoker (≤10/day)</SelectItem>
                            <SelectItem value="current_heavy">Current heavy smoker ({">"}10/day)</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={control}
                    name="alcoholConsumption"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Alcohol Consumption</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select alcohol consumption level" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="none">None</SelectItem>
                            <SelectItem value="light">Light (1-2 drinks/week)</SelectItem>
                            <SelectItem value="moderate">Moderate (3-7 drinks/week)</SelectItem>
                            <SelectItem value="heavy">Heavy ({">"}7 drinks/week)</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={control}
                    name="sleepHours"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Average Sleep (hours/night)</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={control}
                  name="stressLevel"
                  render={({ field: { value, onChange } }) => (
                    <FormItem>
                      <FormLabel>Stress Level (1-10)</FormLabel>
                      <FormControl>
                        <div className="flex flex-col space-y-2">
                          <Slider 
                            min={1} 
                            max={10} 
                            step={1} 
                            value={[value]} 
                            onValueChange={(vals) => onChange(vals[0])} 
                          />
                          <div className="flex justify-between text-xs text-gray-500">
                            <span>Low (1)</span>
                            <span>Moderate (5)</span>
                            <span>High (10)</span>
                          </div>
                        </div>
                      </FormControl>
                      <FormDescription>
                        How would you rate your typical stress level?
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="flex justify-between pt-4">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setActiveTab("health")}
                  >
                    Previous
                  </Button>
                  <Button 
                    type="button"
                    onClick={() => handleNextTab("lifestyle", "medical")}
                  >
                    Next: Medical History
                  </Button>
                </div>
              </TabsContent>
              
              {/* Medical History Tab */}
              <TabsContent value="medical" className="space-y-4">
                <div className="space-y-4">
                  <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-md">
                    <h3 className="font-medium text-slate-700 dark:text-slate-300 mb-2">Family History</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">
                      Has any immediate family member (parents, siblings) been diagnosed with any of the following conditions?
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={control}
                        name="familyHistoryDiabetes"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel>Diabetes</FormLabel>
                            </div>
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={control}
                        name="familyHistoryHeartDisease"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel>Heart Disease</FormLabel>
                            </div>
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={control}
                        name="familyHistoryHypertension"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel>Hypertension</FormLabel>
                            </div>
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={control}
                        name="familyHistoryCancer"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel>Cancer</FormLabel>
                            </div>
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                  
                  <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-md">
                    <h3 className="font-medium text-slate-700 dark:text-slate-300 mb-2">Existing Conditions</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">
                      Have you been diagnosed with any of the following conditions?
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={control}
                        name="hasDiabetes"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel>Diabetes</FormLabel>
                            </div>
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={control}
                        name="hasHeartDisease"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel>Heart Disease</FormLabel>
                            </div>
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={control}
                        name="hasHypertension"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel>Hypertension</FormLabel>
                            </div>
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={control}
                        name="hasAsthma"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel>Asthma</FormLabel>
                            </div>
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={control}
                        name="hasCancer"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel>Cancer</FormLabel>
                            </div>
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  {/* Moving allergies and recent illnesses fields from Additional tab */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={control}
                      name="recentIllnesses"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Recent Illnesses (past 3 months)</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormDescription>
                            Any significant illnesses, infections, etc.
                          </FormDescription>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={control}
                      name="allergies"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Allergies</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormDescription>
                            Any known allergies to medications, foods, etc.
                          </FormDescription>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                
                <div className="flex justify-between pt-4">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setActiveTab("lifestyle")}
                  >
                    Previous
                  </Button>
                  <Button 
                    type="button"
                    onClick={() => handleNextTab("medical", "diet")}
                  >
                    Next: Diet & Nutrition
                  </Button>
                </div>
              </TabsContent>
              
              {/* Diet & Nutrition Tab */}
              <TabsContent value="diet" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={control}
                    name="dietType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Primary Diet Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select diet type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="omnivore">Omnivore (meat & plants)</SelectItem>
                            <SelectItem value="vegetarian">Vegetarian</SelectItem>
                            <SelectItem value="vegan">Vegan</SelectItem>
                            <SelectItem value="pescatarian">Pescatarian</SelectItem>
                            <SelectItem value="keto">Keto / Low-carb</SelectItem>
                            <SelectItem value="paleo">Paleo</SelectItem>
                            <SelectItem value="mediterranean">Mediterranean</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={control}
                    name="waterIntake"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Water Intake (glasses/day)</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                        <FormDescription>
                          One glass is approximately 8 oz or 240ml
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={control}
                    name="fruitsVegetablesIntake"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Fruits & Vegetables Intake</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select intake level" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="low">Low (0-2 servings/day)</SelectItem>
                            <SelectItem value="moderate">Moderate (3-4 servings/day)</SelectItem>
                            <SelectItem value="high">High (5+ servings/day)</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Adding additional notes field from Additional tab */}
                  <FormField
                    control={control}
                    name="additionalNotes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Additional Notes</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormDescription>
                          Any other health information you'd like to share
                        </FormDescription>
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="flex justify-between pt-4">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setActiveTab("medical")}
                  >
                    Previous
                  </Button>
                  <Button 
                    type="button"
                    onClick={() => handleNextTab("diet", "mental")}
                  >
                    Next: Mental Health
                  </Button>
                </div>
              </TabsContent>
              
              {/* Mental Health Tab with Submit Button */}
              <TabsContent value="mental" className="space-y-4">
                <div className="space-y-6">
                  <FormField
                    control={control}
                    name="feelingsDepression"
                    render={({ field: { value, onChange } }) => (
                      <FormItem>
                        <FormLabel>How often do you feel down, depressed, or hopeless?</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={(val) => onChange(parseInt(val))}
                            defaultValue={value.toString()}
                            className="flex flex-col space-y-1"
                          >
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="1" />
                              </FormControl>
                              <FormLabel className="font-normal">
                                Never
                              </FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="2" />
                              </FormControl>
                              <FormLabel className="font-normal">
                                Rarely
                              </FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="3" />
                              </FormControl>
                              <FormLabel className="font-normal">
                                Sometimes
                              </FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="4" />
                              </FormControl>
                              <FormLabel className="font-normal">
                                Often
                              </FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="5" />
                              </FormControl>
                              <FormLabel className="font-normal">
                                Always
                              </FormLabel>
                            </FormItem>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={control}
                    name="feelingsAnxiety"
                    render={({ field: { value, onChange } }) => (
                      <FormItem>
                        <FormLabel>How often do you feel nervous, anxious, or on edge?</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={(val) => onChange(parseInt(val))}
                            defaultValue={value.toString()}
                            className="flex flex-col space-y-1"
                          >
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="1" />
                              </FormControl>
                              <FormLabel className="font-normal">
                                Never
                              </FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="2" />
                              </FormControl>
                              <FormLabel className="font-normal">
                                Rarely
                              </FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="3" />
                              </FormControl>
                              <FormLabel className="font-normal">
                                Sometimes
                              </FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="4" />
                              </FormControl>
                              <FormLabel className="font-normal">
                                Often
                              </FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="5" />
                              </FormControl>
                              <FormLabel className="font-normal">
                                Always
                              </FormLabel>
                            </FormItem>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={control}
                    name="overallMoodRating"
                    render={({ field: { value, onChange } }) => (
                      <FormItem>
                        <FormLabel>How would you rate your overall mood?</FormLabel>
                        <FormControl>
                          <div className="flex flex-col space-y-2">
                            <Slider 
                              min={1} 
                              max={5} 
                              step={1} 
                              value={[value]} 
                              onValueChange={(vals) => onChange(vals[0])} 
                            />
                            <div className="flex justify-between text-xs text-gray-500">
                              <span>Poor</span>
                              <span>Fair</span>
                              <span>Good</span>
                              <span>Very Good</span>
                              <span>Excellent</span>
                            </div>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="flex justify-between pt-4">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setActiveTab("diet")}
                  >
                    Previous
                  </Button>
                  <Button 
                    type="submit"
                    disabled={isLoading}
                    className="bg-indigo-600 hover:bg-indigo-700"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      "Submit Assessment"
                    )}
                  </Button>
                </div>
              </TabsContent>
            </form>
          </Form>
        </Tabs>
      )}
    </div>
  );
};

interface AssessmentResultsProps {
  riskScore: number | null;
  formData: FormValues;
  onRetake: () => void;
}

const AssessmentResults: React.FC<AssessmentResultsProps> = ({ riskScore, formData, onRetake }) => {
  // Determine risk level and color
  const getRiskLevel = () => {
    if (riskScore === null) return { level: 'Unknown', color: 'gray' };
    if (riskScore <= 3) return { level: 'Low', color: 'green' };
    if (riskScore <= 6) return { level: 'Moderate', color: 'amber' };
    return { level: 'High', color: 'red' };
  };
  
  const risk = getRiskLevel();
  
  // Generate recommendations based on form data
  const getRecommendations = () => {
    const recommendations = [];
    
    // BMI recommendations
    const bmi = calculateBMI(formData.height, formData.weight);
    if (bmi < 18.5) {
      recommendations.push({
        title: 'Consider a weight gain plan',
        description: 'Your BMI indicates you are underweight. Consider consulting with a healthcare provider about a healthy weight gain plan.',
      });
    } else if (bmi >= 25 && bmi < 30) {
      recommendations.push({
        title: 'Weight management',
        description: 'Your BMI indicates you are overweight. Consider implementing a moderate exercise routine and balanced diet.',
      });
    } else if (bmi >= 30) {
      recommendations.push({
        title: 'Weight reduction plan',
        description: 'Your BMI indicates obesity. We recommend consulting with a healthcare provider about a weight reduction plan.',
      });
    }
    
    // Blood pressure recommendations
    if (formData.bloodPressureSystolic > 130 || formData.bloodPressureDiastolic > 80) {
      recommendations.push({
        title: 'Monitor blood pressure',
        description: 'Your blood pressure is elevated. Consider regular monitoring and consult a healthcare provider.',
      });
    }
    
    // Blood sugar recommendations
    if (formData.bloodSugar > 100) {
      recommendations.push({
        title: 'Monitor blood sugar',
        description: 'Your blood sugar is elevated. Consider regular monitoring and consult a healthcare provider.',
      });
    }
    
    // Lifestyle recommendations
    if (formData.smokingStatus === 'current_light' || formData.smokingStatus === 'current_heavy') {
      recommendations.push({
        title: 'Smoking cessation',
        description: 'Consider a smoking cessation program to improve your overall health and reduce disease risk.',
      });
    }
    
    if (formData.alcoholConsumption === 'heavy') {
      recommendations.push({
        title: 'Reduce alcohol consumption',
        description: 'Consider reducing your alcohol intake to improve your overall health.',
      });
    }
    
    if (formData.sleepHours < 7) {
      recommendations.push({
        title: 'Improve sleep habits',
        description: 'Aim for 7-9 hours of sleep per night to improve overall health and well-being.',
      });
    }
    
    if (formData.stressLevel > 7) {
      recommendations.push({
        title: 'Stress management',
        description: 'Consider stress management techniques such as meditation, yoga, or counseling.',
      });
    }
    
    if (formData.activityLevel === 'sedentary' || formData.activityLevel === 'lightly_active') {
      recommendations.push({
        title: 'Increase physical activity',
        description: 'Aim for at least 150 minutes of moderate-intensity aerobic activity per week.',
      });
    }
    
    // Diet recommendations
    if (formData.waterIntake < 8) {
      recommendations.push({
        title: 'Increase water intake',
        description: 'Aim for at least 8 glasses of water per day to stay properly hydrated.',
      });
    }
    
    if (formData.fruitsVegetablesIntake === 'low') {
      recommendations.push({
        title: 'Increase fruits and vegetables',
        description: 'Try to consume at least 5 servings of fruits and vegetables per day.',
      });
    }
    
    // Mental health recommendations
    if (formData.feelingsDepression >= 4 || formData.feelingsAnxiety >= 4) {
      recommendations.push({
        title: 'Mental health support',
        description: 'Consider seeking support from a mental health professional for your feelings of depression or anxiety.',
      });
    }
    
    // Return at least 3 recommendations, but no more than 5
    return recommendations.slice(0, 5);
  };
  
  const recommendations = getRecommendations();
  
  return (
    <div className="space-y-6">
      <Card className={`bg-${risk.color}-50 dark:bg-${risk.color}-900/20 border-${risk.color}-200 dark:border-${risk.color}-800`}>
        <CardHeader>
          <CardTitle className="text-center text-xl text-indigo-700 dark:text-indigo-400">
            Assessment Complete
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center space-y-4">
            <div className={`inline-flex items-center justify-center w-24 h-24 rounded-full bg-${risk.color}-100 dark:bg-${risk.color}-900/40`}>
              <span className={`text-4xl font-bold text-${risk.color}-600 dark:text-${risk.color}-400`}>
                {riskScore !== null ? riskScore : 'N/A'}
              </span>
            </div>
            <div>
              <h3 className={`text-xl font-semibold text-${risk.color}-700 dark:text-${risk.color}-400`}>
                {risk.level} Risk
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Based on your assessment data
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="space-y-6">
        <h3 className="text-lg font-semibold">Recommendations</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {recommendations.map((recommendation, index) => (
            <Card key={index} className="border-indigo-100 dark:border-indigo-800/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">{recommendation.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {recommendation.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="flex justify-between pt-6">
          <p className="text-sm text-green-600 dark:text-green-400">
            Your assessment has been saved to your account
          </p>
          <Button 
            onClick={onRetake}
            variant="outline"
          >
            Take Another Assessment
          </Button>
        </div>
      </div>
    </div>
  );
};

export default HealthAssessmentForm;
