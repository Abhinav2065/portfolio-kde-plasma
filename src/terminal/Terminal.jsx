import React, { useState, useRef, useEffect } from 'react';
import Draggable from 'react-draggable';
import './Terminal.css';

// Virtual File System
const FILE_SYSTEM = {
  '~': {
    type: 'dir',
    children: {
      'Desktop': {
        type: 'dir',
        children: {
          'portfolio.txt': { type: 'file', content: 'Welcome to my KDE Plasma / Arch Linux portfolio desktop!' },
          'resume.pdf': { type: 'file', content: 'Abhinav Siluwal — STEM Developer & Linux Enthusiast' }
        }
      },
      'Documents': {
        type: 'dir',
        children: {
          'about_me.txt': { type: 'file', content: 'Hi, I am Abhinav Siluwal! A developer and robotics enthusiast building systems on Linux.' },
          'skills.md': { type: 'file', content: '# Skills\n- React, JavaScript, Node.js\n- Python, C/C++, Linux Kernel, Git\n- Robotics, Embedded Systems, ROS' }
        }
      },
      'Downloads': {
        type: 'dir',
        children: {
          'archlinux-2026.iso': { type: 'file', content: '[Binary ISO file: Arch Linux Rolling Release x86_64]' }
        }
      },
      'Music': {
        type: 'dir',
        children: {
          'synthwave.mp3': { type: 'file', content: '♪ ♫ Playing: Justin Bieber - Beauty And A Beat ♫ ♪' }
        }
      },
      'Pictures': {
        type: 'dir',
        children: {
          'wallpaper.png': { type: 'file', content: '[Image PNG: Arch Linux 4K Minimal Wallpaper]' }
        }
      },
      'Videos': {
        type: 'dir',
        children: {
          'demo.mp4': { type: 'file', content: '[Video MP4: KDE Plasma Desktop Showcase]' }
        }
      },
      'Projects': {
        type: 'dir',
        children: {
          'portfolio-kde': { type: 'dir', children: {} },
          'robotics-vision': { type: 'dir', children: {} }
        }
      },
      '.bashrc': {
        type: 'file',
        content: 'export PS1="ablag@arch:\\w\\$ "\nalias ll="ls -la"\nalias ff="fastfetch"'
      },
      '.config': {
        type: 'dir',
        children: {
          'kitty': { type: 'dir', children: {} },
          'hypr': { type: 'dir', children: {} }
        }
      }
    }
  }
};

const COMMANDS = [
  'help', 'clear', 'ls', 'pwd', 'cd', 'cat', 'date', 'echo',
  'fastfetch', 'neofetch', 'whoami', 'uname', 'uptime', 'history',
  'mkdir', 'touch', 'rm', 'sudo', 'pacman', 'kitty', 'exit'
];

const GIT_COMMANDS = ['status', 'commit', 'push', 'pull', 'branch', 'checkout', 'log', 'diff', 'add'];
const PACMAN_FLAGS = ['-S', '-Syu', '-R', '-Q', '-Ss', '-Scc', 'install', 'update'];

// Helper to resolve directory in virtual FS
function getDirectoryNode(cwd) {
  if (cwd === '~' || cwd === '/home/ablag') {
    return FILE_SYSTEM['~'];
  }
  const parts = cwd.replace(/^~\/?/, '').split('/').filter(Boolean);
  let current = FILE_SYSTEM['~'];
  for (const part of parts) {
    if (current && current.type === 'dir' && current.children && current.children[part]) {
      current = current.children[part];
    } else {
      return null;
    }
  }
  return current;
}

// Find longest common prefix of a list of strings
function getLongestCommonPrefix(strings) {
  if (!strings || strings.length === 0) return '';
  let prefix = strings[0];
  for (let i = 1; i < strings.length; i++) {
    while (strings[i].indexOf(prefix) !== 0) {
      prefix = prefix.substring(0, prefix.length - 1);
      if (!prefix) return '';
    }
  }
  return prefix;
}

