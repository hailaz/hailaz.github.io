import React, { useEffect, useRef, useState } from 'react';
import styles from '../../pages/online-tools.module.css';

export default function QrCodeGenerator() {
  const [url, setUrl] = useState('www.hailaz.cn');
  const qrContainerRef = useRef(null);

  useEffect(() => {
    // 动态加载 qrcode 库
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/qrcodejs@1.0.0/qrcode.min.js';
    script.async = true;
    script.onload = () => {
      generateQrCode();
    };
    document.body.appendChild(script);
    
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  useEffect(() => {
    if (window.QRCode) {
      generateQrCode();
    }
  }, [url]);

  const generateQrCode = () => {
    if (!qrContainerRef.current || !window.QRCode) return;
    
    // 清除之前的二维码
    qrContainerRef.current.innerHTML = '';
    
    // 生成新二维码
    new window.QRCode(qrContainerRef.current, {
      text: url || 'null',
      width: 300,
      height: 300,
      colorDark: '#000000',
      colorLight: '#ffffff',
      correctLevel: window.QRCode.CorrectLevel.H
    });
  };

  return (
    <div>
      <div>
        <label className={styles.label}>输入网址或文本:</label>
        <input 
          className={styles.inputField}
          type="text" 
          value={url} 
          onChange={(e) => setUrl(e.target.value)} 
          placeholder="输入需要转换为二维码的内容"
        />
      </div>
      
      <div className={styles.qrContainer} ref={qrContainerRef}></div>
      
      <p className={styles.hint}>二维码会根据输入内容自动更新</p>
    </div>
  );
}
