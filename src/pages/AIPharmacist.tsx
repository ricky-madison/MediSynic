
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useUserData } from '@/context/UserDataContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { MedicationManager } from '@/components/MedicationManager';
import DrugInteractionChecker from '@/components/DrugInteractionChecker';
import { Button } from '@/components/ui/button';
import { 
  Pill, 
  Bot, 
  MessageCircle, 
  Plus, 
  AlertTriangle, 
  Package, 
  TestTube, 
  Activity,
  Clipboard,
  ShoppingCart,
  Search,
  Building
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';

const AIPharmacist = () => {
  const { userData } = useUserData();
  
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
          <div className="mb-8 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Pill className="h-8 w-8 text-medical-blue" />
              <h1 className="text-3xl font-bold tracking-tight">Medications</h1>
              <Badge variant="outline" className="text-xs py-0">MVP</Badge>
            </div>
            <p className="text-muted-foreground mt-2">
              Medication Management & Health Insights
            </p>
          </div>
          
          <Tabs defaultValue="medication" className="space-y-4">
            <TabsList className="grid grid-cols-1 md:grid-cols-5 w-full">
              <TabsTrigger value="medication" className="flex items-center">
                <Pill className="h-4 w-4 mr-2" />
                Medication
              </TabsTrigger>
              <TabsTrigger value="interactions" className="flex items-center">
                <AlertTriangle className="h-4 w-4 mr-2" />
                Drug Interactions
              </TabsTrigger>
              <TabsTrigger value="trials" className="flex items-center">
                <TestTube className="h-4 w-4 mr-2" />
                Clinical Trials
              </TabsTrigger>
              <TabsTrigger value="pharmacy" className="flex items-center">
                <ShoppingCart className="h-4 w-4 mr-2" />
                Inventory
              </TabsTrigger>
              <TabsTrigger value="telehealth" className="flex items-center">
                <MessageCircle className="h-4 w-4 mr-2" />
                Telehealth
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="medication" className="space-y-6">
              <MedicationManager />
              
              {userData.medications && userData.medications.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Activity className="h-5 w-5 mr-2 text-medical-blue" />
                      AI Medication Insights
                    </CardTitle>
                    <CardDescription>
                      AI-powered insights based on your current medications
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <p className="text-sm">
                        Based on your medications, our AI recommends monitoring:
                      </p>
                      <ul className="list-disc pl-5 space-y-2 text-sm">
                        <li>Regular blood pressure checks for medication effectiveness</li>
                        <li>Hydration levels while taking these medications</li>
                        <li>Potential vitamin deficiencies (see Recommendations page)</li>
                      </ul>
                      <div className="pt-2">
                        <Button variant="outline" className="w-full">
                          <MessageCircle className="h-4 w-4 mr-2" />
                          Get Personalized Consultation
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
            
            <TabsContent value="interactions" className="space-y-6">
              <DrugInteractionChecker />
            </TabsContent>
            
            <TabsContent value="trials" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <TestTube className="h-5 w-5 mr-2 text-medical-blue" />
                    Clinical Trial Matching
                  </CardTitle>
                  <CardDescription>
                    Find clinical trials that match your health profile and current medications
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Input
                      type="text"
                      placeholder="Search by condition (e.g., diabetes, hypertension)"
                      className="mb-4"
                    />
                    <div className="bg-muted/50 p-4 rounded-md text-center">
                      <Search className="h-10 w-10 mx-auto mb-2 text-muted-foreground" />
                      <h3 className="text-lg font-medium mb-1">Search for Clinical Trials</h3>
                      <p className="text-sm text-muted-foreground mb-3">
                        Enter a health condition above to find matching clinical trials
                      </p>
                      <Button>
                        Find Trials
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Package className="h-5 w-5 mr-2 text-medical-blue" />
                    Benefits of Clinical Trials
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-sm">
                      Participating in clinical trials offers several benefits:
                    </p>
                    <ul className="list-disc pl-5 space-y-2 text-sm">
                      <li>Access to cutting-edge treatments before they're widely available</li>
                      <li>Contribute to the advancement of medical research</li>
                      <li>Receive additional medical care and attention from research teams</li>
                      <li>Potential compensation for your time and participation</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="pharmacy" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <ShoppingCart className="h-5 w-5 mr-2 text-medical-blue" />
                    AI-Powered Inventory Management
                  </CardTitle>
                  <CardDescription>
                    For pharmacies: Track stock levels, predict demand, and automate reordering
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="bg-muted/50 p-6 rounded-md text-center">
                      <Building className="h-12 w-12 mx-auto mb-3 text-muted-foreground" />
                      <h3 className="text-lg font-medium mb-2">Pharmacy Management Portal</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        This module is designed for pharmacy businesses to manage inventory, track expiration dates, and automate reordering.
                      </p>
                      <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <Button variant="outline">
                          Request Demo
                        </Button>
                        <Button>
                          Business Sign Up
                        </Button>
                      </div>
                    </div>
                    
                    <div className="pt-4">
                      <h4 className="font-medium mb-2">Key Inventory Features:</h4>
                      <ul className="list-disc pl-5 space-y-1 text-sm">
                        <li>AI-driven demand forecasting to prevent stockouts</li>
                        <li>Automated expiration date tracking to reduce waste</li>
                        <li>Smart reordering system based on historical data</li>
                        <li>Inventory analytics dashboard with actionable insights</li>
                        <li>Integration with major pharmaceutical suppliers</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Clipboard className="h-5 w-5 mr-2 text-medical-blue" />
                    Prescription Validation & Fraud Detection
                  </CardTitle>
                  <CardDescription>
                    AI-powered tools to validate prescriptions and detect potential fraud
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-sm">
                      Our AI-powered system helps pharmacies and healthcare providers:
                    </p>
                    <ul className="list-disc pl-5 space-y-2 text-sm">
                      <li>Scan and validate digital or paper prescriptions</li>
                      <li>Detect potential prescription fraud or tampering</li>
                      <li>Verify physician credentials and signatures</li>
                      <li>Ensure compliance with regulatory requirements</li>
                    </ul>
                    <div className="pt-2">
                      <Button variant="outline" className="w-full">
                        Learn About Enterprise Solutions
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="telehealth" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <MessageCircle className="h-5 w-5 mr-2 text-medical-blue" />
                    AI Pharmacist Consultation
                  </CardTitle>
                  <CardDescription>
                    Get personalized medication guidance and healthcare advice
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="bg-muted/50 p-6 rounded-md space-y-6">
                    <div className="text-center">
                      <Bot className="h-12 w-12 mx-auto mb-3 text-medical-blue" />
                      <h3 className="text-lg font-medium mb-2">AI Pharmacist Assistant</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Ask questions about medications, drug interactions, or general health concerns
                      </p>
                    </div>
                    
                    <div className="bg-card border rounded-md p-4 max-h-60 overflow-y-auto space-y-3">
                      <div className="flex items-start gap-3">
                        <span className="bg-primary/10 p-2 rounded-full">
                          <Bot className="h-4 w-4 text-primary" />
                        </span>
                        <div className="flex-1 text-sm">
                          Hello! I'm your AI Pharmacist Assistant. How can I help you today?
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3">
                        <span className="bg-secondary/10 p-2 rounded-full">
                          <MessageCircle className="h-4 w-4 text-secondary" />
                        </span>
                        <div className="flex-1 text-sm">
                          Can I take ibuprofen with my blood pressure medication?
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3">
                        <span className="bg-primary/10 p-2 rounded-full">
                          <Bot className="h-4 w-4 text-primary" />
                        </span>
                        <div className="flex-1 text-sm">
                          NSAIDs like ibuprofen may reduce the effectiveness of some blood pressure medications and could increase kidney damage risk. It's best to consult with your doctor before combining them.
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Input 
                        placeholder="Type your medication question..." 
                        className="flex-1"
                      />
                      <Button>
                        Send
                      </Button>
                    </div>
                    
                    <p className="text-xs text-center text-muted-foreground">
                      For emergencies or urgent medical concerns, please contact your healthcare provider directly.
                    </p>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Activity className="h-5 w-5 mr-2 text-medical-blue" />
                    Connect with Healthcare Providers
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-sm">
                      Get personalized healthcare through our telehealth services:
                    </p>
                    <ul className="list-disc pl-5 space-y-2 text-sm">
                      <li>Connect with pharmacists for medication consultations</li>
                      <li>Schedule virtual appointments with healthcare providers</li>
                      <li>Get prescriptions and refills through our telehealth network</li>
                      <li>Access personalized treatment plans and follow-ups</li>
                    </ul>
                    <div className="pt-2">
                      <Button className="w-full">
                        Explore Telehealth Options
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default AIPharmacist;
