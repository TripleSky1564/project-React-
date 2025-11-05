import { useCallback, useMemo, useState } from 'react'
import { guidanceContent } from '../../data/serviceGuidance'
import { ChatbotInput } from '../../components/chatbot/ChatbotInput'
import { ChatbotGuidance } from '../../components/chatbot/ChatbotGuidance'
import { CategoryGrid } from '../../components/category/CategoryGrid'
import ServiceDetailContent from '../../components/service/ServiceDetailContent'
import {
  buildGuidanceSearchSuggestion,
  getCategoryById,
  getServiceDetail,
  getServicesByCategory,
  searchServices,
} from '../../utils/guidanceSearch'
import type { ServiceGuidanceDetail } from '../../types/guidance'
import styles from './HomePage.module.css'

type ChatbotStatus = 'idle' | 'success' | 'not-found'

export const HomePage = () => {
  // 랜딩 화면에서도 즉시 안내가 보이도록 챗봇 위젯과 동일한 상태를 가집니다.
  // 상태 구조를 바꾸면 ChatbotWidget.tsx와 동기화 로직이 달라질 수 있으니 함께 수정하세요.
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState<ChatbotStatus>('idle')
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null)
  const [expandedServiceId, setExpandedServiceId] = useState<string | null>(null)
  const [suggestions, setSuggestions] = useState(guidanceContent.services.slice(0, 3))

  const detail: ServiceGuidanceDetail | null = useMemo(() => {
    if (!selectedServiceId) return null
    return getServiceDetail(selectedServiceId, guidanceContent)
  }, [selectedServiceId])

  const expandedDetail: ServiceGuidanceDetail | null = useMemo(() => {
    if (!expandedServiceId) return null
    return getServiceDetail(expandedServiceId, guidanceContent)
  }, [expandedServiceId])

  const expandedCategory = useMemo(() => {
    if (!expandedDetail || expandedDetail.categories.length === 0) return null
    const primary = expandedDetail.categories[0]
    return getCategoryById(primary.id, guidanceContent)
  }, [expandedDetail])

  const expandedRelatedServices = useMemo(() => {
    if (!expandedDetail || !expandedCategory) return []
    return getServicesByCategory(expandedCategory.id, guidanceContent).filter(
      (service) => service.id !== expandedDetail.id,
    )
  }, [expandedDetail, expandedCategory])

  const handleSearch = useCallback(
    (input: string) => {
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
    },
    [setSuggestions],
  )

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

  const handleCategorySelect = useCallback((serviceId: string) => {
    setExpandedServiceId((prev) => (prev === serviceId ? null : serviceId))
  }, [])

  const handleInlineReset = useCallback(() => {
    setExpandedServiceId(null)
  }, [])

  return (
    <div className={styles.page}>
      {/* 히어로 영역: 서비스 소개와 챗봇 섹션으로 이동하는 링크를 제공합니다.
          텍스트나 강조 색상을 바꾸려면 HomePage.module.css와 함께 조정하세요. */}
      <section className={styles.hero}>
        <div>
          <p className={styles.sectionLabel}>공공복지 안내</p>
          <h1 className={styles.heading}>
            민원 서류 준비 <span className={styles.highlight}>챗봇·안내</span> 도와드릴게요
          </h1>
          <p className={styles.description}>
            궁금한 민원명을 입력하면 온라인·오프라인 준비방법을 한 번에 알려드립니다.
          </p>
          <a className={styles.cta} href="#chatbot">
            챗봇에게 민원 물어보기
          </a>
        </div>
        <div className={styles.heroCard} aria-hidden="true">
          <p>기초연금 신청하려면 어떤 서류가 필요할까요?</p>
          <span>챗봇이 절차·방문방법을 알려줍니다</span>
        </div>
      </section>

      {/* 챗봇 구간: 페이지 이동 없이 민원 안내 흐름을 체험할 수 있습니다.
          이곳의 배치를 변경하면 챗봇 위젯과 내용이 중복되지 않도록 주의하세요. */}
      <section
        id="chatbot"
        data-section
        data-title="챗봇 안내"
        className={styles.chatbotShell}
        style={{ scrollMarginTop: '80px' }}
      >
        <h2>챗봇으로 바로 민원 안내 받기</h2>
        <p className={styles.helperText}>
          상황과 사유를 입력하면 단계별로 안내해드립니다.
        </p>
        <ChatbotInput
          value={query}
          onChange={setQuery}
          onSubmit={(value) => {
            setQuery(value)
            handleSearch(value)
          }}
          suggestion={buildGuidanceSearchSuggestion(query)}
        />
        <ChatbotGuidance
          status={status}
          query={query}
          detail={detail}
          suggestions={suggestions}
          onReset={handleReset}
          onSelectSuggestion={handleSuggestionSelect}
        />
      </section>

      {/* 생애주기 섹션: 관련 서비스로 빠르게 이동할 수 있는 카테고리를 보여줍니다.
          카테고리 순서를 수정하려면 guidanceContent.categories 데이터를 업데이트하세요. */}
      <section
        id="life-events"
        data-section
        data-title="생애주기"
        className={styles.categories}
        style={{ scrollMarginTop: '80px' }}
      >
        <h2>생애주기별 공공복지 서비스</h2>
        <p className={styles.helperText}>
          상황에 맞는 카테고리를 선택하면 관련 서비스를 살펴볼 수 있습니다.
        </p>
        <CategoryGrid
          categories={guidanceContent.categories}
          services={guidanceContent.services}
          onSelectService={handleCategorySelect}
          selectedServiceId={expandedServiceId}
        />
      </section>

      {expandedDetail && (
        <section
          id="selected-service"
          data-section
          data-title="선택한 서비스"
          className={styles.selectedService}
          style={{ scrollMarginTop: '80px' }}
        >
          <ServiceDetailContent
            detail={expandedDetail}
            relatedCategory={expandedCategory}
            relatedServices={expandedRelatedServices}
            variant="inline"
            onDismiss={handleInlineReset}
            onSelectRelated={handleCategorySelect}
          />
        </section>
      )}
    </div>
  )
}

export default HomePage
