import pool from "../database/connection.js";
import bcrypt from "bcrypt"; // Importa o bcrypt para criptografia de senhas

class UsuarioModel {
  // Lista todos os clientes salvos no TiDB Cloud
  async listarUsuarios() {
    const [rows] = await pool.query(
      "SELECT id, nome, email, data_nascimento FROM clientes"
    );
    return rows;
  }

  // Busca um usuário específico pelo ID numérico do banco
  async listarUsuarioPorId(id) {
    const [rows] = await pool.query(
      "SELECT id, nome, email, data_nascimento FROM clientes WHERE id = ?",
      [id]
    );
    return rows[0];
  }

  // Busca um usuário específico pelo e-mail (útil para sistemas de login futuros)
  async listarUsuarioPorEmail(email) {
    const [rows] = await pool.query(
      "SELECT id, nome, email, data_nascimento FROM clientes WHERE email = ?",
      [email]
    );
    return rows[0];
  }

  // Busca usuários por nome
  async listarUsuarioPorNome(nome) {
    const [rows] = await pool.query(
      "SELECT id, nome, email, data_nascimento FROM clientes WHERE nome = ?",
      [nome]
    );
    return rows;
  }

  // Novo método de cadastro focado 100% em Node.js + TiDB
  async cadastrarUsuario(usuario) {
    try {
      // 1. Criptografa a senha em um hash seguro usando bcrypt
      const saltRounds = 10;
      const senhaCriptografada = await bcrypt.hash(usuario.senha, saltRounds);

      // 2. Salva os dados diretamente na tabela do TiDB Cloud
      // Removida a coluna 'id_firebase' que não existe mais no fluxo
      const [result] = await pool.query(
        `INSERT INTO clientes (nome, email, data_nascimento, senha) 
         VALUES (?, ?, ?, ?)`,
        [usuario.nome, usuario.email, usuario.data_nascimento, senhaCriptografada]
      );

      // 3. Retorna os dados cadastrados de volta para o controlador (Express)
      return {
        id: result.insertId,
        nome: usuario.nome,
        email: usuario.email,
        data_nascimento: usuario.data_nascimento,
        message: "Usuário cadastrado com sucesso no TiDB Cloud!"
      };
      
    } catch (error) {
      console.error("Erro no cadastro dentro do TiDB:", error);
      
      // Captura o erro clássico de e-mail duplicado no MySQL / TiDB
      if (error.errno === 1062 || error.code === 'ER_DUP_ENTRY') {
        throw new Error("Este email já está cadastrado no sistema.");
      }
      
      throw new Error(`Erro no banco de dados: ${error.message}`);
    }
  }

  // Atualiza os dados cadastrados usando o ID numérico tradicional
  async atualizarUsuario(usuario) {
    const [result] = await pool.query(
      "UPDATE clientes SET nome = ?, email = ? WHERE id = ?",
      [usuario.nome, usuario.email, usuario.id]
    );
    return result;
  }

  // Remove o usuário permanentemente do banco com base no ID numérico
  async deletarUsuario(id) {
    const [result] = await pool.query(
      "DELETE FROM clientes WHERE id = ?",
      [id]
    );
    return result;
  }
}

export default new UsuarioModel();