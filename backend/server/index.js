// server.js
import express from 'express';
import { listarProdutos } from '../models/modelProduto.js';
import cors from 'cors';

const app = express();

// CORS mais específico para seu ambiente
app.use(cors({
  origin: 'https://5173-firebase-vueapi-1778871500827.cluster-lr6dwlc2lzbcctqhqorax5zmro.cloudworkstations.dev',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials: true
}));

const port = 5000;

app.use(express.json());

app.get('/produtos', async (req, res) => {
  // Adicionar headers CORS manualmente como fallback
  res.header('Access-Control-Allow-Origin', 'https://5173-firebase-vueapi-1778871500827.cluster-lr6dwlc2lzbcctqhqorax5zmro.cloudworkstations.dev');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  try {
    const produtos = await listarProdutos();
    res.json(produtos);
  } catch(error) {
    res.status(500).json({error: error.message});
  }
});

// Adicionar resposta para OPTIONS preflight
app.options('/produtos', (req, res) => {
  res.header('Access-Control-Allow-Origin', 'https://5173-firebase-vueapi-1778871500827.cluster-lr6dwlc2lzbcctqhqorax5zmro.cloudworkstations.dev');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.sendStatus(200);
});

app.listen(port, () => {
  console.log(`Aplicação rodando na porta http://localhost:${port}`);
});