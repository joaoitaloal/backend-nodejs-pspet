import { useState } from "react";

interface GenericTabProps{
    itens: Array<any>;
    setCurItem: (item: any) => void;
    deleteItem: (itens: Array<any>) => void;
    addItem: () => void;
}

function GenericTab(props: GenericTabProps){
    const [selectedItens, setSelectedItens] = useState(new Set<any>);
    const [searchText, setSearchText] = useState("");
    
    function getID(item: any){
        if(item.ID_ALUNO != undefined) return item.ID_ALUNO;
        else if(item.ID_PROVA != undefined) return item.ID_PROVA;
        else return null;
    }

    return(
        <div id="readings-tab"> {/* Separar isso num arquivo pra fazer state com selecionadas e tal */}
            <div id="search-box">
                <h2>Procurar Item</h2>
                <label htmlFor="search-item">ID:</label>
                <input type="text" name="search-item" id="search-item" onChange={(e) => {
                    // Limpar seleção                    
                    for(let i = 0; i < props.itens.length; i++){
                        let element = (document.getElementById(`checkbox-reading${i}`) as HTMLInputElement);
                        if(element) element.checked = false;
                    }
                    setSelectedItens(new Set());

                    setSearchText(e.target.value);
                }}/>
                
            </div>
            <div id="readings-list">
            {
                props.itens.filter((item) =>{
                    if(searchText == "") return true;
                    else{
                        return getID(item) == parseInt(searchText);
                    }
                }).map((reading, index) => {
                    return(
                        <div key={`list-item${index}`}>
                            <input type="checkbox" name="reading-check" id={`checkbox-reading${index}`} onChange={(e) => {
                                if(e.target.checked){
                                    setSelectedItens((prev) => {
                                        prev.add(reading);
                                        return prev;
                                    })
                                }else{
                                    setSelectedItens((prev) => {
                                        prev.delete(reading);
                                        return prev;
                                    })
                                }
                            }}/>
                            <div className="reading-item" key={`reading${index}`} onClick={() => props.setCurItem(reading)}>
                                <p>Item: {getID(reading)}</p>
                            </div>
                        </div>

                    )
                })
            }
            </div>
            <div id="tab-buttons">
                <button onClick={() =>{
                    for(let i = 0; i < props.itens.length; i++){
                        let element = (document.getElementById(`checkbox-reading${i}`) as HTMLInputElement);
                        if(element && !element.checked) element.click();
                    }
                }}>Selecionar todas</button>
                <button onClick={props.addItem}>Adicionar novo item localmente</button>
                <button onClick={() =>{
                    for(let i = 0; i < props.itens.length; i++){
                        let element = (document.getElementById(`checkbox-reading${i}`) as HTMLInputElement);
                        if(element) element.checked = false;
                    }

                    props.deleteItem(Array.from(selectedItens));
                    setSelectedItens(new Set<any>);
                }}>Deletar selecionadas localmente</button>
            </div>
        </div>
    )
}

export default GenericTab;