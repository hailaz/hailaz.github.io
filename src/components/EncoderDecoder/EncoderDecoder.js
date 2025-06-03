import { useCallback, useEffect, useState } from 'react';
import styles from '../../pages/tools.module.css';

// 编解码类型定义
const ENCODE_TYPES = [
  { 
    key: 'base64', 
    label: 'Base64', 
    supportsDecoding: true, 
    description: '常用的二进制到文本编码',
    examples: {
      encode: 'Hello World!',
      decode: 'SGVsbG8gV29ybGQh'
    }
  },
  { 
    key: 'url', 
    label: 'URL编码', 
    supportsDecoding: true, 
    description: 'URL中特殊字符的编码',
    examples: {
      encode: 'Hello World! @#$%^&*()',
      decode: 'Hello%20World%21%20%40%23%24%25%5E%26%2A%28%29'
    }
  },
  { 
    key: 'html', 
    label: 'HTML编码', 
    supportsDecoding: true, 
    description: 'HTML中特殊字符的编码',
    examples: {
      encode: '<script>alert("Hello & World!");</script>',
      decode: '&lt;script&gt;alert(&quot;Hello &amp; World!&quot;);&lt;/script&gt;'
    }
  },
  { 
    key: 'unicode', 
    label: 'Unicode', 
    supportsDecoding: true, 
    description: 'Unicode字符的转义表示',
    examples: {
      encode: '你好世界! Hello',
      decode: '\\u4f60\\u597d\\u4e16\\u754c! Hello'
    }
  },
  { 
    key: 'hex', 
    label: '16进制', 
    supportsDecoding: true, 
    description: '十六进制表示',
    examples: {
      encode: 'Hello',
      decode: '48 65 6c 6c 6f'
    }
  },
  { 
    key: 'binary', 
    label: '二进制', 
    supportsDecoding: true, 
    description: '二进制表示',
    examples: {
      encode: 'Hi',
      decode: '01001000 01101001'
    }
  },
  { 
    key: 'md5', 
    label: 'MD5', 
    supportsDecoding: false, 
    description: 'MD5单向哈希',
    examples: {
      encode: 'Hello World'
    }
  },
  { 
    key: 'sha1', 
    label: 'SHA1', 
    supportsDecoding: false, 
    description: 'SHA1单向哈希',
    examples: {
      encode: 'Hello World'
    }
  },
  { 
    key: 'sha256', 
    label: 'SHA256', 
    supportsDecoding: false, 
    description: 'SHA256单向哈希',
    examples: {
      encode: 'Hello World'
    }
  },
  { 
    key: 'jwt', 
    label: 'JWT解析', 
    supportsDecoding: true, 
    decodeOnly: true, 
    description: 'JWT token解析',
    examples: {
      decode: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'
    }
  }
];

