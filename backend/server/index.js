import express from "express";
import cors from "cors";
 import UsuarioModel from "../models/usuarioModel.js";

// Importa o arquivo de documentação separado
 
const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());
 
// ==========================================
// ROTAS DA API (Sem poluição de comentários)
// ==========================================

app.post("/usuarios", async (req, res) => {
  try {
    const usuario = req.body;
    const novoUsuario = await UsuarioModel.cadastrarUsuario(usuario);
    res.status(201).json(novoUsuario);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/usuarios", async (req, res) => {
  try {
    const usuarios = await UsuarioModel.listarUsuarios();
    res.status(200).json(usuarios);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete("/usuario/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await UsuarioModel.deletarUsuario(id);
    res.status(200).json("Usuário deletado com sucesso!");
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Aplicação rodando em http://localhost:${port}`);
  console.log(`Documentação disponível em http://localhost:${port}/api-docs`);
});