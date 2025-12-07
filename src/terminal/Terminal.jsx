import React, { useState, useRef, useCallback, useEffect } from 'react'
import Draggable from 'react-draggable';
import './Terminal.css';

const Terminal = ({onClose}) => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState([
    {type: 'output', content: 'type "help" to see available commands' },
    {type: 'prompt' }
  ]);

  
  const nodeRef = useRef(null);  // This avoids "strict mode warnings"



  const inputRef = useRef(null);
  const terminalRef = useRef(null);
  const outputEndRef = useRef(null);


  const handleTerminalClick = useCallback(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);


  const handleCloseClick = (e) => {
    e.stopPropagation();
    e.preventDefault();
    onClose();
  }

  useEffect(() => {
    if (outputEndRef.current) {
      outputEndRef.current.scrollIntoView({ behaviour: 'smooth'});
    }
  }, [output]);

 useEffect(() => {
  if (inputRef.current) {
    inputRef.current.focus();
  }
 }, []);
 
 const handleKeyDown = (e) => {
  if (e.key === 'Enter') {
    e.preventDefault();
    processCommand(input);
    setInput('');
  }
 }


 const processCommand = (cmd) => {
  const trimmedCmd = cmd.trim();

  if (trimmedCmd === '') {
    return;
  }


  let response = '';


  switch (trimmedCmd.toLowerCase()) {
    case 'help':
      response = `Available Commands:\n
      - help: Show this Message\n
      - clear: Clear the Terminal\n
      - date: Show Current Date and time\n
      - echo [text]: Echo Back the provided text
      - ls: display all iteams in the directory that you are in \n
      - pwd: shows your location\n
      - fastfetch: information about this OS`;
      break;

      case 'clear':
        setOutput([{type: 'prompt'}]);
        return;

      case 'ls':
        response = `Desktop Documents Downloads Music Pictures Videos`;
        break;

      case 'pwd':
        response = `/home/ablag`;
        break;
      
      case 'date':
        response = new Date().toString();
        break;

      case 'fastfetch':
        response = `               
┌──────────────────────────────────────┐ 
 OS: Arch Linux ( Arch BTW )
 Host: Latitude 3420 
 Kernel: 6.17.8-arch1-1 
 Uptime: 43 hours, 36 mins 
 Packages: 1325 (pacman) 
 Shell: bash 5.3.3 
 Resolution: 1920x1080 
 DE: KDE Plasma 
 Terminal: meow meow 
└──────────────────────────────────────┘ 
                 
──────────────────────────── `
        break;
      case '':
        setOutput(prev => [...prev, {type: 'prompt'}]);
        return;

      default:
        if (trimmedCmd.toLowerCase().startsWith('echo')) {
          response = trimmedCmd.substring(5);
        }
        else {
          response = `Command Not Found: ${trimmedCmd}. Type "help" for available commands.`;
        }
  }

  setOutput(prev => [
    ...prev,  
    {type: 'command', content: `$ ${trimmedCmd}`},
    {type: 'output', content: response},

  ]);
 };

 const handleInputChange = (e) => {
  setInput(e.target.value);
 }

  return (
    <Draggable nodeRef={nodeRef} handle='.terminal-header' defaultPosition={{x:200, y:100}} >
      <div ref={nodeRef} className="terminal-window" onClick={handleTerminalClick}>

          <div className="terminal-header">
            <div className="terminal-title">Terminal</div>
            <div className="terminal-close" onClick={handleCloseClick}>
              <button>x</button>
            </div>
          </div>
          <div className="terminal-body" ref={terminalRef}>
            <pre>
            {output.map((item, index) => (
              <div key={index} className={`terminal-line ${item.type}`}>
                <div className="output-content">
                  {item.content}
                </div>
              </div>
            ))}


            <div className="terminal-line prompt">
              <div className="prompt-line">
                <span className="prompt">$</span>
                <input 
                type="text"
                className='terminal-input'
                ref={inputRef}
                value={input}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                autoFocus
                />

              </div>
            </div>
            </pre>
          </div>
          <div ref={outputEndRef}/>

      </div>
      </Draggable>
  )
}

export default Terminal