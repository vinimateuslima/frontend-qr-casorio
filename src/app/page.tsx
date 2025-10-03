'use client';

import { useEffect, useState } from 'react';
import { api, Convidado } from '@/services/api';
import { TabelaConvidados } from '@/components/TabelaConvidados';
import { FormularioConvidado } from '@/components/FormularioConvidado';
import { BarraPesquisaFiltros } from '@/components/BarraPesquisaFiltros';
import styles from './page.module.css';

export default function Home() {
  const [convidados, setConvidados] = useState<Convidado[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [convidadoSelecionado, setConvidadoSelecionado] = useState<Convidado | null>(null);
  const [textoPesquisa, setTextoPesquisa] = useState('');
  const [filtros, setFiltros] = useState<{ nome?: string; parentesco?: string; senha?: string; status?: boolean }>({});

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
        <BarraPesquisaFiltros
          onSearchChange={(t) => setTextoPesquisa(t)}
          onApplyFilters={(f) => setFiltros(f)}
          opcoesParentesco={[...new Set(convidados.map(c => c.parentesco).filter(Boolean))]}
          convidadosParaGerar={convidados
            .filter(c => {
              const t = textoPesquisa.trim().toLowerCase();
              if (!t) return true;
              const statusTxt = c.status ? 'presente true 1' : 'aguardando false 0 ausente';
              return (
                c.nome.toLowerCase().includes(t) ||
                c.parentesco.toLowerCase().includes(t) ||
                c.senha.toLowerCase().includes(t) ||
                statusTxt.includes(t)
              );
            })
            .filter(c => (filtros.nome ? c.nome.toLowerCase().includes(filtros.nome.toLowerCase()) : true))
            .filter(c => (filtros.parentesco ? c.parentesco === filtros.parentesco : true))
            .filter(c => (filtros.senha ? c.senha.toLowerCase().includes(filtros.senha.toLowerCase()) : true))
            .filter(c => (typeof filtros.status === 'boolean' ? c.status === filtros.status : true))}
          showGerarConvites
        />
        <TabelaConvidados 
          convidados={convidados
            .filter(c => {
              const t = textoPesquisa.trim().toLowerCase();
              if (!t) return true;
              const statusTxt = c.status ? 'presente true 1' : 'aguardando false 0 ausente';
              return (
                c.nome.toLowerCase().includes(t) ||
                c.parentesco.toLowerCase().includes(t) ||
                c.senha.toLowerCase().includes(t) ||
                statusTxt.includes(t)
              );
            })
            .filter(c => (filtros.nome ? c.nome.toLowerCase().includes(filtros.nome.toLowerCase()) : true))
            .filter(c => (filtros.parentesco ? c.parentesco === filtros.parentesco : true))
            .filter(c => (filtros.senha ? c.senha.toLowerCase().includes(filtros.senha.toLowerCase()) : true))
            .filter(c => (typeof filtros.status === 'boolean' ? c.status === filtros.status : true))}
          onSelecionarConvidado={handleSelecionarConvidado}
          onConvidadoDeletado={handleConvidadoDeletado}
        />
      </div>
    </main>
  );
}
