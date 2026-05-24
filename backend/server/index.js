import express from "express";
import cors from "cors";
import UsuarioModel from "../models/usuarioModel.js";
import admin from "../config/firebaseAdmin.js";

const app = express();
const port = process.env.PORT || 5000;

// ==========================================
// CONFIGURAÇÃO DO CORS REFORÇADA
// ==========================================
const allowedOrigins = [
  'http://localhost:5173',   // Para seus testes locais no Vue
  process.env.FRONTEND_URL   // URL da Vercel (configurada no painel do Render)
].filter(Boolean);           // Remove valores vazios se a variável não estiver setada

app.use(cors({
  origin: function (origin, callback) {
    // Permite requisições sem origem (como Postman ou chamadas do mesmo servidor)
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Bloqueado pelo CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.use(express.json());

// ==========================================
// MIDDLEWARE DE PROTEÇÃO (FIREBASE)
// ==========================================
async function checarAutenticacao(req, res, next) {
  const token = req.headers.authorization?.split("Bearer ")[1];

  if (!token) {
    return res.status(401).json({ error: "Acesso negado. Token não fornecido." });
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = decodedToken;
    next();
  } catch (error) {
    return res.status(403).json({ error: "Sessão inválida ou expirada." });
  }
}

// ==========================================
// ROTAS DA API
// ==========================================

// Cadastro de Usuários
app.post("/usuarios", async (req, res) => {
  try {
    const usuario = req.body;
    const novoUsuario = await UsuarioModel.cadastrarUsuario(usuario);
    res.status(201).json(novoUsuario);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Listagem de Usuários
app.get("/usuarios", async (req, res) => {
  try {
    const usuarios = await UsuarioModel.listarUsuarios();
    res.status(200).json(usuarios);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Buscar Usuário por ID
app.get("/usuario/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const usuario = await UsuarioModel.listarUsuarioPorId(id);
    if (!usuario) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }
    res.status(200).json(usuario);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Atualizar Usuário (Protegido)
app.put("/usuario/:uid", checarAutenticacao, async (req, res) => {
  try {
    const { uid } = req.params;
    const usuario = { ...req.body, id_firebase: uid };
    await UsuarioModel.atualizarUsuario(usuario);
    res.status(200).json({ message: "Usuário atualizado com sucesso!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Deletar Usuário (Protegido)
app.delete("/usuario/:uid", checarAutenticacao, async (req, res) => {
  try {
    const { uid } = req.params;
    await UsuarioModel.deletarUsuario(uid);
    res.status(200).json({ message: "Usuário deletado com sucesso!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==========================================
// INICIALIZAÇÃO DO SERVIDOR (IP 0.0.0.0 para Cloud)
// ==========================================
app.listen(port, "0.0.0.0", () => {
  console.log(`Servidor rodando com sucesso.`);
});