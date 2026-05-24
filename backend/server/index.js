// 🔥 Use APENAS um estilo (ES modules - recomendado)
import dontev from "dotenv";
dontev.config();

import express from "express";
import admin from "../config/firebaseAdmin.js";
import cors from "cors";  // ✅ Import correto
import UsuarioModel from "../models/usuarioModel.js";

const app = express();
const port = process.env.PORT || 5000;

// No seu server.js, o CORS deve estar assim:
const allowedOrigins = [
  'https://lista-produtos-vue.vercel.app',  // Frontend na Vercel
  'https://lista-produtos-vue.onrender.com', // Próprio backend (opcional)
  'http://localhost:5173'                   // Desenvolvimento local
];

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));

// Middleware para JSON
app.use(express.json());

// Rota de boas vindas
app.get("/", (req, res) => {
  res.json({ 
    message: "Bem vindo à API! 🚀",
    status: "Servidor rodando perfeitamente....."
  });
});


// ATUALIZE APENAS A ROTA POST NO SEU ARQUIVO DE ROTAS:
app.post("/usuarios", async (req, res) => {
  try {
    const usuario = req.body;
    const novoUsuario = await UsuarioModel.cadastrarUsuario(usuario);
    res.status(201).json(novoUsuario);
  }
  catch (error) {
    // 1. Isso vai printar o erro detalhado nos logs do Render
    console.error("Erro completo capturado na rota POST:", error);
    
    // 2. Isso vai enviar o texto exato do erro para o seu navegador ver no Console/Network
    res.status(500).json({ 
      error: "Erro interno do servidor", 
      mensagemReal: error.message,
      detalhes: error
    });
  }
});


// Rota para listar usuários
app.get("/usuarios", async (req, res) => {
  try {
    const usuarios = await UsuarioModel.listarUsuarios();
    res.json(usuarios);
  }
  catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});


app.delete("/usuarios/:id", async (req, res) => {
  try {
    const id = req.params.id;
    
    // Verifica se o ID foi fornecido
    if (!id) {
      return res.status(400).json({ error: "ID do usuário é obrigatório" });
    }
    
    await UsuarioModel.deletarUsuario(id); // Note: seu model chama "deletarUsuario", não "excluirUsuario"
    res.json({ message: "Usuário excluído com sucesso" });
    
  } catch (error) {
    console.error("Erro ao excluir usuário:", error);
    
    // Tratamento de erros específicos
    if (error.message.includes("not found") || error.message.includes("não encontrado")) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }
    
    res.status(500).json({ error: "Erro interno do servidor ao excluir usuário" });
  }
});


app.put("/usuarios/:id", async (req, res) => {
  try {
    const firebaseUid = req.params.id;
    const dadosAtualizados = req.body;
    
    // Validação básica
    if (!firebaseUid) {
      return res.status(400).json({ error: "ID do usuário é obrigatório" });
    }
    
    if (!dadosAtualizados.nome && !dadosAtualizados.email) {
      return res.status(400).json({ 
        error: "Pelo menos um campo (nome ou email) deve ser fornecido para atualização" 
      });
    }
    
    console.log(`✏️ Atualizando usuário: ${firebaseUid}`, dadosAtualizados);
    
    // Preparar dados para o model
    const usuario = {
      id_firebase: firebaseUid,
      nome: dadosAtualizados.nome,
      email: dadosAtualizados.email
    };
    
    await UsuarioModel.atualizarUsuario(usuario);
    
    console.log(`✅ Usuário ${firebaseUid} atualizado com sucesso`);
    
    res.json({ 
      success: true,
      message: "Usuário atualizado com sucesso",
      uid: firebaseUid,
      dadosAtualizados
    });
    
  } catch (error) {
    console.error("❌ Erro ao atualizar usuário:", error);
    
    // Tratamento de erros específicos
    if (error.code === 'auth/user-not-found') {
      return res.status(404).json({ 
        error: "Usuário não encontrado no Firebase" 
      });
    }
    
    if (error.code === 'auth/email-already-exists') {
      return res.status(409).json({ 
        error: "Este email já está em uso por outro usuário" 
      });
    }
    
    res.status(500).json({ 
      error: "Erro interno do servidor ao atualizar usuário",
      details: error.message 
    });
  }
});
    



// Iniciar servidor
app.listen(port, "0.0.0.0",() => {
  console.log(`✅ Servidor rodando em http://localhost:${port}`);
  console.log(`📡 Teste a rota GET: http://localhost:${port}`);

});