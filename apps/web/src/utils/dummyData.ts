// 고객 데이터
export interface Customer {
  id: string;
  type: "customer" | "singer";
  name: string;
  company: string;
  email: string;
  phone: string;
  profileImage?: string;
  statusMessage?: string;
  address: string;
  department?: string; // for customers
  genre?: string; // for singers
  agency?: string; // for singers
  grade: 1 | 2 | 3 | 4 | 5;
  memo?: string;
  assignedTo?: string;
  status: "active" | "inactive";
  createdAt: string;
  requestCount: number;
  lastRequestDate: string;
  contractCount: number;
  reviewCount: number;
  registrationDate: string;
  updatedAt: string;
  role: string;
}

// 요청서 데이터
export interface Request {
  id: string;
  customerId: string;
  customerName: string;
  customerCompany: string;
  eventType: string;
  eventDate: string;
  venue: string;
  budget: string;
  requirements: string;
  status: "pending" | "in_progress" | "completed" | "cancelled";
  createdAt: string;
  updatedAt: string;
  customer: Customer | null;
  title: string;
  description: string;
  eventTime: string;
  singerId?: string;
  singerName?: string;
  singer?: Singer | null;
}

// 가수 데이터
export interface Singer {
  id: string;
  name: string;
  agency: string;
  genre: string;
  email: string;
  phone: string;
  profileImage?: string;
  statusMessage?: string;
  address: string;
  grade: 1 | 2 | 3 | 4 | 5;
  rating: number;
  status: "active" | "inactive";
  createdAt: string;
  contractCount: number;
  lastRequestDate: string;
  reviewCount: number;
  registrationDate: string;
  updatedAt: string;
  role: string;
  genres: string[];
  experience: number;
  price: number;
}

// 매칭 데이터
export interface Match {
  id: string;
  requestId: string;
  requestTitle: string;
  customerId: string;
  customerName: string;
  customerCompany: string;
  singerId: string;
  singerName: string;
  singerAgency: string;
  eventDate: string;
  venue: string;
  status: "pending" | "negotiating" | "confirmed" | "cancelled";
  budget: string;
  requirements: string;
  createdAt: string;
  updatedAt: string;
  request: Request | null;
  singer: Singer | null;
  notes: string;
  price: number;
}

// 스케줄 데이터
export interface Schedule {
  id: string;
  matchId: string;
  requestId: string;
  customerId: string;
  customerName: string;
  customerCompany: string;
  singerId: string;
  singerName: string;
  singerAgency: string;
  eventTitle: string;
  eventDate: string;
  startTime: string;
  endTime: string;
  venue: string;
  status: "scheduled" | "in_progress" | "completed" | "cancelled" | "changed";
  details: string;
  createdAt: string;
  updatedAt: string;
  request: Request | null;
  match: Match | null;
  customer: Customer | null;
  singer: Singer | null;
}

// 계약 데이터
export interface Contract {
  id: string;
  matchId: string;
  scheduleId: string;
  requestId: string;
  customerId: string;
  customerName: string;
  customerCompany: string;
  singerId: string;
  singerName: string;
  singerAgency: string;
  eventTitle: string;
  eventDate: string;
  venue: string;
  contractAmount: string;
  paymentStatus: "unpaid" | "partial" | "paid";
  contractStatus: "draft" | "sent" | "signed" | "completed" | "cancelled";
  createdAt: string;
  signedAt?: string;
}

// 협상 로그 데이터
export interface NegotiationLog {
  id: string;
  matchId: string;
  date: string;
  type: string;
  content: string;
  user: string;
}

// 결제 데이터
export interface Payment {
  id: string;
  contractId: string;
  customerId: string;
  customerName: string;
  amount: string;
  paymentMethod: string;
  paymentDate: string;
  status: "pending" | "completed" | "failed" | "refunded";
}

// 리뷰 데이터
export interface Review {
  id: string;
  contractId: string;
  customerId: string;
  customerName: string;
  singerId: string;
  singerName: string;
  rating: number;
  content: string;
  createdAt: string;
  status: "published" | "hidden";
}

