import { useState } from "react";
import type { Reading } from "../../lib/interfaces.ts";
import './listreadings.css'
import { deleteLeituraDatabase, ID_ERROS, replaceCharAt, saveLeituraDatabase, saveNewLeituraDatabase } from "../../lib/utils.ts";
import ReadingsTab from "./ReadingsTab.tsx";
 
interface ListReadingsProps{
    readings: Array<Reading>;
    updateReadings: (reading: Array<Reading>) => void;
}
 
function ListReadings(props: ListReadingsProps){
    const [curReading, setCurReading] = useState(props.readings[0]);
    let tempReading = Object.assign({}, curReading);
 
    function deleteReadings(toDelete: Array<Reading>){
        toDelete.forEach((reading) =>{
            props.readings.splice(props.readings.indexOf(reading), 1);
        })
 
        if(props.readings.length > 0) {
            setCurReading(props.readings[0]);
            props.updateReadings(props.readings);
        }
        else{
            props.updateReadings(new Array<Reading>);
        }
    }
 
    function CurrentReading(){
        if(curReading != undefined){
            return(
                <div id="current-reading">
                    <h2>Leitura {curReading.IMAGE_URL}</h2>
                    <div id="simple-inputs">
                        <div>
                            <label htmlFor="id-aluno-input">ID Aluno:</label>
                            <input type="text" id="id-aluno-input" name="id-aluno-input" defaultValue={curReading.ID_ALUNO} onChange={(e) => {
                                e.target.value = e.target.value.replace(/[^0-9]/gi, ''); // só numeros, não usei um input do tipo number porque ele não é tão intuitivo de usar nesse caso
                                tempReading.ID_ALUNO = parseInt(e.target.value);
                            }}/>
                        </div>
                        <div>
                            <label htmlFor="id-prova-input">ID Prova:</label>
                            <input type="text" id="id-prova-input" name="id-prova-input" defaultValue={curReading.ID_PROVA} onChange={(e) => {
                                e.target.value = e.target.value.replace(/[^0-9]/gi, '');
                                tempReading.ID_PROVA = parseInt(e.target.value);
                            }}/>
                        </div>
                        <div>
                            <label htmlFor="nota-input">Nota:</label>
                            <input type="text" id="nota-input" name="nota-input" value={curReading.NOTA.toFixed(1)} disabled/>
                        </div>
                        <div>
                            <label htmlFor="error-input">Erro:</label>
                            <input type="text" id="error-input" name="error-input" value={curReading.ERRO + ' - ' + ID_ERROS.get(curReading.ERRO)} disabled/>
                        </div>
                    </div>
                    <div id="readings-inputs">
                        <h3>Gabarito: {curReading.LEITURA}</h3>
                        <div id="gabarito">
                            {
                                Array.from(curReading.LEITURA).map((char, index) =>{
                                    return(
                                        <div className="center-item" key={`item${index+1}`}>
                                            <label htmlFor={`choice${index+1}`}>{index+1 < 10?'0'+(index+1):index+1}</label>
                                            <select id={`choice${index+1}`} name={`choice${index+1}`} defaultValue={char} onChange={(e) => (tempReading.LEITURA = replaceCharAt(tempReading.LEITURA, index, e.target.value))}>
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
                                props.readings[props.readings.indexOf(curReading)] = tempReading;
 
                                setCurReading(tempReading);
                                props.updateReadings(props.readings);
                            }}>Salvar localmente</button>
                            <button onClick={() =>{
                                saveNewLeituraDatabase(curReading, '/api/resultados');
                            }}>Salvar novo registro no banco de dados</button>
                            <button onClick={() =>{
                                saveLeituraDatabase(curReading, '/api/resultados');
                            }}>Salvar no banco de dados</button>
                            <button onClick={() =>{
                                deleteLeituraDatabase(curReading, '/api/resultados')
                                .then(() =>{
                                    deleteReadings([curReading]);
                                })
                                .catch((err) => console.log(err))
                            }}>Deletar no banco de dados</button>
                    </div>
                </div>
            )
        }
        else return <div id="current-reading"><p>Nenhuma leitura carregada.</p></div>;
    }
 
    return (
        <>
            <CurrentReading/>
            <ReadingsTab readings={props.readings} setCurReading={setCurReading} deleteReadings={deleteReadings}/>
        </>
    )
}
 
export default ListReadings;
 