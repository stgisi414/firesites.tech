import React, { useState, useRef } from 'react';
import type { AppState } from '../types';
import { MainHeader } from './MainHeader';
import emailjs from '@emailjs/browser';

interface ContactPageProps {
  appState: AppState;
  onLogoClick: () => void;
  onGoToServices: () => void;
  onGoToPricing: () => void;
  onGoToCaseStudies: () => void;
  onGoToAbout: () => void;
}

// Helper for form status
type FormStatus = "idle" | "sending" | "success" | "error";

export const Contact: React.FC<ContactPageProps> = ({
  appState,
  onLogoClick, 
  onGoToServices, 
  onGoToPricing, 
  onGoToCaseStudies, 
  onGoToAbout 
}) => {
  const formRef = useRef<HTMLFormElement>(null);
  const [formStatus, setFormStatus] = useState<FormStatus>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formStatus === "sending" || !formRef.current) return;

    setFormStatus("sending");

    const serviceID = process.env.EMAILJS_SERVICE_ID as string;
    const templateID = process.env.EMAILJS_TEMPLATE_ID as string;
    const publicKey = process.env.EMAILJS_PUBLIC_KEY as string;

    emailjs.sendForm(serviceID, templateID, formRef.current, publicKey)
      .then((result) => {
          console.log(result.text);
          setFormStatus("success");
          formRef.current?.reset();
      }, (error) => {
          console.error(error);
          setErrorMessage(error.text || "Failed to send message. Please try again.");
          setFormStatus("error");
      });
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col font-display bg-background-dark text-text-dark">
      <MainHeader
          appState={appState}
          onLogoClick={onGoToChat} // Or onLogoClick={() => {}} if you want it to do nothing on landing
          onGoToServices={onGoToServices}
          onGoToPricing={onGoToPricing}
          onGoToCaseStudies={onGoToCaseStudies}
          onGoToAbout={onGoToAbout}
          onGoToContact={onGoToContact}
          onStartProject={onStartProject}
        />

      <main className="flex-grow">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="mx-auto max-w-2xl text-center">
            <div className="flex flex-col gap-3 mb-12">
              <h1 className="text-4xl font-black tracking-tighter sm:text-5xl md:text-6xl">Get in Touch</h1>
              <p className="text-text-dark/60 text-lg">Fill out the form below and we'll get back to you within 24 hours.</p>
            </div>
            
            <form ref={formRef} onSubmit={handleSubmit} className="space-y-6 text-left">
              <div className="grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium leading-6 pb-2" htmlFor="full-name">Full Name</label>
                  <input required className="form-input block w-full rounded-lg border-0 bg-field-dark py-3 px-4 shadow-sm ring-1 ring-inset ring-border-dark placeholder:text-placeholder-dark focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6 transition-shadow" id="full-name" name="full-name" placeholder="e.g., John Doe" type="text"/>
                </div>
                <div>
                  <label className="block text-sm font-medium leading-6 pb-2" htmlFor="email">Email Address</label>
                  <input required className="form-input block w-full rounded-lg border-0 bg-field-dark py-3 px-4 shadow-sm ring-1 ring-inset ring-border-dark placeholder:text-placeholder-dark focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6 transition-shadow" id="email" name="email" placeholder="e.g., john.doe@example.com" type="email"/>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium leading-6 pb-2" htmlFor="subject">Subject</label>
                <select required className="form-select block w-full rounded-lg border-0 bg-field-dark py-3 px-4 shadow-sm ring-1 ring-inset ring-border-dark focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6 transition-shadow" id="subject" name="subject" defaultValue="General Inquiry">
                  <option>General Inquiry</option>
                  <option>Project Quote</option>
                  <option>Partnership</option>
                  <option>Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium leading-6 pb-2" htmlFor="message">Message</label>
                <textarea required className="form-textarea block w-full rounded-lg border-0 bg-field-dark py-3 px-4 shadow-sm ring-1 ring-inset ring-border-dark placeholder:text-placeholder-dark focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6 transition-shadow" id="message" name="message" placeholder="Write your message here..." rows={5}></textarea>
              </div>
              
              <div>
                <button 
                  className="w-full flex justify-center py-3 px-4 rounded-lg font-semibold text-white bg-primary shadow-sm hover:bg-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary transition-colors disabled:opacity-50" 
                  type="submit"
                  disabled={formStatus === 'sending'}
                >
                  {formStatus === 'sending' ? 'Sending...' : 'Send Message'}
                </button>
              </div>

              {formStatus === 'success' && (
                <p className="text-center text-green-400">Message sent successfully! We'll be in touch soon.</p>
              )}
              {formStatus === 'error' && (
                <p className="text-center text-brand-secondary">{errorMessage}</p>
              )}
            </form>
          </div>
        </div>
      </main>

      <footer className="bg-background-dark/50 border-t border-border-dark/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-sm text-text-dark/50">© 2025 FIRE Solutions. All rights reserved.</p>
            <div className="flex items-center gap-4 text-text-dark/50">
              <a className="hover:text-primary transition-colors" href="#"><span className="sr-only">Twitter</span>...</a>
              <a className="hover:text-primary transition-colors" href="#"><span className="sr-only">GitHub</span>...</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};