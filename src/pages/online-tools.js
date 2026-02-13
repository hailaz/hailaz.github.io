/**
 * 工具集页面
 * 
 * 功能特性：
 * 1. 工具分类管理：
 *    - 支持按分类组织工具（开发工具、文本处理、媒体处理、生活工具、娱乐游戏）
 *    - 每个分类显示图标、名称、描述和工具数量
 *    - 支持通过URL参数控制分类和工具选择
 * 2. URL参数支持：
 *    - 访问示例：/tools?category=dev&tool=json2struct
 *    - 支持的分类参数：dev, text, media, life, game
 *    - 支持的工具参数：根据工具的value属性
 *    - 自动根据选择的工具切换到对应分类
 * 3. 智能导航：
 *    - 切换分类时自动选择该分类的第一个工具
 *    - 切换工具时自动更新分类选择
 *    - URL参数实时同步，便于分享特定工具链接
 * 4. 一键复制功能：
 *    - 每个工具都有专属的链接复制功能
 *    - 复制的链接包含分类和工具信息
 *    - 复制成功后显示浮动提示信息
 *    - 兼容现代浏览器和旧版浏览器
 * 5. 响应式设计：
 *    - 分类导航支持响应式布局
 *    - 移动端友好的交互体验
 */

import { useLocation } from '@docusaurus/router';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import React from 'react';
import AvatarGenerator from '../components/AvatarGenerator/AvatarGenerator';
import CaseConverter from '../components/CaseConverter/CaseConverter';
import CodeGenerator from '../components/CodeGenerator/CodeGenerator';
import EncoderDecoder from '../components/EncoderDecoder/EncoderDecoder';
import ImageEditor from '../components/ImageEditor';
import Json2Struct from '../components/Json2Struct/Json2Struct';
import QrCodeGenerator from '../components/QrCodeGenerator/QrCodeGenerator';
import SnakeGame from '../components/SnakeGame/SnakeGame';
import styles from './online-tools.module.css';

// 常量定义
const CONSTANTS = {
  // URL参数名称
  URL_PARAM: {
    TOOL: 'tool',
    CATEGORY: 'category'
  },
  // 分类值
  CATEGORY: {
    ALL: 'all',
    DEV: 'dev',
    TEXT: 'text',
    MEDIA: 'media',
    LIFE: 'life',
    GAME: 'game'
  },
  // 默认设置
  DEFAULT: {
    CATEGORY: 'all',
    TIMEOUT: 3000 // 提示消息超时时间（毫秒）
  },
  // 消息文本
  MESSAGE: {
    COPY_SUCCESS: (toolName) => `已复制 ${toolName} 的链接`,
    COPY_FAIL: '复制失败，请手动复制链接'
  },
  // 页面标题
  PAGE: {
    TITLE: '工具集',
    DESCRIPTION: '实用的在线工具集合'
  }
};

// 工具分类定义
const toolCategories = [
  {
    name: '全部工具',
    value: CONSTANTS.CATEGORY.ALL,
    description: '显示所有可用工具',
    icon: '🔍'
  },
  {
    name: '开发工具',
    value: CONSTANTS.CATEGORY.DEV,
    description: '代码开发相关的实用工具',
    icon: '⚙️'
  },
  {
    name: '文本处理',
    value: CONSTANTS.CATEGORY.TEXT,
    description: '文本编辑和格式转换工具',
    icon: '📝'
  },
  {
    name: '媒体处理',
    value: CONSTANTS.CATEGORY.MEDIA,
    description: '图片、音视频处理工具',
    icon: '🎨'
  },
  {
    name: '生活工具',
    value: CONSTANTS.CATEGORY.LIFE,
    description: '日常生活实用小工具',
    icon: '🔧'
  },
  {
    name: '娱乐游戏',
    value: CONSTANTS.CATEGORY.GAME,
    description: '休闲娱乐小游戏',
    icon: '🎮'
  }
];

