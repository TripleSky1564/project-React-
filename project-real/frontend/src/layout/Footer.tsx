import styles from './Footer.module.css'

export const Footer = () => (
  <footer className={styles.footer}>
    <div className={styles.container}>
      <div>
        <p className={styles.title}>공공복지 서비스 도우미</p>
        <p className={styles.caption}>
          국민 누구나 쉽게 민원 서류를 준비할 수 있도록 돕는 챗봇 안내 서비스입니다.
        </p>
      </div>
      <div className={styles.meta}>
        <p>상담 대표번호 110 (정부민원안내)</p>
        <p>운영시간 평일 09:00-18:00 (공휴일 제외)</p>
        <p className={styles.small}>© {new Date().getFullYear()} 공공복지부</p>
      </div>
    </div>
  </footer>
)

export default Footer
