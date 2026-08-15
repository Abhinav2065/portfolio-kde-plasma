import React, { useRef, useState } from 'react'
import Draggable from 'react-draggable'


const Notepad = ({title, content, onClose}) => {

    const nodeRef = useRef(null);
    const storageKey = `notepad-${title}`;
    const [value, setValue] = useState(() => localStorage.getItem(storageKey) ?? content);

    const handleChange = (e) => {
        setValue(e.target.value);
        localStorage.setItem(storageKey, e.target.value);
    }

  return (
    <Draggable nodeRef={nodeRef} handle='.notepad-header' defaultPosition={{x:0, y:0}}>
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
                <textarea value={value} onChange={handleChange} style={{width: '100%', height:'300px'}} className='text-area'></textarea>
            </div>
        </div>
    </Draggable>
  )
}

export default Notepad