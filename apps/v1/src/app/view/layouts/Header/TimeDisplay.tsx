import { useState, useEffect } from 'react';

const TimeDisplay = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const weekdays = ['일', '월', '화', '수', '목', '금', '토'];
    const weekday = weekdays[date.getDay()];

    return {
      date: `${year}.${month}.${day}`,
      weekday,
      time: `${hours}:${minutes}`
    };
  };

  const { date, weekday, time } = formatDate(currentTime);

  return (
    <div
      className="flex items-center gap-3 !bg-primary-900/15 rounded-lg px-4 py-1 border border-gray-300/10 backdrop-blur-sm hover:bg-primary-300/25 transition-colors">
      <div className="flex items-center">
        <span className="text-gray-200 text-sm font-medium tracking-wide">{date}</span>
        <span className="mx-2 text-gray-500 select-none">|</span>
        <span className="text-gray-200 text-sm font-medium tracking-wide">
          {weekday}
          <span>요일</span>
        </span>
      </div>
      <div className="w-px h-4 bg-gray-500" />
      <div className="flex items-center gap-1 font-mono tracking-wider text-white">
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
          <path d="M12 7V12L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
        {time}
      </div>
    </div>
  );
};

export default TimeDisplay;