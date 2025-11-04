import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { ChatMessengerInput } from './ChatMessengerInput'
import { ChatbotConversation } from './ChatbotConversation'
import styles from './ChatbotWidget.module.css'
import mascotFace from '../../img/logo_face.png'
import { guidanceContent } from '../../data/serviceGuidance'
import {
  buildGuidanceSearchSuggestion,
  getServiceDetail,
  searchServices,
} from '../../utils/guidanceSearch'
import type { ServiceGuidanceDetail } from '../../types/guidance'

type ChatbotStatus = 'idle' | 'success' | 'not-found'

type PersistedState = {
  open: boolean
  query: string
  status: ChatbotStatus
  selectedServiceId: string | null
}

const STORAGE_KEY = 'chatbotWidgetState'
const defaultSuggestions = guidanceContent.services.slice(0, 3)

// 레이아웃 레벨에 고정돼 새로고침이나 새 탭에서도 이어지는 챗봇 위젯입니다.
// 트리거 버튼 디자인을 바꾸려면 하단 JSX의 <button> 부분을, 로직을 바꾸려면 아래 상태 훅들을 편집하세요.
export const ChatbotWidget = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState<ChatbotStatus>('idle')
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null)
  const [suggestions, setSuggestions] = useState(defaultSuggestions)
  const dialogRef = useRef<HTMLElement | null>(null)
  const skipPersistRef = useRef(false)

  useEffect(() => {
    if (!isOpen) return
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen])

  useEffect(() => {
    if (isOpen && dialogRef.current) {
      dialogRef.current.focus()
    }
  }, [isOpen])

  // 저장된 스냅샷을 불러오고 다른 탭과 동기화합니다.
  // 저장 구조를 바꾸려면 PersistedState 타입과 이 함수의 JSON 처리 로직을 함께 수정해야 합니다.
  const applyPersistedState = useCallback((raw: string | null) => {
    skipPersistRef.current = true
    try {
      if (!raw) {
        setIsOpen(false)
        setQuery('')
        setStatus('idle')
        setSelectedServiceId(null)
        setSuggestions(defaultSuggestions)
        return
      }

      const parsed = JSON.parse(raw) as Partial<PersistedState> | null
      if (!parsed) {
        setIsOpen(false)
        setQuery('')
        setStatus('idle')
        setSelectedServiceId(null)
        setSuggestions(defaultSuggestions)
        return
      }

      const nextOpen = Boolean(parsed.open)
      const nextQuery = typeof parsed.query === 'string' ? parsed.query : ''
      const nextStatus =
        parsed.status === 'success' || parsed.status === 'not-found' ? parsed.status : 'idle'
      const nextSelected =
        typeof parsed.selectedServiceId === 'string' ? parsed.selectedServiceId : null

      setIsOpen(nextOpen)
      setQuery(nextQuery)
      setSelectedServiceId(nextSelected)
      setStatus(nextStatus)

      if (nextQuery) {
        const found = searchServices(nextQuery, guidanceContent)
        if (found.length === 0) {
          setSuggestions(defaultSuggestions)
          setStatus('not-found')
          setSelectedServiceId(null)
        } else {
          setSuggestions(found)
          if (!nextSelected || !found.some((service) => service.id === nextSelected)) {
            setSelectedServiceId(found[0].id)
          }
          if (nextStatus !== 'success') {
            setStatus('success')
          }
        }
      } else {
        setSuggestions(defaultSuggestions)
        setSelectedServiceId(null)
        setStatus('idle')
      }
    } catch {
      setIsOpen(false)
      setQuery('')
      setStatus('idle')
      setSelectedServiceId(null)
      setSuggestions(defaultSuggestions)
    } finally {
      setTimeout(() => {
        skipPersistRef.current = false
      }, 0)
    }
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') return
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY)
      if (raw) applyPersistedState(raw)
    } catch {
      // ignore persistence errors
    }
  }, [applyPersistedState])

  // 다른 탭에서 localStorage가 바뀌면 같은 상태로 맞춰줍니다.
  // 동기화가 불필요하면 이 useEffect를 제거하고 localStorage 이벤트 리스너를 삭제하세요.
  useEffect(() => {
    if (typeof window === 'undefined') return
    const handleStorage = (event: StorageEvent) => {
      if (event.key !== STORAGE_KEY) return
      applyPersistedState(event.newValue)
    }
    window.addEventListener('storage', handleStorage)
    return () => window.removeEventListener('storage', handleStorage)
  }, [applyPersistedState])

  const detail: ServiceGuidanceDetail | null = useMemo(() => {
    if (!selectedServiceId) return null
    // TODO: AI 모델 연동 시에는 응답으로 받은 상세 정보를 그대로 사용하도록
    // 현재의 로컬 데이터 조회(getServiceDetail)를 대체하세요.
    return getServiceDetail(selectedServiceId, guidanceContent)
  }, [selectedServiceId])

  const handleSearch = useCallback((input: string) => {
    // TODO: 향후 AI 챗봇 API와 연동할 때는 아래 로컬 검색 로직을
    // fetch('/api/chatbot', { body: input }) 같은 비동기 호출로 대체하고,
    // 응답으로 받은 안내 데이터를 setStatus/setSelectedServiceId/setSuggestions에 연결하세요.
    if (!input) {
      setStatus('idle')
      setSelectedServiceId(null)
      setSuggestions(guidanceContent.services.slice(0, 3))
      return
    }

    const found = searchServices(input, guidanceContent)
    setSuggestions(found)

    if (found.length === 0) {
      setStatus('not-found')
      setSelectedServiceId(null)
      return
    }

    setSelectedServiceId(found[0].id)
    setStatus('success')
  }, [])

  const handleReset = useCallback(() => {
    setQuery('')
    setStatus('idle')
    setSelectedServiceId(null)
    setSuggestions(guidanceContent.services.slice(0, 3))
  }, [])

  const handleSuggestionSelect = useCallback((serviceId: string) => {
    setSelectedServiceId(serviceId)
    setStatus('success')
  }, [])

  // 스냅샷을 적용 중인 경우를 제외하고 사용자의 최근 동작을 저장합니다.
  // 저장 주기를 세밀하게 제어하려면 의존성 배열에서 필요한 값만 남겨두거나 throttle을 적용하면 됩니다.
  useEffect(() => {
    if (typeof window === 'undefined') return
    if (skipPersistRef.current) return
    const payload: PersistedState = {
      open: isOpen,
      query,
      status,
      selectedServiceId,
    }
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload))
    } catch {
      // ignore persistence errors
    }
  }, [isOpen, query, status, selectedServiceId])

  const triggerClassName = isOpen ? `${styles.trigger} ${styles.triggerHidden}` : styles.trigger

  if (typeof document === 'undefined') return null

  return createPortal(
    <>
      {/* 모든 페이지 우측 하단에 노출되는 마스코트 트리거 버튼입니다.
          위치를 바꾸려면 ChatbotWidget.module.css의 .trigger를 수정하세요. */}
      <button
        type="button"
        className={triggerClassName}
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        onClick={() => setIsOpen(true)}
      >
        <span className="visually-hidden">챗봇 열기</span>
        <img src={mascotFace} alt="" aria-hidden="true" />
      </button>
      {isOpen && (
        <section
          ref={(node) => {
            dialogRef.current = node
          }}
          tabIndex={-1}
          role="dialog"
          aria-label="공공복지 챗봇 대화창"
          className={styles.window}
        >
          {/* 상단 바에서는 챗봇 정보와 접근성용 닫기 버튼을 제공합니다.
              타이틀 혹은 버튼 텍스트를 변경하려면 이 영역을 직접 수정하면 됩니다. */}
          <header className={styles.header}>
            <div>
              <p className={styles.lead}>공공복지 챗봇</p>
              <h2 className={styles.title}>민원 서류 준비 도우미</h2>
            </div>
            <button
              type="button"
              className={styles.closeButton}
              onClick={() => setIsOpen(false)}
            >
              닫기
            </button>
          </header>
          <div className={styles.content}>
            <div className={styles.responseArea}>
              <ChatbotConversation
                status={status}
                query={query}
                detail={detail}
                suggestions={suggestions}
                onReset={handleReset}
                onSelectSuggestion={handleSuggestionSelect}
              />
            </div>
            <div className={styles.inputArea}>
              <ChatMessengerInput
                value={query}
                onChange={setQuery}
                onSubmit={(value) => {
                  setQuery(value)
                  handleSearch(value)
                }}
                suggestion={buildGuidanceSearchSuggestion(query)}
              />
            </div>
          </div>
        </section>
      )}
    </>,
    document.body,
  )
}

export default ChatbotWidget
