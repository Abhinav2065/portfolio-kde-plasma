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
      content: 'Hi! My name is Abhinav Siluwal, I am 17 years old high school student and STEM enthusiast from Kathmandu, Nepal. I am currently in 12th grade on the NEB curriculum. I love to code and build robots and mess with electronics. I want to study Electrial Engineering after I complete my high school while learning to code on my own. I am currently mainly learning fontend development and C/C++ for working with microcontrollers as well as learning some Python for some of my projects. Also I have been using Linux for 4 years and daily driving linux for 2 and a half years. I currenly use Arch Linux with Hyprland and I really enjoy using linux, customizing it and editing it to make it just the way I like it.(Which you can probably tell from this project)'},
    
    {
      id: 2, 
      name:'What is this?', 
      x: 120, 
      y: 220,
      content: 'This is me trying to replicate a Linux desktop environment like kde plasma. Basically this project could fool a beginner into thinking that this is not a website but an actual OS if it were full screened, it has some easter eggs and this is the biggest project that i have ever made. It has what i think really awesome features in it which i really love. For example i made the terminal which is i think really cool and it has some working command (do try sudo rm -rf there)'},
    {
      id:3, 
      name:'Links', 
      x: 220, 
      y: 420, 
      content:'My github: https://github.com/Abhinav2065,\nMy LinkedIn: https://www.linkedin.com/in/abhinavsl/,\nMy Email: abhinavsl511@gmail.com'},
    {
      id:4,
      name:'passwords',
      x: 300,
      y: 200,
      content: 'sudo password - "123", try sudo rm -rf',
    },
    {
      id: 5,
      name:"projects",
      x: 700,
      y: 400,
    content: 'Here are some of the Projects that i have worked on: \n\n\n 1. Wheel Bugie Suspention System \n So i made a simple wheel bugie suspention system( the kinda suspention that are used in rovers for space and stuff), so the rover could easily travel through rough terrain if it were given a decently good torque motor according to its weight. I really had fun making this project as it was one of my favourate hardware project that i made for my schools annual Science Fair called Code Walk. Really had a fun time explaining the project as well. \n\n\n 2. Self Balancing Robot using PID controllers \n I made an self balancing robot that balanced on 2 wheels using the PID controller. so it had an gyroscope which detected how much it tilts and how fast it tilts and the PID controller is tuned in such a way that according to the tilt the robo will move its 2 parallel wheels on the tilting side to get the robo upright. This will cause the robot to stay upright despite of some simple human disturbance. I think i learned a lot via this project so i really like this project. \n\n\n 3. Solar Sysmte Simulation using webGl \n I made some solar system simulation using welgl, it had both 2d and 3d version of them, they used the newtonian physics for the simulation and it was really fun to build that project because it got me into simulations and also it was really fun to mess around with the masses and universal gravitational constant to see effects like slingshot in space and also i found it really intresting that the values have to be soo specefic to have a good stable orbin, made me realize that the solar system is kinda rare and magical. \n\n\n 4. Pika Network API \n So this is the first project i made for my needs and others also used this project, so basically i was really into pika network bedwars and i wanted to grind bedwars and wanted a more better overlays then what the pika community had so i wrote my own in python, it was really fun because it was the first thing thta i made that i used soo much and even other people used so much. So it used to bed the players usernames via the minecraft log files and from that the python program would take that username and get player stats from the pika network api and display it via typing is really fast in private chat so that not only me but my teammates can also see the stats of other people so that we can be carefull while playing.(helps you not get your ass whooped by try hards bascially) \n\n You can find all of my projects on my github at github.com/Abhinav2065. Feel free to follow me on github (please)'
    }
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