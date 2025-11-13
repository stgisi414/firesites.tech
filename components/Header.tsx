import React from 'react';
import { FlameIcon } from './icons';

export const Header: React.FC = () => {
  return (
    <header className="bg-brand-bg border-b border-gray-800 p-4 shadow-md">
      <div className="max-w-5xl mx-auto flex items-center justify-center md:justify-start">
        <FlameIcon className="w-8 h-8 text-brand-primary animate-fire-flicker" />
        <h1 className="ml-3 text-2xl font-bold font-heading text-white">
          <span className="text-brand-secondary">fire</span>
          <span className="text-brand-highlight">sites</span>
          <span className="text-brand-primary">.tech</span>
          {' '}Client Portal
        </h1>
      </div>
    </header>
  );
};