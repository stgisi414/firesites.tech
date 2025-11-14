import React, { useState } from 'react';
import type { AppState } from '../types';

interface HeaderProps {
  appState: AppState;
  onLogoClick: () => void;
  onGoToServices: () => void;
  onGoToPricing: () => void;
  onGoToCaseStudies: () => void;
  onGoToAbout: () => void;
  onGoToContact: () => void;
  onStartProject: () => void;
}

// Helper component for nav links to avoid repetition
const NavLink: React.FC<{
  onClick: () => void;
  isActive: boolean;
  isMobile?: boolean;
  children: React.ReactNode;
}> = ({ onClick, isActive, isMobile, children }) => {
  const baseStyle = "transition-colors w-full md:w-auto text-left";
  const mobileStyle = "text-lg font-medium p-3 rounded-lg";
  const desktopStyle = "text-sm font-medium";
  
  const activeStyle = isActive ? "text-primary font-bold" : "text-gray-300 hover:text-primary";
  const mobileActiveStyle = isActive ? "text-primary bg-secondary-dark" : "text-gray-300 hover:bg-secondary-dark";

  return (
    <button
      onClick={onClick}
      className={`${baseStyle} ${isMobile ? mobileStyle : desktopStyle} ${isMobile ? mobileActiveStyle : activeStyle}`}
    >
      {children}
    </button>
  );
};

export const MainHeader: React.FC<HeaderProps> = ({
  appState,
  onLogoClick,
  onGoToServices,
  onGoToPricing,
  onGoToCaseStudies,
  onGoToAbout,
  onGoToContact,
  onStartProject
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const closeMenu = (navFunc: () => void) => {
    setIsMenuOpen(false);
    // Give React time to process the state update *before* navigating
    setTimeout(() => {
      navFunc();
    }, 0); // 0ms delay pushes it to the next event loop tick
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-background-dark/80 backdrop-blur-sm">
      <div className="mx-auto flex max-w-7xl flex-col px-4 md:px-10 lg:px-20">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <button onClick={() => closeMenu(onLogoClick)} className="flex items-center gap-3 text-white">
            <img src="/logo.jpg" alt="FIRE Solutions Logo" className="h-8 w-8 rounded-full" />
            <h2 className="text-white text-xl font-bold leading-tight tracking-[-0.015em]">FIRE Solutions</h2>
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <NavLink onClick={onGoToServices} isActive={appState === 'services'}>Services</NavLink>
            <NavLink onClick={onGoToPricing} isActive={appState === 'pricing'}>Pricing</NavLink>
            <NavLink onClick={onGoToCaseStudies} isActive={appState === 'caseStudies'}>Case Studies</NavLink>
            <NavLink onClick={onGoToAbout} isActive={appState === 'about'}>About</NavLink>
            <NavLink onClick={onGoToContact} isActive={appState === 'contact'}>Contact</NavLink>
          </nav>

          {/* Desktop Start Project Button */}
          <button 
            onClick={() => closeMenu(onStartProject)}
            className="hidden md:flex items-center justify-center h-10 px-6 text-sm font-bold text-white bg-primary rounded-lg hover:bg-orange-600 transition-colors"
          >
            <span>Start Project</span>
          </button>

          {/* Mobile Menu Button */}
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-md hover:bg-secondary-dark"
            aria-label="Toggle menu"
          >
            <span className="material-symbols-outlined text-white">
              {isMenuOpen ? 'close' : 'menu'}
            </span>
          </button>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMenuOpen && (
          <div className="md:hidden flex flex-col gap-2 py-4 border-t border-white/10">
            <NavLink onClick={() => closeMenu(onGoToServices)} isActive={appState === 'services'} isMobile>Services</NavLink>
            <NavLink onClick={() => closeMenu(onGoToPricing)} isActive={appState === 'pricing'} isMobile>Pricing</NavLink>
            <NavLink onClick={() => closeMenu(onGoToCaseStudies)} isActive={appState === 'caseStudies'} isMobile>Case Studies</NavLink>
            <NavLink onClick={() => closeMenu(onGoToAbout)} isActive={appState === 'about'} isMobile>About</NavLink>
            <NavLink onClick={() => closeMenu(onGoToContact)} isActive={appState === 'contact'} isMobile>Contact</NavLink>
            <button 
              onClick={() => closeMenu(onStartProject)}
              className="w-full mt-2 flex items-center justify-center h-12 px-6 text-base font-bold text-white bg-primary rounded-lg hover:bg-orange-600 transition-colors"
            >
              <span>Start Project</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
};