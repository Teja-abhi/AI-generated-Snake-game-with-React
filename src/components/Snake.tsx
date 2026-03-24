import { useState, useEffect, useCallback } from 'react';

const GRID_SIZE = 20;
const INITIAL_SNAKE = [{ x: 10, y: 10 }];
const INITIAL_DIRECTION = { x: 0, y: -1 };
const SPEED = 120;

export function Snake() {
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [direction, setDirection] = useState(INITIAL_DIRECTION);
  const [food, setFood] = useState({ x: 5, y: 5 });
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [isStarted, setIsStarted] = useState(false);

  const generateFood = useCallback(() => {
    let newFood;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE)
      };
      // eslint-disable-next-line no-loop-func
      if (!snake.some(segment => segment.x === newFood.x && segment.y === newFood.y)) {
        break;
      }
    }
    setFood(newFood);
  }, [snake]);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setScore(0);
    setGameOver(false);
    setIsStarted(true);
    generateFood();
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isStarted && e.key !== 'Enter') return;
      
      switch (e.key) {
        case 'ArrowUp':
        case 'w':
          if (direction.y === 0) setDirection({ x: 0, y: -1 });
          break;
        case 'ArrowDown':
        case 's':
          if (direction.y === 0) setDirection({ x: 0, y: 1 });
          break;
        case 'ArrowLeft':
        case 'a':
          if (direction.x === 0) setDirection({ x: -1, y: 0 });
          break;
        case 'ArrowRight':
        case 'd':
          if (direction.x === 0) setDirection({ x: 1, y: 0 });
          break;
        case 'Enter':
          if (gameOver || !isStarted) resetGame();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [direction, gameOver, isStarted]);

  useEffect(() => {
    if (gameOver || !isStarted) return;

    const moveSnake = () => {
      setSnake(prev => {
        const head = prev[0];
        const newHead = { x: head.x + direction.x, y: head.y + direction.y };

        // Wall collision
        if (
          newHead.x < 0 || newHead.x >= GRID_SIZE ||
          newHead.y < 0 || newHead.y >= GRID_SIZE
        ) {
          setGameOver(true);
          return prev;
        }

        // Self collision
        if (prev.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
          setGameOver(true);
          return prev;
        }

        const newSnake = [newHead, ...prev];

        // Food collision
        if (newHead.x === food.x && newHead.y === food.y) {
          setScore(s => s + 10);
          generateFood();
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    };

    const intervalId = setInterval(moveSnake, SPEED);
    return () => clearInterval(intervalId);
  }, [direction, food, gameOver, isStarted, generateFood]);

  return (
    <div className="flex flex-col items-center">
      <div className="flex justify-between w-full max-w-[400px] mb-4 text-sm">
        <span className="text-neon-cyan">SCORE:{score.toString().padStart(4, '0')}</span>
        <span className="text-neon-magenta">{gameOver ? 'SYS_FAIL' : 'SYS_OK'}</span>
      </div>
      
      <div 
        className="relative bg-void border-4 border-neon-cyan shadow-[0_0_15px_rgba(0,255,255,0.5)]"
        style={{ 
          width: 400, 
          height: 400,
          display: 'grid',
          gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
          gridTemplateRows: `repeat(${GRID_SIZE}, 1fr)`
        }}
      >
        {!isStarted && !gameOver && (
          <div className="absolute inset-0 flex items-center justify-center bg-void/80 z-10">
            <span className="text-neon-green animate-pulse text-center leading-loose">
              PRESS ENTER<br/>TO INITIALIZE
            </span>
          </div>
        )}
        
        {gameOver && (
          <div className="absolute inset-0 flex items-center justify-center bg-void/90 z-10 flex-col gap-4">
            <span className="text-neon-magenta text-xl glitch" data-text="FATAL ERROR">FATAL ERROR</span>
            <span className="text-neon-cyan text-xs">PRESS ENTER TO REBOOT</span>
          </div>
        )}

        {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, i) => {
          const x = i % GRID_SIZE;
          const y = Math.floor(i / GRID_SIZE);
          const isSnakeHead = snake[0].x === x && snake[0].y === y;
          const isSnakeBody = snake.some((s, idx) => idx !== 0 && s.x === x && s.y === y);
          const isFood = food.x === x && food.y === y;

          return (
            <div 
              key={i}
              className={`
                ${isSnakeHead ? 'bg-neon-magenta shadow-[0_0_10px_#f0f]' : ''}
                ${isSnakeBody ? 'bg-neon-cyan shadow-[0_0_5px_#0ff] opacity-80' : ''}
                ${isFood ? 'bg-neon-green shadow-[0_0_10px_#0f0] animate-pulse' : ''}
              `}
            />
          );
        })}
      </div>
    </div>
  );
}
