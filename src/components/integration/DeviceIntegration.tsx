
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { 
  Smartphone, Bluetooth, Plus, PlugZap, RefreshCw, 
  ChevronRight, Clock, Battery, CheckCircle, AlertCircle, 
  Activity, Heart
} from "lucide-react";
import { toast } from "sonner";

interface DeviceIntegrationProps {
  userId?: string;
}

// Mock connected devices
const mockConnectedDevices = [
  {
    id: 'dev1',
    name: 'Dexcom G6',
    type: 'CGM',
    connected: true,
    batteryLevel: 72,
    lastSynced: '2025-05-05T08:30:00Z',
    status: 'active'
  },
  {
    id: 'dev2',
    name: 'Fitbit Sense',
    type: 'Wearable',
    connected: true,
    batteryLevel: 45,
    lastSynced: '2025-05-05T10:15:00Z',
    status: 'active'
  },
  {
    id: 'dev3',
    name: 'Omron BP Monitor',
    type: 'Blood Pressure',
    connected: false,
    batteryLevel: 90,
    lastSynced: '2025-05-02T16:45:00Z',
    status: 'disconnected'
  }
];

// Available integrations
const availableIntegrations = [
  {
    id: 'int1',
    name: 'Apple Health',
    type: 'Health App',
    icon: '/placeholder.svg',
    connected: true,
    metrics: ['Steps', 'Heart Rate', 'Sleep', 'Workouts']
  },
  {
    id: 'int2',
    name: 'Google Fit',
    type: 'Health App',
    icon: '/placeholder.svg',
    connected: false,
    metrics: ['Steps', 'Heart Rate', 'Activity', 'Calories']
  },
  {
    id: 'int3',
    name: 'Epic MyChart',
    type: 'EHR',
    icon: '/placeholder.svg',
    connected: false,
    metrics: ['Medications', 'Lab Results', 'Appointments']
  }
];

// Helper function to format date
const formatTimeAgo = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  
  const diffMins = Math.floor(diffMs / (1000 * 60));
  if (diffMins < 60) {
    return `${diffMins} minutes ago`;
  }
  
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  if (diffHours < 24) {
    return `${diffHours} hours ago`;
  }
  
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  return `${diffDays} days ago`;
};

