import { json, type MetaFunction } from "@remix-run/node";
import { useEffect, useState } from "react";
import { Form, useActionData } from "@remix-run/react";
import { Trophy, Keyboard } from "lucide-react";
import { supabase } from "~/utils/supabase.server";

export const meta: MetaFunction = () => {
  return [{ title: "Left Hand Typing Game" }];
};

const LEFT_KEYS = ['q', 'w', 'e', 'r', 't', 'a', 's', 'd', 'f', 'g', 'z', 'x', 'c', 'v', 'b'];

export async function action({ request }) {
  const formData = await request.formData();
  const name = formData.get("name");
  const score = formData.get("score");

  const { data, error } = await supabase
    .from('scores')
    .insert([{ name, score: parseInt(score) }])
    .select();

  if (error) {
    return json({ error: "Failed to save score" });
  }

  return json({ success: true });
}

function formatDateTime(dateString: string) {
  const date = new Date(dateString);
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  
  return {
    date: `${month}/${year}`,
    time: `${hours}:${minutes}`
  };
}

export default function Index() {
  const [gameActive, setGameActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [score, setScore] = useState(0);
  const [currentKey, setCurrentKey] = useState('');
  const [showNameInput, setShowNameInput] = useState(false);
  const [highScores, setHighScores] = useState([]);
  const actionData = useActionData();

  useEffect(() => {
    const fetchHighScores = async () => {
      const { data } = await supabase
        .from('scores')
        .select('*')
        .order('score', { ascending: false })
        .limit(10);
      if (data) setHighScores(data);
    };
    fetchHighScores();
  }, [actionData]);

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
      setCurrentKey(LEFT_KEYS[Math.floor(Math.random() * LEFT_KEYS.length)]);
    }
  }, [gameActive]);

  const handleKeyPress = (e) => {
    if (!gameActive) return;
    
    if (e.key === currentKey) {
      setScore((prev) => prev + 1);
      setCurrentKey(LEFT_KEYS[Math.floor(Math.random() * LEFT_KEYS.length)]);
    } else if (LEFT_KEYS.includes(e.key)) {
      setScore((prev) => prev - 2);
    }
  };

  useEffect(() => {
    window.addEventListener('keypress', handleKeyPress);
    return () => window.removeEventListener('keypress', handleKeyPress);
  }, [gameActive, currentKey]);

  const startGame = () => {
    setGameActive(true);
    setTimeLeft(60);
    setScore(0);
    setShowNameInput(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-purple-900 text-white p-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 flex items-center justify-center gap-2">
            <Keyboard className="w-8 h-8" />
            Left Hand Typing Game
          </h1>
          <p className="text-lg opacity-80">Practice typing with your left hand!</p>
        </div>

        <div className="bg-white/10 backdrop-blur-lg rounded-lg p-8 mb-8">
          {!gameActive && !showNameInput && (
            <button
              onClick={startGame}
              className="w-full py-4 bg-green-500 hover:bg-green-600 rounded-lg font-bold text-xl transition"
            >
              Start Game
            </button>
          )}

          {gameActive && (
            <div className="text-center">
              <div className="mb-4">
                <span className="text-2xl">Time: {timeLeft}s</span>
                <span className="mx-4">|</span>
                <span className="text-2xl">Score: {score}</span>
              </div>
              <div className="text-8xl font-mono my-8">{currentKey}</div>
            </div>
          )}

          {showNameInput && (
            <Form method="post" className="space-y-4">
              <div className="text-center mb-4">
                <h2 className="text-2xl font-bold">Game Over!</h2>
                <p className="text-xl">Final Score: {score}</p>
              </div>
              <input type="hidden" name="score" value={score} />
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
            </Form>
          )}
        </div>

        <div className="bg-white/10 backdrop-blur-lg rounded-lg p-8">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Trophy className="w-6 h-6" />
            High Scores
          </h2>
          <div className="space-y-2">
            {highScores.map((score, index) => {
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
            })}
          </div>
        </div>
      </div>
    </div>
  );
}