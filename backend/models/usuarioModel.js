import pool from "../database/connection.js";
import admin from "../config/firebaseAdmin.js";

class UsuarioModel {
  async listarUsuarios() {
    const [rows] = await pool.query(
      "SELECT id, id_firebase, nome, email, data_nascimento FROM clientes",
    );
    return rows;
  }

  async listarUsuarioPorId(id) {
    const [rows] = await pool.query(
      "SELECT id, id_firebase, nome, email, data_nascimento FROM clientes WHERE id = ?",
      [id],
    );
    return rows[0];
  }

  async listarUsuarioPorEmail(email) {
    const [rows] = await pool.query(
      "SELECT id, id_firebase, nome, email, data_nascimento FROM clientes WHERE email = ?",
      [email],
    );
    return rows[0];
  }

  async listarUsuarioPorNome(nome) {
    const [rows] = await pool.query(
      "SELECT id, id_firebase, nome, email, data_nascimento FROM clientes WHERE nome = ?",
      [nome],
    );
    return rows;
  }

  async cadastrarUsuario(usuario) {
    try {
      const userRecord = await admin.auth().createUser({
        email: usuario.email,
        password: usuario.senha,
        displayName: usuario.nome,
      });

      // Retorna um objeto limpo com os dados que o seu Vue vai precisar
      return {
        uid: userRecord.uid,
        email: userRecord.email,
        displayName: userRecord.displayName,
      };
    } catch (error) {
      // Repassa o erro para o bloco catch do seu app.post no server.js
      throw new Error(error.message);
    }
  }
  async atualizarUsuario(usuario) {
    const [result] = await pool.query(
      "UPDATE clientes SET nome = ?, email = ? WHERE id_firebase = ?",
      [usuario.nome, usuario.email, usuario.id_firebase],
    );
    return result;
  }

  async deletarUsuario(uid) {
    await admin.auth().deleteUser(uid);
    const [result] = await pool.query(
      "DELETE FROM clientes WHERE id_firebase = ?",
      [uid],
    );
    return result;
  }
}

export default new UsuarioModel();
