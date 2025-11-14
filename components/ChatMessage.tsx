import React, { useState, useEffect, useRef } from 'react';
import type { Message } from '../types';
import { Volume2Icon, VolumeXIcon, LoaderIcon, LinkIcon } from './icons';
import { GoogleGenAI, Modality } from '@google/genai';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface ChatMessageProps {
  message: Message;
  isStreaming?: boolean;
}

// --- Audio Decoding Helpers from Gemini Docs ---

function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}


export const ChatMessage: React.FC<ChatMessageProps> = ({ message, isStreaming }) => {
  const { role, parts, groundingMetadata } = message;
  const text = parts[0]?.text || '';
  const isBot = role === 'model';

  const [isPlaying, setIsPlaying] = useState(false);
  const [isSpeakingLoading, setIsSpeakingLoading] = useState(false);
  const audioSourceRef = useRef<AudioBufferSourceNode | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  
  // Cleanup audio on unmount or if message changes
  useEffect(() => {
    return () => {
      if (audioSourceRef.current) {
        audioSourceRef.current.stop();
        audioSourceRef.current = null;
      }
    };
  }, [message]);

  const handleSpeak = async () => {
    if (isPlaying && audioSourceRef.current) {
      audioSourceRef.current.stop();
      // onended will handle state changes
      return;
    }

    if (isSpeakingLoading || !text) return;
    
    if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
    }
    const outputAudioContext = audioContextRef.current;
    
    // Resume context if it was suspended
    if (outputAudioContext.state === 'suspended') {
      await outputAudioContext.resume();
    }

    setIsSpeakingLoading(true);
    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash-preview-tts",
            contents: [{ parts: [{ text: `Say with a professional and helpful tone: ${text}` }] }],
            config: {
                responseModalities: [Modality.AUDIO],
                speechConfig: {
                    voiceConfig: {
                        prebuiltVoiceConfig: { voiceName: 'Algenib' }, // Using a stable voice
                    },
                },
            },
        });
        
        const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
        if (!base64Audio) {
            throw new Error("No audio data received from API.");
        }

        const audioBuffer = await decodeAudioData(
            decode(base64Audio),
            outputAudioContext,
            24000,
            1,
        );

        const source = outputAudioContext.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(outputAudioContext.destination);
        source.start();

        audioSourceRef.current = source;
        setIsPlaying(true);
        
        source.onended = () => {
            setIsPlaying(false);
            audioSourceRef.current = null;
        };

    } catch (error) {
        console.error("Text-to-Speech Error:", error);
        setIsPlaying(false);
    } finally {
        setIsSpeakingLoading(false);
    }
  };
  
  const markdownComponents = {
      code({ node, className, children, ...props }: {node?: any; inline?: any; className?: string; children?: React.ReactNode;}) {
        const match = /language-(\w+)/.exec(className || '');
        return match ? (
            <div className="bg-gray-900 rounded-md my-2">
                <div className="flex items-center justify-between px-4 py-1 bg-gray-800 rounded-t-md">
                    <span className="text-xs text-gray-400">{match[1]}</span>
                </div>
                <pre className="p-4 text-sm overflow-x-auto">
                    <code className={className} {...props}>
                        {children}
                    </code>
                </pre>
            </div>
        ) : (
            <code className="bg-gray-700 text-brand-highlight rounded-sm px-1 py-0.5 mx-0.5 font-mono text-sm" {...props}>
                {children}
            </code>
        );
    },
    h1: ({node, ...props}: any) => <h1 className="text-2xl font-bold font-heading my-4" {...props} />,
    h2: ({node, ...props}: any) => <h2 className="text-xl font-bold font-heading my-3" {...props} />,
    h3: ({node, ...props}: any) => <h3 className="text-lg font-bold font-heading my-2" {...props} />,
    ul: ({node, ...props}: any) => <ul className="list-disc list-inside space-y-2 my-4 pl-4" {...props} />,
    ol: ({node, ...props}: any) => <ol className="list-decimal list-inside space-y-2 my-4 pl-4" {...props} />,
    a: ({node, ...props}: any) => <a className="text-brand-primary hover:underline" target="_blank" rel="noopener noreferrer" {...props} />,
    p: ({node, ...props}: any) => <p className="mb-4 last:mb-0" {...props} />,
  }

  const hasSources = groundingMetadata && groundingMetadata.groundingChunks.length > 0;

  // This is the "thinking" bubble
  if (isBot && isStreaming && !text) {
    return (
      <div className="flex items-end gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-ai-bubble-dark">
          <span className="material-symbols-outlined text-primary" style={{fontVariationSettings: "'FILL' 1"}}>robot_2</span>
        </div>
        <div className="flex flex-col gap-1 items-start">
          <div className="flex items-baseline gap-2">
            <p className="text-text-light text-[13px] font-bold leading-normal">Sparky</p>
          </div>
          <div className="flex max-w-xl items-center gap-2 rounded-lg px-4 py-3 bg-ai-bubble-dark text-text-light">
            <div className="w-2 h-2 rounded-full bg-text-subtle-dark animate-pulse"></div>
            <div className="w-2 h-2 rounded-full bg-text-subtle-dark animate-pulse [animation-delay:0.2s]"></div>
            <div className="w-2 h-2 rounded-full bg-text-subtle-dark animate-pulse [animation-delay:0.4s]"></div>
          </div>
        </div>
      </div>
    );
  }
  
  // This is the main message component
  return (
    <div className={`flex items-end gap-3 ${!isBot ? 'justify-end' : ''}`}>
      {/* Avatar (Bot) */}
      {isBot && (
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-ai-bubble-dark">
          <span className="material-symbols-outlined text-primary" style={{fontVariationSettings: "'FILL' 1"}}>robot_2</span>
        </div>
      )}

      {/* Message Bubble & Content */}
      <div className={`flex flex-col gap-1 ${!isBot ? 'items-end' : 'items-start'}`}>
        <div className="flex items-baseline gap-2">
          <p className="text-text-light text-[13px] font-bold leading-normal">{isBot ? 'Sparky' : 'You'}</p>
          {/* <p className="text-text-subtle-dark text-xs">9:41 AM</p> */}
        </div>
        
        <div className={`max-w-xl rounded-lg px-4 py-3 ${isBot ? 'bg-ai-bubble-dark text-orange-100' : 'bg-gradient-to-r from-accent-orange to-accent-yellow text-black'}`}>
          <div className="prose prose-invert prose-sm max-w-none text-inherit">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                ...markdownComponents,
                // Override default prose styles for links to match bubble color
                a: ({node, ...props}: any) => <a className="text-inherit font-bold hover:underline" {...props} />,
                p: ({node, ...props}: any) => <p className="text-inherit" {...props} />,
              }}
            >
              {text}
            </ReactMarkdown>
            {isBot && isStreaming && <span className="inline-block w-2 h-4 bg-primary animate-pulse ml-1" />}
          </div>
        </div>

        {/* TTS and Sources (Only for Bot) */}
        {isBot && !isStreaming && (text || hasSources) && (
          <div className="flex items-center gap-2 mt-2">
            {text && (
              <button
                  onClick={handleSpeak}
                  disabled={isSpeakingLoading}
                  className="text-text-subtle-dark hover:text-accent-orange disabled:text-gray-600 disabled:cursor-wait transition-colors focus:outline-none focus:ring-2 focus:ring-accent-orange rounded-full p-1"
                  aria-label={isPlaying ? "Stop reading aloud" : "Read message aloud"}
              >
                  {isSpeakingLoading ? <LoaderIcon className="w-5 h-5 animate-spin" /> : (
                      isPlaying ? <VolumeXIcon className="w-5 h-5" /> : <Volume2Icon className="w-5 h-5" />
                  )}
              </button>
            )}
            {hasSources && (
              <div className="flex flex-wrap gap-2">
                  {groundingMetadata.groundingChunks.map((chunk, index) => 
                      chunk.web ? (
                          <a key={index} href={chunk.web.uri} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-xs text-text-subtle-dark bg-ai-bubble-dark hover:bg-secondary-dark hover:text-accent-orange transition-colors rounded-full px-2 py-1 border border-secondary-dark">
                             <LinkIcon className="w-3 h-3 flex-shrink-0" />
                             <span className="truncate max-w-[200px]">{chunk.web.title || chunk.web.uri}</span>
                          </a>
                      ) : null
                  )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Avatar (User) */}
      {!isBot && (
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-secondary-dark">
          <span className="material-symbols-outlined text-text-light">person</span>
        </div>
      )}
    </div>
  );
};
