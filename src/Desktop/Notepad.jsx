import React, { useRef} from 'react'
import Draggable from 'react-draggable'


const Notepad = ({title, content , onClose}) => {

    const nodeRef = useRef(null);


  return (
    <Draggable nodeRef={nodeRef} handle='.notepad-header' defaultPosition={{x:100, y:-200}}>
        <div ref={nodeRef} className="notepad">
            <div className="notepad-header">
                <div className="notepad-title">
                    {title}
                </div>
                <div className="notepad-close">
                    <button onClick={onClose}>X</button>
                </div>
            </div>
            <div className="notepad-body">
                <textarea defaultValue={content} style={{width: '100%', height:'300px'}}></textarea>
            </div>
        </div>
    </Draggable>
  )
}

export default Notepad