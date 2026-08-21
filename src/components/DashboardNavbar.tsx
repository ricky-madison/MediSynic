import React, { useState } from 'react';
import { Bell, Menu, Crown, User, ChevronDown, Settings } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { useSidebar } from '@/components/ui/sidebar';
import { useNavigate } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';

const DashboardNavbar: React.FC = () => {
  const { user, isPro, signOut } = useAuth();
  const { state, toggleSidebar } = useSidebar();
  const isCollapsed = state === "collapsed";
  const navigate = useNavigate();
  const [unreadNotifications] = useState(3); // This would come from a real notifications system
  
  // Get user initials from email
  const getInitials = () => {
    if (!user?.email) return 'U';
    return user.email.charAt(0).toUpperCase();
  };

  const handleNavigate = (path: string) => {
    navigate(path);
  };

  return (
    <div className="sticky top-0 z-30 w-full">
      <div className="flex h-16 items-center px-4 border-b border-gray-200/70 dark:border-gray-700/40 bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/70 dark:bg-gray-900/80">
        {/* Left side - Mobile menu toggle */}
        <div className="md:hidden">
          <Button variant="ghost" size="icon" onClick={toggleSidebar} className="text-gray-600 dark:text-gray-300">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle Menu</span>
          </Button>
        </div>

        {/* Empty div to maintain spacing where logo used to be */}
        <div className="ml-4 md:ml-0"></div>

        {/* Right side content */}
        <div className="ml-auto flex items-center space-x-4">
          {/* Subscription status for quick visibility */}
          {isPro ? (
            <Badge 
              variant="outline" 
              className="hidden md:flex bg-amber-50 text-amber-700 border-amber-200 gap-1 items-center dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-800"
            >
              <Crown className="h-3 w-3" />
              <span>Premium</span>
            </Badge>
          ) : (
            <Button 
              variant="outline" 
              size="sm" 
              className="hidden md:flex text-indigo-600 border-indigo-200 hover:bg-indigo-50 dark:text-indigo-400 dark:border-indigo-800 dark:hover:bg-indigo-900/30"
              onClick={() => navigate('/subscribe')}
            >
              Upgrade
            </Button>
          )}

          {/* Notifications dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="relative text-gray-600 hover:text-indigo-600 dark:text-gray-300 dark:hover:text-indigo-400"
              >
                <Bell className="h-5 w-5" />
                {unreadNotifications > 0 && (
                  <span className="absolute top-1 right-1 h-2.5 w-2.5 rounded-full bg-indigo-500 ring-2 ring-white dark:ring-gray-900"></span>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80 bg-white/95 backdrop-blur-sm dark:bg-gray-800/95">
              <DropdownMenuLabel className="font-medium text-indigo-700 dark:text-indigo-400">Notifications</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <div className="max-h-96 overflow-auto">
                <div className="p-3 bg-indigo-50/70 dark:bg-indigo-900/20 rounded-md mb-2">
                  <p className="font-medium text-sm">Medication Reminder</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">It's time for your vitamin D supplement</p>
                  <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">Just now</p>
                </div>
                <div className="p-3 rounded-md mb-2">
                  <p className="font-medium text-sm">New Recommendation</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Check your updated health recommendations</p>
                  <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">2 hours ago</p>
                </div>
                <div className="p-3 rounded-md">
                  <p className="font-medium text-sm">Health Summary</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Your weekly health report is ready</p>
                  <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">Yesterday</p>
                </div>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer justify-center text-center font-medium text-sm text-indigo-600 dark:text-indigo-400">
                View All Notifications
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Settings */}
          <Button 
            variant="ghost" 
            size="icon"
            className="text-gray-600 hover:text-indigo-600 dark:text-gray-300 dark:hover:text-indigo-400"
            onClick={() => navigate('/user-data')}
          >
            <Settings className="h-5 w-5" />
          </Button>

          {/* User menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="gap-2 text-gray-700 dark:text-gray-200">
                <Avatar className="h-7 w-7 border border-gray-200 dark:border-gray-700">
                  <AvatarFallback className="bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300">
                    {getInitials()}
                  </AvatarFallback>
                </Avatar>
                <span className="hidden md:inline-block text-sm font-normal">
                  {user?.email?.split('@')[0]}
                </span>
                <ChevronDown className="h-4 w-4 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-white/95 backdrop-blur-sm dark:bg-gray-800/95">
              <DropdownMenuLabel className="font-medium">My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer" onClick={() => handleNavigate('/user-data')}>
                <User className="mr-2 h-4 w-4" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer" onClick={() => handleNavigate('/subscribe')}>
                <Crown className="mr-2 h-4 w-4" />
                Subscription
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer text-red-500" onClick={() => signOut()}>
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
};

export default DashboardNavbar;
