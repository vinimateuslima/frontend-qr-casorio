'use client';

import { useMemo, useState } from 'react';
import styles from './styles.module.css';
import JSZip from 'jszip';
import { gerarConvite } from '@/utils/convite';
import { Convidado } from '@/services/api';

export type CampoFiltro = 'nome' | 'parentesco' | 'senha' | 'status';

interface Props {
  onSearchChange: (texto: string) => void;
  onApplyFilters: (filtros: { nome?: string; parentesco?: string; senha?: string; status?: boolean }) => void;
  opcoesParentesco?: string[];
  convidadosParaGerar?: Convidado[];
  showGerarConvites?: boolean;
}

export function BarraPesquisaFiltros({ onSearchChange, onApplyFilters, opcoesParentesco = [], convidadosParaGerar = [], showGerarConvites = true }: Props) {
  const [q, setQ] = useState('');
  const [modalAberto, setModalAberto] = useState(false);
  const [nome, setNome] = useState('');
  const [parentesco, setParentesco] = useState('');
  const [senha, setSenha] = useState('');
  const [statusAtivo, setStatusAtivo] = useState<'todos' | 'presentes' | 'aguardando'>('todos');
  const [confirmGerar, setConfirmGerar] = useState(false);
  const [gerando, setGerando] = useState(false);

  const statusBoolean = useMemo(() => {
    if (statusAtivo === 'presentes') return true;
    if (statusAtivo === 'aguardando') return false;
    return undefined;
  }, [statusAtivo]);

  const aplicarFiltros = () => {
    onApplyFilters({
      nome: nome.trim() || undefined,
      parentesco: parentesco || undefined,
      senha: senha.trim() || undefined,
      status: statusBoolean,
    });
    setModalAberto(false);
  };

  return (
    <div className={styles.container}>
      <div className={styles.buscaContainer}>
        <input
          className={`form-control ${styles.input}`}
          placeholder="Pesquisar em qualquer campo"
          value={q}
          onChange={e => { setQ(e.target.value); onSearchChange(e.target.value); }}
        />
        <button className={`btn btn-outline-secondary ${styles.botaoFiltro}`} onClick={() => setModalAberto(true)}>
          Filtros
        </button>
        {showGerarConvites && (
          <button className={`btn ${styles.botaoGerar}`} onClick={() => setConfirmGerar(true)}>
            Gerar Convites
          </button>
        )}
      </div>

      {modalAberto && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h5 className="modal-title">Filtros</h5>
              <button type="button" className="btn-close" onClick={() => setModalAberto(false)} aria-label="Close" />
            </div>
            <div className={styles.modalBody}>
              <div className="mb-3">
                <label className="form-label">Nome</label>
                <input className="form-control" value={nome} onChange={e => setNome(e.target.value)} />
              </div>
              <div className="mb-3">
                <label className="form-label">Parentesco</label>
                <select className="form-select" value={parentesco} onChange={e => setParentesco(e.target.value)}>
                  <option value="">Todos</option>
                  {opcoesParentesco.map(p => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </div>
              <div className="mb-3">
                <label className="form-label">Senha</label>
                <input className="form-control" value={senha} onChange={e => setSenha(e.target.value)} />
              </div>
              <div className="mb-3">
                <label className="form-label">Status</label>
                <select className="form-select" value={statusAtivo} onChange={e => setStatusAtivo(e.target.value as any)}>
                  <option value="todos">Todos</option>
                  <option value="presentes">Presentes</option>
                  <option value="aguardando">Aguardando</option>
                </select>
              </div>
            </div>
            <div className={styles.modalFooter}>
              <button className="btn btn-secondary" onClick={() => setModalAberto(false)}>Cancelar</button>
              <button className={`btn ${styles.btnPrimarioVerde}`} onClick={aplicarFiltros}>Filtrar</button>
            </div>
          </div>
        </div>
      )}

      {confirmGerar && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h5 className="modal-title">Gerar todos os convites</h5>
              <button type="button" className="btn-close" onClick={() => !gerando && setConfirmGerar(false)} aria-label="Close" />
            </div>
            <div className={styles.modalBody}>
              {gerando ? (
                <div className="d-flex align-items-center gap-2">
                  <div className="spinner-border text-primary" role="status" />
                  <span>Gerando convites, aguarde...</span>
                </div>
              ) : (
                <p>Deseja gerar convites para todos os convidados listados?</p>
              )}
            </div>
            <div className={styles.modalFooter}>
              <button className="btn btn-secondary" disabled={gerando} onClick={() => setConfirmGerar(false)}>Cancelar</button>
              <button className={`btn ${styles.btnPrimarioVerde}`} disabled={gerando} onClick={async () => {
                try {
                  setGerando(true);
                  const zip = new JSZip();
                  for (const c of convidadosParaGerar) {
                    const dataUrl = await gerarConvite(c.nome, c.senha);
                    const base64 = dataUrl.split(',')[1];
                    zip.file(`${c.nome.toLowerCase().replace(/\s+/g, '-')}-convite.png`, base64, { base64: true });
                  }
                  const blob = await zip.generateAsync({ type: 'blob' });
                  const a = document.createElement('a');
                  a.href = URL.createObjectURL(blob);
                  a.download = 'convites.zip';
                  a.click();
                  URL.revokeObjectURL(a.href);
                } finally {
                  setGerando(false);
                  setConfirmGerar(false);
                }
              }}>Sim, gerar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


