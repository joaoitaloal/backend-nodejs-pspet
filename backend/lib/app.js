import express from 'express';
import multer from 'multer'
import fsp from 'fs/promises'
import { extname } from 'path';

import { promisify } from 'util';
import { exec } from 'child_process';

import {select_resultados, select_provas, select_prova, select_participantes,
        delete_participante, delete_prova, delete_resultado, insert_participante,
        insert_prova, insert_resultado, update_participante, update_prova,
        update_resultado} from "../Functions/functions.js"

let cur_id_imagem = 0;

const app = express();
//GET = puxar valor
//POST = COLOCAR VALOR
//DELETE = DELETE
//Patch = atualizar o valor
// Armazena uploads em memória (RAM)
const upload = multer({ storage: multer.memoryStorage() })

app.use(express.static('./dist'));

app.use(express.json());

function processarImagem(buffer, originalname) { //função q recebe um buffer e o nome da imagem e retorna o json processado
  const ext = extname(originalname);
  const resultado = lib.read_image_data(ext, buffer, buffer.length);
  return resultado;
}

async function avaliarLeitura(leitura, ID_PROVA){
  const prova = await select_prova(ID_PROVA)
  
  if(prova.length <= 0) return {nota: -1, acertos: -1}

  const gabarito = prova[0].GABARITO
 
  let acertos = 0;
  for(let i =0; i < gabarito.length && i < leitura.length; i++){
    if(gabarito[i] === leitura[i]) acertos++;
  }
  const nota = (acertos / gabarito.length) * 10;

  return {nota: nota, acertos: acertos}
}

app.get('/', (req, res) =>{
    res.sendFile( 'index.html', {root: `./dist`});
})

const execFilePromisse = promisify(exec);
app.post('/api/processar-imagens', upload.array('imagens'), async (req, res) =>{
  let files = req.files;
  if(files == null || files == undefined) res.status(400).send('Requisição mal formatada');

  let response = [];

  const promises = files.map(async(file) =>{
    cur_id_imagem++;
    let id = cur_id_imagem;
    let pathProcessamento = './lib/processamento'; // caminho pra processamento.cpp compilado
    let pathImage = './imagens/imagem'+id+'.png'; // caminho pra imagem

    return new Promise((resolve, reject) =>{
      // Basicamente salva cada imagem em disco, chama o programa pra ler ela e manda o stdout como resposta(num array)
      fsp.writeFile(pathImage, Buffer.from(file.buffer))
      .then(() =>{
        execFilePromisse(`cd ${pathProcessamento} && ./processamento ../../${pathImage}`)
        .then(async (result) => {
          let stdout = JSON.parse(result.stdout)
          let nota = -1
          let acertos = -1;
          if(stdout.erro == 0){
            let avaliacao = await avaliarLeitura(stdout.leitura, stdout.id_prova)
            nota = avaliacao.nota
            acertos = avaliacao.acertos
          } 

          response.push({ stdout: stdout, IMAGE_URL: file.originalname, nota: nota, acertos: acertos});
          resolve()
        })
        .catch((err) =>{
          console.log(err);
          reject()
        })
      })
      .catch((err) => console.log(err));
    })
  })

  await Promise.all(promises)

  response = response.map((leitura) =>{
    return JSON.stringify({
      ERRO: leitura.stdout.erro,
      ID_ALUNO: leitura.stdout.id_participante,
      ID_PROVA: leitura.stdout.id_prova,
      NOTA: leitura.nota,
      ACERTOS: leitura.acertos,
      LEITURA: leitura.stdout.leitura,
      IMAGE_URL: leitura.IMAGE_URL
    })
  })

  res.json({ message: response });

  //opcionalmente limpar as imagens do disco aqui
})