// 실제 더미 데이터
export const customers: Customer[] = [
  {
    id: "CUST-001",
    type: "customer",
    name: "김민수",
    company: "(주)이벤트 플래닝",
    email: "minsu.kim@eventplanning.com",
    phone: "010-1234-5678",
    profileImage: "/images/customers/customer1.jpg",
    statusMessage: "웨딩 및 기업 행사 전문",
    address: "서울시 강남구 테헤란로 123",
    department: "기획팀",
    grade: 3,
    memo: "웨딩 행사를 주로 담당하며 VIP 고객",
    assignedTo: "이영희 매니저",
    status: "active",
    createdAt: "2024-05-15",
    requestCount: 5,
    lastRequestDate: "2025-02-15",
    contractCount: 3,
    reviewCount: 2,
    registrationDate: "2024-05-15",
    updatedAt: "2025-02-15",
    role: "고객",
  },
  {
    id: "CUST-002",
    type: "customer",
    name: "이지영",
    company: "웨딩 홀 A",
    email: "jiyoung.lee@weddinghall.com",
    phone: "010-2345-6789",
    statusMessage: "월 2-3회 웨딩 행사",
    address: "서울시 서초구 반포대로 45",
    department: "웨딩사업부",
    grade: 3,
    memo: "매달 정기적으로 가수 섭외 요청",
    assignedTo: "김철수 매니저",
    status: "active",
    createdAt: "2024-07-05",
    requestCount: 3,
    lastRequestDate: "2025-03-10",
    contractCount: 1,
    reviewCount: 1,
    registrationDate: "2024-07-10",
    updatedAt: "2025-03-10",
    role: "고객",
  },
  {
    id: "CUST-003",
    type: "customer",
    name: "박준호",
    company: "대학 축제 위원회",
    email: "junho.park@university.edu",
    phone: "010-3456-7890",
    statusMessage: "대학 축제 위원회",
    address: "서울시 서초구 반포대로 45",
    department: "축제 위원회",
    grade: 5,
    memo: "대학 축제 위원회",
    assignedTo: "축제 위원회",
    status: "active",
    createdAt: "2024-08-15",
    requestCount: 1,
    lastRequestDate: "2025-04-10",
    contractCount: 0,
    reviewCount: 0,
    registrationDate: "2024-08-15",
    updatedAt: "2025-02-25",
    role: "고객",
  },
  {
    id: "CUST-004",
    type: "customer",
    name: "최유진",
    company: "(주)테크놀로지",
    email: "yujin.choi@tech.com",
    phone: "010-4567-8901",
    statusMessage: "(주)테크놀로지",
    address: "서울시 서초구 반포대로 45",
    department: "기술개발부",
    grade: 5,
    memo: "(주)테크놀로지",
    assignedTo: "기술개발부",
    status: "active",
    createdAt: "2024-02-20",
    requestCount: 1,
    lastRequestDate: "2024-03-01",
    contractCount: 0,
    reviewCount: 0,
    registrationDate: "2024-02-20",
    updatedAt: "2024-03-01",
    role: "고객",
  },
  {
    id: "CUST-005",
    type: "customer",
    name: "권나은",
    company: "(주)코스메틱 브랜드",
    email: "naeun.kwon@cosmetic.com",
    phone: "010-5678-9012",
    profileImage: "/images/customers/customer5.jpg",
    statusMessage: "(주)코스메틱 브랜드",
    address: "서울시 서초구 반포대로 45",
    department: "마케팅부",
    grade: 3,
    memo: "(주)코스메틱 브랜드",
    assignedTo: "마케팅부",
    status: "active",
    createdAt: "2023-11-20",
    requestCount: 3,
    lastRequestDate: "2024-02-28",
    contractCount: 2,
    reviewCount: 1,
    registrationDate: "2023-11-20",
    updatedAt: "2024-02-28",
    role: "고객",
  },
];

export const singers: Singer[] = [
  {
    id: "SINGER-001",
    name: "김태희",
    agency: "스타 엔터테인먼트",
    genre: "발라드",
    email: "taehee.kim@singers.com",
    phone: "010-9876-5432",
    profileImage: "/images/singers/singer1.jpg",
    statusMessage: "웨딩 축가 전문",
    address: "서울시 마포구 월드컵북로 50",
    grade: 4,
    rating: 4.8,
    status: "active",
    createdAt: "2023-10-01",
    contractCount: 6,
    lastRequestDate: "2024-03-15",
    reviewCount: 5,
    registrationDate: "2023-10-01",
    updatedAt: "2024-03-15",
    role: "가수",
    genres: ["발라드", "팝"],
    experience: 5,
    price: 2000000,
  },
  {
    id: "SINGER-002",
    name: "이준호",
    agency: "뮤직 프로덕션",
    genre: "팝",
    email: "junho.lee@singers.com",
    phone: "010-8765-4321",
    profileImage: "/images/singers/singer2.jpg",
    statusMessage: "기업 행사 및 축제 전문",
    address: "서울시 용산구 이태원로 30",
    grade: 2,
    rating: 4.5,
    status: "active",
    createdAt: "2024-01-15",
    contractCount: 2,
    lastRequestDate: "2024-03-10",
    reviewCount: 2,
    registrationDate: "2024-01-15",
    updatedAt: "2024-03-10",
    role: "가수",
    genres: ["힙합", "R&B"],
    experience: 3,
    price: 1500000,
  },
  {
    id: "SINGER-003",
    name: "박서연",
    agency: "아티스트 매니지먼트",
    genre: "재즈",
    email: "seoyeon.park@singers.com",
    phone: "010-7654-3210",
    profileImage: "/images/singers/singer3.jpg",
    statusMessage: "재즈 전문",
    address: "서울시 강남구 테헤란로 123",
    grade: 3,
    rating: 4.2,
    status: "active",
    createdAt: "2023-08-20",
    contractCount: 10,
    lastRequestDate: "2024-03-12",
    reviewCount: 8,
    registrationDate: "2023-08-20",
    updatedAt: "2024-03-12",
    role: "가수",
    genres: ["재즈", "블루스"],
    experience: 8,
    price: 2500000,
  },
];

