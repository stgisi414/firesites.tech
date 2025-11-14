import React from 'react';
import type { AppState } from '../types';
import { MainHeader } from './MainHeader';

interface AboutPageProps {
  appState: AppState;
  onStartProject: () => void;
  onLogoClick: () => void;
  onGoToServices: () => void;
  onGoToPricing: () => void;
  onGoToCaseStudies: () => void;
  onGoToContact: () => void;
}

export const About: React.FC<AboutPageProps> = ({
  appState,
  onStartProject, 
  onLogoClick, 
  onGoToServices, 
  onGoToPricing, 
  onGoToCaseStudies,
  onGoToContact
}) => {
  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden text-white bg-background-dark font-display antialiased">
      {/* Background Glow */}
      <div className="absolute inset-0 z-0">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[150%] h-[100%] sm:w-[120%] sm:h-[80%] md:w-[100%] md:h-[70%] bg-primary/20 rounded-full blur-3xl filter opacity-30"></div>
      </div>
      
      <div className="relative z-10 flex h-full grow flex-col">
        <MainHeader
          appState={appState}
          onLogoClick={onLogoClick} // Or onLogoClick={() => {}} if you want it to do nothing on landing
          onGoToServices={onGoToServices}
          onGoToPricing={onGoToPricing}
          onGoToCaseStudies={onGoToCaseStudies}
          onGoToAbout={onGoToAbout}
          onGoToContact={onGoToContact}
          onStartProject={onStartProject}
        />

        <main className="flex flex-col gap-12 md:gap-16 lg:gap-20 py-10 md:py-16">
          <section className="flex flex-col gap-6 px-4 py-10 @[480px]:gap-8 @[864px]:flex-row-reverse @[864px]:items-center">
            <div className="flex-shrink-0 @[864px]:w-1/3">
              <div 
                className="w-full aspect-square bg-center bg-no-repeat bg-cover rounded-full mx-auto max-w-[250px] @[864px]:max-w-none border-4 border-white/10 shadow-lg" 
                data-alt="Professional headshot of founder Stefan Gisi" 
                style={{backgroundImage: 'url("https://stefangisi.info/attached_assets/image_1744908628095.png")'}}
              ></div>
            </div>
            <div className="flex flex-col gap-6 @[480px]:gap-8 @[864px]:justify-center @[864px]:flex-1">
              <div className="flex flex-col gap-2 text-center @[864px]:text-left">
                <h1 className="text-white text-4xl font-black leading-tight tracking-[-0.033em] md:text-5xl">Pioneering the Future with the FIRE Stack</h1>
                <p className="text-white/80 text-base font-normal leading-normal md:text-lg">Building powerful, modern, and efficient custom solutions with cutting-edge technology.</p>
              </div>
            </div>
          </section>

          <div className="bg-white/5 rounded-xl p-6 md:p-10 mx-4">
            <h2 className="text-white text-[22px] font-bold leading-tight tracking-[-0.015em] pb-3 pt-5">Meet the Founder</h2>
            <p className="text-white/80 text-base font-normal leading-relaxed pb-3 pt-1">Stefan Gisi, the visionary behind this venture, is a dedicated technologist with a passion for crafting exceptional digital experiences. He specializes in leveraging the power and innovation of the FIRE stack to build robust and scalable custom solutions for clients.</p>
            <p className="text-white/80 text-base font-normal leading-relaxed pb-3 pt-1">The FIRE stack represents the modern frontier of web development, combining best-in-class technologies to deliver unparalleled performance and efficiency. We harness this power to turn complex challenges into elegant, high-performing digital products.</p>
          </div>

          <section className="px-4">
            <h3 className="text-white text-lg font-bold leading-tight tracking-[-0.015em] text-center mb-8">3 Years of Mastery & Innovation</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div className="flex flex-col items-center gap-3">
                <div className="flex items-center justify-center size-12 bg-primary/20 rounded-full text-primary">
                  <span className="material-symbols-outlined !text-3xl">local_fire_department</span>
                </div>
                <h4 className="font-bold text-white">Emergence</h4>
                <p className="text-sm text-white/70">Embracing the FIRE stack since its mainstream emergence with Google's advancements in 2023.</p>
              </div>
              <div className="flex flex-col items-center gap-3">
                <div className="flex items-center justify-center size-12 bg-primary/20 rounded-full text-primary">
                  <span className="material-symbols-outlined !text-3xl">trending_up</span>
                </div>
                <h4 className="font-bold text-white">Mastery</h4>
                <p className="text-sm text-white/70">Three years dedicated to mastering the nuances and unlocking the full potential of the stack.</p>
              </div>
              <div className="flex flex-col items-center gap-3">
                <div className="flex items-center justify-center size-12 bg-primary/20 rounded-full text-primary">
                  <span className="material-symbols-outlined !text-3xl">auto_awesome</span>
                </div>
                <h4 className="font-bold text-white">Innovation</h4>
                <p className="text-sm text-white/70">Continuously pushing boundaries to build innovative, future-proof solutions for our clients.</p>
              </div>
            </div>
          </section>

          <section className="text-center bg-gradient-to-r from-primary/30 to-orange-500/30 rounded-xl p-8 md:p-12 mx-4">
            <div className="flex flex-col gap-4 items-center">
              <h2 className="text-2xl md:text-3xl font-bold text-white">See the Power in Action</h2>
              <p className="text-white/90 max-w-2xl">Explore a collection of projects that showcase the capabilities of the FIRE stack and our commitment to quality.</p>
              <a 
                className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-5 bg-primary text-white text-base font-bold leading-normal tracking-[0.015em] mt-4 hover:bg-orange-600 transition-colors shadow-lg shadow-primary/30" 
                href="https://www.stefangisi.info" 
                rel="noopener noreferrer" 
                target="_blank"
              >
                <span className="truncate">View My Portfolio</span>
              </a>
            </div>
          </section>
        </main>

        <footer className="border-t border-solid border-white/10 mt-16 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 text-sm text-white/60 text-center md:text-left px-4 md:px-10">
            <p>© 2025 FIRE Solutions. All Rights Reserved.</p>
            <div className="flex items-center gap-4">
              <a className="hover:text-white transition-colors" data-alt="Link to Twitter profile" href="#"><svg className="size-5" fill="currentColor" viewBox="0 0 24 24"><path d="M22.46,6C21.69,6.35 20.86,6.58 20,6.69C20.88,6.16 21.56,5.32 21.88,4.31C21.05,4.81 20.13,5.16 19.16,5.36C18.37,4.5 17.26,4 16,4C13.65,4 11.73,5.92 11.73,8.29C11.73,8.63 11.77,8.96 11.84,9.27C8.28,9.09 5.11,7.38 3,4.79C2.63,5.42 2.42,6.16 2.42,6.94C2.42,8.43 3.17,9.75 4.33,10.5C3.62,10.5 2.96,10.3 2.38,10C2.38,10 2.38,10 2.38,10.03C2.38,12.11 3.86,13.85 5.82,14.24C5.46,14.34 5.08,14.39 4.69,14.39C4.42,14.39 4.15,14.36 3.89,14.31C4.43,16 6,17.26 7.89,17.29C6.43,18.45 4.58,19.13 2.56,19.13C2.22,19.13 1.88,19.11 1.54,19.07C3.44,20.29 5.7,21 8.12,21C16,21 20.33,14.46 20.33,8.79C20.33,8.6 20.33,8.42 20.32,8.23C21.16,7.63 21.88,6.87 22.46,6Z"></path></svg></a>
              <a className="hover:text-white transition-colors" data-alt="Link to LinkedIn profile" href="#"><svg className="size-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19,3A2,2 0 0,1 21,5V19A2,2 0 0,1 19,21H5A2,2 0 0,1 3,19V5A2,2 0 0,1 5,3H19M18.5,18.5V13.2A3.26,3.26 0 0,0 15.24,9.94C14.39,9.94 13.4,10.43 12.92,11.24V10.13H10.13V18.5H12.92V13.57C12.92,12.8 13.54,12.17 14.31,12.17C15.08,12.17 15.71,12.8 15.71,13.57V18.5H18.5M6.88,8.56A1.68,1.68 0 0,0 8.56,6.88C8.56,6 7.78,5.2 6.88,5.2A1.68,1.68 0 0,0 5.2,6.88C5.2,7.78 6,8.56 6.88,8.56M8.27,18.5V10.13H5.5V18.5H8.27Z"></path></svg></a>
              <a className="hover:text-white transition-colors" data-alt="Link to GitHub profile" href="#"><svg className="size-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12,2A10,10 0 0,0 2,12C2,16.42 4.87,20.17 8.84,21.5C9.34,21.58 9.5,21.27 9.5,21C9.5,20.77 9.5,20.14 9.5,19.31C6.73,19.91 6.14,17.97 6.14,17.97C5.68,16.81 5.03,16.5 5.03,16.5C4.12,15.88 5.1,15.9 5.1,15.9C6.1,15.97 6.63,16.93 6.63,16.93C7.5,18.45 8.97,18 9.54,17.76C9.63,17.11 9.89,16.67 10.17,16.42C7.95,16.17 5.62,15.31 5.62,11.5C5.62,10.39 6,9.5 6.65,8.79C6.55,8.54 6.2,7.5 6.75,6.15C6.75,6.15 7.59,5.88 9.5,7.17C10.29,6.95 11.15,6.84 12,6.84C12.85,6.84 13.71,6.95 14.5,7.17C16.41,5.88 17.25,6.15 17.25,6.15C17.8,7.5 17.45,8.54 17.35,8.79C18,9.5 18.38,10.39 18.38,11.5C18.38,15.32 16.04,16.16 13.81,16.41C14.17,16.72 14.5,17.33 14.5,18.26C14.5,19.6 14.5,20.68 14.5,21C14.5,21.27 14.66,21.59 15.17,21.5C19.14,20.16 22,16.42 22,12A10,10 0 0,0 12,2Z"></path></svg></a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};