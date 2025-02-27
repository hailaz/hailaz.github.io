import React, { useState } from 'react';
import styles from '../../pages/tools.module.css';

export default function CodeGenerator() {
  const [paramCount, setParamCount] = useState(2);
  const [template, setTemplate] = useState('循环替换 {#0} 和 {#1}');
  const [params, setParams] = useState(Array(2).fill('').map((_, i) => `参数${i + 1}`));
  const [output, setOutput] = useState('');

  const handleParamCountChange = (count) => {
    const newCount = parseInt(count);
    if (isNaN(newCount) || newCount < 1) return;
    
    setParamCount(newCount);
    
    // 调整参数数组长度
    if (newCount > params.length) {
      const newParams = [...params];
      for (let i = params.length; i < newCount; i++) {
        newParams.push(`参数${i + 1}`);
      }
      setParams(newParams);
    } else {
      setParams(params.slice(0, newCount));
    }
  };

  const handleParamChange = (index, value) => {
    const newParams = [...params];
    newParams[index] = value;
    setParams(newParams);
  };

  const generateCode = () => {
    // 分割每个参数的多个值
    const paramValues = params.map(param => param.split(',').map(v => v.trim()));
    
    // 获取所有参数的组合数
    const combinations = paramValues[0].length;
    
    let result = '';
    
    // 生成每种组合
    for (let i = 0; i < combinations; i++) {
      let line = template;
      
      // 替换每个参数占位符
      for (let j = 0; j < paramCount; j++) {
        const paramIndex = Math.min(i, paramValues[j].length - 1);
        line = line.replace(new RegExp(`\\{#${j}\\}`, 'g'), paramValues[j][paramIndex]);
      }
      
      result += line + '\n';
    }
    
    setOutput(result);
  };

  return (
    <div>
      <div>
        <label className={styles.label}>参数数量:</label>
        <input 
          className={styles.inputField}
          type="number" 
          min="1" 
          value={paramCount} 
          onChange={(e) => handleParamCountChange(e.target.value)} 
        />
      </div>
      
      <div>
        <label className={styles.label}>模板 (使用 {'{#n}'} 作为占位符):</label>
        <textarea 
          className={styles.textArea}
          value={template} 
          onChange={(e) => setTemplate(e.target.value)}
        />
      </div>
      
      <div>
        <label className={styles.label}>参数值 (用逗号分隔多个值):</label>
        {params.map((param, index) => (
          <div key={index} style={{ marginBottom: '10px' }}>
            <label>参数 {index + 1}:</label>
            <input 
              className={styles.inputField}
              type="text" 
              value={param} 
              onChange={(e) => handleParamChange(index, e.target.value)} 
            />
          </div>
        ))}
      </div>
      
      <button className={styles.button} onClick={generateCode}>生成代码</button>
      
      <div>
        <label className={styles.label}>输出:</label>
        <textarea 
          className={styles.textArea}
          value={output} 
          readOnly 
        />
      </div>
    </div>
  );
}