export const requests: Request[] = [
  {
    id: "REQ-001",
    customerId: "CUST-001",
    customerName: "김민수",
    customerCompany: "(주)이벤트 플래닝",
    eventType: "기업 연말 행사",
    eventDate: "2025-12-20",
    venue: "서울 강남구 삼성동 OO호텔",
    budget: "3000000",
    requirements:
      "연말 기업 행사로, 직원들을 위한 공연이 필요합니다. 가요, 댄스 등 다양한 장르의 공연을 원합니다. 행사 시간은 약 2시간이며, 사회자도 함께 요청합니다.",
    status: "in_progress",
    createdAt: "2025-01-20T00:00:00Z",
    updatedAt: "2025-02-15T00:00:00Z",
    customer: customers.find((c) => c.id === "CUST-001") || null,
    title: "2025 연말 기업 행사",
    description: "직원 사기 증진을 위한 연말 행사에서 공연 필요",
    eventTime: "19:00",
    singerId: "SINGER-001",
    singerName: "김태희",
    singer: singers.find((s) => s.id === "SINGER-001") || null,
  },
  {
    id: "REQ-002",
    customerId: "CUST-002",
    customerName: "이지영",
    customerCompany: "웨딩 홀 A",
    eventType: "웨딩 축가",
    eventDate: "2025-12-10",
    venue: "서울 서초구 반포동 OO웨딩홀",
    budget: "1500000",
    requirements:
      "결혼식 축가로 발라드 2곡을 요청합니다. 신랑 신부 입장 시와 케이크 커팅 시간에 각각 한 곡씩 불러주시면 됩니다.",
    status: "in_progress",
    createdAt: "2025-01-05T00:00:00Z",
    updatedAt: "2025-01-15T00:00:00Z",
    customer: customers.find((c) => c.id === "CUST-002") || null,
    title: "12월 결혼식 축가",
    description: "신랑신부가 좋아하는 발라드 위주의 축가 요청",
    eventTime: "12:30",
    singerId: "SINGER-002",
    singerName: "이준호",
    singer: singers.find((s) => s.id === "SINGER-002") || null,
  },
  {
    id: "REQ-003",
    customerId: "CUST-003",
    customerName: "박준호",
    customerCompany: "대학 축제 위원회",
    eventType: "대학 축제",
    eventDate: "2025-05-15",
    venue: "서울대학교 대강당",
    budget: "4000000",
    requirements:
      "대학 축제 메인 공연으로, 약 1시간 30분의 공연이 필요합니다. 인기 가요와 함께 관객과 소통하는 시간도 포함해주세요.",
    status: "in_progress",
    createdAt: "2024-11-15T00:00:00Z",
    updatedAt: "2024-12-05T00:00:00Z",
    customer: customers.find((c) => c.id === "CUST-003") || null,
    title: "대학 축제 공연",
    description: "학교 축제 메인 공연으로 인기 가수 섭외 필요",
    eventTime: "18:00",
    singerId: "SINGER-003",
    singerName: "박서연",
    singer: singers.find((s) => s.id === "SINGER-003") || null,
  },
  {
    id: "REQ-004",
    customerId: "CUST-004",
    customerName: "최유진",
    customerCompany: "(주)테크놀로지",
    eventType: "신제품 런칭",
    eventDate: "2024-06-01",
    venue: "컨벤션센터 C",
    budget: "2500000",
    requirements: "신제품 런칭 행사에서 1시간 공연 필요",
    status: "completed",
    createdAt: "2024-03-01T00:00:00Z",
    updatedAt: "2024-03-01T00:00:00Z",
    customer: customers.find((c) => c.id === "CUST-004") || null,
    title: "제품 런칭 행사 공연 요청",
    description: "신제품 런칭 행사에서 1시간 공연 필요",
    eventTime: "15:00",
    singerId: "SINGER-001",
    singerName: "김태희",
    singer: singers.find((s) => s.id === "SINGER-001") || null,
  },
  {
    id: "REQ-005",
    customerId: "CUST-005",
    customerName: "권나은",
    customerCompany: "(주)코스메틱 브랜드",
    eventType: "기업 행사",
    eventDate: "2024-07-15",
    venue: "호텔 D 컨퍼런스홀",
    budget: "2000000",
    requirements: "연간 컨퍼런스에서 1시간 공연 필요",
    status: "completed",
    createdAt: "2024-02-28T00:00:00Z",
    updatedAt: "2024-02-28T00:00:00Z",
    customer: customers.find((c) => c.id === "CUST-005") || null,
    title: "기업 컨퍼런스 공연 요청",
    description: "연간 컨퍼런스에서 1시간 공연 필요",
    eventTime: "16:00",
    singerId: "SINGER-002",
    singerName: "이준호",
    singer: singers.find((s) => s.id === "SINGER-002") || null,
  },
  {
    id: "REQ-006",
    customerId: "CUST-001",
    customerName: "김민수",
    customerCompany: "(주)이벤트 플래닝",
    eventType: "기업 송년회",
    eventDate: "2024-12-22",
    venue: "그랜드 호텔",
    budget: "3500000",
    requirements: "송년회 행사에서 1시간 30분 공연 필요",
    status: "in_progress",
    createdAt: "2024-03-20T00:00:00Z",
    updatedAt: "2024-03-22T00:00:00Z",
    customer: customers.find((c) => c.id === "CUST-001") || null,
    title: "송년회 공연 요청",
    description: "2024년 연말 송년회 행사에서 공연 필요",
    eventTime: "19:30",
    singerId: "SINGER-003",
    singerName: "박서연",
    singer: singers.find((s) => s.id === "SINGER-003") || null,
  },
  {
    id: "REQ-007",
    customerId: "CUST-002",
    customerName: "이지영",
    customerCompany: "웨딩 홀 A",
    eventType: "웨딩 축가",
    eventDate: "2024-06-05",
    venue: "웨딩홀 A",
    budget: "2200000",
    requirements: "웨딩 행사에서 축가 3곡 필요",
    status: "in_progress",
    createdAt: "2024-03-18T00:00:00Z",
    updatedAt: "2024-03-19T00:00:00Z",
    customer: customers.find((c) => c.id === "CUST-002") || null,
    title: "6월 웨딩 축가 요청",
    description: "신랑신부가 좋아하는 발라드 위주의 축가 요청",
    eventTime: "12:30",
    singerId: "SINGER-001",
    singerName: "김태희",
    singer: singers.find((s) => s.id === "SINGER-001") || null,
  },
  {
    id: "REQ-008",
    customerId: "CUST-003",
    customerName: "박준호",
    customerCompany: "대학 축제 위원회",
    eventType: "가을 축제",
    eventDate: "2024-09-25",
    venue: "대학 중앙 광장",
    budget: "5000000",
    requirements: "가을 축제 메인 공연으로 2시간 공연 필요",
    status: "in_progress",
    createdAt: "2024-03-15T00:00:00Z",
    updatedAt: "2024-03-16T00:00:00Z",
    customer: customers.find((c) => c.id === "CUST-003") || null,
    title: "가을 축제 메인 공연",
    description: "학교 축제 메인 공연으로 인기 가수 섭외 필요",
    eventTime: "19:00",
    singerId: "SINGER-002",
    singerName: "이준호",
    singer: singers.find((s) => s.id === "SINGER-002") || null,
  },
  {
    id: "REQ-009",
    customerId: "CUST-004",
    customerName: "최유진",
    customerCompany: "(주)테크놀로지",
    eventType: "신입사원 환영회",
    eventDate: "2024-06-30",
    venue: "회사 대강당",
    budget: "1800000",
    requirements: "신입사원 환영회에서 45분 공연 필요",
    status: "in_progress",
    createdAt: "2024-03-12T00:00:00Z",
    updatedAt: "2024-03-14T00:00:00Z",
    customer: customers.find((c) => c.id === "CUST-004") || null,
    title: "신입사원 환영회 공연",
    description: "신입사원들을 위한 즐거운 분위기의 공연 필요",
    eventTime: "17:00",
    singerId: "SINGER-003",
    singerName: "박서연",
    singer: singers.find((s) => s.id === "SINGER-003") || null,
  },
  {
    id: "REQ-010",
    customerId: "CUST-005",
    customerName: "권나은",
    customerCompany: "(주)코스메틱 브랜드",
    eventType: "브랜드 론칭 이벤트",
    eventDate: "2024-05-01",
    venue: "명동 플라자홀",
    budget: "4000000",
    requirements: "브랜드 론칭 행사에서 1시간 공연 및 팬사인회 필요",
    status: "in_progress",
    createdAt: "2024-03-08T00:00:00Z",
    updatedAt: "2024-03-09T00:00:00Z",
    customer: customers.find((c) => c.id === "CUST-005") || null,
    title: "브랜드 론칭 행사 공연",
    description: "새 브랜드 론칭에 맞는 신선한 이미지의 가수 필요",
    eventTime: "14:00",
    singerId: "SINGER-001",
    singerName: "김태희",
    singer: singers.find((s) => s.id === "SINGER-001") || null,
  },
  {
    id: "REQ-011",
    customerId: "CUST-001",
    customerName: "김민수",
    customerCompany: "(주)이벤트 플래닝",
    eventType: "기업 연수",
    eventDate: "2024-10-05",
    venue: "연수원 대강당",
    budget: "2200000",
    requirements: "기업 연수 레크레이션 시간에 1시간 공연 필요",
    status: "cancelled",
    createdAt: "2024-03-08T00:00:00Z",
    updatedAt: "2024-03-20T00:00:00Z",
    customer: customers.find((c) => c.id === "CUST-001") || null,
    title: "기업 연수 레크레이션",
    description: "임직원들의 단합을 위한 활기찬 공연",
    eventTime: "19:30",
    singerId: "SINGER-003",
    singerName: "박서연",
    singer: singers.find((s) => s.id === "SINGER-003") || null,
  },
  {
    id: "REQ-012",
    customerId: "CUST-002",
    customerName: "이지영",
    customerCompany: "웨딩 홀 A",
    eventType: "웨딩 시연회",
    eventDate: "2024-09-01",
    venue: "웨딩홀 A",
    budget: "1600000",
    requirements: "예비 신랑신부를 위한 웨딩 시연회에서 축가 공연 필요",
    status: "cancelled",
    createdAt: "2024-03-12T00:00:00Z",
    updatedAt: "2024-03-22T00:00:00Z",
    customer: customers.find((c) => c.id === "CUST-002") || null,
    title: "웨딩 시연회 축가",
    description: "예비 신랑신부들에게 감동을 줄 수 있는 축가",
    eventTime: "14:00",
    singerId: "SINGER-001",
    singerName: "김태희",
    singer: singers.find((s) => s.id === "SINGER-001") || null,
  },
  {
    id: "REQ-013",
    customerId: "CUST-003",
    customerName: "박준호",
    customerCompany: "대학 축제 위원회",
    eventType: "동문 행사",
    eventDate: "2024-11-15",
    venue: "대학 대강당",
    budget: "3500000",
    requirements: "동문 행사에서 1시간 공연 필요",
    status: "cancelled",
    createdAt: "2024-03-15T00:00:00Z",
    updatedAt: "2024-03-25T00:00:00Z",
    customer: customers.find((c) => c.id === "CUST-003") || null,
    title: "동문 행사 축하 공연",
    description: "다양한 연령층의 동문들을 위한 공연",
    eventTime: "16:00",
    singerId: "SINGER-003",
    singerName: "박서연",
    singer: singers.find((s) => s.id === "SINGER-003") || null,
  },
  {
    id: "REQ-014",
    customerId: "CUST-004",
    customerName: "최유진",
    customerCompany: "(주)테크놀로지",
    eventType: "해외 바이어 환영회",
    eventDate: "2024-09-30",
    venue: "호텔 G 볼룸",
    budget: "4000000",
    requirements: "해외 바이어 환영 만찬에서 한국 전통 공연 및 현대 공연 필요",
    status: "cancelled",
    createdAt: "2024-03-18T00:00:00Z",
    updatedAt: "2024-03-28T00:00:00Z",
    customer: customers.find((c) => c.id === "CUST-004") || null,
    title: "해외 바이어 환영 공연",
    description: "한국 전통과 현대를 아우르는 특별 공연",
    eventTime: "19:00",
    singerId: "SINGER-002",
    singerName: "이준호",
    singer: singers.find((s) => s.id === "SINGER-002") || null,
  },
  {
    id: "REQ-015",
    customerId: "CUST-005",
    customerName: "권나은",
    customerCompany: "(주)코스메틱 브랜드",
    eventType: "팝업 스토어 오픈",
    eventDate: "2024-08-01",
    venue: "쇼핑몰 중앙 광장",
    budget: "2800000",
    requirements: "팝업 스토어 오픈 행사에서 1시간 공연 및 팬사인회 필요",
    status: "cancelled",
    createdAt: "2024-03-20T00:00:00Z",
    updatedAt: "2024-03-30T00:00:00Z",
    customer: customers.find((c) => c.id === "CUST-005") || null,
    title: "팝업 스토어 오픈 이벤트",
    description: "10~20대 타겟을 위한 트렌디한 공연",
    eventTime: "15:00",
    singerId: "SINGER-001",
    singerName: "김태희",
    singer: singers.find((s) => s.id === "SINGER-001") || null,
  },
  {
    id: "REQ-016",
    customerId: "CUST-001",
    customerName: "김민수",
    customerCompany: "(주)이벤트 플래닝",
    eventType: "가족 페스티벌",
    eventDate: "2024-10-20",
    venue: "어린이 대공원",
    budget: "2000000",
    requirements: "가족 페스티벌에서 어린이 대상 1시간 공연 필요",
    status: "pending",
    createdAt: "2024-03-25T00:00:00Z",
    updatedAt: "2024-03-25T00:00:00Z",
    customer: customers.find((c) => c.id === "CUST-001") || null,
    title: "가족 페스티벌 공연",
    description: "어린이들도 즐길 수 있는 가족 공연",
    eventTime: "13:00",
  },
  {
    id: "REQ-017",
    customerId: "CUST-002",
    customerName: "이지영",
    customerCompany: "웨딩 홀 A",
    eventType: "웨딩 페어",
    eventDate: "2024-11-01",
    venue: "호텔 D 그랜드홀",
    budget: "3000000",
    requirements: "웨딩 페어에서 하루 2회, 각 45분씩 공연 필요",
    status: "pending",
    createdAt: "2024-03-28T00:00:00Z",
    updatedAt: "2024-03-28T00:00:00Z",
    customer: customers.find((c) => c.id === "CUST-002") || null,
    title: "웨딩 페어 특별 공연",
    description: "예비 신혼부부들을 위한 로맨틱한 공연",
    eventTime: "13:00, 16:00",
  },
  {
    id: "REQ-018",
    customerId: "CUST-003",
    customerName: "박준호",
    customerCompany: "대학 축제 위원회",
    eventType: "동아리 공연",
    eventDate: "2024-03-20",
    venue: "대학 소극장",
    budget: "1000000",
    requirements: "동아리 발표회에서 게스트 공연 필요",
    status: "completed",
    createdAt: "2024-02-01T00:00:00Z",
    updatedAt: "2024-02-05T00:00:00Z",
    customer: customers.find((c) => c.id === "CUST-003") || null,
    title: "동아리 공연 게스트",
    description: "학생들과 호흡할 수 있는 친근한 공연",
    eventTime: "19:00",
    singerId: "SINGER-002",
    singerName: "이준호",
    singer: singers.find((s) => s.id === "SINGER-002") || null,
  },
];

