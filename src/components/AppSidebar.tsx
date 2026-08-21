
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from '@/components/ui/sidebar';
import { useUserData } from '@/context/UserDataContext';
import { useAuth } from '@/context/AuthContext';
import SubscriptionBadge from './SubscriptionBadge';
import {
  LayoutDashboard,
  FileText,
  Heart,
  Pill,
  Stethoscope,
  Home,
  User,
  Activity,
  Brain,
  LogOut,
  Users,
  BarChart2,
  Lock,
  Shield,
  AlertCircle,
  LogIn,
  Crown,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const AppSidebar = () => {
  const { userData, resetData } = useUserData();
  const { user, isAuthenticated, signOut, isPro } = useAuth();
  const location = useLocation();
  const hasUserData = Object.keys(userData).length > 0 && userData.name;
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";
  
  // Navigation items
  const baseNavItems = [
    { icon: Home, label: 'Home', to: '/dashboard/home' },
    { icon: FileText, label: 'Assessment', to: '/form' },
  ];

  const userNavItems = [
    { icon: Heart, label: 'Recommendations', to: '/recommendations' },
    { icon: Pill, label: 'Medications', to: '/ai-pharmacist' }, // Renamed from "AI Pharmacist" to "Medications" but keeping the same route
    { icon: Brain, label: 'Symptom Checker', to: '/symptom-checker', requiresPro: true },
    { icon: BarChart2, label: 'Health Data', to: '/health-data' },
    { icon: Users, label: 'Caregiver', to: '/caregiver', requiresPro: true },
  ];
  
  const securityItems = [
    { icon: Shield, label: 'Privacy Policy', to: '/privacy-policy' },
    { icon: AlertCircle, label: 'Security Report', to: '/security-report' },
    { icon: Lock, label: 'Manage Your Data', to: '/user-data' },
  ];

  // Handle logout
  const handleLogout = async () => {
    await signOut();
    resetData();
  };
  
  return (
    <Sidebar className="pt-0 h-screen" collapsible="icon">
      <SidebarHeader className="pt-0">
        <div className="flex items-center justify-between p-4 border-b border-border/40 h-16 relative">
          <Link to="/" className="flex-shrink-0 text-xl font-bold text-medical-gray-900 mx-auto md:mx-0">
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">Medi</span>
            <span className="text-medical-gray-900 dark:text-white">Synic</span>
          </Link>
          
          <SidebarTrigger className="absolute right-[-12px] top-1/2 -translate-y-1/2 z-30 bg-background border border-border/40 rounded-full">
            {isCollapsed ? 
              <ChevronRight className="h-4 w-4" /> : 
              <ChevronLeft className="h-4 w-4" />
            }
          </SidebarTrigger>
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {baseNavItems.map((item) => (
                <SidebarMenuItem key={item.label}>
                  <SidebarMenuButton
                    asChild
                    isActive={location.pathname === item.to}
                    tooltip={item.label}
                  >
                    <Link to={item.to} className="flex justify-center md:justify-start">
                      <item.icon size={18} />
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
              {!isAuthenticated && (
                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    isActive={location.pathname === '/auth'}
                    tooltip="Sign In/Up"
                  >
                    <Link to="/auth" className="flex justify-center md:justify-start">
                      <LogIn size={18} />
                      <span>Sign In/Up</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        
        {/* Health Management Section */}
        {(hasUserData || isAuthenticated) && (
          <SidebarGroup>
            <SidebarGroupLabel>Health Management</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {userNavItems.map((item) => {
                  const isPremiumFeature = item.requiresPro && !isPro;
                  
                  return (
                    <SidebarMenuItem key={item.label}>
                      <SidebarMenuButton 
                        asChild 
                        isActive={
                          location.pathname === item.to ||
                          (item.to.includes('?tab=') && location.search.includes(item.to.split('?tab=')[1]))
                        }
                        tooltip={isPremiumFeature ? "Pro Feature" : item.label}
                        disabled={isPremiumFeature}
                      >
                        <Link to={isPremiumFeature ? "/subscribe" : item.to} className="flex justify-center md:justify-start relative">
                          <item.icon size={18} />
                          <span>{item.label}</span>
                          {isPremiumFeature && (
                            <Crown size={12} className="absolute top-0 right-0 text-amber-500" />
                          )}
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
                
                {isAuthenticated && (
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      asChild
                      isActive={location.pathname === '/subscribe'}
                      tooltip="Subscription"
                    >
                      <Link to="/subscribe" className="flex justify-center md:justify-start">
                        <Crown size={18} />
                        <span>Subscription</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
        
        <SidebarGroup>
          <SidebarGroupLabel>Security & Privacy</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {securityItems.map((item) => (
                <SidebarMenuItem key={item.label}>
                  <SidebarMenuButton
                    asChild
                    isActive={location.pathname === item.to}
                    tooltip={item.label}
                  >
                    <Link to={item.to} className="flex justify-center md:justify-start">
                      <item.icon size={18} />
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter className="border-t border-border/40">
        {isAuthenticated ? (
          <div className={`p-3 ${isCollapsed ? 'text-center' : ''}`}>
            <div className={`${isCollapsed ? 'justify-center' : 'justify-between'} flex items-center mb-2`}>
              <div className={`flex ${isCollapsed ? 'flex-col' : 'items-center space-x-2'}`}>
                <div className="w-8 h-8 rounded-full bg-medical-blue-light flex items-center justify-center text-white mb-1">
                  {user?.email?.charAt(0).toUpperCase() || 'U'}
                </div>
                {!isCollapsed && (
                  <div className="flex flex-col">
                    <span className="font-medium text-sm text-medical-gray-900 dark:text-white truncate max-w-[120px]">
                      {user?.email}
                    </span>
                    <SubscriptionBadge className="mt-1 py-0.5 px-1.5" />
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex justify-center">
              {isCollapsed ? (
                <Button 
                  variant="outline"
                  size="icon"
                  className="w-8 h-8 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
                  onClick={handleLogout}
                >
                  <LogOut size={14} />
                </Button>
              ) : (
                <Button 
                  variant="outline"
                  className="w-full justify-start text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
                  onClick={handleLogout}
                >
                  <LogOut size={16} className="mr-2" />
                  Sign Out
                </Button>
              )}
            </div>
          </div>
        ) : (
          <div className="p-3 flex justify-center">
            <Button 
              className={`${isCollapsed ? 'w-8 h-8 p-0' : 'w-full'}`}
              onClick={() => window.location.href = '/auth'}
            >
              {isCollapsed ? <LogIn size={14} /> : 'Sign In'}
            </Button>
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
