import { useState } from 'react'
import Dragzone from './Dragzone'
import './submissions.css'
import type { Reading } from '../../lib/interfaces';

interface SubmissionsProps{
    updateReadings: (reading: Array<Reading>) => void;
}

function Submissions(props: SubmissionsProps){
    const [files, setFiles] = useState(new Array<File>);
    // Fazer só aceitar pdf

    function onFilesChanged(files: FileList){
        setFiles((filesprev) => filesprev.concat(Array.from(files)));
    }

    function removeFile(file: File){
        let filesNew = [...files];
        filesNew.splice(files.indexOf(file), 1);

        setFiles(filesNew);
    }

    function submitFiles(){
        // requisição

        //resposta
        props.updateReadings([{
            erro: 0,
            id_aluno: 1,
            id_prova: 2,
            leitura: 'abcddde??ab00ce'
        }]);
    }

    return (
        <>
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
        <button onClick={submitFiles} id='submit-files'>Enviar</button>
        </>
    )
}

export default Submissions