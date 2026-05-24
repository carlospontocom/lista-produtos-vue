<script>
import axios from 'axios';

export default {
  name: 'CadastroUsuario',
  data() {
    return {
      usuario: {
        nome: '',
        email: '',
        senha: '',
        data_nascimento: ''
      },
      carregando: false,
      mensagemErro: '',
      mensagemSucesso: ''
    };
  },
  methods: {
    async handleCadastro() {
      this.carregando = true;
      this.mensagemErro = '';
      this.mensagemSucesso = '';

      try {
        // 🔥 MUDE AQUI - use a variável de ambiente
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        
        const resposta = await axios.post(`${API_URL}/usuarios`, this.usuario);

        if (resposta.status === 201) {
          this.mensagemSucesso = 'Cadastro realizado com sucesso!';
          this.usuario = { nome: '', email: '', senha: '', data_nascimento: '' };
        }
      } catch (error) {
        this.mensagemErro = error.response?.data?.error || 'Erro ao realizar o cadastro. Tente novamente.';
      } finally {
        this.carregando = false;
      }
    }
  }
};
</script>