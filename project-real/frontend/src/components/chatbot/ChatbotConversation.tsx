import { useMemo, type ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import type { ServiceGuidance, ServiceGuidanceDetail } from '../../types/guidance'
import styles from './ChatbotConversation.module.css'
import mascotFace from '../../img/logo_face.png'

type GuidanceStatus = 'idle' | 'success' | 'not-found'

type ChatbotConversationProps = {
  status: GuidanceStatus
  query: string
  detail: ServiceGuidanceDetail | null
  suggestions: ServiceGuidance[]
  onReset: () => void
  onSelectSuggestion: (serviceId: string) => void
}

const AssistantBubble = ({
  children,
  tone = 'default',
}: {
  children: ReactNode
  tone?: 'default' | 'highlight'
}) => (
  <div className={`${styles.message} ${styles.assistant}`}>
    <span className={styles.avatar}>
      <img src={mascotFace} alt="공공복지 챗봇 마스코트" />
    </span>
    <div
      className={`${styles.bubble} ${styles.assistantBubble} ${
        tone === 'highlight' ? styles.highlight : ''
      }`}
    >
      {children}
    </div>
  </div>
)

const UserBubble = ({ children }: { children: ReactNode }) => (
  <div className={`${styles.message} ${styles.user}`}>
    <div className={`${styles.bubble} ${styles.userBubble}`}>{children}</div>
  </div>
)

const formatList = (items: string[]) => {
  if (items.length === 0) return ''
  if (items.length === 1) return items[0]
  const head = items.slice(0, -1).join(', ')
  return `${head} 그리고 ${items[items.length - 1]}`
}

export const ChatbotConversation = ({
  status,
  query,
  detail,
  suggestions,
  onReset,
  onSelectSuggestion,
}: ChatbotConversationProps) => {
  const navigate = useNavigate()

  // 추천 버튼 목록은 detail이 있을 때만 노출합니다.
  const otherSuggestions = useMemo(() => {
    if (!detail) return []
    return suggestions.filter((service) => service.id !== detail.id).slice(0, 3)
  }, [detail, suggestions])

  // 검색 결과를 대화용 말풍선으로 변환합니다. detail이 없으면 빈 배열을 반환합니다.
  const conversation = useMemo(() => {
    if (status !== 'success' || !detail) return []

    const messages: Array<{
      id: string
      sender: 'user' | 'assistant'
      content: ReactNode
      tone?: 'default' | 'highlight'
    }> = []

    const onlineSteps = detail.onlineSteps.slice(0, 3)
    const offlineSteps = detail.offlineSteps.slice(0, 2)
    const documentNames = detail.documentChecklistDetails.map((doc) => doc.name)
    const spotlightDocuments = documentNames.slice(0, 3)
    const supportChannels = detail.supportChannelDetails.slice(0, 2)

    if (query) {
      messages.push({
        id: 'user-query',
        sender: 'user',
        content: query,
      })
    }

    messages.push({
      id: 'summary',
      sender: 'assistant',
      tone: 'highlight',
      content: (
        <>
          <p className={styles.label}>챗봇 추천 민원</p>
          <h3 className={styles.title}>{detail.title}</h3>
          <p className={styles.body}>{detail.summary}</p>
        </>
      ),
    })

    if (detail.eligibilityHighlights.length > 0) {
      messages.push({
        id: 'eligibility',
        sender: 'assistant',
        content: (
          <p className={styles.body}>
            우선, {formatList(detail.eligibilityHighlights)} 주민이라면 지원 대상에 해당할 가능성이
            높아요.
          </p>
        ),
      })
    }

    if (onlineSteps.length > 0) {
      messages.push({
        id: 'online',
        sender: 'assistant',
        content: (
          <div>
            <p className={styles.body}>온라인으로 진행하려면 이런 순서를 따라주시면 좋아요.</p>
            <ol className={styles.stepList}>
              {onlineSteps.map((step, index) => (
                <li key={step.title}>
                  <strong>{index + 1}. {step.title}</strong> — {step.description}
                </li>
              ))}
            </ol>
            {detail.onlineSteps.length > onlineSteps.length ? (
              <p className={styles.meta}>추가 단계는 자세한 안내에서 이어집니다.</p>
            ) : null}
          </div>
        ),
      })
    }

    if (offlineSteps.length > 0) {
      messages.push({
        id: 'offline',
        sender: 'assistant',
        content: (
          <div>
            <p className={styles.body}>방문 접수도 가능해요. 주요 순서를 짚어드릴게요.</p>
            <ol className={styles.stepList}>
              {offlineSteps.map((step, index) => (
                <li key={step.title}>
                  <strong>{index + 1}. {step.title}</strong> — {step.description}
                  {step.estimatedTime ? (
                    <span className={styles.meta}> (예상 소요시간 {step.estimatedTime})</span>
                  ) : null}
                </li>
              ))}
            </ol>
            {detail.offlineSteps.length > offlineSteps.length ? (
              <p className={styles.meta}>방문 시 필요한 나머지 절차는 상세 페이지에서 확인하세요.</p>
            ) : null}
          </div>
        ),
      })
    }

    if (spotlightDocuments.length > 0) {
      messages.push({
        id: 'documents',
        sender: 'assistant',
        content: (
          <p className={styles.body}>
            필수 서류는 {formatList(spotlightDocuments)} 등이 있고, 총{' '}
            {documentNames.length}개를 준비해야 합니다. 체크리스트에서 자세히 안내해 드릴게요.
          </p>
        ),
      })
    }

    if (supportChannels.length > 0) {
      messages.push({
        id: 'support',
        sender: 'assistant',
        content: (
          <p className={styles.body}>
            궁금한 점은{' '}
            {formatList(
              supportChannels.map((channel) =>
                channel.contact ? `${channel.name}(${channel.contact})` : channel.name,
              ),
            )}{' '}
            로 문의할 수 있어요.
          </p>
        ),
      })
    }

    messages.push({
      id: 'cta',
      sender: 'assistant',
      content: (
        <p className={styles.body}>
          더 자세한 단계와 서류는 아래 버튼으로 확인해 주세요. 다른 민원도 궁금하면 말 걸어주시면
          돼요!
        </p>
      ),
    })

    return messages
  }, [detail, query, status])

  if (status === 'idle') {
    return (
      <div className={styles.chat} role="log" aria-live="polite">
        <div className={styles.messages}>
          {/* 아무 것도 검색하지 않았을 때 기본 안내 말풍선 */}
          <AssistantBubble tone="highlight">
            <p className={styles.label}>공공복지 챗봇</p>
            <p className={styles.body}>
              안녕하세요! 준비가 궁금한 민원 내용을 보내주시면 온라인과 방문 준비 순서를
              대화형으로 안내해 드릴게요.
            </p>
            <p className={styles.label}>예시 질문</p>
            <ul className={styles.list}>
              <li>기초연금 신청 서류는 뭐가 필요해?</li>
              <li>장애인 활동지원 신청 방법 알려줘</li>
              <li>임신·출산 바우처 신청 순서</li>
            </ul>
          </AssistantBubble>
        </div>
      </div>
    )
  }

  if (status === 'not-found') {
    return (
      <div className={styles.chat} role="log" aria-live="polite">
        <div className={styles.messages}>
          {/* 사용자가 입력을 했지만 일치하는 서비스가 없을 때 안내 */}
          {query && <UserBubble>{query}</UserBubble>}
          <AssistantBubble>
            <p className={styles.body}>
              <strong>{query}</strong>에 대한 안내를 찾지 못했어요. 조금 더 구체적인 서비스 이름이나
              필요한 서류를 알려주시면 다시 찾아볼게요.
            </p>
            <button type="button" onClick={onReset} className={styles.secondaryButton}>
              다른 표현으로 다시 질문하기
            </button>
          </AssistantBubble>
        </div>
      </div>
    )
  }

  if (!detail) {
    return (
      <div className={styles.chat} role="log" aria-live="polite">
        <div className={styles.messages}>
          {/* 비정상적으로 detail이 없는 경우 사용자에게 로딩 메시지 */}
          {query && <UserBubble>{query}</UserBubble>}
          <AssistantBubble>
            <p className={styles.body}>잠시만요, 안내를 불러오는 중입니다.</p>
          </AssistantBubble>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.chat} role="log" aria-live="polite">
      <div className={styles.messages}>
        {conversation.map((message) =>
          message.sender === 'assistant' ? (
            // 챗봇이 말하는 경우 왼쪽 말풍선 + 마스코트 이미지
            <AssistantBubble key={message.id} tone={message.tone}>
              {message.content}
            </AssistantBubble>
          ) : (
            // 사용자가 말하는 경우 오른쪽 말풍선
            <UserBubble key={message.id}>{message.content}</UserBubble>
          ),
        )}
      </div>

      <div className={styles.actions}>
        {/* 주요 CTA: 체크리스트 페이지로 이동 */}
        <button
          type="button"
          onClick={() => navigate(`/services/${detail.id}/checklist`)}
          className={styles.primaryButton}
        >
          필수 서류 체크리스트 열기
        </button>
        <div className={styles.quickRow} role="group" aria-label="추가 선택">
          {/* 별도 질문을 다시 시작하거나 다른 서비스로 이동할 수 있는 빠른 선택 버튼 */}
          <button type="button" onClick={onReset} className={styles.secondaryButton}>
            다른 민원 찾기
          </button>
          {otherSuggestions.map((service) => (
            <button
              key={service.id}
              type="button"
              onClick={() => onSelectSuggestion(service.id)}
              className={styles.quickButton}
            >
              {service.title}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ChatbotConversation
