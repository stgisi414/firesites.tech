import React, { useState, useEffect, useRef, useCallback } from 'react';
import type { Message, Lead, AppState, IntakeData, GroundingMetadata } from './types';
import { Chat, GoogleGenAI } from '@google/genai';
import { SYSTEM_PROMPT } from './constants';
import { Header } from './components/Header';
import { ChatMessage } from './components/ChatMessage';
import { ChatInput } from './components/ChatInput';
import { LeadForm } from './components/LeadForm';
import { IntakeForm } from './components/IntakeForm';
import { Pricing } from './components/Pricing';
import { Calculators } from './components/Calculators';
import { LandingPage } from './components/LandingPage';
import { Services } from './components/Services';
import { CaseStudies } from './components/CaseStudies';
import { About } from './components/About';
import { Contact } from './components/Contact';
import { MainHeader } from './components/MainHeader';

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [appState, setAppState] = useState<AppState>('loading');
  const [isLoading, setIsLoading] = useState(false);
  // const [isPricingModalOpen, setIsPricingModalOpen] = useState(false); // 👈 REMOVED
  const chatRef = useRef<Chat | null>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const startChatSession = useCallback(async (data: IntakeData) => {
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
      
      const context = `
        Here is the context about the potential client I am about to chat with:
        - Full Name: ${data.fullName}
        - Job Title: ${data.jobTitle}
        - Industry: ${data.industry}
        - Experience Level: ${data.experience}
        - Project Idea: "${data.projectIdea}"
        - Primary Goal: ${data.goal}
        - Estimated Budget: ${data.budget}
        
        Start the conversation with a friendly, personalized, and robust greeting based on this information. Jump right into it.
      `;

      const savedHistoryJSON = localStorage.getItem('chatHistory');
      const chatHistory = savedHistoryJSON ? JSON.parse(savedHistoryJSON) : [];

      const historyForGemini: Message[] = [
        { role: 'user', parts: [{ text: context }] },
        ...chatHistory,
      ];
      
      chatRef.current = ai.chats.create({
        model: 'gemini-2.5-flash',
        history: historyForGemini,
        config: {
          systemInstruction: SYSTEM_PROMPT,
          tools: [{ googleSearch: {} }],
        },
      });

      if (chatHistory.length > 0) {
        setMessages(chatHistory);
        setAppState('chatting');
      } else {
        // Generate the initial "fully loaded" message
        setIsLoading(true);
        setAppState('chatting'); // Switch to chat view to show loading indicator
        
        const result = await chatRef.current.sendMessageStream({ message: "Introduce yourself and greet me based on the context provided." });
        
        let streamedText = '';
        let finalGroundingMetadata: GroundingMetadata | undefined = undefined;
        let accumulatedChunks: any[] = [];
        
        const initialBotMessage: Message = { role: 'model', parts: [{ text: '' }] };
        setMessages([initialBotMessage]);

        for await (const chunk of result) {
            streamedText += chunk.text;

            if (chunk.candidates?.[0]?.groundingMetadata?.groundingChunks) {
                const newChunks = chunk.candidates[0].groundingMetadata.groundingChunks;
                const existingUris = new Set(accumulatedChunks.map(c => c.web?.uri));
                newChunks.forEach((chunk: any) => {
                    if (chunk.web && !existingUris.has(chunk.web.uri)) {
                        accumulatedChunks.push(chunk);
                    }
                });
                finalGroundingMetadata = { groundingChunks: accumulatedChunks };
            }

            const updatedMessage: Message = {
                role: 'model',
                parts: [{ text: streamedText }],
                groundingMetadata: finalGroundingMetadata,
            };
            setMessages([updatedMessage]);
        }
        setIsLoading(false);
      }

    } catch (error) {
      console.error("Failed to initialize Gemini:", error);
      setMessages(prev => [...prev, { role: 'model', parts: [{ text: "Sorry, I'm having trouble connecting to my brain right now. Please check the API key configuration and refresh the page." }] }]);
    }
  }, []);

  useEffect(() => {
    // Always start on the landing page.
    // The user can then choose to go to chat or start a new project.
    setAppState('landing');
  }, []); // Empty dependency array ensures this runs only once on mount
  
  useEffect(() => {
    // Persist chat history to local storage whenever it changes
    if ((appState === 'chatting' || appState === 'qualifying' || appState === 'qualified') && messages.length > 0) {
      localStorage.setItem('chatHistory', JSON.stringify(messages));
    }
  }, [messages, appState]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSendMessage = useCallback(async (text: string) => {
    if (!text.trim() || !chatRef.current) return;

    const userMessage: Message = { role: 'user', parts: [{ text }] };
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const result = await chatRef.current.sendMessageStream({ message: text });
      let streamedText = '';
      let finalGroundingMetadata: GroundingMetadata | undefined = undefined;
      let accumulatedChunks: any[] = [];
      
      setMessages(prev => [...prev, { role: 'model', parts: [{ text: '' }] }]);

      for await (const chunk of result) {
        streamedText += chunk.text;
        
        if (chunk.candidates?.[0]?.groundingMetadata?.groundingChunks) {
            const newChunks = chunk.candidates[0].groundingMetadata.groundingChunks;
            const existingUris = new Set(accumulatedChunks.map(c => c.web?.uri));
            newChunks.forEach((chunk: any) => {
                if (chunk.web && !existingUris.has(chunk.web.uri)) {
                    accumulatedChunks.push(chunk);
                }
            });
            finalGroundingMetadata = { groundingChunks: accumulatedChunks };
        }

        setMessages(prev => {
          const newMessages = [...prev];
          newMessages[newMessages.length - 1] = { 
            role: 'model', 
            parts: [{ text: streamedText }],
            groundingMetadata: finalGroundingMetadata
          };
          return newMessages;
        });
      }

      if (streamedText.includes('[SHOW_LEAD_FORM]')) {
        const cleanedText = streamedText.replace('[SHOW_LEAD_FORM]', '').trim();
        setMessages(prev => {
            const newMessages = [...prev];
            newMessages[newMessages.length - 1].parts = [{ text: cleanedText }];
            return newMessages;
        });
        setAppState('qualifying');
      }
      
    } catch (error) {
      console.error('Gemini API error:', error);
      setMessages(prev => [...prev, { role: 'model', parts: [{ text: "I encountered an error. Please try again." }] }]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleLeadSubmit = (lead: Lead) => {
    console.log("Lead Submitted:", lead);
    const confirmationMessage: Message = {
      role: 'model',
      parts: [{ text: "Thank you! Your project details have been received. A specialist from the firesites.tech team will review your information and contact you at your email within 24 business hours to discuss the next steps." }],
    };
    setMessages(prev => [...prev, confirmationMessage]);
    setAppState('qualified');
  };
  
  const handleIntakeSubmit = (data: IntakeData) => {
    localStorage.setItem('intakeData', JSON.stringify(data));
    localStorage.removeItem('chatHistory'); // Clear previous chat history for the new session
    startChatSession(data);
  };
  
  const handleNewChat = () => {
    // Clear history and start a new session
    localStorage.removeItem('chatHistory');
    localStorage.removeItem('intakeData'); // This will force the intake form
    setMessages([]);
    setAppState('loading'); // Go to loading
    window.location.reload(); // Easiest way to reset
  };

  const handleGoToChat = () => {
    const savedData = localStorage.getItem('intakeData');
    if (savedData) {
      startChatSession(JSON.parse(savedData));
    } else {
      // If for some reason data is gone, go to intake
      setAppState('intake');
    }
  };

  if (appState === 'loading') {
    return (
      <div className="bg-background-dark flex h-screen items-center justify-center">
        <p className="text-brand-text">Initializing...</p>
      </div>
    );
  }

  // 1. RENDER LANDING PAGE
  if (appState === 'landing') {
    const hasExistingChat = !!localStorage.getItem('intakeData');
    return (
      <LandingPage
        appState={appState}
        onStartProject={() => setAppState('intake')}
        hasExistingChat={hasExistingChat}
        onGoToChat={handleGoToChat}
        onLogoClick={() => setAppState('landing')}
        onGoToServices={() => setAppState('services')}
        onGoToPricing={() => setAppState('pricing')}
        onGoToCaseStudies={() => setAppState('caseStudies')}
        onGoToAbout={() => setAppState('about')}
        onGoToContact={() => setAppState('contact')}
      />
    );
  }

  if (appState === 'services') {
    return (
      <Services
        appState={appState}
        onStartProject={() => setAppState('intake')}
        onLogoClick={() => setAppState('landing')}
        onGoToPricing={() => setAppState('pricing')}
        onGoToCaseStudies={() => setAppState('caseStudies')}
        onGoToAbout={() => setAppState('about')}
        onGoToContact={() => setAppState('contact')}
      />
    );
  }

  if (appState === 'pricing') {
    return (
      <Pricing
        appState={appState}
        onStartProject={() => setAppState('intake')}
        onLogoClick={() => setAppState('landing')}
        onGoToServices={() => setAppState('services')}
        onGoToCaseStudies={() => setAppState('caseStudies')}
        onGoToAbout={() => setAppState('about')}
        onGoToContact={() => setAppState('contact')}
      />
    );
  }

  if (appState === 'caseStudies') {
    return (
      <CaseStudies
        appState={appState}
        onStartProject={() => setAppState('intake')}
        onLogoClick={() => setAppState('landing')}
        onGoToServices={() => setAppState('services')}
        onGoToPricing={() => setAppState('pricing')}
        onGoToAbout={() => setAppState('about')}
        onGoToContact={() => setAppState('contact')}
      />
    );
  }

  if (appState === 'about') {
    return (
      <About
        appState={appState}
        onStartProject={() => setAppState('intake')}
        onLogoClick={() => setAppState('landing')}
        onGoToServices={() => setAppState('services')}
        onGoToPricing={() => setAppState('pricing')}
        onGoToCaseStudies={() => setAppState('caseStudies')}
        onGoToContact={() => setAppState('contact')}
      />
    );
  }

  if (appState === 'contact') {
    return (
      <Contact
        appState={appState}
        onStartProject={() => setAppState('intake')}
        onLogoClick={() => setAppState('landing')}
        onGoToServices={() => setAppState('services')}
        onGoToPricing={() => setAppState('pricing')}
        onGoToCaseStudies={() => setAppState('caseStudies')}
        onGoToAbout={() => setAppState('about')}
      />
    )
  }

  // 2. RENDER INTAKE FORM
  if (appState === 'intake') {
    return (
      <div className="bg-background-dark text-brand-text font-display flex flex-col h-screen">
        {/* Pass the click handler to the header */}
        <Header onLogoClick={() => setAppState('landing')} />
        
        <main className="flex-1 p-4 sm:p-6 md:p-8 overflow-y-auto">
          <div className="w-full max-w-3xl mx-auto">
            <IntakeForm onSubmit={handleIntakeSubmit} />
          </div>
        </main>
        <footer className="text-center p-4 mt-8 border-t border-white/10 bg-background-dark">
            <p className="text-sm text-gray-500">
                We'll review your submission and get back to you within 2 business days. 
                <a className="text-primary hover:underline" href="#"> Privacy Policy</a>.
            </p>
        </footer>
      </div>
    );
  }

  // 3. RENDER MAIN APP (Chat, Calculators, etc.)
  
  // Determine if we are in any "chat" related view
  const isChatView = ['chatting', 'qualifying', 'qualified'].includes(appState);

  return (
    <div className="flex h-screen w-full bg-background-dark font-display text-text-light">
      {/* Side Navigation Bar */}
      <aside className="flex w-64 flex-col bg-background-dark border-r border-secondary-dark/50 p-4">
        
        {/* Make the logo a button to go to landing page */}
        <button onClick={() => setAppState('landing')} className="flex items-center gap-4 text-white">
          {/* ⬇️ FIXED THIS BLOCK ⬇️ */}
          <img src="/logo.jpg" alt="FIRE Solutions Logo" className="h-6 w-6 rounded-full" />
          <h2 className="text-white text-xl font-bold leading-tight tracking-[-0.015em]">FIRE Solutions</h2>
        </button>
        
        <nav className="flex flex-col gap-2 mt-8">
          <a className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-secondary-dark transition-colors" href="#">
            <span className="material-symbols-outlined text-white">dashboard</span>
            <p className="text-white text-sm font-medium leading-normal">Dashboard</p>
          </a>
          
          <button 
            onClick={() => setAppState('chatting')}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${isChatView ? 'bg-secondary-dark' : 'hover:bg-secondary-dark'}`}
          >
            <span className="material-symbols-outlined text-white" style={{fontVariationSettings: "'FILL' 1"}}>history</span>
            <p className="text-white text-sm font-medium leading-normal">Chat History</p>
          </button>

          <button 
            onClick={() => setAppState('calculators')}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${appState === 'calculators' ? 'bg-secondary-dark' : 'hover:bg-secondary-dark'}`}
          >
            <span className="material-symbols-outlined text-white">calculate</span>
            <p className="text-white text-sm font-medium leading-normal">Calculators</p>
          </button>

          <button 
            onClick={() => setAppState('services')}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${appState === 'services' ? 'bg-secondary-dark' : 'hover:bg-secondary-dark'}`}
          >
            <span className="material-symbols-outlined text-white">layers</span>
            <p className="text-white text-sm font-medium leading-normal">Our Process</p>
          </button>

          <button 
            onClick={() => setAppState('caseStudies')}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${appState === 'caseStudies' ? 'bg-secondary-dark' : 'hover:bg-secondary-dark'}`}
          >
            <span className="material-symbols-outlined text-white">auto_stories</span>
            <p className="text-white text-sm font-medium leading-normal">Case Studies</p>
          </button>

          <button 
            onClick={() => setAppState('about')}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${appState === 'about' ? 'bg-secondary-dark' : 'hover:bg-secondary-dark'}`}
          >
            <span className="material-symbols-outlined text-white">info</span>
            <p className="text-white text-sm font-medium leading-normal">About</p>
          </button>

          <button 
            onClick={() => setAppState('contact')}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${appState === 'contact' ? 'bg-secondary-dark' : 'hover:bg-secondary-dark'}`}
          >
            <span className="material-symbols-outlined text-white">mail</span>
            <p className="text-white text-sm font-medium leading-normal">Contact</p>
          </button>
          
          <a className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-secondary-dark transition-colors" href="#">
            <span className="material-symbols-outlined text-white">settings</span>
            <p className="text-white text-sm font-medium leading-normal">Settings</p>
          </a>
        </nav>

        <div className="mt-auto flex flex-col gap-4">
          <button 
            onClick={handleNewChat}
            className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-gradient-to-r from-accent-orange to-accent-yellow text-black text-sm font-bold leading-normal tracking-[0.015em] hover:opacity-90 transition-opacity">
            <span className="truncate">New Chat</span>
          </button>
          <div className="flex flex-col gap-1">
            <a className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-secondary-dark transition-colors" href="#">
              <span className="material-symbols-outlined text-white">help</span>
              <p className="text-white text-sm font-medium leading-normal">Help</p>
            </a>
            <button
              onClick={() => setAppState('pricing')}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${appState === 'pricing' ? 'bg-secondary-dark' : 'hover:bg-secondary-dark'}`}
            >
              <span className="material-symbols-outlined text-white">payments</span>
              <p className="text-white text-sm font-medium leading-normal">Pricing</p>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      {appState === 'calculators' ? (
        <Calculators />
      ) : (
        <main className="flex flex-1 flex-col">
          <div ref={chatContainerRef} className="flex flex-1 flex-col overflow-y-auto p-6">
            {/* Chat Messages */}
            <div className="flex flex-col gap-6">
              {messages.map((msg, index) => (
                <ChatMessage 
                  key={index} 
                  message={msg} 
                  isStreaming={isLoading && index === messages.length - 1 && msg.role === 'model'}
                />
              ))}
              {isLoading && messages[messages.length - 1]?.role === 'user' && (
                  <ChatMessage 
                      message={{role: 'model', parts: [{text: ''}]}} 
                      isStreaming={true}
                  />
              )}
            </div>
          </div>

          {/* Chat Input Bar */}
          <div className="px-6 pb-6 mt-4">
            {appState === 'chatting' && <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} onNewChat={handleNewChat} />}
            {appState === 'qualifying' && <LeadForm onSubmit={handleLeadSubmit} />}
            {appState === 'qualified' && (
              <p className="text-center text-green-400 font-medium">Thank you for your submission. We'll be in touch soon.</p>
            )}
          </div>
        </main>
      )}
    </div>
  );
};

export default App;