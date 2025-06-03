# 网页工具开发提示词

## 项目概述
基于 Docusaurus React 框架的个人技术文档网站，具有集成的在线工具功能模块。项目采用标签页式界面，为用户提供各种实用的在线工具。

## 技术架构

### 核心技术栈
- **框架**: React + Docusaurus
- **样式**: CSS Modules
- **组件化**: 函数式组件 + React Hooks
- **状态管理**: useState、useEffect、useCallback 等 React Hooks
- **模块化**: ES6 模块导入/导出

### 项目结构
```
src/
├── components/           # 组件目录
│   ├── ImageEditor/     # 图片编辑工具
│   ├── QrCodeGenerator/ # 二维码生成器
│   ├── Json2Struct/     # JSON转结构体
│   ├── CaseConverter/   # 大小写转换
│   ├── CodeGenerator/   # 代码生成器
│   ├── SnakeGame/       # 贪吃蛇游戏
│   └── AvatarGenerator/ # 头像生成器
├── pages/
│   ├── tools.js         # 工具集主页面
│   └── tools.module.css # 工具页面样式
└── css/                 # 全局样式
```

## 开发规范

### 组件开发规范

#### 1. 组件结构标准
```javascript
import React, { useState, useEffect, useCallback } from 'react';
import styles from './ComponentName.module.css'; // 或共享样式

export default function ComponentName() {
  // 状态定义
  const [state, setState] = useState(initialValue);
  
  // 事件处理函数
  const handleEvent = useCallback(() => {
    // 处理逻辑
  }, [dependencies]);
  
  // 副作用处理
  useEffect(() => {
    // 副作用逻辑
    return () => {
      // 清理逻辑
    };
  }, [dependencies]);
  
  return (
    <div className={styles.container}>
      {/* 组件内容 */}
    </div>
  );
}
```

#### 2. 样式规范
- **CSS Modules**: 使用 `.module.css` 后缀
- **类名约定**: 使用驼峰命名法
- **共享样式**: 可引用 `../../pages/tools.module.css`
- **响应式**: 支持多端适配

#### 3. 组件注册规范
在 `tools.js` 中注册新工具：
```javascript
const toolsList = [
  {
    label: '工具名称',
    value: 'toolIdentifier',
    description: '工具描述',
    component: <ComponentName />,
  },
  // ...其他工具
];
```

### 功能开发指南

#### 1. 文件处理工具
- 使用 `FileReader` API 处理文件上传
- 支持拖拽上传功能
- 提供文件格式验证
- 实现进度显示和错误处理

#### 2. 图像处理工具
- 使用 `Canvas` API 进行图像操作
- 支持图片压缩、裁剪、滤镜等功能
- 提供预览和下载功能
- 保持良好的性能表现

#### 3. 文本处理工具
- 支持实时预览
- 提供复制到剪贴板功能
- 实现格式转换和验证
- 支持批量处理

#### 4. 代码生成工具
- 提供模板选择功能
- 支持自定义参数配置
- 实现代码高亮显示
- 提供一键复制功能

#### 5. 游戏和娱乐工具
- 使用 Canvas 或 SVG 进行图形渲染
- 实现游戏循环和状态管理
- 提供分数记录和排行榜
- 支持键盘和触屏操作

### 用户体验优化

#### 1. 交互设计
- **即时反馈**: 操作后立即显示结果
- **进度指示**: 长时间操作显示进度条
- **错误处理**: 友好的错误提示信息
- **快捷操作**: 支持键盘快捷键

#### 2. 性能优化
- **懒加载**: 大型库按需加载
- **防抖处理**: 用户输入防抖优化
- **内存管理**: 及时清理不需要的资源
- **缓存策略**: 合理使用浏览器缓存

#### 3. 响应式设计
- **移动端适配**: 支持触屏操作
- **布局自适应**: 不同屏幕尺寸适配
- **字体缩放**: 支持无障碍访问
- **暗色模式**: 支持主题切换

### 代码质量要求

#### 1. 代码风格
- 使用 ESLint 和 Prettier 格式化
- 遵循 React 最佳实践
- 保持代码简洁易读
- 添加必要的注释说明

#### 2. 错误处理
```javascript
try {
  // 可能出错的操作
  const result = await riskyOperation();
  setResult(result);
} catch (error) {
  console.error('操作失败:', error);
  setError('操作失败，请重试');
}
```

#### 3. 状态管理
```javascript
// 使用 useCallback 优化性能
const handleInputChange = useCallback((event) => {
  setInputValue(event.target.value);
}, []);

// 使用 useEffect 处理副作用
useEffect(() => {
  // 组件挂载或依赖变化时执行
  return () => {
    // 清理函数
  };
}, [dependency]);
```

