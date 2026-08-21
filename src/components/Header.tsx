import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  Menu,
  X,
  ChevronDown,
  User,
  Home,
  FileText,
  Heart,
  Pill,
  HelpCircle,
  ExternalLink,
  LogIn
} from 'lucide-react';
import { useUserData } from '@/context/UserDataContext';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';

const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { userData, resetData } = useUserData();
  const { isAuthenticated, signOut, user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  
  // Only show header on non-dashboard pages
  const isDashboardPage = location.pathname.includes('/dashboard') || 
                          location.pathname.includes('/form') ||
                          location.pathname.includes('/recommendations') ||
                          location.pathname.includes('/ai-pharmacist') ||
                          location.pathname.includes('/caregiver') ||
                          location.pathname.includes('/health-data') ||
                          location.pathname.includes('/symptom-checker') ||
                          location.pathname.includes('/user-data');
                          
  if (isDashboardPage && isAuthenticated) return null;

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
    setIsUserMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = async () => {
    await signOut();
    resetData();
    navigate('/');
  };

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 transition-all backdrop-blur-sm',
        isScrolled
          ? 'py-2 bg-white/90 dark:bg-gray-900/90 shadow-sm'
          : 'py-4 bg-transparent'
      )}
    >
      <div className="container-tight mx-auto flex items-center">
        {/* Logo with gradient */}
        <Link to="/" className="flex-shrink-0 text-2xl font-bold text-medical-gray-900">
          <span className="bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">Medi</span>
          <span className="text-medical-gray-900 dark:text-white">Synic</span>
        </Link>

        {/* Centered nav (desktop) */}
        <nav className="hidden md:flex flex-1 justify-center space-x-6">
          <NavLink to="/" exact icon={<Home size={18} />}>Home</NavLink>
          <NavLink to="/about" icon={<HelpCircle size={18} />}>About</NavLink>
          {isAuthenticated && (
            <>
              <NavLink to="/form" icon={<FileText size={18} />}>Assessment</NavLink>
              <NavLink to="/dashboard" icon={<User size={18} />}>Dashboard</NavLink>
              <NavLink to="/recommendations" icon={<Heart size={18} />}>Recs</NavLink>
              <NavLink to="/ai-pharmacist" icon={<Pill size={18} />}>Medications</NavLink>
            </>
          )}
        </nav>

        {/* Actions (desktop) */}
        <div className="hidden md:flex items-center space-x-4">
          {isAuthenticated ? (
            <div className="relative">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center space-x-2 rounded-full bg-medical-gray-100 px-4 py-2 hover:bg-medical-gray-200 transition"
              >
                <div className="w-8 h-8 rounded-full bg-medical-blue-light flex items-center justify-center text-white">
                  {user?.email?.charAt(0).toUpperCase() || 'U'}
                </div>
                <span className="font-medium text-medical-gray-800">{user?.email}</span>
                <ChevronDown size={16} />
              </button>
              {isUserMenuOpen && (
                <UserMenu onLogout={handleLogout} />
              )}
            </div>
          ) : (
            <Button onClick={() => navigate('/auth')} className="flex items-center">
              <LogIn size={18} className="mr-2" />
              Sign In
            </Button>
          )}
        </div>

        {/* Mobile menu toggle */}
        <button
          className="md:hidden ml-auto text-medical-gray-800 dark:text-gray-200"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <MobileMenu 
          isAuthenticated={isAuthenticated} 
          onLogout={handleLogout} 
          email={user?.email || ''} 
        />
      )}
    </header>
  );
};

export default Header;

/* NavLink for desktop */
interface NavLinkProps {
  to: string;
  exact?: boolean;
  icon?: React.ReactNode;
  children: React.ReactNode;
}

const NavLink: React.FC<NavLinkProps> = ({ to, exact, icon, children }) => {
  const location = useLocation();
  const isActive = exact
    ? location.pathname === to
    : location.pathname.startsWith(to) ||
      (to.includes('?tab=') && location.search.includes(`tab=${to.split('?tab=')[1]}`));

  return (
    <Link
      to={to}
      className={cn(
        'flex items-center space-x-1 relative py-1 font-medium transition',
        isActive
          ? 'text-medical-blue dark:text-blue-400'
          : 'text-medical-gray-700 dark:text-gray-300 hover:text-medical-blue dark:hover:text-blue-400'
      )}
    >
      {icon && <span>{icon}</span>}
      <span>{children}</span>
      <span
        className={cn(
          'absolute bottom-0 left-0 w-full h-0.5 bg-medical-blue dark:bg-blue-400 transition-transform',
          isActive ? 'scale-x-100' : 'scale-x-0'
        )}
      />
    </Link>
  );
};

