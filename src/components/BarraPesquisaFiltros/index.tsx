'use client';

import { useMemo, useState } from 'react';
import styles from './styles.module.css';
import JSZip from 'jszip';
import { gerarConvite } from '@/utils/convite';
import { Convidado } from '@/services/api';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

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
  const [modalGerar, setModalGerar] = useState(false);
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

  const gerarPDFLista = () => {
    const doc = new jsPDF();
    
    // Separar convidados e ordenar alfabeticamente
    const parentes = convidadosParaGerar
      .filter(c => c.parentesco !== 'Amigo(a)')
      .sort((a, b) => a.nome.localeCompare(b.nome, 'pt', { sensitivity: 'base' }));
    
    const amigos = convidadosParaGerar
      .filter(c => c.parentesco === 'Amigo(a)')
      .sort((a, b) => a.nome.localeCompare(b.nome, 'pt', { sensitivity: 'base' }));
    
    let yPosition = 20;
    
    // 🎨 Cores do projeto
    const titleBgColor: [number, number, number] = [159, 167, 72]; // #9FA748 - verde do projeto
    const textColor: [number, number, number] = [79, 92, 24]; // #4F5C18
    const headerTextColor: [number, number, number] = [255, 255, 255]; // branco
    
    // ======================
    // Título principal
    // ======================
    doc.setFontSize(16);
    doc.setTextColor(textColor[0], textColor[1], textColor[2]);
    doc.text('Lista de Convidados', 20, yPosition);
    yPosition += 15;
  
    // ======================
    // SEÇÃO PARENTES
    // ======================
    autoTable(doc, {
      startY: yPosition,
      body: [['PARENTES']],
      styles: { 
        fontSize: 13,
        textColor: headerTextColor,
        cellPadding: 5,
        halign: 'center',
        fontStyle: 'bold'
      },
      bodyStyles: { 
        fillColor: titleBgColor,
        textColor: headerTextColor,
        fontStyle: 'bold'
      },
      margin: { left: 20, right: 20 }
    });
    
    yPosition = (doc as any).lastAutoTable.finalY + 3;
    
    // Dados dos parentes
    const parentesData = parentes.map(c => [c.nome, c.parentesco, c.senha, '']);
    
    autoTable(doc, {
      startY: yPosition,
      head: [['Nome', 'Parentesco', 'Senha', 'Status']],
      body: parentesData,
      styles: { 
        fontSize: 9,
        textColor: textColor,
        cellPadding: 1.5, // 🔹 altura reduzida
        lineColor: [200, 200, 200],
        lineWidth: 0.3
      },
      headStyles: { 
        fillColor: titleBgColor,
        textColor: headerTextColor,
        fontStyle: 'bold',
        cellPadding: 2
      },
      alternateRowStyles: {
        fillColor: [240, 240, 240]
      },
      margin: { left: 20, right: 20 }
    });
    
    yPosition = (doc as any).lastAutoTable.finalY + 10;
  
    // ======================
    // SEÇÃO AMIGOS
    // ======================
    autoTable(doc, {
      startY: yPosition,
      body: [['AMIGOS']],
      styles: { 
        fontSize: 13,
        textColor: headerTextColor,
        cellPadding: 5,
        halign: 'center',
        fontStyle: 'bold'
      },
      bodyStyles: { 
        fillColor: titleBgColor,
        textColor: headerTextColor,
        fontStyle: 'bold'
      },
      margin: { left: 20, right: 20 }
    });
  
    yPosition = (doc as any).lastAutoTable.finalY + 3;
  
    // Dados dos amigos
    const amigosData = amigos.map(c => [c.nome, c.parentesco, c.senha, '']);
    
    autoTable(doc, {
      startY: yPosition,
      head: [['Nome', 'Parentesco', 'Senha', 'Status']],
      body: amigosData,
      styles: { 
        fontSize: 9,
        textColor: textColor,
        cellPadding: 1.5, // 🔹 altura reduzida
        lineColor: [200, 200, 200],
        lineWidth: 0.3
      },
      headStyles: { 
        fillColor: titleBgColor,
        textColor: headerTextColor,
        fontStyle: 'bold',
        cellPadding: 2
      },
      alternateRowStyles: {
        fillColor: [240, 240, 240]
      },
      margin: { left: 20, right: 20 }
    });
  
    // ======================
    // SALVAR PDF
    // ======================
    doc.save('lista-convidados.pdf');
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
          <button className={`btn ${styles.botaoGerar}`} onClick={() => setModalGerar(true)}>
            Gerar
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

      {modalGerar && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h5 className="modal-title">Gerar</h5>
              <button type="button" className="btn-close" onClick={() => setModalGerar(false)} aria-label="Close" />
            </div>
            <div className={styles.modalBody}>
              <p>Escolha o que deseja gerar:</p>
            </div>
            <div className={styles.modalFooter}>
              <button className="btn btn-secondary" onClick={() => setModalGerar(false)}>Cancelar</button>
              <button className={`btn ${styles.btnPrimarioVerde}`} onClick={() => {
                setModalGerar(false);
                setConfirmGerar(true);
              }}>Gerar Convites</button>
              <button className={`btn ${styles.btnPrimarioVerde}`} onClick={() => {
                setModalGerar(false);
                gerarPDFLista();
              }}>Gerar Lista</button>
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


