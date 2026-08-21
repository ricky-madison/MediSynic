
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserData } from '@/context/UserDataContext';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

interface FloatingCTAProps {
  destination?: string;
  label?: string;
}

const FloatingCTA: React.FC<FloatingCTAProps> = ({ 
  destination = '/form',
  label = 'Get Started'
}) => {
  const navigate = useNavigate();
  const { userData } = useUserData();
  const hasUserData = Object.keys(userData).length > 0 && userData.name;

  // Don't show for users who already have data
  if (hasUserData && destination === '/form') {
    return null;
  }

  return (
    <div className="fixed bottom-4 sm:bottom-6 right-4 sm:right-6 z-40">
      <Button
        onClick={() => navigate(destination)}
        size="lg"
        className="shadow-lg bg-medical-blue hover:bg-medical-blue-dark text-white rounded-full px-4 sm:px-6 py-4 sm:py-6 h-auto"
      >
        <span className="hidden sm:inline">{label}</span>
        <span className="sm:hidden">Start</span>
        <ArrowRight className="ml-2 h-4 w-4" />
      </Button>
    </div>
  );
};

export default FloatingCTA;
