import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getServiceDetail } from '../../utils/guidanceSearch'
import styles from './DocumentChecklistPage.module.css'

// 체크 상태를 문서 ID별로 저장
type CheckMap = Record<string, boolean>

const DocumentChecklistPage = () => {
  // 항상 유효하다고 가정 → non-null 단언 사용
  const { serviceId } = useParams()
  const id = serviceId!

  // 해당 민원 상세(문서 목록 포함). 항상 존재한다고 가정 → non-null 단언
  const detail = useMemo(() => getServiceDetail(id)!, [id])
  const docs = detail.documentChecklistDetails

  // 각 민원별로 체크 상태를 localStorage에 보존
  const storageKey = `checklist:${id}`
  const [checked, setChecked] = useState<CheckMap>({})

  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey)
      if (raw) setChecked(JSON.parse(raw))
    } catch {}
  }, [storageKey])

  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(checked))
    } catch {}
  }, [storageKey, checked])

  const allIds = docs.map((d) => d.id)
  const allDone = allIds.length > 0 && allIds.every((docId) => checked[docId])

  const toggle = (docId: string) =>
    setChecked((prev) => ({ ...prev, [docId]: !prev[docId] }))
  const markAll = () => setChecked(Object.fromEntries(allIds.map((x) => [x, true])))
  const clearAll = () => setChecked(Object.fromEntries(allIds.map((x) => [x, false])))

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div>
          <p className={styles.lead}>필수 서류 체크리스트</p>
          <h1>{detail.title}</h1>
          <p className={styles.summary}>{detail.summary}</p>
        </div>
        <div className={styles.actions}>
          {!allDone ? (
            <button type="button" onClick={markAll} className={styles.primary}>
              모두 완료로 표시
            </button>
          ) : (
            <button type="button" onClick={clearAll} className={styles.secondary}>
              모두 초기화
            </button>
          )}
        </div>
      </header>

      {/* 표 기반 체크리스트 */}
      <section>
        <table className={styles.table}>
          <thead>
            <tr>
              <th scope="col" style={{ width: 72 }}>
                완료
              </th>
              <th scope="col">서류명</th>
              <th scope="col">발급기관</th>
              <th scope="col">발급 방법</th>
              <th scope="col">비고</th>
              <th scope="col">링크</th>
            </tr>
          </thead>
          <tbody>
            {docs.map((doc) => {
              const nameId = `name-${doc.id}`
              const chkId = `chk-${doc.id}`
              return (
                <tr key={doc.id}>
                  <td>
                    <input
                      id={chkId}
                      type="checkbox"
                      aria-labelledby={nameId}
                      checked={!!checked[doc.id]}
                      onChange={() => toggle(doc.id)}
                    />
                  </td>
                  <td id={nameId} className={styles.nameCell}>
                    {doc.name}
                  </td>
                  <td className={styles.metaCell}>{doc.issuingAuthority}</td>
                  <td>{doc.availableFormats.join(', ')}</td>
                  <td>{doc.preparationNotes ?? ''}</td>
                  <td>
                    {doc.downloadUrl ? (
                      <a href={doc.downloadUrl} target="_blank" rel="noreferrer">
                        다운로드
                      </a>
                    ) : (
                      '-'
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </section>
    </div>
  )
}

export default DocumentChecklistPage
