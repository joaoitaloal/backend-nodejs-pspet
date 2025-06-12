import { useState } from "react";
import type { Reading } from "../../lib/interfaces.ts";

interface ReadingsTabProps{
    readings: Array<Reading>;
    setCurReading: (reading: Reading) => void;
    deleteReadings: (readings: Array<Reading>) => void;
}

function ReadingsTab(props: ReadingsTabProps){
    const [selectedReadings, setSelectedReadings] = useState(new Set<Reading>);

    function saveSelected(){
        //salvar no banco de dados
    }

    return(
        <div id="readings-tab"> {/* Separar isso num arquivo pra fazer state com selecionadas e tal */}
            <div id="readings-list">
            {
                props.readings.map((reading, index) => {
                    return(
                        <div key={`list-item${index}`}>
                            <input type="checkbox" name="reading-check" id={`checkbox-reading${index}`} onChange={(e) => {
                                if(e.target.checked){
                                    setSelectedReadings((prev) => {
                                        prev.add(reading);
                                        return prev;
                                    })
                                }else{
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
                        if(!element.checked) element.click();
                    }
                }}>Selecionar todas</button>
                <button onClick={saveSelected}>Salvar selecionadas no banco</button>
                <button onClick={() =>{
                    for(let i = 0; i < props.readings.length; i++){
                        (document.getElementById(`checkbox-reading${i}`) as HTMLInputElement).checked = false;
                    }

                    props.deleteReadings(Array.from(selectedReadings));
                    setSelectedReadings(new Set<Reading>);
                }}>Deletar selecionadas localmente</button>
            </div>
        </div>
    )
}

export default ReadingsTab;