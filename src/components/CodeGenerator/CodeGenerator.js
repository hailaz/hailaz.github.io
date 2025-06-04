import React, { useEffect, useRef, useState } from 'react';
import styles from './CodeGenerator.module.css';

export default function CodeGenerator() {
  const [paramCount, setParamCount] = useState(2);
  const [template, setTemplate] = useState('循环替换 {#0} 和 {#1}');
  const [params, setParams] = useState(Array(2).fill('').map((_, i) => `参数${i + 1}`));
  const [output, setOutput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [showCopyToast, setShowCopyToast] = useState(false);
  const [templateError, setTemplateError] = useState('');
  const [showParamTips, setShowParamTips] = useState(false);
  const [history, setHistory] = useState([]);
  const [autoGenerate, setAutoGenerate] = useState(true);
  const [debounceTimer, setDebounceTimer] = useState(null);
  const outputRef = useRef(null);
  const paramRefs = useRef([]);
  
  // 初始化参数引用数组
  useEffect(() => {
    paramRefs.current = paramRefs.current.slice(0, paramCount);
    while (paramRefs.current.length < paramCount) {
      paramRefs.current.push(React.createRef());
    }
  }, [paramCount]);
  
  // 监听模板输入变化，检查格式
  useEffect(() => {
    if (template && !template.includes('{#')) {
      setTemplateError('提示：模板中需要包含至少一个 {#n} 形式的占位符');
    } else {
      setTemplateError('');
    }
    
    // 自动生成代码
    if (autoGenerate) {
      triggerDebouncedGenerate();
    }
  }, [template, autoGenerate]);

  // 参数变化时自动生成代码
  useEffect(() => {
    if (autoGenerate) {
      triggerDebouncedGenerate();
    }
  }, [params, autoGenerate]);

  // 参数数量变化时自动生成代码
  useEffect(() => {
    if (autoGenerate) {
      triggerDebouncedGenerate();
    }
  }, [paramCount, autoGenerate]);

  // 加载本地存储的历史记录
  useEffect(() => {
    try {
      const savedHistory = localStorage.getItem('codeGeneratorHistory');
      if (savedHistory) {
        setHistory(JSON.parse(savedHistory));
      }
    } catch (error) {
      console.error('加载历史记录失败:', error);
    }
  }, []);

  // 保存历史记录到本地存储
  useEffect(() => {
    if (history.length > 0) {
      try {
        localStorage.setItem('codeGeneratorHistory', JSON.stringify(history));
      } catch (error) {
        console.error('保存历史记录失败:', error);
      }
    }
  }, [history]);

  // 复制提示自动消失
  useEffect(() => {
    if (showCopyToast) {
      const timer = setTimeout(() => {
        setShowCopyToast(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [showCopyToast]);

  // 防抖处理，避免频繁生成代码
  const triggerDebouncedGenerate = () => {
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }
    
    const newTimer = setTimeout(() => {
      generateCode();
    }, 500); // 延迟500毫秒生成代码
    
    setDebounceTimer(newTimer);
  };

  const handleParamCountChange = (count) => {
    const newCount = parseInt(count);
    if (isNaN(newCount) || newCount < 1 || newCount > 20) return;
    
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

  const incrementParamCount = () => {
    if (paramCount < 20) {
      handleParamCountChange(paramCount + 1);
    }
  };

  const decrementParamCount = () => {
    if (paramCount > 1) {
      handleParamCountChange(paramCount - 1);
    }
  };

  const handleParamChange = (index, value) => {
    const newParams = [...params];
    newParams[index] = value;
    setParams(newParams);
  };

  const clearParamValue = (index) => {
    const newParams = [...params];
    newParams[index] = '';
    setParams(newParams);
    
    // 聚焦到被清空的输入框
    if (paramRefs.current[index] && paramRefs.current[index].current) {
      paramRefs.current[index].current.focus();
    }
  };

  const handleParamKeyDown = (e, index) => {
    // 按Tab键时，如果是最后一个参数且参数数量小于最大值，则添加一个新参数
    if (e.key === 'Tab' && !e.shiftKey && index === paramCount - 1 && paramCount < 20) {
      e.preventDefault();
      incrementParamCount();
      
      // 等待DOM更新后聚焦到新添加的参数
      setTimeout(() => {
        if (paramRefs.current[paramCount] && paramRefs.current[paramCount].current) {
          paramRefs.current[paramCount].current.focus();
        }
      }, 0);
    }
  };

  const generateCode = () => {
    setIsGenerating(true);
    
    // 模拟处理时间，实际上这个操作很快，但为了展示加载状态
    setTimeout(() => {
      try {
        // 分割每个参数的多个值
        const paramValues = params.map(param => param.split(',').map(v => v.trim()));
        
        // 获取所有参数的组合数
        const combinations = Math.max(...paramValues.map(p => p.length));
        
        let result = '';
        
        // 生成每种组合
        for (let i = 0; i < combinations; i++) {
          let line = template;
          
          // 替换每个参数占位符
          for (let j = 0; j < paramCount; j++) {
            const paramIndex = Math.min(i, paramValues[j].length - 1);
            line = line.replace(new RegExp(`\\{#${j}\\}`, 'g'), paramValues[j][paramIndex] || '');
          }
          
          result += line + '\n';
        }
        
        // 保存当前结果到历史记录
        if (result.trim() && result !== output) {
          addToHistory(result);
          setOutput(result);
        } else if (!result.trim()) {
          setOutput('');
        }
      } catch (error) {
        console.error('生成代码时出错:', error);
        setOutput('生成代码时出错，请检查输入参数和模板格式');
      } finally {
        setIsGenerating(false);
      }
    }, 300);
  };

  // 添加结果到历史记录
  const addToHistory = (result) => {
    const timestamp = new Date().toLocaleString();
    const newHistoryItem = {
      id: Date.now(),
      timestamp,
      template,
      params: [...params],
      result,
      preview: result.split('\n').slice(0, 2).join('\n') + (result.split('\n').length > 2 ? '...' : '')
    };
    
    // 限制历史记录条数为10条
    const newHistory = [newHistoryItem, ...history].slice(0, 10);
    setHistory(newHistory);
  };

  // 从历史记录中加载
  const loadFromHistory = (historyItem) => {
    setTemplate(historyItem.template);
    setParams(historyItem.params);
    setParamCount(historyItem.params.length);
    setOutput(historyItem.result);
  };

  // 删除历史记录
  const deleteHistoryItem = (id, event) => {
    event.stopPropagation(); // 阻止事件冒泡，避免触发loadFromHistory
    const newHistory = history.filter(item => item.id !== id);
    setHistory(newHistory);
  };

  // 清空所有历史记录
  const clearAllHistory = () => {
    if (confirm('确定要清空所有历史记录吗？')) {
      setHistory([]);
      localStorage.removeItem('codeGeneratorHistory');
    }
  };

  const copyToClipboard = () => {
    if (output) {
      navigator.clipboard.writeText(output)
        .then(() => {
          setShowCopyToast(true);
        })
        .catch(err => {
          console.error('复制失败:', err);
        });
    }
  };

  const clearOutput = () => {
    setOutput('');
  };

  // 批量清空所有参数
  const clearAllParams = () => {
    setParams(Array(paramCount).fill(''));
    // 聚焦到第一个参数
    if (paramRefs.current[0] && paramRefs.current[0].current) {
      paramRefs.current[0].current.focus();
    }
  };

  // 从文本中提取参数
  const extractParamsFromText = () => {
    const text = prompt("请粘贴文本数据，每行将被分割为一个参数值：");
    if (text) {
      const lines = text.split('\n').filter(line => line.trim());
      if (lines.length > 0) {
        // 根据提取的行数调整参数数量
        const newCount = Math.min(20, lines.length);
        setParamCount(newCount);
        
        // 设置参数值
        const newParams = Array(newCount).fill('');
        lines.forEach((line, index) => {
          if (index < newCount) {
            newParams[index] = line.trim();
          }
        });
        setParams(newParams);
      }
    }
  };

  // 提供一些预设模板
  const useTemplate = (templateType) => {
    switch(templateType) {
      case 'sql':
        setTemplate('INSERT INTO table_name (col1, col2) VALUES (\'{#0}\', \'{#1}\');');
        break;
      case 'list':
        setTemplate('- {#0}: {#1}');
        break;
      case 'code':
        setTemplate('const {#0} = {#1};');
        break;
      default:
        break;
    }
  };
  return (
    <div className={styles.container}>
      {showCopyToast && (
        <div className={styles.copySuccessToast}>
          复制成功！
        </div>
      )}
      
      <div className={styles.inputSection}>
        <div className={styles.labelRow}>
          <label className={styles.label}>参数数量:</label>
          <div className={`${styles.controlGroup} ${styles.paramCountControls}`}>
            <button
              className={styles.smallButton}
              onClick={decrementParamCount}
              disabled={paramCount <= 1}
            >
              -
            </button>
            <input 
              className={styles.inputField}
              type="number" 
              min="1" 
              max="20"
              value={paramCount} 
              onChange={(e) => handleParamCountChange(e.target.value)} 
            />
            <button
              className={styles.smallButton}
              onClick={incrementParamCount}
              disabled={paramCount >= 20}
            >
              +
            </button>
            <span className={styles.paramCountHint}>
              (最大: 20)
            </span>
          </div>
        </div>        
        <div className={styles.labelRow}>
          <label className={styles.label}>模板 (使用 {'{#n}'} 作为占位符):</label>
          <div className={styles.buttonGroup}>
            <button 
              className={`${styles.smallButton} ${styles.templateButton}`} 
              onClick={() => useTemplate('sql')}
            >
              SQL示例
            </button>
            <button 
              className={`${styles.smallButton} ${styles.templateButton} ${styles.list}`} 
              onClick={() => useTemplate('list')}
            >
              列表示例
            </button>
            <button 
              className={`${styles.smallButton} ${styles.templateButton} ${styles.code}`} 
              onClick={() => useTemplate('code')}
            >
              代码示例
            </button>
            <label className={styles.autoGenerateLabel}>
              <input 
                type="checkbox" 
                checked={autoGenerate} 
                onChange={() => setAutoGenerate(!autoGenerate)} 
              />
              <span>自动生成</span>
            </label>
          </div>
        </div>
          <textarea 
          className={styles.textArea}
          value={template} 
          onChange={(e) => setTemplate(e.target.value)}
          placeholder="输入模板，使用 {#0}, {#1} 等作为参数占位符"
        />
        
        {templateError && (
          <div className={styles.templateError}>
            {templateError}
          </div>
        )}
      </div>
        <div className={styles.inputSection}>
        <div className={styles.labelRow}>
          <label className={styles.label}>参数值 (用逗号分隔多个值):</label>
          <div className={styles.buttonGroup}>
            <button 
              className={`${styles.smallButton} ${styles.clearAllParamsButton}`}
              onClick={clearAllParams}
            >
              清空所有参数
            </button>
            <button 
              className={`${styles.smallButton} ${styles.importTextButton}`}
              onClick={extractParamsFromText}
            >
              从文本批量导入
            </button>
            <button 
              className={`${styles.smallButton} ${styles.toggleTipsButton}`}
              onClick={() => setShowParamTips(!showParamTips)}
            >
              {showParamTips ? '隐藏提示' : '显示提示'}
            </button>
          </div>
        </div>
        
        {showParamTips && (
          <div className={styles.paramTips}>
            <p><strong>提示：</strong></p>
            <ul>
              <li>在最后一个参数按 <strong>Tab</strong> 键可以自动添加新参数</li>
              <li>用 <strong>逗号</strong> 分隔多个值，例如：<code>值1,值2,值3</code></li>
              <li>使用 <strong>从文本批量导入</strong> 可以快速填充多个参数值</li>
              <li>每个参数框右侧的 <strong>X</strong> 按钮可以快速清空该参数</li>
              <li>开启 <strong>自动生成</strong> 后，修改参数或模板会自动更新结果</li>
            </ul>
          </div>
        )}        <div className={styles.paramGrid}>
          {params.map((param, index) => (
            <div key={index} className={styles.paramCard}>
              <div className={`${styles.paramCardHeader} ${styles[`color${index % 5}`]}`}>
                <label className={styles.paramCardLabel}>
                  参数 {index}
                </label>
                <span className={styles.paramCardIndex}>
                  #{index}
                </span>
              </div>

              <div className={styles.paramCardContent}>
                <input 
                  ref={paramRefs.current[index]}
                  className={styles.paramCardInput}
                  type="text" 
                  value={param} 
                  onChange={(e) => handleParamChange(index, e.target.value)} 
                  onKeyDown={(e) => handleParamKeyDown(e, index)}
                  placeholder={`参数${index + 1}的值，多个值用逗号分隔`}
                />
                <div className={styles.paramValueCounter}>
                  {param.split(',').filter(v => v.trim()).length > 0 ? 
                    (param.split(',').filter(v => v.trim()).length > 1 ? 
                      `${param.split(',').filter(v => v.trim()).length} 个值` : '单值') : '无值'}
                </div>
                <div className={styles.paramControls}>
                  {param && (
                    <button 
                      className={styles.paramClearButton}
                      onClick={() => clearParamValue(index)}
                      title="清空此参数"
                    >
                      ×
                    </button>
                  )}
                </div>
              </div>
              {param.split(',').filter(v => v.trim()).length > 0 && (
                <div className={styles.paramValueTags}>
                  <div className={styles.paramTagContainer}>
                    {param.split(',').map((value, vIndex) => (
                      value.trim() && (
                        <span 
                          key={vIndex}
                          className={`${styles.paramTag} ${styles[`color${index % 5}`]}`}
                        >
                          {value.trim()}
                        </span>
                      )
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
        {!autoGenerate && (
        <div className={styles.buttonSection}>
          <button 
            className={styles.button} 
            onClick={generateCode}
            disabled={isGenerating}
          >
            {isGenerating ? '生成中...' : '生成代码'}
          </button>
        </div>
      )}
        <div className={styles.outputSection}>
        <div className={styles.labelRow}>
          <label className={styles.label}>输出结果:</label>
          <div className={styles.buttonGroup}>
            <button 
              className={`${styles.smallButton} ${styles.copyButton}`} 
              onClick={copyToClipboard}
              disabled={!output}
            >
              复制结果
            </button>
            <button 
              className={`${styles.smallButton} ${styles.clearOutputButton}`} 
              onClick={clearOutput}
              disabled={!output}
            >
              清空结果
            </button>
          </div>
        </div>
        <textarea 
          ref={outputRef}
          className={`${styles.textArea} ${styles.outputTextArea} ${output ? styles.outputTextAreaFilled : styles.outputTextAreaEmpty}`}
          value={output} 
          readOnly 
          placeholder="生成的代码将显示在这里..."
        />
      </div>
        {/* 历史记录部分 */}
      {history.length > 0 && (
        <div className={`${styles.inputSection} ${styles.historySection}`}>
          <div className={styles.labelRow}>
            <label className={styles.label}>历史结果:</label>
            <div className={styles.buttonGroup}>
              <button 
                className={`${styles.smallButton} ${styles.clearHistoryButton}`}
                onClick={clearAllHistory}
              >
                清空历史记录
              </button>
            </div>
          </div>
          
          <div className={styles.historyContainer}>
            {history.map((item) => (
              <div 
                key={item.id} 
                className={styles.historyItem}
                onClick={() => loadFromHistory(item)}
              >
                <div className={styles.historyItemContent}>
                  <div className={styles.historyItemTimestamp}>
                    {item.timestamp}
                  </div>
                  <div className={styles.historyItemPreview}>
                    {item.preview}
                  </div>
                </div>
                <button
                  className={styles.historyDeleteButton}
                  onClick={(e) => deleteHistoryItem(item.id, e)}
                  title="删除此记录"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
        <div className={styles.helpSection}>
        <h4>使用说明</h4>
        <ul>
          <li>在<strong>模板</strong>中使用 {'{#0}'}, {'{#1}'} 等作为参数占位符</li>
          <li>在<strong>参数值</strong>中输入内容，多个值用<strong>逗号</strong>分隔</li>
          <li>如果参数有多个值，工具会生成所有组合</li>
          <li>参数索引从 0 开始，即 {'{#0}'} 表示第一个参数</li>
          <li>按 <strong>Tab</strong> 键在最后一个参数框可以自动添加新参数</li>
          <li>使用 <strong>从文本批量导入</strong> 功能可以快速添加多行数据作为参数</li>
          <li>开启 <strong>自动生成</strong> 功能，输入时会自动更新结果</li>
          <li>点击 <strong>历史记录</strong> 中的项目可以快速恢复之前的设置和结果</li>
        </ul>
      </div>
    </div>
  );
}
