import axios from "axios";
import { useState, useEffect } from "react";
import type { Aluno } from "../../lib/interfaces";
import ListAlunos from "./ListAlunos";

function Alunos(){
    const [alunos, setAlunos] = useState(new Array<Aluno>);
    const [warning, setWarning] = useState("Carregando tabela do banco de dados...");

    useEffect(() =>{
        axios.request({
            method: 'get',
            url: '/api/get-alunos',
        })
        .then((res) =>{
            let newAlunos = res.data.alunos; //creio que isso já vai ser um array
            setAlunos(newAlunos);
        })
        .catch((err) =>{ setWarning(err) })
    }, []);

    function updateAlunos(newAluno: Array<Aluno>){
        setAlunos(newAluno);
    }

    function MainPage(){

        if(alunos == undefined || !alunos || alunos.length <= 0){
            return (
                <p>{warning}</p>
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