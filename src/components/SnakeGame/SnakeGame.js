import React, { useEffect, useRef, useState } from 'react';
import styles from './SnakeGame.module.css';

export default function SnakeGame() {
  const canvasRef = useRef(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  // 游戏状态变量
  const gameState = useRef({
    snake: [{x: 10, y: 10}],
    food: {x: 5, y: 5},
    direction: 'right',
    gridSize: 20,
    speed: 100,
    timer: null
  });

  // 初始化游戏
  const initGame = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // 清空画布
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // 重置游戏状态
    gameState.current.snake = [{x: 10, y: 10}];
    gameState.current.direction = 'right';
    setScore(0);
    setGameOver(false);
    
    // 生成食物
    placeFood();
    
    // 绘制初始状态
    drawSnake();
    drawFood();
  };

  // 开始游戏
  const startGame = () => {
    if (gameState.current.timer) {
      clearInterval(gameState.current.timer);
    }
    
    initGame();
    setGameStarted(true);
    
    gameState.current.timer = setInterval(() => {
      moveSnake();
    }, gameState.current.speed);
  };

  // 结束游戏
  const endGame = () => {
    clearInterval(gameState.current.timer);
    gameState.current.timer = null;
    setGameStarted(false);
    setGameOver(true);
  };

  // 移动蛇
  const moveSnake = () => {
    const snake = [...gameState.current.snake];
    let head = {...snake[0]};
    
    // 根据方向移动头部
    switch (gameState.current.direction) {
      case 'up': head.y--; break;
      case 'down': head.y++; break;
      case 'left': head.x--; break;
      case 'right': head.x++; break;
    }
    
    // 检查游戏结束条件
    if (
      head.x < 0 || head.x >= canvasRef.current.width / gameState.current.gridSize ||
      head.y < 0 || head.y >= canvasRef.current.height / gameState.current.gridSize ||
      snake.some(part => part.x === head.x && part.y === head.y)
    ) {
      endGame();
      return;
    }
    
    // 将新头部添加到蛇身
    snake.unshift(head);
    
    // 检查是否吃到食物
    const food = gameState.current.food;
    if (head.x === food.x && head.y === food.y) {
      setScore(prevScore => prevScore + 1);
      placeFood();
    } else {
      // 如果没吃到食物，移除尾部
      snake.pop();
    }
    
    // 更新蛇
    gameState.current.snake = snake;
    
    // 重新绘制游戏
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawSnake();
    drawFood();
  };

  // 绘制蛇
  const drawSnake = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const gridSize = gameState.current.gridSize;
    
    gameState.current.snake.forEach((part, index) => {
      ctx.fillStyle = index === 0 ? '#388e3c' : '#4caf50'; // 头部颜色略深
      ctx.fillRect(part.x * gridSize, part.y * gridSize, gridSize - 1, gridSize - 1);
    });
  };

  // 绘制食物
  const drawFood = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const food = gameState.current.food;
    const gridSize = gameState.current.gridSize;
    
    ctx.fillStyle = '#f44336';
    ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize - 1, gridSize - 1);
  };

  // 放置食物
  const placeFood = () => {
    const canvas = canvasRef.current;
    const gridSize = gameState.current.gridSize;
    const maxX = Math.floor(canvas.width / gridSize);
    const maxY = Math.floor(canvas.height / gridSize);
    
    // 生成随机位置
    let newFood;
    do {
      newFood = {
        x: Math.floor(Math.random() * maxX),
        y: Math.floor(Math.random() * maxY)
      };
      // 确保食物不会出现在蛇身上
    } while (gameState.current.snake.some(part => part.x === newFood.x && part.y === newFood.y));
    
    gameState.current.food = newFood;
  };

  // 处理键盘事件
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!gameStarted) return;
      
      const key = e.key;
      const direction = gameState.current.direction;
      
      // 防止180度转弯
      switch (key) {
        case 'ArrowUp':
          if (direction !== 'down') gameState.current.direction = 'up';
          break;
        case 'ArrowDown':
          if (direction !== 'up') gameState.current.direction = 'down';
          break;
        case 'ArrowLeft':
          if (direction !== 'right') gameState.current.direction = 'left';
          break;
        case 'ArrowRight':
          if (direction !== 'left') gameState.current.direction = 'right';
          break;
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      if (gameState.current.timer) {
        clearInterval(gameState.current.timer);
      }
    };
  }, [gameStarted]);

  return (
    <div className={styles.gameContainer}>
      <div className={styles.scoreBoard}>
        得分: {score}
      </div>
      
      <canvas
        ref={canvasRef}
        width={400}
        height={400}
        className={styles.gameCanvas}
      />
      
      <div className={styles.controls}>
        {!gameStarted && (
          <button className={styles.button} onClick={startGame}>
            {gameOver ? '重新开始' : '开始游戏'}
          </button>
        )}
        {gameStarted && (
          <button className={styles.button} onClick={endGame}>
            结束游戏
          </button>
        )}
      </div>
      
      <div className={styles.instructions}>
        <h3>游戏说明</h3>
        <p>使用键盘方向键控制蛇的移动。</p>
        <p>吃到红色食物可以增加分数和蛇的长度。</p>
        <p>碰到墙壁或自己的身体将结束游戏。</p>
      </div>
    </div>
  );
}
