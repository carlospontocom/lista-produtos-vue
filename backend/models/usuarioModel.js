import pool from '../database/connection.js';

class UsuarioModel {

    async listarUsuarios() {
        const [rows] = await pool.query('SELECT * FROM clientes');
        return rows;
    }

    async listarUsuarioPorEmail(email) {
        const [rows] = await pool.query('SELECT * FROM clientes WHERE email = ?', [email]);
        return rows[0];
    }

    async listarUsuarioPorNome(nome) {
        const [rows] = await pool.query('SELECT * FROM clientes WHERE nome = ?', [nome]);
        return rows;
    }

    async cadastrarUsuario(usuario) {
        const [result] = await pool.query(
            'INSERT INTO clientes (nome, email, senha,data_nascimento) VALUES (?, ?, ?, ?)',
            [usuario.nome, usuario.email, usuario.senha, usuario.data_nascimento]
        );
        return result;
    }

    async atualizarUsuario(usuario) {
        const [result] = await pool.query(
            'UPDATE clientes SET nome = ?, email = ?, senha = ? WHERE id = ?',
            [usuario.nome, usuario.email, usuario.senha, usuario.id]
        );
        return result;
    }

    async deletarUsuario(id) {
        const [result] = await pool.query('DELETE FROM clientes WHERE id = ?', [id]);
        return result;
    }

}

export default new UsuarioModel()