export interface MessagePart {
  text: string;
}

export interface GroundingChunk {
  web?: {
    uri: string;
    title: string;
  };
}

export interface GroundingMetadata {
  groundingChunks: GroundingChunk[];
}


export interface Message {
  role: 'user' | 'model';
  parts: MessagePart[];
  groundingMetadata?: GroundingMetadata;
}

export interface Lead {
  fullName: string;
  email: string;
  projectDescription: string;
  budget: string;
}

export interface IntakeData {
  fullName: string;
  projectIdea: string;
  jobTitle: string;
  industry: string;
  experience: string;
  goal: string;
  budget: string;
}

export type AppState = 'loading' | 'landing' | 'intake' | 'chatting' | 'qualifying' | 'qualified' | 'calculators' | 'services' | 'pricing' | 'caseStudies';