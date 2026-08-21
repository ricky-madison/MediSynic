
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, Activity, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";

const HealthMetricsPanel = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Health Metrics</CardTitle>
        <CardDescription>Your latest health measurements</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Heart className="mr-2 h-5 w-5 text-red-500" />
              <div>
                <p className="text-sm font-medium">Heart Rate</p>
                <p className="text-xs text-muted-foreground">Last updated 3h ago</p>
              </div>
            </div>
            <div className="text-lg font-bold">72 bpm</div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Activity className="mr-2 h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm font-medium">Blood Pressure</p>
                <p className="text-xs text-muted-foreground">Last updated 5h ago</p>
              </div>
            </div>
            <div className="text-lg font-bold">120/80</div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <TrendingUp className="mr-2 h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm font-medium">Steps</p>
                <p className="text-xs text-muted-foreground">Today</p>
              </div>
            </div>
            <div className="text-lg font-bold">6,240</div>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="outline" size="sm" className="w-full">View All Metrics</Button>
      </CardFooter>
    </Card>
  );
};

export default HealthMetricsPanel;
