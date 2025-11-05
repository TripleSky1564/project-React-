import type {
  Category,
  DocumentRequirement,
  GuidanceContent,
  ServiceGuidance,
  SupportChannel,
} from '../types/guidance'

const documentRequirements: DocumentRequirement[] = [
  {
    id: 'resident-registration-card',
    name: '주민등록증 사본',
    issuingAuthority: '주민센터',
    availableFormats: ['copy'],
    preparationNotes: '원본 지참 후 민원실에서 사본 발급 가능',
  },
  {
    id: 'income-certificate',
    name: '소득금액증명서',
    issuingAuthority: '국세청',
    availableFormats: ['download', 'in-person'],
    downloadUrl: 'https://www.gov.kr/mw/AA040InfoCappView.do?CappBizCD=15000001853',
    preparationNotes: '정부24 또는 홈택스에서 공동인증서 로그인 후 발급',
  },
  {
    id: 'family-relationship',
    name: '가족관계증명서',
    issuingAuthority: '법원 가족관계등록부',
    availableFormats: ['download', 'in-person'],
    downloadUrl: 'https://efamily.scourt.go.kr/',
  },
  {
    id: 'medical-certificate',
    name: '장애진단서',
    issuingAuthority: '의료기관',
    availableFormats: ['in-person'],
    preparationNotes: '주치의 또는 지정 병·의원에서 발급',
  },
  {
    id: 'pregnancy-certificate',
    name: '임신확인서',
    issuingAuthority: '산부인과',
    availableFormats: ['in-person'],
    preparationNotes: '병원 방문 시 신분증 지참',
  },
  {
    id: 'bank-account',
    name: '본인 명의 통장 사본',
    issuingAuthority: '은행',
    availableFormats: ['copy'],
  },
]

const supportChannels: SupportChannel[] = [
  {
    id: 'seoul-welfare-center',
    type: 'office',
    name: '서울시 종합복지지원센터',
    address: '서울특별시 중구 세종대로 110',
    hours: '평일 09:00-18:00 (토·일·공휴일 휴무)',
    contact: '02-1234-5678',
    notes: '접수 마감 30분 전까지 방문 필요',
  },
  {
    id: 'gov-call-center',
    type: 'call-center',
    name: '정부민원안내 콜센터',
    contact: '국번없이 110',
    hours: '평일 09:00-18:00',
    notes: '청각장애인 문자상담 110+0',
  },
  {
    id: 'gov24',
    type: 'online-portal',
    name: '정부24 온라인 민원',
    contact: 'https://www.gov.kr',
    notes: '공동·금융인증서 로그인 필요',
  },
  {
    id: 'health-center',
    type: 'office',
    name: '구청 보건소 모자보건실',
    address: '각 구청 보건소',
    hours: '평일 09:00-18:00',
    contact: '보건소 콜센터 129',
    appointmentRequired: true,
  },
]

const categories: Category[] = [
  {
    id: 'senior-support',
    title: '어르신 지원',
    description: '기초연금, 노인돌봄 등 어르신 생활안정 지원',
    icon: 'elderly',
    primaryColor: '#4BA4E6',
    serviceIds: ['basic-pension', 'senior-care'],
  },
  {
    id: 'childcare',
    title: '임신 · 육아',
    description: '임신 초기부터 양육까지 필요한 지원',
    icon: 'family',
    primaryColor: '#72C6EF',
    serviceIds: ['pregnancy-voucher', 'childcare-fee'],
  },
  {
    id: 'disability',
    title: '장애인 지원',
    description: '장애 정도와 생애주기별 맞춤 지원',
    icon: 'accessibility',
    primaryColor: '#5CB8A9',
    serviceIds: ['disability-allowance', 'mobility-support'],
  },
]

