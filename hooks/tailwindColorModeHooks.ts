import { useState, useEffect } from 'react'

const useDarkMode: () => [string | null, () => void] = () => {
  const [isDarkMode, setIsDarkMode] = useState(() =>
    typeof window !== undefined ? localStorage.getItem('darkMode') : 'false'
  )

  const toggleDarkMode = () => {
    setIsDarkMode((prevIsDarkMode) => (prevIsDarkMode === 'true' ? 'false' : 'true'))
  }

  useEffect(() => {
    const htmlElement = document.getElementsByTagName('html')[0]
    htmlElement.className = isDarkMode === 'true' ? 'dark' : (htmlElement.className = '')
  }, [isDarkMode])

  if (typeof window !== 'undefined') {
    window.onbeforeunload = () => {
      localStorage.setItem('darkMode', String(isDarkMode))
    }
  }

  return [isDarkMode, toggleDarkMode]
}

export { useDarkMode }
