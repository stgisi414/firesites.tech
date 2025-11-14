import React from 'react';
import type { AppState } from '../types';
import { MainHeader } from './MainHeader';

interface CaseStudiesPageProps {
  appState: AppState;
  onStartProject: () => void;
  onLogoClick: () => void;
  onGoToServices: () => void;
  onGoToPricing: () => void;
  onGoToAbout: () => void;
  onGoToContact: () => void;
}

// Define the case studies
const caseStudies = [
  {
    icon: "smart_toy",
    title: "Case Study 1: AI-Powered Conversational Sales",
    subtitle: "Engaging Chatbots that Build Confidence and Drive Conversions",
    description: "A well-configured chatbot does more than answer questions. It guides users through your sales funnel, builds trust by providing instant, accurate information, and proactively engages customers to increase purchase confidence and conversion rates.",
    imageUrl: "/casestudy_1.png"
  },
  {
    icon: "edit_document",
    title: "Case Study 2: Automated Workflow Acceleration",
    subtitle: "Configurable Content Generation for Any Industry",
    description: "We've helped clients reclaim thousands of hours. By configuring fine-tuned AI models, we automate everything from marketing copy and legal document summaries to code generation and data analysis, speeding up workflows tremendously across a plethora of fields.",
    imageUrl: "/casestudy_2.png"
  },
  {
    icon: "webhook",
    title: "Case Study 3: Custom Full-Stack Management Systems",
    subtitle: "Total Control with a Full-Stack FIRE Application",
    description: "The FIRE stack (Fast, Intelligent, React, Engine) allows for complete customization of your entire business workflow. We build technology-based management systems from scratch, giving you a tailor-made platform that manages your operations, data, and team exactly how you want.",
    imageUrl: "/casestudy_3.png"
  }
];

export const CaseStudies: React.FC<CaseStudiesPageProps> = ({
  appState,
  onStartProject, 
  onLogoClick, 
  onGoToServices, 
  onGoToPricing,
  onGoToAbout,
  onGoToContact
}) => {
  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden text-white bg-background-dark font-display antialiased">
      {/* Background Glow */}
      <div className="absolute inset-0 z-0">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[150%] h-[100%] sm:w-[120%] sm:h-[80%] md:w-[100%] md:h-[70%] bg-primary/20 rounded-full blur-3xl filter opacity-30"></div>
      </div>
      
      <div className="relative z-10 flex h-full grow flex-col">
        <MainHeader
          appState={appState}
          onLogoClick={onLogoClick} // Or onLogoClick={() => {}} if you want it to do nothing on landing
          onGoToServices={onGoToServices}
          onGoToPricing={onGoToPricing}
          onGoToCaseStudies={onGoToCaseStudies}
          onGoToAbout={onGoToAbout}
          onGoToContact={onGoToContact}
          onStartProject={onStartProject}
        />

        {/* Main Content */}
        <main className="flex-1">
          {/* Hero Section */}
          <section className="w-full px-4 md:px-10 lg:px-20 py-20 sm:py-28 text-center">
            <div className="mx-auto flex max-w-4xl flex-col items-center">
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black leading-tight tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-400">Case Studies in Action</h1>
              <p className="mt-6 max-w-2xl text-lg md:text-xl text-gray-400">See how we've helped businesses like yours leverage AI and custom web applications to achieve their goals.</p>
            </div>
          </section>

          {/* Case Studies Section */}
          <section className="w-full px-4 md:px-10 lg:px-20 py-16 sm:py-24">
            <div className="mx-auto max-w-7xl flex flex-col gap-24">
              
              {caseStudies.map((study, index) => (
                <div 
                  key={study.title} 
                  className={`grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-16 items-center`}
                >
                  {/* Text Content */}
                  <div className={`flex flex-col ${index % 2 === 1 ? 'lg:order-2' : ''}`}>
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-primary text-3xl">{study.icon}</span>
                      <h2 className="text-3xl font-bold tracking-tight">{study.title}</h2>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-300 mt-2">{study.subtitle}</h3>
                    <p className="text-lg text-gray-400 mt-6">{study.description}</p>
                    <button 
                      onClick={onStartProject}
                      className="flex items-center justify-center w-full sm:w-auto h-12 px-8 text-base font-bold text-white bg-primary rounded-lg hover:bg-orange-600 transition-colors mt-8"
                    >
                      Start a Project Like This
                    </button>
                  </div>
                  
                  {/* Image */}
                  <div className={`flex items-center justify-center ${index % 2 === 1 ? 'lg:order-1' : ''}`}>
                    <img 
                      src={study.imageUrl} 
                      alt={study.title} 
                      className="w-full h-auto rounded-xl border border-white/10 bg-surface-dark"
                    />
                  </div>
                </div>
              ))}

            </div>
          </section>
        </main>

        {/* Footer */}
        <footer className="w-full px-4 md:px-10 lg:px-20 py-8 mt-16 border-t border-white/10">
          <div className="mx-auto max-w-7xl text-center">
            <p className="text-sm text-gray-500">© 2025 FIRE Solutions. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </div>
  );
};