import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import clsx from 'clsx';
import React, { useEffect, useRef, useState } from 'react';

import styles from './index.module.css';

// 水波纹组件
const RippleEffect = () => {
  useEffect(() => {
    let lastRippleTime = 0;
    const RIPPLE_DELAY = 300; // 控制水波纹产生的最小间隔

    const createRipple = (x, y) => {
      const ripple = document.createElement('div');
      ripple.classList.add(styles.ripple);
      document.body.appendChild(ripple);

      const size = 5; // 固定大小
      ripple.style.width = ripple.style.height = `${size}px`;
      
      // 调整水波纹位置，考虑鼠标指针的偏移
      const cursorOffset = 0; // 鼠标指针的偏移量
      ripple.style.left = `${x}px`;
      ripple.style.top = `${y - cursorOffset}px`;
      ripple.style.transform = 'translate(-50%, -50%)';

      ripple.classList.add(styles.rippleEffect);

      setTimeout(() => {
        ripple.remove();
      }, 5000);
    };

    const handleMouseMove = (event) => {
      const currentTime = Date.now();
      
      // 控制水波纹生成频率
      if (currentTime - lastRippleTime > RIPPLE_DELAY) {
        createRipple(event.clientX, event.clientY);
        lastRippleTime = currentTime;
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return null;
};

function HomepageHeader() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <h1 className="hero__title">{siteConfig.title}</h1>
      </div>
    </header>
  );
}

export default function Home() {
  const { siteConfig } = useDocusaurusContext();
  const googleInputRef = useRef(null);
  const baiduInputRef = useRef(null);
  const [googleInput, setGoogleInput] = useState('');
  const [baiduInput, setBaiduInput] = useState('');

  const clearInput = (inputRef, setInput) => {
    if (inputRef.current) {
      inputRef.current.value = '';
      inputRef.current.focus();
      setInput('');
    }
  };

  const handleKeyDown = (e, inputRef, setInput) => {
    if (e.key === 'Delete') {
      clearInput(inputRef, setInput);
    }
  };

  return (
    <Layout
      title={`欢迎来到 ${siteConfig.title}`}
      description="Description will go into a meta tag in <head />">
      <RippleEffect />
      {/* <HomepageHeader /> */}
      <main>
        <div className={clsx(styles.pageWrapper)}>
          <div className={clsx(styles.searchContainer)}>
            <form action="https://www.google.com/search" method="GET" target="_blank" className={styles.searchForm}>
              <input 
                ref={googleInputRef}
                type="text" 
                name="q" 
                size="50" 
                className={styles.searchInput} 
                autoFocus
                onKeyDown={(e) => handleKeyDown(e, googleInputRef, setGoogleInput)}
                onChange={(e) => setGoogleInput(e.target.value)}
                value={googleInput}
              />
              {googleInput && (
                <button 
                  type="button" 
                  onClick={() => clearInput(googleInputRef, setGoogleInput)} 
                  className={styles.clearButton}
                >×</button>
              )}
              <input type="submit" value="google" className={styles.searchButton} />
            </form>
            <form action="https://www.baidu.com/s" method="GET" target="_blank" className={styles.searchForm}>
              <input 
                ref={baiduInputRef}
                type="text" 
                name="wd" 
                size="50" 
                className={styles.searchInput}
                onKeyDown={(e) => handleKeyDown(e, baiduInputRef, setBaiduInput)}
                onChange={(e) => setBaiduInput(e.target.value)}
                value={baiduInput}
              />
              {baiduInput && (
                <button 
                  type="button" 
                  onClick={() => clearInput(baiduInputRef, setBaiduInput)} 
                  className={styles.clearButton}
                >×</button>
              )}
              <input type="submit" value="百度一下" className={styles.searchButton} />
            </form>
          </div>
          <div className={clsx(styles.linksContainer)}>
            <div className={styles.linkSection}>
              <div className={styles.sectionTitle}>常用</div>
              <div className={styles.linkList}>
                <a className={styles.linkItem} href='https://t.bilibili.com/' target="_blank">B站</a>
                <a className={styles.linkItem} href='https://www.speedtest.cn/' target="_blank">测速</a>
              </div>
            </div>

            <div className={styles.linkSection}>
              <div className={styles.sectionTitle}>购物</div>
              <div className={styles.linkList}>
                <a className={styles.linkItem} href='http://www.taobao.com/' target="_blank">淘宝</a>
                <a className={styles.linkItem} href='http://www.xiaomi.com/' target="_blank">小米</a>
                <a className={styles.linkItem} href='http://www.jd.com/' target="_blank">京东</a>
                <a className={styles.linkItem} href='http://www.amazon.cn/' target="_blank">亚马逊</a>
              </div>
            </div>

            <div className={styles.linkSection}>
              <div className={styles.sectionTitle}>影视</div>
              <div className={styles.linkList}>
                <a className={styles.linkItem} href='http://www.youku.com/' target="_blank">优酷</a>
                <a className={styles.linkItem} href='http://lpl.qq.com/' target="_blank">LPL</a>
                <a className={styles.linkItem} href='http://www.iqiyi.com/' target="_blank">爱奇艺</a>
                <a className={styles.linkItem} href='http://v.qq.com/' target="_blank">腾讯视频</a>
                <a className={styles.linkItem} href='https://www.mgtv.com/' target="_blank">芒果TV</a>
              </div>
            </div>

            <div className={styles.linkSection}>
              <div className={styles.sectionTitle}>社区</div>
              <div className={styles.linkList}>
                <a className={styles.linkItem} href='http://www.facebook.com/' target="_blank">facebook</a>
                <a className={styles.linkItem} href='https://www.google.com/' target="_blank">Google</a>
                <a className={styles.linkItem} href='https://www.youtube.com/' target="_blank">youtube</a>
                <a className={styles.linkItem} href='https://twitter.com/' target="_blank">twitter</a>
              </div>
            </div>
          </div>
        </div>
      </main>
    </Layout>
  );
}
