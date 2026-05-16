import pool from '../database/connection.js';

export async function listarProdutos() {
    try {
        const [rows] = await pool.query('SELECT * FROM produtos');
        return rows;
    } catch (error) {
        console.error('Erro ao listar produtos:', error);
        throw error;
    }
}