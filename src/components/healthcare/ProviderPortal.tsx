
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import { MessageCircle, Calendar as CalendarIcon, FileText, Share2, User, Bell } from "lucide-react";
import { useOptimizedQuery } from "@/hooks/useOptimizedQuery";
import { toast } from "sonner";

interface ProviderPortalProps {
  userId?: string;
}

// Mock data for healthcare providers
const mockProviders = [
  {
    id: 'p1',
    name: 'Dr. Sarah Johnson',
    specialty: 'Endocrinology',
    hospital: 'Central Medical Center',
    avatar: '/placeholder.svg',
    hasAccess: true,
    lastAccessed: '2023-06-15T10:30:00Z'
  },
  {
    id: 'p2',
    name: 'Dr. Michael Chen',
    specialty: 'Internal Medicine',
    hospital: 'Westside Health Partners',
    avatar: '/placeholder.svg',
    hasAccess: false,
    lastAccessed: null
  }
];

// Mock data for upcoming appointments
const mockAppointments = [
  {
    id: 'a1',
    providerId: 'p1',
    date: '2025-05-12T14:30:00Z',
    type: 'Check-up',
    virtual: true,
    notes: 'Quarterly diabetes management review'
  },
  {
    id: 'a2',
    providerId: 'p1',
    date: '2025-06-02T10:00:00Z',
    type: 'Lab Review',
    virtual: false,
    notes: 'Review recent blood work results'
  }
];

