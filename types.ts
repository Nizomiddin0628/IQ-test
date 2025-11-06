
export enum Screen {
  Home,
  Calibration,
  Test,
  Results,
}

export interface MatrixQuestion {
  reasoning: string;
  grid: string[];
  options: string[];
  correctOptionIndex: number;
}

export interface CognitiveProfile {
  name: string;
  score: number;
  fullMark: number;
}

export interface TestResult {
  iqScore: number;
  percentile: number;
  cognitiveProfile: CognitiveProfile[];
  strengths: string[];
  weaknesses: string[];
  totalTimeSeconds: number;
}
