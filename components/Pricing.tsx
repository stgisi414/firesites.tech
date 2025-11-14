import React from 'react';
import type { AppState } from '../types';
import { MainHeader } from './MainHeader';
import { CodeIcon, ServerIcon, SparklesIcon, MegaphoneIcon } from './icons'; // Keep using the existing icons

interface PricingPageProps {
  appState: AppState;
  onStartProject: () => void;
  onLogoClick: () => void;
  onGoToServices: () => void;
  onGoToCaseStudies: () => void;
  onGoToAbout: () => void;
  onGoToContact: () => void;
}

const pricingTiers = [
  {
    name: 'Ignite AI',
    price: '$5,000',
    description: 'For existing businesses looking to integrate AI capabilities.',
    features: [
      'AI Assistant Integration',
      'AI Content Generation',
      'AI-Powered Data Analysis',
      'Fine-tuning & Deployment'
    ],
    cta: 'Get a Custom Quote',
    highlight: false,
  },
  {
    name: 'Blaze Platform',
    price: '$15,000',
    description: 'For complex, data-heavy applications and interactive platforms.',
    features: [
      'Real-Time Dashboards',
      'Interactive Community Features',
      'Complex Data Simulations',
      'Custom API Development'
    ],
    cta: 'Get a Custom Quote',
    highlight: true,
  },
  {
    name: 'Inferno Studio',
    price: '$30,000',
    description: 'Our all-in-one "Startup Studio" package to go from idea to launch.',
    features: [
      'Full-Stack SaaS Development',
      'Complete UI/UX Design',
      'Serverless Architecture',
      'Stripe Payment Integration'
    ],
    cta: 'Get a Custom Quote',
    highlight: false,
  },
];

const investmentFeatures = [
    {
        icon: <CodeIcon className="w-10 h-10 text-primary" />,
        title: "Expert Engineering",
        description: "Secure, maintainable TypeScript code for a robust foundation."
    },
    {
        icon: <ServerIcon className="w-10 h-10 text-primary" />,
        title: "Scalable Hosting",
        description: "Cloud infrastructure that grows with your user base."
    },
    {
        icon: <SparklesIcon className="w-10 h-10 text-primary" />,
        title: "AI Integration",
        description: "Access to cutting-edge models like Google Gemini."
    },
    {
        icon: <MegaphoneIcon className="w-10 h-10 text-primary" />,
        title: "Marketing & Growth",
        description: "Optional ad campaigns and user acquisition strategies."
    }
];

export const Pricing: React.FC<PricingPageProps> = ({ onStartProject, onLogoClick, onGoToServices, onGoToCaseStudies, onGoToAbout, onGoToContact, appState }) => {
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
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black leading-tight tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-400">Transparent Pricing</h1>
              <p className="mt-6 max-w-2xl text-lg md:text-xl text-gray-400">Flexible packages for projects of all sizes. No hidden fees. Just pure, unadulterated value to fuel your growth.</p>
            </div>
          </section>

          {/* Pricing Tiers Section */}
          <section className="w-full px-4 md:px-10 lg:px-20 py-16 sm:py-24">
            <div className="mx-auto max-w-7xl">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {pricingTiers.map((tier) => (
                  <div 
                    key={tier.name} 
                    className={`flex flex-col p-8 rounded-xl border ${tier.highlight ? 'border-primary bg-surface-dark glow-effect' : 'border-white/10 bg-surface-dark'}`}
                  >
                    <h3 className="text-2xl font-bold text-white">{tier.name}</h3>
                    <p className="mt-2 text-gray-400 flex-grow">{tier.description}</p>
                    <p className="my-6">
                      <span className="text-4xl font-bold">${tier.price.split('$')[1]}</span>
                      <span className="text-gray-500"> / starts at</span>
                    </p>
                    <ul className="space-y-3 text-gray-300 mb-8">
                      {tier.features.map(feature => (
                        <li key={feature} className="flex items-center">
                          <span className="material-symbols-outlined text-primary text-xl mr-2">check_circle</span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <button 
                      onClick={onStartProject}
                      className={`w-full mt-auto font-bold py-3 px-4 rounded-lg transition-colors ${tier.highlight ? 'bg-primary text-white hover:bg-orange-600' : 'bg-white/10 text-white hover:bg-white/20'}`}
                    >
                      {tier.cta}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* "Where your investment goes" Section */}
          <section className="w-full px-4 md:px-10 lg:px-20 py-16 sm:py-24">
            <div className="mx-auto max-w-7xl">
              <div className="flex flex-col items-center text-center mb-16">
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight">Where Your Investment Goes</h2>
                <p className="mt-4 max-w-2xl text-lg text-gray-400">Our pricing is comprehensive, covering every stage of development.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {investmentFeatures.map((feat) => (
                  <div key={feat.title} className="flex flex-col items-center text-center p-8 bg-surface-dark rounded-xl border border-white/10">
                    <div className="flex items-center justify-center h-16 w-16 rounded-full bg-primary/10 text-primary mb-6">
                      {feat.icon}
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">{feat.title}</h3>
                    <p className="text-gray-400">{feat.description}</p>
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