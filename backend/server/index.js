import express from 'express';
import { listarProdutos } from '../models/modelProduto.js';

const app = express()
const port = 3000

app.use(express.json());

app.get('/produtos', async (req, res) => {
   try{
    const produtos = await listarProdutos();
    res.json(produtos);
   }catch(error){
      res.status(500).json({error: error.message})
   }
})

app.listen(port, () => {
  console.log(`Aplicação rodando na porta http://localhost:${port}`)
})