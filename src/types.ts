export interface ResumeRoastResult {
  overallScore: number;
  roastSummary: string;
  weaknesses: string[];
  strengths: string[];
  suggestions: string[];
}

export interface ExtractResponse {
  text: string;
  wordCount: number;
  fileName: string;
  totalUniqueCount?: number;
}

export interface RoastResponse {
  success: boolean;
  data?: ResumeRoastResult;
  error?: string;
}
