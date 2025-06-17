import { useState } from "react";
import type { Reading } from "../../lib/interfaces.ts";
import '../../globalstyles/listreadings.css';
import GenericTab from "../../components/ListarGenerico.tsx";
import { deleteLeituraDatabase, ID_ERROS, saveLeituraDatabase, saveNewLeituraDatabase } from "../../lib/utils.ts";

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

    function salvarLocalmente(){
        props.leituras[props.leituras.indexOf(curLeitura)] = tempLeitura;

        setCurLeitura(tempLeitura);
        props.updateLeitura(props.leituras);
    }

    function addLeitura(){
        props.leituras.push({ERRO: 0, ID_ALUNO: 0, ID_PROVA: 0, IMAGE_URL: '', LEITURA: '00000000000000000000', NOTA: 0, ACERTOS: 0} as Reading);
        
        salvarLocalmente();
    }

    function CurrentReading(){
        if(curLeitura != undefined){
            return(
                <div id="current-reading">
                    <h2>Leitura do aluno {curLeitura.ID_ALUNO}</h2>
                    <div id="simple-inputs">
                        <div>
                            <label htmlFor="id-aluno-input">ID Aluno:</label>
                            <input type="text" id="id-aluno-input" name="id-aluno-input" defaultValue={curLeitura.ID_ALUNO} onChange={(e) => {
                                e.target.value = e.target.value.replace(/[^0-9]/gi, ''); // só numeros, não usei um input do tipo number porque ele não é tão intuitivo de usar nesse caso
                                tempLeitura.ID_ALUNO = parseInt(e.target.value);
                            }}/>
                        </div>
                        <div>
                            <label htmlFor="id-prova-input">ID Prova:</label>
                            <input type="text" id="id-prova-input" name="id-prova-input" defaultValue={curLeitura.ID_PROVA} onChange={(e) => {
                                e.target.value = e.target.value.replace(/[^0-9]/gi, '');
                                tempLeitura.ID_PROVA = parseInt(e.target.value);
                            }}/>
                        </div>
                        <div>
                            <label htmlFor="nota-input">Nota:</label>
                            <input type="text" id="nota-input" name="nota-input" value={curLeitura.NOTA.toFixed(1)}/>
                        </div>
                        <div>
                            <label htmlFor="error-input">Erro:</label>
                            <input type="text" id="error-input" name="error-input" value={curLeitura.ERRO + ' - ' + ID_ERROS.get(curLeitura.ERRO)}/>
                        </div>
                    </div>
                    <p style={{textAlign: 'center'}}>Lembre-se de salvar localmente antes de fazer operações no banco de dados!</p>
                    <div id="readings-buttons">
                            <button type="submit" onClick={() => {
                                props.leituras[props.leituras.indexOf(curLeitura)] = tempLeitura;

                                setCurLeitura(tempLeitura);
                                props.updateLeitura(props.leituras);
                            }}>Salvar localmente</button>
                            <button onClick={() =>{
                                saveNewLeituraDatabase(curLeitura, '/api/resultados');
                            }}>Salvar novo registro no banco de dados</button>
                            <button onClick={() =>{
                                saveLeituraDatabase(curLeitura, '/api/resultados');
                            }}>Salvar no banco de dados</button>
                            <button onClick={() =>{
                                deleteLeituraDatabase(curLeitura, '/api/resultados')
                                .then(() =>{
                                    deleteLeitura([curLeitura]);
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
            <GenericTab itens={props.leituras} setCurItem={setCurLeitura} deleteItem={deleteLeitura} addItem={addLeitura}/>
        </>
    )
}

export default ListLeitura;