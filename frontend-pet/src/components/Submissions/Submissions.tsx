import { useState } from 'react'
import Dragzone from './Dragzone'
import './submissions.css'

function Submissions(){
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