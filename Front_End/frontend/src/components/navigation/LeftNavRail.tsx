import { useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import styles from './LeftNavRail.module.css'

type SectionInfo = {
  el: HTMLElement
  title: string
}

// 홈페이지 외부 화면으로 이동하는 고정 메뉴 목록입니다. 경로나 문구가 바뀌면 여기만 수정하세요.
const shortcutLinks = [
  { id: 'my-complaints', title: '나의 민원', to: '/my-complaints' },
  { id: 'nearby-offices', title: '가까운 관공서 찾기', to: '/nearby-offices' },
]

export const LeftNavRail = () => {
  // data-section, data-title 속성을 사용해 페이지 구역을 자동으로 수집합니다.
  const [sections, setSections] = useState<SectionInfo[]>([])
  const [activeIndex, setActiveIndex] = useState(0)
  const nodesRef = useRef<HTMLElement[]>([])
  const location = useLocation()

  useEffect(() => {
    const nodes = Array.from(document.querySelectorAll<HTMLElement>('[data-section]'))
    nodesRef.current = nodes
    const mapped = nodes.map((el, index) => ({
      el,
      title: el.getAttribute('data-title') || el.id || `섹션 ${index + 1}`,
    }))
    setSections(mapped)

    const handleScroll = () => {
      const headerVar = getComputedStyle(document.documentElement).getPropertyValue('--header-h')
      const headerH = parseInt(headerVar || '0', 10) || 0
      const offset = headerH + 24
      let idx = 0

      for (let i = 0; i < nodesRef.current.length; i++) {
        const rect = nodesRef.current[i].getBoundingClientRect()
        if (rect.top - offset <= 1) idx = i
      }

      setActiveIndex(idx)
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('resize', handleScroll)

    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleScroll)
    }
  }, [])

  const focusSection = (el: HTMLElement | undefined) => {
    if (!el) return
    if (!el.hasAttribute('tabindex')) el.setAttribute('tabindex', '-1')
    el.focus({ preventScroll: true })
  }

  // 메뉴 버튼 클릭 시 해당 섹션으로 부드럽게 스크롤합니다.
  const handleSelect = (index: number) => {
    const target = sections[index]?.el
    setActiveIndex(index)
    target?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    focusSection(target)
  }

  if (sections.length === 0 && shortcutLinks.length === 0) {
    return null
  }

  return (
    <nav className={styles.sidebar} aria-label="메인 섹션 이동">
      <h2 className={styles.title}>바로 가기</h2>

      {sections.length > 0 && (
        <>
          <p className={styles.groupLabel}>페이지 섹션</p>
          <div className={styles.list} role="tablist" aria-orientation="vertical">
            {sections.map((section, index) => (
              <button
                key={section.title + index}
                type="button"
                className={styles.item}
                role="tab"
                aria-selected={index === activeIndex}
                onClick={() => handleSelect(index)}
              >
                <span className={styles.indicator} aria-hidden="true" />
                {section.title}
              </button>
            ))}
          </div>
        </>
      )}

      {shortcutLinks.length > 0 && (
        <>
          {sections.length > 0 && <div className={styles.divider} aria-hidden="true" />}
          <p className={styles.groupLabel}>주요 메뉴</p>
          <div className={styles.list}>
            {shortcutLinks.map((item) => {
              const isActive = location.pathname === item.to
              const linkClass = isActive ? `${styles.link} ${styles.linkActive}` : styles.link
              return (
                <Link key={item.id} to={item.to} className={linkClass}>
                  {item.title}
                </Link>
              )
            })}
          </div>
        </>
      )}
    </nav>
  )
}

export default LeftNavRail
