import React from 'react';

interface HeaderProps {
  onLogoClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onLogoClick }) => {
  return (
    <header className="bg-background-dark border-b border-white/10">
      <div className="max-w-5xl mx-auto flex items-center justify-between whitespace-nowrap px-4 py-5">
        <button onClick={onLogoClick} className="flex items-center gap-4 text-white">
          <div className="text-primary text-2xl">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
              <path d="M24 4C25.7818 14.2173 33.7827 22.2182 44 24C33.7827 25.7818 25.7818 33.7827 24 44C22.2182 33.7827 14.2173 25.7818 4 24C14.2173 22.2182 22.2182 14.2173 24 4Z" fill="currentColor"></path>
            </svg>
          </div>
          <h2 className="text-white text-xl font-bold leading-tight tracking-[-0.015em]">FIRE Solutions</h2>
        </button>
        {/* You can add nav items here if needed in the future */}
      </div>
    </header>
  );
};