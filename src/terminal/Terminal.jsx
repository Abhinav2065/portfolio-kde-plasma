import React, {useCallback, useEffect, useRef } from 'react';
import { useXTerm} from 'react-xtermjs';
import { FitAddon} from '@xterm/addon-fit';
import './Terminal.css';

const Terminal = ({ onClose }) => {
  
  const fitAddonRef = useRef(new FitAddon());
  const isInitializedRef = useRef(false);


  const { instance, ref } = useXTerm({
    options: {
      cursorBlink: true,
      theme: {
        background: '#000',
        foreground: '#fff'
      }
    }
  });





  useEffect(() => {
    if (instance && !isInitializedRef.current) {

      isInitializedRef.current = true;

      console.log("Starting the Terminal");
      instance.loadAddon(fitAddonRef.current);


      setTimeout(() => {
        fitAddonRef.current.fit();
        instance.focus();
      }, 100);


      instance.writeln("Welcome to the terminal!");
      instance.writeln("I hope this works");
      instance.writeln("\r\n$");

      const dataHandler = instance.onData((data) => {
        console.log('Key Pressed:', data);
        if (data === '\r') {
          instance.write('\r\n$');
        }
        else if (data === '\x7f') {
          instance.write('\b \b');
        }
        else {
          instance.write(data);
        }
      });

      const handleResize = () => {
        fitAddonRef.current.fit();
      };


      window.addEventListener('resize', handleResize);


      return () => {
        console.log('GARBAGE MAN IS HERE CLEAN CLEAN CLEANNNNN!!!!');

        dataHandler.dispose();
        window.removeEventListener('resize', handleResize);

        instance.dispose();
      };

    }
  }, [instance]);


  const handleTerminalClick = useCallback((e) => {


    if (instance) {
      instance.focus();
    }
  }, [instance]);

  const handleCloseClick = ((e) => {
    e.stopPropagation();
    onClose();
  });


  const handleWindowClick = useCallback((e) => {
    e.stopPropagation();

  },[]);


  return (
      <div className="terminal-window" onClick={handleWindowClick}>
        <div className="terminal-header">
          <div className="terminal-title">
            Terminal
          </div>
          <div className="terminal-close" onClick={handleCloseClick}><button>x</button></div>
          </div>
          <div ref={ref} className="terminal-body" onClick={handleTerminalClick} style={{cursor:'text'}}></div>
        </div>
  )
}

export default Terminal