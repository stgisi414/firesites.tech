import React from 'react';
import type { AppState } from '../types';
import { MainHeader } from './MainHeader';

interface LandingPageProps {
  appState: AppState;
  onStartProject: () => void;
  hasExistingChat: boolean;
  onGoToChat: () => void;
  onLogoClick: () => void;
  onGoToServices: () => void;
  onGoToPricing: () => void;
  onGoToCaseStudies: () => void;
  onGoToAbout: () => void;
  onGoToContact: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ 
  appState,
  onStartProject, 
  hasExistingChat,
  onGoToChat,
  onLogoClick,
  onGoToServices,
  onGoToPricing,
  onGoToCaseStudies,
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
          {/* ⬇️ REPLACED THIS ENTIRE SECTION ⬇️ */}
          {/* HERO SECTION with VIDEO BACKGROUND */}
          <section className="relative w-full overflow-hidden"> 
            
            {/* Video Background */}
            <div className="absolute inset-0 w-full h-full">
              <video
                src="/landing_video.mp4"
                autoPlay
                loop
                muted
                playsInline
                className="absolute inset-0 w-full h-full object-cover"
              />
              {/* Dark overlay for text readability */}
              <div className="absolute inset-0 bg-black/60" />
            </div>
            
            {/* Text Content (z-10 to be on top) */}
            {/* Added original padding here */}
            <div className="relative z-10 w-full px-4 md:px-10 lg:px-20 py-20 sm:py-28 text-center">
              <div className="mx-auto flex max-w-4xl flex-col items-center">
                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black leading-tight tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-400">Ignite Your Digital Presence</h1>
                <p className="mt-6 max-w-2xl text-lg md:text-xl text-gray-400">We build high-performance custom web solutions that set your business on fire. From innovative apps to scalable platforms, we turn your vision into a digital masterpiece.</p>
                <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
                  <button 
                    onClick={onStartProject}
                    className="flex items-center justify-center w-full sm:w-auto h-14 px-10 text-lg font-bold text-white bg-primary rounded-lg hover:bg-orange-600 transition-all transform hover:scale-105 glow-effect"
                  >
                    Get Started Now
                  </button>
                  <a className="flex items-center justify-center w-full sm:w-auto h-14 px-10 text-lg font-bold text-white bg-white/10 rounded-lg border border-white/20 hover:bg-white/20 transition-colors" href="#">Learn More</a>
                </div>
              </div>
            </div>
            
            {/* Animated border at the bottom */}
    
            <div className="absolute bottom-0 left-0 w-full z-10">
              <div className="fire-border" />
            </div>
          </section>
          {/* ⬆️ END OF REPLACED SECTION ⬆️ */}

          <section className="w-full px-4 md:px-10 lg:px-20 py-16 sm:py-24">
            <div className="mx-auto max-w-7xl">
              <div className="flex flex-col items-center text-center mb-16">
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight">Why Choose FIRE Solutions?</h2>
                <p className="mt-4 max-w-2xl text-lg text-gray-400">We're not just developers; we're your partners in innovation, dedicated to fueling your growth.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="flex flex-col items-center text-center p-8 bg-surface-dark rounded-xl border border-white/10">
                  <div className="flex items-center justify-center h-16 w-16 rounded-full bg-primary/10 text-primary mb-6">
                    <span className="material-symbols-outlined text-3xl">bolt</span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Blazing Fast Performance</h3>
                  <p className="text-gray-400">We optimize every line of code to ensure your application runs at lightning speed, providing a seamless user experience.</p>
                </div>
                <div className="flex flex-col items-center text-center p-8 bg-surface-dark rounded-xl border border-white/10">
                  <div className="flex items-center justify-center h-16 w-16 rounded-full bg-primary/10 text-primary mb-6">
                    <span className="material-symbols-outlined text-3xl">auto_fix_high</span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Tailor-Made Solutions</h3>
                  <p className="text-gray-400">Your business is unique. We craft custom solutions from the ground up to meet your specific needs and goals.</p>
                </div>
                <div className="flex flex-col items-center text-center p-8 bg-surface-dark rounded-xl border border-white/10">
                  <div className="flex items-center justify-center h-16 w-16 rounded-full bg-primary/10 text-primary mb-6">
                    <span className="material-symbols-outlined text-3xl">rocket_launch</span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Scalable Architecture</h3>
                  <p className="text-gray-400">Built for growth, our solutions are designed to scale with your business, ensuring long-term success and reliability.</p>
                </div>
              </div>
            </div>
          </section>
        </main>

        {/* Footer */}
        <footer className="w-full px-4 md:px-10 lg:px-20 py-8 mt-16 border-t border-white/10">
          <div className="mx-auto max-w-7xl text-center">
            <p className="text-sm text-gray-500">© 2025 FIRE Solutions. All rights reserved. Let's build something amazing together.</p>
          </div>
        </footer>
      </div>
      {hasExistingChat && (
        <button
          onClick={onGoToChat}
          className="fixed bottom-8 right-8 z-50 flex h-16 w-16 items-center justify-center rounded-full bg-primary shadow-lg glow-effect transform transition-transform hover:scale-110"
          aria-label="Go to chat"
        >
          <span className="material-symbols-outlined text-white text-3xl">chat_bubble</span>
        </button>
      )}
    </div>
  );
};