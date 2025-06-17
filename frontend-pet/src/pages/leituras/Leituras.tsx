import { useEffect, useState } from "react";
import type { Reading } from "../../lib/interfaces";
import axios from "axios";
import ListLeitura from "./ListLeituras";

function Leituras(){
    const [readings, setReadings] = useState(new Array<Reading>);
    const [warning, setWarning] = useState("Carregando tabela do banco de dados...");

    useEffect(() =>{
        axios.request({
            method: 'get',
            url: '/api/resultados',
        })
        .then((res) =>{
            let newProvas = res.data.message; //creio que isso já vai ser um array
            if(newProvas.length <= 0) setWarning('Nenhum registro encontrado no banco de dados')
            else setReadings(newProvas.map((leitura: any) =>{
                return {
                    ACERTOS: leitura.ACERTOS,
                    ERRO: leitura.ERRO,
                    ID_ALUNO: leitura.ID_ALUNO,
                    ID_PROVA: leitura.ID_PROVA,
                    IMAGE_URL: leitura.IMAGE_URL,
                    NOTA: leitura.NOTA,
                    LEITURA: ``
                } as Reading
            }))
        })
        .catch((err) =>{ console.log(err) })
    }, []);

    function updateReadings(newReadings: Array<Reading>){
        setReadings(newReadings);
    }

    function MainPage(){

        if(readings == undefined || !readings || readings.length <= 0){
            return (
                <div id="warning">
                    <p>{warning}</p>
                    <button onClick={() => updateReadings([{ACERTOS: 0, ERRO: 0, ID_ALUNO: 0, ID_PROVA: 0, IMAGE_URL: "", LEITURA: '000000000000000000000', NOTA: 0} as Reading])}>Adicionar leitura localmente</button>
                </div>
            )
        }else{
            return (
                <ListLeitura leituras={readings} updateLeitura={updateReadings}/>
            )
        }
    }

    return(
        <MainPage/>
    )

}

export default Leituras;