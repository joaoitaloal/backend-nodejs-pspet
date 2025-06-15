import express from 'express';
import multer from 'multer'
import { extname } from 'path';

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
  const resultado = lib.readImageData(ext, buffer, buffer.length);
  return resultado;
}

app.get('/', (req, res) =>{
    res.sendfile( './dist/index.html');
})

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

// Rota para processar imagem a partir do path
app.post('/processar-path', async (req, res) => {
  try {
    const { caminho } = req.body;
    if (!caminho) {
      return res.status(400).json({ erro: 'Campo "caminho" é obrigatório' });
    }

    // Chama o wrapper ReadImagePath
    const leitura = lib.readImagePath(caminho);
    res.json({ leitura });

  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: 'Erro ao processar imagem via path' });
  }
});

app.post('/avaliar',async(req,res) =>{
  //recebe o id da prova e as respostas   
  //exemplo de corpo da requisição:
  //      id_participante: 12345,
  //      gabarito: "abcdeabcdeabcde",
  //      leitura:  "abddeab?deabcde"


      const { id_prova,id_participante,leitura } = req.body;
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
//TODO:fazer endpoint para retornar tabela do banco de dados 

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});

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