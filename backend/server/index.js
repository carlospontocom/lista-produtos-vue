// 🔥 Use APENAS um estilo (ES modules - recomendado)
import express from "express";
import cors from "cors";  // ✅ Import correto
import UsuarioModel from "../models/usuarioModel.js";
import admin from "../config/firebaseAdmin.js";

const app = express();
const port = process.env.PORT || 5000;

// ==========================================
// CONFIGURAÇÃO CORRETA DO CORS
// ==========================================

// Opção 1: Para produção com Vercel
app.use(cors({
  origin: 'https://lista-produtos-vue.vercel.app',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// Opção 2: Para desenvolvimento (aceitar múltiplas origens)
// const allowedOrigins = [
//   'https://lista-produtos-vue.vercel.app',
//   'http://localhost:5173',
//   'http://localhost:3000'
// ];
// 
// app.use(cors({
//   origin: function(origin, callback) {
//     if (!origin || allowedOrigins.includes(origin)) {
//       callback(null, true);
//     } else {
//       callback(new Error('CORS bloqueado para esta origem'));
//     }
//   },
//   methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
//   credentials: true
// }));

// Opção 3: APENAS PARA TESTE (NÃO USAR EM PRODUÇÃO!)
// app.use(cors()); // Permite todas as origens

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
    console.error("Erro na autenticação:", error);
    return res.status(403).json({ error: "Sessão inválida ou expirada." });
  }
}

// ==========================================
// ROTAS DA API
// ==========================================

// Rota de teste (verificar se o servidor está online)
app.get("/", (req, res) => {
  res.json({ 
    message: "API rodando!",
    endpoints: ["/usuarios", "/usuario/:id", "/usuario/:uid"]
  });
});

// Cadastro de Usuários
app.post("/usuarios", async (req, res) => {
  try {
    const usuario = req.body;
    
    // Validação básica
    if (!usuario.nome || !usuario.email) {
      return res.status(400).json({ error: "Nome e email são obrigatórios" });
    }
    
    const novoUsuario = await UsuarioModel.cadastrarUsuario(usuario);
    res.status(201).json(novoUsuario);
  } catch (error) {
    console.error("Erro ao cadastrar:", error);
    res.status(500).json({ error: error.message });
  }
});

// Listagem de Usuários
app.get("/usuarios", async (req, res) => {
  try {
    const usuarios = await UsuarioModel.listarUsuarios();
    res.status(200).json(usuarios);
  } catch (error) {
    console.error("Erro ao listar:", error);
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
    console.error("Erro ao buscar:", error);
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
    console.error("Erro ao atualizar:", error);
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
    console.error("Erro ao deletar:", error);
    res.status(500).json({ error: error.message });
  }
});

// ==========================================
// INICIALIZAÇÃO DO SERVIDOR
// ==========================================

// Para desenvolvimento local
if (process.env.NODE_ENV !== 'production') {
  app.listen(port, 'localhost', () => {
    console.log(`🚀 Servidor rodando em http://localhost:${port}`);
    console.log(`📡 Frontend deve apontar para: http://localhost:${port}`);
  });
} else {
  // Para produção (Heroku, Railway, etc)
  app.listen(port, '0.0.0.0', () => {
    console.log(`🚀 Servidor rodando na porta ${port}`);
  });
}