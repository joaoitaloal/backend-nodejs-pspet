const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const lib = require('./build/Release/wrapper');

const app = express();
const port = 3000;
//GET = puxar valor
//POST = COLOCAR VALOR
//DELETE = DELETE
//Patch = atualizar o valor
// Armazena uploads em memória (RAM)
const upload = multer({ storage: multer.memoryStorage() }); 

function processarImagem(buffer, originalname) { //função q recebe um buffer e o nome da imagem e retorna o json processado
  const ext = path.extname(originalname);
  const resultado = lib.readImageData(ext, buffer, buffer.length);
  return resultado;
}

// Rota que recebe uma imagem só 
app.post('/processar', upload.single('imagem'), (req, res) => {
  try {
    if (!req.file) return res.status(400).send({ erro: 'Imagem não enviada' });

    const leitura = processarImagem(req.file.buffer, req.file.originalname);
    res.json({ leitura });
  } catch (err) {
    console.error(err);
    res.status(500).send({ erro: 'Erro ao processar imagem' });
  }
});

// Rota que recebe várias imagens
app.post('/processar-varias', upload.array('imagens'), (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).send({ erro: 'Nenhuma imagem enviada' });
    }

    const leituras = req.files.map(file =>
      processarImagem(file.buffer, file.originalname)
    );

    res.json({ leituras });
  } catch (err) {
    console.error(err);
    res.status(500).send({ erro: 'Erro ao processar imagens' });
  }
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