// 工具列表（按分类组织）
const toolsList = [
  {
    label: 'JSON转Go结构体',
    value: 'json2struct',
    description: '将JSON数据转换为Golang结构体定义',
    category: CONSTANTS.CATEGORY.DEV,
    component: <Json2Struct />,
  },
  {
    label: '模板代码生成器',
    value: 'codegen',
    description: '根据模板生成代码的工具',
    category: CONSTANTS.CATEGORY.DEV,
    component: <CodeGenerator />,
  },
  {
    label: '大小写转换器',
    value: 'caseconverter',
    description: '转换文本的大小写',
    category: CONSTANTS.CATEGORY.TEXT,
    component: <CaseConverter />,
  },
  {
    label: '编解码工具',
    value: 'encoder',
    description: '常用编码解码工具，支持Base64、URL、HTML、Unicode等',
    category: CONSTANTS.CATEGORY.TEXT,
    component: <EncoderDecoder />,
  },
  {
    label: '图片压缩',
    value: 'image',
    description: '在线图片压缩工具',
    category: CONSTANTS.CATEGORY.MEDIA,
    component: <ImageEditor />,
  },
  {
    label: '橙子头像生成器',
    value: 'avatar',
    description: '生成可爱的橙子头像',
    category: CONSTANTS.CATEGORY.MEDIA,
    component: <AvatarGenerator />,
  },
  {
    label: '二维码生成器',
    value: 'qrcode',
    description: '生成二维码的工具',
    category: CONSTANTS.CATEGORY.LIFE,
    component: <QrCodeGenerator />,
  },
  {
    label: '贪吃蛇游戏',
    value: 'snakegame',
    description: '经典的贪吃蛇游戏',
    category: CONSTANTS.CATEGORY.GAME,
    component: <SnakeGame />,
  },
  // 这里可以继续添加更多工具
];