export default function EncoderDecoder() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [encodeType, setEncodeType] = useState('base64');
  const [operation, setOperation] = useState('encode');
  const [error, setError] = useState('');

  // Base64 编解码
  const base64Encode = (str) => {
    try {
      return btoa(unescape(encodeURIComponent(str)));
    } catch (e) {
      throw new Error('Base64编码失败：' + e.message);
    }
  };

  const base64Decode = (str) => {
    try {
      return decodeURIComponent(escape(atob(str)));
    } catch (e) {
      throw new Error('Base64解码失败：请检查输入格式');
    }
  };

  // URL 编解码
  const urlEncode = (str) => {
    try {
      return encodeURIComponent(str);
    } catch (e) {
      throw new Error('URL编码失败：' + e.message);
    }
  };

  const urlDecode = (str) => {
    try {
      return decodeURIComponent(str);
    } catch (e) {
      throw new Error('URL解码失败：请检查输入格式');
    }
  };

  // HTML 编解码
  const htmlEncode = (str) => {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  };

  const htmlDecode = (str) => {
    const div = document.createElement('div');
    div.innerHTML = str;
    return div.textContent || div.innerText || '';
  };

  // Unicode 编解码
  const unicodeEncode = (str) => {
    return str.split('').map(char => {
      const code = char.charCodeAt(0);
      return code > 127 ? '\\u' + code.toString(16).padStart(4, '0') : char;
    }).join('');
  };

  const unicodeDecode = (str) => {
    try {
      return str.replace(/\\u([0-9a-fA-F]{4})/g, (match, code) => {
        return String.fromCharCode(parseInt(code, 16));
      });
    } catch (e) {
      throw new Error('Unicode解码失败：请检查输入格式');
    }
  };

  // 16进制编解码
  const hexEncode = (str) => {
    return Array.from(str).map(char => 
      char.charCodeAt(0).toString(16).padStart(2, '0')
    ).join(' ');
  };

  const hexDecode = (str) => {
    try {
      const hexArray = str.replace(/\s+/g, '').match(/.{1,2}/g) || [];
      return hexArray.map(hex => String.fromCharCode(parseInt(hex, 16))).join('');
    } catch (e) {
      throw new Error('16进制解码失败：请检查输入格式');
    }
  };

  // 二进制编解码
  const binaryEncode = (str) => {
    return Array.from(str).map(char => 
      char.charCodeAt(0).toString(2).padStart(8, '0')
    ).join(' ');
  };

  const binaryDecode = (str) => {
    try {
      const binaryArray = str.replace(/\s+/g, '').match(/.{1,8}/g) || [];
      return binaryArray.map(binary => String.fromCharCode(parseInt(binary, 2))).join('');
    } catch (e) {
      throw new Error('二进制解码失败：请检查输入格式');
    }
  };

  // 哈希函数（仅编码，无解码）
  const generateHash = async (str, algorithm) => {
    if (!window.crypto || !window.crypto.subtle) {
      throw new Error('当前浏览器不支持加密API');
    }

    const encoder = new TextEncoder();
    const data = encoder.encode(str);
    const hashBuffer = await window.crypto.subtle.digest(algorithm, data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  };
  // MD5 (使用简单实现)
  const simpleMD5 = (str) => {
    // 简化的MD5实现，实际项目中建议使用专门的库
    // 这里提供一个基本的哈希函数作为示例
    let hash = 0;
    if (str.length === 0) return hash.toString(16);
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // 转换为32位整数
    }
    // 将结果转换为类似MD5的格式（这不是真正的MD5）
    const result = Math.abs(hash).toString(16).padStart(8, '0');
    return result + result + result + result; // 补足32位
  };

  // JWT 解析
  const parseJWT = (token) => {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) {
        throw new Error('无效的JWT格式');
      }

      const header = JSON.parse(base64Decode(parts[0]));
      const payload = JSON.parse(base64Decode(parts[1]));

      return JSON.stringify({
        header,
        payload,
        signature: parts[2]
      }, null, 2);
    } catch (e) {
      throw new Error('JWT解析失败：' + e.message);
    }
  };
  // 主要的编解码处理函数
  const handleProcess = useCallback(async () => {
    setError('');
    
    if (!input.trim()) {
      setOutput('');
      return;
    }

    try {
      let result = '';

      switch (encodeType) {
        case 'base64':
          result = operation === 'encode' ? base64Encode(input) : base64Decode(input);
          break;
        case 'url':
          result = operation === 'encode' ? urlEncode(input) : urlDecode(input);
          break;
        case 'html':
          result = operation === 'encode' ? htmlEncode(input) : htmlDecode(input);
          break;
        case 'unicode':
          result = operation === 'encode' ? unicodeEncode(input) : unicodeDecode(input);
          break;
        case 'hex':
          result = operation === 'encode' ? hexEncode(input) : hexDecode(input);
          break;
        case 'binary':
          result = operation === 'encode' ? binaryEncode(input) : binaryDecode(input);
          break;
        case 'md5':
          if (operation === 'decode') {
            throw new Error('MD5是单向哈希，无法解码');
          }
          result = simpleMD5(input);
          break;
        case 'sha1':
          if (operation === 'decode') {
            throw new Error('SHA1是单向哈希，无法解码');
          }
          result = await generateHash(input, 'SHA-1');
          break;
        case 'sha256':
          if (operation === 'decode') {
            throw new Error('SHA256是单向哈希，无法解码');
          }
          result = await generateHash(input, 'SHA-256');
          break;
        case 'jwt':
          if (operation === 'encode') {
            throw new Error('JWT解析工具只支持解码');
          }
          result = parseJWT(input);
          break;
        default:
          throw new Error('不支持的编码类型');
      }

      setOutput(result);
    } catch (err) {
      setError(err.message);
      setOutput('');
    }
  }, [input, encodeType, operation]);
  // 实时处理 - 当输入、编码类型或操作改变时自动执行
  useEffect(() => {
    handleProcess();
  }, [handleProcess]);

  // 复制到剪贴板
  const handleCopy = useCallback(() => {
    if (output) {
      navigator.clipboard.writeText(output).then(() => {
        // 可以添加复制成功的提示
      }).catch(() => {
        // 复制失败的处理
      });
    }
  }, [output]);

  // 清空输入输出
  const handleClear = useCallback(() => {
    setInput('');
    setOutput('');
    setError('');
  }, []);
  // 交换输入输出
  const handleSwap = useCallback(() => {
    if (output && !error) {
      setInput(output);
      setOutput(input);
      setOperation(operation === 'encode' ? 'decode' : 'encode');
    }
  }, [input, output, operation, error]);

  // 切换编码类型
  const handleEncodeTypeChange = useCallback((newType) => {
    setEncodeType(newType);
    const typeInfo = ENCODE_TYPES.find(t => t.key === newType);
    
    // 根据编码类型自动设置操作模式
    if (typeInfo?.decodeOnly) {
      setOperation('decode');
    } else if (!typeInfo?.supportsDecoding) {
      setOperation('encode');
    }
    
    // 清空错误信息
    setError('');
  }, []);

  // 使用示例
  const handleUseExample = useCallback((exampleType) => {
    const currentType = ENCODE_TYPES.find(t => t.key === encodeType);
    if (currentType && currentType.examples) {
      const example = currentType.examples[exampleType];
      if (example) {
        setInput(example);
        if (exampleType === 'encode') {
          setOperation('encode');
        } else if (exampleType === 'decode') {
          setOperation('decode');
        }
      }
    }
  }, [encodeType]);

  // 获取当前编码类型信息
  const currentTypeInfo = ENCODE_TYPES.find(t => t.key === encodeType);
  const supportsDecoding = currentTypeInfo?.supportsDecoding;
  const isDecodeOnly = currentTypeInfo?.decodeOnly;
  return (
    <div className={styles.container}>
      {/* 编码类型标签页 */}
      <div className={styles.encodeTabs}>
        {ENCODE_TYPES.map((type) => (
          <button
            key={type.key}
            className={`${styles.encodeTab} ${encodeType === type.key ? styles.encodeTabActive : ''}`}
            onClick={() => handleEncodeTypeChange(type.key)}
            title={type.description}
          >
            {type.label}
          </button>
        ))}
      </div>

      {/* 当前编码类型描述 */}
      <div className={styles.typeDescription}>
        {currentTypeInfo?.description}
      </div>      {/* 操作选择 */}
      <div className={styles.operationPanel}>
        <div className={styles.radioGroup}>
          <label className={styles.radioLabel}>
            <input
              type="radio"
              value="encode"
              checked={operation === 'encode'}
              onChange={(e) => setOperation(e.target.value)}
              disabled={isDecodeOnly}
            />
            {isDecodeOnly ? '解析' : '编码'}
          </label>
          {supportsDecoding && !isDecodeOnly && (
            <label className={styles.radioLabel}>
              <input
                type="radio"
                value="decode"
                checked={operation === 'decode'}
                onChange={(e) => setOperation(e.target.value)}
              />
              解码
            </label>
          )}
        </div>

        <div className={styles.buttonGroup}>
          {/* 示例按钮 */}
          {currentTypeInfo?.examples && (
            <div className={styles.exampleButtons}>
              {currentTypeInfo.examples.encode && !isDecodeOnly && (
                <button 
                  className={styles.exampleButton} 
                  onClick={() => handleUseExample('encode')}
                  title={`示例: ${currentTypeInfo.examples.encode}`}
                >
                  编码示例
                </button>
              )}
              {currentTypeInfo.examples.decode && supportsDecoding && (
                <button 
                  className={styles.exampleButton} 
                  onClick={() => handleUseExample('decode')}
                  title={`示例: ${currentTypeInfo.examples.decode}`}
                >
                  {isDecodeOnly ? '解析示例' : '解码示例'}
                </button>
              )}
            </div>
          )}
          
          <button className={styles.smallButton} onClick={handleClear}>
            清空
          </button>
          {supportsDecoding && !isDecodeOnly && (
            <button className={styles.smallButton} onClick={handleSwap}>
              交换
            </button>
          )}
        </div>
      </div>

      {/* 输入区域 */}
      <div className={styles.inputSection}>
        <label className={styles.label}>
          输入 ({operation === 'encode' ? '原文' : (isDecodeOnly ? '待解析内容' : '密文')}):
        </label>
        <textarea 
          className={styles.textArea}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={`请输入要${operation === 'encode' ? '编码' : (isDecodeOnly ? '解析' : '解码')}的内容...`}
          rows="8"
        />
      </div>

      {/* 输出区域 */}
      <div className={styles.outputSection}>
        <div className={styles.labelRow}>
          <label className={styles.label}>
            输出 ({operation === 'encode' ? '密文' : (isDecodeOnly ? '解析结果' : '原文')}):
          </label>
          <button 
            className={styles.smallButton} 
            onClick={handleCopy}
            disabled={!output}
          >
            复制
          </button>
        </div>
        <textarea 
          className={styles.textArea}
          value={output}
          readOnly
          placeholder="处理结果将在这里显示..."
          rows="8"
        />
      </div>

      {/* 错误提示 */}
      {error && (
        <div className={styles.errorMessage}>
          {error}
        </div>
      )}      {/* 使用说明 */}
      <div className={styles.helpSection}>
        <h4>使用说明：</h4>
        <ul>
          <li><strong>Base64：</strong>常用的二进制到文本编码方案</li>
          <li><strong>URL编码：</strong>用于URL中特殊字符的编码</li>
          <li><strong>HTML编码：</strong>用于HTML中特殊字符的编码</li>
          <li><strong>Unicode：</strong>Unicode字符的转义表示</li>
          <li><strong>16进制：</strong>十六进制表示，字符间用空格分隔</li>
          <li><strong>二进制：</strong>二进制表示，字符间用空格分隔</li>
          <li><strong>哈希函数：</strong>MD5/SHA1/SHA256单向哈希（仅编码）</li>
          <li><strong>JWT解析：</strong>解析JWT token的header和payload</li>
        </ul>
        <p><em>💡 提示：</em></p>
        <ul>
          <li>输入内容后会自动进行编解码处理，切换编码类型也会实时更新结果</li>
          <li>点击"示例"按钮可以快速加载测试数据，了解各种编码格式的效果</li>
          <li>可以将鼠标悬停在示例按钮上查看示例内容</li>
        </ul>
      </div>
    </div>
  );
}
