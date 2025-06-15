import { useState } from "react";
import type { Aluno } from "../../lib/interfaces.ts";
import '../../globalstyles/listreadings.css';
import GenericTab from "../../components/ListarGenerico.tsx";
import axios from "axios";

interface ListAlunosProps{
    alunos: Array<Aluno>;
    updateAlunos: (aluno: Array<Aluno>) => void;
}

function ListProvas(props: ListAlunosProps){
    const [curAluno, setCurAluno] = useState(props.alunos[0]);
    let tempAluno = Object.assign({}, curAluno);

    function deleteAlunos(toDelete: Array<Aluno>){
        toDelete.forEach((aluno) =>{
            props.alunos.splice(props.alunos.indexOf(aluno), 1);
        })

        if(props.alunos.length > 0) {
            setCurAluno(props.alunos[0]);
            props.updateAlunos(props.alunos);
        }
        else{
            props.updateAlunos(new Array<Aluno>);
        }
    }

    function addAluno(){
        props.alunos.push({nome: "", escola: ""} as Aluno);
        props.updateAlunos(props.alunos);
    }

    //ToDo: fazer feedback pra esses dois debaixo
    function deleteDatabase(itens: Array<Aluno>){
        axios.delete('/alunos', {
            data: itens.map((aluno) => {
                return aluno.id;
            })
        }).then(() => deleteAlunos(itens))
        .catch((err) => console.log(err))
    }
    function saveDatabase(itens: Array<Aluno>){
        axios.post('/alunos', {
            data: itens
        })
    }

    function CurrentReading(){
        if(curAluno != undefined){
            return(
                <div id="current-reading">
                    <h2>Aluno {curAluno.id}</h2>
                    <div id="simple-inputs">
                        <div>
                            <label htmlFor="id-aluno-input">ID Aluno:</label>
                            <input type="text" id="id-aluno-input" name="id-aluno-input" defaultValue={curAluno.id} onChange={(e) => {
                                e.target.value = e.target.value.replace(/[^0-9]/gi, ''); // só numeros, não usei um input do tipo number porque ele não é tão intuitivo de usar nesse caso
                                tempAluno.id = parseInt(e.target.value);
                            }}/>
                        </div>
                        <div>
                            <label htmlFor="id-aluno-input">Nome:</label>
                            <input type="text" id="id-aluno-input" name="id-aluno-input" defaultValue={curAluno.nome} onChange={(e) => {
                                tempAluno.nome = e.target.value;
                            }}/>
                        </div>
                        <div>
                            <label htmlFor="id-aluno-input">Escola:</label>
                            <input type="text" id="id-aluno-input" name="id-aluno-input" defaultValue={curAluno.escola} onChange={(e) => {
                                tempAluno.escola = e.target.value;
                            }}/>
                        </div>
                    </div>
                    <div id="readings-buttons">
                            <button type="submit" onClick={() => {
                                props.alunos[props.alunos.indexOf(curAluno)] = tempAluno;

                                setCurAluno(tempAluno);
                                props.updateAlunos(props.alunos);
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
            <GenericTab itens={props.alunos} setCurItem={setCurAluno} deleteItem={deleteAlunos} addItem={addAluno} deleteDatabase={deleteDatabase} saveDatabase={saveDatabase}/>
        </>
    )
}

export default ListProvas;