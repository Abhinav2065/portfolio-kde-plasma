import React, { useRef, useState, useMemo } from 'react';
import Draggable from 'react-draggable';
import dolphinIcon from '../assets/dolphin.svg';
import './Dolphin.css';

// Rich Virtual Filesystem definition
const VFS = {
  '/': {
    type: 'dir',
    name: 'Root',
    children: ['home', 'etc', 'usr', 'var', 'tmp']
  },
  '/home': {
    type: 'dir',
    name: 'home',
    children: ['ablag']
  },
  '/home/ablag': {
    type: 'dir',
    name: 'ablag',
    children: ['Desktop', 'Documents', 'Downloads', 'Projects', 'Pictures', 'Music']
  },
  '/home/ablag/Desktop': {
    type: 'dir',
    name: 'Desktop',
    children: ['about.txt', 'skills.txt', 'projects.txt', 'contact.txt']
  },
  '/home/ablag/Documents': {
    type: 'dir',
    name: 'Documents',
    children: ['resume.pdf', 'robotics_design_notes.md', 'pid_tuning_guide.txt']
  },
  '/home/ablag/Downloads': {
    type: 'dir',
    name: 'Downloads',
    children: ['archlinux-2026.iso', 'neovim-linux64.tar.gz', 'hyprland-dotfiles.zip']
  },
  '/home/ablag/Projects': {
    type: 'dir',
    name: 'Projects',
    children: [
      'portfolio-kde-plasma',
      'mazeSolving-dijkstraVsAStar',
      'PikaOverlay',
      'gravity-simulation-js',
      'OpenGL-Starter-Template',
      'voidstep-mod'
    ]
  },
  '/home/ablag/Projects/portfolio-kde-plasma': {
    type: 'dir',
    name: 'portfolio-kde-plasma',
    children: ['package.json', 'README.md', 'src', 'public', 'vite.config.js']
  },
  '/home/ablag/Projects/portfolio-kde-plasma/src': {
    type: 'dir',
    name: 'src',
    children: ['App.jsx', 'main.jsx', 'Desktop', 'DesktopFeatures', 'terminal']
  },
  '/home/ablag/Projects/mazeSolving-dijkstraVsAStar': {
    type: 'dir',
    name: 'mazeSolving-dijkstraVsAStar',
    children: ['main.cpp', 'dijkstra.cpp', 'astar.cpp', 'visualizer.h', 'Makefile']
  },
  '/home/ablag/Projects/PikaOverlay': {
    type: 'dir',
    name: 'PikaOverlay',
    children: ['overlay.py', 'tracker.py', 'stats.json', 'requirements.txt']
  },
  '/home/ablag/Projects/gravity-simulation-js': {
    type: 'dir',
    name: 'gravity-simulation-js',
    children: ['index.html', 'physics.js', 'canvas.js', 'style.css']
  },
  '/home/ablag/Projects/OpenGL-Starter-Template': {
    type: 'dir',
    name: 'OpenGL-Starter-Template',
    children: ['glad.c', 'shader.h', 'shader.cpp', 'main.cpp', 'CMakeLists.txt']
  },
  '/home/ablag/Projects/voidstep-mod': {
    type: 'dir',
    name: 'voidstep-mod',
    children: ['build.gradle', 'mod.json', 'src', 'README.md']
  },
  '/home/ablag/Pictures': {
    type: 'dir',
    name: 'Pictures',
    children: ['wallpaper-arch.png', 'profile-avatar.png', 'rice_showcase.png']
  },
  '/home/ablag/Music': {
    type: 'dir',
    name: 'Music',
    children: ['synthwave-coding.flac', 'lofi-beats-to-relax.mp3', 'cyberpunk-ambient.wav']
  },
  '/etc': {
    type: 'dir',
    name: 'etc',
    children: ['hostname', 'os-release', 'pacman.conf', 'fstab']
  },
  '/usr': {
    type: 'dir',
    name: 'usr',
    children: ['bin', 'share', 'lib']
  },
  '/usr/bin': {
    type: 'dir',
    name: 'bin',
    children: ['dolphin', 'hyprland', 'alacritty', 'firefox', 'htop', 'neofetch', 'cmatrix', 'gcc', 'git']
  },
  '/var': {
    type: 'dir',
    name: 'var',
    children: ['log', 'cache', 'tmp']
  },
  '/var/log': {
    type: 'dir',
    name: 'log',
    children: ['pacman.log', 'systemd.log', 'boot.log']
  },
  '/tmp': {
    type: 'dir',
    name: 'tmp',
    children: ['session.lock', 'wayland-0']
  },

  // File nodes with metadata and contents
  '/home/ablag/Desktop/about.txt': {
    type: 'file',
    size: '1.4 KiB',
    date: 'Aug 23, 2026',
    fileType: 'Plain Text',
    content: `Abhinav Siluwal (Abhinav2065)
17 y/o STEM enthusiast & developer.
Specializing in Embedded C/C++, Robotics, Web Development, and Linux (Arch/Hyprland).
Passionate about physics simulations, autonomous control systems, and modern UI engineering.`
  },
  '/home/ablag/Desktop/skills.txt': {
    type: 'file',
    size: '1.8 KiB',
    date: 'Aug 23, 2026',
    fileType: 'Plain Text',
    content: `[LANGUAGES]
• C / C++ (Algorithms, Embedded, OpenGL)
• Python (Data tools, Automation, PyGame)
• JavaScript / TypeScript (React, Three.js, Node)
• HTML5 / CSS3 (KDE Plasma Themes, Responsive Design)
• Shell / Bash (Arch Linux, Hyprland, System Automation)

[FRAMEWORKS & TOOLS]
• React.js, Vite, TailwindCSS
• Git / GitHub, CMake, Make
• Linux Kernel, systemd, Wayland, Qt/KDE`
  },
  '/home/ablag/Desktop/projects.txt': {
    type: 'file',
    size: '2.1 KiB',
    date: 'Aug 23, 2026',
    fileType: 'Plain Text',
    content: `1. portfolio-kde-plasma
   KDE Plasma 6 themed interactive web OS portfolio.
2. mazeSolving-dijkstraVsAStar
   Real-time comparison and benchmark visualizer for pathfinding algorithms.
3. PikaOverlay
   Desktop game overlay for live Bedwars statistics tracking.
4. gravity-simulation-js
   Newtonian multi-body gravitational physics simulation.
5. OpenGL-Starter-Template
   Clean modern C++ template with GLAD & GLFW shaders.`
  },
  '/home/ablag/Desktop/contact.txt': {
    type: 'file',
    size: '480 B',
    date: 'Aug 23, 2026',
    fileType: 'Plain Text',
    content: `Email: abhinavsl@proton.me
GitHub: https://github.com/Abhinav2065
LinkedIn: https://linkedin.com/in/abhinavsl/
Location: Kathmandu, Nepal`
  },
  '/home/ablag/Documents/resume.pdf': {
    type: 'file',
    size: '184 KiB',
    date: 'Aug 20, 2026',
    fileType: 'PDF Document',
    content: 'Resume - Abhinav Siluwal (STEM / Software Developer)'
  },
  '/home/ablag/Documents/robotics_design_notes.md': {
    type: 'file',
    size: '4.2 KiB',
    date: 'Aug 18, 2026',
    fileType: 'Markdown',
    content: '# Rocker-Bogie Suspension & Two-Wheeled Inverted Pendulum Notes\n- PID loop rate: 200 Hz\n- MPU6050 complementary filter alpha = 0.98\n- High-torque planetary DC gearmotors'
  },
  '/home/ablag/Documents/pid_tuning_guide.txt': {
    type: 'file',
    size: '2.6 KiB',
    date: 'Aug 12, 2026',
    fileType: 'Plain Text',
    content: 'Tuning Ziegler-Nichols PID parameters for balance robot stability: Kp=18.5, Ki=0.4, Kd=1.2.'
  },
  '/home/ablag/Downloads/archlinux-2026.iso': {
    type: 'file',
    size: '864.0 MiB',
    date: 'Aug 10, 2026',
    fileType: 'ISO Disk Image'
  },
  '/home/ablag/Downloads/neovim-linux64.tar.gz': {
    type: 'file',
    size: '34.5 MiB',
    date: 'Aug 04, 2026',
    fileType: 'Gzip Archive'
  },
  '/home/ablag/Downloads/hyprland-dotfiles.zip': {
    type: 'file',
    size: '1.4 MiB',
    date: 'Jul 29, 2026',
    fileType: 'Zip Archive'
  },
  '/home/ablag/Projects/portfolio-kde-plasma/package.json': {
    type: 'file',
    size: '1.1 KiB',
    date: 'Aug 23, 2026',
    fileType: 'JSON',
    content: '{\n  "name": "portfolio-linux",\n  "version": "1.0.0",\n  "private": true,\n  "dependencies": {\n    "react": "^19.0.0",\n    "react-draggable": "^4.4.6"\n  }\n}'
  },
  '/home/ablag/Projects/portfolio-kde-plasma/README.md': {
    type: 'file',
    size: '2.8 KiB',
    date: 'Aug 23, 2026',
    fileType: 'Markdown',
    content: '# KDE Plasma 6 Desktop Portfolio\nBuilt with React, Vite, CSS Glassmorphism, and Linux terminal emulator.'
  },
  '/etc/hostname': {
    type: 'file',
    size: '10 B',
    date: 'Jan 01, 2026',
    fileType: 'Plain Text',
    content: 'archlinux'
  },
  '/etc/os-release': {
    type: 'file',
    size: '340 B',
    date: 'Jan 01, 2026',
    fileType: 'Plain Text',
    content: 'NAME="Arch Linux"\nPRETTY_NAME="Arch Linux"\nID=arch\nBUILD_ID=rolling\nANSI_COLOR="38;2;23;147;209"\nHOME_URL="https://archlinux.org/"'
  }
};

