import React, { useRef, useState } from 'react';
import styles from './AvatarGenerator.module.css';

export default function AvatarGenerator() {
  const [color, setColor] = useState('#FFA500'); // 橙色作为默认颜色
  const [size, setSize] = useState(200);
  const canvasRef = useRef(null);

  const drawOrange = (ctx, size) => {
    // 清空画布
    ctx.clearRect(0, 0, size, size);
    
    // 绘制圆形主体
    ctx.beginPath();
    ctx.arc(size/2, size/2, size/2 - 2, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
    
    // 绘制叶子
    ctx.beginPath();
    ctx.moveTo(size/2, 0);
    ctx.quadraticCurveTo(size/2 + 20, 10, size/2 + 10, 20);
    ctx.quadraticCurveTo(size/2, 10, size/2, 0);
    ctx.fillStyle = '#4CAF50';
    ctx.fill();
  };

  const handleDownload = () => {
    const canvas = canvasRef.current;
    const link = document.createElement('a');
    link.download = 'avatar.png';
    link.href = canvas.toDataURL();
    link.click();
  };

  React.useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    drawOrange(ctx, size);
  }, [color, size]);

  return (
    <div className={styles.container}>
      <div className={styles.controls}>
        <div>
          <label>颜色：</label>
          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
          />
        </div>
        <div>
          <label>大小：</label>
          <input
            type="range"
            min="100"
            max="400"
            value={size}
            onChange={(e) => setSize(Number(e.target.value))}
          />
          <span>{size}px</span>
        </div>
        <button onClick={handleDownload} className={styles.downloadButton}>
          下载头像
        </button>
      </div>
      <div className={styles.canvasContainer}>
        <canvas
          ref={canvasRef}
          width={size}
          height={size}
          className={styles.canvas}
        />
      </div>
    </div>
  );
}
