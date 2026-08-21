
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

const WeeklyGoalsPanel = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Weekly Goals</CardTitle>
        <CardDescription>Track your health achievements</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Medication Adherence</span>
              <span className="text-sm font-medium">85%</span>
            </div>
            <Progress value={85} className="h-2" />
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Daily Exercise</span>
              <span className="text-sm font-medium">60%</span>
            </div>
            <Progress value={60} className="h-2" />
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Nutrition Goals</span>
              <span className="text-sm font-medium">72%</span>
            </div>
            <Progress value={72} className="h-2" />
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="outline" size="sm" className="w-full">Adjust Goals</Button>
      </CardFooter>
    </Card>
  );
};

export default WeeklyGoalsPanel;
