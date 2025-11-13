import React, { useState, useEffect, useRef } from 'react';
import type { Message } from '../types';
import { BotIcon, UserIcon, Volume2Icon, VolumeXIcon, LoaderIcon, LinkIcon } from './icons';
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
                        prebuiltVoiceConfig: { voiceName: 'Puck' }, // Using a stable voice
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
  
  return (
    <div className="max-w-3xl mx-auto">
      <div className={`flex items-start gap-4 ${isBot ? '' : 'flex-row-reverse'}`}>
        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${isBot ? 'bg-brand-primary' : 'bg-gray-600'}`}>
          {isBot ? <BotIcon className="w-5 h-5 text-white" /> : <UserIcon className="w-5 h-5 text-white" />}
        </div>
        
        <div className={`px-4 py-3 rounded-lg max-w-[85%] md:max-w-[75%] ${isBot ? 'bg-gray-800' : 'bg-brand-secondary'}`}>
            {isBot ? (
                 isStreaming && !text ? (
                    <div className="flex items-center text-gray-400">
                        <LoaderIcon className="w-5 h-5 mr-2 animate-spin" />
                        <span>Sparky is thinking...</span>
                    </div>
                 ) : (
                    <div className="prose prose-invert prose-sm max-w-none">
                       <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
                          {text}
                       </ReactMarkdown>
                       {isStreaming && <span className="inline-block w-2 h-4 bg-brand-highlight animate-pulse ml-1" />}
                    </div>
                 )
            ) : (
                <p className="whitespace-pre-wrap">{text}</p>
            )}

          {isBot && !isStreaming && text && (
             <div className="mt-2 pt-2 border-t border-gray-700/50">
                <button
                    onClick={handleSpeak}
                    disabled={isSpeakingLoading}
                    className="text-gray-400 hover:text-brand-highlight disabled:text-gray-600 disabled:cursor-wait transition-colors focus:outline-none focus:ring-2 focus:ring-brand-highlight rounded-full p-1"
                    aria-label={isPlaying ? "Stop reading aloud" : "Read message aloud"}
                >
                    {isSpeakingLoading ? <LoaderIcon className="w-5 h-5 animate-spin" /> : (
                        isPlaying ? <VolumeXIcon className="w-5 h-5" /> : <Volume2Icon className="w-5 h-5" />
                    )}
                </button>
            </div>
          )}
        </div>
      </div>
      
      {isBot && !isStreaming && hasSources && (
        <div className="pl-12 mt-2">
            <h4 className="text-xs font-bold text-gray-500 uppercase mb-1">Sources</h4>
            <ul className="flex flex-wrap gap-2">
                {groundingMetadata.groundingChunks.map((chunk, index) => 
                    chunk.web ? (
                        <li key={index}>
                            <a href={chunk.web.uri} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-xs text-gray-400 bg-gray-800 hover:bg-gray-700 hover:text-brand-highlight transition-colors rounded-full px-2 py-1 border border-gray-700">
                               <LinkIcon className="w-3 h-3 flex-shrink-0" />
                               <span className="truncate max-w-[200px]">{chunk.web.title || chunk.web.uri}</span>
                            </a>
                        </li>
                    ) : null
                )}
            </ul>
        </div>
      )}
    </div>
  );
};
