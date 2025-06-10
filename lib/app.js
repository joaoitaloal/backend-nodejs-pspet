import express from 'express';
import path from 'path';
import bodyParser from 'body-parser';

const app = express(); // Criar o servidor com express

let visits = 0;

app.use(express.static(path.join('dist')));

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