
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { generateHealthRecommendations } from '@/utils/healthRecommendations';
import { supabase } from "@/integrations/supabase/client";

// Medication interface
export interface Medication {
  name: string;
  dosage: string;
  frequency: string;
  timeOfDay: string;
  startDate?: string;
}

// User data interface
export interface UserData {
  // Personal information
  name: string;
  age: number;
  sex: string;
  weight: number; // in kg
  height: number; // in cm
  waist: number; // in cm
  
  // Lifestyle
  maritalStatus: string;
  children: number;
  workingHours: number;
  jobType: string;
  
  // Region/Location
  region: string;
  
  // Medical
  medications: Medication[];
  conditions: string[];
  allergies: string[];
  familyHistory: string[];
  
  // Blood work
  bloodWork: {
    lastTestDate?: string;
    redBloodCellCount?: number;
    whiteBloodCellCount?: number;
    plateletCount?: number;
    hemoglobin?: number;
    hematocrit?: number;
    mcv?: number; // Mean Corpuscular Volume
    mch?: number; // Mean Corpuscular Hemoglobin
    mchc?: number; // Mean Corpuscular Hemoglobin Concentration
  };
  
  // Cancer markers
  cancerMarkers: {
    lastTestDate?: string;
    cea?: number; // Carcinoembryonic Antigen
    ca125?: number; // Cancer Antigen 125
    ca199?: number; // Cancer Antigen 19-9
    psa?: number; // Prostate-Specific Antigen
    afp?: number; // Alpha-Fetoprotein
  };
  
  // Vital signs
  vitalSigns: {
    bloodPressureSystolic?: number;
    bloodPressureDiastolic?: number;
    heartRate?: number;
    oxygenLevel?: number;
    glucoseLevel?: number;
  };
  
  // Additional factors
  sleepHours: number;
  stressLevel: string;
  dietType: string;
  exerciseFrequency: string;
  smokingStatus?: string;
  alcoholConsumption?: string;
  waterIntake?: number; // glasses per day
}

// Recommendations interface
export interface Recommendation {
  id: string;
  title: string;
  description: string;
  category: 'lifestyle' | 'diet' | 'exercise' | 'medical' | 'preventive' | 'supplement';
  priority: 'high' | 'medium' | 'low';
  icon: string;
}

// Drug interaction interface
export interface DrugInteraction {
  medication1: string;
  medication2: string;
  severity: 'high' | 'medium' | 'low';
  description: string;
}

// Vitamin recommendation interface
export interface VitaminRecommendation {
  name: string;
  dosage: string;
  reason: string;
  foodSources: string[];
  interactingMedications?: string[];
}

interface UserDataContextType {
  userData: Partial<UserData>;
  setUserData: React.Dispatch<React.SetStateAction<Partial<UserData>>>;
  recommendations: Recommendation[];
  drugInteractions: DrugInteraction[];
  vitaminRecommendations: VitaminRecommendation[];
  setRecommendations: React.Dispatch<React.SetStateAction<Recommendation[]>>;
  generateRecommendations: () => void;
  resetData: () => void;
  addMedication: (medication: Medication) => void;
  removeMedication: (index: number) => void;
  saveUserData: () => Promise<void>;
  loadUserData: () => Promise<void>;
}

const UserDataContext = createContext<UserDataContextType | undefined>(undefined);

export const UserDataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [userData, setUserData] = useState<Partial<UserData>>({
    medications: []
  });
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [drugInteractions, setDrugInteractions] = useState<DrugInteraction[]>([]);
  const [vitaminRecommendations, setVitaminRecommendations] = useState<VitaminRecommendation[]>([]);

  // Add a medication to the user's medication list
  const addMedication = (medication: Medication) => {
    setUserData(prevData => {
      const updatedMedications = [...(prevData.medications || []), medication];
      return {
        ...prevData,
        medications: updatedMedications
      };
    });
  };

  // Remove a medication from the user's medication list
  const removeMedication = (index: number) => {
    setUserData(prevData => {
      if (!prevData.medications) return prevData;
      
      const updatedMedications = [...prevData.medications];
      updatedMedications.splice(index, 1);
      
      return {
        ...prevData,
        medications: updatedMedications
      };
    });
  };

  // Generate recommendations based on user data
  const generateRecommendations = () => {
    const results = generateHealthRecommendations(userData);
    setRecommendations(results.recommendations);
    setDrugInteractions(results.drugInteractions);
    setVitaminRecommendations(results.vitaminRecommendations);
  };
  
  const resetData = () => {
    setUserData({
      medications: []
    });
    setRecommendations([]);
    setDrugInteractions([]);
    setVitaminRecommendations([]);
  };
  
  // Save user data to localStorage
  const saveUserData = async () => {
    try {
      // Get the authenticated user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        console.log('User is authenticated, but user_profiles table may not exist yet');
        // For now, just save to localStorage until the Supabase table is created
        localStorage.setItem('medisynic_userData', JSON.stringify(userData));
        console.log('User data saved to localStorage');
      } else {
        // No authenticated user, save to localStorage
        localStorage.setItem('medisynic_userData', JSON.stringify(userData));
        console.log('User data saved to localStorage (no authenticated user)');
      }
    } catch (error) {
      console.error('Error in saveUserData:', error);
      // Final fallback - always try localStorage if all else fails
      localStorage.setItem('medisynic_userData', JSON.stringify(userData));
    }
  };
  
  // Load user data from localStorage
  const loadUserData = async () => {
    try {
      // Get the authenticated user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        console.log('User is authenticated, but user_profiles table may not exist yet');
        // For now, just load from localStorage until the Supabase table is created
      }
      
      // Load from localStorage
      const savedData = localStorage.getItem('medisynic_userData');
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        setUserData(parsedData);
        
        // Generate recommendations based on loaded data
        const results = generateHealthRecommendations(parsedData);
        setRecommendations(results.recommendations);
        setDrugInteractions(results.drugInteractions);
        setVitaminRecommendations(results.vitaminRecommendations);
      }
    } catch (error) {
      console.error('Error in loadUserData:', error);
    }
  };

  return (
    <UserDataContext.Provider 
      value={{ 
        userData, 
        setUserData, 
        recommendations, 
        drugInteractions,
        vitaminRecommendations,
        setRecommendations,
        generateRecommendations,
        resetData,
        addMedication,
        removeMedication,
        saveUserData,
        loadUserData
      }}
    >
      {children}
    </UserDataContext.Provider>
  );
};

export const useUserData = () => {
  const context = useContext(UserDataContext);
  if (context === undefined) {
    throw new Error('useUserData must be used within a UserDataProvider');
  }
  return context;
};
