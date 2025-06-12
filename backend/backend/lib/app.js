import express from 'express';
import path from 'path';
import bodyParser from 'body-parser';

const app = express(); // Criar o servidor com express

let visits = 0;

app.use(express.static(path.join('dist')));
app.post('/api/processar-gabarito', upload.array('imagens'), async (req, res) => { // Rota para processar gabaritos
  const resultados = []; // Array para armazenar os resultados de cada imagem processada

  for (const file of req.files) { 
    const imgPath = path.resolve(file.path); // Caminho do arquivo de imagem temporário
    const bridgePath = path.resolve('lib/processador/processaGabaritoBridge'); // Caminho do executável C++ que processa o gabarito

    try { // Importa o módulo 'fs' para manipulação de arquivos
      // Chama o executável C++ que retorna JSON no stdout
      const stdout = await new Promise((resolve, reject) => { // Cria uma nova Promise para lidar com a execução do arquivo
        execFile(bridgePath, [imgPath], (err, out) => { // Importa o módulo 'child_process' para executar comandos do sistema
          if (err) return reject(err); // Se ocorrer um erro, rejeita a Promise
          resolve(out); // Se tudo correr bem, resolve a Promise com a saída do comando
        }); //
      }); //

      // Converte o JSON em objeto
      const leitura = JSON.parse(stdout); //

      // Busca pesos no banco e calcula nota
      const rows = await new Promise((ok, fail) => { // Cria uma nova Promise para buscar os pesos no banco de dados
        db.all( // Executa uma consulta SQL para buscar os pesos das questões
          'SELECT questao, peso FROM pesos WHERE id_prova = ? ORDER BY questao', // Consulta SQL para obter os pesos das questões
          [leitura.id_prova], // Passa o id da prova como parâmetro
          (e, r) => (e ? fail(e) : ok(r)) // Se ocorrer um erro, rejeita a Promise, caso contrário resolve com os resultados
        ); 
      }); 
      const pesosMap = {}; // Cria um objeto para mapear os pesos das questões
      rows.forEach(r => { pesosMap[r.questao] = r.peso; }); // Preenche o objeto com os pesos das questões

      let nota = 0; // Inicializa a nota como zero
      leitura.leitura.split('').forEach((resp, i) => { // Itera sobre as respostas lidas do gabarito
        if (resp !== '0' && resp !== '?') nota += pesosMap[i + 1] || 0; // Se a resposta for diferente de '0' ou '?', adiciona o peso da questão à nota
      }); 

      resultados.push({ // Adiciona o resultado ao array de resultados
        imagem: file.originalname, // Nome original do arquivo de imagem
        ...leitura, // Inclui os dados lidos do gabarito
        nota // Inclui a nota calculada
      });
    } catch (err) { // Se ocorrer um erro durante o processamento
      resultados.push({  // // Adiciona um resultado com erro ao array de resultados
        imagem: file.originalname, // Nome original do arquivo de imagem
        erro: true, // Indica que houve um erro
        detalhe: err.message // Detalhe do erro ocorrido
      }); // Inclui a mensagem de erro
    } finally { // Bloco finally para garantir que o arquivo temporário seja removido 
      // limpa o upload temporário
      fs.unlinkSync(imgPath); // // Remove o arquivo temporário após o processamento
    } // Limpa o upload temporário
  } // // Fim do loop para processar todas as imagens

  res.json({ resultados }); // // Envia os resultados como resposta JSON
});



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
*/
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

export default app;