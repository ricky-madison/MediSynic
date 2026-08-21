
import React from 'react';
import { Link } from 'react-router-dom';
import { Separator } from "@/components/ui/separator";

const PrivacyPolicy = () => {
  return (
    <div className="container max-w-4xl py-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Privacy Policy</h1>
        <p className="text-muted-foreground mt-2">
          How we protect your data and comply with regulations
        </p>
      </div>
      
      <Separator />
      
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">1. Data Protection</h2>
        <p>
          MediSynic is committed to protecting your personal health information. We implement robust encryption 
          protocols and security measures to ensure your data is secure:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>All data is encrypted at rest and in transit</li>
          <li>We use industry-standard SSL/TLS encryption for all communications</li>
          <li>Personal health information is encrypted using AES-256 encryption</li>
          <li>Access to your data is strictly controlled and monitored</li>
        </ul>
      </section>
      
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">2. HIPAA Compliance</h2>
        <p>
          MediSynic is designed with HIPAA (Health Insurance Portability and Accountability Act) 
          compliance in mind:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>We maintain audit logs of all data access</li>
          <li>We implement technical safeguards as required by the HIPAA Security Rule</li>
          <li>We have policies and procedures in place for breach notification</li>
          <li>We provide the ability to export and delete your data upon request</li>
        </ul>
      </section>
      
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">3. GDPR Compliance</h2>
        <p>
          For our users in the European Union, MediSynic complies with the General Data Protection 
          Regulation (GDPR):
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>You have the right to access your personal data</li>
          <li>You have the right to correct inaccurate personal data</li>
          <li>You have the right to request deletion of your personal data</li>
          <li>You have the right to restrict or object to processing</li>
          <li>You have the right to data portability</li>
        </ul>
      </section>
      
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">4. Data Retention</h2>
        <p>
          We retain your personal information only as long as necessary to provide you with our services 
          and as required by law:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Health data is retained for the duration of your account plus 2 years</li>
          <li>Account data is retained until you delete your account</li>
          <li>Anonymized analytical data may be retained indefinitely for research purposes</li>
        </ul>
      </section>
      
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">5. Your Rights</h2>
        <p>
          You have control over your data. At any time, you can:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Review and download all your data</li>
          <li>Request deletion of your account and associated data</li>
          <li>Opt out of non-essential data processing</li>
          <li>Report a security concern or data breach</li>
        </ul>
        <div className="mt-4 flex flex-col sm:flex-row gap-4">
          <Link to="/user-data" className="bg-primary text-white px-4 py-2 rounded hover:bg-primary/90">
            Manage Your Data
          </Link>
          <Link to="/security-report" className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">
            Report Security Concern
          </Link>
        </div>
      </section>
      
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">6. Contact Us</h2>
        <p>
          If you have any questions about our privacy practices or your rights, please contact our 
          Data Protection Officer:
        </p>
        <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded">
          <p><strong>Email:</strong> privacy@medisynic.com</p>
          <p><strong>Address:</strong> MediSynic Inc., 123 Health Street, San Francisco, CA 94103</p>
        </div>
      </section>
      
      <div className="mt-6 pt-4 border-t text-sm text-muted-foreground">
        <p>Last updated: May 5, 2025</p>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
