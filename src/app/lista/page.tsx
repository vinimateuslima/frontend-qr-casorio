'use client';

import { useEffect, useState } from 'react';
import { api, Convidado } from '@/services/api';
import { TabelaConvidadosSimples } from '@/components/TabelaConvidadosSimples';
import { ContadoresConvidados } from '@/components/ContadoresConvidados';
import styles from './styles.module.css';

export default function ListaConvidados() {
  const [convidados, setConvidados] = useState<Convidado[]>([]);
  const [carregando, setCarregando] = useState(true);

  const carregarConvidados = async () => {
    try {
      const dados = await api.listarConvidados();
      setConvidados(dados);
    } catch (error) {
      console.error('Erro ao carregar convidados:', error);
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    carregarConvidados();
  }, []);

  if (carregando) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Carregando...</span>
        </div>
      </div>
    );
  }

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <h1 className={styles.titulo}>Lista de Convidados</h1>
        <ContadoresConvidados convidados={convidados} />
        <TabelaConvidadosSimples convidados={convidados} />
      </div>
    </main>
  );
} 