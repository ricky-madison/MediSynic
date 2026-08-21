
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import FadeIn from '@/components/FadeIn';
import { Shield, Award, Users, BookOpen, Medal, Sparkles, Clock, HeartPulse } from 'lucide-react';

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-28 pb-20">
        <div className="container-tight">
          <FadeIn delay={100} className="text-center mb-12">
            <span className="chip chip-blue mb-4">About MediSynic</span>
            <h1 className="text-3xl md:text-4xl font-bold mb-6 text-medical-gray-900">
              Personalized Health Intelligence
            </h1>
            <p className="text-lg text-medical-gray-600 max-w-2xl mx-auto">
              We're on a mission to revolutionize healthcare through personalized analytics and actionable insights.
            </p>
          </FadeIn>
          
          {/* Mission & Vision */}
          <FadeIn delay={200} className="mb-16">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="card-glass">
                <div className="flex items-start">
                  <div className="p-3 rounded-xl mr-4 bg-medical-blue-light">
                    <Shield className="w-6 h-6 text-medical-blue" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold mb-2 text-medical-gray-900">Our Mission</h2>
                    <p className="text-medical-gray-600">
                      To empower individuals with personalized health insights, making preventive healthcare accessible and actionable for everyone, regardless of their medical background.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="card-glass">
                <div className="flex items-start">
                  <div className="p-3 rounded-xl mr-4 bg-medical-green-light">
                    <Sparkles className="w-6 h-6 text-medical-green" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold mb-2 text-medical-gray-900">Our Vision</h2>
                    <p className="text-medical-gray-600">
                      A world where preventable health conditions are identified early, where personalized medicine is the standard, and where everyone has the tools to optimize their wellbeing.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </FadeIn>
          
          {/* Core Values */}
          <FadeIn delay={300} className="mb-16">
            <h2 className="text-2xl font-bold mb-8 text-center text-medical-gray-900">Our Core Values</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  icon: <Award className="h-8 w-8 text-medical-blue" />,
                  title: "Excellence",
                  description: "We are committed to excellence in everything we do, from data accuracy to user experience."
                },
                {
                  icon: <Users className="h-8 w-8 text-medical-blue" />,
                  title: "Accessibility",
                  description: "We believe quality healthcare insights should be accessible to everyone, everywhere."
                },
                {
                  icon: <Shield className="h-8 w-8 text-medical-blue" />,
                  title: "Privacy",
                  description: "Your health data is yours. We protect it with the highest security standards."
                },
                {
                  icon: <BookOpen className="h-8 w-8 text-medical-blue" />,
                  title: "Innovation",
                  description: "We continuously evolve our approach based on the latest medical research."
                }
              ].map((value, index) => (
                <div key={index} className="card-glass flex flex-col items-center text-center p-8">
                  <div className="mb-4 p-4 rounded-full bg-medical-blue-light/30">
                    {value.icon}
                  </div>
                  <h3 className="text-lg font-semibold mb-2 text-medical-gray-900">{value.title}</h3>
                  <p className="text-medical-gray-600 text-sm">{value.description}</p>
                </div>
              ))}
            </div>
          </FadeIn>
          
          {/* Team Section */}
          <FadeIn delay={400} className="mb-16">
            <h2 className="text-2xl font-bold mb-8 text-center text-medical-gray-900">Our Expert Team</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  name: "Dr. Sarah Johnson",
                  role: "Chief Medical Officer",
                  bio: "Harvard-trained physician with 15+ years in preventive medicine and digital health."
                },
                {
                  name: "Michael Chen, PhD",
                  role: "Head of AI & Research",
                  bio: "Former Stanford AI researcher specializing in health data analytics and predictive modeling."
                },
                {
                  name: "Dr. Robert Williams",
                  role: "Clinical Advisory Director",
                  bio: "Board-certified internist focused on translating complex medical data into actionable insights."
                }
              ].map((member, index) => (
                <div key={index} className="card-glass text-center">
                  <div className="w-24 h-24 rounded-full bg-medical-gray-200 mx-auto mb-4 flex items-center justify-center">
                    <Users className="h-10 w-10 text-medical-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-medical-gray-900">{member.name}</h3>
                  <p className="text-medical-blue font-medium text-sm mb-2">{member.role}</p>
                  <p className="text-medical-gray-600 text-sm">{member.bio}</p>
                </div>
              ))}
            </div>
          </FadeIn>
          
          {/* Credibility Markers */}
          <FadeIn delay={500}>
            <div className="card-glass bg-gradient-to-r from-medical-blue-light/30 to-medical-blue-light/10">
              <div className="flex flex-col md:flex-row items-center justify-between">
                <div className="md:w-7/12 mb-6 md:mb-0 md:pr-8">
                  <h2 className="text-2xl font-bold mb-4 text-medical-gray-900">Backed by Science</h2>
                  <p className="text-medical-gray-600 mb-4">
                    Our recommendations are based on peer-reviewed medical studies and clinical guidelines from trusted institutions.
                  </p>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                      <Medal className="h-5 w-5 text-medical-blue mr-2" />
                      <span className="text-sm font-medium">ISO 27001 Certified</span>
                    </div>
                    <div className="flex items-center">
                      <HeartPulse className="h-5 w-5 text-medical-blue mr-2" />
                      <span className="text-sm font-medium">HIPAA Compliant</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-5 w-5 text-medical-blue mr-2" />
                      <span className="text-sm font-medium">24/7 Support</span>
                    </div>
                  </div>
                </div>
                <div className="md:w-5/12 grid grid-cols-2 gap-3">
                  {["National Institutes of Health", "Mayo Clinic", "Cleveland Clinic", "Johns Hopkins"].map((partner, index) => (
                    <div key={index} className="bg-white rounded-lg p-3 text-center shadow-sm">
                      <p className="text-xs font-medium text-medical-gray-600">Referenced by</p>
                      <p className="text-sm font-semibold text-medical-gray-900">{partner}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default About;
