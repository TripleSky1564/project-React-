  import { useEffect, useMemo, useState } from 'react'
  import styles from './NearbyOfficesPage.module.css'

  type OfficeCategory = 'all' | 'welfare' | 'civil' | 'employment'
  type OfficeInfo = {
    id: string
    name: string
    category: OfficeCategory
    address: string
    distanceKm: number
    phone?: string
    openingHours?: string
    mapPosition: { lat: number; lng: number }
  }

  const categoryFilters: { id: OfficeCategory; label: string }[] = [
    { id: 'all', label: '전체' },
    { id: 'welfare', label: '복지' },
    { id: 'civil', label: '민원' },
    { id: 'employment', label: '취업·지원' },
  ]

  // TODO: 실제 API 연동 시 이 목록을 서버 응답으로 교체하세요.
  const mockOffices: OfficeInfo[] = []

  const NearbyOfficesPage = () => {
    const [category, setCategory] = useState<OfficeCategory>('all')
    const [maxDistance, setMaxDistance] = useState(5)

    const filteredOffices = useMemo(() => {
      return mockOffices.filter((office) => {
        const categoryMatch = category === 'all' || office.category === category
        const distanceMatch = office.distanceKm <= maxDistance
        return categoryMatch && distanceMatch
      })
    }, [category, maxDistance])

    useEffect(() => {
      if (typeof window === 'undefined') return
      const mapContainer = document.getElementById('nearby-map')
      if (!mapContainer) return

      // TODO: 지도 API 스크립트를 로드한 뒤 이곳에서 지도 인스턴스를 생성하세요.
      // 예: const map = new kakao.maps.Map(mapContainer, { center: ..., level: ... });
    }, [])

    const focusOfficeOnMap = (officeId: string) => {
      // TODO: 지도 API 연동 후 해당 마커로 이동하도록 구현하세요.
      console.log('지도에서 강조할 관공서 ID:', officeId)
    }

    return (
      <div className={styles.page}>
        <header className={styles.header}>
          <div className={styles.pageTitle}>
            <h1>가까운 관공서 찾기</h1>
            <p>내 주변의 복지·민원 기관을 지도에서 바로 확인하고, 연락처와 운영시간도 함께 살펴보세요.</p>
          </div>

          <div className={styles.filters}>
            <div className={styles.filterGroup}>
              <span>분류</span>
              <div className={styles.filterButtons}>
                {categoryFilters.map((filter) => (
                  <button
                    key={filter.id}
                    type="button"
                    className={`${styles.filterButton} ${
                      category === filter.id ? styles.filterButtonActive : ''
                    }`}
                    onClick={() => setCategory(filter.id)}
                  >
                    {filter.label}
                  </button>
                ))}
              </div>
            </div>

            <label className={styles.distanceControl}>
              <span>반경 {maxDistance}km 이내</span>
              <input
                type="range"
                min={1}
                max={20}
                step={1}
                value={maxDistance}
                onChange={(event) => setMaxDistance(Number(event.target.value))}
              />
            </label>
          </div>
        </header>

        <div className={styles.content}>
          <section className={styles.mapSection}>
            <div
              id="nearby-map"
              className={styles.mapFrame}
              aria-label="관공서 위치 지도"
            >
              {/* 지도 API를 연결하면 여기에 실제 지도가 렌더링됩니다. */}
              지도 로딩 중…
            </div>
            <p className={styles.mapHelper}>지도를 확대·축소하거나 마커를 눌러 상세 정보를 확인하세요.</p>
          </section>

          <section className={styles.listSection}>
            {filteredOffices.length === 0 ? (
              <div className={styles.emptyState}>
                <strong>주변 관공서를 찾지 못했습니다.</strong>
                <span>검색 범위를 넓히거나 다른 카테고리를 선택해보세요.</span>
              </div>
            ) : (
              filteredOffices.map((office) => (
                <article key={office.id} className={styles.officeCard}>
                  <header>
                    <h3>{office.name}</h3>
                    <span className={styles.badge}>{office.category}</span>
                  </header>
                  <p className={styles.meta}>{office.address}</p>
                  <p className={styles.meta}>거리 약 {office.distanceKm}km</p>
                  {office.phone && <p>전화: {office.phone}</p>}
                  {office.openingHours && <p>운영 시간: {office.openingHours}</p>}
                  <button
                    type="button"
                    className={styles.focusButton}
                    onClick={() => focusOfficeOnMap(office.id)}
                  >
                    지도에서 보기
                  </button>
                </article>
              ))
            )}
          </section>
        </div>
      </div>
    )
  }

  export default NearbyOfficesPage
