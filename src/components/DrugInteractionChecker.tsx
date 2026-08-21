
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useUserData } from '@/context/UserDataContext';
import { searchDrugs, checkDrugInteractions, FdaDrug } from '@/utils/fdaApi';
import { AlertCircle, AlertTriangle, Check, Search } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

export const DrugInteractionChecker: React.FC = () => {
  const { userData } = useUserData();
  const [drug1, setDrug1] = useState('');
  const [drug2, setDrug2] = useState('');
  const [isChecking, setIsChecking] = useState(false);
  const [interactionResult, setInteractionResult] = useState<{
    hasInteraction: boolean;
    severity?: 'high' | 'medium' | 'low';
    description?: string;
  } | null>(null);
  
  const [searchQuery1, setSearchQuery1] = useState('');
  const [searchQuery2, setSearchQuery2] = useState('');
  const [searchResults1, setSearchResults1] = useState<FdaDrug[]>([]);
  const [searchResults2, setSearchResults2] = useState<FdaDrug[]>([]);
  const [isSearching1, setIsSearching1] = useState(false);
  const [isSearching2, setIsSearching2] = useState(false);
  const [showResults1, setShowResults1] = useState(false);
  const [showResults2, setShowResults2] = useState(false);
  
  // Handle drug search 1
  useEffect(() => {
    const debounceSearch = setTimeout(async () => {
      if (searchQuery1.length >= 2) {
        setIsSearching1(true);
        try {
          const results = await searchDrugs(searchQuery1);
          setSearchResults1(results);
        } catch (error) {
          console.error("Error searching drugs:", error);
        } finally {
          setIsSearching1(false);
        }
      } else {
        setSearchResults1([]);
      }
    }, 500);
    
    return () => clearTimeout(debounceSearch);
  }, [searchQuery1]);
  
  // Handle drug search 2
  useEffect(() => {
    const debounceSearch = setTimeout(async () => {
      if (searchQuery2.length >= 2) {
        setIsSearching2(true);
        try {
          const results = await searchDrugs(searchQuery2);
          setSearchResults2(results);
        } catch (error) {
          console.error("Error searching drugs:", error);
        } finally {
          setIsSearching2(false);
        }
      } else {
        setSearchResults2([]);
      }
    }, 500);
    
    return () => clearTimeout(debounceSearch);
  }, [searchQuery2]);
  
  const handleCheckInteraction = async () => {
    if (!drug1 || !drug2) {
      toast.error('Please enter both medications to check for interactions');
      return;
    }
    
    setIsChecking(true);
    try {
      const result = await checkDrugInteractions(drug1, drug2);
      setInteractionResult(result);
    } catch (error) {
      console.error("Error checking drug interactions:", error);
      toast.error('Failed to check drug interactions');
    } finally {
      setIsChecking(false);
    }
  };
  
  const handleSelectDrug1 = (drug: FdaDrug) => {
    setDrug1(drug.brandName);
    setSearchQuery1('');
    setShowResults1(false);
  };
  
  const handleSelectDrug2 = (drug: FdaDrug) => {
    setDrug2(drug.brandName);
    setSearchQuery2('');
    setShowResults2(false);
  };
  
  const getSeverityColor = (severity?: 'high' | 'medium' | 'low') => {
    switch (severity) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-green-100 text-green-800 border-green-200';
    }
  };
  
  const getSeverityIcon = (severity?: 'high' | 'medium' | 'low') => {
    switch (severity) {
      case 'high':
        return <AlertCircle className="h-5 w-5 text-red-600" />;
      case 'medium':
        return <AlertTriangle className="h-5 w-5 text-yellow-600" />;
      case 'low':
        return <AlertTriangle className="h-5 w-5 text-blue-600" />;
      default:
        return <Check className="h-5 w-5 text-green-600" />;
    }
  };
  
  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center">
          <AlertCircle className="h-5 w-5 mr-2 text-red-500" />
          Drug Interaction Checker
        </CardTitle>
        <CardDescription>
          Check for potential interactions between medications, supplements, or food items
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* First Medication Input */}
            <div className="space-y-2">
              <label className="text-sm font-medium">First Medication</label>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search medications..."
                  className="pl-8"
                  value={searchQuery1}
                  onChange={(e) => {
                    setSearchQuery1(e.target.value);
                    setShowResults1(true);
                  }}
                  onFocus={() => setShowResults1(true)}
                />
              </div>
              
              {showResults1 && searchQuery1.length >= 2 && (
                <div className="relative">
                  <div className="absolute z-10 w-full max-h-48 overflow-y-auto bg-white shadow-lg rounded-md border">
                    {isSearching1 ? (
                      <div className="p-2 text-center text-sm text-gray-500">Searching...</div>
                    ) : searchResults1.length > 0 ? (
                      <ul>
                        {searchResults1.map((drug, idx) => (
                          <li 
                            key={idx} 
                            className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                            onClick={() => handleSelectDrug1(drug)}
                          >
                            <div className="font-medium">{drug.brandName}</div>
                            {drug.genericName && (
                              <div className="text-xs text-gray-500">Generic: {drug.genericName}</div>
                            )}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <div className="p-2 text-center text-sm text-gray-500">No results found</div>
                    )}
                  </div>
                </div>
              )}
              
              <Input 
                placeholder="Enter medication name"
                value={drug1}
                onChange={(e) => setDrug1(e.target.value)}
              />
            </div>
            
            {/* Second Medication Input */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Second Medication or Item</label>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search medications..."
                  className="pl-8"
                  value={searchQuery2}
                  onChange={(e) => {
                    setSearchQuery2(e.target.value);
                    setShowResults2(true);
                  }}
                  onFocus={() => setShowResults2(true)}
                />
              </div>
              
              {showResults2 && searchQuery2.length >= 2 && (
                <div className="relative">
                  <div className="absolute z-10 w-full max-h-48 overflow-y-auto bg-white shadow-lg rounded-md border">
                    {isSearching2 ? (
                      <div className="p-2 text-center text-sm text-gray-500">Searching...</div>
                    ) : searchResults2.length > 0 ? (
                      <ul>
                        {searchResults2.map((drug, idx) => (
                          <li 
                            key={idx} 
                            className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                            onClick={() => handleSelectDrug2(drug)}
                          >
                            <div className="font-medium">{drug.brandName}</div>
                            {drug.genericName && (
                              <div className="text-xs text-gray-500">Generic: {drug.genericName}</div>
                            )}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <div className="p-2 text-center text-sm text-gray-500">No results found</div>
                    )}
                  </div>
                </div>
              )}
              
              <Input 
                placeholder="Enter medication, supplement, or food"
                value={drug2}
                onChange={(e) => setDrug2(e.target.value)}
              />
            </div>
          </div>
          
          <Button 
            onClick={handleCheckInteraction} 
            disabled={isChecking || !drug1 || !drug2}
            className="w-full"
          >
            {isChecking ? 'Checking...' : 'Check Interaction'}
          </Button>
        </div>
        
        {interactionResult && (
          <div className="pt-4">
            <Alert className={interactionResult.hasInteraction ? getSeverityColor(interactionResult.severity) : 'bg-green-100 text-green-800 border-green-200'}>
              <div className="flex items-start">
                <div className="mr-3 mt-0.5">
                  {interactionResult.hasInteraction ? 
                    getSeverityIcon(interactionResult.severity) : 
                    <Check className="h-5 w-5 text-green-600" />
                  }
                </div>
                <div>
                  <AlertTitle className="mb-1">
                    {interactionResult.hasInteraction ? (
                      <>
                        Interaction Detected
                        {interactionResult.severity && (
                          <Badge variant="outline" className="ml-2 capitalize">
                            {interactionResult.severity} risk
                          </Badge>
                        )}
                      </>
                    ) : (
                      'No Known Interaction'
                    )}
                  </AlertTitle>
                  <AlertDescription className="text-sm">
                    {interactionResult.description}
                  </AlertDescription>
                </div>
              </div>
            </Alert>
          </div>
        )}
        
        {userData.medications && userData.medications.length > 0 && (
          <div className="pt-2">
            <h3 className="text-sm font-medium mb-2">Quick Check with Your Medications</h3>
            <div className="flex flex-wrap gap-2">
              {userData.medications.map((med, idx) => (
                <Badge 
                  key={idx}
                  variant="outline"
                  className="cursor-pointer hover:bg-gray-100"
                  onClick={() => setDrug1(med.name)}
                >
                  {med.name}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="flex flex-col text-xs text-gray-500 space-y-1">
        <p>This tool provides information about potential drug interactions but is not a substitute for professional medical advice.</p>
        <p>Always consult with a healthcare provider before making any changes to your medication regimen.</p>
      </CardFooter>
    </Card>
  );
};

export default DrugInteractionChecker;
