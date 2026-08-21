
import React, { useState } from 'react';
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

const SecurityReport = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [reportType, setReportType] = useState('data-breach');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    
    // In a real app, we would send this data to an API
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
      toast({
        title: "Report submitted",
        description: "Thank you for helping us improve our security.",
      });
    }, 1500);
  };

  if (submitted) {
    return (
      <div className="container max-w-2xl py-12">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold">Report Received</h2>
          <p className="text-muted-foreground">
            Thank you for submitting your security concern. Our team has been notified and will investigate promptly.
          </p>
          <p className="text-sm text-muted-foreground mt-4">
            Report ID: SEC-{Math.floor(Math.random() * 1000000).toString().padStart(6, '0')}
          </p>
          <Button 
            onClick={() => {
              setSubmitted(false);
              setName('');
              setEmail('');
              setDescription('');
            }}
            className="mt-6"
          >
            Submit Another Report
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-2xl py-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Report Security Concern</h1>
        <p className="text-muted-foreground mt-2">
          Help us improve our security by reporting potential issues
        </p>
      </div>
      
      <Separator />
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Your Information</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input 
                id="name" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                placeholder="John Doe"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                placeholder="john.doe@example.com"
                required
              />
            </div>
          </div>
        </div>
        
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Concern Details</h2>
          
          <div className="space-y-2">
            <Label htmlFor="report-type">Type of Report</Label>
            <select 
              id="report-type"
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
              required
            >
              <option value="data-breach">Potential Data Breach</option>
              <option value="vulnerability">Security Vulnerability</option>
              <option value="phishing">Phishing Attempt</option>
              <option value="account">Unauthorized Account Access</option>
              <option value="other">Other Security Concern</option>
            </select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea 
              id="description" 
              value={description} 
              onChange={(e) => setDescription(e.target.value)} 
              placeholder="Please provide as much detail as possible about your security concern..."
              className="min-h-[150px]"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="attachments">Attachments (Optional)</Label>
            <Input 
              id="attachments" 
              type="file" 
              multiple
            />
            <p className="text-sm text-muted-foreground">
              You can upload screenshots or other evidence related to your report.
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <input 
            type="checkbox" 
            id="consent" 
            className="h-4 w-4 border-gray-300 rounded"
            required
          />
          <Label htmlFor="consent" className="text-sm">
            I understand that submitting this form will share my contact information with the security team, 
            who may contact me for additional information.
          </Label>
        </div>
        
        <Button type="submit" className="w-full" disabled={submitting}>
          {submitting ? "Submitting..." : "Submit Security Report"}
        </Button>
      </form>
    </div>
  );
};

export default SecurityReport;
