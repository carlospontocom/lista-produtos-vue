import pool from "../database/connection.js";
import admin from "../config/firebaseAdmin.js";

class UsuarioModel {
  async listarUsuarios() {
    const [rows] = await pool.query(
      "SELECT id, id_firebase, nome, email, data_nascimento FROM clientes"
    );
    return rows;
  }

  async listarUsuarioPorId(id) {
    const [rows] = await pool.query(
      "SELECT id, id_firebase, nome, email, data_nascimento FROM clientes WHERE id = ?",
      [id]
    );
    return rows[0];
  }

  async listarUsuarioPorEmail(email) {
    const [rows] = await pool.query(
      "SELECT id, id_firebase, nome, email, data_nascimento FROM clientes WHERE email = ?",
      [email]
    );
    return rows[0];
  }

  async listarUsuarioPorNome(nome) {
    const [rows] = await pool.query(
      "SELECT id, id_firebase, nome, email, data_nascimento FROM clientes WHERE nome = ?",
      [nome]
    );
    return rows;
  }

  async cadastrarUsuario(usuario) {
    try {
      // 1. Criar usuário no Firebase Authentication
      const userRecord = await admin.auth().createUser({
        email: usuario.email,
        password: usuario.senha,
        displayName: usuario.nome,
      });

      // 2. Salvar no MySQL
      const [result] = await pool.query(
        `INSERT INTO clientes (id_firebase, nome, email, data_nascimento) 
         VALUES (?, ?, ?, ?)`,
        [userRecord.uid, usuario.nome, usuario.email, usuario.data_nascimento]
      );

      // 3. Retornar os dados completos
      return {
        id: result.insertId,
        uid: userRecord.uid,
        nome: usuario.nome,
        email: usuario.email,
        data_nascimento: usuario.data_nascimento,
        message: "Usuário cadastrado com sucesso no Firebase e MySQL!"
      };
      
    } catch (error) {
      console.error("Erro no cadastro:", error);
      
      // Se o erro é do Firebase
      if (error.code === 'auth/email-already-exists') {
        throw new Error("Este email já está cadastrado no Firebase");
      }
      
      throw new Error(error.message);
    }
  }

  async atualizarUsuario(usuario) {
    // Atualizar no Firebase
    await admin.auth().updateUser(usuario.id_firebase, {
      email: usuario.email,
      displayName: usuario.nome
    });
    
    // Atualizar no MySQL
    const [result] = await pool.query(
      "UPDATE clientes SET nome = ?, email = ? WHERE id_firebase = ?",
      [usuario.nome, usuario.email, usuario.id_firebase]
    );
    return result;
  }

  async deletarUsuario(uid) {
    // Deletar do Firebase
    await admin.auth().deleteUser(uid);
    
    // Deletar do MySQL
    const [result] = await pool.query(
      "DELETE FROM clientes WHERE id_firebase = ?",
      [uid]
    );
    return result;
  }
}

export default new UsuarioModel();