
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, TrendingUp, Clock, Calendar } from "lucide-react";
import { Progress } from "@/components/ui/progress";

const QuickStatCards = () => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Health Score</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="text-2xl font-bold">78/100</div>
            <Activity className="text-blue-500 h-5 w-5" />
          </div>
          <Progress value={78} className="h-1.5 mt-3" />
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Daily Goals</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="text-2xl font-bold">4/6</div>
            <TrendingUp className="text-green-500 h-5 w-5" />
          </div>
          <Progress value={66.7} className="h-1.5 mt-3" />
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Next Medication</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="text-2xl font-bold">3:00 PM</div>
            <Clock className="text-purple-500 h-5 w-5" />
          </div>
          <p className="text-sm text-muted-foreground mt-1">Vitamin D</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Upcoming Doctor Visit</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="text-2xl font-bold">Jun 12</div>
            <Calendar className="text-red-500 h-5 w-5" />
          </div>
          <p className="text-sm text-muted-foreground mt-1">Dr. Smith</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default QuickStatCards;
