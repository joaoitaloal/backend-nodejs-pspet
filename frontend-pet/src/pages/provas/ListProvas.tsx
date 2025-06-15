import { useState } from "react";
import type { Prova } from "../../lib/interfaces.ts";
import '../../globalstyles/listreadings.css';
import GenericTab from "../../components/ListarGenerico.tsx";
import axios from "axios";

interface ListProvasProps{
    provas: Array<Prova>;
    updateProvas: (prova: Array<Prova>) => void;
}

function ListProvas(props: ListProvasProps){
    const [curProva, setCurProva] = useState(props.provas[0]);
    let tempProva = Object.assign({}, curProva);

    function deleteProvas(toDelete: Array<Prova>){
        toDelete.forEach((prova) =>{
            props.provas.splice(props.provas.indexOf(prova), 1);
        })

        if(props.provas.length > 0) {
            setCurProva(props.provas[0]);
            props.updateProvas(props.provas);
        }
        else{
            props.updateProvas(new Array<Prova>);
        }
    }

    function addProvas(){
        props.provas.push({gabarito: '00000000000000000000', id: 0} as Prova);
        props.updateProvas(props.provas);
    }

    //ToDo: fazer feedback pra esses dois debaixo
    function deleteDatabase(itens: Array<Prova>){
        axios.delete('/provas', {
            data: itens.map((prova) => {
                return prova.id;
            })
        }).then(() => deleteProvas(itens))
        .catch((err) => console.log(err))
    }
    function saveDatabase(itens: Array<Prova>){
        axios.post('/provas', {
            data: itens
        })
    }

    function CurrentReading(){
        if(curProva != undefined){
            return(
                <div id="current-reading">
                    <h2>Prova {curProva.id}</h2>
                    <div id="simple-inputs">
                        <div>
                            <label htmlFor="id-aluno-input">ID prova:</label>
                            <input type="text" id="id-aluno-input" name="id-aluno-input" defaultValue={curProva.id} onChange={(e) => {
                                e.target.value = e.target.value.replace(/[^0-9]/gi, ''); // só numeros, não usei um input do tipo number porque ele não é tão intuitivo de usar nesse caso
                                tempProva.id = parseInt(e.target.value);
                            }}/>
                        </div>
                        <div>
                            <label htmlFor="id-aluno-input">Gabarito:</label>
                            <input type="text" id="id-aluno-input" name="id-aluno-input" defaultValue={curProva.gabarito} onChange={(e) => {
                                tempProva.gabarito = e.target.value;
                            }}/>
                        </div>
                    </div>
                    <div id="readings-buttons">
                            <button type="submit" onClick={() => {
                                props.provas[props.provas.indexOf(curProva)] = tempProva;

                                setCurProva(tempProva);
                                props.updateProvas(props.provas);
                            }}>Salvar localmente</button>
                    </div>
                </div>
            )
        }
        else return <div id="current-reading"><p>Nenhum registro carregado.</p></div>;
    }

    return (
        <>
            <CurrentReading/>
            <GenericTab itens={props.provas} setCurItem={setCurProva} deleteItem={deleteProvas} addItem={addProvas} deleteDatabase={deleteDatabase} saveDatabase={saveDatabase}/>
        </>
    )
}

export default ListProvas;