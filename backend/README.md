# Back-end do leitor de gabaritos

O back-end do leitor de gabaritos é feito utilizando Nodejs.

O processamento de imagens salva a imagem em disco e então roda o programa que de fato lê o gabarito.

O banco de dados usa sqlite, o arquivo OCI.db que se encontra no github tem um banco de dados sem registros.

## Estrutura das pastas

- dist: Onde o front-end compilado deve ser colocado.
- Functions: Funções de banco de dados.
- imagens: Onde as imagens processadas são armazenadas.
- lib/processamento: Programas de processamento de imagem, em c.
- lib/app.js: Os endpoints do servidor.

## Como rodar o servidor

Primeiramente você precisa instalar o Nodejs: <https://nodejs.org/en/download>.

Depois de instalar você deve ser capaz de utilizar o comando npm no Powershell, bash ou cmd.

Com o nodejs e npm instalados corretamente, apenas navegue até o diretório onde o projeto está instalado, no terminal, e execute o comando:

```bash
npm install
```

Para instalar todos os pacotes e bibliotecas do projeto.

Em seguida você deve checar se o programa "processamento" em ./lib/processamento roda na sua máquina, caso não funcione você deve compilar o programa em "processamento.cpp".

Em seguida você deve ir para a pasta do front-end, lá você deve compilar o código seguindo as intruções do readme e então copiar a pasta dist criada para cá, de forma que o caminho backend/dist exista e contenha o index.html, além dos assets e etc.

em seguida volte para o diretório backend e execute:

```bash
npm run start
```

Para iniciar o servidor.
