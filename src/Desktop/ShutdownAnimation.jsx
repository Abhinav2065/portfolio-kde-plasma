import React, { useEffect, useState, useRef } from 'react';
import './bootanimation.css';
import { useNavigate } from 'react-router-dom';

const shutdownMessages = [
  "[  OK  ] Stopped target Graphical Interface.",
  "[  OK  ] Stopping KDE Plasma Display Manager...",
  "[  OK  ] Stopped KDE Plasma Display Manager.",
  "[  OK  ] Stopping Session c1 of user ablag...",
  "[  OK  ] Stopped Session c1 of user ablag.",
  "[  OK  ] Stopping User Manager for UID 1000...",
  "[  OK  ] Stopped User Manager for UID 1000.",
  "[  OK  ] Stopping Docker Application Container Engine...",
  "[  OK  ] Stopped Docker Application Container Engine.",
  "[  OK  ] Stopping CUPS Scheduler...",
  "[  OK  ] Stopped CUPS Scheduler.",
  "[  OK  ] Stopping Bluetooth Service...",
  "[  OK  ] Stopped Bluetooth Service.",
  "[  OK  ] Stopping Network Manager...",
  "[  OK  ] Stopped Network Manager.",
  "[  OK  ] Stopping D-Bus System Message Bus...",
  "[  OK  ] Stopped D-Bus System Message Bus.",
  "[  OK  ] Stopped target Basic System.",
  "[  OK  ] Stopped target Slices.",
  "[  OK  ] Stopped target Sockets.",
  "[  OK  ] Stopped target Timers.",
  "[  OK  ] Stopped target System Initialization.",
  "[  OK  ] Stopping Rule-based Manager for Device Events...",
  "[  OK  ] Stopped Rule-based Manager for Device Events.",
  "[  OK  ] Unmounting /home...",
  "[  OK  ] Unmounted /home.",
  "[  OK  ] Unmounting /boot...",
  "[  OK  ] Unmounted /boot.",
  "[  OK  ] Reached target Unmount All Filesystems.",
  "[  OK  ] Stopped udev Kernel Device Manager.",
  "[  OK  ] All filesystems unmounted.",
  "[  OK  ] Deactivated swap /dev/zram0.",
  "[  OK  ] Reached target System Shutdown.",
  "[  OK  ] Reached target Power-Off.",
  "[  OK  ] Powering off."
];

const ShutdownAnimation = () => {
  const navigate = useNavigate();
  const [isPoweredOff, setIsPoweredOff] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    const finishTime = shutdownMessages.length * 75 + 1200;

    const timer = setTimeout(() => {
      setIsPoweredOff(true);
    }, finishTime);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const id = requestAnimationFrame(() => {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    });
    return () => cancelAnimationFrame(id);
  });

  const handlePowerOn = () => {
    navigate('/boot');
  };

  if (isPoweredOff) {
    return (
      <div
        className="power-off-screen"
        onClick={handlePowerOn}
        onKeyDown={handlePowerOn}
        tabIndex={0}
        autoFocus
      >
        <div className="power-off-hint">
          <span className="power-off-icon">⏻</span>
          <span>System powered off. Click or press any key to power on.</span>
        </div>
      </div>
    );
  }

  return (
    <div className="boot-screen shutdown-screen">
      <div className="boot-lines">
        {shutdownMessages.map((msg, i) => (
          <p key={i} style={{ animationDelay: `${i * 0.075}s` }}>
            {msg}
          </p>
        ))}
      </div>
      <div ref={bottomRef}></div>
    </div>
  );
};

export default ShutdownAnimation;
