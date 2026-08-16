import React, { useState, useRef, useEffect } from 'react'
import Draggable from 'react-draggable';
import './Terminal.css';

const Terminal = ({onClose}) => {
  const [tabs, setTabs] = useState([
    {
      id: 1,
      input: '',
      output: [
        {type: 'output', content: 'type "help" to see available commands' },
        {type: 'prompt' }
      ]
    }
  ]);
  const [activeTabId, setActiveTabId] = useState(1);
  const [nextId, setNextId] = useState(2);

  const nodeRef = useRef(null);  // This avoids "strict mode warnings"
  const inputRef = useRef(null);
  const outputEndRef = useRef(null);

  const activeTab = tabs.find(t => t.id === activeTabId) || tabs[0];
  const activeOutput = activeTab.output;

  const patchTab = (id, patch) => {
    setTabs(prev => prev.map(t => t.id === id ? { ...t, ...patch } : t));
  }

  const handleTerminalClick = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleCloseClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onClose();
  }

  useEffect(() => {
    if (outputEndRef.current) {
      outputEndRef.current.scrollIntoView({ behavior: 'smooth'});
    }
  }, [activeOutput]);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [activeTabId]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      processCommand(activeTab.input);
      patchTab(activeTabId, { input: '' });
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
          patchTab(activeTabId, { output: [{type: 'prompt'}] });
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

        case 'sudo rm -rf':
          window.location.assign("https://www.youtube.com/watch?v=dQw4w9WgXcQ&list=RDdQw4w9WgXcQ&start_radio=1");
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
          patchTab(activeTabId, { output: [...activeOutput, {type: 'prompt'}] });
          return;

        default:
          if (trimmedCmd.toLowerCase().startsWith('echo')) {
            response = trimmedCmd.substring(5);
          }
          else {
            response = `Command Not Found: ${trimmedCmd}. Type "help" for available commands.`;
          }
    }

    patchTab(activeTabId, {
      output: [
        ...activeOutput,
        {type: 'command', content: `${trimmedCmd}`},
        {type: 'output', content: response}
      ]
    });
  };

  const handleInputChange = (e) => {
    patchTab(activeTabId, { input: e.target.value });
  }

  const newTab = () => {
    const id = nextId;
    setNextId(nextId + 1);
    setTabs(prev => [...prev, {
      id,
      input: '',
      output: [{type: 'prompt'}]
    }]);
    setActiveTabId(id);
  }

  const switchTab = (id) => {
    setActiveTabId(id);
  }

  const closeTab = (id) => {
    if (tabs.length === 1) return;
    const remaining = tabs.filter(t => t.id !== id);
    setTabs(remaining);
    if (id === activeTabId) {
      setActiveTabId(remaining[remaining.length - 1].id);
    }
  }

  return (
    <Draggable bounds="parent" nodeRef={nodeRef} handle='.terminal-header' defaultPosition={{x: 80, y: 40}} >
      <div ref={nodeRef} className="terminal-window" onClick={handleTerminalClick}>

          <div className="terminal-header">
            <div className="terminal-tabs">
              {tabs.map(tab => (
                <div
                  key={tab.id}
                  className={`terminal-tab ${tab.id === activeTabId ? 'active' : ''}`}
                  onClick={(e) => { e.stopPropagation(); switchTab(tab.id); }}
                >
                  <span className="tab-cat">🐱</span>
                  <span className="tab-title">ablag@arch — kitty</span>
                  <button
                    type="button"
                    className="tab-close"
                    onClick={(e) => { e.stopPropagation(); closeTab(tab.id); }}
                  >×</button>
                </div>
              ))}
              <button type="button" className="new-tab-btn" onClick={(e) => { e.stopPropagation(); newTab(); }} title="New Tab">+</button>
            </div>
            <div className="terminal-close" onClick={handleCloseClick} onMouseDown={(e)=> e.stopPropagation()}>
              <button title="Close">✕</button>
            </div>
          </div>
          <div className="terminal-body">
            <pre>
            {activeOutput.map((item, index) => (
              <div key={index} className={`terminal-line ${item.type}`}>
                <div className="output-content">
                  {item.type === 'command' ? (
                    <>
                      <span className="prompt-user">ablag@arch</span>
                      <span className="prompt-colon">:</span>
                      <span className="prompt-path">~</span>
                      <span className="prompt-dollar">$</span>
                      {item.content}
                    </>
                  ) : (
                    item.content
                  )}
                </div>
              </div>
            ))}


            <div className="terminal-line prompt">
              <div className="prompt-line">
                <span className="prompt-user">ablag@arch</span>
                <span className="prompt-colon">:</span>
                <span className="prompt-path">~</span>
                <span className="prompt-dollar">$</span>
                <input 
                type="text"
                className='terminal-input'
                ref={inputRef}
                value={activeTab.input}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                autoFocus
                autoComplete='off'
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
