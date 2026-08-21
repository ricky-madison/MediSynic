
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface GlucoseChartProps {
  data: Array<{
    name: string;
    value: number;
  }>;
}

const GlucoseChart: React.FC<GlucoseChartProps> = ({ data }) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Glucose Trends</CardTitle>
            <CardDescription>Your glucose metrics over the past week</CardDescription>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className="flex items-center">
              <span className="h-3 w-3 rounded-full bg-blue-500 mr-1"></span>
              mg/dL
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" stroke="#888" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#888" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  borderRadius: '8px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  border: '1px solid #f0f0f0'
                }} 
              />
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke="#4f46e5" 
                strokeWidth={3}
                dot={{ strokeWidth: 2 }} 
                activeDot={{ r: 6, strokeWidth: 0 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default GlucoseChart;
