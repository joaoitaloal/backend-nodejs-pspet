import { useState } from "react";
import type { Reading } from "../../lib/interfaces.ts";
import '../../globalstyles/listreadings.css';
import GenericTab from "../../components/ListarGenerico.tsx";
import { ID_ERROS, replaceCharAt } from "../../lib/utils.ts";
import axios from "axios";

interface ListLeiturasProps{
    leituras: Array<Reading>;
    updateLeitura: (leitura: Array<Reading>) => void;
}

function ListLeitura(props: ListLeiturasProps){
    const [curLeitura, setCurLeitura] = useState(props.leituras[0]);
    let tempLeitura = Object.assign({}, curLeitura);

    function deleteLeitura(toDelete: Array<Reading>){
        toDelete.forEach((leitura) =>{
            props.leituras.splice(props.leituras.indexOf(leitura), 1);
        })

        if(props.leituras.length > 0) {
            setCurLeitura(props.leituras[0]);
            props.updateLeitura(props.leituras);
        }
        else{
            props.updateLeitura(new Array<Reading>);
        }
    }

    function addLeitura(){
        props.leituras.push({erro: 0, id: 0, id_prova: 0, image_url: '', leitura: '00000000000000000000', nota: 0} as Reading);
        props.updateLeitura(props.leituras);
    }

    //ToDo: fazer feedback pra esses dois debaixo
    function deleteDatabase(itens: Array<Reading>){
        axios.delete('/leituras', {
            data: itens.map((aluno) => {
                return aluno.id;
            })
        }).then(() => deleteLeitura(itens))
        .catch((err) => console.log(err))
    }
    function saveDatabase(itens: Array<Reading>){
        axios.post('/leituras', {
            data: itens
        })
    }

    function CurrentReading(){
        if(curLeitura != undefined){
            return(
                <div id="current-reading">
                    <h2>Leitura {curLeitura.id}</h2>
                    <div id="simple-inputs">
                        <div>
                            <label htmlFor="id-aluno-input">ID Aluno:</label>
                            <input type="text" id="id-aluno-input" name="id-aluno-input" defaultValue={curLeitura.id} onChange={(e) => {
                                e.target.value = e.target.value.replace(/[^0-9]/gi, ''); // só numeros, não usei um input do tipo number porque ele não é tão intuitivo de usar nesse caso
                                tempLeitura.id = parseInt(e.target.value);
                            }}/>
                        </div>
                        <div>
                            <label htmlFor="id-prova-input">ID Prova:</label>
                            <input type="text" id="id-prova-input" name="id-prova-input" defaultValue={curLeitura.id_prova} onChange={(e) => {
                                e.target.value = e.target.value.replace(/[^0-9]/gi, '');
                                tempLeitura.id_prova = parseInt(e.target.value);
                            }}/>
                        </div>
                        <div>
                            <label htmlFor="nota-input">Nota:</label>
                            <input type="text" id="nota-input" name="nota-input" value={curLeitura.nota.toFixed(1)}/>
                        </div>
                        <div>
                            <label htmlFor="error-input">Erro:</label>
                            <input type="text" id="error-input" name="error-input" value={curLeitura.erro + ' - ' + ID_ERROS.get(curLeitura.erro)}/>
                        </div>
                    </div>
                    <div id="readings-inputs">
                        <h3>Gabarito: {curLeitura.leitura}</h3>
                        <div id="gabarito">
                            {
                                Array.from(curLeitura.leitura).map((char, index) =>{
                                    return(
                                        <div className="center-item" key={`item${index+1}`}>
                                            <label htmlFor={`choice${index+1}`}>{index+1 < 10?'0'+(index+1):index+1}</label>
                                            <select id={`choice${index+1}`} name={`choice${index+1}`} defaultValue={char} onChange={(e) => (tempLeitura.leitura = replaceCharAt(tempLeitura.leitura, index, e.target.value))}>
                                                <option value="a">a</option>
                                                <option value="b">b</option>
                                                <option value="c">c</option>
                                                <option value="d">d</option>
                                                <option value="e">e</option>
                                                <option value="0">0</option>
                                                <option value="?">?</option>
                                            </select>
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </div>
                    <div id="readings-buttons">
                            <button type="submit" onClick={() => {
                                props.leituras[props.leituras.indexOf(curLeitura)] = tempLeitura;

                                setCurLeitura(tempLeitura);
                                props.updateLeitura(props.leituras);
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
            <GenericTab itens={props.leituras} setCurItem={setCurLeitura} deleteItem={deleteLeitura} addItem={addLeitura} deleteDatabase={deleteDatabase} saveDatabase={saveDatabase}/>
        </>
    )
}

export default ListLeitura;