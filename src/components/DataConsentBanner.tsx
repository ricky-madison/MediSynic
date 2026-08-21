
import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';
import { toast } from '@/components/ui/use-toast';

const DataConsentBanner = () => {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    // Check if user has already consented
    const hasConsented = localStorage.getItem('data-consent');
    if (!hasConsented) {
      // Show the banner after a short delay
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, []);
  
  const handleAccept = () => {
    localStorage.setItem('data-consent', 'true');
    setIsVisible(false);
    toast({
      title: "Consent saved",
      description: "Thank you for your consent.",
    });
  };
  
  const handleDecline = () => {
    localStorage.setItem('data-consent', 'false');
    setIsVisible(false);
    toast({
      title: "Preferences saved",
      description: "We'll only collect essential data.",
    });
  };
  
  if (!isVisible) {
    return null;
  }
  
  return (
    <div className="fixed inset-x-0 bottom-0 z-50 bg-white dark:bg-gray-900 border-t p-4 md:p-6 shadow-lg">
      <div className="container max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold mb-1">Privacy & Data Consent</h3>
            <p className="text-sm text-muted-foreground">
              We use cookies and process your data to provide our services and show personalized content. 
              By clicking "Accept", you consent to our <Link to="/privacy-policy" className="underline">Privacy Policy</Link>.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" onClick={handleDecline}>
              Essential Only
            </Button>
            <Button size="sm" onClick={handleAccept}>
              Accept All
            </Button>
            <button 
              onClick={() => setIsVisible(false)} 
              className="ml-2 p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800"
              aria-label="Close"
            >
              <X size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataConsentBanner;
