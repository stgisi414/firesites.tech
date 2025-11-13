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

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [appState, setAppState] = useState<AppState>('loading');
  const [isLoading, setIsLoading] = useState(false);
  const [isPricingModalOpen, setIsPricingModalOpen] = useState(false);
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
    const savedData = localStorage.getItem('intakeData');
    if (savedData) {
      startChatSession(JSON.parse(savedData));
    } else {
      setAppState('intake');
    }
  }, [startChatSession]);
  
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
  
  if (appState === 'loading') {
    return (
      <div className="bg-brand-bg flex h-screen items-center justify-center">
        <p className="text-brand-text">Initializing...</p>
      </div>
    );
  }

  if (appState === 'intake') {
    return (
      <div className="bg-brand-bg text-brand-text font-body flex flex-col h-screen">
        <Header />
        <main className="flex-1 flex items-center justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-lg">
            <IntakeForm onSubmit={handleIntakeSubmit} />
          </div>
        </main>
        <footer className="p-4 border-t border-gray-700 bg-brand-bg">
            <div className="max-w-3xl mx-auto text-center">
                <button
                    onClick={() => setIsPricingModalOpen(true)}
                    className="text-sm text-gray-400 hover:text-brand-primary transition-colors focus:outline-none"
                    aria-label="View our pricing"
                >
                    View Pricing
                </button>
            </div>
        </footer>
        <Pricing isOpen={isPricingModalOpen} onClose={() => setIsPricingModalOpen(false)} />
      </div>
    );
  }

  return (
    <div className="bg-brand-bg text-brand-text font-body flex flex-col h-screen">
      <Header />
      <main ref={chatContainerRef} className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
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
      </main>
      <footer className="p-4 border-t border-gray-700 bg-brand-bg">
        <div className="max-w-3xl mx-auto">
          {appState === 'chatting' && <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />}
          {appState === 'qualifying' && <LeadForm onSubmit={handleLeadSubmit} />}
          {appState === 'qualified' && (
            <p className="text-center text-green-400 font-medium">Thank you for your submission. We'll be in touch soon.</p>
          )}
          <div className="text-center mt-4">
            <button
              onClick={() => setIsPricingModalOpen(true)}
              className="text-sm text-gray-400 hover:text-brand-primary transition-colors focus:outline-none"
              aria-label="View our pricing"
            >
              View Pricing
            </button>
          </div>
        </div>
      </footer>
      <Pricing isOpen={isPricingModalOpen} onClose={() => setIsPricingModalOpen(false)} />
    </div>
  );
};

export default App;