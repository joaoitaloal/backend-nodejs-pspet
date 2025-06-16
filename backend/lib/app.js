import express from 'express';
import multer from 'multer'
import { extname } from 'path';

import {select_resultados, select_provas, select_participantes,
        delete_participante, delete_prova, delete_resultado, insert_participante,
        insert_prova, insert_resultado, update_participante, update_prova,
        update_resultado} from "../Functions/functions.js"
import ffi from 'ffi-napi';
import ref from 'ref-napi';

import lib from './server.js';

const gabarito1 = 'eaedddccaedacbbcbacb';
const gabarito2 = 'bdbbacbbaeececddbdcd';
const gabarito3 = 'abecadcbbcedccabccda';
const gabarito4 = 'baadcaeeacabcdbccade';
const gabarito5 = 'ddddbddcdcacbbecaaed';
const gabarito6 = 'caeabbdecbcecaddaecd';

const gabaritos = {
  '1': gabarito1,
  '2': gabarito2,
  '3': gabarito3,
  '4': gabarito4,
  '5': gabarito5,
  '6': gabarito6
};// objeto para armazenar os gabaritos de cada prova

const app = express();
const port = 3000;
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

app.get('/', (req, res) =>{
    res.sendFile( './dist/index.html');
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
    
    if (!ID_ALUNO || !NOME || !ESCOLA) {
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
    const { URL, ERRO, ID_ALUNO, ID_PROVA, ACERTOS, NOTA } = req.body.data;
    
    if (!ID_ALUNO || !ID_PROVA || !URL || !ERRO || !ACERTOS || !NOTA) {
      return res.status(400).json({ error: 'Bad Request: Campos faltando' });
    }

    await insert_resultado(URL || null, ERRO || null, ID_ALUNO, ID_PROVA, ACERTOS, NOTA);
    res.status(201).json({ message: 'Resultado adicionado com sucesso' });

  } catch (error) {
    console.error('Erro ao adicionar resultado:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

app.post('/api/provas', async (req, res) => {
  try {
    const { ID_PROVA, GABARITO } = req.body.data;
    
    if (!ID_PROVA || !GABARITO) {
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
    
    if (!NOME || !ESCOLA) {
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
    
    if (!URL||!ERRO ||!ACERTOS || !NOTA) {
      return res.status(400).json({ error: 'Bad Request: Campos faltando' });
    }

    await update_resultado(URL || null, ERRO || null, id_aluno, id_prova, ACERTOS, NOTA);
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
    console.log(id_prova, GABARITO, req.body.data);
    
    if (!GABARITO || !id_prova) {
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

app.delete('/api/resultados/:id_aluno', async (req, res) => {
  try {
    const { id_aluno } = req.params;
    
    await delete_resultado(id_aluno);
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
  if (!id_participante || !leitura) {
    return res.status(400).json({ erro: 'Dados insuficientes para avaliação' });
  }
const gabarito = gabaritos[id_prova];
if (!gabarito) {
  return res.status(400).json({ erro: 'Prova inválida' });
}
  let acertos = 0;
  for(let i =0;i<gabarito.length && i<leitura.length;i++){
    if(gabarito[i] === leitura[i]) acertos++;
  }
  const nota = (acertos / gabarito.length) * 10;
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




/* 
Explicando algumas questões de sintaxe do javascript e express
    As funçôes app.post(), app.put(), app.get app recebe dois(ou mais) argumentos, 
        o primeiro é a url da requisição
        o ultimo costuma ser uma função que gerência a requisição de fato, dá pra criar uma função separada e tal mas é mais comum fazer isso com funções anônimas
        no meio é possível passar um(ou mais) middleware para processar a requisição, no exemplo abaixo tem um middleware pra processar o json da requisição 

    Função anonima no JS
        São basicamente funções normais mas sem nome, são basicamente funções que você sabe que não vai precisar usar mais de uma vez
        No exemplo de app.post() abaixo o ultimo argumento passado é uma função anonima, a sintaxe é a seguinte:
            (numero) => {
                console.log(numero + 1); 
            }
            isso é equivalente a escrever
            function somarUm(numero){
                console.log(numero + 1);
            }
        Porém no caso do app.post() a função anonima recebe os parametros (req, res), que são respectivamente os objetos que representam a requisição e a resposta

app.post('/api/message', bodyParser.json(), (req, res) => { // Exemplo de requisição que recebe uma mensagem JSON qualquer
    if(req.headers['content-length'] > 1000){
        res.send('Sua mensagem é muito grande, o limite é 1000 caracteres')
    }else{
        console.log(req.body.message);
        res.send("mensagem recebida!")
    }
})

app.put('/api/update-visit', (req, res) => { // Exemplo de requisição que não recebe nada, só atualiza uma informação
    visits+=1;
    res.send("atualizado, visitas atuais: "+visits);
    console.log("visits: "+visits);
})

app.get('/', (req,res) => { // Enviar a página de frontend
    res.sendFile('index.html' , {root: path.join('dist')})
})

export default app;*/
