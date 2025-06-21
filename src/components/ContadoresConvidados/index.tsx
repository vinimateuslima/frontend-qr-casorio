import { Convidado } from '@/services/api';
import styles from './styles.module.css';

interface Props {
  convidados: Convidado[];
}

export function ContadoresConvidados({ convidados }: Props) {
  const convidadosPresentes = convidados.filter(c => c.status).length;
  const convidadosAguardando = convidados.filter(c => !c.status).length;

  return (
    <div className={styles.container}>
      <div className={styles.contador}>
        <span className={styles.numero}>{String(convidadosPresentes).padStart(2, '0')}</span>
        <span className={styles.texto}>convidados presentes</span>
      </div>
      <div className={styles.contador}>
        <span className={styles.numero}>{String(convidadosAguardando).padStart(2, '0')}</span>
        <span className={styles.texto}>convidados aguardando</span>
      </div>
    </div>
  );
} 