/* NavLink for mobile */
const MobileNavLink: React.FC<NavLinkProps> = ({ to, exact, icon, children }) => {
  const location = useLocation();
  const isActive = exact
    ? location.pathname === to
    : location.pathname.startsWith(to) ||
      (to.includes('?tab=') && location.search.includes(`tab=${to.split('?tab=')[1]}`));

  return (
    <Link
      to={to}
      className={cn(
        'flex items-center space-x-2 text-xl py-2 transition',
        isActive
          ? 'text-medical-blue dark:text-blue-400'
          : 'text-medical-gray-800 dark:text-gray-200 hover:text-medical-blue dark:hover:text-blue-400'
      )}
    >
      {icon && <span>{icon}</span>}
      <span>{children}</span>
    </Link>
  );
};

/* User dropdown menu */
interface UserMenuProps {
  onLogout: () => void;
}

const UserMenu: React.FC<UserMenuProps> = ({ onLogout }) => (
  <div className="absolute right-0 mt-2 w-64 rounded-lg bg-white dark:bg-gray-800 shadow-lg py-2 z-50 animate-fade-in">
    <div className="py-2">
      <Link to="/dashboard" className="flex items-center px-4 py-2 hover:bg-medical-gray-100 dark:hover:bg-gray-700">
        <User size={16} className="mr-2 text-medical-gray-700 dark:text-gray-200" />
        Dashboard
      </Link>
      <Link to="/form" className="flex items-center px-4 py-2 hover:bg-medical-gray-100 dark:hover:bg-gray-700">
        <FileText size={16} className="mr-2 text-medical-gray-700 dark:text-gray-200" />
        Update Profile
      </Link>
      <Link to="/recommendations" className="flex items-center px-4 py-2 hover:bg-medical-gray-100 dark:hover:bg-gray-700">
        <Heart size={16} className="mr-2 text-medical-gray-700 dark:text-gray-200" />
        Recommendations
      </Link>
      <Link to="/ai-pharmacist" className="flex items-center px-4 py-2 hover:bg-medical-gray-100 dark:hover:bg-gray-700">
        <Pill size={16} className="mr-2 text-medical-gray-700 dark:text-gray-200" />
        Medications
      </Link>
    </div>
    <div className="border-t border-gray-100 dark:border-gray-700 py-2">
      <button
        onClick={onLogout}
        className="flex w-full items-center px-4 py-2 text-red-600 dark:text-red-400 hover:bg-medical-gray-100 dark:hover:bg-gray-700"
      >
        <ExternalLink size={16} className="mr-2" />
        Log Out
      </button>
    </div>
  </div>
);

/* Mobile menu overlay */
interface MobileMenuProps {
  isAuthenticated: boolean;
  email: string;
  onLogout: () => void;
}

const MobileMenu: React.FC<MobileMenuProps> = ({ isAuthenticated, email, onLogout }) => {
  const navigate = useNavigate();
  
  return (
    <div className="md:hidden fixed inset-0 z-40 bg-white dark:bg-gray-900 pt-24 px-6 transition-opacity">
      <nav className="flex flex-col space-y-4">
        <MobileNavLink to="/" exact icon={<Home size={18} />}>Home</MobileNavLink>
        <MobileNavLink to="/about" icon={<HelpCircle size={18} />}>About</MobileNavLink>
        
        {isAuthenticated ? (
          <>
            <MobileNavLink to="/form" icon={<FileText size={18} />}>Assessment</MobileNavLink>
            <MobileNavLink to="/dashboard" icon={<User size={18} />}>Dashboard</MobileNavLink>
            <MobileNavLink to="/recommendations" icon={<Heart size={18} />}>Recommendations</MobileNavLink>
            <MobileNavLink to="/ai-pharmacist" icon={<Pill size={18} />}>Medications</MobileNavLink>
            
            <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 rounded-full bg-medical-blue-light flex items-center justify-center text-white mr-3">
                  {email.charAt(0).toUpperCase() || 'U'}
                </div>
                <div>
                  <p className="font-medium text-medical-gray-900 dark:text-white">{email}</p>
                </div>
              </div>
              <button
                onClick={onLogout}
                className="w-full rounded-lg bg-red-50 dark:bg-red-900/20 py-3 text-center text-red-600 dark:text-red-400 font-medium"
              >
                Log Out
              </button>
            </div>
          </>
        ) : (
          <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
            <Button 
              onClick={() => navigate('/auth')}
              className="w-full flex justify-center items-center"
            >
              <LogIn size={18} className="mr-2" />
              Sign In / Sign Up
            </Button>
          </div>
        )}
      </nav>
    </div>
  );
};
