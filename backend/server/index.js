// 🔥 Uso exclusivo de ES Modules (import/export)
import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import UsuarioModel from "../models/usuarioModel.js";

const app = express();
const port = process.env.PORT || 5000;


app.use(cors());

// Middleware obrigatório para o Express conseguir ler o corpo (JSON) das requisições POST/PUT
app.use(express.json());

// Rota de boas-vindas / Teste de funcionamento básico
app.get("/", (req, res) => {
  res.json({ 
    message: "Bem-vindo à API! 🚀",
    status: "Servidor Node.js + Express rodando perfeitamente e sem Firebase."
  });
});

// Rota POST: Cadastrar novo usuário direto no TiDB Cloud
app.post("/usuarios", async (req, res) => {
  try {
    const usuario = req.body;
    const novoUsuario = await UsuarioModel.cadastrarUsuario(usuario);
    res.status(201).json(novoUsuario);
  }
  catch (error) {
    console.error("Erro completo capturado na rota POST:", error);
    // Retorna a mensagem real gerada pelo banco para facilitar o diagnóstico no Front
    res.status(500).json({ 
      error: "Erro interno do servidor ao cadastrar", 
      mensagemReal: error.message 
    });
  }
});

// Rota GET: Listar todos os usuários salvos no TiDB Cloud
app.get("/usuarios", async (req, res) => {
  try {
    const usuarios = await UsuarioModel.listarUsuarios();
    res.json(usuarios);
  }
  catch (error) {
    console.error("Erro ao listar usuários:", error);
    res.status(500).json({ error: "Erro interno do servidor ao listar" });
  }
});

// Rota DELETE: Excluir usuário usando o ID numérico tradicional do banco
app.delete("/usuarios/:id", async (req, res) => {
  try {
    const id = req.params.id;
    
    if (!id) {
      return res.status(400).json({ error: "ID do usuário é obrigatório" });
    }
    
    await UsuarioModel.deletarUsuario(id);
    res.json({ message: "Usuário excluído com sucesso do TiDB!" });
    
  } catch (error) {
    console.error("Erro ao excluir usuário:", error);
    res.status(500).json({ error: "Erro interno do servidor ao excluir usuário" });
  }
});

// Rota PUT: Atualizar dados do usuário no TiDB Cloud através do ID numérico
app.put("/usuarios/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const dadosAtualizados = req.body;
    
    if (!id) {
      return res.status(400).json({ error: "ID do usuário é obrigatório" });
    }
    
    if (!dadosAtualizados.nome && !dadosAtualizados.email) {
      return res.status(400).json({ 
        error: "Pelo menos um campo (nome ou email) deve ser fornecido para atualização" 
      });
    }
    
    const usuario = {
      id: id,
      nome: dadosAtualizados.nome,
      email: dadosAtualizados.email
    };
    
    await UsuarioModel.atualizarUsuario(usuario);
    
    res.json({ 
      success: true,
      message: "Usuário atualizado com sucesso no TiDB!",
      id: id,
      dadosAtualizados
    });
    
  } catch (error) {
    console.error("Erro ao atualizar usuário:", error);
    res.status(500).json({ 
      error: "Erro interno do servidor ao atualizar usuário",
      details: error.message 
    });
  }
});

// Iniciar o servidor Express escutando em todas as interfaces (necessário para o Render funcionar)
app.listen(port, "0.0.0.0", () => {
  console.log(`✅ Servidor rodando perfeitamente na porta ${port}`);
});