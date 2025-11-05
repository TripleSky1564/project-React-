import type {
  Category,
  ServiceGuidance,
  ServiceGuidanceDetail,
} from '../../types/guidance'
import { ServiceSummaryCard } from './ServiceSummaryCard'
import styles from './ServiceDetailContent.module.css'

type ServiceDetailContentProps = {
  detail: ServiceGuidanceDetail
  relatedCategory?: Category | null
  relatedServices?: ServiceGuidance[]
  variant?: 'page' | 'inline'
  onDismiss?: () => void
  onSelectRelated?: (serviceId: string) => void
}

export const ServiceDetailContent = ({
  detail,
  relatedCategory,
  relatedServices = [],
  variant = 'page',
  onDismiss,
  onSelectRelated,
}: ServiceDetailContentProps) => {
  const TitleTag: keyof JSX.IntrinsicElements = variant === 'inline' ? 'h2' : 'h1'

  const documentNameMap = new Map(
    detail.documentChecklistDetails.map((doc) => [doc.id, doc.name]),
  )
  const formatDocumentList = (documentIds: string[] = []) =>
    documentIds.map((id) => documentNameMap.get(id) ?? id).join(', ')

  const headerMetaVisible = detail.lastReviewed || onDismiss

  const content = (
    <article className={styles.page}>
      <header className={styles.header}>
        <div className={styles.headerMain}>
          <p className={styles.categoryLabel}>
            {relatedCategory?.title ?? '공공복지 서비스'}
          </p>
          <TitleTag>{detail.title}</TitleTag>
          <p className={variant === 'inline' ? styles.inlineSummary : styles.summary}>
            {detail.summary}
          </p>
        </div>
        {headerMetaVisible && (
          <div className={styles.headerMeta}>
            {detail.lastReviewed && (
              <p className={styles.reviewed}>정보 확인일 {detail.lastReviewed}</p>
            )}
            {onDismiss && (
              <button type="button" onClick={onDismiss} className={styles.closeButton}>
                닫기
              </button>
            )}
          </div>
        )}
      </header>

      <section className={styles.section}>
        <h2>지원 대상 주요 요건</h2>
        <ul className={styles.bulletList}>
          {detail.eligibilityHighlights.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <section className={styles.channelSection}>
        <div className={styles.channelCard}>
          <h2>온라인 신청 단계</h2>
          <ol className={styles.stepList}>
            {detail.onlineSteps.map((step) => (
              <li key={step.title}>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
                {step.requiredDocuments && step.requiredDocuments.length > 0 && (
                  <p className={styles.documentHint}>
                    준비 서류: {formatDocumentList(step.requiredDocuments)}
                  </p>
                )}
              </li>
            ))}
          </ol>
        </div>
        <div className={styles.channelCard}>
          <h2>방문 신청 단계</h2>
          <ol className={styles.stepList}>
            {detail.offlineSteps.map((step) => (
              <li key={step.title}>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
                {step.estimatedTime && (
                  <p className={styles.eta}>예상 소요시간: {step.estimatedTime}</p>
                )}
                {step.requiredDocuments && step.requiredDocuments.length > 0 && (
                  <p className={styles.documentHint}>
                    준비 서류: {formatDocumentList(step.requiredDocuments)}
                  </p>
                )}
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className={styles.section}>
        <h2>필수 서류 체크리스트</h2>
        <div className={styles.documentList}>
          {detail.documentChecklistDetails.map((document) => (
            <article key={document.id} className={styles.documentCard}>
              <h3>{document.name}</h3>
              <p className={styles.meta}>{document.issuingAuthority}</p>
              {document.purpose && <p>{document.purpose}</p>}
              <p>
                발급 가능: {document.availableFormats.join(', ')}
                {document.downloadUrl && (
                  <>
                    {' '}
                    ·{' '}
                    <a href={document.downloadUrl} target="_blank" rel="noreferrer">
                      온라인 발급 바로가기
                    </a>
                  </>
                )}
              </p>
              {document.fee && <p>수수료 {document.fee}</p>}
              {document.preparationNotes && <p>{document.preparationNotes}</p>}
            </article>
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <h2>상담 및 방문 안내</h2>
        <div className={styles.channelGrid}>
          {detail.supportChannelDetails.map((channel) => (
            <article key={channel.id} className={styles.channelCardDense}>
              <h3>{channel.name}</h3>
              <p className={styles.meta}>{channel.type}</p>
              {channel.address && <p>{channel.address}</p>}
              {channel.hours && <p>운영시간 {channel.hours}</p>}
              <p className={styles.meta}>{channel.contact}</p>
              {channel.notes && <p>{channel.notes}</p>}
              {channel.appointmentRequired && <p>※ 방문 전 예약이 필요합니다.</p>}
            </article>
          ))}
        </div>
      </section>

      {relatedServices.length > 0 && (
        <section className={styles.section}>
          <h2>이 서비스와 함께 보면 좋은 안내</h2>
          <div className={styles.relatedGrid}>
            {relatedServices.map((service) => (
              <ServiceSummaryCard
                key={service.id}
                service={service}
                onSelect={onSelectRelated}
              />
            ))}
          </div>
        </section>
      )}
    </article>
  )

  if (variant === 'inline') {
    return <div className={styles.inlineWrapper}>{content}</div>
  }

  return content
}

export default ServiceDetailContent
