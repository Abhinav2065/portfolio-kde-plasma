import React, { useState, useRef, useEffect } from 'react';
import Draggable from 'react-draggable';
import './Terminal.css';

// Import local assets for virtual filesystem pictures
import bgArch from '../assets/bg-arch.png';
import pfpImg from '../assets/pfp.png';
import archLogo from '../assets/arch.png';
import archAnim from '../assets/archLinuxLoginAnimation.png';

// Virtual File System matching actual desktop notes and media
const createFileSystem = () => ({
  '~': {
    type: 'dir',
    children: {
      'Desktop': {
        type: 'dir',
        children: {
          'About_Me.txt': {
            type: 'file',
            content: `Hi! My name is Abhinav Siluwal, I am 17 years old high school student and STEM enthusiast from Kathmandu, Nepal. I am currently in 12th grade on the NEB curriculum. I love to code and build robots and mess with electronics. I want to study Electrical Engineering after I complete my high school while learning to code on my own. I am currently mainly learning frontend development and C/C++ for working with microcontrollers as well as learning some Python for some of my projects. Also I have been using Linux for 4 years and daily driving linux for 2 and a half years. I currently use Arch Linux with Hyprland and I really enjoy using linux, customizing it and editing it to make it just the way I like it.`
          },
          'What_is_this.txt': {
            type: 'file',
            content: `This is me trying to replicate a Linux desktop environment like KDE Plasma. Basically this project could fool a beginner into thinking that this is not a website but an actual OS if it were full screened, it has some easter eggs and this is the biggest project that i have ever made. It has what i think really awesome features in it which i really love. For example i made the terminal which is i think really cool and it has some working command (do try sudo rm -rf there).`
          },
          'Projects.txt': {
            type: 'file',
            content: `Here are some of the Projects that i have worked on:

1. Wheel Bogie Suspension System
So i made a simple wheel bogie suspension system (the kinda suspension that are used in rovers for space and stuff), so the rover could easily travel through rough terrain if it were given a decently good torque motor according to its weight. I really had fun making this project as it was one of my favorite hardware projects for my school's annual Science Fair called Code Walk.

2. Self Balancing Robot using PID controllers
I made a self balancing robot that balanced on 2 wheels using the PID controller. It had a gyroscope which detected tilt and angle, and the PID controller tuned the motors to stay upright despite human disturbances.

3. Solar System Simulation using WebGL
Interactive 2D and 3D simulation with Newtonian physics and orbital gravity.

4. Pika Network API
Custom stats & overlays API built in Python for Bedwars gameplay.`
          },
          'Links.txt': {
            type: 'file',
            content: `My GitHub: https://github.com/Abhinav2065\nMy LinkedIn: https://www.linkedin.com/in/abhinavsl/\nMy Email: abhinavsl@proton.me`
          },
          'passwords.txt': {
            type: 'file',
            content: `sudo password - "123", try sudo rm -rf`
          }
        }
      },
      'Documents': {
        type: 'dir',
        children: {
          'about_me.txt': {
            type: 'file',
            content: 'Abhinav Siluwal — STEM Developer & Robotics Builder on Arch Linux.'
          },
          'skills.md': {
            type: 'file',
            content: '# Skills\n- React, JavaScript, Vite, CSS\n- Python, C/C++, Linux Kernel, Git\n- Robotics, ROS, Embedded Microcontrollers'
          }
        }
      },
      'Downloads': {
        type: 'dir',
        children: {
          'archlinux-2026.08.iso': {
            type: 'file',
            content: '[Binary ISO file: Arch Linux Rolling Release x86_64]'
          }
        }
      },
      'Pictures': {
        type: 'dir',
        children: {
          'wallpaper.png': {
            type: 'file',
            isImage: true,
            url: bgArch,
            content: '[Image PNG: Arch Linux 4K Minimal Wallpaper]'
          },
          'profile.png': {
            type: 'file',
            isImage: true,
            url: pfpImg,
            content: '[Image PNG: Profile Avatar]'
          },
          'arch_logo.png': {
            type: 'file',
            isImage: true,
            url: archLogo,
            content: '[Image PNG: Arch Linux Emblem]'
          },
          'arch_animation.png': {
            type: 'file',
            isImage: true,
            url: archAnim,
            content: '[Image PNG: Login Animation Banner]'
          }
        }
      },
      'Music': {
        type: 'dir',
        children: {
          'synthwave.mp3': {
            type: 'file',
            content: '♪ ♫ Playing: Justin Bieber - Beauty And A Beat ♫ ♪'
          }
        }
      },
      'Videos': {
        type: 'dir',
        children: {
          'demo.mp4': {
            type: 'file',
            content: '[Video MP4: KDE Plasma Desktop Showcase]'
          }
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
});

const FILE_SYSTEM = createFileSystem();

const COMMANDS = [
  'help', 'clear', 'ls', 'pwd', 'cd', 'cat', 'date', 'echo',
  'firefox', 'fastfetch', 'neofetch', 'whoami', 'uname', 'uptime', 'history',
  'mkdir', 'touch', 'rm', 'sudo', 'pacman', 'kitty', 'exit'
];

const GIT_COMMANDS = ['status', 'commit', 'push', 'pull', 'branch', 'checkout', 'log', 'diff', 'add'];
const PACMAN_FLAGS = ['-S', '-Syu', '-R', '-Q', '-Ss', '-Scc', 'install', 'update'];

// Helper to resolve directory in virtual FS
function getDirectoryNode(cwd) {
  if (cwd === '~' || cwd === '/home/ablag') {
    return FILE_SYSTEM['~'];
  }
  const cleanPath = cwd.replace(/^\/home\/ablag\/?/, '').replace(/^~\/?/, '');
  const parts = cleanPath.split('/').filter(Boolean);
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

// Find a file anywhere or relative to cwd
function resolveFile(targetPath, currentCwd) {
  let searchDir = currentCwd;
  let filename = targetPath;

  if (targetPath.includes('/')) {
    const parts = targetPath.split('/');
    filename = parts.pop();
    const dirPart = parts.join('/');
    if (dirPart.startsWith('~') || dirPart.startsWith('/home/ablag')) {
      searchDir = dirPart;
    } else if (currentCwd === '~') {
      searchDir = `~/${dirPart}`;
    } else {
      searchDir = `${currentCwd}/${dirPart}`;
    }
  }

  const dirNode = getDirectoryNode(searchDir);
  if (dirNode && dirNode.children && dirNode.children[filename]) {
    return dirNode.children[filename];
  }

  // Fallback check in ~/Pictures if asking for an image
  if (filename.match(/\.(png|jpg|jpeg|gif|svg|webp)$/i)) {
    const picNode = getDirectoryNode('~/Pictures');
    if (picNode && picNode.children && picNode.children[filename]) {
      return picNode.children[filename];
    }
  }

  // Fallback check in ~/Desktop if asking for a text file
  const deskNode = getDirectoryNode('~/Desktop');
  if (deskNode && deskNode.children && deskNode.children[filename]) {
    return deskNode.children[filename];
  }

  return null;
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

const Terminal = ({ onClose, onMinimize, isMinimized, zIndex, onFocus, onOpenFirefox }) => {
  const [tabs, setTabs] = useState([
    {
      id: 1,
      input: '',
      cwd: '~',
      history: [],
      historyIndex: -1,
      output: [
        { type: 'output', content: 'type "help" to see available commands' },
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
  const terminalBodyRef = useRef(null);

  const activeTab = tabs.find(t => t.id === activeTabId) || tabs[0];
  const activeOutput = activeTab.output;
  const currentCwd = activeTab.cwd || '~';

  const patchTab = (id, patch) => {
    setTabs(prev => prev.map(t => t.id === id ? { ...t, ...patch } : t));
  };

  const scrollToBottom = () => {
    if (terminalBodyRef.current) {
      terminalBodyRef.current.scrollTop = terminalBodyRef.current.scrollHeight;
    }
    if (outputEndRef.current) {
      outputEndRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  };

  const handleTerminalClick = () => {
    if (inputRef.current) {
      inputRef.current.focus();
      scrollToBottom();
    }
  };

  const handleCloseClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onClose();
  };

  useEffect(() => {
    scrollToBottom();
  }, [activeOutput]);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
    scrollToBottom();
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
      // Also check executable files in current directory
      const fileCandidates = availableEntries.filter(e => e.toLowerCase().startsWith(currentToken.toLowerCase()));
      candidates = [...candidates, ...fileCandidates];
    } else {
      const mainCommand = tokens[0].toLowerCase();

      if (mainCommand === 'cd') {
        // Only directory candidates
        candidates = availableEntries
          .filter(e => e.endsWith('/'))
          .filter(e => e.toLowerCase().startsWith(currentToken.toLowerCase()));
      } else if (mainCommand === 'firefox') {
        // Files (especially pictures) & directories
        const picNode = getDirectoryNode('~/Pictures');
        const picEntries = picNode && picNode.children
          ? Object.keys(picNode.children)
          : [];
        const allPossible = Array.from(new Set([...availableEntries, ...picEntries]));
        candidates = allPossible.filter(e => e.toLowerCase().startsWith(currentToken.toLowerCase()));
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
        // General file and directory candidates
        candidates = availableEntries.filter(e => e.toLowerCase().startsWith(currentToken.toLowerCase()));
      }
    }

    // Process completion candidates
    if (candidates.length === 1) {
      const match = candidates[0];
      let newTokens = [...previousTokens, match];
      let completedText = newTokens.join(' ');
      if (!match.endsWith('/')) {
        completedText += ' ';
      }
      patchTab(activeTabId, { input: completedText });
      setTimeout(scrollToBottom, 20);
    } else if (candidates.length > 1) {
      const lcp = getLongestCommonPrefix(candidates);
      if (lcp.length > currentToken.length) {
        const newTokens = [...previousTokens, lcp];
        patchTab(activeTabId, { input: newTokens.join(' ') });
        setTimeout(scrollToBottom, 20);
      } else {
        const suggestionsDisplay = candidates.join('   ');
        patchTab(activeTabId, {
          output: [
            ...activeOutput,
            { type: 'command', content: fullInput, cwd: currentCwd },
            { type: 'output', content: suggestionsDisplay },
            { type: 'prompt', cwd: currentCwd }
          ]
        });
        setTimeout(scrollToBottom, 20);
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
      setTimeout(scrollToBottom, 20);
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
      setTimeout(scrollToBottom, 20);
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
      setTimeout(scrollToBottom, 20);
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
      setTimeout(scrollToBottom, 20);
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
  - help                : Show this help message
  - clear (Ctrl+L)      : Clear the terminal screen
  - ls [dir]            : List files and directories
  - cd [dir]            : Change working directory
  - pwd                 : Print working directory
  - cat [file]          : Print file contents
  - firefox [file/url]  : Open Firefox (e.g. firefox wallpaper.png)
  - fastfetch           : Display system information
  - date                : Show current date and time
  - whoami              : Display current user
  - uname -a            : Show kernel and system architecture
  - uptime              : Show system running time
  - echo [text]         : Output text to terminal
  - history             : Show command history
  - exit                : Close terminal tab

Tip: Press [TAB] to auto-complete commands, files, and folders!`;
        break;

      case 'clear':
        patchTab(activeTabId, { output: [{ type: 'prompt', cwd: currentCwd }] });
        return;

      case 'ls': {
        const targetDir = args[0] ? (args[0] === '..' ? '~' : args[0].replace(/\/$/, '')) : currentCwd;
        const checkPath = targetDir === currentCwd
          ? currentCwd
          : (targetDir.startsWith('~') || targetDir.startsWith('/home/ablag'))
            ? targetDir
            : (currentCwd === '~' ? `~/${targetDir}` : `${currentCwd}/${targetDir}`);

        const dirNode = getDirectoryNode(checkPath);
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
        const target = args.join(' ');
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
          const checkPath = cleanTarget.startsWith('~')
            ? cleanTarget
            : currentCwd === '~'
              ? `~/${cleanTarget}`
              : `${currentCwd}/${cleanTarget}`;
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
        const target = args.join(' ');
        if (!target) {
          response = 'cat: missing file operand';
        } else {
          const fileNode = resolveFile(target, currentCwd);
          if (fileNode) {
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

      case 'firefox': {
        const target = args.join(' ');
        if (!target) {
          if (onOpenFirefox) onOpenFirefox();
          response = 'Launching Firefox browser...';
        } else {
          // Check if argument is a local file / picture
          const fileNode = resolveFile(target, currentCwd);
          if (fileNode && fileNode.isImage && fileNode.url) {
            if (onOpenFirefox) onOpenFirefox(fileNode.url);
            response = `[firefox] Opening image '${target}' in Firefox...`;
          } else if (fileNode && fileNode.content) {
            // Text file
            if (onOpenFirefox) onOpenFirefox(`data:text/plain;charset=utf-8,${encodeURIComponent(fileNode.content)}`);
            response = `[firefox] Opening '${target}' in Firefox...`;
          } else if (target.startsWith('http://') || target.startsWith('https://')) {
            if (onOpenFirefox) onOpenFirefox(target);
            response = `[firefox] Opening '${target}' in Firefox...`;
          } else if (target.includes('.')) {
            // Check if it's wallpaper.png directly
            if (target.toLowerCase() === 'wallpaper.png') {
              if (onOpenFirefox) onOpenFirefox(bgArch);
              response = `[firefox] Opening 'wallpaper.png' in Firefox...`;
            } else {
              const url = `https://${target}`;
              if (onOpenFirefox) onOpenFirefox(url);
              response = `[firefox] Navigating to '${url}' in Firefox...`;
            }
          } else {
            if (onOpenFirefox) onOpenFirefox(`https://duckduckgo.com/?q=${encodeURIComponent(target)}`);
            response = `[firefox] Searching '${target}' in Firefox...`;
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
        response = ' 00:13:54 up 6:59,  1 user,  load average: 0.28, 0.35, 0.42';
        break;

      case 'history':
        response = (activeTab.history || []).map((h, i) => `  ${i + 1}  ${h}`).join('\n') || '  1  help';
        break;

      case 'fastfetch':
      case 'neofetch': {
        patchTab(activeTabId, {
          cwd: newCwd,
          output: [
            ...activeOutput,
            { type: 'command', content: trimmedCmd, cwd: currentCwd },
            {
              type: 'fastfetch',
              image: 'https://avatars.githubusercontent.com/u/151655515?v=4',
              rows: [
                { quote: 'Running out of space? Just run\nsudo rm -fr ./*' },
                { sep: true },
                { key: 'Laptop', val: 'Latitude 3420' },
                { key: 'OS', val: 'Arch BTW', valColor: '#1793d1' },
                { key: 'Kernel', val: 'Linux 6.18.2-arch2-1' },
                { key: 'Packages', val: '1435 (pacman), 13 (flatpak)' },
                { key: 'Display', val: '1920x1080 @ 1.5x in 14", 60 Hz [Built-in]' },
                { key: 'WM', val: 'KDE Plasma (Wayland)' },
                { key: 'Terminal', val: 'kitty 0.44.0' },
                { key: 'OS Age', val: '402 days' },
                { key: 'Uptime', val: '6 hours, 59 mins' },
                { key: 'Battery', val: '59% [Charging, AC Connected]' },
                { sep: true },
                { key: 'User', val: 'ablag@arch', valColor: '#40d672' },
                { sep: true },
                { key: 'CPU', val: '11th Gen Intel(R) Core(TM) i5-1135G7' },
                { key: 'GPU', val: 'Iris Xe Graphics (i915)' },
                { key: 'Memory', val: '4.31 GiB / 15.36 GiB (28%)' }
              ]
            },
            { type: 'prompt', cwd: newCwd }
          ]
        });
        return;
      }

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
    setTimeout(scrollToBottom, 10);
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
    setTimeout(scrollToBottom, 20);
  };

  const switchTab = (id) => {
    setActiveTabId(id);
    setTimeout(scrollToBottom, 20);
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
        <div className="terminal-body" ref={terminalBodyRef}>
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
                  ) : item.type === 'fastfetch' ? (
                    <div className="fastfetch-container">
                      <div className="fastfetch-image-box">
                        <img src={item.image} alt="Avatar" className="fastfetch-avatar" />
                      </div>
                      <div className="fastfetch-info">
                        {item.rows.map((row, idx) => (
                          row.quote ? (
                            <div key={idx} className="fastfetch-quote">{row.quote}</div>
                          ) : row.sep ? (
                            <div key={idx} className="fastfetch-sep" />
                          ) : (
                            <div key={idx} className="fastfetch-row">
                              <span className="fastfetch-key">{row.key}:</span>
                              <span className="fastfetch-val" style={row.valColor ? { color: row.valColor, fontWeight: 600 } : {}}>
                                {row.val}
                              </span>
                            </div>
                          )
                        ))}
                      </div>
                    </div>
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
          <div ref={outputEndRef} style={{ height: '1px' }} />
        </div>
      </div>
    </Draggable>
  );
};

export default Terminal;
