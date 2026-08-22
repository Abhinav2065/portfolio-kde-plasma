import React, { useCallback, useEffect, useRef, useState } from 'react'
import Draggable from 'react-draggable'
import './Settings.css'
import archLogo from '../assets/arch.png'

// Breeze-style SVG Icons
const Icons = {
  Search: () => (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
      <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
    </svg>
  ),
  Display: () => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
      <path d="M0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H8.5V14h3a.5.5 0 0 1 0 1h-7a.5.5 0 0 1 0-1h3v-2H2a2 2 0 0 1-2-2V2zm2-1a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H2z"/>
    </svg>
  ),
  Appearance: () => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
      <path d="M12.433 10.07C14.133 10.585 16 11.15 16 8a8 8 0 1 0-8 8c1.996 0 1.826-1.5 1.15-2.222-.44-.472-.614-1.02-.614-1.578 0-.879.748-1.5 1.579-1.5.345 0 .754.096 1.318.37zm-7.683-4.57a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm3-2a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm3.5 2a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zM4 9a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z"/>
    </svg>
  ),
  Power: () => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
      <path d="M2 6h10v4H2V6z"/>
      <path d="M2 4a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2H2zm10 1a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h10zm4 3a1.5 1.5 0 0 1-1.5 1.5v-3A1.5 1.5 0 0 1 16 8z"/>
    </svg>
  ),
  Network: () => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
      <path d="M15.384 6.115a.485.485 0 0 0-.047-.736A12.444 12.444 0 0 0 8 3C5.259 3 2.723 3.882.663 5.379a.485.485 0 0 0-.048.736.518.518 0 0 0 .668.05A11.448 11.448 0 0 1 8 4c2.507 0 4.827.802 6.716 2.164.205.148.49.13.668-.049z"/>
      <path d="M13.229 8.271a.482.482 0 0 0-.063-.745A9.455 9.455 0 0 0 8 6c-1.905 0-3.68.56-5.166 1.526a.48.48 0 0 0-.063.745.525.525 0 0 0 .652.065A8.46 8.46 0 0 1 8 7a8.46 8.46 0 0 1 4.577 1.336c.205.132.48.108.652-.065zm-2.183 2.183c.226-.226.185-.6-.1-.801A6.49 6.49 0 0 0 8 9c-1.06 0-2.062.25-2.946.703-.284.15-.325.575-.1.801.124.125.321.15.472.054A5.496 5.496 0 0 1 8 10c1.077 0 2.074.31 2.916.853.15.096.348.07.472-.054zm-1.895 2.128a.5.5 0 0 0-.074-.7A2.476 2.476 0 0 0 8 11.5c-.42 0-.81.103-1.155.282a.5.5 0 0 0-.074.7l.63.63a.5.5 0 0 0 .707 0l.592-.592z"/>
    </svg>
  ),
  Audio: () => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
      <path d="M11.536 14.01A8.473 8.473 0 0 0 14.026 8a8.473 8.473 0 0 0-2.49-6.01l-.708.707A7.476 7.476 0 0 1 13.025 8c0 2.071-.84 3.946-2.197 5.303l.708.707z"/>
      <path d="M10.121 12.596A6.48 6.48 0 0 0 12.025 8a6.48 6.48 0 0 0-1.904-4.596l-.707.707A5.483 5.483 0 0 1 11.025 8a5.483 5.483 0 0 1-1.61 3.89l.706.706z"/>
      <path d="M8.707 11.182A4.486 4.486 0 0 0 10.025 8a4.486 4.486 0 0 0-1.318-3.182L8 5.525A3.489 3.489 0 0 1 9.025 8 3.49 3.49 0 0 1 8 10.475l.707.707zM6.717 3.55A.5.5 0 0 1 7 4v8a.5.5 0 0 1-.812.39L3.825 10.5H1.5A.5.5 0 0 1 1 10V6a.5.5 0 0 1 .5-.5h2.325l2.363-1.89a.5.5 0 0 1 .529-.06z"/>
    </svg>
  ),
  About: () => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
      <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
      <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/>
    </svg>
  ),
  SettingsGear: () => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
      <path d="M8 4.754a3.246 3.246 0 1 0 0 6.492 3.246 3.246 0 0 0 0-6.492zM5.754 8a2.246 2.246 0 1 1 4.492 0 2.246 2.246 0 0 1-4.492 0z"/>
      <path d="M9.796 1.343c-.527-1.79-3.065-1.79-3.592 0l-.094.319a.873.873 0 0 1-1.255.52l-.292-.16c-1.64-.892-3.433.902-2.54 2.541l.159.292a.873.873 0 0 1-.52 1.255l-.319.094c-1.79.527-1.79 3.065 0 3.592l.319.094a.873.873 0 0 1 .52 1.255l-.16.292c-.892 1.64.901 3.434 2.541 2.54l.292-.159a.873.873 0 0 1 1.255.52l.094.319c.527 1.79 3.065 1.79 3.592 0l.094-.319a.873.873 0 0 1 1.255-.52l.292.16c1.64.893 3.434-.902 2.54-2.541l-.159-.292a.873.873 0 0 1 .52-1.255l.319-.094c1.79-.527 1.79-3.065 0-3.592l-.319-.094a.873.873 0 0 1-.52-1.255l.16-.292c.893-1.64-.902-3.433-2.541-2.54l-.292.159a.873.873 0 0 1-1.255-.52l-.094-.319z"/>
    </svg>
  )
};