const DeviceIntegration: React.FC<DeviceIntegrationProps> = ({ userId }) => {
  const [devices, setDevices] = useState(mockConnectedDevices);
  const [integrations, setIntegrations] = useState(availableIntegrations);
  const [scanning, setScanning] = useState(false);
  const [syncingId, setSyncingId] = useState<string | null>(null);

  const handleScanForDevices = () => {
    setScanning(true);
    toast.info('Scanning for nearby devices...');
    
    // Simulate scanning process
    setTimeout(() => {
      setScanning(false);
      toast.success('Found 2 new devices nearby');
    }, 3000);
  };

  const handleSyncDevice = (deviceId: string) => {
    setSyncingId(deviceId);
    toast.info('Syncing data from device...');
    
    // Simulate sync process
    setTimeout(() => {
      setSyncingId(null);
      
      // Update last synced time
      setDevices(devices.map(device => 
        device.id === deviceId 
          ? { ...device, lastSynced: new Date().toISOString() }
          : device
      ));
      
      toast.success('Device synced successfully');
    }, 2500);
  };

  const handleConnectIntegration = (integrationId: string) => {
    // Simulate auth and connection process
    toast.info('Connecting to service...');
    
    setTimeout(() => {
      setIntegrations(integrations.map(integration => 
        integration.id === integrationId 
          ? { ...integration, connected: true }
          : integration
      ));
      
      toast.success('Integration connected successfully');
    }, 2000);
  };

  const handleDisconnectIntegration = (integrationId: string) => {
    // Simulate disconnection
    toast.info('Disconnecting from service...');
    
    setTimeout(() => {
      setIntegrations(integrations.map(integration => 
        integration.id === integrationId 
          ? { ...integration, connected: false }
          : integration
      ));
      
      toast.success('Integration disconnected successfully');
    }, 1500);
  };

  const handleDeviceToggle = (deviceId: string, enabled: boolean) => {
    setDevices(devices.map(device => 
      device.id === deviceId 
        ? { ...device, connected: enabled, status: enabled ? 'active' : 'disconnected' }
        : device
    ));
    
    toast.success(enabled ? 'Device connected' : 'Device disconnected');
  };

  const getDeviceStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'disconnected': return <AlertCircle className="h-4 w-4 text-amber-500" />;
      case 'error': return <AlertCircle className="h-4 w-4 text-red-500" />;
      default: return null;
    }
  };

  return (
    <Card className="shadow-md">
      <CardHeader className="bg-gradient-to-r from-cyan-50 to-blue-50 dark:from-cyan-950/40 dark:to-blue-950/40">
        <CardTitle className="flex items-center">
          <Bluetooth className="h-5 w-5 mr-2 text-blue-600 dark:text-blue-400" />
          Device & App Integration
        </CardTitle>
        <CardDescription>
          Connect your health devices and apps for automatic data synchronization
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-6">
          {/* Connected Devices Section */}
          <section className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Connected Devices</h3>
              <Button 
                variant="outline" 
                size="sm"
                disabled={scanning}
                onClick={handleScanForDevices}
              >
                {scanning ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Scanning...
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Device
                  </>
                )}
              </Button>
            </div>
            
            <div className="space-y-3">
              {devices.map(device => (
                <Card key={device.id} className="overflow-hidden">
                  <CardContent className="p-0">
                    <div className={`flex items-center justify-between p-4 ${
                      device.status === 'active' 
                        ? 'bg-green-50 dark:bg-green-950/20' 
                        : 'bg-slate-50 dark:bg-slate-950/20'
                    }`}>
                      <div className="flex items-center">
                        {device.type === 'CGM' ? (
                          <Activity className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-3" />
                        ) : device.type === 'Wearable' ? (
                          <Smartphone className="h-5 w-5 text-purple-600 dark:text-purple-400 mr-3" />
                        ) : (
                          <Heart className="h-5 w-5 text-red-600 dark:text-red-400 mr-3" />
                        )}
                        <div>
                          <div className="flex items-center">
                            <h4 className="font-medium">{device.name}</h4>
                            <Badge variant="outline" className="ml-2 text-xs">
                              {device.type}
                            </Badge>
                            <span className="ml-2" title={device.status}>
                              {getDeviceStatusIcon(device.status)}
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground">Last synced: {formatTimeAgo(device.lastSynced)}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        <div className="flex items-center">
                          <Battery className="h-4 w-4 mr-1 text-muted-foreground" />
                          <span className={`text-xs ${
                            device.batteryLevel < 20 ? 'text-red-600' : 'text-muted-foreground'
                          }`}>
                            {device.batteryLevel}%
                          </span>
                        </div>
                        <Switch 
                          checked={device.connected} 
                          onCheckedChange={(checked) => handleDeviceToggle(device.id, checked)}
                        />
                      </div>
                    </div>
                    
                    {device.connected && (
                      <div className="p-4 flex justify-between items-center">
                        <div className="flex-1 flex">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            disabled={syncingId === device.id}
                            onClick={() => handleSyncDevice(device.id)}
                            className="text-blue-600 dark:text-blue-400"
                          >
                            {syncingId === device.id ? (
                              <RefreshCw className="h-4 w-4 mr-1 animate-spin" />
                            ) : (
                              <RefreshCw className="h-4 w-4 mr-1" />
                            )}
                            Sync Now
                          </Button>
                        </div>
                        
                        <div className="flex items-center">
                          <Button variant="ghost" size="sm" className="text-muted-foreground">
                            Device Settings
                            <ChevronRight className="h-4 w-4 ml-1" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
          
          <Separator />
          
          {/* App Integrations Section */}
          <section className="space-y-4">
            <h3 className="text-lg font-medium">App Integrations</h3>
            
            <div className="space-y-3">
              {integrations.map(integration => (
                <Card key={integration.id}>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-md bg-slate-100 dark:bg-slate-800 flex items-center justify-center mr-3">
                          <img 
                            src={integration.icon} 
                            alt={integration.name} 
                            className="h-6 w-6" 
                          />
                        </div>
                        
                        <div>
                          <h4 className="font-medium">{integration.name}</h4>
                          <p className="text-xs text-muted-foreground">{integration.type}</p>
                        </div>
                      </div>
                      
                      {integration.connected ? (
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="text-red-600 border-red-200 hover:bg-red-50 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-950"
                          onClick={() => handleDisconnectIntegration(integration.id)}
                        >
                          Disconnect
                        </Button>
                      ) : (
                        <Button 
                          size="sm"
                          onClick={() => handleConnectIntegration(integration.id)}
                        >
                          Connect
                        </Button>
                      )}
                    </div>
                    
                    {integration.connected && (
                      <div className="mt-3 pt-3 border-t">
                        <p className="text-xs font-medium mb-2">Synced Data:</p>
                        <div className="flex flex-wrap gap-2">
                          {integration.metrics.map((metric, idx) => (
                            <Badge key={idx} variant="secondary" className="text-xs">
                              {metric}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        </div>
      </CardContent>
    </Card>
  );
};

export default DeviceIntegration;
