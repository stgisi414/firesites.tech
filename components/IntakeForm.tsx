import React, { useState, useEffect } from 'react';
import type { IntakeData } from '../types';
import { FlameIcon, BrainCircuitIcon, LoaderIcon } from './icons';
import { GoogleGenAI } from '@google/genai';

interface IntakeFormProps {
  onSubmit: (data: IntakeData) => void;
}

export const IntakeForm: React.FC<IntakeFormProps> = ({ onSubmit }) => {
  const [fullName, setFullName] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [industry, setIndustry] = useState('');
  const [projectIdea, setProjectIdea] = useState('');
  const [experience, setExperience] = useState('');
  const [goal, setGoal] = useState('');
  const [budget, setBudget] = useState('');
  const [error, setError] = useState('');
  const [isGeneratingIdea, setIsGeneratingIdea] = useState(false);

  // Load saved draft from local storage on component mount
  useEffect(() => {
    const savedDraft = localStorage.getItem('intakeFormDraft');
    if (savedDraft) {
      try {
        const draftData: Partial<IntakeData> = JSON.parse(savedDraft);
        setFullName(draftData.fullName || '');
        setJobTitle(draftData.jobTitle || '');
        setIndustry(draftData.industry || '');
        setProjectIdea(draftData.projectIdea || '');
        setExperience(draftData.experience || '');
        setGoal(draftData.goal || '');
        setBudget(draftData.budget || '');
      } catch (e) {
        console.error("Failed to parse intake form draft:", e);
        localStorage.removeItem('intakeFormDraft');
      }
    }
  }, []);

  // Save form data to local storage on change
  useEffect(() => {
    const draftData = {
      fullName,
      jobTitle,
      industry,
      projectIdea,
      experience,
      goal,
      budget,
    };
    localStorage.setItem('intakeFormDraft', JSON.stringify(draftData));
  }, [fullName, jobTitle, industry, projectIdea, experience, goal, budget]);


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !jobTitle || !industry || !projectIdea || !experience || !goal || !budget) {
      setError('Please fill out all fields.');
      return;
    }
    setError('');
    onSubmit({ fullName, projectIdea, jobTitle, industry, experience, goal, budget });
    localStorage.removeItem('intakeFormDraft');
  };

  const handleAiAssist = async () => {
    setIsGeneratingIdea(true);
    setError('');
    
    const hasText = projectIdea.trim().length > 0;
    
    const prompt = hasText
      ? `You are an expert copywriter specializing in startup pitches. Refine and improve the following project idea to make it sound more compelling, clear, and professional. Keep it concise (under 280 characters) and focus on the core value proposition. Do not add any introductory phrases like "Here's the refined idea:". Just return the improved text. Here is the idea to improve: "${projectIdea}"`
      : "You are an expert startup advisor. Generate a single, concise, innovative project idea for a tech startup. The idea should be suitable for an AI-native SaaS application. Present only the idea, without any preamble. For example: 'An AI-powered platform that analyzes customer feedback from multiple channels to identify product improvement opportunities.'";

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });
      const text = response.text.trim();
      setProjectIdea(text);
    } catch (e) {
      console.error("AI Assist error:", e);
      setError('AI assistant failed. Please try again or check your API key.');
    } finally {
      setIsGeneratingIdea(false);
    }
  };

  return (
    <div className="bg-gray-900 p-6 md:p-8 rounded-lg border border-brand-primary/50 shadow-2xl shadow-brand-primary/10 my-8">
      <div className="flex flex-col items-center text-center mb-6">
         <FlameIcon className="w-12 h-12 text-brand-primary mb-3" />
         <h2 className="text-2xl font-bold font-heading">Welcome to firesites.tech</h2>
         <p className="text-gray-400 mt-1">Tell us a bit about your project to get started.</p>
         <p className="text-sm text-gray-500 mt-2 max-w-md">To kickstart our conversation, our AI will perform some initial market research on your industry and competitors.</p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="fullName" className="block text-sm font-medium text-gray-300 mb-1">Full Name</label>
            <input
              type="text" id="fullName" placeholder="e.g., Jane Doe" value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="block w-full bg-gray-800 border border-gray-600 rounded-md p-3 focus:ring-2 focus:ring-brand-primary focus:outline-none"
            />
          </div>
          <div>
            <label htmlFor="jobTitle" className="block text-sm font-medium text-gray-300 mb-1">Job Title</label>
            <input
              type="text" id="jobTitle" placeholder="e.g., Founder, CEO" value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              className="block w-full bg-gray-800 border border-gray-600 rounded-md p-3 focus:ring-2 focus:ring-brand-primary focus:outline-none"
            />
          </div>
        </div>

        <div>
            <label htmlFor="industry" className="block text-sm font-medium text-gray-300 mb-1">Industry</label>
            <input
              type="text" id="industry" placeholder="e.g., SaaS, E-commerce, Healthtech" value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              className="block w-full bg-gray-800 border border-gray-600 rounded-md p-3 focus:ring-2 focus:ring-brand-primary focus:outline-none"
            />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <label htmlFor="experience" className="block text-sm font-medium text-gray-300 mb-1">Your Experience</label>
                <select id="experience" value={experience} onChange={(e) => setExperience(e.target.value)} className="block w-full bg-gray-800 border border-gray-600 rounded-md p-3 focus:ring-2 focus:ring-brand-primary focus:outline-none">
                    <option value="" disabled>Select level...</option>
                    <option value="Just an idea">Just an idea</option>
                    <option value="Have a prototype/MVP">Have a prototype/MVP</option>
                    <option value="Existing business">Existing business</option>
                </select>
            </div>
            <div>
                <label htmlFor="goal" className="block text-sm font-medium text-gray-300 mb-1">Primary Goal</label>
                <select id="goal" value={goal} onChange={(e) => setGoal(e.target.value)} className="block w-full bg-gray-800 border border-gray-600 rounded-md p-3 focus:ring-2 focus:ring-brand-primary focus:outline-none">
                    <option value="" disabled>Select goal...</option>
                    <option value="Build a new MVP">Build a new MVP</option>
                    <option value="Add AI to my app">Add AI to my app</option>
                    <option value="Scale my platform">Scale my platform</option>
                </select>
            </div>
        </div>

        <div>
          <label htmlFor="projectIdea" className="block text-sm font-medium text-gray-300 mb-1">What's your project idea?</label>
          <div className="relative w-full">
            <textarea
              id="projectIdea" rows={3} placeholder="Describe your vision, or let us generate an idea!" value={projectIdea}
              onChange={(e) => setProjectIdea(e.target.value)}
              className="block w-full bg-gray-800 border border-gray-600 rounded-md p-3 pr-12 focus:ring-2 focus:ring-brand-primary focus:outline-none resize-none"
            />
            <button
              type="button"
              onClick={handleAiAssist}
              disabled={isGeneratingIdea}
              aria-label={projectIdea.trim().length > 0 ? "Improve with AI" : "Generate idea with AI"}
              className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400 hover:text-brand-highlight disabled:text-gray-500 disabled:cursor-wait transition-colors focus:outline-none focus:ring-2 focus:ring-brand-highlight rounded-full p-1"
            >
              {isGeneratingIdea ? (
                <LoaderIcon className="w-5 h-5 animate-spin" />
              ) : (
                <BrainCircuitIcon className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
        
        <div>
            <label htmlFor="budget" className="block text-sm font-medium text-gray-300 mb-1">Estimated Budget</label>
            <select id="budget" value={budget} onChange={(e) => setBudget(e.target.value)} className="block w-full bg-gray-800 border border-gray-600 rounded-md p-3 focus:ring-2 focus:ring-brand-primary focus:outline-none">
                <option value="" disabled>Select a budget range...</option>
                <option value="< $5k">&lt; $5k</option>
                <option value="$5k - $15k">$5k - $15k</option>
                <option value="$15k - $30k">$15k - $30k</option>
                <option value="$30k+">$30k+</option>
            </select>
        </div>

        {error && <p className="text-brand-secondary text-sm text-center">{error}</p>}
        
        <button
          type="submit"
          className="w-full bg-brand-primary text-white font-bold py-3 px-4 rounded-lg hover:bg-orange-600 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-orange-500 mt-4"
        >
          Start Conversation
        </button>
      </form>
    </div>
  );
};