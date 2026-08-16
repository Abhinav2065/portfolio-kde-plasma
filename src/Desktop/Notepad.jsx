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

const Notepad = ({ title, content, onClose }) => {

  const nodeRef = useRef(null);

  const body = useMemo(() => {
    const stored = localStorage.getItem(`notepad-${title}`);
    return formatContent(stored ?? content);
  }, [title, content]);

  return (
    <Draggable bounds="parent" nodeRef={nodeRef} handle='.notepad-header' defaultPosition={{ x: 120, y: 40 }}>
      <div ref={nodeRef} className="notepad">
        <div className="notepad-header">
          <div className="notepad-title">
            {title}
          </div>
          <button className="notepad-close" onClick={onClose}>×</button>
        </div>
        <div className="notepad-body">
          <div className="notepad-text">{body}</div>
        </div>
      </div>
    </Draggable>
  )
}

export default Notepad
