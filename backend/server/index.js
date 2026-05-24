import express from "express";
import cors from "cors";
import UsuarioModel from "../models/usuarioModel.js";
import admin from "../config/firebaseAdmin.js";
 
const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());


// Rota para o JSON da documentação
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
  console.log(`Aplicação rodando em http://localhost:${port}`);
  console.log(`Documentação Swagger disponível em http://localhost:${port}/api-docs`);
});