import pool from "../database/connection.js";
import admin from "../config/firebaseAdmin.js";

class UsuarioModel {

    async listarUsuarios() {
        const [rows] = await pool.query('SELECT id, id_firebase, nome, email, data_nascimento FROM clientes');
        return rows;
    }

    async listarUsuarioPorId(id) {
        const [rows] = await pool.query('SELECT id, id_firebase, nome, email, data_nascimento FROM clientes WHERE id = ?', [id]);
        return rows[0];
    }

    async listarUsuarioPorEmail(email) {
        const [rows] = await pool.query('SELECT id, id_firebase, nome, email, data_nascimento FROM clientes WHERE email = ?', [email]);
        return rows[0];
    }

    async listarUsuarioPorNome(nome) {
        const [rows] = await pool.query('SELECT id, id_firebase, nome, email, data_nascimento FROM clientes WHERE nome = ?', [nome]);
        return rows;
    }

    async cadastrarUsuario(usuario) {
        const userRecord = await admin.auth().createUser({
            email: usuario.email,
            password: usuario.senha,
            displayName: usuario.nome,
        });

        const firebaseUID = userRecord.uid;

        const [result] = await pool.query(
            'INSERT INTO clientes (id_firebase, nome, email, data_nascimento) VALUES (?, ?, ?, ?)',
            [firebaseUID, usuario.nome, usuario.email, usuario.data_nascimento]
        );
        
        return { id: result.insertId, id_firebase: firebaseUID, nome: usuario.nome, email: usuario.email };
    }

    async atualizarUsuario(usuario) {
        const [result] = await pool.query(
            'UPDATE clientes SET nome = ?, email = ? WHERE id_firebase = ?',
            [usuario.nome, usuario.email, usuario.id_firebase]
        );
        return result;
    }

    async deletarUsuario(uid) {
        await admin.auth().deleteUser(uid);
        const [result] = await pool.query('DELETE FROM clientes WHERE id_firebase = ?', [uid]);
        return result;
    }
}

export default new UsuarioModel();