export default function Tools() {
  const {siteConfig} = useDocusaurusContext();
  const location = useLocation();
  
  // 从URL查询参数中获取工具名称和分类
  const getInitialValues = () => {
    const urlParams = new URLSearchParams(location.search);
    const toolFromUrl = urlParams.get(CONSTANTS.URL_PARAM.TOOL);
    const categoryFromUrl = urlParams.get(CONSTANTS.URL_PARAM.CATEGORY);
    
    // 验证URL参数中的工具是否存在于工具列表中
    if (toolFromUrl && toolsList.some(tool => tool.value === toolFromUrl)) {
      const tool = toolsList.find(tool => tool.value === toolFromUrl);
      return {
        tool: toolFromUrl,
        category: categoryFromUrl === CONSTANTS.CATEGORY.ALL ? CONSTANTS.CATEGORY.ALL : tool.category
      };
    }
    
    // 如果指定了分类，选择该分类的第一个工具
    if (categoryFromUrl && toolCategories.some(cat => cat.value === categoryFromUrl)) {
      let categoryTools;
      if (categoryFromUrl === CONSTANTS.CATEGORY.ALL) {
        categoryTools = toolsList;
      } else {
        categoryTools = toolsList.filter(tool => tool.category === categoryFromUrl);
      }
      
      if (categoryTools.length > 0) {
        return {
          tool: categoryTools[0].value,
          category: categoryFromUrl
        };
      }
    }
    
    return {
      tool: toolsList[0].value,
      category: CONSTANTS.DEFAULT.CATEGORY // 默认选择"全部"分类
    };
  };
  
  const initialValues = getInitialValues();
  const [activeTab, setActiveTab] = React.useState(initialValues.tool);
  const [activeCategory, setActiveCategory] = React.useState(initialValues.category);
  const [copySuccess, setCopySuccess] = React.useState('');
    // 监听URL变化，更新选中的工具和分类
  React.useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const toolFromUrl = urlParams.get(CONSTANTS.URL_PARAM.TOOL);
    const categoryFromUrl = urlParams.get(CONSTANTS.URL_PARAM.CATEGORY);
    
    if (toolFromUrl && toolsList.some(tool => tool.value === toolFromUrl)) {
      const tool = toolsList.find(tool => tool.value === toolFromUrl);
      setActiveTab(toolFromUrl);
      // 如果URL中有明确指定分类为"all"，则使用"all"，否则使用工具自身的分类
      setActiveCategory(categoryFromUrl === CONSTANTS.CATEGORY.ALL ? CONSTANTS.CATEGORY.ALL : tool.category);
    } else if (categoryFromUrl && toolCategories.some(cat => cat.value === categoryFromUrl)) {
      let categoryTools;
      if (categoryFromUrl === CONSTANTS.CATEGORY.ALL) {
        categoryTools = toolsList;
      } else {
        categoryTools = toolsList.filter(tool => tool.category === categoryFromUrl);
      }
      
      if (categoryTools.length > 0) {
        setActiveTab(categoryTools[0].value);
        setActiveCategory(categoryFromUrl);
      }
    }
  }, [location.search]);

  // 处理分类切换
  const handleCategoryChange = (categoryValue) => {
    setActiveCategory(categoryValue);
    
    // 获取当前分类下的工具列表
    let categoryTools;
    if (categoryValue === CONSTANTS.CATEGORY.ALL) {
      categoryTools = toolsList;
    } else {
      categoryTools = toolsList.filter(tool => tool.category === categoryValue);
    }
    
    if (categoryTools.length > 0) {
      const firstTool = categoryTools[0].value;
      setActiveTab(firstTool);
      updateUrl(firstTool, categoryValue);
    }
  };
  
  // 处理工具切换
  const handleTabChange = (tabValue) => {
    const tool = toolsList.find(tool => tool.value === tabValue);
    setActiveTab(tabValue);
    // 只有当当前不是"全部"分类时，才更新分类
    if (activeCategory !== CONSTANTS.CATEGORY.ALL) {
      setActiveCategory(tool.category);
    }
    updateUrl(tabValue, activeCategory);
  };

  // 更新URL参数
  const updateUrl = (toolValue, categoryValue) => {
    const newUrl = new URL(window.location);
    newUrl.searchParams.set(CONSTANTS.URL_PARAM.TOOL, toolValue);
    newUrl.searchParams.set(CONSTANTS.URL_PARAM.CATEGORY, categoryValue);
    window.history.pushState({}, '', newUrl);
  };
  // 复制工具链接到剪贴板
  const copyToolLink = async (toolValue) => {
    try {
      const tool = toolsList.find(t => t.value === toolValue);
      const baseUrl = window.location.origin + window.location.pathname;
      const toolUrl = `${baseUrl}?${CONSTANTS.URL_PARAM.TOOL}=${toolValue}&${CONSTANTS.URL_PARAM.CATEGORY}=${tool.category}`;
      
      if (navigator.clipboard && window.isSecureContext) {
        // 现代浏览器使用 Clipboard API
        await navigator.clipboard.writeText(toolUrl);
      } else {
        // 兼容旧版浏览器的方法
        const textArea = document.createElement('textarea');
        textArea.value = toolUrl;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');
        textArea.remove();
      }
      
      setCopySuccess(CONSTANTS.MESSAGE.COPY_SUCCESS(tool?.label));
      
      // 3秒后清除提示信息
      setTimeout(() => {
        setCopySuccess('');
      }, CONSTANTS.DEFAULT.TIMEOUT);
      
    } catch (err) {
      console.error('复制失败:', err);
      setCopySuccess(CONSTANTS.MESSAGE.COPY_FAIL);
      setTimeout(() => {
        setCopySuccess('');
      }, CONSTANTS.DEFAULT.TIMEOUT);
    }
  };

  // 获取当前分类的工具列表
  const getCurrentCategoryTools = () => {
    // 如果是"全部"分类，返回所有工具
    if (activeCategory === CONSTANTS.CATEGORY.ALL) {
      return toolsList;
    }
    // 否则只返回当前分类的工具
    return toolsList.filter(tool => tool.category === activeCategory);
  };

  const activeTool = toolsList.find((tool) => tool.value === activeTab);
  const currentCategory = toolCategories.find(cat => cat.value === activeCategory);
  const currentCategoryTools = getCurrentCategoryTools();

  return (
    <Layout
      title={CONSTANTS.PAGE.TITLE}
      description={CONSTANTS.PAGE.DESCRIPTION}>      <main>
        <div className={styles.toolsContainer}>
          {/* 复制成功提示 */}
          {copySuccess && (
            <div className={styles.copySuccessToast}>
              {copySuccess}
            </div>
          )}
          
          {/* 分类导航 */}
          <div className={styles.categoryContainer}>
            <div className={styles.categoryList}>
              {toolCategories.map((category) => (
                <button
                  key={category.value}
                  className={`${styles.categoryItem} ${activeCategory === category.value ? styles.categoryActive : ''}`}
                  onClick={() => handleCategoryChange(category.value)}
                  title={category.description}
                >                  <span className={styles.categoryIcon}>{category.icon}</span>
                  <span className={styles.categoryName}>{category.name}</span>
                  <span className={styles.categoryCount}>
                    ({category.value === CONSTANTS.CATEGORY.ALL ? toolsList.length : toolsList.filter(tool => tool.category === category.value).length})
                  </span>
                </button>
              ))}
            </div>
          </div>
          
          <div className={styles.tabsContainer}>
            <div className={styles.tabList}>
              {currentCategoryTools.map((tool) => (
                <div key={tool.value} className={styles.tabItem}>
                  <button
                    className={activeTab === tool.value ? styles.tabActive : ''}
                    onClick={() => handleTabChange(tool.value)}
                  >
                    {tool.label}
                  </button>
                </div>
              ))}
            </div>
            <div className={styles.tabContent}>
              <div className={styles.toolHeader}>
                <div className={styles.toolDescription}>{activeTool.description}</div>
                <button
                  className={styles.copyCurrentButton}
                  onClick={() => copyToolLink(activeTab)}
                  title="复制当前工具链接"
                >
                  🔗 复制链接
                </button>
              </div>
              <div className={styles.toolContent}>
                {activeTool.component}
              </div>
            </div>
          </div>
        </div>
      </main>
    </Layout>
  );
}