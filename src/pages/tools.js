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
    const [activeTab, setActiveTab] = React.useState(toolsList[0].value);
  
  const handleTabChange = (tabValue) => {
    setActiveTab(tabValue);
  };

  const activeTool = toolsList.find((tool) => tool.value === activeTab);

  return (
    <Layout
      title="工具集"
      description="实用的在线工具集合">
      <main>
        <div className={styles.toolsContainer}>
          <div className={styles.tabsContainer}>
            <div className={styles.tabList}>
              {toolsList.map((tool) => (
                <button
                  key={tool.value}
                  className={activeTab === tool.value ? styles.tabActive : ''}
                  onClick={() => handleTabChange(tool.value)}
                >
                  {tool.label}
                </button>
              ))}
            </div>
            <div className={styles.tabContent}>
              <div className={styles.toolDescription}>{activeTool.description}</div>
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