//const sqlite3 = require('sqlite3').verbose();
import sqlite3 from 'sqlite3'

// Faz conexão com o Banco de Dados SQLite
const db = new sqlite3.Database('OCI.db');

// Funções SELECT
function select_resultados() {
  return new Promise((resolve, reject) => {
    db.all('SELECT * FROM Resultados', [], (err, rows) => {
      if (err) {
        console.error(err.message);
        reject(err);  
      } else {
        rows.forEach((row) => {
          console.log(row);
        });
        resolve(rows);
      }
    });
  });
}

function select_provas() {
  return new Promise((resolve, reject) => {
    db.all('SELECT * FROM Provas', [], (err, rows) => {
      if (err) {
        console.error(err.message);
        reject(err);
      } else {
        rows.forEach((row) => {
          console.log(row);
        });
        resolve(rows);
      }
    });
  });
}

function select_participantes() {
  return new Promise((resolve, reject) => {
    db.all('SELECT * FROM Participantes', [], (err, rows) => {
      if (err) {
        console.error(err.message);
        reject(err);
      } else {
        rows.forEach((row) => {
          console.log(row);
        });
        resolve(rows);
      }
    });
  });
}

// Funções DELETE
function delete_participante(ID_ALUNO) {
  return new Promise((resolve, reject) => {
    db.run('DELETE FROM Participantes WHERE ID_ALUNO = ?', [ID_ALUNO], function(err) {
      if (err) {
        console.error(err.message);
        reject(err);
      } else {
        if (this.changes === 0){ //this.changes retorna o numero de linhas que foram alteradas na tabela dentro da chamada do db.run
          const notFoundError = new Error(`Participante com ID ${ID_ALUNO} não existe`);
          notFoundError.code = 'PARTICIPANTE_NOT_FOUND';
          reject(notFoundError);
        }else{
        console.log(`Participante com ID ${ID_ALUNO} deletado.`);
        resolve();
        }
      }
    });
  });
}

function delete_prova(ID_PROVA) {
  return new Promise((resolve, reject) => {
    db.run('DELETE FROM Provas WHERE ID_PROVA = ?', [ID_PROVA], function(err) {
      if (err) {
        console.error(err.message);
        reject(err);
      } else {
        if (this.changes == 0){ //this.changes retorna o numero de linhas que foram alteradas na tabela dentro da chamada do db.run
          const notFoundError = new Error(`Prova com ID ${ID_PROVA} não existe`);
          notFoundError.code = 'PROVA_NOT_FOUND';
          reject(notFoundError);
        }else{
        console.log(`Prova com ID ${ID_PROVA} deletada.`);
        resolve();
        }
      }
    });
  });
}

function delete_resultado(ID_ALUNO) {
  return new Promise((resolve, reject) => {
    db.run('DELETE FROM Resultados WHERE ID_ALUNO = ?', [ID_ALUNO], function(err) {
      if (err) {
        console.error(err.message);
        reject(err);
      } else {
        if (this.changes == 0){ //this.changes retorna o numero de linhas que foram alteradas na tabela dentro da chamada do db.run
          const notFoundError = new Error(`Resultado com ID ${ID_ALUNO} não existe`);
          notFoundError.code = 'RESULTADO_NOT_FOUND';
          reject(notFoundError);
        }else{
        console.log(`Resultado com ID ${ID_ALUNO} deletado.`);
        resolve();
        }
      }
    });
  });
}

// Funções INSERT
function insert_participante(ID_ALUNO, NOME, ESCOLA, ) {
  return new Promise((resolve, reject) => {
    db.run('INSERT INTO Participantes (ID_ALUNO, NOME, ESCOLA) VALUES (?, ?, ?)', [ID_ALUNO, NOME, ESCOLA], function(err) {
      if (err) {
        console.error(err.message);
        reject(err);
      } else {
        console.log(`Participante ${NOME} inserido com sucesso.`);
        resolve(this.lastID);
      }
    });
  });
}

