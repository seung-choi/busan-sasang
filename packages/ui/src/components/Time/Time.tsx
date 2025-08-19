import { useEffect, useState } from 'react';
import { cn } from '../../utils/classname';
import type { TimeProps } from './Time.types';

const Time = ({ 
  color = 'primary',
  lang = 'ko-KR',
  size = 'small',
  format = 'YYYY-MM-DD HH:mm:ss',
  className,
  ...props 
}: TimeProps) => {

  const timeStyle = 'flex gap-2 items-center font-bold';

  const variantStyle = {
    primary: 'text-black',
    secondary: 'text-white'
  }[color];

  const sizeStyle = {
    small: 'text-sm',
    medium: 'text-base',
    large: 'text-lg',
  }[size];


  // Time Date 동작
  function formatDate(date:Date, format:string, lang?:string){

    const locale = lang;
    const options : Intl.DateTimeFormatOptions = {
      second: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      weekday: 'long', 
    };

    const localeDate = new Intl.DateTimeFormat(locale, options).format(date);
    const hours = String(date.getHours()).padStart(2,'0');
    const minutes = String(date.getMinutes()).padStart(2,'0');
    const seconds = String(date.getSeconds()).padStart(2,'0');
    const year = String(date.getFullYear());
    const month = String(date.getMonth() + 1).padStart(2,'0');
    const day = String(date.getDay()).padStart(2,'0');
    
    switch(format){
      case 'HH:mm:ss':
        return `${hours}:${minutes}:${seconds}`;
      case 'YYYY-MM-DD':
        return `${year}-${month}-${day}`;
      case 'HH:mm':
        return `${hours}:${minutes}`;
      case 'locale': 
        return `${localeDate}`;
      default:
        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`; 
    }
  }

const [currentTime, setCurrentTime] = useState('');

useEffect(() => {
  const timer = setInterval(() => {
    setCurrentTime(formatDate(new Date(), format, lang));  
  }, 1000);

  return () => clearInterval(timer);
}, [format, lang]);

  
  return (
    <time 
        className={cn(
            variantStyle,
            timeStyle,
            sizeStyle,
            className
        )}
        {...props}
        >
          {currentTime}
    </time>
  );
};

Time.displayName = "Time";

export { Time };

