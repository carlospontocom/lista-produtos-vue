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
  'http://localhost:5173', // Para seus testes locais
  process.env.FRONTEND_URL // URL da Vercel vinda das variáveis de ambiente
].filter(Boolean); // Remove valores indefinidos caso a variável não esteja setada

app.use(cors({
  origin: function (origin, callback) {
    // Permite requisições sem origem (como ferramentas de teste, Postman, ou o próprio Swagger local)
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

// Rota para o JSON da documentação 
// (Nota: certifique-se de que a variável 'swaggerSpec' esteja importada ou definida no seu arquivo)
app.get('/api-docs.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

// ==========================================
// MIDDLEWARE DE PROTEÇÃO
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
// ROTAS
// ==========================================

// IMPORTANTE: Se o cadastro precisa de usuário logado, adicione o middleware 'checarAutenticacao' aqui
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

app.delete("/usuario/:uid", checarAutenticacao, async (req, res) => {
  try {
    const { uid } = req.params;
    await UsuarioModel.deletarUsuario(uid);
    res.status(200).json({ message: "Usuário deletado com sucesso!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Aplicação rodando na porta ${port}`);
});