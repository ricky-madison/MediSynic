
import React from 'react';
import { useNavigate } from 'react-router-dom';
import FadeIn from './FadeIn';
import { ArrowRight, Activity, Clipboard, Heart, Shield, Droplets, Apple } from 'lucide-react';
import { Button } from '@/components/ui/button';

const HeroSection: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section className="min-h-[90vh] flex items-center pt-16 bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900">
      <div className="container-tight max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div>
            <FadeIn delay={100}>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 text-sm font-medium mb-6">
                <Shield size={16} className="text-blue-600 dark:text-blue-400" /> 
                HIPAA & GDPR Compliant
              </div>
            </FadeIn>
            
            <FadeIn delay={200}>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6 text-gray-900 dark:text-white bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
                Your Diabetes Management Companion
              </h1>
            </FadeIn>
            
            <FadeIn delay={300}>
              <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 mb-8 leading-relaxed">
                MediSynic delivers personalized diabetes insights with medical-grade precision. 
                Our advanced AI analyzes your unique profile to provide tailored guidance for optimal glucose management.
              </p>
            </FadeIn>
            
            <FadeIn delay={400}>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  onClick={() => navigate('/form')}
                  size="lg"
                  className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 text-white font-medium"
                >
                  Start Your Diabetes Journey
                  <ArrowRight size={18} className="ml-2" />
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => navigate('/about')}
                  className="border-blue-200 dark:border-blue-800 text-gray-800 dark:text-gray-200"
                >
                  Learn More
                </Button>
              </div>
            </FadeIn>
            
            <FadeIn delay={500}>
              <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-6">
                <div className="flex flex-col items-center text-center p-4 rounded-xl bg-white/80 dark:bg-gray-800/50 shadow-sm backdrop-blur-sm border border-gray-100 dark:border-gray-700">
                  <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-3">
                    <Activity size={24} className="text-blue-600 dark:text-blue-400" />
                  </div>
                  <span className="font-medium text-gray-900 dark:text-white">Glucose Tracking</span>
                </div>
                <div className="flex flex-col items-center text-center p-4 rounded-xl bg-white/80 dark:bg-gray-800/50 shadow-sm backdrop-blur-sm border border-gray-100 dark:border-gray-700">
                  <div className="h-12 w-12 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mb-3">
                    <Clipboard size={24} className="text-purple-600 dark:text-purple-400" />
                  </div>
                  <span className="font-medium text-gray-900 dark:text-white">A1C Management</span>
                </div>
                <div className="flex flex-col items-center text-center p-4 rounded-xl bg-white/80 dark:bg-gray-800/50 shadow-sm backdrop-blur-sm border border-gray-100 dark:border-gray-700">
                  <div className="h-12 w-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-3">
                    <Apple size={24} className="text-green-600 dark:text-green-400" />
                  </div>
                  <span className="font-medium text-gray-900 dark:text-white">Diet Guidance</span>
                </div>
                <div className="flex flex-col items-center text-center p-4 rounded-xl bg-white/80 dark:bg-gray-800/50 shadow-sm backdrop-blur-sm border border-gray-100 dark:border-gray-700">
                  <div className="h-12 w-12 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center mb-3">
                    <Shield size={24} className="text-amber-600 dark:text-amber-400" />
                  </div>
                  <span className="font-medium text-gray-900 dark:text-white">Complication Prevention</span>
                </div>
              </div>
            </FadeIn>
          </div>
          
          {/* Right Content - Floating Medical UI - Now with square cards and better presentation */}
          <FadeIn 
            className="hidden lg:block relative" 
            delay={300}
          >
            <div className="relative h-[550px]">
              {/* Diabetes Score Card - Square style */}
              <div className="absolute top-10 right-10 w-64 h-64 z-20 animate-float" style={{ animationDelay: '0s' }}>
                <div className="glass-card h-full flex flex-col p-5">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="font-semibold text-xl text-gray-900 dark:text-white">Diabetes Score</h3>
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300">
                      Premium
                    </span>
                  </div>
                  
                  <div className="flex-grow flex flex-col items-center justify-center">
                    <div className="w-28 h-28 mx-auto rounded-full border-8 border-blue-100 dark:border-blue-900/50 flex items-center justify-center mb-3">
                      <div className="text-center">
                        <span className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">7.1%</span>
                        <span className="text-xs block text-gray-500 dark:text-gray-400 mt-1">Estimated A1C</span>
                      </div>
                    </div>
                    
                    <div className="mt-2 flex items-center justify-center">
                      <div className="flex items-center bg-green-50 dark:bg-green-900/30 px-2 py-1 rounded-full">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-1">
                          <path d="M18 15L12 9L6 15" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="dark:stroke-green-400"/>
                        </svg>
                        <span className="text-xs font-medium text-green-600 dark:text-green-400">-0.3%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Recommendations Card - Square style */}
              <div className="absolute top-24 left-20 w-64 h-64 animate-float" style={{ animationDelay: '1s' }}>
                <div className="glass-card h-full flex flex-col p-5">
                  <h3 className="font-semibold text-xl text-gray-900 dark:text-white mb-4">Recommendations</h3>
                  
                  <div className="flex-grow flex flex-col justify-center space-y-3">
                    <div className="flex items-center bg-white/70 dark:bg-gray-800/50 rounded-lg p-3 border border-gray-100 dark:border-gray-700 transition-all hover:shadow-md">
                      <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center mr-3 flex-shrink-0">
                        <Activity size={18} className="text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <div className="font-medium text-sm text-gray-900 dark:text-white">Walk after meals</div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">10 minutes</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center bg-white/70 dark:bg-gray-800/50 rounded-lg p-3 border border-gray-100 dark:border-gray-700 transition-all hover:shadow-md">
                      <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center mr-3 flex-shrink-0">
                        <Droplets size={18} className="text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <div className="font-medium text-sm text-gray-900 dark:text-white">Hydration</div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">Drink more water</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
