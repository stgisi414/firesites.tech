import React from 'react';
import type { AppState } from '../types';
import { MainHeader } from './MainHeader';

interface ServicesPageProps {
  appState: AppState;
  onStartProject: () => void;
  onLogoClick: () => void;
  onGoToPricing: () => void;
  onGoToCaseStudies: () => void;
  onGoToAbout: () => void;
  onGoToContact: () => void;
}

// Define the steps for the development process
const serviceSteps = [
  {
    icon: "design_services",
    title: "1. Design & Discovery",
    description: "We start with a deep dive into your vision. We'll map out user flows, create wireframes, and design a stunning UI, ensuring the final product is both beautiful and intuitive."
  },
  {
    icon: "foundation",
    title: "2. Fast Foundation (F)",
    description: "We configure the core serverless architecture. This includes setting up secure user authentication, a scalable NoSQL database, and the cloud hosting environment for blazing-fast performance."
  },
  {
    icon: "devices",
    title: "3. React UI (R)",
    description: "Our team programs the client-side of your application using React & Tailwind CSS, turning the static designs into a fully responsive, interactive, and pixel-perfect web application."
  },
  {
    icon: "settings_ethernet",
    title: "4. Backend Engine (E)",
    description: "We develop your custom backend logic using Node.js/Express. This 'Engine' handles all the complex business logic, data processing, and third-party API integrations."
  },
  {
    icon: "auto_awesome",
    title: "5. Intelligent AI (I)",
    description: "This is where the magic happens. We configure and integrate Google Gemini models, building smart chatbots, content generators, or AI-powered data analysis tools specific to your needs."
  },
  {
    icon: "rocket_launch",
    title: "6. Deploy & Iterate",
    description: "After rigorous testing, we deploy your solution to the world. We monitor its performance and work with you to plan future updates, ensuring your app continues to evolve with your business."
  }
];

export const Services: React.FC<ServicesPageProps> = ({ onStartProject, onLogoClick, onGoToPricing, onGoToCaseStudies, onGoToAbout, onGoToContact, appState }) => {
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
          <section className="w-full px-4 md:px-10 lg:px-20 py-20 sm:py-28">
            <div className="mx-auto max-w-4xl flex flex-col items-center text-center">
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-black leading-tight tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-400">Our Full-Stack Process</h1>
              <p className="mt-6 max-w-2xl text-lg md:text-xl text-gray-400">
                From a simple idea to a fully deployed, AI-powered web application. Here's how we build your custom FIRE Stack solution from scratch.
              </p>
            </div>
            
            {/* MVP Promise Callout */}
            <div className="max-w-4xl mx-auto mt-16 p-8 bg-surface-dark rounded-xl border border-primary/50 glow-effect text-center">
              <span className="material-symbols-outlined text-primary text-5xl">timer</span>
              <h3 className="text-3xl font-bold text-white mt-4">Rapid MVP Delivery</h3>
              <p className="text-lg text-gray-300 mt-2 max-w-xl mx-auto">
                Our efficient process allows us to deliver a functional, high-quality <b>Minimum Viable Product (MVP)</b> for semi-complex projects within <b>3-5 business days</b>.
              </p>
            </div>

            {/* Steps Grid */}
            <div className="mx-auto max-w-7xl mt-24">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {serviceSteps.map((step) => (
                  <div key={step.title} className="flex flex-col p-8 bg-surface-dark rounded-xl border border-white/10">
                    <div className="flex items-center justify-center h-16 w-16 rounded-full bg-primary/10 text-primary mb-6">
                      <span className="material-symbols-outlined text-3xl">{step.icon}</span>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">{step.title}</h3>
                    <p className="text-gray-400">{step.description}</p>
                  </div>
                ))}
              </div>
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