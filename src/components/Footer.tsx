
import React from 'react';
import { Link } from 'react-router-dom';
import { Github, Twitter, Linkedin, Mail, Heart } from 'lucide-react';
import { cn } from '@/lib/utils';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-white py-12 border-t border-medical-gray-200">
      <div className="container-tight">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo & About */}
          <div className="col-span-1 md:col-span-2">
            <Link 
              to="/" 
              className="text-xl md:text-2xl font-bold text-medical-gray-900 flex items-center mb-4"
            >
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent mr-1">Medi</span>
              <span className="text-medical-gray-900 dark:text-white">Synic</span>
            </Link>
            <p className="text-medical-gray-600 mb-4 max-w-md">
              Personalized health recommendations powered by advanced analytics and medical research. Making preventive healthcare accessible and actionable.
            </p>
            <div className="flex space-x-4">
              <SocialIcon icon={<Twitter size={18} />} />
              <SocialIcon icon={<Linkedin size={18} />} />
              <SocialIcon icon={<Github size={18} />} />
              <SocialIcon icon={<Mail size={18} />} />
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-medical-gray-900 mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <FooterLink to="/">Home</FooterLink>
              <FooterLink to="/about">About</FooterLink>
              <FooterLink to="/form">Health Assessment</FooterLink>
              <FooterLink to="/dashboard">Dashboard</FooterLink>
              <FooterLink to="/recommendations">Recommendations</FooterLink>
            </ul>
          </div>
          
          {/* Resources */}
          <div>
            <h3 className="font-semibold text-medical-gray-900 mb-4">Resources</h3>
            <ul className="space-y-2">
              <FooterLink to="#">Health Articles</FooterLink>
              <FooterLink to="#">FAQ</FooterLink>
              <FooterLink to="#">Privacy Policy</FooterLink>
              <FooterLink to="#">Terms of Use</FooterLink>
              <FooterLink to="#">Contact Us</FooterLink>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-medical-gray-200 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="text-sm text-medical-gray-500 mb-4 md:mb-0">
            © {currentYear} MediSynic. All rights reserved.
          </div>
          <div className="flex items-center text-sm text-medical-gray-500">
            <span>Made with</span>
            <Heart size={14} className="mx-1 text-red-500" />
            <span>for better health outcomes</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

const SocialIcon: React.FC<{ icon: React.ReactNode }> = ({ icon }) => {
  return (
    <a 
      href="#" 
      className="w-8 h-8 rounded-full bg-medical-gray-100 flex items-center justify-center text-medical-gray-600 hover:bg-medical-blue hover:text-white transition-all duration-300"
    >
      {icon}
    </a>
  );
};

const FooterLink: React.FC<{ to: string; children: React.ReactNode }> = ({ to, children }) => {
  return (
    <li>
      <Link 
        to={to} 
        className="text-medical-gray-600 hover:text-medical-blue transition-colors duration-300"
      >
        {children}
      </Link>
    </li>
  );
};

export default Footer;
