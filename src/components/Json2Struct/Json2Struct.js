import React, { useEffect, useState } from 'react';
import styles from './Json2Struct.module.css';

export default function Json2Struct() {
  const [jsonInput, setJsonInput] = useState(`{
    "bankList" : [
        {
            "cardNoLast4" : "0129",
            "bankName" : "中国建设银行",
            "bankAccountNo" : "1323333333",
            "arriveDateList" : [
                {
                    "singleAmount" : "50000.00",
                    "availableAmount" : "50000.00",
                    "title" : "预计两小时内到账，确认提现",
                    "desc" : "该笔提现预计将在",
                    "arriveDateType" : "fast"
                }
            ],
            "type" : "common",
            "is_true" : true
        }
    ]
}`);
  const [structOutput, setStructOutput] = useState('');

  useEffect(() => {
    // 尝试转换初始值
    handleConvert();
  }, []);

  // 基于原始json2struct.js中的逻辑重构
  function handleConvert() {
    try {
      let json = JSON.parse(jsonInput);
      let result = generateStruct('Root', json);
      setStructOutput(result);
    } catch (e) {
      setStructOutput(`解析错误: ${e.message}`);
    }
  }

  function generateStruct(name, obj) {
    let result = `type ${name} struct {\n`;
    
    if (Array.isArray(obj)) {
      // 处理数组
      if (obj.length > 0) {
        // 获取数组第一项的类型
        const firstItem = obj[0];
        const itemType = typeof firstItem === 'object' ? `[]${name}Item` : `[]${typeMapping(typeof firstItem)}`;
        result += `    Items ${itemType} \`json:"items"\`\n`;
        
        // 如果是对象数组，还需要生成子结构
        if (typeof firstItem === 'object' && firstItem !== null) {
          result += `}\n\n` + generateStruct(`${name}Item`, firstItem);
          return result;
        }
      } else {
        result += `    Items []interface{} \`json:"items"\`\n`;
      }
    } else if (typeof obj === 'object' && obj !== null) {
      // 处理对象
      for (const [key, value] of Object.entries(obj)) {
        const fieldName = key.charAt(0).toUpperCase() + key.slice(1);
        
        if (Array.isArray(value)) {
          // 处理数组字段
          if (value.length > 0 && typeof value[0] === 'object' && value[0] !== null) {
            result += `    ${fieldName} []${fieldName}Item \`json:"${key}"\`\n`;
          } else if (value.length > 0) {
            result += `    ${fieldName} []${typeMapping(typeof value[0])} \`json:"${key}"\`\n`;
          } else {
            result += `    ${fieldName} []interface{} \`json:"${key}"\`\n`;
          }
        } else if (typeof value === 'object' && value !== null) {
          // 处理嵌套对象
          result += `    ${fieldName} ${fieldName}Object \`json:"${key}"\`\n`;
        } else {
          // 处理基本类型
          result += `    ${fieldName} ${typeMapping(typeof value)} \`json:"${key}"\`\n`;
        }
      }
      
      // 为所有嵌套对象生成结构
      result += `}\n\n`;
      for (const [key, value] of Object.entries(obj)) {
        const fieldName = key.charAt(0).toUpperCase() + key.slice(1);
        
        if (Array.isArray(value) && value.length > 0 && typeof value[0] === 'object' && value[0] !== null) {
          result += generateStruct(`${fieldName}Item`, value[0]);
        } else if (typeof value === 'object' && value !== null) {
          result += generateStruct(`${fieldName}Object`, value);
        }
      }
      
      return result;
    }
    
    result += `}\n`;
    return result;
  }

  function typeMapping(jsType) {
    switch (jsType) {
      case 'string': return 'string';
      case 'number': return 'float64';
      case 'boolean': return 'bool';
      default: return 'interface{}';
    }
  }

  return (
    <div className={styles.container}>
      <label className={styles.label}>JSON 输入:</label>
      <textarea 
        className={styles.textArea}
        value={jsonInput}
        onChange={(e) => setJsonInput(e.target.value)}
      />
      
      <button className={styles.button} onClick={handleConvert}>转换为Golang结构体</button>
      
      <label className={styles.label}>结构体输出:</label>
      <textarea 
        className={styles.textArea}
        value={structOutput}
        readOnly
      />
    </div>
  );
}
