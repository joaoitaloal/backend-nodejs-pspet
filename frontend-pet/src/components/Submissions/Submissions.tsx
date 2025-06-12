import { useState } from 'react'
import Dragzone from './Dragzone.tsx'
import './submissions.css'
import type { Reading } from '../../lib/interfaces.ts';
import OCILogo from '/oci-logo-horizontal-color.svg';

interface SubmissionsProps{
    updateReadings: (reading: Array<Reading>) => void;
}

function Submissions(props: SubmissionsProps){
    const [files, setFiles] = useState(new Array<File>);
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
        // requisição

        //resposta
        props.updateReadings([{
            erro: 2,
            id_aluno: 1,
            id_prova: 6,
            nota: 1,
            leitura: 'a0bedabdbcc0eebacbca',
            image_url: '0001.png'
        },
        {
            erro: 0,
            id_aluno: 3,
            id_prova: 3,
            nota: 2.5,
            leitura: '?0d?0ecaaccaacdecaca',
            image_url: '0007.png'
        },
        {
            erro: 0,
            id_aluno: 3,
            id_prova: 3,
            nota: 2.5,
            leitura: '?0d?0ecaaccaacdecaca',
            image_url: '0008.png'
        },
        {
            erro: 0,
            id_aluno: 3,
            id_prova: 3,
            nota: 2.5,
            leitura: '?0d?0ecaaccaacdecaca',
            image_url: '0009.png'
        }
        ]);
    }

    return (
        <div id='submissions-grid'>
            <header id="oci-header">
                <h1>Leitor de Gabaritos</h1>
                <img src={OCILogo} alt="" />
            </header>
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
            <button onClick={submitFiles} id='submit-files'>Enviar</button>
            </div>

        </div>
    )
}

export default Submissions