const services: ServiceGuidance[] = [
  {
    id: 'basic-pension',
    title: '기초연금 신청',
    summary: '만 65세 이상 소득 하위 70% 어르신께 월 최대 323,180원을 지원합니다.',
    categories: [{ id: 'senior-support' }],
    eligibilityHighlights: [
      '만 65세 이상 대한민국 국적',
      '소득인정액 기준 공표금액 이내',
      '대한민국 내 거주',
    ],
    onlineSteps: [
      {
        title: '정부24 로그인',
        description: '공동·금융인증서로 정부24에 로그인합니다.',
        requiredDocuments: ['resident-registration-card'],
      },
      {
        title: '기초연금 신청서 작성',
        description: '본인 및 배우자 정보를 입력하고 필요한 동의 항목을 선택합니다.',
        requiredDocuments: ['income-certificate', 'bank-account'],
      },
    ],
    offlineSteps: [
      {
        title: '주민센터 방문 접수',
        description: '거주지 관할 주민센터에서 신분 확인 후 신청서를 제출합니다.',
        requiredDocuments: ['resident-registration-card', 'bank-account', 'income-certificate'],
        estimatedTime: '30분 내외',
      },
    ],
    documentChecklist: ['resident-registration-card', 'income-certificate', 'bank-account'],
    supportChannels: ['seoul-welfare-center', 'gov-call-center'],
    lastReviewed: '2025-01-05',
  },
  {
    id: 'senior-care',
    title: '노인맞춤돌봄서비스 신청',
    summary: '일상생활 지원이 필요한 어르신에게 방문 돌봄, 주거환경 개선 등 통합 서비스를 제공합니다.',
    categories: [{ id: 'senior-support' }],
    eligibilityHighlights: [
      '만 65세 이상 중위소득 160% 이하',
      '독거 또는 고령 부부 가구',
      '돌봄 필요 판정',
    ],
    onlineSteps: [
      {
        title: '정부24 또는 시군구 신청 페이지 접속',
        description: '정부24 FAQ를 참고하여 온라인 안내를 확인합니다.',
      },
      {
        title: '서비스 상담 예약',
        description: '전화 또는 온라인 예약으로 담당자 상담 일정을 잡습니다.',
      },
    ],
    offlineSteps: [
      {
        title: '거주지 주민센터 방문',
        description: '필수 서류를 제출하고 생활실태 조사를 신청합니다.',
        requiredDocuments: ['resident-registration-card', 'income-certificate'],
      },
    ],
    documentChecklist: ['resident-registration-card', 'income-certificate'],
    supportChannels: ['seoul-welfare-center', 'gov-call-center'],
    lastReviewed: '2025-01-10',
  },
  {
    id: 'pregnancy-voucher',
    title: '임신·출산 진료비 바우처 신청',
    summary: '임산부의 진료비 부담 완화를 위해 100만원 상당의 국민행복카드를 지원합니다.',
    categories: [{ id: 'childcare' }],
    eligibilityHighlights: [
      '임신이 확인된 대한민국 국적 또는 등록외국인',
      '국민행복카드 신규 또는 추가 등록 대상',
    ],
    onlineSteps: [
      {
        title: '금융사 앱 또는 홈페이지 로그인',
        description: '국민행복카드 발급 가능 은행(국민/롯데/비씨/삼성 등) 접속 후 신청 메뉴로 이동합니다.',
      },
      {
        title: '임신확인 정보 입력',
        description: '임신 주수, 병원 정보, 출산 예정일을 입력하고 임신확인서 사진을 첨부합니다.',
        requiredDocuments: ['pregnancy-certificate'],
      },
    ],
    offlineSteps: [
      {
        title: '카드사 영업점 방문',
        description: '임신확인서와 신분증을 제출하고 국민행복카드를 발급받습니다.',
        requiredDocuments: ['pregnancy-certificate', 'resident-registration-card'],
      },
    ],
    documentChecklist: ['pregnancy-certificate', 'resident-registration-card'],
    supportChannels: ['health-center', 'gov-call-center'],
    notes: '다태아 임신의 경우 지원 한도가 추가 부여됩니다.',
  },
  {
    id: 'childcare-fee',
    title: '양육수당 신청',
    summary: '어린이집 미이용 가정의 만 0~5세 영유아에게 월 최대 20만원의 양육수당을 지급합니다.',
    categories: [{ id: 'childcare' }],
    eligibilityHighlights: ['대한민국 거주 영유아', '어린이집 및 유치원 미이용'],
    onlineSteps: [
      {
        title: '복지로 사이트 접속',
        description: '공동인증서 로그인 후 양육수당 온라인신청을 선택합니다.',
        requiredDocuments: ['resident-registration-card', 'bank-account'],
      },
    ],
    offlineSteps: [
      {
        title: '읍면동 주민센터 방문',
        description: '신분증과 통장 사본을 지참하여 신청서를 작성합니다.',
        requiredDocuments: ['resident-registration-card', 'bank-account', 'family-relationship'],
      },
    ],
    documentChecklist: ['resident-registration-card', 'bank-account', 'family-relationship'],
    supportChannels: ['seoul-welfare-center', 'gov-call-center'],
  },
  {
    id: 'disability-allowance',
    title: '장애수당 신청',
    summary: '장애정도가 심하지 않은 등록장애인의 생활안정 지원을 위해 월 6만원을 지급합니다.',
    categories: [{ id: 'disability' }],
    eligibilityHighlights: [
      '장애정도 심하지 않은 등록장애인',
      '소득인정액 선정기준 이하',
    ],
    onlineSteps: [
      {
        title: '복지로 온라인 신청',
        description: '공동인증서 로그인 후 장애수당 메뉴에서 신청합니다.',
        requiredDocuments: ['resident-registration-card', 'income-certificate'],
      },
    ],
    offlineSteps: [
      {
        title: '주민센터 사회복지과 방문',
        description:
          '필수 서류 제출 후 담당 공무원 상담을 통해 자격 확인 및 접수합니다.',
        requiredDocuments: [
          'resident-registration-card',
          'income-certificate',
          'medical-certificate',
        ],
      },
    ],
    documentChecklist: ['resident-registration-card', 'income-certificate', 'medical-certificate'],
    supportChannels: ['seoul-welfare-center', 'gov-call-center'],
  },
  {
    id: 'mobility-support',
    title: '장애인 활동지원 서비스',
    summary: '일상생활이 어려운 장애인에게 활동지원사를 연결하여 돌봄 및 이동을 지원합니다.',
    categories: [{ id: 'disability' }],
    eligibilityHighlights: ['만 6세 이상', '장애 정도 심함', '서비스 지원 종합조사 42점 이상'],
    onlineSteps: [
      {
        title: '복지로 사전 상담 신청',
        description:
          '상담 예약을 통해 활동지원 급여 신청 절차와 제출 서류를 확인합니다.',
      },
    ],
    offlineSteps: [
      {
        title: '거주지 주민센터 방문 신청',
        description: '사전 상담에서 안내받은 서류를 제출하고 종합조사를 신청합니다.',
        requiredDocuments: [
          'resident-registration-card',
          'medical-certificate',
          'income-certificate',
        ],
        estimatedTime: '40분 내외',
      },
    ],
    documentChecklist: [
      'resident-registration-card',
      'medical-certificate',
      'income-certificate',
    ],
    supportChannels: ['seoul-welfare-center', 'gov-call-center'],
    notes: '소득 수준에 따라 본인부담금이 발생할 수 있습니다.',
  },
]

export const guidanceContent: GuidanceContent = {
  categories,
  documents: documentRequirements,
  services,
  supportChannels,
}

export const getServiceById = (id: string) =>
  services.find((service) => service.id === id) ?? null

export const getDocumentById = (id: string) =>
  documentRequirements.find((doc) => doc.id === id) ?? null

export const getSupportChannelById = (id: string) =>
  supportChannels.find((channel) => channel.id === id) ?? null
