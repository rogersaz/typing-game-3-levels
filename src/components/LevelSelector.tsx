import React from 'react';
import { GAME_LEVELS } from '../utils/gameConfig';

interface LevelSelectorProps {
  currentLevel: number;
  onLevelSelect: (level: number) => void;
  gameActive: boolean;
}

export const LevelSelector = ({ currentLevel, onLevelSelect, gameActive }: LevelSelectorProps) => {
  return (
    <div className="flex gap-4 justify-center mb-8">
      {Object.entries(GAME_LEVELS).map(([level, config]) => (
        <button
          key={level}
          onClick={() => !gameActive && onLevelSelect(Number(level))}
          className={`px-6 py-3 rounded-lg font-semibold transition ${
            currentLevel === Number(level)
              ? 'bg-blue-500 text-white'
              : 'bg-white/10 hover:bg-white/20'
          } ${gameActive ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={gameActive}
        >
          Level {level}: {config.name}
        </button>
      ))}
    </div>
  );
};