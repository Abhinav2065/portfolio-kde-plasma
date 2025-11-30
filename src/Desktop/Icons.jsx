import React, { useState } from 'react'
import notepad from '../assets/notepad.png'
import Notepad from './Notepad';

const Icons = () => {
  const [icons, setIcons] = useState([
    {id: 1, name:'About Me', top:0, left: 0, content: 'Hi! My name is Abhinav Siluwal, I am 17 years old high school student and STEM enthusiast from Kathmandu, Nepal. I am currently in 12th grade on the NEB curriculum. I love to code and build robots and mess with electronics. I want to study Electrial Engineering after i complete my high school while learning to code on my own. I am currently mainly learning fontend development and C/C++ for working with microcontrollers as well as learning some Python for some of my projects. Also I have been using Linux for 4 years and daily driving linux for 2 and a half years. I currenly use Arch Linux with Hyprland and i really enjoy using linux, customizing it and editing it to make it just the way I like it.'},
    
    {id: 2, name:'What is this?', top:0, left: 0, content: 'This is me trying to replicate a Linux desktop environment like kde plasma. So this is like a notepad app on this "OS". \n So this website has a bunch of things that works like the terminal, it has some of the commands that work which you can see by typing "help" on the terminal. \n Also the browser works (depends on the browser), some of the browser lets you acess different website using iframe but some do not so its kinda based on browser but the home page is working for me (i use firefox). I tried to get google but it did not let me load it so i used ask.com (please do not judege me, i do not actully use ask.com)'},
    {id:3, name:'Links', top:0, left:3, content:'My github: https://github.com/Abhinav2065,\nMy LinkedIn: https://www.linkedin.com/in/abhinavsl/,\nMy Email: abhinavsl511@gmail.com,\ninstagram: silwalabhinav (only add me if you know me irl)'}
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