import React, { useCallback, useState } from 'react';
import styles from './styles.module.css';

export default function ImageEditor() {
  const [image, setImage] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleImageUpload = useCallback((event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImage(e.target.result);
        setResult(null);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const handleResize = useCallback(() => {
    if (!image) return;

    setLoading(true);
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const MAX_SIZE = 800;
      let width = img.width;
      let height = img.height;

      if (width > height) {
        if (width > MAX_SIZE) {
          height *= MAX_SIZE / width;
          width = MAX_SIZE;
        }
      } else {
        if (height > MAX_SIZE) {
          width *= MAX_SIZE / height;
          height = MAX_SIZE;
        }
      }

      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, width, height);
      
      const resizedImage = canvas.toDataURL('image/jpeg', 0.8);
      setResult(resizedImage);
      setLoading(false);
    };
    img.src = image;
  }, [image]);

  return (
    <div className={styles.container}>
      <div className={styles.uploadSection}>
        <input 
          type="file" 
          accept="image/*" 
          onChange={handleImageUpload} 
          className={styles.fileInput}
        />
        {image && (
          <button 
            onClick={handleResize} 
            className={styles.button}
            disabled={loading}
          >
            {loading ? '处理中...' : '压缩图片'}
          </button>
        )}
      </div>

      <div className={styles.previewSection}>
        {image && (
          <div className={styles.imageBox}>
            <h3>原图</h3>
            <img src={image} alt="Original" className={styles.preview} />
          </div>
        )}
        {result && (
          <div className={styles.imageBox}>
            <h3>压缩后</h3>
            <img src={result} alt="Resized" className={styles.preview} />
            <a 
              href={result} 
              download="compressed.jpg"
              className={styles.button}
            >
              下载
            </a>
          </div>
        )}
      </div>
    </div>
  );
}