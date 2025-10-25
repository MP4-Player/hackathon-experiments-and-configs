import { useEffect } from 'react'

export const SafeFonts = () => {
  useEffect(() => {
    // Проверяем, загрузились ли шрифты
    const checkFonts = () => {
      const fonts = ['Inter', 'Poppins']
      const fallbackFonts = ['system-ui', 'sans-serif']
      
      fonts.forEach(font => {
        if (!document.fonts.check(`16px ${font}`)) {
          console.warn(`Font ${font} not loaded, using fallback`)
        }
      })
    }

    // Проверяем через 2 секунды после загрузки
    const timer = setTimeout(checkFonts, 2000)
    
    return () => clearTimeout(timer)
  }, [])

  return null
}
