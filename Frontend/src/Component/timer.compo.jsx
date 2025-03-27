import { useState, useEffect } from 'react';

const CountdownTimer = () => {
  const [timeLeft, setTimeLeft] = useState(120000); // 2 minutes in milliseconds
  const [endTime, setEndTime] = useState(null);

  useEffect(() => {
    // Check localStorage for existing timer
    const storedEndTime = localStorage.getItem('timerEndTime');
    const currentTime = Date.now();

    if (storedEndTime) {
      const remaining = storedEndTime - currentTime;
      if (remaining > 0) {
        setEndTime(parseInt(storedEndTime));
        setTimeLeft(remaining);
      } else {
        startNewTimer();
      }
    } else {
      startNewTimer();
    }
  }, []);

  const startNewTimer = () => {
    const newEndTime = Date.now() + 120000;
    localStorage.setItem('timerEndTime', newEndTime.toString());
    setEndTime(newEndTime);
    setTimeLeft(120000);
  };

  useEffect(() => {
    if (!endTime) return;

    const interval = setInterval(() => {
      const remaining = endTime - Date.now();
      
      if (remaining <= 0) {
        setTimeLeft(0);
        localStorage.removeItem('timerEndTime');
        clearInterval(interval);
      } else {
        setTimeLeft(remaining);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [endTime]);

  const formatTime = (milliseconds) => {
    const minutes = Math.floor(milliseconds / 60000);
    const seconds = Math.floor((milliseconds % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="text-6xl font-bold bg-blue-500 text-white p-8 rounded-lg">
        {formatTime(timeLeft)}
      </div>
    </div>
  );
};

export default CountdownTimer;