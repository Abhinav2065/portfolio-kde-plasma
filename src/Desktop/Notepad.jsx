import React, { useRef, useMemo } from 'react'
import Draggable from 'react-draggable'

const linkify = (text) => {
  const urlPattern = /(https?:\/\/[^\s,]+)/g;
  return text.split(urlPattern).map((part, i) =>
    urlPattern.test(part)
      ? <a key={i} href={part} target="_blank" rel="noreferrer">{part}</a>
      : part
  );
}

const formatContent = (text) => {
  const lines = text.split('\n');
  const blocks = [];
  let list = [];

  const flushList = () => {
    if (list.length) {
      blocks.push(<ol key={blocks.length}>{list}</ol>);
      list = [];
    }
  }

  lines.forEach((line, i) => {
    const trimmed = line.trim();
    const listMatch = trimmed.match(/^(\d+)\.\s+(.*)/);
    if (listMatch) {
      list.push(<li key={i}>{linkify(listMatch[2])}</li>);
    } else if (trimmed === '') {
      flushList();
      blocks.push(<br key={`br-${i}`} />);
    } else {
      flushList();
      blocks.push(<p key={i}>{linkify(trimmed)}</p>);
    }
  });
  flushList();
  return blocks;
}

const Notepad = ({ title, content, onClose, onMinimize, isMinimized, zIndex, onFocus }) => {
  const [isMaximized, setIsMaximized] = React.useState(false);
  const nodeRef = useRef(null);

  const toggleMaximize = () => {
    setIsMaximized(prev => !prev);
  }

  const body = useMemo(() => {
    const stored = localStorage.getItem(`notepad-${title}`);
    return formatContent(stored ?? content);
  }, [title, content]);

  return (
    <Draggable bounds="parent" nodeRef={nodeRef} handle='.notepad-header' disabled={isMaximized} defaultPosition={{ x: 120, y: 40 }}>
      <div
        ref={nodeRef}
        className={`notepad ${isMaximized ? 'maximized' : ''} ${isMinimized ? 'minimized' : ''}`}
        onMouseDownCapture={onFocus}
        onClickCapture={onFocus}
        onMouseDown={onFocus}
        style={{ zIndex }}
      >
        <div className="notepad-header">
          <div className="notepad-title">
            {title}
          </div>
          <div className="notepad-controls" onMouseDown={(e) => e.stopPropagation()}>
            <button type="button" className="notepad-btn" title="Minimize" onClick={onMinimize}>—</button>
            <button type="button" className="notepad-btn" title={isMaximized ? "Restore" : "Maximize"} onClick={toggleMaximize}>
              {isMaximized ? "❐" : "▢"}
            </button>
            <button type="button" className="notepad-btn notepad-close" title="Close" onClick={onClose}>×</button>
          </div>
        </div>
        <div className="notepad-body">
          <div className="notepad-text">{body}</div>
        </div>
      </div>
    </Draggable>
  )
}

export default Notepad
