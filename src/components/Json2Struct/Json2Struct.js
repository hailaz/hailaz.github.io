import { useEffect, useState } from 'react';
import styles from './Json2Struct.module.css';

export default function Json2Struct() {  const [jsonInput, setJsonInput] = useState(`{
    "user_info": {
        "userId": 12345,
        "user-name": "张三",
        "emailAddress": "zhangsan@example.com",
        "phone_number": "13800138000",
        "is-active": true,
        "createdAt": "2023-01-01T00:00:00Z",
        "profile-settings": {
            "theme_mode": "dark",
            "notificationEnabled": true,
            "auto-login": false
        },
        "userRoles": ["admin", "user"],
        "account_balance": 1000.50
    },
    "system-info": {
        "appVersion": "1.0.0",
        "api_endpoint": "https://api.example.com",
        "lastUpdated": "2023-12-31T23:59:59Z"
    }
}`);const [structOutput, setStructOutput] = useState('');
  const [isValidJson, setIsValidJson] = useState(true);
  const [jsonTagFormat, setJsonTagFormat] = useState('original'); // original, snake, camel, kebab

  // 添加防抖效果，避免频繁转换
  useEffect(() => {
    const timer = setTimeout(() => {
      handleConvert();
    }, 500);    return () => clearTimeout(timer);
  }, [jsonInput, jsonTagFormat]);

  useEffect(() => {
    // 初始化时转换一次
    handleConvert();
  }, []);  // JSON tag 格式转换函数
  function formatJsonTag(key) {
    switch (jsonTagFormat) {
      case 'snake':
        // 蛇形命名：转换所有分隔符为下划线，处理驼峰
        return key
          .replace(/([A-Z])/g, '_$1')  // 驼峰转下划线
          .replace(/-/g, '_')          // 连字符转下划线
          .toLowerCase()
          .replace(/^_/, '');          // 移除开头的下划线
      case 'camel':
        // 小驼峰：转换下划线和连字符为驼峰
        return key
          .replace(/[-_]([a-z])/g, (match, letter) => letter.toUpperCase())
          .replace(/^[A-Z]/, (match) => match.toLowerCase()); // 首字母小写
      case 'kebab':
        // 烤串命名：转换所有分隔符为连字符，处理驼峰
        return key
          .replace(/([A-Z])/g, '-$1')  // 驼峰转连字符
          .replace(/_/g, '-')          // 下划线转连字符
          .toLowerCase()
          .replace(/^-/, '');          // 移除开头的连字符
      case 'original':
      default:
        // 保持原样
        return key;
    }
  }

  // Go 字段名转换函数（始终使用 PascalCase）
  function formatFieldName(key) {
    // Go 字段名始终使用 PascalCase（首字母大写的驼峰）
    const camelCased = key.replace(/[_-]([a-z])/g, (match, letter) => letter.toUpperCase());
    return camelCased.charAt(0).toUpperCase() + camelCased.slice(1);
  }

  // 基于原始json2struct.js中的逻辑重构
  function handleConvert() {
    if (!jsonInput.trim()) {
      setStructOutput('');
      setIsValidJson(true);
      return;
    }

    try {
      let json = JSON.parse(jsonInput);
      let result = generateStruct('Root', json);
      setStructOutput(result);
      setIsValidJson(true);
    } catch (e) {
      setStructOutput(`❌ JSON 解析错误: ${e.message}`);
      setIsValidJson(false);
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
    } else if (typeof obj === 'object' && obj !== null) {      // 处理对象
      for (const [key, value] of Object.entries(obj)) {
        const fieldName = formatFieldName(key);
        const jsonTag = formatJsonTag(key);
        
        if (Array.isArray(value)) {
          // 处理数组字段
          if (value.length > 0 && typeof value[0] === 'object' && value[0] !== null) {
            result += `    ${fieldName} []${fieldName}Item \`json:"${jsonTag}"\`\n`;
          } else if (value.length > 0) {
            result += `    ${fieldName} []${typeMapping(typeof value[0])} \`json:"${jsonTag}"\`\n`;
          } else {
            result += `    ${fieldName} []interface{} \`json:"${jsonTag}"\`\n`;
          }
        } else if (typeof value === 'object' && value !== null) {
          // 处理嵌套对象
          result += `    ${fieldName} ${fieldName}Object \`json:"${jsonTag}"\`\n`;
        } else {
          // 处理基本类型
          result += `    ${fieldName} ${typeMapping(typeof value)} \`json:"${jsonTag}"\`\n`;
        }
      }
        // 为所有嵌套对象生成结构
      result += `}\n\n`;
      for (const [key, value] of Object.entries(obj)) {
        const fieldName = formatFieldName(key);
        
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
  }  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(structOutput);
      // 可以添加一个临时的成功提示
    } catch (err) {
      console.error('复制失败:', err);
    }
  };

  const handleFormat = () => {
    try {
      const formatted = JSON.stringify(JSON.parse(jsonInput), null, 2);
      setJsonInput(formatted);
    } catch (err) {
      console.error('格式化失败:', err);
    }
  };

  const handleClear = () => {
    setJsonInput('');
    setStructOutput('');
  };  const handleReset = () => {
    setJsonInput(`{
    "user_info": {
        "userId": 12345,
        "user-name": "张三",
        "emailAddress": "zhangsan@example.com",
        "phone_number": "13800138000",
        "is-active": true,
        "createdAt": "2023-01-01T00:00:00Z",
        "profile-settings": {
            "theme_mode": "dark",
            "notificationEnabled": true,
            "auto-login": false
        },
        "userRoles": ["admin", "user"],
        "account_balance": 1000.50
    },
    "system-info": {
        "appVersion": "1.0.0",
        "api_endpoint": "https://api.example.com",
        "lastUpdated": "2023-12-31T23:59:59Z"
    }
}`);
    handleConvert();
  };

  return (
    <div className={styles.container}>      <div className={styles.header}>
        <h3 className={styles.title}>JSON 转 Golang 结构体</h3>
        <div className={styles.toolbar}>
          <button className={styles.toolButton} onClick={handleConvert} title="手动转换">
            🔄 转换
          </button>
          <button className={styles.toolButton} onClick={handleFormat} title="格式化JSON" disabled={!isValidJson}>
            🎨 格式化
          </button>
          <button className={styles.toolButton} onClick={handleClear} title="清空">
            🗑️ 清空
          </button>
          <button className={styles.toolButton} onClick={handleReset} title="重置示例">
            📝 示例
          </button>
          
          <div className={styles.tagFormatGroup}>
            <span className={styles.tagLabel}>🏷️ JSON Tag格式:</span>
            <div className={styles.compactRadioGroup}>
              <label className={styles.compactRadioLabel}>
                <input
                  type="radio"
                  name="jsonTagFormat"
                  value="original"
                  checked={jsonTagFormat === 'original'}
                  onChange={(e) => setJsonTagFormat(e.target.value)}
                  className={styles.compactRadioInput}
                />
                <span className={styles.compactRadioText}>原始</span>
              </label>
              
              <label className={styles.compactRadioLabel}>
                <input
                  type="radio"
                  name="jsonTagFormat"
                  value="snake"
                  checked={jsonTagFormat === 'snake'}
                  onChange={(e) => setJsonTagFormat(e.target.value)}
                  className={styles.compactRadioInput}
                />
                <span className={styles.compactRadioText}>snake_case</span>
              </label>
              
              <label className={styles.compactRadioLabel}>
                <input
                  type="radio"
                  name="jsonTagFormat"
                  value="camel"
                  checked={jsonTagFormat === 'camel'}
                  onChange={(e) => setJsonTagFormat(e.target.value)}
                  className={styles.compactRadioInput}
                />
                <span className={styles.compactRadioText}>camelCase</span>
              </label>
              
              <label className={styles.compactRadioLabel}>
                <input
                  type="radio"
                  name="jsonTagFormat"
                  value="kebab"
                  checked={jsonTagFormat === 'kebab'}
                  onChange={(e) => setJsonTagFormat(e.target.value)}
                  className={styles.compactRadioInput}
                />
                <span className={styles.compactRadioText}>kebab-case</span>
              </label>
            </div>
          </div>
        </div>
      </div>      
      <div className={styles.content}><div className={styles.inputSection}>
          <div className={styles.sectionHeader}>
            <label className={styles.label}>JSON 输入</label>
            <div className={styles.inputStats}>
              {jsonInput.trim() ? (
                <>
                  {isValidJson ? '✅' : '❌'} {jsonInput.length} 字符
                </>
              ) : '请输入 JSON'}
            </div>
          </div>
          <textarea 
            className={`${styles.textArea} ${styles.inputArea} ${!isValidJson ? styles.errorArea : ''}`}
            value={jsonInput}
            onChange={(e) => setJsonInput(e.target.value)}
            placeholder="请输入有效的JSON数据..."
          />
        </div>
        
        <div className={styles.divider}></div>
        
        <div className={styles.outputSection}>
          <div className={styles.sectionHeader}>
            <label className={styles.label}>Golang 结构体</label>            <div className={styles.outputActions}>
              {structOutput && isValidJson && (
                <button className={styles.copyButton} onClick={handleCopy} title="复制代码">
                  📋 复制
                </button>
              )}
            </div>
          </div>
          <textarea 
            className={`${styles.textArea} ${styles.outputArea}`}
            value={structOutput}
            readOnly
            placeholder="转换后的Golang结构体将显示在这里..."
          />
        </div>
      </div>
    </div>
  );
}
