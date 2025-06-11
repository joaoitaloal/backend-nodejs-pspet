import { useState } from 'react'
import './App.css'
import Submissions from './components/Submissions/Submissions'
import type { Reading } from './lib/interfaces';
import ListReadings from './components/ListReadings/ListReadings';

function App() {

    /*
    
        input de imagens(tentar aceitar várias pra serem mandadas de uma vez): Um endpoint
        mostrar informações da leitura: Resposta do endpoint

        edição da leitura antes de salvar no banco de dados: outro endpoint

        mostrar tabelas do banco de dados: outro endpoint
        permitir adição, edição e remoção de registros das tabelas: mais 3 endpoints

    */

        /*
          Se a leitura não chegar a ser tratada no backend, a estrutura dela é a seguinte:
          int erro: 0 | 1 | 2 | 3
          int id_prova: number | -1 (não foi possivel identificar)
          int id_participante: number | -1
          char* leitura: a, b, c...: o item marcado (exemplo: abbaccdeea0?), 0: questão em branco e ?: mais de uma marcação
        */
        const [readings, setReadings] = useState(new Array<Reading>);

        function updateReadings(readings: Array<Reading>){
          setReadings(readings); // sobrescreve, mudar se o design mudar
        }
  if(readings.length <= 0){
      return (
        <>
          <Submissions updateReadings={updateReadings}/>
        </>
      )
  }else{
    return (
      <>
        <ListReadings readings={readings}/>
      </>
    )
  }
}

export default App
