
import React, { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth, DEMO_EMAIL, DEMO_PASSWORD } from '@/context/AuthContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import FadeIn from '@/components/FadeIn';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, EyeIcon, EyeOffIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

// Define form validation schemas
const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

const signupSchema = z.object({
  firstName: z.string().min(2, { message: "First name must be at least 2 characters" }),
  lastName: z.string().min(2, { message: "Last name must be at least 2 characters" }),
  dateOfBirth: z.date({ required_error: "Date of birth is required" }),
  email: z.string().email({ message: "Please enter a valid email address" }).trim(),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
  confirmPassword: z.string().min(6, { message: "Please confirm your password" }),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type LoginFormValues = z.infer<typeof loginSchema>;
type SignupFormValues = z.infer<typeof signupSchema>;

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { signIn, signUp, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Initialize forms with proper reset
  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });
  
  const signupForm = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      dateOfBirth: undefined,
      email: '',
      password: '',
      confirmPassword: '',
    },
    mode: 'onChange', // Validate on change to provide immediate feedback
  });

  // Handle form submissions with better error handling
  const onLoginSubmit = async (values: LoginFormValues) => {
    try {
      await signIn(values.email, values.password);
      navigate('/dashboard');
    } catch (error) {
      console.error("Login error:", error);
      // Error is already handled in the context
    }
  };

  const onSignupSubmit = async (values: SignupFormValues) => {
    try {
      console.log("Submitting signup form with values:", values);
      await signUp(
        values.email, 
        values.password, 
        values.firstName,
        values.lastName,
        values.dateOfBirth
      );
      toast({
        title: "Account created!",
        description: "Please check your email to verify your account.",
      });
      setIsLogin(true); // Switch to login form after signup
      loginForm.setValue('email', values.email); // Pre-fill email for convenience
    } catch (error) {
      console.error("Signup error:", error);
      // Error is already handled in the context
    }
  };

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
    // Reset forms when toggling
    if (isLogin) {
      signupForm.reset();
    } else {
      loginForm.reset();
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  // If already logged in, redirect to dashboard
  if (isAuthenticated && !loading) {
    return <Navigate to="/dashboard" />;
  }

  // Form error debugging
  console.log("Signup form errors:", signupForm.formState.errors);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <Header />
      
      <main className="pt-28 pb-20">
        <div className="container-tight">
          <FadeIn delay={100} className="text-center mb-12">
            <span className="chip chip-blue mb-4">Diabetes Management</span>
            <h1 className="text-3xl md:text-4xl font-bold mb-6 text-medical-gray-900 dark:text-white">
              {isLogin ? 'Welcome Back' : 'Create an Account'}
            </h1>
            <p className="text-lg text-medical-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              {isLogin 
                ? 'Sign in to access your personalized diabetes management system'
                : 'Join MediSynic to receive tailored diabetes management recommendations'
              }
            </p>
          </FadeIn>
          
          <FadeIn delay={200} className="max-w-md mx-auto">
            <Card className="bg-white/80 dark:bg-gray-800/50 backdrop-blur-sm shadow-xl border-0 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-50/40 to-white/80 dark:from-gray-800/40 dark:to-gray-900/80 -z-10" />
              <CardHeader className="pb-2">
                <CardTitle className="text-2xl font-bold bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">
                  {isLogin ? 'Sign In' : 'Create Account'}
                </CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-300">
                  {isLogin 
                    ? 'Enter your credentials to access your account' 
                    : 'Fill out the form below to create your account'
                  }
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                {isLogin ? (
                  <Form {...loginForm}>
                    <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-6">
                      <FormField
                        control={loginForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-medium text-gray-700 dark:text-gray-300">Email</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="your.email@example.com" 
                                className="bg-gray-50/50 dark:bg-gray-800/50 border-0 shadow-sm focus:ring-2 focus:ring-purple-500/20" 
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={loginForm.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-medium text-gray-700 dark:text-gray-300">Password</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Input 
                                  type={showPassword ? "text" : "password"} 
                                  placeholder="********"
                                  className="bg-gray-50/50 dark:bg-gray-800/50 border-0 shadow-sm focus:ring-2 focus:ring-purple-500/20 pr-10" 
                                  {...field} 
                                />
                                <button 
                                  type="button"
                                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                                  onClick={togglePasswordVisibility}
                                >
                                  {showPassword ? 
                                    <EyeOffIcon className="h-4 w-4" /> : 
                                    <EyeIcon className="h-4 w-4" />
                                  }
                                </button>
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button 
                        type="submit" 
                        className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 shadow-md hover:shadow-lg transition-all duration-200" 
                        disabled={loginForm.formState.isSubmitting}
                      >
                        {loginForm.formState.isSubmitting ? 'Signing in...' : 'Sign In'}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        className="w-full"
                        onClick={async () => {
                          await signIn(DEMO_EMAIL, DEMO_PASSWORD);
                          navigate('/dashboard');
                        }}
                      >
                        Continue with demo account (John Doe)
                      </Button>
                      <p className="text-xs text-center text-muted-foreground">
                        Demo login: {DEMO_EMAIL} / {DEMO_PASSWORD}
                      </p>
                    </form>
                  </Form>
                ) : (
                  <Form {...signupForm}>
                    <form onSubmit={signupForm.handleSubmit(onSignupSubmit)} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={signupForm.control}
                          name="firstName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm font-medium text-gray-700 dark:text-gray-300">First Name</FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="John" 
                                  className="bg-gray-50/50 dark:bg-gray-800/50 border-0 shadow-sm focus:ring-2 focus:ring-purple-500/20" 
                                  {...field} 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={signupForm.control}
                          name="lastName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm font-medium text-gray-700 dark:text-gray-300">Last Name</FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="Doe" 
                                  className="bg-gray-50/50 dark:bg-gray-800/50 border-0 shadow-sm focus:ring-2 focus:ring-purple-500/20" 
                                  {...field} 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={signupForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-medium text-gray-700 dark:text-gray-300">Email</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="your.email@example.com" 
                                className="bg-gray-50/50 dark:bg-gray-800/50 border-0 shadow-sm focus:ring-2 focus:ring-purple-500/20" 
                                {...field} 
                                onChange={(e) => field.onChange(e.target.value.trim())}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={signupForm.control}
                        name="dateOfBirth"
                        render={({ field }) => (
                          <FormItem className="flex flex-col">
                            <FormLabel className="text-sm font-medium text-gray-700 dark:text-gray-300">Date of Birth</FormLabel>
                            <Popover>
                              <PopoverTrigger asChild>
                                <FormControl>
                                  <Button
                                    variant={"outline"}
                                    className={cn(
                                      "w-full pl-3 text-left font-normal bg-gray-50/50 dark:bg-gray-800/50 border-0 shadow-sm hover:bg-gray-100/50 dark:hover:bg-gray-700/50",
                                      !field.value && "text-muted-foreground"
                                    )}
                                  >
                                    {field.value ? (
                                      format(field.value, "PPP")
                                    ) : (
                                      <span>Pick a date</span>
                                    )}
                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                  </Button>
                                </FormControl>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0 bg-white dark:bg-gray-800 shadow-lg rounded-lg border-0" align="start">
                                <Calendar
                                  mode="single"
                                  selected={field.value}
                                  onSelect={field.onChange}
                                  disabled={(date) =>
                                    date > new Date() || date < new Date("1900-01-01")
                                  }
                                  initialFocus
                                  className="rounded-lg border-0"
                                />
                              </PopoverContent>
                            </Popover>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={signupForm.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-medium text-gray-700 dark:text-gray-300">Password</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Input 
                                  type={showPassword ? "text" : "password"} 
                                  placeholder="********" 
                                  className="bg-gray-50/50 dark:bg-gray-800/50 border-0 shadow-sm focus:ring-2 focus:ring-purple-500/20 pr-10" 
                                  {...field} 
                                />
                                <button 
                                  type="button"
                                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                                  onClick={togglePasswordVisibility}
                                >
                                  {showPassword ? 
                                    <EyeOffIcon className="h-4 w-4" /> : 
                                    <EyeIcon className="h-4 w-4" />
                                  }
                                </button>
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={signupForm.control}
                        name="confirmPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-medium text-gray-700 dark:text-gray-300">Confirm Password</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Input 
                                  type={showConfirmPassword ? "text" : "password"} 
                                  placeholder="********" 
                                  className="bg-gray-50/50 dark:bg-gray-800/50 border-0 shadow-sm focus:ring-2 focus:ring-purple-500/20 pr-10" 
                                  {...field} 
                                />
                                <button 
                                  type="button"
                                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                                  onClick={toggleConfirmPasswordVisibility}
                                >
                                  {showConfirmPassword ? 
                                    <EyeOffIcon className="h-4 w-4" /> : 
                                    <EyeIcon className="h-4 w-4" />
                                  }
                                </button>
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button 
                        type="submit" 
                        className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 shadow-md hover:shadow-lg transition-all duration-200" 
                        disabled={signupForm.formState.isSubmitting}
                      >
                        {signupForm.formState.isSubmitting ? 'Creating account...' : 'Sign Up'}
                      </Button>
                    </form>
                  </Form>
                )}
              </CardContent>
              <CardFooter className="flex flex-col space-y-2 bg-gradient-to-b from-transparent to-gray-50/50 dark:to-gray-900/30 pt-4">
                <Button 
                  variant="link" 
                  onClick={toggleAuthMode} 
                  className="w-full text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300"
                >
                  {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
                </Button>
              </CardFooter>
            </Card>
          </FadeIn>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Auth;
