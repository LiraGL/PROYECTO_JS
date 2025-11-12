export const DIFFICULTIES = {
  beginner:    { aiSpeed: 140, reactionTime: 1.2, precision: 0.6 },
  intermediate:{ aiSpeed: 200, reactionTime: 0.7, precision: 0.8 },
  expert:      { aiSpeed: 280, reactionTime: 0.3, precision: 0.95 }
};

export function getDifficulty(level) {
  return DIFFICULTIES[level] || DIFFICULTIES.intermediate;
}
