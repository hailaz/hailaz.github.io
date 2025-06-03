/**
 * 工具集页面
 * 
 * 功能特性：
 * 1. 支持通过URL查询参数控制进入页面时选中的工具
 * 2. 访问示例：/tools?tool=qrcode 会自动选中二维码生成器
 * 3. 支持的工具参数值：image, json2struct, qrcode, codegen, caseconverter, encoder, snakegame, avatar
 * 4. 如果URL参数无效或不存在，会默认选中第一个工具
 * 5. 切换工具时会自动更新URL参数，便于分享特定工具的链接
 * 6. 一键复制功能：
 *    - 每个工具标签旁边都有小复制按钮
 *    - 工具描述区域右侧有大复制按钮
 *    - 复制成功后会显示浮动提示信息
 *    - 兼容现代浏览器的Clipboard API和旧版浏览器的execCommand方法
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
import styles from './tools.module.css';

const toolsList = [
  {
    label: '图片压缩',
    value: 'image',
    description: '在线图片压缩工具',
    component: <ImageEditor />,
  },
  {
    label: 'JSON转Go结构体',
    value: 'json2struct',
    description: '将JSON数据转换为Golang结构体定义',
    component: <Json2Struct />,
  },
  {
    label: '二维码生成器',
    value: 'qrcode',
    description: '生成二维码的工具',
    component: <QrCodeGenerator />,
  },
  {
    label: '模板代码生成器',
    value: 'codegen',
    description: '根据模板生成代码的工具',
    component: <CodeGenerator />,
  },  {
    label: '大小写转换器',
    value: 'caseconverter',
    description: '转换文本的大小写',
    component: <CaseConverter />,
  },
  {
    label: '编解码工具',
    value: 'encoder',
    description: '常用编码解码工具，支持Base64、URL、HTML、Unicode等',
    component: <EncoderDecoder />,
  },
  {
    label: '贪吃蛇游戏',
    value: 'snakegame',
    description: '经典的贪吃蛇游戏',
    component: <SnakeGame />,
  },
  {
    label: '橙子头像生成器',
    value: 'avatar',
    description: '生成可爱的橙子头像',
    component: <AvatarGenerator />,
  },
  // 这里可以继续添加更多工具
];

export default function Tools() {
  const {siteConfig} = useDocusaurusContext();
  const location = useLocation();
  
  // 从URL查询参数中获取工具名称
  const getInitialTool = () => {
    const urlParams = new URLSearchParams(location.search);
    const toolFromUrl = urlParams.get('tool');
    
    // 验证URL参数中的工具是否存在于工具列表中
    if (toolFromUrl && toolsList.some(tool => tool.value === toolFromUrl)) {
      return toolFromUrl;
    }
    
    return toolsList[0].value; // 默认选择第一个工具
  };
  
  const [activeTab, setActiveTab] = React.useState(getInitialTool());
  const [copySuccess, setCopySuccess] = React.useState('');
  
  // 监听URL变化，更新选中的工具
  React.useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const toolFromUrl = urlParams.get('tool');
    
    if (toolFromUrl && toolsList.some(tool => tool.value === toolFromUrl)) {
      setActiveTab(toolFromUrl);
    }
  }, [location.search]);
    const handleTabChange = (tabValue) => {
    setActiveTab(tabValue);
    
    // 更新URL参数，但不重新加载页面
    const newUrl = new URL(window.location);
    newUrl.searchParams.set('tool', tabValue);
    window.history.pushState({}, '', newUrl);
  };

  // 复制工具链接到剪贴板
  const copyToolLink = async (toolValue) => {
    try {
      const baseUrl = window.location.origin + window.location.pathname;
      const toolUrl = `${baseUrl}?tool=${toolValue}`;
      
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
      
      setCopySuccess(`已复制 ${toolsList.find(t => t.value === toolValue)?.label} 的链接`);
      
      // 3秒后清除提示信息
      setTimeout(() => {
        setCopySuccess('');
      }, 3000);
      
    } catch (err) {
      console.error('复制失败:', err);
      setCopySuccess('复制失败，请手动复制链接');
      setTimeout(() => {
        setCopySuccess('');
      }, 3000);
    }
  };

  const activeTool = toolsList.find((tool) => tool.value === activeTab);

  return (
    <Layout
      title="工具集"
      description="实用的在线工具集合">
      <main>        <div className={styles.toolsContainer}>
          {/* 复制成功提示 */}
          {copySuccess && (
            <div className={styles.copySuccessToast}>
              {copySuccess}
            </div>
          )}
          
          <div className={styles.tabsContainer}>
            <div className={styles.tabList}>
              {toolsList.map((tool) => (
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