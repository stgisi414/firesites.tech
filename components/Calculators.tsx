import React, { useState, useEffect } from 'react';

// Helper component for a consistent slider
interface SliderInputProps {
  label: string;
  min: number;
  max: number;
  step: number;
  value: number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  displayValue: string;
  unit: string;
}

const SliderInput: React.FC<SliderInputProps> = ({ label, min, max, step, value, onChange, displayValue, unit }) => (
  <label className="flex flex-col w-full gap-2">
    <div className="flex justify-between items-baseline">
      <p className="text-text-light text-base font-medium">{label}</p>
      <p className="text-primary text-lg font-bold" id="budget-value">
        {displayValue} <span className="text-sm font-normal text-text-subtle-dark">{unit}</span>
      </p>
    </div>
    <input
      className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer range-lg accent-primary"
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={onChange}
    />
  </label>
);

export const Calculators: React.FC = () => {
  // --- State for Inputs ---
  const [hosting, setHosting] = useState(20); // $20/mo
  const [database, setDatabase] = useState(25); // $25/mo
  const [authUsers, setAuthUsers] = useState(1000); // 1000 users
  const [serverlessInvocations, setServerlessInvocations] = useState(100000); // 100k invocations
  const [aiRequests, setAiRequests] = useState(1000); // 1k requests
  const [monthlyRevenue, setMonthlyRevenue] = useState(1000); // $1000 in revenue
  const [otherCosts, setOtherCosts] = useState(15); // Domains, email
  const [adSpend, setAdSpend] = useState(100);

  // --- State for Costs ---
  const [total, setTotal] = useState(0);
  const [costBreakdown, setCostBreakdown] = useState<Record<string, number>>({});

  // --- Recalculate on-change ---
  useEffect(() => {
    // Simplified cost models (replace with your actual pricing)
    const authCost = Math.ceil(authUsers / 1000) * 5; // e.g., $5 per 1k users
    const serverlessCost = (serverlessInvocations / 100000) * 0.20; // e.g., $0.20 per 100k invocations
    const aiCost = (aiRequests / 1000) * 2.00; // e.g., $2.00 per 1k AI requests
    const stripeCost = (monthlyRevenue * 0.029) + (monthlyRevenue / 5 * 0.30); // e.g., 2.9% + 30c (assuming $5 avg purchase)
    
    const newBreakdown = {
      'Hosting': hosting,
      'Database': database,
      'Authentication': authCost,
      'Serverless Functions': serverlessCost,
      'AI API Usage': aiCost,
      'Stripe Fees': stripeCost,
      'Domains & Email': otherCosts,
      'Ad Spend': adSpend,
    };
    
    setCostBreakdown(newBreakdown);
    
    const newTotal = Object.values(newBreakdown).reduce((acc, val) => acc + val, 0);
    setTotal(newTotal);

  }, [hosting, database, authUsers, serverlessInvocations, aiRequests, monthlyRevenue, otherCosts, adSpend]);

  const formatCurrency = (val: number) => `$${val.toFixed(2)}`;

  return (
    <div className="flex flex-1 flex-col overflow-y-auto p-6 md:p-8">
      <h1 className="text-white text-4xl font-black leading-tight tracking-[-0.033em]">Project Cost Calculator</h1>
      <p className="text-gray-400 text-base font-normal leading-normal mt-2 mb-8">
        Estimate your monthly cloud and operational costs. These are illustrative examples.
      </p>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* --- Input Sliders --- */}
        <div className="flex-1 flex flex-col gap-8 p-6 bg-secondary-dark/50 rounded-lg">
          
          <SliderInput
            label="Monthly Ad Spend"
            min={0} max={5000} step={50} value={adSpend}
            onChange={(e) => setAdSpend(Number(e.target.value))}
            displayValue={formatCurrency(adSpend)} unit="/mo"
          />

          <SliderInput
            label="AI API Requests"
            min={0} max={100000} step={100} value={aiRequests}
            onChange={(e) => setAiRequests(Number(e.target.value))}
            displayValue={aiRequests.toLocaleString()} unit="reqs/mo"
          />

          <SliderInput
            label="Secure Auth Users"
            min={0} max={50000} step={100} value={authUsers}
            onChange={(e) => setAuthUsers(Number(e.target.value))}
            displayValue={authUsers.toLocaleString()} unit="users/mo"
          />

          <SliderInput
            label="Serverless Invocations"
            min={0} max={2000000} step={10000} value={serverlessInvocations}
            onChange={(e) => setServerlessInvocations(Number(e.target.value))}
            displayValue={serverlessInvocations.toLocaleString()} unit="inv/mo"
          />

          <SliderInput
            label="Estimated Monthly Revenue"
            min={0} max={50000} step={100} value={monthlyRevenue}
            onChange={(e) => setMonthlyRevenue(Number(e.target.value))}
            displayValue={formatCurrency(monthlyRevenue)} unit="/mo"
          />

          {/* --- Simple Selects --- */}
          <label className="flex flex-col w-full gap-2">
            <p className="text-text-light text-base font-medium">Hosting Plan</p>
            <select 
              className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg focus:ring-0 h-12 px-4 text-base font-normal leading-normal"
              value={hosting}
              onChange={(e) => setHosting(Number(e.target.value))}
            >
              <option value={20}>Standard ($20/mo)</option>
              <option value={50}>Performance ($50/mo)</option>
              <option value={150}>Enterprise ($150/mo)</option>
            </select>
          </label>
          
           <label className="flex flex-col w-full gap-2">
            <p className="text-text-light text-base font-medium">Database Plan</p>
            <select 
              className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg focus:ring-0 h-12 px-4 text-base font-normal leading-normal"
              value={database}
              onChange={(e) => setDatabase(Number(e.target.value))}
            >
              <option value={25}>Standard ($25/mo)</option>
              <option value={75}>Pro ($75/mo)</option>
              <option value={200}>Scale ($200/mo)</option>
            </select>
          </label>

          <label className="flex flex-col w-full gap-2">
            <p className="text-text-light text-base font-medium">Domains, Email, etc.</p>
            <select 
              className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg focus:ring-0 h-12 px-4 text-base font-normal leading-normal"
              value={otherCosts}
              onChange={(e) => setOtherCosts(Number(e.target.value))}
            >
              <option value={15}>Basic ($15/mo)</option>
              <option value={50}>Business Suite ($50/mo)</option>
            </select>
          </label>

        </div>

        {/* --- Cost Breakdown --- */}
        <div className="w-full lg:w-80 flex-shrink-0">
          <div className="p-6 bg-secondary-dark rounded-lg sticky top-8">
            <p className="text-text-subtle-dark text-sm font-medium">ESTIMATED TOTAL</p>
            <p className="text-white text-5xl font-black my-2">
              {formatCurrency(total)}
              <span className="text-lg text-text-subtle-dark">/mo</span>
            </p>
            <hr className="border-t border-white/10 my-4" />
            <div className="flex flex-col gap-3">
              {Object.entries(costBreakdown).map(([key, value]) => (
                <div key={key} className="flex justify-between text-sm">
                  <p className="text-text-subtle-dark">{key}</p>
                  <p className="text-text-light font-medium">{formatCurrency(value)}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};