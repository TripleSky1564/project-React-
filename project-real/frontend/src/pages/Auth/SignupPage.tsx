import { type FormEvent, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import styles from './AuthPage.module.css'
import { useAuth } from '../../context/AuthContext'
import {
  createVerificationCode,
  isValidPhoneNumber,
  normalizePhoneNumber,
} from '../../utils/phoneVerification'

type Alert = { type: 'success' | 'error'; text: string }

export const SignupPage = () => {
  const navigate = useNavigate()
  const { register } = useAuth()

  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [inputCode, setInputCode] = useState('')
  const [issuedCode, setIssuedCode] = useState<string | null>(null)
  const [verified, setVerified] = useState(false)
  const [alert, setAlert] = useState<Alert | null>(null)
  const [isSubmitting, setSubmitting] = useState(false)

  // 회원가입을 새로 시작하면 기존 인증 상태는 초기화합니다.
  const resetVerificationState = () => {
    setInputCode('')
    setIssuedCode(null)
    setVerified(false)
  }

  const handleSendCode = () => {
    const normalizedPhone = normalizePhoneNumber(phone)
    if (!name.trim()) {
      setAlert({ type: 'error', text: '이름을 먼저 입력해주세요.' })
      return
    }
    if (!isValidPhoneNumber(normalizedPhone)) {
      setAlert({ type: 'error', text: '휴대전화 번호를 정확히 입력해주세요.' })
      return
    }

    const code = createVerificationCode()
    setIssuedCode(code)
    setInputCode('')
    setVerified(false)
    setAlert({
      type: 'success',
      text: `인증번호를 발송했어요. (시연용 코드: ${code})`,
    })
  }

  const handleVerifyCode = () => {
    if (!issuedCode) {
      setAlert({ type: 'error', text: '먼저 인증번호를 발송해주세요.' })
      return
    }
    if (issuedCode !== inputCode.trim()) {
      setAlert({ type: 'error', text: '인증번호가 일치하지 않습니다.' })
      setVerified(false)
      return
    }

    setVerified(true)
    setAlert({ type: 'success', text: '휴대전화 인증이 완료되었습니다.' })
  }

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    if (!name.trim()) {
      setAlert({ type: 'error', text: '이름을 입력해주세요.' })
      return
    }

    const normalizedPhone = normalizePhoneNumber(phone)
    if (!isValidPhoneNumber(normalizedPhone)) {
      setAlert({ type: 'error', text: '휴대전화 번호를 정확히 입력해주세요.' })
      return
    }

    if (!verified) {
      setAlert({
        type: 'error',
        text: '휴대전화 인증을 완료해야 회원가입이 진행됩니다.',
      })
      return
    }

    setSubmitting(true)
    // 실제 서비스에서는 서버에 회원 정보를 전달하는 API 요청이 필요합니다.
    register({ name: name.trim(), phone: normalizedPhone })
    setAlert({
      type: 'success',
      text: '회원가입이 완료되었습니다. 안내 화면으로 이동합니다.',
    })

    setTimeout(() => {
      navigate('/')
    }, 1000)
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <header>
          <h1 className={styles.title}>회원가입</h1>
          <p className={styles.description}>
            이름과 휴대전화 인증으로 간편하게 회원가입을 진행합니다.
          </p>
        </header>

        {alert && (
          <p
            role="status"
            className={`${styles.message} ${
              alert.type === 'success' ? styles.messageSuccess : styles.messageError
            }`}
          >
            {alert.text}
          </p>
        )}

        <form className={styles.form} onSubmit={handleSubmit}>
          <label className={styles.field}>
            <span className={styles.label}>이름</span>
            <input
              className={styles.input}
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="이름을 입력하세요"
              autoComplete="name"
            />
          </label>

          <label className={styles.field}>
            <span className={styles.label}>휴대전화 번호</span>
            <input
              className={styles.input}
              type="tel"
              value={phone}
              onChange={(event) => {
                setPhone(event.target.value)
                resetVerificationState()
              }}
              placeholder="예) 01012345678"
              autoComplete="tel-national"
            />
            <p className={styles.helper}>숫자만 입력해주세요. 실제 문자 발송 대신 코드가 안내됩니다.</p>
          </label>

          <div className={styles.field}>
            <button
              type="button"
              className={styles.button}
              onClick={handleSendCode}
              disabled={isSubmitting}
            >
              인증번호 발송
            </button>
          </div>

          <label className={styles.field}>
            <span className={styles.label}>인증번호</span>
            <input
              className={styles.input}
              type="text"
              value={inputCode}
              onChange={(event) => setInputCode(event.target.value)}
              placeholder="6자리 숫자 입력"
              inputMode="numeric"
              autoComplete="one-time-code"
            />
          </label>

          <div className={styles.field}>
            <button
              type="button"
              className={styles.secondaryButton}
              onClick={handleVerifyCode}
              disabled={isSubmitting}
            >
              인증번호 확인
            </button>
            {verified && (
              <span className={`${styles.helper} ${styles.codePreview}`}>인증 완료</span>
            )}
          </div>

          <button type="submit" className={styles.button} disabled={isSubmitting || !verified}>
            회원가입 완료
          </button>
        </form>

        <p className={styles.linkRow}>
          이미 가입하셨나요?
          <Link to="/login" className={styles.link}>
            로그인하기
          </Link>
        </p>
      </div>
    </div>
  )
}

export default SignupPage
