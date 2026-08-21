
import React, { useState, useEffect } from 'react';
import { useUserData } from '@/context/UserDataContext';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Pill, Plus, Trash2, Search, Clock, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { searchDrugs, FdaDrug } from '@/utils/fdaApi';

export const MedicationManager = () => {
  const { userData, addMedication, removeMedication, generateRecommendations } = useUserData();
  
  const [newMedication, setNewMedication] = useState({
    name: '',
    dosage: '',
    frequency: 'daily',
    timeOfDay: 'morning',
    startDate: new Date().toISOString().split('T')[0]
  });
  
  const [searchQuery, setSearchQuery] = useState('');
  const [showMedications, setShowMedications] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<FdaDrug[]>([]);
  
  // Handle API search when query changes
  useEffect(() => {
    // Debounce function to avoid too many API calls
    const debounceSearch = setTimeout(async () => {
      if (searchQuery.length >= 2) {
        setIsSearching(true);
        try {
          const results = await searchDrugs(searchQuery);
          setSearchResults(results);
        } catch (error) {
          console.error("Error searching drugs:", error);
          toast.error("Failed to fetch medication data");
        } finally {
          setIsSearching(false);
        }
      } else {
        setSearchResults([]);
      }
    }, 500); // Wait 500ms after typing stops
    
    return () => clearTimeout(debounceSearch);
  }, [searchQuery]);
  
  const handleAddMedication = () => {
    if (!newMedication.name) {
      toast.error('Please enter a medication name');
      return;
    }
    
    if (!newMedication.dosage) {
      toast.error('Please enter a dosage');
      return;
    }
    
    addMedication(newMedication);
    
    // Reset form
    setNewMedication({
      name: '',
      dosage: '',
      frequency: 'daily',
      timeOfDay: 'morning',
      startDate: new Date().toISOString().split('T')[0]
    });
    
    toast.success('Medication added successfully');
    
    // Generate new recommendations
    generateRecommendations();
  };
  
  const handleRemoveMedication = (index: number) => {
    removeMedication(index);
    toast.success('Medication removed');
    
    // Generate new recommendations
    generateRecommendations();
  };

  const handleSelectDrug = (drug: FdaDrug) => {
    setNewMedication({
      ...newMedication,
      name: drug.brandName
    });
    setSearchQuery('');
    setShowMedications(false);
  };
  
  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Pill className="h-5 w-5 mr-2 text-medical-blue" />
          Medication Management
        </CardTitle>
        <CardDescription>
          Add and manage your medications to receive personalized vitamin recommendations
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-6">
          {/* Medication Search and Form */}
          <div className="space-y-3">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search FDA-approved medications..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowMedications(e.target.value.length > 0);
                }}
                onFocus={() => setShowMedications(true)}
              />
              {isSearching && (
                <Loader2 className="absolute right-2 top-2.5 h-4 w-4 animate-spin text-muted-foreground" />
              )}
            </div>
            
            {showMedications && searchQuery && (
              <div className="max-h-60 overflow-y-auto border rounded-md p-2 bg-white shadow-md">
                {isSearching ? (
                  <div className="flex items-center justify-center py-4">
                    <Loader2 className="h-5 w-5 animate-spin text-muted-foreground mr-2" />
                    <span className="text-sm text-gray-500">Searching FDA database...</span>
                  </div>
                ) : searchResults.length > 0 ? (
                  <ul className="space-y-1">
                    {searchResults.map((drug, index) => (
                      <li 
                        key={index}
                        className="cursor-pointer hover:bg-gray-100 p-2 rounded-md transition-colors"
                        onClick={() => handleSelectDrug(drug)}
                      >
                        <div className="font-medium">{drug.brandName}</div>
                        {drug.genericName && (
                          <div className="text-xs text-gray-500">
                            Generic: {drug.genericName}
                          </div>
                        )}
                      </li>
                    ))}
                  </ul>
                ) : searchQuery.length >= 2 ? (
                  <p className="text-sm text-gray-500 p-2">
                    No medications found. You can still add it manually.
                  </p>
                ) : (
                  <p className="text-sm text-gray-500 p-2">
                    Type at least 2 characters to search FDA database
                  </p>
                )}
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-medium mb-1 block">Medication Name</label>
                <Input 
                  value={newMedication.name}
                  onChange={(e) => setNewMedication({...newMedication, name: e.target.value})}
                  placeholder="Enter medication name"
                />
              </div>
              
              <div>
                <label className="text-sm font-medium mb-1 block">Dosage</label>
                <Input 
                  value={newMedication.dosage}
                  onChange={(e) => setNewMedication({...newMedication, dosage: e.target.value})}
                  placeholder="e.g. 10mg, 1 tablet"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="text-sm font-medium mb-1 block">Frequency</label>
                <Select 
                  value={newMedication.frequency}
                  onValueChange={(value) => setNewMedication({...newMedication, frequency: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="twice-daily">Twice Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="as-needed">As Needed</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm font-medium mb-1 block">Time of Day</label>
                <Select 
                  value={newMedication.timeOfDay}
                  onValueChange={(value) => setNewMedication({...newMedication, timeOfDay: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select time" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="morning">Morning</SelectItem>
                    <SelectItem value="afternoon">Afternoon</SelectItem>
                    <SelectItem value="evening">Evening</SelectItem>
                    <SelectItem value="before-meal">Before Meals</SelectItem>
                    <SelectItem value="with-meal">With Meals</SelectItem>
                    <SelectItem value="after-meal">After Meals</SelectItem>
                    <SelectItem value="bedtime">Bedtime</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm font-medium mb-1 block">Start Date</label>
                <Input 
                  type="date"
                  value={newMedication.startDate}
                  onChange={(e) => setNewMedication({...newMedication, startDate: e.target.value})}
                />
              </div>
            </div>
            
            <Button
              onClick={handleAddMedication}
              className="w-full"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Medication
            </Button>
          </div>
          
          {/* Current Medications List */}
          <div>
            <h3 className="text-lg font-medium mb-3">Current Medications</h3>
            
            {userData.medications && userData.medications.length > 0 ? (
              <div className="space-y-3">
                {userData.medications.map((med, index) => (
                  <div key={index} className="flex items-start justify-between p-3 border rounded-lg bg-gray-50">
                    <div>
                      <div className="font-medium">{med.name}</div>
                      <div className="text-sm text-gray-500">{med.dosage}</div>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-xs">
                          {med.frequency.replace('-', ' ')}
                        </Badge>
                        <Badge variant="outline" className="text-xs flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {med.timeOfDay.replace('-', ' ')}
                        </Badge>
                      </div>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => handleRemoveMedication(index)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center p-6 border border-dashed rounded-lg">
                <Pill className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                <p className="text-muted-foreground">No medications added yet</p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-between bg-gray-50 border-t">
        <p className="text-xs text-gray-500">
          Search powered by FDA drug database. Adding medications helps us provide personalized vitamin recommendations.
        </p>
      </CardFooter>
    </Card>
  );
};

export default MedicationManager;
