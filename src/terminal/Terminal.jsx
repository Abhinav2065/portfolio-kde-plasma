import React, { useState, useRef, useCallback, useEffect } from 'react'
import './Terminal.css';

const Terminal = ({onClose}) => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState([
    {type: 'output', content: 'type "help" to see available commands' },
    {type: 'prompt' }
  ]);

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
      response = `Available Commands:
      - help: Show this Message
      - clear: Clear the Terminal
      - date: Show Current Date and time
      - echo [text]: Echo Back the provided text`;
      break;

      case 'clear':
        setOutput([{type: 'prompt'}]);
        return;

      case 'date':
        response = new Date().toString();
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
      <div className="terminal-window" onClick={handleTerminalClick}>
          <div className="terminal-header">
            <div className="terminal-title">Terminal</div>
            <div className="terminal-close" onClick={handleCloseClick}>
              <button>x</button>
            </div>
          </div>
          <div className="terminal-body" ref={terminalRef}>
            {output.map((item, index) => (
              <div key={index} className={`terminal-line ${item.type}`}>
                {item.type === 'prompt' ? (
                  <div className="prompt-line">
                    <span className="prompt">$</span>
                    {index === output.length - 1 ? (
                      <input type="text" className="terminal-input" ref={inputRef}  value={input} onChange={handleInputChange} onKeyDown={handleKeyDown} autoFocus/>

                    ): null}
                  </div>

                ): (
                  <div className="output-content">
                    {item.type === 'command' && <span className='prompt'>$</span>}
                    {item.content}
                  </div>
                )}
              </div>
            ))}
          </div>
          <div ref={outputEndRef}/>
      </div>
  )
}

export default Terminal