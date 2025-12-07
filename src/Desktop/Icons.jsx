import React, { useRef, useState, useMemo } from 'react'
import notepad from '../assets/notepad.png'
import Notepad from './Notepad';
import Draggable from 'react-draggable';

const Icons = () => {
  const [icons, setIcons] = useState([
    {
      id: 1,
      name:'About Me', 
      x: 120, 
      y: 20, 
      content: 'Hi! My name is Abhinav Siluwal, I am 17 years old high school student and STEM enthusiast from Kathmandu, Nepal. I am currently in 12th grade on the NEB curriculum. I love to code and build robots and mess with electronics. I want to study Electrial Engineering after i complete my high school while learning to code on my own. I am currently mainly learning fontend development and C/C++ for working with microcontrollers as well as learning some Python for some of my projects. Also I have been using Linux for 4 years and daily driving linux for 2 and a half years. I currenly use Arch Linux with Hyprland and i really enjoy using linux, customizing it and editing it to make it just the way I like it.'},
    
    {
      id: 2, 
      name:'What is this?', 
      x: 120, 
      y: 220,
      content: 'This is me trying to replicate a Linux desktop environment like kde plasma. So this is like a notepad app on this "OS". \n So this website has a bunch of things that works like the terminal, it has some of the commands that work which you can see by typing "help" on the terminal. \n Also the browser works (depends on the browser), some of the browser lets you acess different website using iframe but some do not so its kinda based on browser but the home page is working for me (i use firefox). I tried to get google but it did not let me load it so i used ask.com (please do not judege me, i do not actully use ask.com)'},
    {
      id:3, 
      name:'Links', 
      top: 220, 
      left: 220, 
      content:'My github: https://github.com/Abhinav2065,\nMy LinkedIn: https://www.linkedin.com/in/abhinavsl/,\nMy Email: abhinavsl511@gmail.com,\ninstagram: silwalabhinav (only add me if you know me irl)'}
  ]);

  const [openNotepad, setOpenNotepad] = useState(null);


  const itemRefs = useMemo(() => {
    return icons.map(() => React.createRef());
  }, [icons]);
  

  const nodeRef = useRef(null);
  
  const handleDoubleClick = (icon) => {
    console.log('DoubleClicked', icon);
    setOpenNotepad(icon);
  }

  const handleCloseNotepad = () => {
    setOpenNotepad(null);
  }

  const handleStop = (e, data, id) => {
    setIcons(prevIcons => prevIcons.map(icon => {
      if (icon.id  === id) {
        return {...icon, x: data.x, y: data.y};
      }
      return icon;
    }))
  }



  return (
    <div style={{width: '100%', height: '100%', position: 'relative'}} >
        <div className="icons" ref={nodeRef} >

            {icons.map((icon, index)=> (
              <Draggable
                key={icon.id}
                defaultPosition={{x: icon.x, y: icon.y}}
                onStop={(e, data) => handleStop(e, data, icon.id)}
                nodeRef={itemRefs[index]}
              >
              <div
              
                ref={itemRefs[index]}
                className='icon-container'
                onDoubleClick={() => handleDoubleClick(icon)}
                style={{
                  position: 'absolute',
                  cursor: 'pointer',
                  widows: '80x',
                  textAlign: 'center',
                  color: 'white'
                }}
              >
                
              <img src={notepad} alt="" className='icon-img' draggable='false' />

              <p>{icon.name}</p>
                </div> 
              </Draggable> 
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