export const matches: Match[] = [
  {
    id: "MATCH-001",
    requestId: "REQ-001",
    requestTitle: "2025 연말 기업 행사",
    customerId: "CUST-001",
    customerName: "김민수",
    customerCompany: "(주)이벤트 플래닝",
    singerId: "SINGER-001",
    singerName: "김태희",
    singerAgency: "스타라이트 엔터테인먼트",
    eventDate: "2025-12-20",
    venue: "서울 강남구 삼성동 OO호텔",
    status: "negotiating",
    budget: "3,000,000",
    requirements:
      "연말 기업 행사로, 직원들을 위한 공연이 필요합니다. 가요, 댄스 등 다양한 장르의 공연을 원합니다. 행사 시간은 약 2시간이며, 사회자도 함께 요청합니다.",
    createdAt: "2025-02-16",
    updatedAt: "2025-03-01",
    request: null,
    singer: null,
    notes: "고객이 예산 범위 내에서 최대한 퀄리티 있는 공연을 원함",
    price: 2900000,
  },
  {
    id: "MATCH-002",
    requestId: "REQ-002",
    requestTitle: "12월 결혼식 축가",
    customerId: "CUST-002",
    customerName: "이지영",
    customerCompany: "웨딩 홀 A",
    singerId: "SINGER-002",
    singerName: "이준호",
    singerAgency: "드림 엔터테인먼트",
    eventDate: "2025-12-10",
    venue: "서울 서초구 반포동 OO웨딩홀",
    status: "pending",
    budget: "1,500,000",
    requirements:
      "결혼식 축가로 발라드 2곡을 요청합니다. 신랑 신부 입장 시와 케이크 커팅 시간에 각각 한 곡씩 불러주시면 됩니다.",
    createdAt: "2025-01-15",
    updatedAt: "2025-02-10",
    request: null,
    singer: null,
    notes: "신부가 이준호의 팬이라 꼭 섭외하고 싶어함",
    price: 1200000,
  },
  {
    id: "MATCH-003",
    requestId: "REQ-003",
    requestTitle: "대학 축제 공연",
    customerId: "CUST-003",
    customerName: "박준호",
    customerCompany: "대학 축제 위원회",
    singerId: "SINGER-003",
    singerName: "박서연",
    singerAgency: "비전 엔터테인먼트",
    eventDate: "2025-05-15",
    venue: "서울대학교 대강당",
    status: "confirmed",
    budget: "4,000,000",
    requirements:
      "대학 축제 메인 공연으로, 약 1시간 30분의 공연이 필요합니다. 인기 가요와 함께 관객과 소통하는 시간도 포함해주세요.",
    createdAt: "2024-12-05",
    updatedAt: "2025-01-20",
    request: null,
    singer: null,
    notes: "당일 리허설이 필요하며, 학생회에서 별도 MC 준비함",
    price: 3800000,
  },
  {
    id: "MATCH-004",
    requestId: "REQ-005",
    requestTitle: "기업 런칭 행사",
    customerId: "CUST-001",
    customerName: "김민수",
    customerCompany: "(주)이벤트 플래닝",
    singerId: "SINGER-001",
    singerName: "김태희",
    singerAgency: "스타라이트 엔터테인먼트",
    eventDate: "2025-06-10",
    venue: "서울 강남구 코엑스",
    status: "negotiating",
    budget: "5,000,000",
    requirements:
      "새로운 제품 런칭 행사로, 30분 정도의 공연과 제품 소개를 위한 간단한 토크 시간도 포함되었으면 합니다.",
    createdAt: "2025-02-01",
    updatedAt: "2025-02-25",
    request: null,
    singer: null,
    notes: "공연 후 사인회와 포토타임도 요청함",
    price: 4800000,
  },
  {
    id: "MATCH-005",
    requestId: "REQ-007",
    requestTitle: "연말 시상식 공연",
    customerId: "CUST-002",
    customerName: "이지영",
    customerCompany: "웨딩 홀 A",
    singerId: "SINGER-002",
    singerName: "이준호",
    singerAgency: "드림 엔터테인먼트",
    eventDate: "2025-12-25",
    venue: "서울 여의도 그랜드호텔",
    status: "cancelled",
    budget: "3,500,000",
    requirements:
      "연말 시상식에서의 오프닝 공연으로, 약 20분 정도의 공연이 필요합니다. 활기차고 분위기를 띄울 수 있는 곡으로 부탁드립니다.",
    createdAt: "2024-10-15",
    updatedAt: "2024-11-05",
    request: null,
    singer: null,
    notes: "예산 문제로 취소됨",
    price: 3500000,
  },
];

