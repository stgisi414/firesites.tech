import React, { useState } from 'react';
import type { Lead } from '../types';

interface LeadFormProps {
  onSubmit: (lead: Lead) => void;
}

export const LeadForm: React.FC<LeadFormProps> = ({ onSubmit }) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [budget, setBudget] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email || !projectDescription || !budget) {
      setError('Please fill out all fields.');
      return;
    }
    setError('');
    onSubmit({ fullName, email, projectDescription, budget });
  };

  return (
    <div className="bg-gray-900 p-6 rounded-lg border border-brand-primary/50">
      <h2 className="text-xl font-bold font-heading text-center mb-4">Project Details</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="fullName" className="block text-sm font-medium text-gray-300">Full Name</label>
          <input
            type="text"
            id="fullName"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="mt-1 block w-full bg-gray-800 border border-gray-600 rounded-md p-2 focus:ring-2 focus:ring-brand-primary focus:outline-none"
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-300">Email Address</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 block w-full bg-gray-800 border border-gray-600 rounded-md p-2 focus:ring-2 focus:ring-brand-primary focus:outline-none"
          />
        </div>
        <div>
          <label htmlFor="projectDescription" className="block text-sm font-medium text-gray-300">Brief Project Description</label>
          <textarea
            id="projectDescription"
            rows={3}
            value={projectDescription}
            onChange={(e) => setProjectDescription(e.target.value)}
            className="mt-1 block w-full bg-gray-800 border border-gray-600 rounded-md p-2 focus:ring-2 focus:ring-brand-primary focus:outline-none"
          />
        </div>
        <div>
          <label htmlFor="budget" className="block text-sm font-medium text-gray-300">Estimated Budget</label>
          <select
            id="budget"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            className="mt-1 block w-full bg-gray-800 border border-gray-600 rounded-md p-2 focus:ring-2 focus:ring-brand-primary focus:outline-none"
          >
            <option value="" disabled>Select a budget</option>
            <option value="< $5k">&lt; $5k</option>
            <option value="$5k - $15k">$5k - $15k</option>
            <option value="$15k+">$15k+</option>
          </select>
        </div>
        {error && <p className="text-brand-secondary text-sm text-center">{error}</p>}
        <button
          type="submit"
          className="w-full bg-brand-primary text-white font-bold py-2 px-4 rounded-lg hover:bg-orange-600 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-orange-500"
        >
          Submit Project
        </button>
      </form>
    </div>
  );
};
