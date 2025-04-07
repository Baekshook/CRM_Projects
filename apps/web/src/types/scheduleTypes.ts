// 스케줄 데이터 타입 정의
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
  request?: any;
  match?: any;
  customer?: any;
  singer?: any;
}

// 계약 데이터 타입 정의
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

// 장소 리소스 타입 정의
export interface Venue {
  id: string;
  name: string;
  address: string;
  capacity: number;
  facilities: string[];
  contactPerson: string;
  contactPhone: string;
  contactEmail: string;
  status: "available" | "unavailable" | "maintenance";
  description?: string;
  createdAt: string;
  updatedAt: string;
}

// 가수 리소스 타입 정의
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
