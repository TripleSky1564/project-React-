import type { ReactNode } from 'react'
import styles from './ChatbotConversation.module.css'
import mascotFace from '../../img/logo_face.png'

type ChatMessage = {
  id: string
  sender: 'user' | 'assistant'
  content: string
  tone?: 'default' | 'highlight'
  isStreaming?: boolean
}

type ChatbotConversationProps = {
  messages?: ChatMessage[]
  isStreaming?: boolean
  onReset: () => void
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

export const ChatbotConversation = ({
  messages = [],
  isStreaming = false,
  onReset,
}: ChatbotConversationProps) => {
  const safeMessages = messages.filter(
    (message): message is ChatMessage =>
      Boolean(message) && (message.sender === 'user' || message.sender === 'assistant'),
  )
  const hasMessages = safeMessages.length > 0

  return (
    <div className={styles.chat} role="log" aria-live="polite">
      <div className={styles.messages}>
        {hasMessages ? (
          safeMessages.map((message) =>
            message.sender === 'assistant' ? (
              <AssistantBubble key={message.id} tone={message.tone}>
                <p className={styles.body}>{message.content || ' '}</p>
                {message.isStreaming ? <span className={styles.typing}>답변 작성 중…</span> : null}
              </AssistantBubble>
            ) : (
              <UserBubble key={message.id}>
                <p className={styles.body}>{message.content}</p>
              </UserBubble>
            ),
          )
        ) : (
          <AssistantBubble tone="highlight">
            <p className={styles.body}>
              안녕하세요! 궁금한 민원이나 상담 내용을 입력하면 바로 안내를 드릴게요.
            </p>
            <p className={styles.body}>예: 주민등록 등본은 어디서 발급받나요?</p>
          </AssistantBubble>
        )}

        {isStreaming && !safeMessages.some((message) => message.isStreaming) ? (
          <AssistantBubble>
            <p className={styles.body}>답변을 불러오는 중입니다…</p>
          </AssistantBubble>
        ) : null}
      </div>

      {hasMessages ? (
        <div className={styles.actions}>
          <button type="button" onClick={onReset} className={styles.secondaryButton}>
            대화 초기화
          </button>
        </div>
      ) : null}
    </div>
  )
}

export default ChatbotConversation
