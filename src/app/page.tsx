'use client';

import { useEffect, useState } from 'react';
import { api, Convidado } from '@/services/api';
import { TabelaConvidados } from '@/components/TabelaConvidados';
import { FormularioConvidado } from '@/components/FormularioConvidado';
import styles from './page.module.css';

export default function Home() {
  const [convidados, setConvidados] = useState<Convidado[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [convidadoSelecionado, setConvidadoSelecionado] = useState<Convidado | null>(null);

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

  const handleSelecionarConvidado = (convidado: Convidado) => {
    setConvidadoSelecionado(convidado);
    const formulario = document.querySelector('form');
    if (formulario) {
      formulario.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleConvidadoDeletado = () => {
    setConvidadoSelecionado(null);
    carregarConvidados();
  };

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
        <h1 className={styles.titulo}>Gerenciamento de Convidados</h1>
        <FormularioConvidado 
          onConvidadoSalvo={carregarConvidados}
          convidadoSelecionado={convidadoSelecionado}
        />
        <TabelaConvidados 
          convidados={convidados} 
          onSelecionarConvidado={handleSelecionarConvidado}
          onConvidadoDeletado={handleConvidadoDeletado}
        />
      </div>
    </main>
  );
}
