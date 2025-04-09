import React, { useEffect, useRef, useState } from 'react';
import styles from './SnakeGame.module.css';

const SnakeGame = () => {
  const [snakeArray, setSnakeArray] = useState([]);
  const [snakeBoxSize] = useState(40);
  const [snakePointWidth] = useState(10);
  const [snakeLen] = useState(5);
  const [snakeEats, setSnakeEats] = useState(-1);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);

  const snakeHeadRef = useRef(null);
  const snakeMoveRef = useRef(39); // 默认向右移动
  const intervalIdRef = useRef(null);

  // 蛇节点构造函数
  class SnakeNode {
    constructor(idx) {
      this.pointIndex = idx;
      this.next = null;
    }
  }

  // 初始化游戏
  const initGame = () => {
    console.log('初始化游戏开始');
    
    
    // 创建游戏板块
    const newSnakeArray = [];
    for (let i = 0; i < snakeBoxSize * snakeBoxSize; i++) {
      newSnakeArray.push({
        id: i,
        isSel: false
      });
    }
    setSnakeArray(newSnakeArray);

    // 创建蛇头和初始蛇身
    const startPosition = Math.floor(snakeBoxSize * snakeBoxSize / 2);
    const snakeHead = new SnakeNode(startPosition);
    snakeHeadRef.current = snakeHead;

    // 初始化蛇身，从右向左依次添加节点
    for (let i = 1; i < snakeLen; i++) {
      insertNode(startPosition - i);
    }

    // 显示蛇
    showNode();

    // 生成食物
    newSnakeEats();

    // 重置游戏状态
    setScore(0);
    setGameOver(false);
    setGameStarted(true);

    console.log('正在启动游戏计时器...');

    // setInterval(() => {
    //   console.log('游戏开始');
    // }, 1000);
    
    // 清除旧的计时器
    if (intervalIdRef.current) {
      console.log('清除旧的计时器');
      clearInterval(intervalIdRef.current);
      intervalIdRef.current = null;
    }    // 启动新的计时器
    console.log('设置新的计时器');
    intervalIdRef.current = setInterval(() => {
      console.log('计时器触发移动');
      snakeMoving();
    }, 200);  // 速度调整为200ms一次移动

    console.log('游戏初始化完成，计时器ID:', intervalIdRef.current);
  };

  // 插入蛇身节点
  const insertNode = (idx) => {
    const newNode = new SnakeNode(idx);
    const snakeHead = snakeHeadRef.current;
    const pNode = snakeHead;
    const currNode = snakeHead;

    if (currNode.next != null) {
      newNode.next = currNode.next;
      pNode.next = newNode;
    } else {
      currNode.next = newNode;
    }
  };

  // 显示蛇身
  const showNode = () => {
    setSnakeArray(prevArray => {
      const newArray = [...prevArray];
      let currNode = snakeHeadRef.current;
      
      while (currNode.next != null) {
        currNode = currNode.next;
        const pointIndex = currNode.pointIndex;
        if (pointIndex >= 0 && pointIndex < newArray.length) {
          newArray[pointIndex] = { ...newArray[pointIndex], isSel: true };
        }
      }
      
      return newArray;
    });
  };

  // 移除尾部节点
  const removeNode = () => {
    let currNode = snakeHeadRef.current;
    let frontNode = currNode;
    
    while (currNode.next != null) {
      frontNode = currNode;
      currNode = currNode.next;
    }
    
    if (frontNode !== snakeHeadRef.current) {
      const pointIndex = currNode.pointIndex;
      frontNode.next = null;
      
      setSnakeArray(prevArray => {
        const newArray = [...prevArray];
        if (pointIndex >= 0 && pointIndex < newArray.length) {
          newArray[pointIndex] = { ...newArray[pointIndex], isSel: false };
        }
        return newArray;
      });
    }
  };

  // 蛇移动逻辑
  const snakeMoving = () => {
    if (gameOver || !gameStarted) {
      console.log('游戏未开始或已结束，停止移动');
      return;
    }
    
    const snakeHead = snakeHeadRef.current;
    if (!snakeHead) {
      console.log('找不到蛇头节点');
      return;
    }
    
    console.log('当前移动方向:', snakeMoveRef.current);
    // 修正：直接使用蛇头的位置
    const currentHeadIndex = snakeHead.pointIndex;
    console.log('当前蛇头位置:', currentHeadIndex);
    
    let newIndex;
    
    switch (snakeMoveRef.current) {
      case 37: // 左
        if (currentHeadIndex % snakeBoxSize === 0) {
          newIndex = currentHeadIndex + snakeBoxSize - 1;
        } else {
          newIndex = currentHeadIndex - 1;
        }
        console.log('向左移动，新位置:', newIndex);
        break;
      case 38: // 上
        if (currentHeadIndex - snakeBoxSize < 0) {
          newIndex = snakeBoxSize * snakeBoxSize + currentHeadIndex - snakeBoxSize;
        } else {
          newIndex = currentHeadIndex - snakeBoxSize;
        }
        console.log('向上移动，新位置:', newIndex);
        break;
      case 39: // 右
        if ((currentHeadIndex + 1) % snakeBoxSize === 0) {
          newIndex = currentHeadIndex - (snakeBoxSize - 1);
        } else {
          newIndex = currentHeadIndex + 1;
        }
        console.log('向右移动，新位置:', newIndex);
        break;
      case 40: // 下
        if (currentHeadIndex + snakeBoxSize >= snakeBoxSize * snakeBoxSize) {
          newIndex = currentHeadIndex % snakeBoxSize;
        } else {
          newIndex = currentHeadIndex + snakeBoxSize;
        }
        console.log('向下移动，新位置:', newIndex);
        break;
      default:
        newIndex = currentHeadIndex;
        console.log('未知方向，保持原位置');
        break;
    }

    // 移动蛇身
    setSnakeArray(prevArray => {
      const newArray = [...prevArray];
      // 清除原来的位置
      newArray[currentHeadIndex] = { ...newArray[currentHeadIndex], isSel: false };
      // 设置新的位置
      newArray[newIndex] = { ...newArray[newIndex], isSel: true };
      return newArray;
    });
    
    // 检查是否碰到自己
    let currNode = snakeHead.next;
    while (currNode) {
      if (currNode.pointIndex === newIndex) {
        console.log('蛇撞到自己了，游戏结束');
        setGameOver(true);
        if (intervalIdRef.current) {
          clearInterval(intervalIdRef.current);
          intervalIdRef.current = null;
        }
        return;
      }
      currNode = currNode.next;
    }

    // 更新蛇头位置
    snakeHead.pointIndex = newIndex;
    
    // 检查是否吃到食物
    if (snakeEats === newIndex) {
      console.log('吃到食物！生成新食物');
      setSnakeEats(-1);
      newSnakeEats();
      setScore(prevScore => prevScore + 10);
      insertNode(newIndex);
    } else {
      removeNode();
      insertNode(newIndex);
    }

    showNode();
  };

  // 生成新食物
  const newSnakeEats = () => {
    let newEats;
    let isFoodOnSnake;
    
    do {
      isFoodOnSnake = false;
      newEats = Math.floor(Math.random() * snakeBoxSize * snakeBoxSize);
      
      // 检查食物是否生成在蛇身上
      let currNode = snakeHeadRef.current;
      while (currNode && currNode.next) {
        currNode = currNode.next;
        if (currNode.pointIndex === newEats) {
          isFoodOnSnake = true;
          break;
        }
      }
    } while (isFoodOnSnake);
    
    setSnakeEats(newEats);
  };

  // 键盘事件处理
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!gameStarted || gameOver) return;
      
      const keyCode = e.keyCode;
      switch (keyCode) {
        case 37: // 左
        case 39: // 右
          if (snakeMoveRef.current !== 37 && snakeMoveRef.current !== 39) {
            snakeMoveRef.current = keyCode;
          }
          e.preventDefault();
          break;
        case 38: // 上
        case 40: // 下
          if (snakeMoveRef.current !== 38 && snakeMoveRef.current !== 40) {
            snakeMoveRef.current = keyCode;
          }
          e.preventDefault();
          break;
        default:
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      if (intervalIdRef.current) {
        clearInterval(intervalIdRef.current);
      }
    };
  }, [gameStarted, gameOver, snakeBoxSize]);

  // 游戏按钮
  const handleGameAction = () => {
    if (gameOver || !gameStarted) {
      initGame();
    } else {
      setGameOver(true);
      setGameStarted(false);
      if (intervalIdRef.current) {
        clearInterval(intervalIdRef.current);
        intervalIdRef.current = null;
      }
    }
  };

  // 初始渲染
  useEffect(() => {
    const newSnakeArray = [];
    for (let i = 0; i < snakeBoxSize * snakeBoxSize; i++) {
      newSnakeArray.push({
        id: i,
        isSel: false
      });
    }
    setSnakeArray(newSnakeArray);
  }, [snakeBoxSize]);

  const buttonText = !gameStarted ? '开始游戏' : gameOver ? '重新开始' : '暂停游戏';

  return (
    <div className={styles.snakeGameContainer}>
      <div className={styles.gameInfo}>
        <div className={styles.score}>分数: {score}</div>
        <button 
          className={styles.gameButton} 
          onClick={handleGameAction}
        >
          {buttonText}
        </button>
        {gameOver && <div className={styles.gameOverText}>游戏结束!</div>}
      </div>
      
      <div 
        className={styles.snakeBox}
        style={{
          width: `${snakePointWidth * snakeBoxSize}px`,
          height: `${snakePointWidth * snakeBoxSize}px`
        }}
      >
        {snakeArray.map(item => (
          <div
            key={item.id}
            className={`${styles.point} ${item.isSel ? styles.pointSelect : ''} ${item.id === snakeEats ? styles.food : ''}`}
            style={{
              width: `${snakePointWidth - 2}px`,
              height: `${snakePointWidth - 2}px`
            }}
          />
        ))}
      </div>
      
      <div className={styles.instructions}>
        <p>使用方向键 ↑ ↓ ← → 控制蛇的移动</p>
      </div>
    </div>
  );
};

export default SnakeGame;
