import { useState } from "react";
import type { Prova } from "../../lib/interfaces.ts";
import '../../globalstyles/listreadings.css';
import GenericTab from "../../components/ListarGenerico.tsx";
import { deleteProvaDatabase, saveNewProvaDatabase, saveProvaDatabase } from "../../lib/utils.ts";

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

    function salvarLocalmente(){
        props.provas[props.provas.indexOf(curProva)] = tempProva;

        setCurProva(tempProva);
        props.updateProvas(props.provas);
    }

    function addProvas(){
        props.provas.push({GABARITO: '00000000000000000000', ID_PROVA: 0} as Prova);

        salvarLocalmente();
    }

    function CurrentReading(){
        if(curProva != undefined){
            return(
                <div id="current-reading">
                    <h2>Prova {curProva.ID_PROVA}</h2>
                    <div id="simple-inputs">
                        <div>
                            <label htmlFor="id-aluno-input">ID prova:</label>
                            <input type="text" id="id-aluno-input" name="id-aluno-input" defaultValue={curProva.ID_PROVA} onChange={(e) => {
                                e.target.value = e.target.value.replace(/[^0-9]/gi, ''); // só numeros, não usei um input do tipo number porque ele não é tão intuitivo de usar nesse caso
                                tempProva.ID_PROVA = parseInt(e.target.value);
                            }}/>
                        </div>
                        <div>
                            <label htmlFor="id-aluno-input">Gabarito:</label>
                            <input type="text" id="id-aluno-input" name="id-aluno-input" defaultValue={curProva.GABARITO} onChange={(e) => {
                                tempProva.GABARITO = e.target.value;
                            }}/>
                        </div>
                    </div>
                    <p style={{textAlign: 'center'}}>Lembre-se de salvar localmente antes de fazer operações no banco de dados!</p>
                    <div id="readings-buttons">
                        <button type="submit" onClick={() => {
                            salvarLocalmente();
                        }}>Salvar localmente</button>
                        <button onClick={() =>{
                            saveNewProvaDatabase(curProva, '/api/provas');
                        }}>Salvar novo registro no banco de dados</button>
                        <button onClick={() =>{
                            saveProvaDatabase(curProva, '/api/provas');
                        }}>Atualizar registro no banco de dados</button>
                        <button onClick={() =>{
                            deleteProvaDatabase(curProva, '/api/provas')
                            .then(() =>{
                                deleteProvas([curProva]);
                            })
                            .catch((err) => console.log(err))
                        }}>Deletar no banco de dados</button>
                    </div>

                </div>
            )
        }
        else return <div id="current-reading"><p>Nenhum registro carregado.</p></div>;
    }

    return (
        <>
            <CurrentReading/>
            <GenericTab itens={props.provas} setCurItem={setCurProva} deleteItem={deleteProvas} addItem={addProvas}/>
        </>
    )
}

export default ListProvas;