app.get('/api/participantes', async (req, res) =>{
  try{
    let alunos = await select_participantes();
    res.json( { message: Array.from(alunos) } )
  }catch{
    console.error('Erro ao listar participantes:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
})

app.get('/api/resultados', async (req, res) =>{
  try{
    let resultados = await select_resultados();
    res.json( { message: Array.from(resultados) } )
  }catch{
    console.error('Erro ao listar resultados:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
})

app.get('/api/provas', async (req, res) =>{
  try{
    let provas = await select_provas();
    res.json( { message: Array.from(provas) } )
  }catch{
    console.error('Erro ao listar provas:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
})


app.post('/api/participantes', async (req, res) => {
  try {
    const { ID_ALUNO, NOME, ESCOLA } = req.body.data;
    
    if (ID_ALUNO == undefined || NOME == undefined || ESCOLA == undefined) {
      return res.status(400).json({ error: 'Bad Request: Campos faltando' });
    }

    await insert_participante(ID_ALUNO, NOME, ESCOLA);
    res.status(201).json({ message: 'Participante adicionado com sucesso' });

  } catch (error) {
    console.error('Erro ao adicionar participante:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

app.post('/api/resultados', async (req, res) => {
  try {
    const { IMAGE_URL, ERRO, ID_ALUNO, ID_PROVA, ACERTOS, NOTA } = req.body.data;
    
    if (ID_ALUNO == undefined || ID_PROVA == undefined || IMAGE_URL == undefined || ERRO == undefined || ACERTOS == undefined || NOTA == undefined) {
      return res.status(400).json({ error: 'Bad Request: Campos faltando' });
    }

    await insert_resultado(IMAGE_URL, ERRO, ID_ALUNO, ID_PROVA, ACERTOS, NOTA);
    res.status(201).json({ message: 'Resultado adicionado com sucesso' });

  } catch (error) {
    console.error('Erro ao adicionar resultado:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

app.post('/api/provas', async (req, res) => {
  try {
    const { ID_PROVA, GABARITO } = req.body.data;
    
    if (ID_PROVA == undefined || GABARITO == undefined) {
      return res.status(400).json({ error: 'Bad Request: Campos faltando' });
    }

    await insert_prova(ID_PROVA, GABARITO);
    res.status(201).json({ message: 'Prova adicionada com sucesso' });

  } catch (error) {
    console.error('Erro ao adicionar prova:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

app.put('/api/participantes/:id_aluno', async (req, res) => {
  try {
    const { id_aluno } = req.params;
    const { NOME, ESCOLA } = req.body.data;
    
    if (NOME == undefined || ESCOLA == undefined) {
      return res.status(400).json({ error: 'Bad Request: Campos faltando' });
    }

    await update_participante(id_aluno, NOME, ESCOLA);
    res.json({ message: 'Participante atualizado com sucesso' });

  } catch (error) {
    if (error.code === 'PARTICIPANTE_NOT_FOUND') {
      return res.status(404).json({ error: error.message });
    }
    console.error('Erro ao atualizar participante:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

app.put('/api/resultados/:id_aluno/:id_prova', async (req, res) => {
  try {
    const { id_aluno, id_prova } = req.params;
    const { URL, ERRO, ACERTOS, NOTA } = req.body.data;
    
    if (URL == undefined || ERRO == undefined || ACERTOS== undefined || NOTA == undefined) {
      return res.status(400).json({ error: 'Bad Request: Campos faltando' });
    }

    await update_resultado(URL, ERRO, id_aluno, id_prova, ACERTOS, NOTA);
    res.json({ message: 'Resultado atualizado com sucesso' });

  } catch (error) {
    if (error.code === 'RESULTADO_NOT_FOUND') {
      return res.status(404).json({ error: error.message });
    }
    console.error('Erro ao atualizar resultado:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

app.put('/api/provas/:id_prova', async (req, res) => {
  try {
    const { id_prova } = req.params;
    const GABARITO = req.body.data.GABARITO;
    
    if (GABARITO == undefined || id_prova == undefined) {
      return res.status(400).json({ error: 'Bad Request: Campos faltando' });
    }

    await update_prova(id_prova, GABARITO);
    res.json({ message: 'Prova atualizada com sucesso' });

  } catch (error) {
    if (error.code === 'PROVA_NOT_FOUND') {
      return res.status(404).json({ error: error.message });
    }
    console.error('Erro ao atualizar prova:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

app.delete('/api/participantes/:id_aluno', async (req, res) => {
  try {
    const { id_aluno } = req.params;
    
    await delete_participante(id_aluno);
    res.json({ message: 'Participante removido com sucesso' });

  } catch (error) {
    if (error.code === 'PARTICIPANTE_NOT_FOUND') {
      return res.status(404).json({ error: error.message });
    }
    console.error('Erro ao remover participante:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

app.delete('/api/resultados/:id_aluno/:id_prova', async (req, res) => {
  try {
    const { id_aluno, id_prova } = req.params;
    
    await delete_resultado(id_aluno, id_prova);
    res.json({ message: 'Resultado removido com sucesso' });

  } catch (error) {
    if (error.code === 'RESULTADO_NOT_FOUND') {
      return res.status(404).json({ error: error.message });
    }
    console.error('Erro ao remover resultado:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

app.delete('/api/provas/:id_prova', async (req, res) => {
  try {
    const { id_prova } = req.params;
    
    await delete_prova(id_prova);
    res.json({ message: 'Prova removida com sucesso' });

  } catch (error) {
    if (error.code === 'PROVA_NOT_FOUND') {
      return res.status(404).json({ error: error.message });
    }
    console.error('Erro ao remover prova:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Rota que recebe várias imagens
app.post('/api/processar-varias', upload.array('imagens'), (req, res) => {
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

// Rota para processar imagem a partir do path
app.post('/api/processar-path', async (req, res) => {
  try {
    const { caminho } = req.body.data;
    if (!caminho) {
      return res.status(400).json({ erro: 'Campo "caminho" é obrigatório' });
    }

    // Chama o wrapper ReadImagePath
    const leitura = lib.readimage_path(caminho);
    res.json({ leitura });

  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: 'Erro ao processar imagem via path' });
  }
});

app.post('/api/avaliar',async(req,res) =>{
  //recebe o id da prova e as respostas   
  //exemplo de corpo da requisição:
  //      id_participante: 12345,
  //      gabarito: "abcdeabcdeabcde",
  //      leitura:  "abddeab?deabcde"


    const { id_prova,id_participante,leitura } = req.body.data;
  if (id_participante == undefined || leitura == undefined) {
    return res.status(400).json({ erro: 'Bad Request: Campos faltando' });
  }
  const { nota, acertos } = await avaliarLeitura(leitura, id_prova)
  //agora,falta salvar no banco de dados, passando arquivo, o id_participante,id prova,o erro, a  leitura, os acertos e a nota
 res.json({
    id_prova,
    id_participante,
    leitura,
    acertos,
    nota
  });
  
})

export default app;