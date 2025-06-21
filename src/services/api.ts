import axios from 'axios';

export interface Convidado {
  _id: string;
  nome: string;
  parentesco: string;
  senha: string;
  status: boolean;
}

export interface NovoConvidado {
  nome: string;
  parentesco: string;
  status?: boolean;
}

export interface ValidarSenha {
  senha: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

const axiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true
});

export const api = {
  async listarConvidados(): Promise<Convidado[]> {
    const response = await axiosInstance.get('/convidados');
    return response.data;
  },

  async cadastrarConvidado(dados: NovoConvidado): Promise<Convidado> {
    const response = await axiosInstance.post('/convidados', dados);
    return response.data;
  },

  async atualizarConvidado(id: string, dados: NovoConvidado): Promise<Convidado> {
    const response = await axiosInstance.put(`/convidados/${id}`, dados);
    return response.data;
  },

  async deletarConvidado(id: string): Promise<void> {
    await axiosInstance.delete(`/convidados/${id}`);
  },

  async validarSenha({ senha }: { senha: string }) {
    try {
      const response = await axiosInstance.post('/convidados/validar', { senha });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data.mensagem || 'Senha inválida');
      }
      throw new Error('Erro ao validar a senha');
    }
  },
}; 