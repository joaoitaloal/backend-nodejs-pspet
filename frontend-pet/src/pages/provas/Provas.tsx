import axios from "axios";
import { useState, useEffect } from "react";
import type { Prova } from "../../lib/interfaces";
import ListProvas from "./ListProvas";

function Provas(){
    const [provas, setProvas] = useState(new Array<Prova>);
    const [warning, setWarning] = useState("Carregando tabela do banco de dados...");

    useEffect(() =>{
        axios.request({
            method: 'get',
            url: '/api/provas',
        })
        .then((res) =>{
            let newProvas = res.data.message; //creio que isso já vai ser um array
            if(newProvas.length <= 0) setWarning('Nenhum registro encontrado no banco de dados')
            else setProvas(newProvas);
        })
        .catch((err) =>{ console.log(err) })
    }, []);

    function updateProvas(newProvas: Array<Prova>){
        setProvas(newProvas);
    }

    function MainPage(){

        if(provas == undefined || !provas || provas.length <= 0){
            return (
                <div>
                    <p>{warning}</p>
                    <button onClick={() => updateProvas([{ GABARITO: '000000000000000000000', ID_PROVA: 0 } as Prova])}>Adicionar prova localmente</button>
                </div>
            )
        }else{
            return (
                <ListProvas provas={provas} updateProvas={updateProvas}/>
            )
        }
    }

    return(
        <MainPage/>
    )

}

export default Provas;