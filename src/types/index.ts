export interface Question {
  id: string;
  text: string;
  emoji: string;
  stoneMatches: Record<string, number>; // pierre -> points
}

export interface Stone {
  id: string;
  name: string;
  emoji: string;
  description: string;
  properties: string[];
  usage: string;
  color: string;
}

export interface SwipeResult {
  questionId: string;
  liked: boolean;
}

export interface MatchResult {
  stone: Stone;
  score: number;
  percentage: number;
}