const Terminal = ({ onClose, onMinimize, isMinimized, zIndex, onFocus }) => {
  const [tabs, setTabs] = useState([
    {
      id: 1,
      input: '',
      cwd: '~',
      history: [],
      historyIndex: -1,
      output: [
        { type: 'output', content: 'Welcome to kitty terminal on Arch Linux!\nType "help" or use TAB to auto-complete commands and files.' },
        { type: 'prompt' }
      ]
    }
  ]);
  const [activeTabId, setActiveTabId] = useState(1);
  const [nextId, setNextId] = useState(2);
  const [isMaximized, setIsMaximized] = useState(false);

  const toggleMaximize = () => setIsMaximized(prev => !prev);

  const nodeRef = useRef(null);
  const inputRef = useRef(null);
  const outputEndRef = useRef(null);

  const activeTab = tabs.find(t => t.id === activeTabId) || tabs[0];
  const activeOutput = activeTab.output;
  const currentCwd = activeTab.cwd || '~';

  const patchTab = (id, patch) => {
    setTabs(prev => prev.map(t => t.id === id ? { ...t, ...patch } : t));
  };

  const handleTerminalClick = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleCloseClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onClose();
  };

  useEffect(() => {
    if (outputEndRef.current) {
      outputEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [activeOutput]);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [activeTabId]);

  // Tab Auto-Completion Handler
  const handleTabCompletion = () => {
    const fullInput = activeTab.input;
    const tokens = fullInput.split(' ');
    const isFirstWord = tokens.length <= 1;
    const currentToken = tokens[tokens.length - 1];
    const previousTokens = tokens.slice(0, -1);

    const dirNode = getDirectoryNode(currentCwd);
    const availableEntries = dirNode && dirNode.children
      ? Object.entries(dirNode.children).map(([name, node]) => node.type === 'dir' ? `${name}/` : name)
      : [];

    let candidates = [];

    if (isFirstWord) {
      // 1. Command completion
      candidates = COMMANDS.filter(cmd => cmd.startsWith(currentToken.toLowerCase()));
      // Also check executable files in directory
      const fileCandidates = availableEntries.filter(e => e.startsWith(currentToken));
      candidates = [...candidates, ...fileCandidates];
    } else {
      const mainCommand = tokens[0].toLowerCase();

      if (mainCommand === 'cd') {
        // Only directory candidates
        const dirCandidates = availableEntries
          .filter(e => e.endsWith('/'))
          .filter(e => e.toLowerCase().startsWith(currentToken.toLowerCase()));
        candidates = dirCandidates;
      } else if (mainCommand === 'git') {
        if (tokens.length === 2 && !fullInput.endsWith(' ')) {
          candidates = GIT_COMMANDS.filter(g => g.startsWith(currentToken.toLowerCase()));
        } else {
          candidates = availableEntries.filter(e => e.toLowerCase().startsWith(currentToken.toLowerCase()));
        }
      } else if (mainCommand === 'pacman') {
        if (tokens.length === 2 && !fullInput.endsWith(' ')) {
          candidates = PACMAN_FLAGS.filter(p => p.startsWith(currentToken));
        } else {
          candidates = ['linux', 'mesa', 'kitty', 'hyprland', 'neovim', 'firefox', 'vlc']
            .filter(pkg => pkg.startsWith(currentToken.toLowerCase()));
        }
      } else {
        // File and directory candidates
        candidates = availableEntries.filter(e => e.toLowerCase().startsWith(currentToken.toLowerCase()));
      }
    }

    // Process completion candidates
    if (candidates.length === 1) {
      const match = candidates[0];
      let newTokens = [...previousTokens, match];
      let completedText = newTokens.join(' ');
      // Add trailing space if not ending in directory slash
      if (!match.endsWith('/')) {
        completedText += ' ';
      }
      patchTab(activeTabId, { input: completedText });
    } else if (candidates.length > 1) {
      const lcp = getLongestCommonPrefix(candidates);
      if (lcp.length > currentToken.length) {
        // Auto-expand to longest common prefix
        const newTokens = [...previousTokens, lcp];
        patchTab(activeTabId, { input: newTokens.join(' ') });
      } else {
        // Show matching candidates in terminal output (like real Bash/Zsh)
        const suggestionsDisplay = candidates.join('   ');
        patchTab(activeTabId, {
          output: [
            ...activeOutput,
            { type: 'command', content: fullInput, cwd: currentCwd },
            { type: 'output', content: suggestionsDisplay },
            { type: 'prompt', cwd: currentCwd }
          ]
        });
      }
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      handleTabCompletion();
      return;
    }

    if (e.key === 'Enter') {
      e.preventDefault();
      const cmd = activeTab.input;
      processCommand(cmd);
      const newHistory = cmd.trim() ? [...(activeTab.history || []), cmd] : activeTab.history;
      patchTab(activeTabId, {
        input: '',
        history: newHistory,
        historyIndex: newHistory ? newHistory.length : 0
      });
      return;
    }

    // Command History Navigation
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      const history = activeTab.history || [];
      if (history.length === 0) return;
      const nextIndex = activeTab.historyIndex === -1 ? history.length - 1 : Math.max(0, activeTab.historyIndex - 1);
      patchTab(activeTabId, {
        input: history[nextIndex] || '',
        historyIndex: nextIndex
      });
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      const history = activeTab.history || [];
      if (history.length === 0) return;
      const nextIndex = activeTab.historyIndex + 1;
      if (nextIndex >= history.length) {
        patchTab(activeTabId, { input: '', historyIndex: history.length });
      } else {
        patchTab(activeTabId, {
          input: history[nextIndex] || '',
          historyIndex: nextIndex
        });
      }
      return;
    }

    if (e.key === 'l' && e.ctrlKey) {
      e.preventDefault();
      patchTab(activeTabId, { output: [{ type: 'prompt', cwd: currentCwd }] });
      return;
    }

    if (e.key === 'c' && e.ctrlKey) {
      e.preventDefault();
      patchTab(activeTabId, {
        output: [
          ...activeOutput,
          { type: 'command', content: activeTab.input + '^C', cwd: currentCwd },
          { type: 'prompt', cwd: currentCwd }
        ],
        input: ''
      });
      return;
    }
  };

  const processCommand = (cmd) => {
    const trimmedCmd = cmd.trim();

    if (trimmedCmd === '') {
      patchTab(activeTabId, {
        output: [
          ...activeOutput,
          { type: 'command', content: '', cwd: currentCwd },
          { type: 'prompt', cwd: currentCwd }
        ]
      });
      return;
    }

    const parts = trimmedCmd.split(' ');
    const mainCmd = parts[0].toLowerCase();
    const args = parts.slice(1);

    let response = '';
    let newCwd = currentCwd;

    switch (mainCmd) {
      case 'help':
        response = `Available Commands:
  - help           : Show this help message
  - clear (Ctrl+L) : Clear the terminal screen
  - ls [dir]       : List files and directories
  - cd [dir]       : Change working directory
  - pwd            : Print working directory
  - cat [file]     : Print file contents
  - fastfetch      : Display system information
  - date           : Show current date and time
  - whoami         : Display current user
  - uname -a       : Show kernel and system architecture
  - uptime         : Show system running time
  - echo [text]    : Output text to terminal
  - history        : Show command history
  - exit           : Close terminal tab

Tip: Press [TAB] to auto-complete commands, files, and folders!`;
        break;

      case 'clear':
        patchTab(activeTabId, { output: [{ type: 'prompt', cwd: currentCwd }] });
        return;

      case 'ls': {
        const targetDir = args[0] ? (args[0] === '..' ? '~' : args[0].replace(/\/$/, '')) : currentCwd;
        const dirNode = getDirectoryNode(targetDir === currentCwd ? currentCwd : (currentCwd === '~' ? `~/${targetDir}` : `${currentCwd}/${targetDir}`));
        if (dirNode && dirNode.children) {
          const list = Object.entries(dirNode.children).map(([name, node]) => {
            return node.type === 'dir' ? `${name}/` : name;
          });
          response = list.join('   ');
        } else {
          response = `ls: cannot access '${args[0]}': No such file or directory`;
        }
        break;
      }

      case 'pwd':
        response = currentCwd === '~' ? '/home/ablag' : `/home/ablag/${currentCwd.replace(/^~\/?/, '')}`;
        break;

      case 'cd': {
        const target = args[0];
        if (!target || target === '~' || target === '/home/ablag') {
          newCwd = '~';
        } else if (target === '..') {
          if (currentCwd !== '~') {
            const parts = currentCwd.split('/');
            parts.pop();
            newCwd = parts.join('/') || '~';
          }
        } else {
          const cleanTarget = target.replace(/\/$/, '');
          const checkPath = currentCwd === '~' ? `~/${cleanTarget}` : `${currentCwd}/${cleanTarget}`;
          const node = getDirectoryNode(checkPath);
          if (node && node.type === 'dir') {
            newCwd = checkPath;
          } else {
            response = `cd: no such file or directory: ${target}`;
          }
        }
        break;
      }

      case 'cat': {
        const target = args[0];
        if (!target) {
          response = 'cat: missing file operand';
        } else {
          const dirNode = getDirectoryNode(currentCwd);
          if (dirNode && dirNode.children && dirNode.children[target]) {
            const fileNode = dirNode.children[target];
            if (fileNode.type === 'file') {
              response = fileNode.content;
            } else {
              response = `cat: ${target}: Is a directory`;
            }
          } else {
            response = `cat: ${target}: No such file or directory`;
          }
        }
        break;
      }

      case 'date':
        response = new Date().toString();
        break;

      case 'whoami':
        response = 'ablag';
        break;

      case 'uname':
        response = 'Linux arch 6.18.2-arch2-1 #1 SMP PREEMPT_DYNAMIC Sun, 23 Aug 2026 00:00:00 +0000 x86_64 GNU/Linux';
        break;

      case 'uptime':
        response = ' 00:10:35 up 6:59,  1 user,  load average: 0.28, 0.35, 0.42';
        break;

      case 'history':
        response = (activeTab.history || []).map((h, i) => `  ${i + 1}  ${h}`).join('\n') || '  1  help';
        break;

      case 'fastfetch':
      case 'neofetch':
        response = `                               Running out of space? Just run 
                                sudo rm -fr ./*

                               Laptop: Latitude 3420
                               OS :   Arch BTW
                               Kernel: Linux 6.18.2-arch2-1
                               Packages: 1435 (pacman), 13 (flatpak)
                               Display: 1920x1080 @ 1.5x in 14", 60 Hz [Built-in]
                               WM: Hyprland 0.52.2 (Wayland)
                               Terminal: kitty 0.44.0
                               Music: Justin Bieber - Beauty And A Beat (Playing)
                               OS Age : 402 days
                               Uptime : 6 hours, 59 mins
                               Battery: 59% [Charging, AC Connected]

                               User: ablag@arch

                               CPU: 11th Gen Intel(R) Core(TM) i5-1135G7
                               GPU: Iris Xe Graphics (i915)
                               Memory: 4.31 GiB / 15.36 GiB (28%)`;
        break;

      case 'sudo':
        if (args.join(' ').includes('rm -rf') || args.join(' ').includes('rm -fr')) {
          window.location.assign('https://www.youtube.com/watch?v=dQw4w9WgXcQ');
          response = 'Executing payload... Enjoy!';
        } else {
          response = `[sudo] password for ablag: \nSorry, user ablag is not allowed to execute '${args.join(' ')}' as root on arch.`;
        }
        break;

      case 'mkdir':
        response = args[0] ? '' : 'mkdir: missing operand';
        break;

      case 'touch':
        response = args[0] ? '' : 'touch: missing file operand';
        break;

      case 'rm':
        response = args[0] ? '' : 'rm: missing operand';
        break;

      case 'exit':
        closeTab(activeTabId);
        return;

      default:
        if (trimmedCmd.toLowerCase().startsWith('echo')) {
          response = trimmedCmd.substring(5);
        } else {
          response = `zsh: command not found: ${mainCmd}. Type "help" for available commands.`;
        }
    }

    patchTab(activeTabId, {
      cwd: newCwd,
      output: [
        ...activeOutput,
        { type: 'command', content: trimmedCmd, cwd: currentCwd },
        ...(response ? [{ type: 'output', content: response }] : []),
        { type: 'prompt', cwd: newCwd }
      ]
    });
  };

  const handleInputChange = (e) => {
    patchTab(activeTabId, { input: e.target.value });
  };

  const newTab = () => {
    const id = nextId;
    setNextId(nextId + 1);
    setTabs(prev => [
      ...prev,
      {
        id,
        input: '',
        cwd: '~',
        history: [],
        historyIndex: -1,
        output: [{ type: 'prompt', cwd: '~' }]
      }
    ]);
    setActiveTabId(id);
  };

  const switchTab = (id) => {
    setActiveTabId(id);
  };

  const closeTab = (id) => {
    if (tabs.length <= 1) {
      onClose();
      return;
    }
    const remaining = tabs.filter(t => t.id !== id);
    setTabs(remaining);
    if (id === activeTabId) {
      setActiveTabId(remaining[remaining.length - 1].id);
    }
  };

  return (
    <Draggable
      bounds="parent"
      nodeRef={nodeRef}
      handle=".terminal-header"
      disabled={isMaximized}
      defaultPosition={{ x: 80, y: 40 }}
    >
      <div
        ref={nodeRef}
        className={`terminal-window ${isMaximized ? 'maximized' : ''} ${isMinimized ? 'minimized' : ''}`}
        onClick={handleTerminalClick}
        onMouseDownCapture={onFocus}
        onClickCapture={onFocus}
        onMouseDown={onFocus}
        style={{ zIndex }}
      >
        {/* Title / Tab bar */}
        <div className="terminal-header">
          <div className="terminal-tabs">
            {tabs.map(tab => (
              <div
                key={tab.id}
                className={`terminal-tab ${tab.id === activeTabId ? 'active' : ''}`}
                onClick={(e) => {
                  e.stopPropagation();
                  switchTab(tab.id);
                }}
              >
                <span className="tab-cat">🐱</span>
                <span className="tab-title">ablag@arch: {tab.cwd || '~'}</span>
                <button
                  type="button"
                  className="tab-close"
                  onClick={(e) => {
                    e.stopPropagation();
                    closeTab(tab.id);
                  }}
                >
                  ×
                </button>
              </div>
            ))}
            <button
              type="button"
              className="new-tab-btn"
              onClick={(e) => {
                e.stopPropagation();
                newTab();
              }}
              title="New Tab"
            >
              +
            </button>
          </div>
          <div className="terminal-window-controls" onMouseDown={(e) => e.stopPropagation()}>
            <button type="button" className="term-wc-btn" title="Minimize" onClick={onMinimize}>—</button>
            <button type="button" className="term-wc-btn" title={isMaximized ? "Restore" : "Maximize"} onClick={toggleMaximize}>
              {isMaximized ? "❐" : "▢"}
            </button>
            <button type="button" className="term-wc-btn term-wc-close" title="Close" onClick={handleCloseClick}>✕</button>
          </div>
        </div>

        {/* Terminal Body */}
        <div className="terminal-body">
          <pre>
            {activeOutput.map((item, index) => (
              <div key={index} className={`terminal-line ${item.type}`}>
                <div className="output-content">
                  {item.type === 'command' ? (
                    <>
                      <span className="prompt-user">ablag@arch</span>
                      <span className="prompt-colon">:</span>
                      <span className="prompt-path">{item.cwd || '~'}</span>
                      <span className="prompt-dollar">$</span>
                      <span>{item.content}</span>
                    </>
                  ) : item.type === 'prompt' ? null : (
                    item.content
                  )}
                </div>
              </div>
            ))}

            <div className="terminal-line prompt">
              <div className="prompt-line">
                <span className="prompt-user">ablag@arch</span>
                <span className="prompt-colon">:</span>
                <span className="prompt-path">{currentCwd}</span>
                <span className="prompt-dollar">$</span>
                <input
                  type="text"
                  className="terminal-input"
                  ref={inputRef}
                  value={activeTab.input}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown}
                  autoFocus
                  autoComplete="off"
                  spellCheck="false"
                />
              </div>
            </div>
          </pre>
        </div>
        <div ref={outputEndRef} />
      </div>
    </Draggable>
  );
};

export default Terminal;
