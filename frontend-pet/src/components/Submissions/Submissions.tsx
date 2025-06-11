import { useState } from 'react'
import Dragzone from './Dragzone'
import './submissions.css'

function Submissions(){
    const [files, setFiles] = useState(new Array<File>);

    function onFilesChanged(files: FileList){
        setFiles((filesprev) => filesprev.concat(Array.from(files)));
    }

    return (
        <div id="submissions">
            <div>
                <Dragzone onFilesChanged={onFilesChanged}/>
            </div>
            {
                files.map((file) =>{
                   return(
                    <div className='file-div'>
                        <p>{file.name}</p>
                    </div>
                   ) 
                })
            }
        </div>
    )
}

export default Submissions