const SECTIONS = [
  {
    category: 'Hardware',
    items: [
      { id: 'display', label: 'Display Configuration', icon: Icons.Display },
      { id: 'audio', label: 'Audio', icon: Icons.Audio },
      { id: 'power', label: 'Power Management', icon: Icons.Power }
    ]
  },
  {
    category: 'Appearance',
    items: [
      { id: 'appearance', label: 'Colors & Themes', icon: Icons.Appearance }
    ]
  },
  {
    category: 'Connectivity',
    items: [
      { id: 'network', label: 'Wi-Fi & Networking', icon: Icons.Network }
    ]
  },
  {
    category: 'System',
    items: [
      { id: 'about', label: 'About this System', icon: Icons.About }
    ]
  }
];

const THEMES = [
  { id: 'normal', name: 'Breeze Dark (Arch)', desc: 'Standard KDE Plasma dark color scheme', bg: '#232629', accent: '#3daee9' },
  { id: 'retro', name: 'Breeze Light', desc: 'Standard KDE Plasma light color scheme', bg: '#eff0f1', accent: '#3daee9' },
  { id: 'christmas', name: 'Festive Snow', desc: 'Interactive seasonal snowfall theme', bg: '#1b2a20', accent: '#d32f2f' },
  { id: 'cyberpunk', name: 'Cyberpunk Neon', desc: 'High-contrast purple & pink synthwave', bg: '#0b0716', accent: '#f72585' },
  { id: 'matrix', name: 'Matrix Console', desc: 'Terminal phosphorescent green theme', bg: '#020b05', accent: '#2ecc71' }
];

const ACCENTS = [
  { name: 'Breeze Blue', hex: '#3daee9' },
  { name: 'Arch Cyan', hex: '#1793d1' },
  { name: 'Emerald Green', hex: '#2ecc71' },
  { name: 'Ruby Red', hex: '#da4453' },
  { name: 'Plasma Purple', hex: '#9b59b6' },
  { name: 'Amber Gold', hex: '#f39c12' }
];

