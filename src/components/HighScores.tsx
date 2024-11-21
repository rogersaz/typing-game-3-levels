import React, { useState } from 'react';
import { Trophy } from 'lucide-react';
import { formatDateTime } from '../utils/dateFormat';
import { GAME_LEVELS } from '../utils/gameConfig';

interface Score {
  name: string;
  score: number;
  created_at: string;
  level: number;
}

interface HighScoresProps {
  scores: Score[];
  currentLevel: number;
}

export const HighScores = ({ scores, currentLevel }: HighScoresProps) => {
  const levelScores = scores.filter(score => score.level === currentLevel);

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-lg p-8">
      <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
        <Trophy className="w-6 h-6" />
        High Scores - Level {currentLevel}: {GAME_LEVELS[currentLevel].name}
      </h2>
      <div className="space-y-2">
        {levelScores.length > 0 ? (
          levelScores.map((score, index) => {
            const { date, time } = formatDateTime(score.created_at);
            return (
              <div
                key={index}
                className="flex items-center py-2 border-b border-white/20"
              >
                <span className="font-mono w-8">
                  {index + 1}.
                </span>
                <span className="font-mono flex-1">
                  {score.name}
                </span>
                <div className="flex items-center gap-4">
                  <span className="text-sm opacity-75">
                    {date} at {time}
                  </span>
                  <span className="font-bold w-16 text-right">
                    {score.score}
                  </span>
                </div>
              </div>
            );
          })
        ) : (
          <p className="text-center text-gray-400">No scores yet for this level. Be the first to play!</p>
        )}
      </div>
    </div>
  );
};