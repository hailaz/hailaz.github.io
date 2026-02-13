import React, { useEffect, useState } from 'react';
import styles from '../../pages/online-tools.module.css';

export default function CaseConverter() {
  const [input, setInput] = useState('HelloWorld,hello_world');
  const [camelCase, setCamelCase] = useState('');
  const [pascalCase, setPascalCase] = useState('');
  const [snakeCase, setSnakeCase] = useState('');

  useEffect(() => {
    convertCase(input);
  }, [input]);

  const convertCase = (text) => {
    if (!text) return;
    
    const words = text.split(',').map(word => word.trim());
    
    const results = words.map(word => {
      // 先将单词统一转为驼峰形式的数组
      let wordParts = [];
      
      // 处理下划线分隔的情况
      if (word.includes('_')) {
        wordParts = word.split('_').filter(Boolean).map(
          (part, index) => index === 0 ? part.toLowerCase() : part.charAt(0).toUpperCase() + part.slice(1).toLowerCase()
        );
      } 
      // 处理驼峰情况
      else {
        let currentWord = '';
        for (let i = 0; i < word.length; i++) {
          const char = word[i];
          if (i > 0 && char.toUpperCase() === char && char.toLowerCase() !== char) {
            wordParts.push(currentWord);
            currentWord = char.toLowerCase();
          } else {
            currentWord += char.toLowerCase();
          }
        }
        if (currentWord) {
          wordParts.push(currentWord);
        }
      }
      
      // 生成各种形式的结果
      const camel = wordParts.map((part, index) => 
        index === 0 ? part.toLowerCase() : part.charAt(0).toUpperCase() + part.slice(1)
      ).join('');
      
      const pascal = wordParts.map(part => 
        part.charAt(0).toUpperCase() + part.slice(1)
      ).join('');
      
      const snake = wordParts.join('_').toLowerCase();
      
      return { camel, pascal, snake };
    });
    
    setCamelCase(results.map(r => r.camel).join(', '));
    setPascalCase(results.map(r => r.pascal).join(', '));
    setSnakeCase(results.map(r => r.snake).join(', '));
  };

  return (
    <div>
      <label className={styles.label}>输入 (用逗号分隔多个单词):</label>
      <input 
        className={styles.inputField}
        type="text" 
        value={input} 
        onChange={(e) => setInput(e.target.value)} 
      />
      
      <div>
        <label className={styles.label}>驼峰命名 (首字母小写):</label>
        <input 
          className={styles.inputField}
          type="text" 
          value={camelCase} 
          readOnly 
        />
      </div>
      
      <div>
        <label className={styles.label}>帕斯卡命名 (首字母大写):</label>
        <input 
          className={styles.inputField}
          type="text" 
          value={pascalCase} 
          readOnly 
        />
      </div>
      
      <div>
        <label className={styles.label}>下划线命名:</label>
        <input 
          className={styles.inputField}
          type="text" 
          value={snakeCase} 
          readOnly 
        />
      </div>
    </div>
  );
}
