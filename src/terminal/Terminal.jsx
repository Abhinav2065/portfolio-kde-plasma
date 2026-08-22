import React, { useState, useRef, useEffect, useCallback } from 'react';
import Draggable from 'react-draggable';
import './Terminal.css';

// Import local assets for virtual filesystem pictures
import bgArch from '../assets/bg-arch.png';
import pfpImg from '../assets/pfp.png';
import archLogo from '../assets/arch.png';
import archAnim from '../assets/archLinuxLoginAnimation.png';

// Fastfetch GitHub avatar URL with immediate in-memory caching
const FASTFETCH_AVATAR_URL = 'https://avatars.githubusercontent.com/u/151655515?v=4';
if (typeof window !== 'undefined') {
  const imgCache = new Image();
  imgCache.src = FASTFETCH_AVATAR_URL;
}

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
  'cmatrix', 'matrix', 'sl', 'cowsay', 'cowthink', 'fortune', 'cbonsai', 'bonsai',
  'htop', 'btop', 'top', 'figlet', 'pacman', 'sudo', 'mkdir', 'touch', 'rm', 'exit'
];

const GIT_COMMANDS = ['status', 'commit', 'push', 'pull', 'branch', 'checkout', 'log', 'diff', 'add'];
const PACMAN_FLAGS = ['-S', '-Syu', '-R', '-Q', '-Ss', '-Scc', 'install', 'update'];

const FORTUNES = [
  '"Talk is cheap. Show me the code." — Linus Torvalds',
  '"There are only 10 types of people in the world: those who understand binary, and those who don\'t."',
  '"Software is like sex: it\'s better when it\'s free." — Linus Torvalds',
  '"I\'d like to interject for a moment. What you\'re referring to as Linux, is in fact, GNU/Linux..." — Richard Stallman',
  '"In a world without walls and fences, who needs Windows and Gates?"',
  '"sudo make me a sandwich." -> "Okay."',
  '"A computer is like air conditioning: it becomes useless when you open Windows."',
  '"The only truly secure system is one that is powered off, cast in a block of concrete and sealed in a room with armed guards." — Gene Spafford',
  '"Arch BTW."',
  '"There is no place like /home/ablag."',
  '"Simplicity is prerequisite for reliability." — Edsger W. Dijkstra',
  '"Measuring programming progress by lines of code is like measuring aircraft building progress by weight." — Bill Gates'
];

// Helper to make ASCII cowsay
const makeCow = (text, isThink = false) => {
  const line = text || 'Arch Linux is the way.';
  const len = Math.max(line.length, 10);
  const border = '-'.repeat(len + 2);
  if (isThink) {
    return ` ( ${line} )
 ${border}
        o   ^__^
         o  (oo)\\_______
            (__)\\       )\\/\\
                ||----w |
                ||     ||`;
  }
  return ` < ${line} >
 ${border}
        \\   ^__^
         \\  (oo)\\_______
            (__)\\       )\\/\\
                ||----w |
                ||     ||`;
};

// Bonsai Tree Generator
const getBonsaiTree = () => {
  return `
       &&& &&  & &&
    && &\\/&\\|& ()|/ @, &&
    &\\/(/&/&||/& /_/)_&/_&
 &() &\\/&|()|/&\\/ '% & ()
&_\\_&&_\\ |& |&&/&__%_/_& &&
&&   && & &| &| /& & % ()& /&&
 ()&_---()&\\&\\|&&-&&--%---()~
     &&     \\|||
             |||
             |||
             |||
       .     |||
      / \\  . |||
     (___)` + ' `---´\n' +
`    ~~~~~~~~~~~~~~~~~~~~~~~
      [ Arch Bonsai Garden ]`;
};

