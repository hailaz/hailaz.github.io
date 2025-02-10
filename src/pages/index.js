import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import clsx from 'clsx';
import React from 'react';

import styles from './index.module.css';

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
  return (
    <Layout
      title={`欢迎来到 ${siteConfig.title}`}
      description="Description will go into a meta tag in <head />">
      {/* <HomepageHeader /> */}
      <main>
        <div className={clsx(styles.pageWrapper)}>
          <div className={clsx(styles.searchContainer)}>
            <form action="https://www.google.com/search" method="GET" target="_blank" className={styles.searchForm}>
              <input type="text" name="q" size="50" className={styles.searchInput} />
              <input type="submit" value="google" className={styles.searchButton} />
            </form>
            <form action="https://www.baidu.com/s" method="GET" target="_blank" className={styles.searchForm}>
              <input type="text" name="wd" size="50" className={styles.searchInput} />
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