export const negotiationLogs: NegotiationLog[] = [
  {
    id: "LOG-001",
    matchId: "MATCH-001",
    date: "2025-02-16",
    type: "status_change",
    content: "매칭 상태가 '견적 검토'로 변경되었습니다.",
    user: "관리자",
  },
  {
    id: "LOG-002",
    matchId: "MATCH-001",
    date: "2025-02-20",
    type: "price_change",
    content: "제안 금액이 3,000,000원에서 2,900,000원으로 변경되었습니다.",
    user: "관리자",
  },
  {
    id: "LOG-003",
    matchId: "MATCH-001",
    date: "2025-02-25",
    type: "message",
    content: "고객이 금액에 동의했으며, 계약서 검토를 요청했습니다.",
    user: "김담당 (고객)",
  },
  {
    id: "LOG-004",
    matchId: "MATCH-001",
    date: "2025-03-01",
    type: "status_change",
    content: "매칭 상태가 '협상 중'으로 변경되었습니다.",
    user: "관리자",
  },
  {
    id: "LOG-005",
    matchId: "MATCH-002",
    date: "2025-01-15",
    type: "status_change",
    content: "매칭 상태가 '견적 검토'로 변경되었습니다.",
    user: "관리자",
  },
  {
    id: "LOG-006",
    matchId: "MATCH-002",
    date: "2025-02-10",
    type: "message",
    content: "가수 측에서 일정 확인 중입니다. 2주 내로 답변 드리겠습니다.",
    user: "박매니저 (소속사)",
  },
  {
    id: "LOG-007",
    matchId: "MATCH-003",
    date: "2024-12-05",
    type: "status_change",
    content: "매칭 상태가 '견적 검토'로 변경되었습니다.",
    user: "관리자",
  },
  {
    id: "LOG-008",
    matchId: "MATCH-003",
    date: "2024-12-20",
    type: "price_change",
    content: "제안 금액이 4,000,000원에서 3,800,000원으로 변경되었습니다.",
    user: "관리자",
  },
  {
    id: "LOG-009",
    matchId: "MATCH-003",
    date: "2025-01-10",
    type: "status_change",
    content: "매칭 상태가 '협상 중'으로 변경되었습니다.",
    user: "관리자",
  },
  {
    id: "LOG-010",
    matchId: "MATCH-003",
    date: "2025-01-20",
    type: "status_change",
    content: "매칭 상태가 '계약 확정'으로 변경되었습니다.",
    user: "관리자",
  },
];

