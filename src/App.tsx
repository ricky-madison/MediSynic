
import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation, Navigate, Outlet } from "react-router-dom";
import { UserDataProvider } from "./context/UserDataContext";
import { SidebarProvider } from "./components/ui/sidebar";
import { AuthProvider, useAuth } from "./context/AuthContext";
import DataConsentBanner from "./components/DataConsentBanner";
import FloatingCTA from "./components/FloatingCTA";

// Create a new query client with optimized settings for scale
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 minute
      retry: 1,
      refetchOnWindowFocus: false,
    },
  }
});

// Lazy load pages for better performance and code splitting
const Index = lazy(() => import("./pages/Index"));
const Form = lazy(() => import("./pages/Form"));
const About = lazy(() => import("./pages/About"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const DashboardHome = lazy(() => import("./pages/DashboardHome"));
const EnhancedDashboard = lazy(() => import("./pages/EnhancedDashboard"));
const Recommendations = lazy(() => import("./pages/Recommendations"));
const AIPharmacist = lazy(() => import("./pages/AIPharmacist"));
const NotFound = lazy(() => import("./pages/NotFound"));
const CaregiverIntegration = lazy(() => import("./pages/CaregiverIntegration"));
const HealthDataLogging = lazy(() => import("./pages/HealthDataLogging"));
const AISymptomChecker = lazy(() => import("./pages/AISymptomChecker"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const SecurityReport = lazy(() => import("./pages/SecurityReport"));
const UserData = lazy(() => import("./pages/UserData"));
const Auth = lazy(() => import("./pages/Auth"));
const Subscribe = lazy(() => import("./pages/Subscribe"));

// App layout components
const AppSidebar = lazy(() => import("./components/AppSidebar"));
const DashboardNavbar = lazy(() => import("./components/DashboardNavbar"));

// Loading component
const LoadingScreen = () => (
  <div className="flex min-h-screen items-center justify-center">
    <div className="flex flex-col items-center gap-4">
      <div className="h-12 w-12 rounded-full border-4 border-primary/30 border-t-primary animate-spin"></div>
      <div className="text-lg font-medium">Loading MediSynic...</div>
    </div>
  </div>
);

// Protected route component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();
  
  if (loading) {
    return <LoadingScreen />;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/auth" replace state={{ from: location }} />;
  }
  
  return children;
};

// Dashboard Layout component that wraps authenticated pages
const DashboardLayout = () => {
  return (
    <div className="flex h-screen w-full overflow-hidden">
      <div className="md:block hidden">
        <Suspense fallback={<div className="w-64 h-screen bg-background animate-pulse" />}>
          <AppSidebar />
        </Suspense>
      </div>
      <div className="flex-1 flex flex-col w-full overflow-hidden">
        <Suspense fallback={<div className="h-16 w-full bg-background animate-pulse" />}>
          <DashboardNavbar />
        </Suspense>
        <main className="flex-1 overflow-auto">
          <Suspense fallback={<LoadingScreen />}>
            <Outlet />
          </Suspense>
        </main>
      </div>
    </div>
  );
};

// Wrapper component to conditionally render the FloatingCTA
const AppRoutes = () => {
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  
  // Define routes where the CTA should not appear
  const excludedRoutes = ['/form', '/dashboard', '/auth', '/subscribe', '/enhanced-dashboard'];
  const shouldShowCTA = !excludedRoutes.some(route => location.pathname.startsWith(route)) && !isAuthenticated;
  
  return (
    <div className="min-h-screen flex w-full flex-col">
      <Suspense fallback={<LoadingScreen />}>
        <Routes>
          {/* Standalone pages outside the dashboard */}
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/about" element={<About />} />
          
          {/* Dashboard layout with nested routes */}
          <Route path="/" element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/dashboard/home" element={<DashboardHome />} />
            <Route path="/enhanced-dashboard" element={<EnhancedDashboard />} />
            <Route path="/form" element={<Form />} />
            <Route path="/recommendations" element={<Recommendations />} />
            <Route path="/ai-pharmacist" element={<AIPharmacist />} />
            <Route path="/caregiver" element={<CaregiverIntegration />} />
            <Route path="/health-data" element={<HealthDataLogging />} />
            <Route path="/symptom-checker" element={<AISymptomChecker />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/security-report" element={<SecurityReport />} />
            <Route path="/user-data" element={<UserData />} />
            <Route path="/subscribe" element={<Subscribe />} />
          </Route>

          {/* Catch-all route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
      
      {shouldShowCTA && <FloatingCTA />}
      <DataConsentBanner />
    </div>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <UserDataProvider>
          <SidebarProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <AppRoutes />
            </BrowserRouter>
          </SidebarProvider>
        </UserDataProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
