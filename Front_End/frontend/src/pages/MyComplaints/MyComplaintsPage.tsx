import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './MyComplaintsPage.module.css'

// TODO: 민원 목록이 준비되면 API 응답으로 채워주세요.
const filters = [
  { id: 'all', label: '전체' },
  { id: 'processing', label: '진행 중' },
  { id: 'completed', label: '완료' },
]

const MyComplaintsPage = () => {
  // 실제 서비스에서는 사용자 세션에서 민원 목록을 불러와 이 상태를 채웁니다.
  const [activeFilter, setActiveFilter] = useState(filters[0].id)

  const stats = { total: 0, processing: 0, completed: 0 }
  // TODO: 실제 민원 데이터가 준비되면 서버 응답으로 통계를 갱신하고
  // 아래 목록에 민원 카드를 그려주세요.

  const handleFilterChange = (filterId: string) => setActiveFilter(filterId)

  const navigate = useNavigate()

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.titleGroup}>
          <h1>나의 민원 현황</h1>
          <p>진행 중인 민원과 완료된 민원 기록을 모아 한눈에 확인할 수 있습니다.</p>
        </div>
        <div className={styles.overview}>
          <div className={styles.statCard}>
            <p className={styles.statLabel}>전체 민원</p>
            <p className={styles.statValue}>{stats.total}</p>
          </div>
          <div className={styles.statCard}>
            <p className={styles.statLabel}>진행 중</p>
            <p className={styles.statValue}>{stats.processing}</p>
          </div>
          <div className={styles.statCard}>
            <p className={styles.statLabel}>완료</p>
            <p className={styles.statValue}>{stats.completed}</p>
          </div>
        </div>

        
        <div className={styles.quickActions}>
          <button type="button" className={styles.primaryButton} onClick={()=>navigate('/')}>
            새 민원 접수 시작하기
          </button>
        </div>
      </header>

      <div className={styles.filterRow}>
        {filters.map((filter) => (
          <button
            key={filter.id}
            type="button"
            className={`${styles.filterButton} ${
              activeFilter === filter.id ? styles.filterButtonActive : ''
            }`}
            onClick={() => handleFilterChange(filter.id)}
          >
            {filter.label}
          </button>
        ))}
      </div>

      <section className={styles.list}>
        <div className={styles.emptyState}>
          <strong>등록된 민원이 아직 없습니다.</strong>
          <span>첫 민원을 접수한 뒤 진행 단계를 이곳에서 확인할 수 있어요.</span>
        </div>
      </section>
    </div>
  )
}

export default MyComplaintsPage
