'use client';

import { Suspense } from 'react';
import ValidarConteudo from './ValidarConteudo';
import styles from './styles.module.css';

export default function ValidarPage() {
  return (
    <Suspense fallback={
      <div className={styles.container}>
        <div className={styles.card}>
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Carregando...</span>
          </div>
          <p className={styles.mensagem}>Carregando...</p>
        </div>
      </div>
    }>
      <ValidarConteudo />
    </Suspense>
  );
} 