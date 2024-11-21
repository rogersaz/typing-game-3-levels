import React from 'react';
import { Info } from 'lucide-react';
import { GAME_LEVELS } from '../utils/gameConfig';

interface GameInstructionsProps {
  level: number;
}

export const GameInstructions = ({ level }: GameInstructionsProps) => {
  const levelConfig = GAME_LEVELS[level];
  
  const getLevelInstructions = () => {
    switch (level) {
      case 1:
        return (
          <>
            <li>Type the displayed letter using your left hand only</li>
            <li>Only letters on the left side of the keyboard are used: Q, W, E, R, T, A, S, D, F, G, Z, X, C, V, B</li>
          </>
        );
      case 2:
        return (
          <>
            <li>Type numbers and symbols using your left hand</li>
            <li>Numbers (1, 2, 3, 4, 5) and symbols (!, @, #, $, %)</li>
            <li>For symbols, hold SHIFT while pressing the corresponding number</li>
          </>
        );
      case 3:
        return (
          <>
            <li>Type letters from both sides of the keyboard</li>
            <li>Includes all letters from Level 1 plus: Y, U, I, O, P, H, J, K, L, N, M</li>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-lg p-8 mt-8">
      <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
        <Info className="w-6 h-6" />
        How to Play - Level {level}
      </h2>
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold mb-2">Game Rules:</h3>
          <ul className="list-disc list-inside space-y-2 text-gray-200">
            {getLevelInstructions()}
            <li>You have 60 seconds to achieve the highest score possible</li>
          </ul>
        </div>
        
        <div>
          <h3 className="text-lg font-semibold mb-2">Scoring System:</h3>
          <ul className="list-disc list-inside space-y-2 text-gray-200">
            <li>{levelConfig.correctPoints} point{levelConfig.correctPoints > 1 ? 's' : ''} for each correct keystroke</li>
            <li>{levelConfig.incorrectPoints} points for each incorrect keystroke</li>
            <li>The letter will turn red when you make a mistake</li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2">Tips:</h3>
          <ul className="list-disc list-inside space-y-2 text-gray-200">
            <li>Position your hands properly on the keyboard for best results</li>
            <li>Focus on accuracy rather than speed to avoid penalties</li>
            <li>Practice regularly to improve your typing skills</li>
          </ul>
        </div>
      </div>
    </div>
  );
};