export const schedules: Schedule[] = [
  {
    id: "SCH-001",
    matchId: "MATCH-003",
    requestId: "REQ-003",
    customerId: "CUST-003",
    customerName: "박준호",
    customerCompany: "대학 축제 위원회",
    singerId: "SINGER-003",
    singerName: "박서연",
    singerAgency: "비전 엔터테인먼트",
    eventTitle: "대학 축제 공연",
    eventDate: "2025-05-15",
    startTime: "18:00",
    endTime: "19:30",
    venue: "서울대학교 대강당",
    status: "scheduled",
    details: "메인 공연, 리허설 16:00 예정",
    createdAt: "2025-01-25",
    updatedAt: "2025-02-10",
    request: null,
    match: null,
    customer: null,
    singer: null,
  },
  {
    id: "SCH-002",
    matchId: "MATCH-001",
    requestId: "REQ-001",
    customerId: "CUST-001",
    customerName: "김민수",
    customerCompany: "(주)이벤트 플래닝",
    singerId: "SINGER-001",
    singerName: "김태희",
    singerAgency: "스타라이트 엔터테인먼트",
    eventTitle: "2025 연말 기업 행사",
    eventDate: "2025-12-20",
    startTime: "19:00",
    endTime: "21:00",
    venue: "서울 강남구 삼성동 OO호텔",
    status: "scheduled",
    details: "연말 행사, 케이터링 포함",
    createdAt: "2025-03-05",
    updatedAt: "2025-03-05",
    request: null,
    match: null,
    customer: null,
    singer: null,
  },
];