// Figlet generator
const getFiglet = (text) => {
  const t = (text || 'ARCH').toUpperCase().slice(0, 10);
  if (t === 'ARCH') {
    return `
    _              _     
   / \\   _ __ ___ | |__  
  / _ \\ | '__/ __|| '_ \\ 
 / ___ \\| | | (__ | | | |
/_/   \\_\\_|  \\___||_| |_|
    `;
  }
  if (t === 'KDE') {
    return `
 _  ______  _____ 
| |/ /  _ \\| ____|
| ' /| | | |  _|  
| . \\| |_| | |___ 
|_|\\_\\____/|_____|
    `;
  }
  if (t === 'LINUX') {
    return `
 _     ___ _   _ _   ___  __
| |   |_ _| \\ | | | | \\ \\/ /
| |    | ||  \\| | | | |\\  / 
| |___ | || |\\  | |_| |/  \\ 
|_____|___|_| \\_|\\___//_/\\_\\
    `;
  }
  return `
 _   _ _____ _     _     ___  
| | | | ____| |   | |   / _ \\ 
| |_| |  _| | |   | |  | | | |
|  _  | |___| |___| |__| |_| |
|_| |_|_____|_____|_____\\___/ 
  :: ${t} ::
`;
};

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

// Matrix Digital Rain Component — authentic continuous cmatrix digital rain
const MatrixRain = React.memo(({ onExit }) => {
  const canvasRef = useRef(null);
  const onExitRef = useRef(onExit);
  onExitRef.current = onExit;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const parent = canvas.parentElement;
    if (!parent) return;

    const ctx = canvas.getContext('2d');
    const fontSize = 16;

    const width = (canvas.width = parent.clientWidth || 800);
    const height = (canvas.height = parent.clientHeight || 500);

    const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz@#$%&*<>~;:|+-=';
    const columns = Math.floor(width / fontSize);
    const totalRows = Math.floor(height / fontSize);

    // Initialize all columns starting from the top ceiling
    const drops = Array.from({ length: columns }, () => -Math.floor(Math.random() * 8));
    // Asynchronous column speeds (frames per row advance) to break synchronization
    const speeds = Array.from({ length: columns }, () => Math.floor(Math.random() * 2) + 1);
    const counters = Array.from({ length: columns }, () => 0);

    // Fill initial black screen
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, width, height);

    let animId;
    let lastTime = 0;

    const draw = (time) => {
      animId = requestAnimationFrame(draw);
      if (time - lastTime < 33) return; // 30 FPS classic cmatrix pace
      lastTime = time;

      // Translucent black overlay creates the authentic fading green trail
      ctx.fillStyle = 'rgba(0, 0, 0, 0.07)';
      ctx.fillRect(0, 0, width, height);

      ctx.font = `bold ${fontSize}px monospace`;

      for (let i = 0; i < columns; i++) {
        const row = drops[i];
        const x = i * fontSize;
        const y = row * fontSize;

        if (row >= 0 && y <= height + fontSize) {
          // Leading white head character with green bloom
          const headChar = chars[Math.floor(Math.random() * chars.length)];
          ctx.fillStyle = '#ffffff';
          ctx.shadowColor = '#00ff41';
          ctx.shadowBlur = 8;
          ctx.fillText(headChar, x, y);
          ctx.shadowBlur = 0;

          // Trailing green character
          if (row > 0) {
            const bodyChar = chars[Math.floor(Math.random() * chars.length)];
            ctx.fillStyle = '#00ff41';
            ctx.fillText(bodyChar, x, y - fontSize);
          }
        }

        // Asynchronous frame advance per column
        counters[i]++;
        if (counters[i] >= speeds[i]) {
          counters[i] = 0;
          if (y > height) {
            // Re-enter with dynamic randomized negative offset and new speed for zero periodicity
            drops[i] = -Math.floor(Math.random() * 6);
            speeds[i] = Math.floor(Math.random() * 2) + 1;
          } else {
            drops[i]++;
          }
        }
      }
    };

    animId = requestAnimationFrame(draw);

    const handleKey = (e) => {
      if (e.key === 'q' || e.key === 'Escape' || (e.ctrlKey && e.key === 'c')) {
        e.preventDefault();
        e.stopPropagation();
        if (onExitRef.current) {
          onExitRef.current();
        }
      }
    };
    window.addEventListener('keydown', handleKey, true);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('keydown', handleKey, true);
    };
  }, []);

  const handleClick = () => {
    if (onExitRef.current) {
      onExitRef.current();
    }
  };

  return (
    <div className="cmatrix-overlay" onClick={handleClick}>
      <canvas ref={canvasRef} className="cmatrix-canvas" />
      <div className="cmatrix-hint">Press [q] or click to exit</div>
    </div>
  );
});

