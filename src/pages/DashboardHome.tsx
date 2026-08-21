
import React from 'react';
import { useAuth } from "@/context/AuthContext";
import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import QuickActions from "@/components/QuickActions";
import FadeIn from "@/components/FadeIn";
import QuickStatCards from "@/components/dashboard/QuickStatCards";
import GlucoseChart from "@/components/dashboard/GlucoseChart";
import HealthMetricsPanel from "@/components/dashboard/HealthMetricsPanel";
import WeeklyGoalsPanel from "@/components/dashboard/WeeklyGoalsPanel";
import NotificationsPanel from "@/components/dashboard/NotificationsPanel";
import AlertCard from "@/components/dashboard/AlertCard";
import StepByStep from "@/components/StepByStep";
import { useOptimizedQuery } from "@/hooks/useOptimizedQuery";

// Sample data for charts
const healthData = [
  { name: 'Mon', value: 65 },
  { name: 'Tue', value: 59 },
  { name: 'Wed', value: 80 },
  { name: 'Thu', value: 81 },
  { name: 'Fri', value: 56 },
  { name: 'Sat', value: 55 },
  { name: 'Sun', value: 78 },
];

const notifications = [
  { id: 1, title: "New recommendation available", time: "Just now", read: false },
  { id: 2, title: "Weekly health report ready", time: "2 hours ago", read: false },
  { id: 3, title: "Medication reminder", time: "Yesterday", read: true },
  { id: 4, title: "Your vitamin D levels need attention", time: "3 days ago", read: true },
];

const DashboardHome = () => {
  const { user } = useAuth();
  const firstName = user?.email?.split('@')[0] || 'User';
  
  // Optimized data fetching example (simulated)
  const { isLoading: loadingUserHealthData } = useOptimizedQuery(
    ['user', 'health-data'],
    async () => {
      // This would be a real API call in production
      await new Promise(resolve => setTimeout(resolve, 100));
      return { status: 'success' };
    }
  );
  
  return (
    <div className="min-h-[calc(100vh-4rem)] pb-8">
      <FadeIn>
        {/* Welcome header */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/40 dark:to-purple-950/40 py-6 px-4 md:px-6">
          <div className="container max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
                  Welcome back, {firstName}
                </h1>
                <p className="text-muted-foreground mt-1">
                  Here's an overview of your health dashboard
                </p>
              </div>
              <div className="flex items-center gap-2 text-sm font-medium">
                <span className="text-muted-foreground">Last updated:</span>
                <span className="text-blue-600 dark:text-blue-400">Today</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="container max-w-7xl mx-auto px-4 md:px-6 pt-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left column - Main content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Quick action buttons */}
              <section aria-labelledby="quick-actions">
                <h2 id="quick-actions" className="sr-only">Quick Actions</h2>
                <QuickActions />
              </section>
              
              {/* Quick stats */}
              <section aria-labelledby="stats" className="space-y-4">
                <div className="flex justify-between items-center">
                  <h2 id="stats" className="text-lg font-semibold">Health Stats</h2>
                  <Button variant="ghost" size="sm" className="text-blue-600 dark:text-blue-400" asChild>
                    <a href="/health-data">
                      View All <ChevronRight className="ml-1 h-4 w-4" />
                    </a>
                  </Button>
                </div>
                <QuickStatCards />
              </section>

              {/* Health trends chart */}
              <GlucoseChart data={healthData} />
              
              {/* Health metrics and goals in grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <HealthMetricsPanel />
                <WeeklyGoalsPanel />
              </div>
            </div>
            
            {/* Right column - Sidebar content */}
            <div className="space-y-6">
              {/* Next steps guide */}
              <StepByStep />
              
              {/* Notifications */}
              <NotificationsPanel notifications={notifications} />

              {/* Important alert */}
              <AlertCard 
                title="Your doctor appointment is coming up"
                message="Don't forget about your appointment with Dr. Smith"
                date="June 12th"
                time="2:30 PM"
              />
            </div>
          </div>
        </div>
      </FadeIn>
    </div>
  );
};

export default DashboardHome;
