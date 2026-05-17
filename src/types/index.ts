export interface Question {
  id: string;
  text: string;
  icon: string; // path to icon in public/icons (e.g. /icons/fatigue.png)
  stoneMatches: Record<string, number>; // pierre -> points
}

export interface Stone {
  id: string;
  name: string;
  icon: string; // path to icon in public/pierres (e.g. /pierres/améthyste.png)
  description: string;
  properties: string[];
  usage: string;
  color: string;
}

export interface SwipeResult {
  questionId: string;
  liked: boolean;
}

export interface SwipeSession {
  id: string;
  completedAt: string;
  results: SwipeResult[];
}

export interface MatchResult {
  stone: Stone;
  score: number;
  percentage: number;
}

export interface HistoryEntry {
  id: string;
  completedAt: string;
  matches: MatchResult[];
}
