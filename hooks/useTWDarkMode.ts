import { useState, useEffect } from 'react';

const useDarkMode = () => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') return localStorage.getItem('darkMode');
    return 'false';
  });

  const toggleDarkMode = () => {
    setIsDarkMode((prevIsDarkMode) => {
      if (prevIsDarkMode === 'true') return 'false';
      else return 'true';
    });
  };

  useEffect(() => {
    const htmlElement = document.getElementsByTagName('html')[0];
    if (isDarkMode === 'true') htmlElement.className = 'dark';
    else htmlElement.className = '';
  }, [isDarkMode]);

  if (typeof window !== 'undefined') {
    window.onbeforeunload = () => {
      localStorage.setItem('darkMode', String(isDarkMode));
    };
  }

  return [isDarkMode, toggleDarkMode];
};

export default useDarkMode;
