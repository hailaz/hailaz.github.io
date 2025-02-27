import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import TabItem from '@theme/TabItem';
import Tabs from '@theme/Tabs';
import React from 'react';
import ImageEditor from '../components/ImageEditor';
import styles from './tools.module.css';

const toolsList = [
  {
    label: '图片压缩',
    value: 'image',
    description: '在线图片压缩工具',
    component: <ImageEditor />,
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