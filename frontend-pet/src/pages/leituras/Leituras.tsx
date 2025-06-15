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
            url: '/api/get-leituras',
        })
        .then((res) =>{
            let newLeituras = res.data.leituras; //creio que isso já vai ser um array
            setReadings(newLeituras);
        })
        .catch((err) =>{ setWarning(err) })
    }, []);

    function updateReadings(newReadings: Array<Reading>){
        setReadings(newReadings);
    }

    function MainPage(){

        if(readings == undefined || !readings || readings.length <= 0){
            return (
                <p>{warning}</p>
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