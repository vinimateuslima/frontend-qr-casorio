'use client';

import { useRef } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { APP_URL } from '@/config/app';
import styles from './styles.module.css';

export default function QRCodePage({ params }: { params: { senha: string } }) {
  const qrRef = useRef<HTMLDivElement>(null);
  const validationUrl = `${APP_URL}/validar?senha=${params.senha}`;

  const downloadQRCode = () => {
    const canvas = qrRef.current?.querySelector('canvas');
    if (canvas) {
      const image = canvas.toDataURL('image/png');
      const anchor = document.createElement('a');
      anchor.href = image;
      anchor.download = `qrcode-${params.senha}.png`;
      document.body.appendChild(anchor);
      anchor.click();
      document.body.removeChild(anchor);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div ref={qrRef} className={styles.qrContainer}>
          <QRCodeCanvas
            value={validationUrl}
            size={256}
            level="H"
            includeMargin={true}
          />
        </div>
        
        <p className={styles.senha}>
          <strong>Senha:</strong> {params.senha}
        </p>

        <button 
          onClick={downloadQRCode}
          className={styles.downloadButton}
        >
          Baixar QR Code
        </button>
      </div>
    </div>
  );
} 