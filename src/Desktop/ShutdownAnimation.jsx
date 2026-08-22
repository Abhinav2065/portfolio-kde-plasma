import React, { useEffect, useState, useRef } from 'react';
import './bootanimation.css';
import { useNavigate, useLocation } from 'react-router-dom';

const baseShutdownMessages = [
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
  "[  OK  ] Reached target System Shutdown."
];

const ShutdownAnimation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isReboot = !!location.state?.isReboot;

  // 'shutting_down' | 'blank' | 'text'
  const [phase, setPhase] = useState('shutting_down');
  const bottomRef = useRef(null);

  const shutdownMessages = [
    ...baseShutdownMessages,
    isReboot ? "[  OK  ] Reached target Reboot." : "[  OK  ] Reached target Power-Off.",
    isReboot ? "[  OK  ] Restarting system." : "[  OK  ] Powering off."
  ];

  useEffect(() => {
    // 1. Stream logs
    const logsDuration = shutdownMessages.length * 75 + 1000;
    const blankTimer = setTimeout(() => {
      setPhase('blank');

      if (isReboot) {
        // Show black screen for 1 second, then navigate to /boot
        const rebootTimer = setTimeout(() => {
          navigate('/boot');
        }, 1000);
        return () => clearTimeout(rebootTimer);
      } else {
        // Pure blank screen for 2.4s, then show aesthetic text
        const textTimer = setTimeout(() => {
          setPhase('text');
        }, 2400);
        return () => clearTimeout(textTimer);
      }
    }, logsDuration);

    return () => clearTimeout(blankTimer);
  }, [isReboot, navigate, shutdownMessages.length]);

  useEffect(() => {
    if (phase === 'shutting_down') {
      const id = requestAnimationFrame(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
      });
      return () => cancelAnimationFrame(id);
    }
  });

  const handlePowerOn = () => {
    navigate('/boot');
  };

  if (phase === 'blank') {
    return (
      <div
        className="power-off-screen blank-screen"
        onClick={handlePowerOn}
        onKeyDown={handlePowerOn}
        tabIndex={0}
        autoFocus
      />
    );
  }

  if (phase === 'text') {
    return (
      <div
        className="power-off-screen text-screen"
        onClick={handlePowerOn}
        onKeyDown={handlePowerOn}
        tabIndex={0}
        autoFocus
      >
        <div className="aesthetic-shutdown-container">
          <h1 className="aesthetic-nepali-text">चक्चके!</h1>
          <div className="aesthetic-subtext">Click or press any key to power on</div>
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
