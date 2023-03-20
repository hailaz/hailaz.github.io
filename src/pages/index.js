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
        <div className={clsx(styles.mysearch)}>
          <form action="https://www.google.com/search" method="GET" target="_blank">
            <input type="text" name="q" size="50" />
            <input type="submit" value="google" style={{width: '80px'}}/>
          </form>
          <form action="https://www.baidu.com/s" method="GET" target="_blank">
            <input type="text" name="wd" size="50" />
            <input type="submit" value="百度一下" style={{width: '80px'}}/>
          </form>
        </div>
        {/* <HomepageFeatures /> */}
        <div className={clsx(styles.mytable)}>
          <table>
            <tbody>
              <tr>
                <td>常用</td>
                <td>
                  <a href='https://t.bilibili.com/' target="_blank">B站</a>
                </td>
                <td>
                  <a href='https://www.speedtest.cn/' target="_blank">测速</a>
                </td>
              </tr>
              <tr>
                <td>购物</td>
                <td>
                  <a href='http://www.taobao.com/' target="_blank">淘宝</a>
                </td>
                <td>
                  <a href='http://www.xiaomi.com/' target="_blank">小米</a>
                </td>
                <td>
                  <a href='http://www.jd.com/' target="_blank">京东</a>
                </td>
                <td>
                  <a href='http://www.amazon.cn/' target="_blank">亚马逊</a>
                </td>
              </tr>
              <tr>
                <td>影视</td>
                <td>
                  <a href='http://www.youku.com/' target="_blank">优酷</a>
                </td>
                <td>
                  <a href='http://lpl.qq.com/' target="_blank">LPL</a>
                </td>
                <td>
                  <a href='http://www.iqiyi.com/' target="_blank">爱奇艺</a>
                </td>
                <td>
                  <a href='http://v.qq.com/' target="_blank">腾讯视频</a>
                </td>
                <td>
                  <a href='https://www.mgtv.com/' target="_blank">芒果TV</a>
                </td>
              </tr>
              <tr>
                <td>社区</td>
                <td>
                  <a href='http://www.facebook.com/' target="_blank">facebook</a>
                </td>
                <td>
                  <a href='https://www.google.com/' target="_blank">google</a>
                </td>
                <td>
                  <a href='https://www.youtube.com/' target="_blank">youtube</a>
                </td>
                <td>
                  <a href='https://twitter.com/' target="_blank">twitter</a>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </main>
    </Layout>
  );
}