function insert_prova(ID_PROVA, GABARITO) {
  return new Promise((resolve, reject) => {
    db.run('INSERT INTO Provas (ID_PROVA, GABARITO) VALUES (?, ?)', [ID_PROVA, GABARITO], function(err) {
      if (err) {
        console.error(err.message);
        reject(err);
      } else {
        console.log(`Prova com ID ${ID_PROVA} inserida com sucesso.`);
        resolve(this.lastID);
      }
    });
  });
}

function insert_resultado(URL, ERRO, ID_ALUNO, ID_PROVA, ACERTOS, NOTA) {
  return new Promise((resolve, reject) => {
    db.run('INSERT INTO Resultados (URL, ERRO, ID_ALUNO, ID_PROVA, ACERTOS, NOTA) VALUES (?, ?, ?, ?, ?, ?)', [URL, ERRO, ID_ALUNO, ID_PROVA, ACERTOS, NOTA], function(err) {
      if (err) {
        console.error(err.message);
        reject(err);
      } else {
        console.log(`Resultado inserido com sucesso para o aluno ${ID_ALUNO} na prova ${ID_PROVA}.`);
        resolve(this.lastID);
      }
    });
  });
}

// Funções UPDATE
function update_participante(ID_ALUNO, NOME, ESCOLA) {
  return new Promise((resolve, reject) => {
    db.run('UPDATE Participantes SET ID_ALUNO = ?, NOME = ?, ESCOLA = ? WHERE ID_ALUNO = ?', [ID_ALUNO, NOME, ESCOLA, ID_ALUNO], function(err) {
      if (err) {
        console.error(err.message);
        reject(err);
      } else {
        if (this.changes == 0){ //this.changes retorna o numero de linhas que foram alteradas na tabela dentro da chamada do db.run
          const notFoundError = new Error(`Participante com ID ${ID_ALUNO} não existe`);
          notFoundError.code = 'PROVA_NOT_FOUND';
          reject(notFoundError);
        }else{
        console.log(`Participante com ID ${ID_ALUNO} atualizado com sucesso.`);
        resolve();
        }
      }
    });
  });
}

function update_prova(ID_PROVA, GABARITO) {
  return new Promise((resolve, reject) => {
    db.run('UPDATE Provas SET GABARITO = ? WHERE ID_PROVA = ?', [GABARITO, ID_PROVA], function(err) {
      if (err) {
        console.error(err.message);
        reject(err);
      } else {
        if (this.changes == 0){ //this.changes retorna o numero de linhas que foram alteradas na tabela dentro da chamada do db.run
          const notFoundError = new Error(`Prova com ID ${ID_PROVA} não existe`);
          notFoundError.code = 'PROVA_NOT_FOUND';
          reject(notFoundError);
        }else{
        console.log(`Prova com ID ${ID_PROVA} atualizada com sucesso.`);
        resolve();
        }
      }
    });
  });
}

function update_resultado(URL, ERRO, ID_ALUNO, ID_PROVA, ACERTOS, NOTA) {
  return new Promise((resolve, reject) => {
    db.run('UPDATE Resultados SET URL = ?, ERRO = ?, ACERTOS = ?, NOTA = ? WHERE ID_ALUNO = ? AND ID_PROVA = ?', [URL, ERRO, ACERTOS, NOTA, ID_ALUNO, ID_PROVA], function(err) {
      if (err) {
        console.error(err.message);
        reject(err);
      } else {
        if (this.changes == 0){ //this.changes retorna o numero de linhas que foram alteradas na tabela dentro da chamada do db.run
          const notFoundError = new Error(`Resultado com ID ${ID_ALUNO} não existe`);
          notFoundError.code = 'RESULTADO_NOT_FOUND';
          reject(notFoundError);
        }else{
        console.log(`Resultado atualizado com sucesso para o aluno ${ID_ALUNO} na prova ${ID_PROVA}.`);
        resolve();
        }
      }
    });
  });
}



export 
{
  select_resultados, select_provas, select_participantes,
  delete_participante, delete_prova, delete_resultado, insert_participante,
  insert_prova, insert_resultado, update_participante, update_prova,
  update_resultado
}