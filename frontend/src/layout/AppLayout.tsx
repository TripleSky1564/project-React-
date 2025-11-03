import { useEffect, useMemo, useState } from 'react'
import { Outlet } from 'react-router-dom'
import styles from './AppLayout.module.css'
import { Footer } from './Footer'
import { Header } from './Header'
import { AccessibilityContext } from './AccessibilityContext'
import type { TextScale } from './AccessibilityContext'
// 접근성 컨트롤 UI 제거
import { SectionOptionBar } from '../components/navigation/SectionOptionBar'

const fontSizeMap: Record<TextScale, string> = {
  standard: '16px',
  large: '18px',
  extra: '20px',
}

export const AppLayout = () => {
  const [textScale, setTextScale] = useState<TextScale>('standard')
  const [highContrast, setHighContrast] = useState(false)

  useEffect(() => {
    document.documentElement.style.fontSize = fontSizeMap[textScale]
    const baseRem =
      textScale === 'standard' ? '1rem' : textScale === 'large' ? '1.125rem' : '1.25rem'
    document.documentElement.style.setProperty('--font-size-base', baseRem)
  }, [textScale])

  useEffect(() => {
    document.body.classList.toggle('high-contrast', highContrast)
  }, [highContrast])

  const playAudioSummary = (text: string) => {
    if (typeof window === 'undefined') return
    if ('speechSynthesis' in window && 'SpeechSynthesisUtterance' in window) {
      const utterance = new window.SpeechSynthesisUtterance(text)
      utterance.lang = 'ko-KR'
      window.speechSynthesis.cancel()
      window.speechSynthesis.speak(utterance)
    }
  }

  const accessibilityValue = useMemo(
    () => ({
      textScale,
      setTextScale,
      highContrast,
      toggleHighContrast: () => setHighContrast((prev) => !prev),
      playAudioSummary,
    }),
    [textScale, highContrast],
  )

  // Measure header height for sticky option bar offset
  useEffect(() => {
    const header = document.querySelector('#site-header, header') as HTMLElement | null
    const setHeaderH = () => {
      if (!header) return
      const h = Math.round(header.getBoundingClientRect().height)
      if (h) document.documentElement.style.setProperty('--header-h', `${h}px`)
    }
    setHeaderH()
    const ro = new ResizeObserver(setHeaderH)
    if (header) ro.observe(header)
    return () => ro.disconnect()
  }, [])

  return (
    <AccessibilityContext.Provider value={accessibilityValue}>
      <div className={styles.appShell}>
        <a className="visually-hidden" href="#main-content">
          메인 콘텐츠로 바로가기
        </a>
        <Header />
        <div className={styles.accessibilityBar}>
          <div style={{display:'flex',gap:'12px',maxWidth:1080, width:'100%', alignItems:'center'}}>
            <div style={{flex:1}}>
              <SectionOptionBar />
            </div>
          </div>
        </div>
        <main id="main-content" className={styles.main}>
          <div className={styles.contentRegion}>
            <Outlet />
          </div>
        </main>
        <Footer />
      </div>
    </AccessibilityContext.Provider>
  )
}

export default AppLayout
