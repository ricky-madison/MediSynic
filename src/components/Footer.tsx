
import React from 'react';
import { Link } from 'react-router-dom';
import { Github, Twitter, Linkedin, Mail, Heart } from 'lucide-react';
import { cn } from '@/lib/utils';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-background py-12 border-t border-border">
      <div className="container-tight">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo & About */}
          <div className="col-span-1 md:col-span-2">
            <Link 
              to="/" 
              className="text-xl md:text-2xl font-bold text-foreground flex items-center mb-4"
            >
              <span className="text-primary mr-1">Medi</span>
              <span className="text-foreground">Synic</span>
            </Link>
            <p className="text-muted-foreground mb-4 max-w-md">
              Precision oncology and gene-therapy surveillance between clinic visits. Clinical decision support only — never a replacement for your oncology team.
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
            <h3 className="font-semibold text-foreground mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <FooterLink to="/">Home</FooterLink>
              <FooterLink to="/about">About</FooterLink>
              <FooterLink to="/form">Oncology intake</FooterLink>
              <FooterLink to="/dashboard">Dashboard</FooterLink>
              <FooterLink to="/recommendations">Care actions</FooterLink>
              <FooterLink to="/oncyra">Oncyra import</FooterLink>
            </ul>
          </div>
          
          {/* Resources */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Resources</h3>
            <ul className="space-y-2">
              <FooterLink to="/toxicity">CTCAE grading</FooterLink>
              <FooterLink to="/metabolic">Metabolic monitor</FooterLink>
              <FooterLink to="/privacy-policy">Privacy policy</FooterLink>
              <FooterLink to="#">Terms of Use</FooterLink>
              <FooterLink to="#">Contact Us</FooterLink>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-border mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="text-sm text-muted-foreground mb-4 md:mb-0">
            © {currentYear} MediSynic. All rights reserved.
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <span>Made with</span>
            <Heart size={14} className="mx-1 text-red-500" />
            <span>for patients in active cancer treatment</span>
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
      className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-all duration-300"
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
        className="text-muted-foreground hover:text-primary transition-colors duration-300"
      >
        {children}
      </Link>
    </li>
  );
};

export default Footer;
