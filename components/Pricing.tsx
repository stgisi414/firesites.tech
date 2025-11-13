import React from 'react';
import { XIcon, FlameIcon, CodeIcon, ServerIcon, SparklesIcon, MegaphoneIcon } from './icons';

interface PricingProps {
  isOpen: boolean;
  onClose: () => void;
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
    cta: 'Let\'s Build Together',
    highlight: false,
  },
];

export const Pricing: React.FC<PricingProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div 
        className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50"
        onClick={onClose}
        role="dialog"
        aria-modal="true"
        aria-labelledby="pricing-title"
    >
      <div 
        className="bg-gray-900 rounded-xl border border-brand-primary/30 w-full max-w-5xl max-h-[90vh] overflow-y-auto p-8 relative shadow-2xl shadow-brand-primary/20"
        onClick={(e) => e.stopPropagation()}
      >
        <button 
            onClick={onClose} 
            className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
            aria-label="Close pricing modal"
        >
          <XIcon className="w-6 h-6" />
        </button>

        <div className="text-center mb-10">
            <FlameIcon className="w-12 h-12 text-brand-primary mx-auto mb-3" />
            <h2 id="pricing-title" className="text-3xl font-bold font-heading">Our Service Packages</h2>
            <p className="text-gray-400 mt-2 max-w-2xl mx-auto">Flexible pricing for projects of all sizes. Let's build something amazing together.</p>
        </div>

        <div className="mb-12 border-t border-b border-gray-700/50 py-8">
            <h3 className="text-xl font-bold font-heading text-center mb-6 text-brand-highlight">Where Your Investment Goes</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
                <div className="bg-gray-800/50 p-4 rounded-lg flex items-center">
                    <CodeIcon className="w-10 h-10 mr-4 text-brand-primary flex-shrink-0" />
                    <div>
                        <h4 className="font-semibold text-white">Expert Engineering</h4>
                        <p className="text-sm text-gray-400 mt-1">Secure, maintainable TypeScript code for a robust foundation.</p>
                    </div>
                </div>
                <div className="bg-gray-800/50 p-4 rounded-lg flex items-center">
                    <ServerIcon className="w-10 h-10 mr-4 text-brand-primary flex-shrink-0" />
                    <div>
                        <h4 className="font-semibold text-white">Scalable Hosting</h4>
                        <p className="text-sm text-gray-400 mt-1">Cloud infrastructure that grows with your user base.</p>
                    </div>
                </div>
                <div className="bg-gray-800/50 p-4 rounded-lg flex items-center">
                    <SparklesIcon className="w-10 h-10 mr-4 text-brand-primary flex-shrink-0" />
                    <div>
                        <h4 className="font-semibold text-white">AI Integration</h4>
                        <p className="text-sm text-gray-400 mt-1">Access to cutting-edge models like Google Gemini.</p>
                    </div>
                </div>
                <div className="bg-gray-800/50 p-4 rounded-lg flex items-center">
                    <MegaphoneIcon className="w-10 h-10 mr-4 text-brand-primary flex-shrink-0" />
                    <div>
                        <h4 className="font-semibold text-white">Marketing & Growth</h4>
                        <p className="text-sm text-gray-400 mt-1">Optional ad campaigns and user acquisition strategies.</p>
                    </div>
                </div>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {pricingTiers.map((tier) => (
            <div key={tier.name} className={`flex flex-col p-6 rounded-lg border ${tier.highlight ? 'border-brand-primary bg-brand-primary/5' : 'border-gray-700 bg-gray-900/50'}`}>
              <h3 className="text-2xl font-bold font-heading text-brand-highlight">{tier.name}</h3>
              <p className="mt-2 text-gray-400 flex-grow">{tier.description}</p>
              <p className="my-6">
                <span className="text-4xl font-bold">${tier.price.split('$')[1]}</span>
                <span className="text-gray-500">/ starts at</span>
              </p>
              <ul className="space-y-3 text-gray-300 mb-8">
                {tier.features.map(feature => (
                   <li key={feature} className="flex items-center">
                       <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                       {feature}
                   </li>
                ))}
              </ul>
              <button className={`w-full mt-auto font-bold py-3 px-4 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 ${tier.highlight ? 'bg-brand-primary text-white hover:bg-orange-600 focus:ring-orange-500' : 'bg-gray-700 text-white hover:bg-gray-600 focus:ring-gray-500'}`}>
                {tier.cta}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};