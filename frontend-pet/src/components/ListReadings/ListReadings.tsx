import type { Reading } from "../../lib/interfaces";
import './listreadings.css'

interface ListReadingsProps{
    readings: Array<Reading>;
}

function ListReadings(props: ListReadingsProps){
    return (
        <>
            <h1>Leituras: </h1>
            <div id="readings-list">
                {
                    props.readings.map((reading, index) => {
                        return(
                            <div className="reading-item" key={`reading${index}`}>
                                <p>Código de saida: {reading.erro}</p>
                                <p>ID do aluno: {reading.id_aluno}</p>
                                <p>ID da prova: {reading.id_prova}</p>
                                <p>Leitura: {reading.leitura}</p>
                            </div>
                        )
                    })
                }
            </div>
        </>
    )
}

export default ListReadings;