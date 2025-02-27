import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import TabItem from '@theme/TabItem';
import Tabs from '@theme/Tabs';
import React from 'react';
import ImageEditor from '../components/ImageEditor';
import CaseConverter from '../components/tools/CaseConverter';
import CodeGenerator from '../components/tools/CodeGenerator';
import Json2Struct from '../components/tools/Json2Struct';
import QrCodeGenerator from '../components/tools/QrCodeGenerator';
import SnakeGame from '../components/tools/SnakeGame';
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
    label: '代码生成器',
    value: 'codegen',
    description: '根据模板生成代码的工具',
    component: <CodeGenerator />,
  },
  {
    label: '大小写转换器',
    value: 'caseconverter',
    description: '转换文本的大小写',
    component: <CaseConverter />,
  },
  {
    label: '贪吃蛇游戏',
    value: 'snakegame',
    description: '经典的贪吃蛇游戏',
    component: <SnakeGame />,
  },
  // 这里可以继续添加更多工具
];

export default function Tools() {
  const {siteConfig} = useDocusaurusContext();
  
  return (
    <Layout
      title="工具集"
      description="实用的在线工具集合">
      <main>
        <div className={styles.toolsContainer}>
          <h1>实用工具集</h1>
          <Tabs defaultValue={toolsList[0].value} className={styles.tabs}>
            {toolsList.map((tool) => (
              <TabItem 
                key={tool.value} 
                value={tool.value} 
                label={tool.label}
                className={styles.tabContent}
              >
                <div className={styles.toolDescription}>{tool.description}</div>
                <div className={styles.toolContent}>
                  {tool.component}
                </div>
              </TabItem>
            ))}
          </Tabs>
        </div>
      </main>
    </Layout>
  );
}