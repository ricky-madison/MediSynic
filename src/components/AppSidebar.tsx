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
import { useAuth } from '@/context/AuthContext';
import { useOncology } from '@/context/OncologyContext';
import SubscriptionBadge from './SubscriptionBadge';
import {
  Activity,
  AlertCircle,
  Beaker,
  Brain,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  Dna,
  LayoutDashboard,
  Lock,
  LogIn,
  LogOut,
  Pill,
  Shield,
  Sparkles,
  Users,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface NavItem {
  icon: React.ElementType;
  label: string;
  to: string;
  requiresPro?: boolean;
}

const AppSidebar = () => {
  const { user, isAuthenticated, signOut, isPro } = useAuth();
  const { patient } = useOncology();
  const location = useLocation();
  const { state } = useSidebar();
  const isCollapsed = state === 'collapsed';

  const overview: NavItem[] = [
    { icon: LayoutDashboard, label: 'Overview', to: '/dashboard/home' },
    { icon: ClipboardList, label: 'Oncology intake', to: '/form' },
    { icon: Sparkles, label: 'Care actions', to: '/recommendations' },
  ];

  const surveillance: NavItem[] = [
    { icon: Activity, label: 'Metabolic monitor', to: '/metabolic' },
    { icon: AlertCircle, label: 'Toxicity (CTCAE)', to: '/toxicity' },
    { icon: Pill, label: 'Medication safety', to: '/medications' },
    { icon: Beaker, label: 'Tumour markers', to: '/markers' },
  ];

  const precision: NavItem[] = [
    { icon: Dna, label: 'Oncyra import', to: '/oncyra' },
    { icon: Brain, label: 'CRS & ICANS', to: '/cell-therapy' },
    { icon: Users, label: 'Care circle', to: '/caregiver', requiresPro: true },
  ];

  const governance: NavItem[] = [
    { icon: Shield, label: 'Privacy policy', to: '/privacy-policy' },
    { icon: AlertCircle, label: 'Security report', to: '/security-report' },
    { icon: Lock, label: 'Manage your data', to: '/user-data' },
  ];

  const renderGroup = (label: string, items: NavItem[]) => (
    <SidebarGroup key={label}>
      <SidebarGroupLabel>{label}</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => {
            const locked = item.requiresPro && !isPro;
            return (
              <SidebarMenuItem key={item.to}>
                <SidebarMenuButton asChild isActive={location.pathname === item.to} tooltip={item.label}>
                  <Link to={locked ? '/subscribe' : item.to} className="flex justify-center md:justify-start">
                    <item.icon size={18} />
                    <span>{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );

  return (
    <Sidebar className="pt-0 h-screen" collapsible="icon">
      <SidebarHeader className="pt-0">
        <div className="relative flex h-16 items-center justify-between border-b border-border p-4">
          <Link to="/" className="mx-auto flex-shrink-0 text-xl font-semibold tracking-tight md:mx-0">
            <span className="text-primary">Medi</span>
            <span className="text-sidebar-foreground">Synic</span>
          </Link>
          <SidebarTrigger className="absolute right-[-12px] top-1/2 z-30 -translate-y-1/2 rounded-full border border-border bg-background">
            {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </SidebarTrigger>
        </div>
        {!isCollapsed && patient.indication && (
          <p className="px-4 pb-2 pt-3 text-xs text-muted-foreground">
            {patient.indication}
            {patient.stage ? ` · Stage ${patient.stage}` : ''}
          </p>
        )}
      </SidebarHeader>

      <SidebarContent>
        {renderGroup('Overview', overview)}
        {renderGroup('Surveillance', surveillance)}
        {renderGroup('Precision oncology', precision)}
        {renderGroup('Governance', governance)}
      </SidebarContent>

      <SidebarFooter className="border-t border-border">
        {isAuthenticated ? (
          <div className={`p-3 ${isCollapsed ? 'text-center' : ''}`}>
            <div className={`mb-2 flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
              <div className={`flex ${isCollapsed ? 'flex-col' : 'items-center space-x-2'}`}>
                <div className="mb-1 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  {user?.email?.charAt(0).toUpperCase() || 'U'}
                </div>
                {!isCollapsed && (
                  <div className="flex flex-col">
                    <span className="max-w-[120px] truncate text-sm font-medium">{user?.email}</span>
                    <SubscriptionBadge className="mt-1 px-1.5 py-0.5" />
                  </div>
                )}
              </div>
            </div>
            <Button
              variant="outline"
              size={isCollapsed ? 'icon' : 'default'}
              className={isCollapsed ? 'h-8 w-8' : 'w-full justify-start'}
              onClick={() => signOut()}
            >
              <LogOut size={16} className={isCollapsed ? '' : 'mr-2'} />
              {!isCollapsed && 'Sign out'}
            </Button>
          </div>
        ) : (
          <div className="flex justify-center p-3">
            <Button className={isCollapsed ? 'h-8 w-8 p-0' : 'w-full'} asChild>
              <Link to="/auth">{isCollapsed ? <LogIn size={14} /> : 'Sign in'}</Link>
            </Button>
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
