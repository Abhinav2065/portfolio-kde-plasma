import React, { useRef, useState, useEffect, useMemo } from 'react';
import Draggable from 'react-draggable';
import githubIcon from '../assets/github.svg';
import './GitHubWindow.css';

const GITHUB_PROFILE_URL = 'https://github.com/Abhinav2065';
const GITHUB_API_USER = 'https://api.github.com/users/Abhinav2065';
const GITHUB_API_REPOS = 'https://api.github.com/users/Abhinav2065/repos?sort=updated&per_page=30';
const GITHUB_CONTRIBUTIONS_API = 'https://github-contributions-api.jogruber.de/v4/Abhinav2065?y=last';

const FALLBACK_PROFILE = {
  login: 'Abhinav2065',
  name: 'Abhinav Siluwal',
  avatar_url: 'https://github.com/Abhinav2065.png',
  html_url: 'https://github.com/Abhinav2065',
  bio: '17 y/o STEM enthusiast & developer. Robotics, Embedded C/C++, Web Development, and Linux (Arch/Hyprland).',
  location: 'Kathmandu, Nepal',
  email: 'abhinavsl@proton.me',
  blog: 'https://linkedin.com/in/abhinavsl/',
  public_repos: 12,
  followers: 18,
  following: 24,
};

const PINNED_REPOS = [
  {
    id: 1,
    name: 'portfolio-kde-plasma',
    html_url: 'https://github.com/Abhinav2065/portfolio-kde-plasma',
    description: 'Kde Plasma Themed Portfolio Website Made Using React',
    language: 'JavaScript',
    stargazers_count: 12,
    forks_count: 3,
    visibility: 'Public',
    updated_at: new Date().toISOString()
  },
  {
    id: 2,
    name: 'mazeSolving-dijkstraVsAStar',
    html_url: 'https://github.com/Abhinav2065/mazeSolving-dijkstraVsAStar',
    description: 'It is a program that visualizes the difference between the major two path solving algorithm.',
    language: 'C++',
    stargazers_count: 2,
    forks_count: 0,
    visibility: 'Public',
    updated_at: '2025-11-10T10:00:00Z'
  },
  {
    id: 3,
    name: 'PikaOverlay',
    html_url: 'https://github.com/Abhinav2065/PikaOverlay',
    description: 'Pika Network Bedwars Overlay',
    language: 'Python',
    stargazers_count: 0,
    forks_count: 0,
    visibility: 'Public',
    updated_at: '2025-08-20T10:00:00Z'
  },
  {
    id: 4,
    name: 'gravity-simulation-js',
    html_url: 'https://github.com/Abhinav2065/gravity-simulation-js',
    description: 'Simulating Gravity using Javascrypt!',
    language: 'JavaScript',
    stargazers_count: 1,
    forks_count: 0,
    visibility: 'Public',
    updated_at: '2025-06-15T10:00:00Z'
  },
  {
    id: 5,
    name: 'OpenGL-Starter-Template',
    html_url: 'https://github.com/Abhinav2065/OpenGL-Starter-Template',
    description: 'A simple to use, well documented template code for starting any project on OpenGL.',
    language: 'C++',
    stargazers_count: 0,
    forks_count: 0,
    visibility: 'Public',
    updated_at: '2025-05-12T10:00:00Z'
  },
  {
    id: 6,
    name: 'voidstep-mod',
    html_url: 'https://github.com/Abhinav2065/voidstep-mod',
    description: 'A Minecraft Mod',
    language: 'Java',
    stargazers_count: 0,
    forks_count: 0,
    visibility: 'Public',
    updated_at: '2025-03-01T10:00:00Z'
  }
];

const LANGUAGE_COLORS = {
  JavaScript: '#f1e05a',
  TypeScript: '#3178c6',
  'C++': '#f34b7d',
  C: '#555555',
  Java: '#b07219',
  Python: '#3572A5',
  HTML: '#e34c26',
  CSS: '#563d7c',
  Shell: '#89e051'
};

const MONTH_LABELS = ['Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'];

