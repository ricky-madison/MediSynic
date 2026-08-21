
import React from 'react';
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import FadeIn from "@/components/FadeIn";
import QuickStatCards from "@/components/dashboard/QuickStatCards";
import AlertCard from "@/components/dashboard/AlertCard";
import AdvancedDataVisualization from "@/components/dashboard/AdvancedDataVisualization";
import PersonalizedTreatmentPlan from "@/components/treatment/PersonalizedTreatmentPlan";
import DeviceIntegration from "@/components/integration/DeviceIntegration";
import ProviderPortal from "@/components/healthcare/ProviderPortal";
import CommunityHub from "@/components/community/CommunityHub";

const EnhancedDashboard = () => {
  const { user } = useAuth();
  const userId = user?.id;
  const firstName = user?.email?.split('@')[0] || 'User';
  
  return (
    <div className="min-h-[calc(100vh-4rem)] pb-8">
      <FadeIn>
        {/* Welcome header */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/40 dark:to-purple-950/40 py-6 px-4 md:px-6">
          <div className="container max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
                  Hello, {firstName}
                </h1>
                <p className="text-muted-foreground mt-1">
                  Your comprehensive health dashboard powered by AI
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Button variant="outline" size="sm">
                  Share Dashboard
                </Button>
                <Button size="sm">
                  Schedule Check-in
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="container max-w-7xl mx-auto px-4 md:px-6 pt-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left column - Main content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Quick stats */}
              <section aria-labelledby="stats">
                <QuickStatCards />
              </section>

              {/* Advanced Data Visualization */}
              <section aria-labelledby="advanced-visualization">
                <AdvancedDataVisualization userId={userId} />
              </section>
              
              {/* Personalized Treatment Plan */}
              <section aria-labelledby="treatment-plan">
                <PersonalizedTreatmentPlan userId={userId} />
              </section>
              
              {/* Healthcare Provider Portal */}
              <section aria-labelledby="provider-portal">
                <ProviderPortal userId={userId} />
              </section>
            </div>
            
            {/* Right column - Sidebar content */}
            <div className="space-y-6">
              {/* Important alert */}
              <AlertCard 
                title="Predictive Glucose Alert"
                message="Based on your patterns, you may experience low glucose tonight between 2-3 AM"
                level="warning"
                onViewDetails={() => {}}
                actionLabel="View Details"
              />
              
              {/* Device Integration */}
              <DeviceIntegration userId={userId} />
              
              {/* Community Hub */}
              <CommunityHub userId={userId} />
            </div>
          </div>
        </div>
      </FadeIn>
    </div>
  );
};

export default EnhancedDashboard;