export const contracts: Contract[] = [
  {
    id: "CON-001",
    matchId: "MATCH-003",
    scheduleId: "SCH-001",
    requestId: "REQ-003",
    customerId: "CUST-003",
    customerName: "박준호",
    customerCompany: "대학 축제 위원회",
    singerId: "SINGER-003",
    singerName: "박서연",
    singerAgency: "비전 엔터테인먼트",
    eventTitle: "대학 축제 공연",
    eventDate: "2025-05-15",
    venue: "서울대학교 대강당",
    contractAmount: "3,800,000",
    paymentStatus: "partial",
    contractStatus: "signed",
    createdAt: "2025-01-25",
    signedAt: "2025-02-05",
  },
  {
    id: "CON-002",
    matchId: "MATCH-002",
    scheduleId: "SCHED-002",
    requestId: "REQ-002",
    customerId: "CUST-002",
    customerName: "이지영",
    customerCompany: "웨딩 홀 A",
    singerId: "SINGER-002",
    singerName: "가수 B",
    singerAgency: "엔터테인먼트 B",
    eventTitle: "기업 행사",
    eventDate: "2024-07-01",
    venue: "컨퍼런스 센터",
    contractAmount: "8000000",
    paymentStatus: "unpaid",
    contractStatus: "sent",
    createdAt: "2024-03-22",
  },
];

export const payments: Payment[] = [
  {
    id: "PAY-001",
    contractId: "CON-001",
    customerId: "CUST-003",
    customerName: "박준호",
    amount: "1,900,000",
    paymentMethod: "계좌이체",
    paymentDate: "2025-02-10",
    status: "completed",
  },
];

export const reviews: Review[] = [
  {
    id: "REV-001",
    contractId: "CON-001",
    customerId: "CUST-003",
    customerName: "박준호",
    singerId: "SINGER-003",
    singerName: "박서연",
    rating: 4,
    content:
      "학생들의 반응이 매우 좋았습니다. 다음 축제에도 섭외하고 싶습니다.",
    createdAt: "2025-05-20",
    status: "published",
  },
];
