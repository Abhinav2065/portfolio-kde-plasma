import React, { useEffect, useState, useRef } from 'react'
import './bootanimation.css'
import { useNavigate } from 'react-router-dom'

  const bootMessage = [
    "[OK] Mounted /boot",
    "[OK] Mounted /home",
    "[OK] Started udev Kernel Device Manager",
    "[OK] Populated /dev Directory",
    "[OK] Started Rule-based Manager for Device Events",
    "[OK] Reached target Local File Systems",
    "[OK] Started Login Service",
    "[OK] Started Hostname Service",
    "[OK] Started Network Manager",
    "[OK] Started Load/Save Random Seed...",
    '[OK] Started Load/Save Random Seed',
    "[OK] Started Network Time Synchronization",
    "[OK] Started Target System Synchronization",
    "[OK] Reached target System Initilization",
    "[OK] Listening on D-Bus System Message Bus Socket",
    "[OK] Starting User Login Management....",
    "[OK] Started User Login Management",
    "[OK] Started Getty on tty1",
    "[OK] Started Permit User Sessions",
    "[OK] Starting User Management for UID 1000...",
    "[OK] Starting User Management for UID 1000",
    "[OK] Started Session c1 of user abhinav",
    "[OK] Mounted Kernel Debug File System",
    "[OK] Mounted FUSE Control File System",
    "[OK] Mounted Kernel Configuration File System",
    "[OK] Started Load Kernel Modules",
    "[OK] Started Load/Save Screen Backlight Brightness",
    "[OK] Reached target Sounds Card",
    "[OK] Starting Docker Daemon...",
    "[OK] Started Docker Daemon",
    "[OK] Started CUPS Printer Service...",
    "[OK] Started CUPS Printer Service",
    "[OK] Starting Bluetooth Service...",
    "[OK] Started Bluethooth Service",
    "[OK] Started Accounts Service ",
    "[OK] Started Disk Manager",
    "[OK] Started KDE Plasma Display Manager",
    "[OK] Reached Targeted Graphical Interface",
    "[OK] Starting Arch Linux Desktop Environment...",
    "[OK] Finished Arch Linux Desktop Environment"
  ]


const BootAnimation = () => {

  const navigate = useNavigate();

  const [fade, setFade] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    const finishTime = bootMessage.length*80+ 2000;
    
    const timer = setTimeout(() => {
      setFade(true);
      
      setTimeout(() => {
        navigate("/login");
      },1000);
    
    }, finishTime);
    return() => clearTimeout(timer);
  }, []);



  useEffect(() => {
    const id = requestAnimationFrame(() => {
      bottomRef.current?.scrollIntoView({behavior:"smooth"});
    })
    return () => cancelAnimationFrame(id);
  });

  return (
    <div className={`boot-screen ${fade? "fade-out": ""}`}>
      <div className="boot-lines">
      {bootMessage.map((msg, i)=> (
        <p key={i} style={{animationDelay: `${i*0.08}s`}}>{msg}</p>
      ))}
      </div>
      <div ref={bottomRef}></div>
    </div>
  )
}

export default BootAnimation