import React from 'react';
import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import Footer from '@/components/Footer';
import FadeIn from '@/components/FadeIn';
import { useNavigate } from 'react-router-dom';
import { useUserData } from '@/context/UserDataContext';
import PricingTeaser from '@/components/PricingTeaser';
import { 
  Activity, 
  Users, 
  FileText, 
  Heart, 
  ChevronRight,
  Brain,
  Stethoscope,
  Pill,
  ArrowRight,
  Shield,
  Lock,
  CheckCircle,
  LogIn
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';

const Index = () => {
  const navigate = useNavigate();
  const { userData } = useUserData();
  const { isAuthenticated } = useAuth();
  const hasUserData = isAuthenticated && Object.keys(userData).length > 0 && userData.name;

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50 dark:from-gray-900 dark:to-gray-800 flex flex-col">
      <Header />
      
      <main className="flex-grow">
        {/* If user has data, show a welcome back banner */}
        {hasUserData && (
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/30 dark:to-purple-900/30 border-b border-blue-100 dark:border-blue-900/50 backdrop-blur-sm">
            <div className="container-tight py-4">
              <div className="flex flex-col sm:flex-row items-center justify-between">
                <div className="flex items-center mb-3 sm:mb-0">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center mr-4 text-white shadow-lg">
                    <span className="text-lg font-bold">{userData.name?.charAt(0)}</span>
                  </div>
                  <div>
                    <h2 className="text-xl font-medium text-gray-900 dark:text-white">Welcome back, {userData.name}!</h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Continue with your health journey</p>
                  </div>
                </div>
                <Button
                  onClick={() => navigate('/dashboard')}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-md"
                >
                  Go to Dashboard <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        )}
        
        <HeroSection />
        
        {/* Sign In CTA for non-authenticated users */}
        {!isAuthenticated && (
          <section className="py-10 bg-blue-50 dark:bg-blue-900/20">
            <div className="container-tight">
              <FadeIn delay={100} className="text-center mb-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 text-sm font-medium mb-4">
                  <LogIn size={16} className="text-blue-600 dark:text-blue-400" /> 
                  Account Required
                </div>
                <h2 className="text-2xl md:text-3xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
                  Sign In to Access All Features
                </h2>
                <p className="text-lg text-gray-700 dark:text-gray-300 max-w-3xl mx-auto">
                  Create an account or sign in to unlock all diabetes management features and personalized recommendations.
                </p>
                <Button 
                  onClick={() => navigate('/auth')}
                  size="lg"
                  className="mt-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-md"
                >
                  Sign In / Sign Up
                </Button>
              </FadeIn>
            </div>
          </section>
        )}
        
        {/* Pricing Teaser Section - Added right after hero section */}
        <section className="bg-white dark:bg-gray-900 py-16">
          <PricingTeaser />
        </section>
        
        {/* How It Works Section */}
        <section className="py-20 bg-white dark:bg-gray-900" id="how-it-works">
          <div className="container-tight">
            <FadeIn delay={100} className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 text-sm font-medium mb-4">
                <CheckCircle size={16} className="text-blue-600 dark:text-blue-400" /> 
                Simple Process
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
                How MediSynic Works
              </h2>
              <p className="text-lg text-gray-700 dark:text-gray-300 max-w-3xl mx-auto">
                Our intelligent system analyzes your personal data to generate tailored medical recommendations in just a few steps.
              </p>
            </FadeIn>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <FadeIn delay={200} className="relative">
                <div className="glass-card text-center p-8 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 h-full">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/40 dark:to-blue-800/40 flex items-center justify-center mx-auto mb-6 shadow-md">
                    <FileText size={32} className="text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">1. Submit Your Data</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    Fill out our comprehensive form with your personal and medical information. Your data is protected with enterprise-grade encryption.
                  </p>
                  <Button variant="link" onClick={() => navigate('/form')} className="text-blue-600 dark:text-blue-400 font-medium">
                    Start Assessment <ArrowRight className="ml-1 h-4 w-4" />
                  </Button>
                </div>
                <div className="hidden md:block absolute -right-4 top-1/2 transform -translate-y-1/2 z-10">
                  <ChevronRight size={24} className="text-gray-400 dark:text-gray-600" />
                </div>
              </FadeIn>
              
              <FadeIn delay={300} className="relative">
                <div className="glass-card text-center p-8 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 h-full">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-900/40 dark:to-purple-800/40 flex items-center justify-center mx-auto mb-6 shadow-md">
                    <Brain size={32} className="text-purple-600 dark:text-purple-400" />
                  </div>
                  <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">2. AI Analysis</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    Our system analyzes your data using advanced algorithms and clinical knowledge, identifying patterns that matter for your health.
                  </p>
                  <Button variant="link" onClick={() => navigate('/recommendations')} className="text-purple-600 dark:text-purple-400 font-medium">
                    See How It Works <ArrowRight className="ml-1 h-4 w-4" />
                  </Button>
                </div>
                <div className="hidden md:block absolute -right-4 top-1/2 transform -translate-y-1/2 z-10">
                  <ChevronRight size={24} className="text-gray-400 dark:text-gray-600" />
                </div>
              </FadeIn>
              
              <FadeIn delay={400}>
                <div className="glass-card text-center p-8 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 h-full">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900/40 dark:to-green-800/40 flex items-center justify-center mx-auto mb-6 shadow-md">
                    <Heart size={32} className="text-green-600 dark:text-green-400" />
                  </div>
                  <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">3. Get Recommendations</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    Receive personalized health recommendations based on your unique profile, with actionable insights for better health outcomes.
                  </p>
                  <Button variant="link" onClick={() => navigate('/dashboard')} className="text-green-600 dark:text-green-400 font-medium">
                    View Dashboard <ArrowRight className="ml-1 h-4 w-4" />
                  </Button>
                </div>
              </FadeIn>
            </div>
            
            <FadeIn delay={500} className="text-center mt-16">
              <Button 
                onClick={() => navigate('/form')}
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-md px-8 py-6 text-lg"
              >
                Start Your Health Journey
              </Button>
            </FadeIn>
          </div>
        </section>
        
        {/* Features Section */}
        <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-900/30">
          <div className="container-tight">
            <FadeIn delay={100} className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 text-sm font-medium mb-4">
                <CheckCircle size={16} className="text-green-600 dark:text-green-400" /> 
                Comprehensive Analysis
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-green-600 dark:from-blue-400 dark:to-green-400">
                Key Features
              </h2>
              <p className="text-lg text-gray-700 dark:text-gray-300 max-w-3xl mx-auto">
                Our platform offers comprehensive health analysis through multiple factors to provide you with a complete picture of your health.
              </p>
            </FadeIn>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <FadeIn delay={200}>
                <div className="glass-card hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                  <div className="flex items-start">
                    <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/40 dark:to-blue-800/40 flex items-center justify-center mr-6 flex-shrink-0 shadow-md">
                      <Activity size={28} className="text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Health Metrics Analysis</h3>
                      <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                        Comprehensive analysis of your weight, height, BMI, and other vital health metrics to identify potential health risks and opportunities for improvement.
                      </p>
                      <Button 
                        variant="link" 
                        className="p-0 h-auto mt-4 text-blue-600 dark:text-blue-400 font-medium"
                        onClick={() => navigate('/dashboard?tab=metrics')}
                      >
                        Track your metrics <ArrowRight className="ml-1 h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </FadeIn>
              
              <FadeIn delay={300}>
                <div className="glass-card hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                  <div className="flex items-start">
                    <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-900/40 dark:to-purple-800/40 flex items-center justify-center mr-6 flex-shrink-0 shadow-md">
                      <Users size={28} className="text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Lifestyle Evaluation</h3>
                      <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                        Assessment of your work habits, sleep patterns, and stress levels to provide holistic health recommendations tailored to your unique lifestyle.
                      </p>
                      <Button 
                        variant="link" 
                        className="p-0 h-auto mt-4 text-purple-600 dark:text-purple-400 font-medium"
                        onClick={() => navigate('/recommendations')}
                      >
                        Get lifestyle insights <ArrowRight className="ml-1 h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </FadeIn>
              
              <FadeIn delay={400}>
                <div className="glass-card hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                  <div className="flex items-start">
                    <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-amber-100 to-amber-200 dark:from-amber-900/40 dark:to-amber-800/40 flex items-center justify-center mr-6 flex-shrink-0 shadow-md">
                      <Pill size={28} className="text-amber-600 dark:text-amber-400" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Medication Interaction</h3>
                      <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                        Review of your current medications to identify potential interactions and optimize your treatment plan for better efficacy and reduced side effects.
                      </p>
                      <Button 
                        variant="link" 
                        className="p-0 h-auto mt-4 text-amber-600 dark:text-amber-400 font-medium"
                        onClick={() => navigate('/dashboard?tab=medications')}
                      >
                        Manage medications <ArrowRight className="ml-1 h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </FadeIn>
              
              <FadeIn delay={500}>
                <div className="glass-card hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                  <div className="flex items-start">
                    <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900/40 dark:to-green-800/40 flex items-center justify-center mr-6 flex-shrink-0 shadow-md">
                      <Stethoscope size={28} className="text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">AI Pharmacist</h3>
                      <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                        Get personalized answers to your medication and health questions from our AI-powered pharmacist, backed by the latest medical research.
                      </p>
                      <Button 
                        variant="link" 
                        className="p-0 h-auto mt-4 text-green-600 dark:text-green-400 font-medium"
                        onClick={() => navigate('/ai-pharmacist')}
                      >
                        Ask AI Pharmacist <ArrowRight className="ml-1 h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </FadeIn>
            </div>
          </div>
        </section>
        
        {/* Security Section */}
        <section className="py-16 bg-white dark:bg-gray-900">
          <div className="container-tight">
            <FadeIn delay={100} className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 text-sm font-medium mb-4">
                <Lock size={16} className="text-blue-600 dark:text-blue-400" /> 
                HIPAA & GDPR Compliant
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
                Your Data Privacy & Security
              </h2>
              <p className="text-lg text-gray-700 dark:text-gray-300 max-w-3xl mx-auto">
                We take your privacy seriously with enterprise-grade security measures and full compliance with healthcare regulations.
              </p>
            </FadeIn>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <FadeIn delay={200}>
                <div className="glass-card text-center p-6 hover:shadow-lg transition-all duration-300">
                  <div className="w-16 h-16 mx-auto rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-4">
                    <Lock size={28} className="text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">End-to-End Encryption</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Your health data is encrypted both in transit and at rest using industry-leading security protocols.
                  </p>
                </div>
              </FadeIn>
              
              <FadeIn delay={300}>
                <div className="glass-card text-center p-6 hover:shadow-lg transition-all duration-300">
                  <div className="w-16 h-16 mx-auto rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mb-4">
                    <Shield size={28} className="text-purple-600 dark:text-purple-400" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">Regulatory Compliance</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Our platform is fully HIPAA and GDPR compliant, adhering to the highest standards of data protection.
                  </p>
                </div>
              </FadeIn>
              
              <FadeIn delay={400}>
                <div className="glass-card text-center p-6 hover:shadow-lg transition-all duration-300">
                  <div className="w-16 h-16 mx-auto rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-4">
                    <Users size={28} className="text-green-600 dark:text-green-400" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">User Consent Control</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    You maintain full control over your data with granular consent options and the ability to delete your information anytime.
                  </p>
                </div>
              </FadeIn>
            </div>
            
            <FadeIn delay={500} className="text-center mt-10">
              <Button 
                variant="outline"
                onClick={() => navigate('/privacy-policy')}
                className="border-blue-200 dark:border-blue-800 text-gray-700 dark:text-gray-300"
              >
                Learn More About Our Privacy Policy
              </Button>
            </FadeIn>
          </div>
        </section>
        
        {/* CTA Section - Updated to show login CTA for non-authenticated users */}
        <section className="py-20 bg-gradient-to-br from-blue-500 to-purple-600 dark:from-blue-800 dark:to-purple-900 text-white">
          <div className="container-tight">
            <FadeIn delay={100} className="text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
                Ready to Transform Your Health Journey?
              </h2>
              <p className="text-lg text-blue-100 max-w-3xl mx-auto mb-10">
                Take the first step towards a healthier lifestyle with personalized recommendations tailored just for your unique needs.
              </p>
              {!isAuthenticated ? (
                <Button 
                  onClick={() => navigate('/auth')}
                  size="lg"
                  className="bg-white text-blue-600 hover:bg-blue-50 shadow-lg px-8 py-6 text-lg font-medium"
                >
                  Sign In / Sign Up
                </Button>
              ) : (
                <Button 
                  onClick={() => navigate('/form')}
                  size="lg"
                  className="bg-white text-blue-600 hover:bg-blue-50 shadow-lg px-8 py-6 text-lg font-medium"
                >
                  Get Started Now
                </Button>
              )}
              
              {hasUserData && (
                <div className="mt-6">
                  <Button 
                    variant="outline"
                    onClick={() => navigate('/dashboard')}
                    className="text-white border-white/30 hover:bg-white/10"
                  >
                    Continue to your dashboard <ArrowRight className="ml-1 h-4 w-4" />
                  </Button>
                </div>
              )}
            </FadeIn>
          </div>
        </section>
      </main>
      
      {/* Footer - Using the Footer component instead of inline footer */}
      <Footer />
    </div>
  );
};

export default Index;
