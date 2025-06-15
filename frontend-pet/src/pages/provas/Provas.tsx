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
            url: '/api/get-provas',
        })
        .then((res) =>{
            let newProvas = res.data.provas; //creio que isso já vai ser um array
            setProvas(newProvas);
        })
        .catch((err) =>{ setWarning(err) })
    }, []);

    function updateProvas(newProvas: Array<Prova>){
        setProvas(newProvas)
    }

    function MainPage(){

        if(provas == undefined || !provas || provas.length <= 0){
            return (
                <p>{warning}</p>
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