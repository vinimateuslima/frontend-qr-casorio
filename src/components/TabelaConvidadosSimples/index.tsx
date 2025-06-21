import { useState } from 'react';
import { Convidado } from '@/services/api';
import { FaCheck } from 'react-icons/fa';
import styles from './styles.module.css';

interface Props {
  convidados: Convidado[];
  itensPorPagina?: number;
}

type OrdenacaoTipo = 'asc' | 'desc';
type CampoOrdenacao = 'nome' | 'parentesco' | 'senha' | 'status';

const opcoesQuantidade = [
  { valor: 10, label: '10 entradas' },
  { valor: 20, label: '20 entradas' },
  { valor: 50, label: '50 entradas' },
  { valor: 100, label: '100 entradas' },
  { valor: -1, label: 'Todas' }
];

export function TabelaConvidadosSimples({ convidados, itensPorPagina = 10 }: Props) {
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [ordenacao, setOrdenacao] = useState<CampoOrdenacao>('nome');
  const [tipoOrdenacao, setTipoOrdenacao] = useState<OrdenacaoTipo>('asc');
  const [quantidadePorPagina, setQuantidadePorPagina] = useState(itensPorPagina);

  const ordenarConvidados = (lista: Convidado[]): Convidado[] => {
    return [...lista].sort((a, b) => {
      if (ordenacao === 'status') {
        return tipoOrdenacao === 'asc' 
          ? Number(a[ordenacao]) - Number(b[ordenacao])
          : Number(b[ordenacao]) - Number(a[ordenacao]);
      }
      
      return tipoOrdenacao === 'asc'
        ? a[ordenacao].localeCompare(b[ordenacao])
        : b[ordenacao].localeCompare(a[ordenacao]);
    });
  };

  const convidadosOrdenados = ordenarConvidados(convidados);
  const totalPaginas = quantidadePorPagina === -1 
    ? 1 
    : Math.ceil(convidados.length / quantidadePorPagina);
  const inicio = quantidadePorPagina === -1 
    ? 0 
    : (paginaAtual - 1) * quantidadePorPagina;
  const convidadosPaginados = quantidadePorPagina === -1 
    ? convidadosOrdenados 
    : convidadosOrdenados.slice(inicio, inicio + quantidadePorPagina);

  const alterarOrdenacao = (campo: CampoOrdenacao) => {
    if (campo === ordenacao) {
      setTipoOrdenacao(tipo => tipo === 'asc' ? 'desc' : 'asc');
    } else {
      setOrdenacao(campo);
      setTipoOrdenacao('asc');
    }
  };

  const handleQuantidadeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const novaQuantidade = Number(e.target.value);
    setQuantidadePorPagina(novaQuantidade);
    setPaginaAtual(1);
  };

  return (
    <div className={styles.container}>
      <div className={styles.tabelaHeader}>
        <div className={styles.selectContainer}>
          <span>Mostrar</span>
          <select
            value={quantidadePorPagina}
            onChange={handleQuantidadeChange}
            className={styles.selectQuantidade}
          >
            {opcoesQuantidade.map(opcao => (
              <option key={opcao.valor} value={opcao.valor}>
                {opcao.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="table-responsive">
        <table className={`table table-hover ${styles.tabela}`}>
          <thead>
            <tr>
              <th onClick={() => alterarOrdenacao('nome')} className="d-flex align-items-center justify-content-between">
                <span>Nome</span>
                {ordenacao === 'nome' && (
                  <span className={styles.seta}>
                    {tipoOrdenacao === 'asc' ? '▲' : '▼'}
                  </span>
                )}
              </th>
              <th onClick={() => alterarOrdenacao('parentesco')} className="d-none d-md-table-cell">
                <span>Parentesco</span>
                {ordenacao === 'parentesco' && (
                  <span className={styles.seta}>
                    {tipoOrdenacao === 'asc' ? '▲' : '▼'}
                  </span>
                )}
              </th>
              <th onClick={() => alterarOrdenacao('senha')} className="d-none d-sm-table-cell">
                <span>Senha</span>
                {ordenacao === 'senha' && (
                  <span className={styles.seta}>
                    {tipoOrdenacao === 'asc' ? '▲' : '▼'}
                  </span>
                )}
              </th>
              <th onClick={() => alterarOrdenacao('status')}>
                <span>Status</span>
                {ordenacao === 'status' && (
                  <span className={styles.seta}>
                    {tipoOrdenacao === 'asc' ? '▲' : '▼'}
                  </span>
                )}
              </th>
              <th className={styles.colunaAcoes}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {convidadosPaginados.map((convidado) => (
              <tr key={convidado._id}>
                <td>
                  <div className="d-flex flex-column">
                    <span>{convidado.nome}</span>
                    <span className="d-sm-none text-muted small">
                      Senha: {convidado.senha}
                    </span>
                    <span className="d-md-none text-muted small">
                      Parentesco: {convidado.parentesco}
                    </span>
                  </div>
                </td>
                <td className="d-none d-md-table-cell">{convidado.parentesco}</td>
                <td className="d-none d-sm-table-cell">{convidado.senha}</td>
                <td>
                  <span className={`badge ${convidado.status ? 'bg-success' : 'bg-warning'}`}>
                    {convidado.status ? 'Presente' : 'Aguardando'}
                  </span>
                </td>
                <td className={styles.colunaAcoes}>
                  <div className={styles.botoesAcoes}>
                    <a
                      href={`/validar?senha=${convidado.senha}`}
                      className={styles.botaoAcao}
                      title="Check-in"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <FaCheck />
                    </a>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {quantidadePorPagina !== -1 && (
        <nav className="d-flex justify-content-center mt-4">
          <ul className="pagination">
            <li className={`page-item ${paginaAtual === 1 ? 'disabled' : ''}`}>
              <button
                className="page-link"
                onClick={() => setPaginaAtual(p => Math.max(1, p - 1))}
                disabled={paginaAtual === 1}
              >
                Anterior
              </button>
            </li>
            <li className="page-item active">
              <span className="page-link">
                {paginaAtual} de {totalPaginas}
              </span>
            </li>
            <li className={`page-item ${paginaAtual === totalPaginas ? 'disabled' : ''}`}>
              <button
                className="page-link"
                onClick={() => setPaginaAtual(p => Math.min(totalPaginas, p + 1))}
                disabled={paginaAtual === totalPaginas}
              >
                Próxima
              </button>
            </li>
          </ul>
        </nav>
      )}
    </div>
  );
} 