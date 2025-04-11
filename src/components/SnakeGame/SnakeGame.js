import React from 'react';
import styles from './SnakeGame.module.css';

class SnakeGame extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      snakeArray: [],
      snakeEats: -1,
      score: 0,
      gameOver: false,
      gameStarted: false
    };

    // 固定配置
    this.snakeBoxSize = 40;
    this.snakePointWidth = 10;
    this.snakeLen = 5;
    this.snakeHead = null;
    this.snakeMove = 39; // 默认向右移动
    this.intervalId = null;
  }

  // 蛇节点构造函数
  SnakeNode = class {
    constructor(idx) {
      this.pointIndex = idx;
      this.next = null;
    }
  }

  // 初始化游戏
  initGame = () => {
    console.log('初始化游戏开始');

    // 创建游戏板块
    const newSnakeArray = [];
    for (let i = 0; i < this.snakeBoxSize * this.snakeBoxSize; i++) {
      newSnakeArray.push({
        id: i,
        isSel: false
      });
    }
    this.setState({ snakeArray: newSnakeArray });

    // 创建蛇头和初始蛇身
    const startPosition = Math.floor(this.snakeBoxSize * this.snakeBoxSize / 2);
    const snakeHead = new this.SnakeNode(startPosition);
    this.snakeHead = snakeHead;

    // 初始化蛇身，从右向左依次添加节点
    for (let i = 1; i < this.snakeLen; i++) {
      this.insertNode(startPosition - i);
    }

    // 显示蛇
    this.showNode();

    // 生成食物
    this.newSnakeEats();

    // 重置游戏状态
    this.setState({
      score: 0,
      gameOver: false,
      gameStarted: true
    });

    // 清除旧的计时器
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }

    // 启动新的计时器
    this.intervalId = setInterval(() => {
      this.snakeMoving();
    }, 200);
  };

  // 插入蛇身节点
  insertNode = (idx) => {
    const newNode = new this.SnakeNode(idx);
    const snakeHead = this.snakeHead;
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
  showNode = () => {
    const newArray = [...this.state.snakeArray];
    let currNode = this.snakeHead;

    while (currNode.next != null) {
      currNode = currNode.next;
      const pointIndex = currNode.pointIndex;
      if (pointIndex >= 0 && pointIndex < newArray.length) {
        newArray[pointIndex] = { ...newArray[pointIndex], isSel: true };
      }
    }

    this.setState({ snakeArray: newArray });
  };

  /**
   * 蛇移动逻辑
   * 主要步骤：
   * 1. 计算新的头部位置
   * 2. 检查是否撞到自己
   * 3. 处理尾巴删除
   * 4. 更新蛇头位置
   * 5. 处理吃食逻辑
   * 6. 更新游戏状态
   */
  snakeMoving = () => {
    const { gameOver, gameStarted } = this.state;
    // 游戏结束或未开始时不执行移动
    if (gameOver || !gameStarted) {
      return;
    }

    const snakeHead = this.snakeHead;
    if (!snakeHead) {
      return;
    }

    const currentHeadIndex = snakeHead.pointIndex;
    let newIndex;

    // 1. 根据移动方向计算新的头部位置
    switch (this.snakeMove) {
      case 37: // 左
        if (currentHeadIndex % this.snakeBoxSize === 0) {
          // 如果在最左边，则从右边出现
          newIndex = currentHeadIndex + this.snakeBoxSize - 1;
        } else {
          newIndex = currentHeadIndex - 1;
        }
        break;
      case 38: // 上
        if (currentHeadIndex - this.snakeBoxSize < 0) {
          // 如果在最上边，则从下边出现
          newIndex = this.snakeBoxSize * this.snakeBoxSize + currentHeadIndex - this.snakeBoxSize;
        } else {
          newIndex = currentHeadIndex - this.snakeBoxSize;
        }
        break;
      case 39: // 右
        if ((currentHeadIndex + 1) % this.snakeBoxSize === 0) {
          // 如果在最右边，则从左边出现
          newIndex = currentHeadIndex - (this.snakeBoxSize - 1);
        } else {
          newIndex = currentHeadIndex + 1;
        }
        break;
      case 40: // 下
        if (currentHeadIndex + this.snakeBoxSize >= this.snakeBoxSize * this.snakeBoxSize) {
          // 如果在最下边，则从上边出现
          newIndex = currentHeadIndex % this.snakeBoxSize;
        } else {
          newIndex = currentHeadIndex + this.snakeBoxSize;
        }
        break;
      default:
        newIndex = currentHeadIndex;
        break;
    }

    // 2. 检查是否撞到自己
    let currNode = snakeHead.next;
    while (currNode) {
      if (currNode.pointIndex === newIndex) {
        this.setState({ gameOver: true });
        if (this.intervalId) {
          clearInterval(this.intervalId);
          this.intervalId = null;
        }
        return;
      }
      currNode = currNode.next;
    }

    // 创建游戏区域状态的副本
    const newArray = [...this.state.snakeArray];

    // 检查是否吃到食物
    const isEatingFood = this.state.snakeEats === newIndex;

    // 3. 如果不是吃到食物，需要删除尾巴
    if (!isEatingFood) {
      // 找到并记录尾部节点的索引
      let tail = this.snakeHead;
      while (tail.next && tail.next.next) {
        tail = tail.next;
      }
      if (tail.next) {
        const tailIndex = tail.next.pointIndex;
        // 将尾部节点在视图上设为不可见
        newArray[tailIndex] = { ...newArray[tailIndex], isSel: false };
        // 从链表中删除尾节点
        tail.next = null;
      }
    }

    // 4. 更新蛇头位置
    // 将原头部位置标记为蛇身
    newArray[currentHeadIndex] = { ...newArray[currentHeadIndex], isSel: true };
    // 将新头部位置标记为蛇身
    newArray[newIndex] = { ...newArray[newIndex], isSel: true };
    
    // 将旧头部位置变为蛇身节点
    const newNode = new this.SnakeNode(currentHeadIndex);
    newNode.next = this.snakeHead.next;
    this.snakeHead.next = newNode;
    // 更新蛇头到新位置
    this.snakeHead.pointIndex = newIndex;

    // 5. 处理吃到食物的情况
    if (isEatingFood) {
      this.setState(prevState => ({
        snakeEats: -1,
        score: prevState.score + 10
      }));
      // 生成新的食物
      this.newSnakeEats();
    }

    // 6. 更新游戏状态
    this.setState({ snakeArray: newArray });
    
    // 此处移除 showNode() 调用，因为我们已经正确更新了视图状态
  };

  // 生成新食物
  newSnakeEats = () => {
    let newEats;
    let isFoodOnSnake;

    do {
      isFoodOnSnake = false;
      newEats = Math.floor(Math.random() * this.snakeBoxSize * this.snakeBoxSize);

      // 检查食物是否生成在蛇身上
      let currNode = this.snakeHead;
      while (currNode && currNode.next) {
        currNode = currNode.next;
        if (currNode.pointIndex === newEats) {
          isFoodOnSnake = true;
          break;
        }
      }
    } while (isFoodOnSnake);

    this.setState({ snakeEats: newEats });
  };

  handleKeyDown = (e) => {
    if (!this.state.gameStarted || this.state.gameOver) return;

    const keyCode = e.keyCode;
    switch (keyCode) {
      case 37: // 左
      case 39: // 右
        if (this.snakeMove !== 37 && this.snakeMove !== 39) {
          this.snakeMove = keyCode;
        }
        e.preventDefault();
        break;
      case 38: // 上
      case 40: // 下
        if (this.snakeMove !== 38 && this.snakeMove !== 40) {
          this.snakeMove = keyCode;
        }
        e.preventDefault();
        break;
      default:
        break;
    }
  };
  /**
   * 处理游戏按钮点击事件
   * 如果游戏未开始或已结束，则初始化游戏
   * 如果游戏正在进行，则结束游戏并清除游戏界面
   */
  handleGameAction = () => {
    if (this.state.gameOver || !this.state.gameStarted) {
      this.initGame();
    } else {
      // 清除游戏界面上的蛇和食物
      const clearedArray = this.state.snakeArray.map(item => ({
        id: item.id,
        isSel: false // 将所有格子设置为不可见
      }));

      this.setState({
        gameOver: true,
        gameStarted: false,
        snakeArray: clearedArray, // 更新清空后的游戏区域
        snakeEats: -1 // 移除食物
      });

      // 清除蛇的链表结构
      this.snakeHead = null;
      
      if (this.intervalId) {
        clearInterval(this.intervalId);
        this.intervalId = null;
      }
    }
  };

  componentDidMount() {
    const newSnakeArray = [];
    for (let i = 0; i < this.snakeBoxSize * this.snakeBoxSize; i++) {
      newSnakeArray.push({
        id: i,
        isSel: false
      });
    }
    this.setState({ snakeArray: newSnakeArray });
    document.addEventListener('keydown', this.handleKeyDown);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleKeyDown);
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  render() {
    const { snakeArray, score, gameOver, gameStarted, snakeEats } = this.state;
    const buttonText = !gameStarted ? '开始游戏' : gameOver ? '重新开始' : '结束游戏';

    return (
      <div className={styles.snakeGameContainer}>
        <div className={styles.gameInfo}>
          <div className={styles.score}>分数: {score}</div>
          <button
            className={styles.gameButton}
            onClick={this.handleGameAction}
          >
            {buttonText}
          </button>
          {gameOver && <div className={styles.gameOverText}>游戏结束!</div>}
        </div>

        <div
          className={styles.snakeBox}
          style={{
            width: `${this.snakePointWidth * this.snakeBoxSize}px`,
            height: `${this.snakePointWidth * this.snakeBoxSize}px`
          }}
        >
          {snakeArray.map(item => (
            <div
              key={item.id}
              className={`${styles.point} ${item.isSel ? styles.pointSelect : ''} ${item.id === snakeEats ? styles.food : ''}`}
              style={{
                width: `${this.snakePointWidth - 2}px`,
                height: `${this.snakePointWidth - 2}px`
              }}
            />
          ))}
        </div>

        <div className={styles.instructions}>
          <p>使用方向键 ↑ ↓ ← → 控制蛇的移动</p>
        </div>
      </div>
    );
  }
}

export default SnakeGame;