const getIconForFile = (name, type) => {
  if (type === 'dir') return '📁';
  const ext = name.split('.').pop().toLowerCase();
  switch (ext) {
    case 'txt':
    case 'md':
      return '📄';
    case 'pdf':
      return '📕';
    case 'png':
    case 'jpg':
    case 'jpeg':
    case 'svg':
      return '🖼️';
    case 'iso':
    case 'zip':
    case 'gz':
    case 'tar':
      return '📦';
    case 'js':
    case 'jsx':
    case 'ts':
    case 'tsx':
    case 'cpp':
    case 'h':
    case 'py':
    case 'c':
      return '📜';
    case 'json':
      return '🔧';
    case 'flac':
    case 'mp3':
    case 'wav':
      return '🎵';
    default:
      return '📄';
  }
};

const Dolphin = ({ onClose, onMinimize, isMinimized, zIndex, isFocused, onFocus, onOpenFileInNotepad }) => {
  const [currentPath, setCurrentPath] = useState('/home/ablag');
  const [history, setHistory] = useState(['/home/ablag']);
  const [historyIdx, setHistoryIdx] = useState(0);
  const [viewMode, setViewMode] = useState('icons'); // 'icons' | 'details'
  const [searchFilter, setSearchFilter] = useState('');
  const [isEditingPath, setIsEditingPath] = useState(false);
  const [pathInputText, setPathInputText] = useState('/home/ablag');
  const [selectedItem, setSelectedItem] = useState(null);
  const [isMaximized, setIsMaximized] = useState(false);

  const nodeRef = useRef(null);

  // Navigate to a new directory path
  const navigateTo = (path) => {
    if (!VFS[path] || VFS[path].type !== 'dir') return;
    const newHist = history.slice(0, historyIdx + 1);
    newHist.push(path);
    setHistory(newHist);
    setHistoryIdx(newHist.length - 1);
    setCurrentPath(path);
    setPathInputText(path);
    setSelectedItem(null);
    setIsEditingPath(false);
  };

  const handleBack = () => {
    if (historyIdx > 0) {
      const prev = history[historyIdx - 1];
      setHistoryIdx(historyIdx - 1);
      setCurrentPath(prev);
      setPathInputText(prev);
      setSelectedItem(null);
    }
  };

  const handleForward = () => {
    if (historyIdx < history.length - 1) {
      const next = history[historyIdx + 1];
      setHistoryIdx(historyIdx + 1);
      setCurrentPath(next);
      setPathInputText(next);
      setSelectedItem(null);
    }
  };

  const handleUp = () => {
    if (currentPath === '/') return;
    const parts = currentPath.split('/').filter(Boolean);
    parts.pop();
    const parentPath = '/' + parts.join('/');
    navigateTo(parentPath);
  };

  const handlePathInputSubmit = (e) => {
    e.preventDefault();
    let cleaned = pathInputText.trim();
    if (!cleaned.startsWith('/')) cleaned = '/' + cleaned;
    if (VFS[cleaned] && VFS[cleaned].type === 'dir') {
      navigateTo(cleaned);
    } else {
      setPathInputText(currentPath);
      setIsEditingPath(false);
    }
  };

  const currentDirNode = VFS[currentPath] || { type: 'dir', children: [] };
  const rawChildren = currentDirNode.children || [];

  const items = useMemo(() => {
    return rawChildren
      .map(name => {
        const itemPath = currentPath === '/' ? `/${name}` : `${currentPath}/${name}`;
        const node = VFS[itemPath] || { type: 'file', size: '1.0 KiB', date: 'Aug 23, 2026', fileType: 'File' };
        return {
          name,
          path: itemPath,
          type: node.type,
          size: node.size || (node.type === 'dir' ? 'Folder' : '1.0 KiB'),
          date: node.date || 'Aug 23, 2026',
          fileType: node.fileType || (node.type === 'dir' ? 'Folder' : 'File'),
          content: node.content
        };
      })
      .filter(item => {
        if (!searchFilter.trim()) return true;
        return item.name.toLowerCase().includes(searchFilter.toLowerCase());
      });
  }, [rawChildren, currentPath, searchFilter]);

  const handleItemDoubleClick = (item) => {
    if (item.type === 'dir') {
      navigateTo(item.path);
    } else if (onOpenFileInNotepad) {
      onOpenFileInNotepad({
        name: item.name,
        content: item.content || `[File: ${item.name}]\nSize: ${item.size}\nType: ${item.fileType}`
      });
    }
  };

  // Breadcrumbs
  const breadcrumbSegments = useMemo(() => {
    if (currentPath === '/') return [{ name: 'Root', path: '/' }];
    const parts = currentPath.split('/').filter(Boolean);
    const segs = [{ name: 'Root', path: '/' }];
    let acc = '';
    parts.forEach(p => {
      acc += `/${p}`;
      segs.push({ name: p === 'ablag' ? 'ablag (Home)' : p, path: acc });
    });
    return segs;
  }, [currentPath]);

  const folderCount = items.filter(i => i.type === 'dir').length;
  const fileCount = items.filter(i => i.type === 'file').length;

  return (
    <Draggable
      handle=".dolphin-titlebar"
      bounds="parent"
      nodeRef={nodeRef}
      disabled={isMaximized}
      defaultPosition={{ x: 140, y: 40 }}
    >
      <div
        ref={nodeRef}
        className={`dolphin-window ${isMinimized ? 'minimized' : ''} ${isMaximized ? 'maximized' : ''} ${isFocused ? 'focused' : ''}`}
        style={{ zIndex }}
        onMouseDown={onFocus}
      >
        {/* Titlebar */}
        <div className="dolphin-titlebar">
          <div className="dolphin-titlebar-left">
            <img src={dolphinIcon} alt="Dolphin" className="dolphin-app-icon" />
            <span className="dolphin-title-text">
              Dolphin — {currentPath === '/home/ablag' ? 'Home' : currentPath}
            </span>
          </div>

          <div className="dolphin-titlebar-controls">
            <button
              type="button"
              className="dolphin-win-btn dolphin-min-btn"
              onClick={onMinimize}
              title="Minimize"
            >
              ─
            </button>
            <button
              type="button"
              className="dolphin-win-btn dolphin-max-btn"
              onClick={() => setIsMaximized(prev => !prev)}
              title={isMaximized ? 'Restore' : 'Maximize'}
            >
              {isMaximized ? '❐' : '□'}
            </button>
            <button
              type="button"
              className="dolphin-win-btn dolphin-close-btn"
              onClick={onClose}
              title="Close"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Dolphin Toolbar */}
        <div className="dolphin-toolbar">
          <div className="dolphin-nav-actions">
            <button
              type="button"
              className="dolphin-tool-btn"
              onClick={handleBack}
              disabled={historyIdx <= 0}
              title="Back"
            >
              ◀
            </button>
            <button
              type="button"
              className="dolphin-tool-btn"
              onClick={handleForward}
              disabled={historyIdx >= history.length - 1}
              title="Forward"
            >
              ▶
            </button>
            <button
              type="button"
              className="dolphin-tool-btn"
              onClick={handleUp}
              disabled={currentPath === '/'}
              title="Up"
            >
              ▲
            </button>
            <button
              type="button"
              className="dolphin-tool-btn"
              onClick={() => navigateTo('/home/ablag')}
              title="Home"
            >
              🏠
            </button>
          </div>

          {/* Breadcrumb Path / Location Bar */}
          <div className="dolphin-path-bar">
            {isEditingPath ? (
              <form onSubmit={handlePathInputSubmit} className="dolphin-path-form">
                <input
                  type="text"
                  className="dolphin-path-input"
                  value={pathInputText}
                  onChange={(e) => setPathInputText(e.target.value)}
                  onBlur={() => setIsEditingPath(false)}
                  autoFocus
                />
              </form>
            ) : (
              <div
                className="dolphin-breadcrumbs"
                onClick={() => setIsEditingPath(true)}
                title="Click to edit path"
              >
                {breadcrumbSegments.map((seg, idx) => (
                  <React.Fragment key={seg.path}>
                    <button
                      type="button"
                      className="dolphin-crumb-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigateTo(seg.path);
                      }}
                    >
                      {seg.name}
                    </button>
                    {idx < breadcrumbSegments.length - 1 && (
                      <span className="dolphin-crumb-sep">›</span>
                    )}
                  </React.Fragment>
                ))}
              </div>
            )}
          </div>

          {/* View Toggles & Search */}
          <div className="dolphin-view-actions">
            <button
              type="button"
              className={`dolphin-tool-btn ${viewMode === 'icons' ? 'active' : ''}`}
              onClick={() => setViewMode('icons')}
              title="Icons View"
            >
              ⊞ Icons
            </button>
            <button
              type="button"
              className={`dolphin-tool-btn ${viewMode === 'details' ? 'active' : ''}`}
              onClick={() => setViewMode('details')}
              title="Details View"
            >
              ☰ Details
            </button>
            <div className="dolphin-search-box">
              <input
                type="text"
                placeholder="Filter files..."
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                className="dolphin-search-input"
              />
              {searchFilter && (
                <button
                  type="button"
                  className="dolphin-search-clear"
                  onClick={() => setSearchFilter('')}
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Main Body: Places Sidebar + File Area */}
        <div className="dolphin-body">
          {/* Places Sidebar */}
          <div className="dolphin-sidebar">
            <div className="dolphin-sidebar-section">
              <div className="dolphin-sidebar-header">Places</div>
              <div
                className={`dolphin-sidebar-item ${currentPath === '/home/ablag' ? 'active' : ''}`}
                onClick={() => navigateTo('/home/ablag')}
              >
                <span className="dolphin-sidebar-icon">🏠</span>
                <span className="dolphin-sidebar-label">Home</span>
              </div>
              <div
                className={`dolphin-sidebar-item ${currentPath === '/home/ablag/Desktop' ? 'active' : ''}`}
                onClick={() => navigateTo('/home/ablag/Desktop')}
              >
                <span className="dolphin-sidebar-icon">🖥️</span>
                <span className="dolphin-sidebar-label">Desktop</span>
              </div>
              <div
                className={`dolphin-sidebar-item ${currentPath === '/home/ablag/Documents' ? 'active' : ''}`}
                onClick={() => navigateTo('/home/ablag/Documents')}
              >
                <span className="dolphin-sidebar-icon">📄</span>
                <span className="dolphin-sidebar-label">Documents</span>
              </div>
              <div
                className={`dolphin-sidebar-item ${currentPath === '/home/ablag/Downloads' ? 'active' : ''}`}
                onClick={() => navigateTo('/home/ablag/Downloads')}
              >
                <span className="dolphin-sidebar-icon">📥</span>
                <span className="dolphin-sidebar-label">Downloads</span>
              </div>
              <div
                className={`dolphin-sidebar-item ${currentPath === '/home/ablag/Projects' ? 'active' : ''}`}
                onClick={() => navigateTo('/home/ablag/Projects')}
              >
                <span className="dolphin-sidebar-icon">💼</span>
                <span className="dolphin-sidebar-label">Projects</span>
              </div>
              <div
                className={`dolphin-sidebar-item ${currentPath === '/home/ablag/Pictures' ? 'active' : ''}`}
                onClick={() => navigateTo('/home/ablag/Pictures')}
              >
                <span className="dolphin-sidebar-icon">🖼️</span>
                <span className="dolphin-sidebar-label">Pictures</span>
              </div>
              <div
                className={`dolphin-sidebar-item ${currentPath === '/home/ablag/Music' ? 'active' : ''}`}
                onClick={() => navigateTo('/home/ablag/Music')}
              >
                <span className="dolphin-sidebar-icon">🎵</span>
                <span className="dolphin-sidebar-label">Music</span>
              </div>
              <div
                className="dolphin-sidebar-item"
                onClick={() => navigateTo('/tmp')}
              >
                <span className="dolphin-sidebar-icon">🗑️</span>
                <span className="dolphin-sidebar-label">Trash</span>
              </div>
            </div>

            <div className="dolphin-sidebar-section">
              <div className="dolphin-sidebar-header">Drives & Devices</div>
              <div
                className={`dolphin-sidebar-item ${currentPath === '/' ? 'active' : ''}`}
                onClick={() => navigateTo('/')}
              >
                <span className="dolphin-sidebar-icon">💾</span>
                <span className="dolphin-sidebar-label">Root (/)</span>
              </div>
              <div
                className={`dolphin-sidebar-item ${currentPath === '/etc' ? 'active' : ''}`}
                onClick={() => navigateTo('/etc')}
              >
                <span className="dolphin-sidebar-icon">⚙️</span>
                <span className="dolphin-sidebar-label">System Config (/etc)</span>
              </div>
            </div>
          </div>

          {/* Central File Browser View */}
          <div className="dolphin-content-area" onClick={() => setSelectedItem(null)}>
            {items.length === 0 ? (
              <div className="dolphin-empty-view">
                <span className="dolphin-empty-icon">📁</span>
                <span className="dolphin-empty-text">This folder is empty</span>
              </div>
            ) : viewMode === 'icons' ? (
              <div className="dolphin-grid-view">
                {items.map(item => {
                  const isSelected = selectedItem === item.name;
                  return (
                    <div
                      key={item.name}
                      className={`dolphin-grid-item ${isSelected ? 'selected' : ''}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedItem(item.name);
                      }}
                      onDoubleClick={() => handleItemDoubleClick(item)}
                    >
                      <span className="dolphin-grid-icon">
                        {getIconForFile(item.name, item.type)}
                      </span>
                      <span className="dolphin-grid-name" title={item.name}>
                        {item.name}
                      </span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="dolphin-details-table-wrapper">
                <table className="dolphin-details-table">
                  <thead>
                    <tr>
                      <th className="th-name">Name</th>
                      <th className="th-size">Size</th>
                      <th className="th-type">Type</th>
                      <th className="th-date">Date Modified</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map(item => {
                      const isSelected = selectedItem === item.name;
                      return (
                        <tr
                          key={item.name}
                          className={`dolphin-table-row ${isSelected ? 'selected' : ''}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedItem(item.name);
                          }}
                          onDoubleClick={() => handleItemDoubleClick(item)}
                        >
                          <td className="td-name">
                            <span className="dolphin-row-icon">
                              {getIconForFile(item.name, item.type)}
                            </span>
                            <span className="dolphin-row-name">{item.name}</span>
                          </td>
                          <td className="td-size">{item.size}</td>
                          <td className="td-type">{item.fileType}</td>
                          <td className="td-date">{item.date}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Dolphin Statusbar */}
        <div className="dolphin-statusbar">
          <div className="dolphin-status-left">
            <span>{items.length} items</span>
            {folderCount > 0 && <span>({folderCount} folders, {fileCount} files)</span>}
            {selectedItem && <span className="dolphin-selection-info">• "{selectedItem}" selected</span>}
          </div>
          <div className="dolphin-status-right">
            <span>Free space: 142.8 GiB (ext4)</span>
          </div>
        </div>
      </div>
    </Draggable>
  );
};

export default Dolphin;
