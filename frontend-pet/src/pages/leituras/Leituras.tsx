import { useEffect, useState } from "react";
import ListReadings from "../../components/ListReadings/ListReadings";
import type { Reading } from "../../lib/interfaces";
import axios from "axios";

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
            else setReadings(newProvas)
        })
        .catch((err) =>{ console.log(err) })
    }, []);

    function updateReadings(newReadings: Array<Reading>){
        setReadings(newReadings);
    }

    function MainPage(){

        if(readings == undefined || !readings || readings.length <= 0){
            return (
                <div>
                    <p>{warning}</p>
                    <button onClick={() => updateReadings([{ACERTOS: 0, ERRO: 0, ID_ALUNO: 0, ID_PROVA: 0, IMAGE_URL: "", LEITURA: '000000000000000000000', NOTA: 0} as Reading])}>Adicionar leitura localmente</button>
                </div>
            )
        }else{
            return (
                <ListReadings readings={readings} updateReadings={updateReadings}/>
            )
        }
    }

    return(
        <MainPage/>
    )

}

export default Leituras;