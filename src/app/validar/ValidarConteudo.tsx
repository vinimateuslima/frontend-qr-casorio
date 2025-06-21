'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { api } from '@/services/api';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import styles from './styles.module.css';

interface ValidacaoStatus {
  sucesso: boolean;
  mensagem: string;
}

export default function ValidarConteudo() {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<ValidacaoStatus | null>(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    const validarSenha = async () => {
      const senha = searchParams.get('senha');
      
      if (!senha) {
        setStatus({
          sucesso: false,
          mensagem: 'Nenhuma senha fornecida para validação.'
        });
        setCarregando(false);
        return;
      }

      try {
        const resposta = await api.validarSenha({ senha });
        setStatus({
          sucesso: resposta.mensagem.includes('sucesso'),
          mensagem: resposta.mensagem
        });
      } catch (error) {
        const apiError = error as { message: string };
        setStatus({
          sucesso: false,
          mensagem: apiError.message || 'Erro ao validar senha'
        });
      } finally {
        setCarregando(false);
      }
    };

    validarSenha();
  }, [searchParams]);

  if (carregando) {
    return (
      <div className={styles.container}>
        <div className={styles.card}>
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Carregando...</span>
          </div>
          <p className={styles.mensagem}>Validando senha...</p>
        </div>
      </div>
    );
  }

  if (!status) return null;

  return (
    <div className={styles.container}>
      <div className={`${styles.card} ${status.sucesso ? styles.sucesso : styles.erro}`}>
        {status.sucesso ? (
          <>
            <FaCheckCircle className={styles.icone} />
            <h1 className={styles.titulo}>Validação Bem-sucedida!</h1>
            <p className={styles.mensagem}>{status.mensagem}</p>
          </>
        ) : (
          <>
            <FaTimesCircle className={styles.icone} />
            <h1 className={styles.titulo}>Falha na Validação</h1>
            <p className={styles.mensagem}>{status.mensagem}</p>
          </>
        )}
      </div>
    </div>
  );
} 