const GitHubWindow = ({ onClose, onMinimize, isMinimized, zIndex, isFocused, onFocus }) => {
  const [isMaximized, setIsMaximized] = useState(false);
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'repositories' | 'stars'
  const [profile, setProfile] = useState(FALLBACK_PROFILE);
  const [repos, setRepos] = useState(PINNED_REPOS);
  const [contributionsList, setContributionsList] = useState([]);
  const [totalContributions, setTotalContributions] = useState(496);
  const [repoSearch, setRepoSearch] = useState('');
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(false);

  const nodeRef = useRef(null);

  useEffect(() => {
    let isMounted = true;
    const fetchGitHub = async () => {
      try {
        setLoading(true);
        const [userRes, reposRes, contribRes] = await Promise.all([
          fetch(GITHUB_API_USER).catch(() => null),
          fetch(GITHUB_API_REPOS).catch(() => null),
          fetch(GITHUB_CONTRIBUTIONS_API).catch(() => null)
        ]);

        if (userRes && userRes.ok) {
          const userData = await userRes.json();
          if (isMounted) setProfile(userData);
        }

        if (reposRes && reposRes.ok) {
          const reposData = await reposRes.json();
          if (isMounted && Array.isArray(reposData) && reposData.length > 0) {
            // Combine pinned with fetched repos
            const combined = [...PINNED_REPOS];
            reposData.forEach(r => {
              if (!combined.some(p => p.name.toLowerCase() === r.name.toLowerCase())) {
                combined.push(r);
              }
            });
            setRepos(combined);
          }
        }

        if (contribRes && contribRes.ok) {
          const contribData = await contribRes.json();
          if (isMounted && contribData) {
            if (Array.isArray(contribData.contributions)) {
              setContributionsList(contribData.contributions);
            }
            if (contribData.total && contribData.total.lastYear) {
              setTotalContributions(contribData.total.lastYear);
            }
          }
        }
      } catch (err) {
        console.warn('GitHub API fetch issue, using pinned/fallback data:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchGitHub();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleOpenExternal = () => {
    window.open(GITHUB_PROFILE_URL, '_blank', 'noopener,noreferrer');
  };

  const filteredRepos = useMemo(() => {
    if (!repoSearch.trim()) return repos;
    return repos.filter(r =>
      r.name.toLowerCase().includes(repoSearch.toLowerCase()) ||
      (r.description && r.description.toLowerCase().includes(repoSearch.toLowerCase())) ||
      (r.language && r.language.toLowerCase().includes(repoSearch.toLowerCase()))
    );
  }, [repos, repoSearch]);

  // Process real day-by-day contributions into 52/53 weeks of 7 days
  const processedWeeks = useMemo(() => {
    if (!contributionsList || contributionsList.length === 0) {
      // Fallback 52 weeks
      const weeks = [];
      const seed = 42;
      for (let w = 0; w < 52; w++) {
        const days = [];
        for (let d = 0; d < 7; d++) {
          const val = ((w * 7 + d * 13 + seed) % 17);
          let level = 0;
          if (val > 14) level = 4;
          else if (val > 10) level = 3;
          else if (val > 6) level = 2;
          else if (val > 3) level = 1;
          days.push({ count: level * 2, level, date: '' });
        }
        weeks.push(days);
      }
      return weeks;
    }

    const weeks = [];
    let currentWeek = [];

    contributionsList.forEach(day => {
      currentWeek.push(day);
      if (currentWeek.length === 7) {
        weeks.push(currentWeek);
        currentWeek = [];
      }
    });

    if (currentWeek.length > 0) {
      weeks.push(currentWeek);
    }

    return weeks;
  }, [contributionsList]);

  return (
    <Draggable
      handle=".github-window-header"
      bounds="parent"
      nodeRef={nodeRef}
      disabled={isMaximized}
      defaultPosition={{ x: 30, y: 15 }}
    >
      <div
        ref={nodeRef}
        className={`github-window ${isMinimized ? 'minimized' : ''} ${isMaximized ? 'maximized' : ''} ${isFocused ? 'focused' : ''}`}
        style={{ zIndex }}
        onMouseDown={onFocus}
      >
        {/* Titlebar */}
        <div className="github-window-header">
          <div className="github-header-left">
            <img src={githubIcon} alt="GitHub" className="github-header-icon" />
            <span className="github-header-title">GitHub — Abhinav2065(Ablag)</span>
          </div>

          <div className="github-window-controls">
            <button
              type="button"
              className="gh-win-btn gh-minimize-btn"
              onClick={onMinimize}
              title="Minimize"
            >
              ─
            </button>
            <button
              type="button"
              className="gh-win-btn gh-maximize-btn"
              onClick={() => setIsMaximized(prev => !prev)}
              title={isMaximized ? 'Restore' : 'Maximize'}
            >
              {isMaximized ? '❐' : '□'}
            </button>
            <button
              type="button"
              className="gh-win-btn gh-close-btn"
              onClick={onClose}
              title="Close"
            >
              ✕
            </button>
          </div>
        </div>

        {/* GitHub Top Nav Bar */}
        <div className="gh-navbar">
          <div className="gh-nav-left">
            <img src={githubIcon} alt="GitHub" className="gh-nav-logo" onClick={handleOpenExternal} title="View on GitHub.com" />
            <div className="gh-nav-search">
              <span>Type</span> <kbd>/</kbd> <span>to search</span>
            </div>
            <div className="gh-nav-links">
              <span className="gh-nav-link">Pull requests</span>
              <span className="gh-nav-link">Issues</span>
              <span className="gh-nav-link">Codespaces</span>
              <span className="gh-nav-link">Explore</span>
            </div>
          </div>

          <div className="gh-nav-right">
            <button
              type="button"
              className="gh-nav-open-external"
              onClick={handleOpenExternal}
              title="Open full page on GitHub.com"
            >
              Open on GitHub.com ↗
            </button>
            <img
              src={profile.avatar_url || 'https://github.com/Abhinav2065.png'}
              alt="Avatar"
              className="gh-nav-avatar"
            />
          </div>
        </div>

        {/* Sub-Nav Tabs */}
        <div className="gh-tabs-bar">
          <button
            type="button"
            className={`gh-tab-item ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            <span className="gh-tab-icon">📖</span> Overview
          </button>
          <button
            type="button"
            className={`gh-tab-item ${activeTab === 'repositories' ? 'active' : ''}`}
            onClick={() => setActiveTab('repositories')}
          >
            <span className="gh-tab-icon">📦</span> Repositories <span className="gh-counter">{repos.length}</span>
          </button>
          <button
            type="button"
            className={`gh-tab-item ${activeTab === 'stars' ? 'active' : ''}`}
            onClick={() => setActiveTab('stars')}
          >
            <span className="gh-tab-icon">⭐</span> Stars <span className="gh-counter">24</span>
          </button>
        </div>

        {/* Main Content Area */}
        <div className="gh-content-container">
          {/* Left Column: Profile Card */}
          <div className="gh-sidebar">
            <div className="gh-avatar-container">
              <img
                src={profile.avatar_url || 'https://github.com/Abhinav2065.png'}
                alt={profile.name || profile.login}
                className="gh-profile-avatar"
              />
            </div>

            <h1 className="gh-profile-name">Abhinav2065(Ablag)</h1>
            <span className="gh-profile-login">Abhinav2065</span>

            <button
              type="button"
              className={`gh-follow-btn ${isFollowing ? 'following' : ''}`}
              onClick={() => setIsFollowing(prev => !prev)}
            >
              {isFollowing ? '✓ Following' : 'Follow'}
            </button>

            {profile.bio && <p className="gh-profile-bio">{profile.bio}</p>}

            <div className="gh-profile-meta">
              <div className="gh-meta-item">
                <span className="gh-meta-icon">👥</span>
                <span><strong>{profile.followers || 18}</strong> followers • <strong>{profile.following || 24}</strong> following</span>
              </div>
              {profile.location && (
                <div className="gh-meta-item">
                  <span className="gh-meta-icon">📍</span>
                  <span>{profile.location}</span>
                </div>
              )}
              {profile.email && (
                <div className="gh-meta-item">
                  <span className="gh-meta-icon">✉️</span>
                  <a href={`mailto:${profile.email}`} className="gh-meta-link">{profile.email}</a>
                </div>
              )}
              {profile.blog && (
                <div className="gh-meta-item">
                  <span className="gh-meta-icon">🔗</span>
                  <a href={profile.blog} target="_blank" rel="noopener noreferrer" className="gh-meta-link">
                    LinkedIn
                  </a>
                </div>
              )}
            </div>

            <div className="gh-achievements">
              <h2 className="gh-section-heading">Achievements</h2>
              <div className="gh-achievements-badges">
                <a
                  href="https://github.com/Abhinav2065?achievement=yolo&tab=achievements"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="gh-achievement-item"
                  title="Achievement: YOLO — Merged a pull request without code review"
                >
                  <img
                    src="https://github.githubassets.com/assets/yolo-default-be0bbff04951.png"
                    alt="Achievement: YOLO"
                    className="gh-achievement-img"
                  />
                </a>
                <a
                  href="https://github.com/Abhinav2065?achievement=quickdraw&tab=achievements"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="gh-achievement-item"
                  title="Achievement: Quickdraw — Closed an issue or pull request within 5 minutes of opening"
                >
                  <img
                    src="https://github.githubassets.com/assets/quickdraw-default-39c6aec8ff89.png"
                    alt="Achievement: Quickdraw"
                    className="gh-achievement-img"
                  />
                </a>
              </div>
            </div>
          </div>

          {/* Right Column: Dynamic Tab View */}
          <div className="gh-main-column">
            {activeTab === 'overview' && (
              <>
                <div className="gh-section-header">
                  <h2 className="gh-section-heading">Pinned</h2>
                </div>

                <div className="gh-pinned-grid">
                  {PINNED_REPOS.map(repo => (
                    <div key={repo.id} className="gh-pinned-card">
                      <div className="gh-card-top">
                        <a
                          href={repo.html_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="gh-repo-title"
                        >
                          {repo.name}
                        </a>
                        <span className="gh-badge-pill">Public</span>
                      </div>
                      <p className="gh-repo-description">
                        {repo.description || 'No description provided.'}
                      </p>
                      <div className="gh-repo-meta">
                        {repo.language && (
                          <span className="gh-lang-tag">
                            <span
                              className="gh-lang-circle"
                              style={{ backgroundColor: LANGUAGE_COLORS[repo.language] || '#8b949e' }}
                            />
                            {repo.language}
                          </span>
                        )}
                        {repo.stargazers_count !== undefined && repo.stargazers_count > 0 && (
                          <span className="gh-star-count">★ {repo.stargazers_count}</span>
                        )}
                        {repo.forks_count !== undefined && repo.forks_count > 0 && (
                          <span className="gh-fork-count">⑂ {repo.forks_count}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Contribution Heatmap */}
                <div className="gh-contributions-section">
                  <div className="gh-section-header">
                    <h2 className="gh-section-heading">
                      {totalContributions} contributions in the last year
                    </h2>
                  </div>
                  <div className="gh-heatmap-card">
                    {/* Month headers */}
                    <div className="gh-heatmap-months">
                      {MONTH_LABELS.map((m, i) => (
                        <span key={i} className="gh-month-label">{m}</span>
                      ))}
                    </div>

                    <div className="gh-heatmap-body">
                      <div className="gh-heatmap-days-labels">
                        <span>Mon</span>
                        <span>Wed</span>
                        <span>Fri</span>
                      </div>

                      <div className="gh-heatmap-grid">
                        {processedWeeks.map((week, wIdx) => (
                          <div key={wIdx} className="gh-heatmap-col">
                            {week.map((day, dIdx) => (
                              <div
                                key={dIdx}
                                className={`gh-heatmap-cell level-${day.level || 0}`}
                                title={`${day.count || 0} contribution${day.count === 1 ? '' : 's'}${day.date ? ` on ${day.date}` : ''}`}
                              />
                            ))}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="gh-heatmap-footer">
                      <span>Less</span>
                      <div className="gh-heatmap-legend">
                        <div className="gh-heatmap-cell level-0" title="0 contributions" />
                        <div className="gh-heatmap-cell level-1" title="1-3 contributions" />
                        <div className="gh-heatmap-cell level-2" title="4-6 contributions" />
                        <div className="gh-heatmap-cell level-3" title="7-9 contributions" />
                        <div className="gh-heatmap-cell level-4" title="10+ contributions" />
                      </div>
                      <span>More</span>
                    </div>
                  </div>
                </div>
              </>
            )}

            {activeTab === 'repositories' && (
              <div className="gh-repos-tab-content">
                <div className="gh-repo-filter-bar">
                  <input
                    type="text"
                    className="gh-repo-search-input"
                    placeholder="Find a repository..."
                    value={repoSearch}
                    onChange={(e) => setRepoSearch(e.target.value)}
                  />
                  <span className="gh-repos-count-badge">
                    {filteredRepos.length} results
                  </span>
                </div>

                <div className="gh-full-repos-list">
                  {filteredRepos.map(repo => (
                    <div key={repo.id} className="gh-list-item">
                      <div className="gh-list-item-main">
                        <div className="gh-list-item-title-row">
                          <a
                            href={repo.html_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="gh-list-repo-name"
                          >
                            {repo.name}
                          </a>
                          <span className="gh-badge-pill">Public</span>
                        </div>
                        {repo.description && (
                          <p className="gh-list-repo-desc">{repo.description}</p>
                        )}
                        <div className="gh-repo-meta">
                          {repo.language && (
                            <span className="gh-lang-tag">
                              <span
                                className="gh-lang-circle"
                                style={{ backgroundColor: LANGUAGE_COLORS[repo.language] || '#8b949e' }}
                              />
                              {repo.language}
                            </span>
                          )}
                          {repo.stargazers_count > 0 && (
                            <span className="gh-star-count">★ {repo.stargazers_count}</span>
                          )}
                          <span className="gh-updated-time">
                            Updated on {new Date(repo.updated_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                          </span>
                        </div>
                      </div>
                      <a
                        href={repo.html_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="gh-star-action-btn"
                      >
                        ★ Star
                      </a>
                    </div>
                  ))}
                  {filteredRepos.length === 0 && (
                    <div className="gh-no-repos">No repositories matching "{repoSearch}"</div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'stars' && (
              <div className="gh-stars-tab-content">
                <h2 className="gh-section-heading">Starred Repositories</h2>
                <div className="gh-starred-list">
                  <div className="gh-list-item">
                    <div className="gh-list-item-main">
                      <div className="gh-list-item-title-row">
                        <a href="https://github.com/torvalds/linux" target="_blank" rel="noopener noreferrer" className="gh-list-repo-name">
                          torvalds / linux
                        </a>
                        <span className="gh-badge-pill">Public</span>
                      </div>
                      <p className="gh-list-repo-desc">Linux kernel source tree</p>
                      <div className="gh-repo-meta">
                        <span className="gh-lang-tag"><span className="gh-lang-circle" style={{ backgroundColor: '#555555' }} /> C</span>
                        <span className="gh-star-count">★ 180k</span>
                      </div>
                    </div>
                  </div>
                  <div className="gh-list-item">
                    <div className="gh-list-item-main">
                      <div className="gh-list-item-title-row">
                        <a href="https://github.com/hyprwm/Hyprland" target="_blank" rel="noopener noreferrer" className="gh-list-repo-name">
                          hyprwm / Hyprland
                        </a>
                        <span className="gh-badge-pill">Public</span>
                      </div>
                      <p className="gh-list-repo-desc">Hyprland is a dynamic tiling Wayland compositor that doesn't sacrifice on its looks.</p>
                      <div className="gh-repo-meta">
                        <span className="gh-lang-tag"><span className="gh-lang-circle" style={{ backgroundColor: '#f34b7d' }} /> C++</span>
                        <span className="gh-star-count">★ 22k</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Draggable>
  );
};

export default GitHubWindow;