### 第三方库集成

#### 1. 库的选择原则
- **轻量级**: 优先选择体积小的库
- **维护良好**: 活跃维护的开源项目
- **兼容性**: 与 React 和 Docusaurus 兼容
- **按需加载**: 支持动态导入

#### 2. 常用库集成示例
```javascript
// 动态加载外部库
useEffect(() => {
  const script = document.createElement('script');
  script.src = 'https://cdn.jsdelivr.net/npm/library@version/lib.min.js';
  script.async = true;
  script.onload = () => {
    // 库加载完成后的初始化逻辑
    initializeLibrary();
  };
  document.body.appendChild(script);
  
  return () => {
    if (document.body.contains(script)) {
      document.body.removeChild(script);
    }
  };
}, []);
```

### 安全考虑

#### 1. 用户输入验证
- 验证文件类型和大小
- 过滤恶意代码输入
- 防止 XSS 攻击
- 限制上传文件大小

#### 2. 隐私保护
- 本地处理数据，不上传服务器
- 清理临时数据
- 提供数据导出功能
- 明确隐私政策

### 测试策略

#### 1. 单元测试
- 测试组件渲染
- 测试事件处理函数
- 测试状态变化
- 测试边界条件

#### 2. 集成测试
- 测试组件交互
- 测试文件处理流程
- 测试第三方库集成
- 测试错误处理

### 部署和维护

#### 1. 构建优化
- 代码分割和懒加载
- 静态资源压缩
- 缓存策略配置
- SEO 优化

#### 2. 监控和调试
- 错误日志记录
- 性能监控
- 用户行为分析
- 浏览器兼容性测试

## 常见工具开发模板

### 文本处理工具模板
```javascript
import React, { useState, useCallback } from 'react';
import styles from '../../pages/tools.module.css';

export default function TextProcessor() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  
  const handleProcess = useCallback(() => {
    try {
      // 处理逻辑
      const processed = processText(input);
      setOutput(processed);
    } catch (error) {
      console.error('处理失败:', error);
    }
  }, [input]);
  
  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(output);
  }, [output]);
  
  return (
    <div className={styles.container}>
      <div className={styles.inputSection}>
        <label className={styles.label}>输入</label>
        <textarea 
          className={styles.textArea}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="请输入内容..."
        />
      </div>
      
      <div className={styles.buttonSection}>
        <button className={styles.button} onClick={handleProcess}>
          处理
        </button>
      </div>
      
      <div className={styles.outputSection}>
        <label className={styles.label}>输出</label>
        <textarea 
          className={styles.textArea}
          value={output}
          readOnly
        />
        <button className={styles.button} onClick={handleCopy}>
          复制
        </button>
      </div>
    </div>
  );
}
```

### 文件处理工具模板
```javascript
import React, { useState, useCallback } from 'react';
import styles from '../../pages/tools.module.css';

export default function FileProcessor() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const handleFileUpload = useCallback((event) => {
    const uploadedFile = event.target.files[0];
    if (uploadedFile) {
      setFile(uploadedFile);
      // 处理文件
      processFile(uploadedFile);
    }
  }, []);
  
  const processFile = useCallback(async (file) => {
    setLoading(true);
    try {
      // 文件处理逻辑
      const processed = await handleFileProcessing(file);
      setResult(processed);
    } catch (error) {
      console.error('文件处理失败:', error);
    } finally {
      setLoading(false);
    }
  }, []);
  
  return (
    <div className={styles.container}>
      <div className={styles.uploadSection}>
        <input 
          type="file" 
          onChange={handleFileUpload}
          accept=".jpg,.png,.gif"
        />
      </div>
      
      {loading && <div className={styles.loading}>处理中...</div>}
      
      {result && (
        <div className={styles.resultSection}>
          {/* 显示处理结果 */}
        </div>
      )}
    </div>
  );
}
```

## 最佳实践总结

1. **组件设计**: 保持组件功能单一，易于复用和维护
2. **性能优化**: 合理使用 React Hooks，避免不必要的重渲染
3. **用户体验**: 提供实时反馈和友好的错误提示
4. **代码质量**: 遵循 React 最佳实践，保持代码整洁
5. **安全性**: 验证用户输入，保护用户隐私
6. **可维护性**: 良好的代码结构和文档说明
7. **扩展性**: 易于添加新功能和工具

遵循以上规范和模板，可以高效地开发出高质量的网页工具组件。