const ProviderPortal: React.FC<ProviderPortalProps> = ({ userId }) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedTab, setSelectedTab] = useState('providers');

  // Fetch providers with access to user data
  const { data: providers, isLoading: providersLoading } = useOptimizedQuery(
    ['user', userId, 'healthcare-providers'],
    async () => {
      // In production, this would be a real API call
      await new Promise(resolve => setTimeout(resolve, 600));
      return mockProviders;
    }
  );

  // Fetch upcoming appointments
  const { data: appointments, isLoading: appointmentsLoading } = useOptimizedQuery(
    ['user', userId, 'appointments'],
    async () => {
      // In production, this would be a real API call
      await new Promise(resolve => setTimeout(resolve, 500));
      return mockAppointments;
    }
  );

  const handleGrantAccess = (providerId: string) => {
    // In production, this would call an API to grant access
    toast.success('Access granted to healthcare provider');
  };
  
  const handleRevokeAccess = (providerId: string) => {
    // In production, this would call an API to revoke access
    toast.success('Access revoked from healthcare provider');
  };
  
  const handleGenerateReport = () => {
    // In production, this would generate a report for the provider
    toast.success('Medical report generated and ready to share');
  };
  
  const handleScheduleAppointment = () => {
    // In production, this would open a scheduling interface
    toast.success('Appointment scheduling initiated');
  };

  const handleMessageProvider = (providerId: string) => {
    // In production, this would open a messaging interface
    toast.success('Message thread opened');
  };

  return (
    <Card className="shadow-md border-blue-100 dark:border-blue-900">
      <CardHeader className="bg-blue-50 dark:bg-blue-950/40">
        <CardTitle className="text-blue-900 dark:text-blue-100">Healthcare Provider Portal</CardTitle>
        <CardDescription>
          Manage your healthcare provider access, appointments, and communications
        </CardDescription>
      </CardHeader>
      
      <CardContent className="pt-6">
        <Tabs defaultValue="providers" value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="providers">
              <User className="h-4 w-4 mr-2" />
              Providers
            </TabsTrigger>
            <TabsTrigger value="appointments">
              <CalendarIcon className="h-4 w-4 mr-2" />
              Appointments
            </TabsTrigger>
            <TabsTrigger value="reports">
              <FileText className="h-4 w-4 mr-2" />
              Reports
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="providers" className="pt-4">
            <div className="space-y-4">
              {providers?.map(provider => (
                <Card key={provider.id} className={`border ${provider.hasAccess ? 'border-green-100 dark:border-green-900' : 'border-gray-200 dark:border-gray-800'}`}>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={provider.avatar} alt={provider.name} />
                        <AvatarFallback>{provider.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium">{provider.name}</h3>
                            <p className="text-sm text-muted-foreground">{provider.specialty} • {provider.hospital}</p>
                          </div>
                          
                          {provider.hasAccess ? (
                            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-300 dark:border-green-900">
                              Has Access
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-800">
                              No Access
                            </Badge>
                          )}
                        </div>
                        
                        {provider.hasAccess && provider.lastAccessed && (
                          <p className="text-xs text-muted-foreground mt-1">
                            Last accessed: {new Date(provider.lastAccessed).toLocaleDateString()}
                          </p>
                        )}
                        
                        <div className="flex gap-2 mt-3">
                          {provider.hasAccess ? (
                            <>
                              <Button size="sm" variant="outline" onClick={() => handleMessageProvider(provider.id)}>
                                <MessageCircle className="h-4 w-4 mr-2" />
                                Message
                              </Button>
                              <Button size="sm" variant="outline" className="text-red-600 border-red-200 hover:bg-red-50 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-950" onClick={() => handleRevokeAccess(provider.id)}>
                                Revoke Access
                              </Button>
                            </>
                          ) : (
                            <Button size="sm" variant="outline" className="text-green-600 border-green-200 hover:bg-green-50 dark:border-green-900 dark:text-green-400 dark:hover:bg-green-950" onClick={() => handleGrantAccess(provider.id)}>
                              Grant Access
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              <Button variant="outline" className="w-full">
                <User className="h-4 w-4 mr-2" />
                Add New Provider
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="appointments" className="pt-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium mb-3">Calendar</h3>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  className="border rounded-md"
                />
                <Button className="w-full mt-4" onClick={handleScheduleAppointment}>
                  Schedule New Appointment
                </Button>
              </div>
              
              <div>
                <h3 className="text-sm font-medium mb-3">Upcoming Appointments</h3>
                <div className="space-y-3">
                  {appointments?.map(appointment => (
                    <Card key={appointment.id} className="overflow-hidden">
                      <div className="bg-blue-50 dark:bg-blue-950/40 px-4 py-2 flex justify-between items-center">
                        <span className="font-medium">{new Date(appointment.date).toLocaleDateString()}</span>
                        <Badge variant={appointment.virtual ? "outline" : "default"}>
                          {appointment.virtual ? 'Virtual' : 'In-Person'}
                        </Badge>
                      </div>
                      <CardContent className="p-4">
                        <p className="font-medium">{appointment.type}</p>
                        <p className="text-sm text-muted-foreground">{appointment.notes}</p>
                        <div className="flex gap-2 mt-3">
                          <Button size="sm" variant="outline">Reschedule</Button>
                          <Button size="sm" variant="outline" className="text-red-600 border-red-200 hover:bg-red-50 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-950">
                            Cancel
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  
                  {appointments?.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      <CalendarIcon className="h-10 w-10 mx-auto mb-2 opacity-50" />
                      <p>No upcoming appointments</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="reports" className="pt-4">
            <div className="space-y-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Generate Medical Report</CardTitle>
                  <CardDescription>Create a comprehensive health report to share with your providers</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Time Range</label>
                      <select className="w-full h-10 px-3 rounded-md border">
                        <option>Last 3 months</option>
                        <option>Last 6 months</option>
                        <option>Last year</option>
                        <option>Custom range</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Report Type</label>
                      <select className="w-full h-10 px-3 rounded-md border">
                        <option>Comprehensive</option>
                        <option>Glucose Summary</option>
                        <option>Medication Log</option>
                        <option>Custom</option>
                      </select>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full" onClick={handleGenerateReport}>
                    Generate Report
                  </Button>
                </CardFooter>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Recent Reports</CardTitle>
                  <CardDescription>Previously generated medical reports</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between py-2 border-b">
                      <div>
                        <p className="font-medium">Quarterly Health Summary</p>
                        <p className="text-xs text-muted-foreground">Generated on May 1, 2025</p>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="ghost">
                          <FileText className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="ghost">
                          <Share2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between py-2 border-b">
                      <div>
                        <p className="font-medium">Medication Effectiveness Report</p>
                        <p className="text-xs text-muted-foreground">Generated on April 15, 2025</p>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="ghost">
                          <FileText className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="ghost">
                          <Share2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ProviderPortal;
