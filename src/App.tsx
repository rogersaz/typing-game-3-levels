import React, { useState, useEffect } from 'react';
import { Keyboard } from 'lucide-react';
import { supabase } from './utils/supabase';
import { HighScores } from './components/HighScores';
import { GameInstructions } from './components/GameInstructions';
import { LevelSelector } from './components/LevelSelector';
import { GAME_LEVELS } from './utils/gameConfig';

function App() {
  const [gameActive, setGameActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [score, setScore] = useState(0);
  const [currentKey, setCurrentKey] = useState('');
  const [showNameInput, setShowNameInput] = useState(false);
  const [highScores, setHighScores] = useState([]);
  const [isError, setIsError] = useState(false);
  const [currentLevel, setCurrentLevel] = useState(1);
  const [shiftPressed, setShiftPressed] = useState(false);

  useEffect(() => {
    const fetchHighScores = async () => {
      const { data, error } = await supabase
        .from('scores')
        .select('*')
        .order('score', { ascending: false });
      
      if (error) {
        console.error('Error fetching scores:', error);
        return;
      }
      
      if (data) setHighScores(data);
    };
    
    fetchHighScores();
  }, []);

  useEffect(() => {
    if (gameActive && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else if (timeLeft === 0) {
      setGameActive(false);
      setShowNameInput(true);
    }
  }, [gameActive, timeLeft]);

  useEffect(() => {
    if (gameActive) {
      const levelConfig = GAME_LEVELS[currentLevel];
      setCurrentKey(levelConfig.keys[Math.floor(Math.random() * levelConfig.keys.length)]);
    }
  }, [gameActive, currentLevel]);

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Shift') {
      setShiftPressed(true);
    }
  };

  const handleKeyUp = (e: KeyboardEvent) => {
    if (e.key === 'Shift') {
      setShiftPressed(false);
    }
  };

  const handleKeyPress = (e: KeyboardEvent) => {
    if (!gameActive) return;
    
    const levelConfig = GAME_LEVELS[currentLevel];
    let pressedKey = e.key;
    
    // For level 2, handle shift + number combinations
    if (currentLevel === 2 && levelConfig.requiresShift.includes(currentKey)) {
      if (!shiftPressed) return; // Ignore if shift isn't pressed for symbols
    }

    if (pressedKey === currentKey) {
      setScore((prev) => prev + levelConfig.correctPoints);
      setIsError(false);
      setCurrentKey(levelConfig.keys[Math.floor(Math.random() * levelConfig.keys.length)]);
    } else if (levelConfig.keys.includes(pressedKey)) {
      setScore((prev) => prev + levelConfig.incorrectPoints);
      setIsError(true);
    }
  };

  useEffect(() => {
    window.addEventListener('keypress', handleKeyPress);
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keypress', handleKeyPress);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [gameActive, currentKey, currentLevel, shiftPressed]);

  const startGame = () => {
    setGameActive(true);
    setTimeLeft(60);
    setScore(0);
    setShowNameInput(false);
    setIsError(false);
  };

  const handleScoreSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get('name') as string;

    const { error } = await supabase
      .from('scores')
      .insert([{ name, score, level: currentLevel }]);

    if (error) {
      console.error('Error saving score:', error);
      return;
    }

    const { data: newScores } = await supabase
      .from('scores')
      .select('*')
      .order('score', { ascending: false });

    if (newScores) {
      setHighScores(newScores);
    }

    setShowNameInput(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-purple-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 flex items-center justify-center gap-2">
            <Keyboard className="w-8 h-8" />
            Typing Game
          </h1>
          <p className="text-lg opacity-80">Practice typing with different challenges!</p>
        </div>

        <LevelSelector
          currentLevel={currentLevel}
          onLevelSelect={setCurrentLevel}
          gameActive={gameActive}
        />

        <div className="bg-white/10 backdrop-blur-lg rounded-lg p-8 mb-8">
          {!gameActive && !showNameInput && (
            <button
              onClick={startGame}
              className="w-full py-4 bg-green-500 hover:bg-green-600 rounded-lg font-bold text-xl transition"
            >
              Start Level {currentLevel}
            </button>
          )}

          {gameActive && (
            <div className="text-center">
              <div className="mb-4">
                <span className="text-2xl">Time: {timeLeft}s</span>
                <span className="mx-4">|</span>
                <span className="text-2xl">Score: {score}</span>
              </div>
              <div className={`text-8xl font-mono my-8 transition-colors ${isError ? 'text-red-500' : ''}`}>
                {currentKey}
              </div>
              {currentLevel === 2 && GAME_LEVELS[2].requiresShift.includes(currentKey) && (
                <div className="text-sm text-yellow-300 mt-2">
                  Hold SHIFT + {currentKey.replace(/[!@#$%]/g, (m) => ({ '!': '1', '@': '2', '#': '3', '$': '4', '%': '5' })[m])}
                </div>
              )}
            </div>
          )}

          {showNameInput && (
            <form onSubmit={handleScoreSubmit} className="space-y-4">
              <div className="text-center mb-4">
                <h2 className="text-2xl font-bold">Game Over!</h2>
                <p className="text-xl">Final Score: {score}</p>
              </div>
              <input
                type="text"
                name="name"
                maxLength={12}
                placeholder="Enter your name"
                className="w-full p-2 rounded bg-white/20 border border-white/30 focus:outline-none focus:ring-2 focus:ring-white/50"
                required
              />
              <button
                type="submit"
                className="w-full py-2 bg-blue-500 hover:bg-blue-600 rounded font-bold"
              >
                Save Score
              </button>
            </form>
          )}
        </div>

        <HighScores scores={highScores} currentLevel={currentLevel} />
        <GameInstructions level={currentLevel} />
      </div>
    </div>
  );
}

export default App;