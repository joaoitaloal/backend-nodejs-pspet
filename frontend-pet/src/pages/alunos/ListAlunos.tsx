import { useState } from "react";
import type { Aluno } from "../../lib/interfaces.ts";
import '../../globalstyles/listreadings.css';
import GenericTab from "../../components/ListarGenerico.tsx";
import { deleteAlunoDatabase, saveAlunoDatabase, saveNewAlunoDatabase} from "../../lib/utils.ts";

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

    function salvarLocalmente(){
        props.alunos[props.alunos.indexOf(curAluno)] = tempAluno;

        setCurAluno(tempAluno);
        props.updateAlunos(props.alunos);
    }

    function addAluno(){
        props.alunos.push({NOME: "", ESCOLA: "", ID_ALUNO: 0} as Aluno);
        
        salvarLocalmente();
    }

    function CurrentReading(){
        if(curAluno != undefined){
            return(
                <div id="current-reading">
                    <h2>Aluno {curAluno.ID_ALUNO}</h2>
                    <div id="simple-inputs">
                        <div>
                            <label htmlFor="id-aluno-input">ID Aluno:</label>
                            <input type="text" id="id-aluno-input" name="id-aluno-input" defaultValue={curAluno.ID_ALUNO} onChange={(e) => {
                                e.target.value = e.target.value.replace(/[^0-9]/gi, ''); // só numeros, não usei um input do tipo number porque ele não é tão intuitivo de usar nesse caso
                                tempAluno.ID_ALUNO = parseInt(e.target.value);
                            }}/>
                        </div>
                        <div>
                            <label htmlFor="id-aluno-input">Nome:</label>
                            <input type="text" id="id-aluno-input" name="id-aluno-input" defaultValue={curAluno.NOME} onChange={(e) => {
                                tempAluno.NOME = e.target.value;
                            }}/>
                        </div>
                        <div>
                            <label htmlFor="id-aluno-input">Escola:</label>
                            <input type="text" id="id-aluno-input" name="id-aluno-input" defaultValue={curAluno.ESCOLA} onChange={(e) => {
                                tempAluno.ESCOLA = e.target.value;
                            }}/>
                        </div>
                    </div>
                    <p style={{textAlign: 'center'}}>Lembre-se de salvar localmente antes de fazer operações no banco de dados!</p>
                    <div id="readings-buttons">
                        <button type="submit" onClick={() => {
                            props.alunos[props.alunos.indexOf(curAluno)] = tempAluno;

                            setCurAluno(tempAluno);
                            props.updateAlunos(props.alunos);
                        }}>Salvar localmente</button>
                        <button onClick={() =>{
                            saveNewAlunoDatabase(curAluno, '/api/participantes');
                        }}>Salvar novo registro no banco de dados</button>
                        <button onClick={() =>{
                            saveAlunoDatabase(curAluno, '/api/participantes');
                        }}>Salvar no banco de dados</button>
                        <button onClick={() =>{
                            deleteAlunoDatabase(curAluno, '/api/participantes')
                            .then(() =>{
                                deleteAlunos([curAluno]);
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
            <GenericTab itens={props.alunos} setCurItem={setCurAluno} deleteItem={deleteAlunos} addItem={addAluno}/>
        </>
    )
}

export default ListProvas;