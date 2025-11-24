import React, { useState } from 'react'
import notepad from '../assets/notepad.png'
import Notepad from './Notepad';

const Icons = () => {
  const [icons, setIcons] = useState([
    {id: 1, name:'About Me', top:0, left: 0, content: 'Hi! My name is Abhinav Siluwal, I am 17 years old high school student and STEM enthusiast from Kathmandu, Nepal. A 12th grader, Builder, President of STEM club in my high school'},
    
    {id: 2, name:'What is this?', top:0, left: 0, content: 'This is a Projec That i have been meaning to make but not i am finally starting, its a WIP but i hope to finish it soon and and a lot of stuff here.'},
  ]);

  const [draggedItem, setDraggedItem] = useState(null);
  const [openNotepad, setOpenNotepad] = useState(null);
 
  
  const handleDoubleClick = (icon) => {
    console.log('DoubleClicked', icon);
    setOpenNotepad(icon);
  }

  const handleCloseNotepad = () => {
    setOpenNotepad(null);
  }

  const handleDragStart = (e, id) => {
    e.dataTransfer.setData('text/plain', id.toString());

    e.target.style.opacity = '0.6'; // Makes the icons that you are draggic opaccccccccccccci
    setDraggedItem(id);
  }

  const handleDragEnd = (e) => {
    e.target.style.opacity = '1';
    setDraggedItem(null);
  }

  const handleDragOver = (e) => {
    e.preventDefault();
  }

  const handleDrop = (e,targetId) => {
    e.preventDefault();
    const draggedId = parseInt(e.dataTransfer.getData('text/plain'));
    // how do we make it change pos???
    setIcons(prevIcons => {
      const draggedIndex = prevIcons.findIndex(icon => icon.id === draggedId);
      const targetIndex = prevIcons.findIndex(icon => icon.id === targetId);

      const newIcons = [...prevIcons];
      const [draggedIcon] = newIcons.splice(draggedIndex,1);
      newIcons.splice(targetIndex, 0, draggedIcon);

      return newIcons;
    });
  }



  return (
    <div>
        <div className="icons" onDragOver={handleDragOver}>

            {icons.map((icon)=> (
              <div
                key={icon.id}
                className='icon'
                draggable='true'
                onDragStart={(e) => handleDragStart(e, icon.id)}
                onDragEnd = {handleDragEnd}
                onDrop={(e) => handleDrop(e, icon.id)}
                onDoubleClick={() => handleDoubleClick(icon)}
                style = {{
                  position: 'relative',
                  cursor: 'move',
                  userSelect: 'none'
                }}
              
              >
                
              <img src={notepad} alt="" className='icon-img' draggable='false' />
              <p>{icon.name}</p>
              </div> 
            ))}
        </div>

            {openNotepad && (
              <Notepad
                title={openNotepad.name}
                content={openNotepad.content}
                onClose={handleCloseNotepad}
              />
            )}
    </div>
  )
}

export default Icons