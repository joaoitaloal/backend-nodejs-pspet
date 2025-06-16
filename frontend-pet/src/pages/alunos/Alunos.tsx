import axios from "axios";
import { useState, useEffect } from "react";
import type { Aluno } from "../../lib/interfaces";
import ListAlunos from "./ListAlunos";

function Alunos(){
    const [alunos, setAlunos] = useState(new Array<Aluno>);
    const [warning, setWarning] = useState("Carregando tabela dadaso banco de dados...");

    useEffect(() =>{
        axios.request({
            method: 'get',
            url: '/api/participantes',
        })
        .then((res) =>{
            let newProvas = res.data.message; //creio que isso já vai ser um array
            if(newProvas.length <= 0) setWarning('Nenhum registro encontrado no banco de dados')
            else setAlunos(newProvas);
        })
        .catch((err) =>{ console.log(err) })
    }, []);

    function updateAlunos(newAluno: Array<Aluno>){
        setAlunos(newAluno);
    }

    function MainPage(){

        if(alunos == undefined || !alunos || alunos.length <= 0){
            return (
                <div>
                    <p>{warning}</p>
                    <button onClick={() => updateAlunos([{ESCOLA: "", NOME: "", ID_ALUNO: 0} as Aluno])}>Adicionar aluno localmente</button>
                </div>
                
            )
        }else{
            return (
                <ListAlunos alunos={alunos} updateAlunos={updateAlunos}/>
            )
        }
    }

    return(
        <MainPage/>
    )

}


export default Alunos;