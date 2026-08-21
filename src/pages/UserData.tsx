
import React, { useState } from 'react';
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { useUserData } from '@/context/UserDataContext';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { 
  AlertCircle, 
  Download, 
  Trash2, 
  FileJson, 
  Clock, 
  Shield, 
  ChevronRight 
} from "lucide-react";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const UserData = () => {
  const { userData, resetData } = useUserData();
  const [exporting, setExporting] = useState(false);
  
  const handleExportData = () => {
    setExporting(true);
    
    try {
      // Create a JSON blob of all user data
      const dataStr = JSON.stringify(userData, null, 2);
      const blob = new Blob([dataStr], { type: "application/json" });
      
      // Create download link and trigger download
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `medisynic-data-export-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      
      // Clean up
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      toast({
        title: "Data exported successfully",
        description: "Your data has been downloaded as a JSON file.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Export failed",
        description: "There was an error exporting your data. Please try again.",
      });
      console.error("Error exporting data:", error);
    } finally {
      setExporting(false);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      // In a real app with authentication, we would delete the Supabase user account
      // For now, we'll just reset the local data
      resetData();
      
      toast({
        title: "Account data deleted",
        description: "All your data has been removed from the application.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Deletion failed",
        description: "There was an error deleting your account. Please try again.",
      });
      console.error("Error deleting account:", error);
    }
  };

  const hasData = userData && Object.keys(userData).length > 0;

  return (
    <div className="container max-w-4xl py-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Manage Your Data</h1>
        <p className="text-muted-foreground mt-2">
          Control, export, or delete your personal data
        </p>
      </div>
      
      <Separator />
      
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Your Rights</h2>
        <p>
          Under privacy regulations like GDPR and HIPAA, you have the right to:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div className="bg-card p-4 rounded-lg border">
            <div className="flex items-start">
              <div className="mr-3 mt-0.5">
                <FileJson size={20} className="text-blue-500" />
              </div>
              <div>
                <h3 className="font-medium">Access Your Data</h3>
                <p className="text-sm text-muted-foreground">
                  Export all your data in machine-readable format
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-card p-4 rounded-lg border">
            <div className="flex items-start">
              <div className="mr-3 mt-0.5">
                <Trash2 size={20} className="text-red-500" />
              </div>
              <div>
                <h3 className="font-medium">Delete Your Data</h3>
                <p className="text-sm text-muted-foreground">
                  Permanently remove all your personal information
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-card p-4 rounded-lg border">
            <div className="flex items-start">
              <div className="mr-3 mt-0.5">
                <Clock size={20} className="text-amber-500" />
              </div>
              <div>
                <h3 className="font-medium">Data Retention</h3>
                <p className="text-sm text-muted-foreground">
                  We store your data only as long as necessary
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-card p-4 rounded-lg border">
            <div className="flex items-start">
              <div className="mr-3 mt-0.5">
                <Shield size={20} className="text-green-500" />
              </div>
              <div>
                <h3 className="font-medium">Data Security</h3>
                <p className="text-sm text-muted-foreground">
                  Your data is encrypted and securely stored
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Data storage location</AlertTitle>
        <AlertDescription>
          Your data is stored securely in the US region in compliance with local regulations.
          For more information, please review our <Link to="/privacy-policy" className="underline">Privacy Policy</Link>.
        </AlertDescription>
      </Alert>
      
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Actions</h2>
        
        {!hasData && (
          <div className="bg-gray-50 dark:bg-gray-800 p-6 text-center rounded-lg border border-dashed">
            <p className="text-muted-foreground">
              You haven't added any data yet. Complete the 
              <Link to="/form" className="text-primary mx-1 font-medium">health assessment</Link> 
              to start tracking your health information.
            </p>
          </div>
        )}
        
        {hasData && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={handleExportData}
                disabled={exporting}
              >
                <Download className="mr-2 h-4 w-4" />
                {exporting ? "Exporting..." : "Export All Data"}
              </Button>
              
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" className="flex-1">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete All Data
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will permanently delete all your health data, medication records, 
                      and personal information. This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction 
                      className="bg-red-600 hover:bg-red-700 text-white"
                      onClick={handleDeleteAccount}
                    >
                      Delete Everything
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
            
            <div className="mt-6">
              <h3 className="font-medium mb-2">Data Summary</h3>
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg text-sm">
                <div className="grid grid-cols-2 gap-2">
                  <div>Name:</div>
                  <div className="font-medium">{userData.name || "Not provided"}</div>
                  
                  <div>Age:</div>
                  <div className="font-medium">{userData.age || "Not provided"}</div>
                  
                  <div>Sex:</div>
                  <div className="font-medium">{userData.sex || "Not provided"}</div>
                  
                  <div>Medications:</div>
                  <div className="font-medium">{userData.medications?.length || 0} recorded</div>
                  
                  <div>Health conditions:</div>
                  <div className="font-medium">{userData.conditions?.length || 0} recorded</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>
      
      <div className="border-t pt-6 mt-8">
        <h2 className="text-xl font-semibold mb-4">Related Links</h2>
        <div className="space-y-2">
          <Link 
            to="/privacy-policy" 
            className="flex items-center justify-between p-3 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <span>Privacy Policy</span>
            <ChevronRight size={18} />
          </Link>
          <Link 
            to="/security-report" 
            className="flex items-center justify-between p-3 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <span>Report a Security Concern</span>
            <ChevronRight size={18} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default UserData;
