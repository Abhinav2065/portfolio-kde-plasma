import React from 'react'

const Notepad = ({title, content , onClose}) => {

  return (
    <div>
        <div className="notepad">
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
    </div>
  )
}

export default Notepad