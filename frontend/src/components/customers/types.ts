// 고객 타입 정의
export interface Customer {
  id: string;
  name: string;
  email: string;
  company: string;
  phone: string;
  registrationDate: string;
  status: "active" | "inactive";
  grade: "일반" | "VIP" | "VVIP";
  requestCount: number;
  lastRequestDate: string;
}
