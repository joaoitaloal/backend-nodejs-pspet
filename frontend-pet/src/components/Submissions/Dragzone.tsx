interface DragzoneProps{
    onFilesChanged: (files: FileList) => void;
}

function Dragzone(props: DragzoneProps){

    function handleFileUpload(files: FileList | null){
        if(files == null) return; //give some warning maybe
        
        props.onFilesChanged(files);
    }
    
    return(
        <>
            <label htmlFor="file-upload" id="file-label">
                <div id="drop-zone" tabIndex={0} role="button" 
                    onDrop={(e) => {
                        e.preventDefault();
                        handleFileUpload(e.dataTransfer.files);
                    }}
                    onDragOver={(e) => e.preventDefault()}
                    >

                    Arraste e solte as imagens aqui ou clique para selecionar.
                </div>
                <input type="file" id="file-upload" name="files" multiple hidden 
                onChange={(e) =>{
                    e.preventDefault();
                    handleFileUpload(e.target.files);
                }}
            />
            </label>

        </>
    );
}

export default Dragzone;