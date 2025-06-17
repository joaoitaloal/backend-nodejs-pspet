import { useState } from 'react'
import Dragzone from './Dragzone.tsx'
import './submissions.css'
import type { Reading } from '../../lib/interfaces.ts';
import axios from 'axios';

interface SubmissionsProps{
    updateReadings: (reading: Array<Reading>) => void;
}

function Submissions(props: SubmissionsProps){
    const [files, setFiles] = useState(new Array<File>);
    const [status, setStatus] = useState(`Enviar`)
    // Fazer só aceitar png/jpeg(o que a biblioteca suportar)

    function onFilesChanged(files: FileList){
        setFiles((filesprev) => filesprev.concat(Array.from(files)));
    }

    function removeFile(file: File){
        let filesNew = [...files];
        filesNew.splice(files.indexOf(file), 1);

        setFiles(filesNew);
    }

    function submitFiles(){
        let formData = new FormData();
        files.forEach((file) => formData.append('imagens', file))
        setStatus("Processando resposta")

        axios.post('/api/processar-imagens', formData)
        .then((res) =>{
                console.log(res.data)
            let result = res.data.message.map((leitura: any) =>{
                let leituraOBJ = JSON.parse(leitura)
                return { 
                    ACERTOS: leituraOBJ.ACERTOS,
                    ERRO: leituraOBJ.ERRO,
                    ID_ALUNO: leituraOBJ.ID_ALUNO,
                    ID_PROVA: leituraOBJ.ID_PROVA,
                    IMAGE_URL: leituraOBJ.IMAGE_URL,
                    LEITURA: leituraOBJ.LEITURA,
                    NOTA: leituraOBJ.NOTA
                 } as Reading
            })
            props.updateReadings(result);
        })
        .catch((err) => {
            setStatus("Algo deu errado, olhe o console")
            console.error(err)
        })
    }

    return (
        <div id='submissions-wrapper'>
            <div id="submissions">
                <Dragzone onFilesChanged={onFilesChanged}/>
                <div id='image-list'>
                    {
                        files.map((file, index) =>{
                            return(
                                <div className='file-div' key={`image${index}`}>
                                    {/*<img src={url} id={`submit-image${index}`}/> <-- Bastante trabalho, tenho que usar um filereader com promise pra ser assincrono*/}
                                    <p>{file.name}</p>
                                    <button onClick={() => removeFile(file)}>Remover</button>
                                </div>
                        ) 
                        })
                    }
                </div>
            </div>
            <button onClick={submitFiles} id='submit-files'>{status}</button>
        </div>
    )
}

export default Submissions