const Settings = ({ onClose, onMinimize, isMinimized, zIndex, isFocused, onFocus }) => {
  const nodeRef = useRef(null);
  const [activePage, setActivePage] = useState('display');
  const [pageHistory, setPageHistory] = useState(['display']);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');

  // Settings State
  const [brightness, setBrightness] = useState(() => parseInt(localStorage.getItem('desktop-brightness')) || 100);
  const [nightLight, setNightLight] = useState(() => localStorage.getItem('desktop-night-light') === 'on');
  const [activeTheme, setActiveTheme] = useState(() => localStorage.getItem('desktop-theme') || 'normal');
  const [accentColor, setAccentColor] = useState(() => localStorage.getItem('desktop-accent') || '#3daee9');
  const [resolution, setResolution] = useState('1920x1080');
  const [refreshRate, setRefreshRate] = useState('60Hz');
  const [scale, setScale] = useState('150%');
  const [orientation, setOrientation] = useState('0');
  const [powerProfile, setPowerProfile] = useState(() => localStorage.getItem('desktop-power-profile') || 'performance');
  const [wifiEnabled, setWifiEnabled] = useState(true);
  const [volume, setVolume] = useState(() => parseInt(localStorage.getItem('desktop-volume')) || 85);
  const [isMuted, setIsMuted] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);

  const toggleMaximize = () => setIsMaximized(prev => !prev);

  const navigateTo = (pageId) => {
    if (pageId === activePage) return;
    const newHist = pageHistory.slice(0, historyIndex + 1);
    newHist.push(pageId);
    setPageHistory(newHist);
    setHistoryIndex(newHist.length - 1);
    setActivePage(pageId);
  };

  const handleBack = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setActivePage(pageHistory[historyIndex - 1]);
    }
  };

  const handleForward = () => {
    if (historyIndex < pageHistory.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setActivePage(pageHistory[historyIndex + 1]);
    }
  };

  // Christmas Snow Effect
  const createSnowEffect = useCallback(() => {
    const snowContainer = document.createElement('div');
    snowContainer.id = 'snow-container';
    snowContainer.className = 'snow-container';

    for (let i = 0; i < 50; i++) {
      const snowFlake = document.createElement('div');
      snowFlake.className = 'snowflake';
      snowFlake.innerHTML = '❄';

      const size = Math.random() * 20 + 10;
      const left = Math.random() * 100;
      const animationDuration = Math.random() * 5 + 5;
      const animationDelay = Math.random() * 5;

      snowFlake.style.cssText = `
        left: ${left}%;
        font-size: ${size}px;
        animation-duration: ${animationDuration}s;
        animation-delay: ${animationDelay}s;
        opacity: ${Math.random() * 0.7 + 0.3};
      `;

      snowContainer.appendChild(snowFlake);
    }
    document.querySelector('.desktop')?.appendChild(snowContainer);
  }, []);

  const applyTheme = useCallback((theme) => {
    const desktop = document.querySelector('.desktop');
    if (!desktop) return;

    desktop.classList.remove('theme-normal', 'theme-christmas', 'theme-cyberpunk', 'theme-matrix', 'theme-retro');
    desktop.classList.add(`theme-${theme}`);

    const existingSnow = document.getElementById('snow-container');
    if (existingSnow) {
      existingSnow.remove();
    }

    if (theme === 'christmas') {
      createSnowEffect();
    }
  }, [createSnowEffect]);

  const handleSelectTheme = (themeId) => {
    setActiveTheme(themeId);
    applyTheme(themeId);
    localStorage.setItem('desktop-theme', themeId);
  };

  const handleSelectAccent = (colorHex) => {
    setAccentColor(colorHex);
    document.documentElement.style.setProperty('--plasma-accent', colorHex);
    localStorage.setItem('desktop-accent', colorHex);
  };

  const playTestSound = () => {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.12);
      gain.gain.setValueAtTime((volume / 100) * 0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.28);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.28);
    } catch {
      // Ignore audio restriction before interaction
    }
  };

  const handleCopyDetails = () => {
    const info = `Host: Dell Latitude 3420
Operating System: Arch Linux (Rolling Release x86_64)
Kernel: Linux 6.18.2-arch2-1
Window Manager: KDE Plasma
KDE Plasma Version: 6.1.4
Terminal: kitty 0.44.0
Packages: 1435 (pacman), 13 (flatpak)
Uptime: 6 hours, 59 mins
OS Age: 402 days
Battery: 59% [Charging, AC Connected]
User: ablag@arch
CPU: 11th Gen Intel(R) Core(TM) i5-1135G7 @ 2.40GHz (8 cores)
GPU: Intel(R) Iris(R) Xe Graphics (Driver: i915)
Memory: 4.31 GiB / 15.36 GiB (28%)
Display: 1920x1080 @ 1.5x in 14", 60 Hz [Built-in]`;
    navigator.clipboard?.writeText(info);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Sync brightness & night light
  useEffect(() => {
    const desktop = document.querySelector('.desktop');
    if (!desktop) return;

    const filters = [`brightness(${brightness / 100})`];
    if (nightLight) filters.push('sepia(0.5) hue-rotate(-15deg) saturate(0.9)');
    desktop.style.filter = filters.join(' ');

    localStorage.setItem('desktop-brightness', brightness);
    localStorage.setItem('desktop-night-light', nightLight ? 'on' : 'off');
  }, [brightness, nightLight]);

  useEffect(() => {
    applyTheme(activeTheme);
  }, [activeTheme, applyTheme]);

  useEffect(() => {
    document.documentElement.style.setProperty('--plasma-accent', accentColor);
  }, [accentColor]);

  // Filter sections by search query
  const filteredSections = SECTIONS.map(sec => ({
    ...sec,
    items: sec.items.filter(it =>
      it.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sec.category.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(sec => sec.items.length > 0);

  return (
    <Draggable
      bounds="parent"
      nodeRef={nodeRef}
      handle=".settings-header"
      disabled={isMaximized}
      defaultPosition={{ x: 80, y: 30 }}
    >
      <div
        ref={nodeRef}
        className={`settings-window ${isMaximized ? 'maximized' : ''} ${isMinimized ? 'minimized' : ''}`}
        onMouseDownCapture={onFocus}
        onClickCapture={onFocus}
        onMouseDown={onFocus}
        style={{ zIndex }}
      >
        {/* Title Bar */}
        <div className="settings-header">
          <div className="settings-title-group">
            <span className="settings-app-icon"><Icons.SettingsGear /></span>
            <span className="settings-title">System Settings</span>
          </div>
          <div className="settings-controls" onMouseDown={(e) => e.stopPropagation()}>
            <button type="button" className="settings-wc-btn" title="Minimize" onClick={onMinimize}>—</button>
            <button type="button" className="settings-wc-btn" title={isMaximized ? "Restore" : "Maximize"} onClick={toggleMaximize}>
              {isMaximized ? "❐" : "▢"}
            </button>
            <button type="button" className="settings-wc-btn settings-close-btn" title="Close" onClick={onClose}>✕</button>
          </div>
        </div>

        {/* Body */}
        <div className="settings-body">
          {/* Sidebar */}
          <div className="settings-sidebar">
            <div className="settings-toolbar">
              <button
                type="button"
                className="settings-nav-btn"
                onClick={handleBack}
                disabled={historyIndex === 0}
                title="Back"
              >
                ◀
              </button>
              <button
                type="button"
                className="settings-nav-btn"
                onClick={handleForward}
                disabled={historyIndex >= pageHistory.length - 1}
                title="Forward"
              >
                ▶
              </button>
              <div className="settings-search-wrapper">
                <span className="settings-search-icon"><Icons.Search /></span>
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="settings-search-input"
                />
              </div>
            </div>

            <div className="settings-nav-scroll">
              {filteredSections.map(sec => (
                <div key={sec.category}>
                  <div className="settings-section-header">{sec.category}</div>
                  {sec.items.map(item => {
                    const ItemIcon = item.icon;
                    return (
                      <div
                        key={item.id}
                        className={`settings-nav-item ${activePage === item.id ? 'active' : ''}`}
                        onClick={() => navigateTo(item.id)}
                      >
                        <span className="settings-nav-icon"><ItemIcon /></span>
                        <span>{item.label}</span>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>

          {/* Main Column */}
          <div className="settings-main-column">
            <div className="settings-main-content">
              {/* DISPLAY CONFIGURATION */}
              {activePage === 'display' && (
                <>
                  <div className="settings-page-header">
                    <span className="settings-page-icon"><Icons.Display /></span>
                    <h2 className="settings-page-title">Display Configuration</h2>
                  </div>

                  {/* KScreen Monitor Stage */}
                  <div className="kscreen-monitor-stage">
                    <div className="kscreen-screen-box">
                      <span className="kscreen-screen-tag">eDP-1 (14" Built-in)</span>
                      <span className="kscreen-screen-res">{resolution} @ {refreshRate}</span>
                    </div>
                    <div className="kscreen-stand"></div>
                  </div>

                  {/* Display Settings Group */}
                  <div className="kde-group">
                    <h3 className="kde-group-title">Display Properties</h3>
                    <div className="kde-group-body">
                      <div className="kde-form-row">
                        <div className="kde-label">
                          <span>Device</span>
                          <span className="kde-sublabel">14" Dell Latitude 3420 Embedded Display (eDP-1)</span>
                        </div>
                        <div className="kde-control">
                          <label className="kde-checkbox-label">
                            <input type="checkbox" defaultChecked className="kde-checkbox" />
                            <span>Enabled</span>
                          </label>
                        </div>
                      </div>

                      <div className="kde-form-row">
                        <div className="kde-label">
                          <span>Resolution</span>
                        </div>
                        <div className="kde-control">
                          <select
                            className="kde-select"
                            value={resolution}
                            onChange={(e) => setResolution(e.target.value)}
                          >
                            <option value="1920x1080">1920 × 1080 (16:9) [Preferred]</option>
                            <option value="2560x1440">2560 × 1440 (16:9)</option>
                            <option value="1366x768">1366 × 768 (16:9)</option>
                          </select>
                        </div>
                      </div>

                      <div className="kde-form-row">
                        <div className="kde-label">
                          <span>Refresh Rate</span>
                        </div>
                        <div className="kde-control">
                          <select
                            className="kde-select"
                            value={refreshRate}
                            onChange={(e) => setRefreshRate(e.target.value)}
                          >
                            <option value="144Hz">144.00 Hz</option>
                            <option value="60Hz">60.00 Hz</option>
                          </select>
                        </div>
                      </div>

                      <div className="kde-form-row">
                        <div className="kde-label">
                          <span>Orientation</span>
                        </div>
                        <div className="kde-control">
                          <select
                            className="kde-select"
                            value={orientation}
                            onChange={(e) => setOrientation(e.target.value)}
                          >
                            <option value="0">Standard (No rotation)</option>
                            <option value="90">90° Clockwise</option>
                            <option value="270">90° Counterclockwise</option>
                          </select>
                        </div>
                      </div>

                      <div className="kde-form-row">
                        <div className="kde-label">
                          <span>Scale</span>
                        </div>
                        <div className="kde-control">
                          <select
                            className="kde-select"
                            value={scale}
                            onChange={(e) => setScale(e.target.value)}
                          >
                            <option value="100%">100% (1.0x)</option>
                            <option value="125%">125% (1.25x)</option>
                            <option value="150%">150% (1.5x)</option>
                          </select>
                        </div>
                      </div>

                      <div className="kde-form-row">
                        <div className="kde-label">
                          <span>Brightness</span>
                        </div>
                        <div className="kde-control">
                          <div className="kde-slider-container">
                            <input
                              type="range"
                              min="20"
                              max="150"
                              value={brightness}
                              onChange={(e) => setBrightness(parseInt(e.target.value))}
                              className="kde-slider"
                            />
                            <span className="kde-badge">{brightness}%</span>
                          </div>
                        </div>
                      </div>

                      <div className="kde-form-row">
                        <div className="kde-label">
                          <span>Night Light</span>
                          <span className="kde-sublabel">Tint screen colors towards warm sepia spectrum at night</span>
                        </div>
                        <div className="kde-control">
                          <label className="kde-checkbox-label">
                            <input
                              type="checkbox"
                              checked={nightLight}
                              onChange={(e) => setNightLight(e.target.checked)}
                              className="kde-checkbox"
                            />
                            <span>{nightLight ? 'Active (Warm 4500K)' : 'Disabled'}</span>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* APPEARANCE & THEMES */}
              {activePage === 'appearance' && (
                <>
                  <div className="settings-page-header">
                    <span className="settings-page-icon"><Icons.Appearance /></span>
                    <h2 className="settings-page-title">Colors & Global Themes</h2>
                  </div>

                  <div className="kde-group">
                    <h3 className="kde-group-title">Global Themes</h3>
                    <div className="kde-group-body">
                      <div className="kde-theme-grid">
                        {THEMES.map(t => (
                          <div
                            key={t.id}
                            className={`kde-theme-card ${activeTheme === t.id ? 'active' : ''}`}
                            onClick={() => handleSelectTheme(t.id)}
                          >
                            <div className="kde-theme-mockup" style={{ backgroundColor: t.bg }}>
                              <div className="kde-mockup-bar">
                                <div className="kde-mockup-dot"></div>
                                <div className="kde-mockup-dot"></div>
                                <div className="kde-mockup-dot" style={{ backgroundColor: t.accent }}></div>
                              </div>
                              <div className="kde-mockup-body">
                                <span style={{ color: t.accent }}>●</span>
                              </div>
                            </div>
                            <div className="kde-theme-meta">
                              <span className="kde-theme-name">{t.name}</span>
                              <span className="kde-theme-desc">{t.desc}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="kde-group">
                    <h3 className="kde-group-title">Accent Color</h3>
                    <div className="kde-group-body">
                      <div className="kde-form-row">
                        <div className="kde-label">
                          <span>System Accent</span>
                          <span className="kde-sublabel">Used for active highlights, focus borders, and indicators</span>
                        </div>
                        <div className="kde-control">
                          <div className="kde-accent-palette">
                            {ACCENTS.map(acc => (
                              <div
                                key={acc.hex}
                                className={`kde-accent-circle ${accentColor === acc.hex ? 'active' : ''}`}
                                style={{ backgroundColor: acc.hex }}
                                onClick={() => handleSelectAccent(acc.hex)}
                                title={acc.name}
                              >
                                {accentColor === acc.hex && '✓'}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* POWER MANAGEMENT */}
              {activePage === 'power' && (
                <>
                  <div className="settings-page-header">
                    <span className="settings-page-icon"><Icons.Power /></span>
                    <h2 className="settings-page-title">Power Management</h2>
                  </div>

                  <div className="kde-group">
                    <h3 className="kde-group-title">Energy Saving Profiles</h3>
                    <div className="kde-group-body">
                      <div className="kde-form-row">
                        <div className="kde-label">
                          <span>Power Profile</span>
                          <span className="kde-sublabel">Regulate CPU scheduler and governor energy profiles</span>
                        </div>
                        <div className="kde-control">
                          <select
                            className="kde-select"
                            value={powerProfile}
                            onChange={(e) => {
                              setPowerProfile(e.target.value);
                              localStorage.setItem('desktop-power-profile', e.target.value);
                            }}
                          >
                            <option value="performance">Performance (Maximum throughput)</option>
                            <option value="balanced">Balanced (Recommended)</option>
                            <option value="powersave">Power-Saver (Maximum endurance)</option>
                          </select>
                        </div>
                      </div>

                      <div className="kde-form-row">
                        <div className="kde-label">
                          <span>Turn off screen after</span>
                        </div>
                        <div className="kde-control">
                          <select className="kde-select" defaultValue="10min">
                            <option value="5min">5 minutes</option>
                            <option value="10min">10 minutes</option>
                            <option value="30min">30 minutes</option>
                            <option value="never">Never</option>
                          </select>
                        </div>
                      </div>

                      <div className="kde-form-row">
                        <div className="kde-label">
                          <span>Suspend session after</span>
                        </div>
                        <div className="kde-control">
                          <select className="kde-select" defaultValue="15min">
                            <option value="15min">15 minutes</option>
                            <option value="30min">30 minutes</option>
                            <option value="1hr">1 hour</option>
                            <option value="never">Never</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="kde-group">
                    <h3 className="kde-group-title">Battery & Power Status</h3>
                    <div className="kde-group-body">
                      <div className="kde-spec-list">
                        <div className="kde-spec-row">
                          <span className="kde-spec-key">State</span>
                          <span className="kde-spec-val" style={{ color: '#2ecc71' }}>⚡ 59% [Charging, AC Connected]</span>
                        </div>
                        <div className="kde-spec-row">
                          <span className="kde-spec-key">Power Source</span>
                          <span className="kde-spec-val">Dell 65W Type-C AC Adapter</span>
                        </div>
                        <div className="kde-spec-row">
                          <span className="kde-spec-key">System Memory</span>
                          <span className="kde-spec-val">4.31 GiB / 15.36 GiB (28% Active)</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* WI-FI & NETWORKING */}
              {activePage === 'network' && (
                <>
                  <div className="settings-page-header">
                    <span className="settings-page-icon"><Icons.Network /></span>
                    <h2 className="settings-page-title">Wi-Fi & Networking</h2>
                  </div>

                  <div className="kde-group">
                    <h3 className="kde-group-title">Wireless Adapter (wlan0)</h3>
                    <div className="kde-group-body">
                      <div className="kde-form-row">
                        <div className="kde-label">
                          <span>Enable Wi-Fi</span>
                          <span className="kde-sublabel">Intel Wi-Fi 6E AX211 160MHz</span>
                        </div>
                        <div className="kde-control">
                          <label className="kde-checkbox-label">
                            <input
                              type="checkbox"
                              checked={wifiEnabled}
                              onChange={(e) => setWifiEnabled(e.target.checked)}
                              className="kde-checkbox"
                            />
                            <span>{wifiEnabled ? 'Connected' : 'Disabled'}</span>
                          </label>
                        </div>
                      </div>

                      {wifiEnabled && (
                        <div className="kde-spec-list">
                          <div className="kde-spec-row">
                            <span className="kde-spec-key">Access Point</span>
                            <span className="kde-spec-val">Arch-5GHz-Home</span>
                          </div>
                          <div className="kde-spec-row">
                            <span className="kde-spec-key">IPv4 Address</span>
                            <span className="kde-spec-val">192.168.1.104/24</span>
                          </div>
                          <div className="kde-spec-row">
                            <span className="kde-spec-key">Default Gateway</span>
                            <span className="kde-spec-val">192.168.1.1</span>
                          </div>
                          <div className="kde-spec-row">
                            <span className="kde-spec-key">DNS Servers</span>
                            <span className="kde-spec-val">1.1.1.1, 1.0.0.1</span>
                          </div>
                          <div className="kde-spec-row">
                            <span className="kde-spec-key">Signal Strength</span>
                            <span className="kde-spec-val">-48 dBm (96%)</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}

              {/* AUDIO */}
              {activePage === 'audio' && (
                <>
                  <div className="settings-page-header">
                    <span className="settings-page-icon"><Icons.Audio /></span>
                    <h2 className="settings-page-title">Audio Volume & Devices</h2>
                  </div>

                  <div className="kde-group">
                    <h3 className="kde-group-title">Playback Devices</h3>
                    <div className="kde-group-body">
                      <div className="kde-form-row">
                        <div className="kde-label">
                          <span>Output Device</span>
                          <span className="kde-sublabel">PipeWire PulseAudio Sound Server</span>
                        </div>
                        <div className="kde-control">
                          <select className="kde-select">
                            <option>Realtek ALC294 (Built-in Speakers)</option>
                            <option>DisplayPort / HDMI Audio Output</option>
                          </select>
                        </div>
                      </div>

                      <div className="kde-form-row">
                        <div className="kde-label">
                          <span>Master Output Volume</span>
                        </div>
                        <div className="kde-control">
                          <div className="kde-slider-container">
                            <button
                              type="button"
                              className="kde-btn"
                              style={{ padding: '3px 8px' }}
                              onClick={() => setIsMuted(!isMuted)}
                            >
                              {isMuted ? '🔇' : '🔊'}
                            </button>
                            <input
                              type="range"
                              min="0"
                              max="100"
                              disabled={isMuted}
                              value={volume}
                              onChange={(e) => {
                                setVolume(parseInt(e.target.value));
                                localStorage.setItem('desktop-volume', e.target.value);
                              }}
                              className="kde-slider"
                            />
                            <span className="kde-badge">{isMuted ? 'Muted' : `${volume}%`}</span>
                          </div>
                        </div>
                      </div>

                      <div className="kde-form-row">
                        <div className="kde-label">
                          <span>Speaker Test</span>
                          <span className="kde-sublabel">Play notification sound tone</span>
                        </div>
                        <div className="kde-control">
                          <button type="button" className="kde-btn" onClick={playTestSound}>
                            ▶ Test Sound
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* ABOUT THIS SYSTEM */}
              {activePage === 'about' && (
                <>
                  <div className="settings-page-header">
                    <span className="settings-page-icon"><Icons.About /></span>
                    <h2 className="settings-page-title">About this System</h2>
                  </div>

                  <div className="kcm-infocenter-hero">
                    <img src={archLogo} alt="Arch Linux" className="kcm-distro-logo" />
                    <div>
                      <h3 className="kcm-distro-title">Arch Linux (x86_64)</h3>
                      <p className="kcm-distro-sub">Kernel 6.18.2-arch2-1 • KDE Plasma (Wayland)</p>
                    </div>
                  </div>

                  <div className="kde-group">
                    <h3 className="kde-group-title">Software Specifications</h3>
                    <div className="kde-group-body">
                      <div className="kde-spec-list">
                        <div className="kde-spec-row">
                          <span className="kde-spec-key">Operating System</span>
                          <span className="kde-spec-val">Arch Linux (Rolling Release)</span>
                        </div>
                        <div className="kde-spec-row">
                          <span className="kde-spec-key">Kernel Version</span>
                          <span className="kde-spec-val">Linux 6.18.2-arch2-1</span>
                        </div>
                        <div className="kde-spec-row">
                          <span className="kde-spec-key">Window Manager</span>
                          <span className="kde-spec-val">KDE Plasma</span>
                        </div>
                        <div className="kde-spec-row">
                          <span className="kde-spec-key">Desktop Environment</span>
                          <span className="kde-spec-val">KDE Plasma 6.1.4</span>
                        </div>
                        <div className="kde-spec-row">
                          <span className="kde-spec-key">Terminal</span>
                          <span className="kde-spec-val">kitty 0.44.0</span>
                        </div>
                        <div className="kde-spec-row">
                          <span className="kde-spec-key">Packages</span>
                          <span className="kde-spec-val">1435 (pacman), 13 (flatpak)</span>
                        </div>
                        <div className="kde-spec-row">
                          <span className="kde-spec-key">System Uptime</span>
                          <span className="kde-spec-val">6 hours, 59 mins (OS Age: 402 days)</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="kde-group">
                    <h3 className="kde-group-title">Hardware Specifications</h3>
                    <div className="kde-group-body">
                      <div className="kde-spec-list">
                        <div className="kde-spec-row">
                          <span className="kde-spec-key">Product / Host</span>
                          <span className="kde-spec-val">Dell Latitude 3420</span>
                        </div>
                        <div className="kde-spec-row">
                          <span className="kde-spec-key">Processors</span>
                          <span className="kde-spec-val">11th Gen Intel® Core™ i5-1135G7 (8) @ 2.40 GHz</span>
                        </div>
                        <div className="kde-spec-row">
                          <span className="kde-spec-key">Memory</span>
                          <span className="kde-spec-val">4.31 GiB / 15.36 GiB (28% used)</span>
                        </div>
                        <div className="kde-spec-row">
                          <span className="kde-spec-key">Graphics Processor</span>
                          <span className="kde-spec-val">Intel® Iris® Xe Graphics</span>
                        </div>
                        <div className="kde-spec-row">
                          <span className="kde-spec-key">GPU Driver</span>
                          <span className="kde-spec-val">i915 (Mesa)</span>
                        </div>
                        <div className="kde-spec-row">
                          <span className="kde-spec-key">Display</span>
                          <span className="kde-spec-val">14" 1920×1080 @ 1.5x, 60 Hz [Built-in]</span>
                        </div>
                        <div className="kde-spec-row">
                          <span className="kde-spec-key">User</span>
                          <span className="kde-spec-val">ablag@arch</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Bottom KDE Action Bar */}
            <div className="settings-bottom-bar">
              <div className="settings-bottom-left">
                {activePage === 'about' && (
                  <button type="button" className="kde-btn" onClick={handleCopyDetails}>
                    {copied ? '✓ Copied Details!' : 'Copy to Clipboard'}
                  </button>
                )}
                <button
                  type="button"
                  className="kde-btn"
                  onClick={() => {
                    setBrightness(100);
                    setNightLight(false);
                    setActiveTheme('normal');
                    setAccentColor('#3daee9');
                    applyTheme('normal');
                  }}
                >
                  Defaults
                </button>
              </div>
              <div className="settings-bottom-right">
                <button
                  type="button"
                  className="kde-btn"
                  onClick={() => {
                    setBrightness(parseInt(localStorage.getItem('desktop-brightness')) || 100);
                    setNightLight(localStorage.getItem('desktop-night-light') === 'on');
                  }}
                >
                  Reset
                </button>
                <button
                  type="button"
                  className="kde-btn kde-btn-primary"
                  onClick={() => {
                    localStorage.setItem('desktop-brightness', brightness);
                    localStorage.setItem('desktop-night-light', nightLight ? 'on' : 'off');
                    localStorage.setItem('desktop-theme', activeTheme);
                    localStorage.setItem('desktop-accent', accentColor);
                  }}
                >
                  Apply
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Draggable>
  );
};

export default Settings;