// Steam Locomotive Component
const SteamLocomotive = () => {
  const trainAscii = `
      (  ) (@@) ( )  (@)  ()    @@    O     @     O     @
  (@@@)
 (    )
(@@@@)

 (   )
    ====        ________                ___________
_D _|  |_______/        \\__I_I_____===__|_________|
   |(_)---  |   H\\________/ |   |        =|___ ___|
   /     |  |   H  |  |     |   |         ||_| |_||
  |      |  |   H  |__--------------------|___ ___|
  | ________|___H__/__|_____/[][]~\\_______|       |
  |/ |   |_____I_____I_____I_____I_____I_____I_____I|
__/ =| o |=-~~\\  /~~\\  /~~\\  /~~\\  /~~\\  /~~\\  /~~\\  |_____
 |/-=|___|=O=====O=====O=====O=====O=====O=====O=====O|      \\
  \\_/      \\__/  \\__/  \\__/  \\__/  \\__/  \\__/  \\__/  \\__/     \\
  `;

  return (
    <div className="sl-track">
      <div className="sl-train">{trainAscii}</div>
    </div>
  );
};

// Interactive Fullscreen HTop Component
const HTopMonitor = React.memo(({ onExit }) => {
  const [ticks, setTicks] = useState(0);
  const onExitRef = useRef(onExit);
  onExitRef.current = onExit;

  useEffect(() => {
    const timer = setInterval(() => setTicks(t => t + 1), 1000);
    const handleKey = (e) => {
      if (e.key === 'q' || e.key === 'Escape' || (e.ctrlKey && e.key === 'c')) {
        e.preventDefault();
        e.stopPropagation();
        if (onExitRef.current) onExitRef.current();
      }
    };
    window.addEventListener('keydown', handleKey, true);
    return () => {
      clearInterval(timer);
      window.removeEventListener('keydown', handleKey, true);
    };
  }, []);

  const cpuVals = [
    Math.floor(22 + Math.sin(ticks * 0.8) * 12 + 10),
    Math.floor(18 + Math.cos(ticks * 0.7) * 15 + 10),
    Math.floor(28 + Math.sin(ticks * 0.9) * 10 + 10),
    Math.floor(15 + Math.cos(ticks * 0.6) * 12 + 10),
    Math.floor(32 + Math.sin(ticks * 1.1) * 14 + 10),
    Math.floor(20 + Math.cos(ticks * 0.8) * 10 + 10),
    Math.floor(25 + Math.sin(ticks * 0.5) * 12 + 10),
    Math.floor(30 + Math.cos(ticks * 1.0) * 15 + 10)
  ];

  const renderBar = (percent) => {
    const total = 22;
    const filled = Math.round((percent / 100) * total);
    return `[${'|'.repeat(filled)}${' '.repeat(Math.max(0, total - filled))}] ${percent}%`;
  };

  const uptimeMinutes = 142 + Math.floor(ticks / 60);
  const uptimeHours = Math.floor(uptimeMinutes / 60);
  const uptimeRemMin = uptimeMinutes % 60;

  return (
    <div className="htop-container">
      {/* Top Resource Meters */}
      <div className="htop-header-grid">
        <div className="htop-col">
          {cpuVals.slice(0, 4).map((v, i) => (
            <div key={i} className="htop-meter-row">
              <span className="htop-meter-label">{i + 1}</span>
              <span className="htop-meter-bar">{renderBar(v)}</span>
            </div>
          ))}
          <div className="htop-meter-row">
            <span className="htop-meter-label" style={{ color: '#c678dd' }}>Mem</span>
            <span className="htop-meter-bar" style={{ color: '#c678dd' }}>
              [||||||||||          ] 4.38G/15.36G
            </span>
          </div>
          <div className="htop-meter-row">
            <span className="htop-meter-label" style={{ color: '#56b6c2' }}>Swp</span>
            <span className="htop-meter-bar" style={{ color: '#56b6c2' }}>
              [                    ] 0K/4.00G
            </span>
          </div>
        </div>

        <div className="htop-col">
          {cpuVals.slice(4, 8).map((v, i) => (
            <div key={i} className="htop-meter-row">
              <span className="htop-meter-label">{i + 5}</span>
              <span className="htop-meter-bar">{renderBar(v)}</span>
            </div>
          ))}
          <div className="htop-meter-row">
            <span className="htop-meter-label" style={{ color: '#e5c07b' }}>Tasks</span>
            <span style={{ color: '#d9d9de' }}>132, 428 thr; 1 running</span>
          </div>
          <div className="htop-meter-row">
            <span className="htop-meter-label" style={{ color: '#98c379' }}>Load</span>
            <span style={{ color: '#d9d9de' }}>0.34 0.28 0.31 | Uptime: {uptimeHours}h {uptimeRemMin}m</span>
          </div>
        </div>
      </div>

      {/* Process Table */}
      <div className="htop-table-wrapper">
        <table className="htop-table">
          <thead>
            <tr>
              <th>PID</th>
              <th>USER</th>
              <th>PRI</th>
              <th>NI</th>
              <th>VIRT</th>
              <th>RES</th>
              <th>SHR</th>
              <th>S</th>
              <th>CPU%</th>
              <th>MEM%</th>
              <th>TIME+</th>
              <th>Command</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>842</td>
              <td>ablag</td>
              <td>20</td>
              <td>0</td>
              <td>2.4G</td>
              <td>184M</td>
              <td>92M</td>
              <td>S</td>
              <td style={{ color: '#98c379', fontWeight: 600 }}>4.8</td>
              <td>3.8</td>
              <td>0:42.18</td>
              <td className="htop-cmd">/usr/bin/kwin_wayland --wayland-fd 7</td>
            </tr>
            <tr>
              <td>1204</td>
              <td>ablag</td>
              <td>20</td>
              <td>0</td>
              <td>4.1G</td>
              <td>420M</td>
              <td>180M</td>
              <td>S</td>
              <td style={{ color: '#98c379', fontWeight: 600 }}>3.5</td>
              <td>8.4</td>
              <td>2:14.05</td>
              <td className="htop-cmd">/usr/lib/firefox/firefox</td>
            </tr>
            <tr>
              <td>1412</td>
              <td>ablag</td>
              <td>20</td>
              <td>0</td>
              <td>840M</td>
              <td>92M</td>
              <td>45M</td>
              <td>S</td>
              <td style={{ color: '#98c379', fontWeight: 600 }}>2.1</td>
              <td>1.9</td>
              <td>0:12.33</td>
              <td className="htop-cmd">/usr/bin/kitty</td>
            </tr>
            <tr>
              <td>910</td>
              <td>ablag</td>
              <td>20</td>
              <td>0</td>
              <td>1.2G</td>
              <td>140M</td>
              <td>70M</td>
              <td>S</td>
              <td>1.4</td>
              <td>2.8</td>
              <td>0:35.12</td>
              <td className="htop-cmd">/usr/bin/plasmashell --no-respawn</td>
            </tr>
            <tr>
              <td>420</td>
              <td>root</td>
              <td>20</td>
              <td>0</td>
              <td>120M</td>
              <td>24M</td>
              <td>14M</td>
              <td>S</td>
              <td>0.6</td>
              <td>0.6</td>
              <td>0:04.11</td>
              <td className="htop-cmd">/usr/bin/pipewire</td>
            </tr>
            <tr>
              <td>425</td>
              <td>root</td>
              <td>20</td>
              <td>0</td>
              <td>110M</td>
              <td>20M</td>
              <td>12M</td>
              <td>S</td>
              <td>0.4</td>
              <td>0.5</td>
              <td>0:03.22</td>
              <td className="htop-cmd">/usr/bin/wireplumber</td>
            </tr>
            <tr>
              <td>612</td>
              <td>dbus</td>
              <td>20</td>
              <td>0</td>
              <td>45M</td>
              <td>8M</td>
              <td>4M</td>
              <td>S</td>
              <td>0.2</td>
              <td>0.2</td>
              <td>0:01.88</td>
              <td className="htop-cmd">/usr/bin/dbus-daemon --system</td>
            </tr>
            <tr>
              <td>1520</td>
              <td>ablag</td>
              <td>20</td>
              <td>0</td>
              <td>18M</td>
              <td>6M</td>
              <td>3M</td>
              <td>R</td>
              <td style={{ color: '#e5c07b', fontWeight: 600 }}>0.8</td>
              <td>0.1</td>
              <td>0:00.34</td>
              <td className="htop-cmd" style={{ color: '#00ff41' }}>htop</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Bottom Function Bar */}
      <div className="htop-fbar">
        <span><span className="htop-fkey">F1</span>Help</span>
        <span><span className="htop-fkey">F2</span>Setup</span>
        <span><span className="htop-fkey">F3</span>Search</span>
        <span><span className="htop-fkey">F4</span>Filter</span>
        <span><span className="htop-fkey">F5</span>Tree</span>
        <span><span className="htop-fkey">F6</span>SortBy</span>
        <span><span className="htop-fkey">F7</span>Nice -</span>
        <span><span className="htop-fkey">F8</span>Nice +</span>
        <span><span className="htop-fkey">F9</span>Kill</span>
        <span onClick={() => onExitRef.current && onExitRef.current()} style={{ cursor: 'pointer' }}>
          <span className="htop-fkey" style={{ background: '#e06c75', color: '#fff' }}>F10</span>Quit [q]
        </span>
      </div>
    </div>
  );
});

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
  const [activeMode, setActiveMode] = useState(null); // 'cmatrix' or 'htop'

  const handleExitActiveMode = useCallback(() => {
    setActiveMode(null);
  }, []);

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
    if (activeMode) {
      setActiveMode(null);
      return;
    }
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
        candidates = availableEntries
          .filter(e => e.endsWith('/'))
          .filter(e => e.toLowerCase().startsWith(currentToken.toLowerCase()));
      } else if (mainCommand === 'firefox') {
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
          candidates = ['linux', 'mesa', 'kitty', 'hyprland', 'neovim', 'firefox', 'vlc', 'sl', 'cmatrix', 'cowsay', 'fortune']
            .filter(pkg => pkg.startsWith(currentToken.toLowerCase()));
        }
      } else {
        candidates = availableEntries.filter(e => e.toLowerCase().startsWith(currentToken.toLowerCase()));
      }
    }

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
    if (activeMode) {
      if (e.key === 'q' || e.key === 'Escape' || (e.ctrlKey && e.key === 'c')) {
        e.preventDefault();
        e.stopPropagation();
        setActiveMode(null);
      }
      return;
    }

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

    // Support piping e.g. "fortune | cowsay"
    if (trimmedCmd.includes('|')) {
      const parts = trimmedCmd.split('|').map(p => p.trim());
      if (parts[0].startsWith('fortune') && parts[1].startsWith('cowsay')) {
        const randFortune = FORTUNES[Math.floor(Math.random() * FORTUNES.length)];
        const cow = makeCow(randFortune);
        patchTab(activeTabId, {
          output: [
            ...activeOutput,
            { type: 'command', content: trimmedCmd, cwd: currentCwd },
            { type: 'output', content: cow },
            { type: 'prompt', cwd: currentCwd }
          ]
        });
        return;
      }
    }

    const parts = trimmedCmd.split(' ');
    const mainCmd = parts[0].toLowerCase();
    const args = parts.slice(1);

    let response = '';
    let newCwd = currentCwd;

    switch (mainCmd) {
      case 'help':
        response = `Available Commands:
  - help                 : Show this help message
  - clear (Ctrl+L)       : Clear the terminal screen
  - ls [dir]             : List files and directories
  - cd [dir]             : Change working directory
  - pwd                  : Print working directory
  - cat [file]           : Print file contents
  - firefox [file/url]   : Open Firefox (e.g. firefox wallpaper.png)
  - fastfetch            : Display colorful system information
  - cmatrix / matrix     : Digital rain matrix animation
  - sl                   : Steam Locomotive train animation
  - cowsay [text]        : Talking ASCII cow
  - cowthink [text]      : Thinking ASCII cow
  - fortune              : Random programming & Linux quotes
  - cbonsai / bonsai     : Grow an ASCII bonsai tree
  - htop / btop / top    : Interactive system & task monitor
  - figlet [text]        : Big ASCII banner text
  - pacman -Syu / -S     : Arch Linux package manager simulation
  - date, whoami, uname, uptime, history, echo, sudo, exit

Tip: Press [TAB] to auto-complete commands, files, and folders!`;
        break;

      case 'clear':
        patchTab(activeTabId, { output: [{ type: 'prompt', cwd: currentCwd }] });
        return;

      case 'cmatrix':
      case 'matrix':
        setActiveMode('cmatrix');
        patchTab(activeTabId, {
          output: [
            ...activeOutput,
            { type: 'command', content: trimmedCmd, cwd: currentCwd },
            { type: 'output', content: '[cmatrix - press q or click to exit]' },
            { type: 'prompt', cwd: currentCwd }
          ]
        });
        return;

      case 'sl':
        patchTab(activeTabId, {
          output: [
            ...activeOutput,
            { type: 'command', content: trimmedCmd, cwd: currentCwd },
            { type: 'sl' },
            { type: 'prompt', cwd: currentCwd }
          ]
        });
        return;

      case 'htop':
      case 'btop':
      case 'top':
        setActiveMode('htop');
        patchTab(activeTabId, {
          output: [
            ...activeOutput,
            { type: 'command', content: trimmedCmd, cwd: currentCwd },
            { type: 'output', content: '[htop - press q or click to exit]' },
            { type: 'prompt', cwd: currentCwd }
          ]
        });
        return;

      case 'cowsay':
        response = makeCow(args.join(' ') || 'Arch Linux BTW.');
        break;

      case 'cowthink':
        response = makeCow(args.join(' ') || 'Hmm... Should I try Wayland?', true);
        break;

      case 'fortune':
        response = FORTUNES[Math.floor(Math.random() * FORTUNES.length)];
        break;

      case 'cbonsai':
      case 'bonsai':
        response = getBonsaiTree();
        break;

      case 'figlet':
      case 'banner':
        response = getFiglet(args.join(' '));
        break;

      case 'pacman': {
        const flag = args[0];
        if (flag === '-Syu' || flag === '-Syyu') {
          response = `:: Synchronizing package databases...
 core                                138.4 KiB   1.8 MiB/s 00:00 [####################################] 100%
 extra                                 8.2 MiB  12.4 MiB/s 00:01 [####################################] 100%
 multilib                            142.1 KiB   2.1 MiB/s 00:00 [####################################] 100%
:: Starting full system upgrade...
 there is nothing to do (system up to date!)`;
        } else if (flag === '-S') {
          const pkg = args[1] || 'neofetch';
          response = `resolving dependencies...
looking for conflicting packages...

Packages (1) ${pkg}-latest

Total Download Size:    1.42 MiB
Total Installed Size:   4.86 MiB

:: Proceed with installation? [Y/n] Y
(1/1) checking keys in keyring                     [####################################] 100%
(1/1) loading package files                        [####################################] 100%
(1/1) installing ${pkg}                             [####################################] 100%
:: Running post-transaction hooks...
(1/1) Arming ConditionNeedsUpdate...`;
        } else {
          response = `error: no operation specified (use -h for help)`;
        }
        break;
      }

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
          const fileNode = resolveFile(target, currentCwd);
          if (fileNode && fileNode.isImage && fileNode.url) {
            if (onOpenFirefox) onOpenFirefox(fileNode.url);
            response = `[firefox] Opening image '${target}' in Firefox...`;
          } else if (fileNode && fileNode.content) {
            if (onOpenFirefox) onOpenFirefox(`data:text/plain;charset=utf-8,${encodeURIComponent(fileNode.content)}`);
            response = `[firefox] Opening '${target}' in Firefox...`;
          } else if (target.startsWith('http://') || target.startsWith('https://')) {
            if (onOpenFirefox) onOpenFirefox(target);
            response = `[firefox] Opening '${target}' in Firefox...`;
          } else if (target.includes('.')) {
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
              image: FASTFETCH_AVATAR_URL,
              user: 'ablag',
              host: 'arch',
              rows: [
                { quote: 'Running out of space? Just run\nsudo rm -fr ./*' },
                { sep: true },
                { key: 'Laptop', keyColor: '#61afef', val: 'Latitude 3420' },
                { key: 'OS', keyColor: '#1793d1', val: 'Arch BTW' },
                { key: 'Kernel', keyColor: '#c678dd', val: 'Linux 6.18.2-arch2-1' },
                { key: 'Packages', keyColor: '#56b6c2', val: '1435 (pacman), 13 (flatpak)' },
                { key: 'Display', keyColor: '#3daee9', val: '1920x1080 @ 1.5x in 14", 60 Hz [Built-in]' },
                { key: 'WM', keyColor: '#98c379', val: 'KDE Plasma (Wayland)' },
                { key: 'Terminal', keyColor: '#e5c07b', val: 'kitty 0.44.0' },
                { key: 'OS Age', keyColor: '#61afef', val: '402 days' },
                { key: 'Uptime', keyColor: '#e5c07b', val: '6 hours, 59 mins' },
                { key: 'Battery', keyColor: '#2ecc71', val: '59% [Charging, AC Connected]' },
                { sep: true },
                { key: 'User', keyColor: '#40d672', val: 'ablag@arch' },
                { sep: true },
                { key: 'CPU', keyColor: '#e06c75', val: '11th Gen Intel(R) Core(TM) i5-1135G7' },
                { key: 'GPU', keyColor: '#c678dd', val: 'Iris Xe Graphics (i915)' },
                { key: 'Memory', keyColor: '#98c379', val: '4.31 GiB / 15.36 GiB (28%)' },
                { palette: true }
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
    if (activeMode) return;
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

        {/* CMatrix Digital Rain Overlay */}
        {activeMode === 'cmatrix' && (
          <MatrixRain onExit={handleExitActiveMode} />
        )}

        {/* HTop / BTop Fullscreen Overlay */}
        {activeMode === 'htop' && (
          <HTopMonitor onExit={handleExitActiveMode} />
        )}

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
                  ) : item.type === 'sl' ? (
                    <SteamLocomotive />
                  ) : item.type === 'fastfetch' ? (
                    <div className="fastfetch-container">
                      <div className="fastfetch-image-box">
                        <img
                          src={item.image}
                          alt="Avatar"
                          className="fastfetch-avatar"
                          loading="eager"
                          decoding="async"
                          fetchPriority="high"
                        />
                      </div>
                      <div className="fastfetch-info">
                        {item.rows.map((row, idx) => (
                          row.quote ? (
                            <div key={idx} className="fastfetch-quote">{row.quote}</div>
                          ) : row.sep ? (
                            <div key={idx} className="fastfetch-sep" />
                          ) : row.palette ? (
                            <div key={idx} className="fastfetch-palette">
                              <div className="fastfetch-palette-row">
                                {['#282c34', '#e06c75', '#98c379', '#e5c07b', '#61afef', '#c678dd', '#56b6c2', '#abb2bf'].map((c, ci) => (
                                  <span key={ci} className="fastfetch-color-dot" style={{ backgroundColor: c }} />
                                ))}
                              </div>
                              <div className="fastfetch-palette-row">
                                {['#5c6370', '#be5046', '#a0db8e', '#ebcb8b', '#81a1c1', '#b48ead', '#88c0d0', '#e5e9f0'].map((c, ci) => (
                                  <span key={ci} className="fastfetch-color-dot" style={{ backgroundColor: c }} />
                                ))}
                              </div>
                            </div>
                          ) : (
                            <div key={idx} className="fastfetch-row">
                              <span className="fastfetch-key" style={row.keyColor ? { color: row.keyColor } : {}}>
                                {row.key}:
                              </span>
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
                  readOnly={!!activeMode}
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
