import React, { useState, useEffect } from 'react';
import type { IntakeData } from '../types';
// Removed FlameIcon, BrainCircuitIcon, LoaderIcon

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
  const [budget, setBudget] = useState('$5k - $15k'); // Default budget string
  const [budgetRange, setBudgetRange] = useState('5000'); // Default slider value
  const [error, setError] = useState('');
  // Removed isGeneratingIdea state

  // Load saved draft from local storage on component mount
  useEffect(() => {
    const savedDraft = localStorage.getItem('intakeFormDraft');
    if (savedDraft) {
      try {
        const draftData: Partial<IntakeData> & { budgetRange?: string } = JSON.parse(savedDraft);
        setFullName(draftData.fullName || '');
        setJobTitle(draftData.jobTitle || '');
        setIndustry(draftData.industry || '');
        setProjectIdea(draftData.projectIdea || '');
        setExperience(draftData.experience || '');
        setGoal(draftData.goal || '');
        setBudget(draftData.budget || '$5k - $15k');
        setBudgetRange(draftData.budgetRange || '5000');
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
      budgetRange,
    };
    localStorage.setItem('intakeFormDraft', JSON.stringify(draftData));
  }, [fullName, jobTitle, industry, projectIdea, experience, goal, budget, budgetRange]);


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !jobTitle || !industry || !projectIdea || !experience || !goal || !budget) {
      setError('Please fill out all fields.');
      return;
    }
    setError('');
    // Submit the data (budget is already a string)
    onSubmit({ fullName, projectIdea, jobTitle, industry, experience, goal, budget });
    localStorage.removeItem('intakeFormDraft');
  };

  const handleBudgetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setBudgetRange(val);
    
    // Update the string budget state for form submission
    const numVal = parseInt(val, 10);
    if (numVal < 5000) setBudget('< $5k');
    else if (numVal < 15000) setBudget('$5k - $15k');
    else if (numVal < 30000) setBudget('$15k - $30k');
    else setBudget('$30k+');
  };

  const handleClear = () => {
    setFullName('');
    setJobTitle('');
    setIndustry('');
    setProjectIdea('');
    setExperience('');
    setGoal('');
    setBudget('$5k - $15k');
    setBudgetRange('5000');
    setError('');
    localStorage.removeItem('intakeFormDraft');
  };

  // Removed handleAiAssist function

  return (
    <>
      <div className="flex flex-col gap-3 mb-8">
        <p className="text-white text-4xl sm:text-5xl font-black leading-tight tracking-[-0.033em]">Let's Build Together</p>
        <p className="text-gray-400 text-base font-normal leading-normal">Tell us about your project, and we'll get in touch to discuss the next steps.</p>
      </div>
      <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <label className="flex flex-col w-full">
            <p className="text-white text-base font-medium leading-normal pb-2">Full Name</p>
            <input 
              className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg focus:ring-0 h-12 p-4 text-base font-normal leading-normal" 
              placeholder="Enter your full name" 
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          </label>
          <label className="flex flex-col w-full">
            <p className="text-white text-base font-medium leading-normal pb-2">Job Title</p>
            <input 
              className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg focus:ring-0 h-12 p-4 text-base font-normal leading-normal" 
              placeholder="Enter your job title" 
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
            />
          </label>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <label className="flex flex-col w-full">
            <p className="text-white text-base font-medium leading-normal pb-2">Industry</p>
            <select 
              className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg focus:ring-0 h-12 px-4 text-base font-normal leading-normal"
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
            >
              <option value="" disabled>Select your industry</option>
              <option value="tech">Technology</option>
              <option value="finance">Finance</option>
              <option value="healthcare">Healthcare</option>
              <option value="ecommerce">E-commerce</option>
              <option value="other">Other</option>
            </select>
          </label>
          <label className="flex flex-col w-full">
            <p className="text-white text-base font-medium leading-normal pb-2">Years of Experience</p>
            <select 
              className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg focus:ring-0 h-12 px-4 text-base font-normal leading-normal"
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
            >
              <option value="" disabled>Select your experience level</option>
              <option value="0-2">0-2 Years</option>
              <option value="3-5">3-5 Years</option>
              <option value="6-10">6-10 Years</option>
              <option value="10+">10+ Years</option>
            </select>
          </label>
        </div>
        <label className="flex flex-col w-full">
          <p className="text-white text-base font-medium leading-normal pb-2">Project Idea</p>
          <textarea 
            className="form-input flex w-full min-w-0 flex-1 resize-y overflow-hidden rounded-lg focus:ring-0 p-4 text-base font-normal leading-normal" 
            placeholder="Describe your project idea in detail..." 
            rows={5}
            value={projectIdea}
            onChange={(e) => setProjectIdea(e.target.value)}
          ></textarea>
        </label>
        <div className="flex flex-col gap-2">
          <p className="text-white text-base font-medium leading-normal">Primary Goal with this Project</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
            {(['Increase Sales', 'Improve Efficiency', 'Launch a New Product', 'Other']).map((item) => (
              <label 
                key={item} 
                className="flex items-center gap-3 p-4 rounded-lg cursor-pointer border border-transparent has-[:checked]:bg-primary/20 has-[:checked]:border-primary" 
                style={{ backgroundColor: 'var(--form-input-bg)' }}
              >
                <input 
                  className="form-radio bg-transparent border-gray-500 text-primary focus:ring-primary focus:ring-offset-background-dark" 
                  name="primary-goal" 
                  type="radio"
                  value={item}
                  checked={goal === item}
                  onChange={(e) => setGoal(e.target.value)}
                />
                <span className="text-white text-base font-normal">{item}</span>
              </label>
            ))}
          </div>
        </div>
        <label className="flex flex-col w-full">
          <div className="flex justify-between items-baseline pb-2">
            <p className="text-white text-base font-medium leading-normal">Estimated Budget</p>
            <p className="text-white text-lg font-bold" id="budget-value">
              ${new Intl.NumberFormat().format(parseInt(budgetRange, 10))}
            </p>
          </div>
          <input 
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer range-lg accent-primary" 
            max="50000" 
            min="1000" 
            step="1000" 
            type="range" 
            value={budgetRange}
            onChange={handleBudgetChange}
          />
          <div className="flex justify-between text-gray-400 text-sm mt-1">
            <span>$1k</span>
            <span>$50k+</span>
          </div>
        </label>

        {error && <p className="text-primary text-sm text-center">{error}</p>}

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6">
          <button 
            className="flex items-center justify-center w-full sm:w-auto h-12 px-8 py-4 text-base font-bold text-primary bg-transparent rounded-lg border-2 border-primary hover:bg-primary/10 transition-colors" 
            type="button"
            onClick={handleClear}
          >
            <span>Clear Form</span>
          </button>
          <button 
            className="flex items-center justify-center w-full sm:w-auto h-12 px-8 py-4 text-base font-bold text-white bg-primary rounded-lg hover:bg-orange-600 transition-colors" 
            type="submit"
          >
            <span>Get Started</span>
          </button>
        </div>
      </form>
    </>
  );
};