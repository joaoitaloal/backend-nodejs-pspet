const express = require('express');
const multer = require('multer');
const path = require('path');
const lib = require('./build/Release/wrapper');
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
app.use(express.json());

const port = 8003;
//GET = puxar valor
//POST = COLOCAR VALOR
//DELETE = DELETE
//Patch = atualizar o valor
// Armazena uploads em memória (RAM)
const upload = multer({ storage: multer.memoryStorage() }); 
//fazer constantes para os gabaritos
function processarImagem(buffer, originalname) { //função q recebe um buffer e o nome da imagem e retorna o json processado
  const ext = path.extname(originalname);
  const resultado = lib.readImageData(ext, buffer, buffer.length);
  return resultado;
}
//fazer post para receber array de imagens
// Rota que recebe uma imagem  
app.post('/processar', upload.array('imagem'), (req, res) => {
  //fazer percorrer o array de imagens e processar cada uma
  let arrayLeituras = [];

  for (let i = 0; i < req.files.length; i++) {
  try {
    
    if (!req.files[i]) return res.status(400).send({ erro: 'Imagem não enviada' });

    const leitura = processarImagem(req.files[i].buffer, req.files[i].originalname);
    arrayLeituras.push(leitura);
  } catch (err) {
    console.error(err);
    res.status(500).send({ erro: 'Erro ao processar imagem' });
  }
}
res.json({ leituras: arrayLeituras });
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
  //      leitura:    "abddeab?eabcde"


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
  const nota = (acertos / gabarito.length);
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
