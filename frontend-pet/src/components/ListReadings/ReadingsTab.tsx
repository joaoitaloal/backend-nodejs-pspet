import { useState } from "react";
import type { Reading } from "../../lib/interfaces.ts";

interface ReadingsTabProps{
    readings: Array<Reading>;
    setCurReading: (reading: Reading) => void;
    deleteReadings: (readings: Array<Reading>) => void;
}

function ReadingsTab(props: ReadingsTabProps){
    const [selectedReadings, setSelectedReadings] = useState(new Set<Reading>);
    const [searchText, setSearchText] = useState("");

    function saveSelected(){
        //salvar no banco de dados
    }

    return(
        <div id="readings-tab"> {/* Separar isso num arquivo pra fazer state com selecionadas e tal */}
            <div id="search-box">
                <h2>Procurar leitura</h2>
                <label htmlFor="search-item">ID do aluno:</label>
                <input type="text" name="search-item" id="search-item" onChange={(e) => {
                    // Limpar seleção                    
                    for(let i = 0; i < props.readings.length; i++){
                        let element = (document.getElementById(`checkbox-reading${i}`) as HTMLInputElement);
                        if(element) element.checked = false;
                    }
                    setSelectedReadings(new Set<Reading>);

                    setSearchText(e.target.value);
                }}/>
                
            </div>
            <div id="readings-list">
            {
                props.readings.filter((reading) =>{
                    if(searchText == "") return true;
                    else return reading.id_aluno == parseInt(searchText);
                }).map((reading, index) => {
                    return(
                        <div key={`list-item${index}`}>
                            <input type="checkbox" name="reading-check" id={`checkbox-reading${index}`} onChange={(e) => {
                                if(e.target.checked){
                                    setSelectedReadings((prev) => {
                                        prev.add(reading);
                                        return prev;
                                    })
                                }else{
                                    console.log('test');
                                    setSelectedReadings((prev) => {
                                        prev.delete(reading);
                                        return prev;
                                    })
                                }
                            }}/>
                            <div className="reading-item" key={`reading${index}`} onClick={() => props.setCurReading(reading)}>
                                <p>Leitura: {reading.image_url}</p>
                            </div>
                        </div>

                    )
                })
            }
            </div>
            <div id="tab-buttons">
                <button onClick={() =>{
                    for(let i = 0; i < props.readings.length; i++){
                        let element = (document.getElementById(`checkbox-reading${i}`) as HTMLInputElement);
                        if(element && !element.checked) element.click();
                    }
                }}>Selecionar todas</button>
                <button onClick={saveSelected}>Salvar selecionadas no banco</button>
                <button onClick={() =>{
                    for(let i = 0; i < props.readings.length; i++){
                        let element = (document.getElementById(`checkbox-reading${i}`) as HTMLInputElement);
                        if(element) element.checked = false;
                    }

                    props.deleteReadings(Array.from(selectedReadings));
                    setSelectedReadings(new Set<Reading>);
                }}>Deletar selecionadas localmente</button>
            </div>
        </div>
    )
}

export default ReadingsTab;