'use client';

import { useState, FormEvent, useEffect } from 'react';
import { api, Convidado, NovoConvidado } from '@/services/api';
import Swal from 'sweetalert2';
import styles from './styles.module.css';

interface Props {
  onConvidadoSalvo: () => void;
  convidadoSelecionado?: Convidado | null;
}

const opcoesParentesco = [
  'Selecione...',
  'Irmão(ã)',
  'Tio(a)',
  'Primo(a)',
  'Amigo(a)',
  'Pai/Mãe',
  'Avô/Avó',
  'Sobrinho(a)',
  'Cunhado(a)',
  'Outro'
];

const FORM_INICIAL = {
  nome: '',
  parentesco: '',
  senha: ''
};

export function FormularioConvidado({ onConvidadoSalvo, convidadoSelecionado }: Props) {
  const [formData, setFormData] = useState(FORM_INICIAL);
  const [modoEdicao, setModoEdicao] = useState(false);
  const [idSelecionado, setIdSelecionado] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);

  useEffect(() => {
    if (convidadoSelecionado) {
      setFormData({
        nome: convidadoSelecionado.nome,
        parentesco: convidadoSelecionado.parentesco,
        senha: convidadoSelecionado.senha
      });
      setModoEdicao(true);
      setIdSelecionado(convidadoSelecionado._id);
    }
  }, [convidadoSelecionado]);

  const limparFormulario = () => {
    setFormData(FORM_INICIAL);
    setModoEdicao(false);
    setIdSelecionado(null);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!formData.nome.trim()) {
      Swal.fire({
        title: 'Atenção',
        text: 'Por favor, preencha o nome do convidado',
        icon: 'warning',
      });
      return;
    }

    if (!formData.parentesco || formData.parentesco === 'Selecione...') {
      Swal.fire({
        title: 'Atenção',
        text: 'Por favor, selecione o grau de parentesco',
        icon: 'warning',
      });
      return;
    }

    const dados: NovoConvidado = {
      nome: formData.nome.trim(),
      parentesco: formData.parentesco === 'Outro' ? 'amigo' : formData.parentesco
    };

    try {
      setEnviando(true);

      if (modoEdicao && idSelecionado !== null) {
        await api.atualizarConvidado(idSelecionado, dados);
        Swal.fire({
          title: 'Sucesso!',
          text: 'Convidado atualizado com sucesso',
          icon: 'success',
        });
      } else {
        await api.cadastrarConvidado(dados);
        Swal.fire({
          title: 'Sucesso!',
          text: 'Convidado cadastrado com sucesso',
          icon: 'success',
        });
      }

      limparFormulario();
      onConvidadoSalvo();
    } catch (error) {
      console.error(error);
      Swal.fire({
        title: 'Erro',
        text: modoEdicao ? 'Erro ao atualizar convidado.' : 'Erro ao cadastrar convidado.',
        icon: 'error',
      });
    } finally {
      setEnviando(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.inputGroup}>
        <input
          type="text"
          value={formData.nome}
          onChange={(e) => setFormData(prev => ({ ...prev, nome: e.target.value }))}
          placeholder="Nome do convidado"
          className={styles.input}
          disabled={enviando}
        />

        <select
          value={formData.parentesco}
          onChange={(e) => setFormData(prev => ({ ...prev, parentesco: e.target.value }))}
          className={styles.select}
          disabled={enviando}
        >
          {opcoesParentesco.map((opcao) => (
            <option key={opcao} value={opcao}>
              {opcao}
            </option>
          ))}
        </select>

        <input
          type="text"
          value={formData.senha}
          className={`${styles.input} ${styles.inputDisabled}`}
          placeholder="Senha (gerada automaticamente)"
          disabled
        />

        <div className={styles.buttonGroup}>
          <button
            type="submit"
            className={styles.button}
            disabled={enviando}
          >
            {enviando ? 'Salvando...' : modoEdicao ? 'Atualizar' : 'Cadastrar'}
          </button>

          <button
            type="button"
            onClick={limparFormulario}
            className={`${styles.button} ${styles.buttonSecondary}`}
            disabled={enviando}
          >
            Limpar
          </button>
        </div>
      </div>
    </form>
  );
} 