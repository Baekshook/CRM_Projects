export type Customer = {
  id: string;
  type: string;
  name: string;
  company?: string;
  email?: string;
  phone?: string;
  profileImage?: string;
  statusMessage?: string;
  address?: string;
  department?: string;
  grade?: string;
  memo?: string;
  assignedTo?: string;
  status: string;
  requestCount?: number;
  lastRequestDate?: string;
  contractCount?: number;
  reviewCount?: number;
  registrationDate?: string;
  role?: string;
  createdAt: string;
  updatedAt: string;
};

export type CustomerFormData = {
  type: string;
  name: string;
  company?: string;
  email?: string;
  phone?: string;
  profileImage?: string;
  profileImageFile?: File; // 클라이언트 측에서만 사용되는 파일 객체
  statusMessage?: string;
  address?: string;
  department?: string;
  grade?: string;
  memo?: string;
  assignedTo?: string;
  status: string;
};

export type SingerFormData = {
  name: string;
  company?: string;
  email?: string;
  phone?: string;
  profileImage?: string;
  profileImageFile?: File; // 클라이언트 측에서만 사용되는 파일 객체
  statusMessage?: string;
  description?: string;
  specialty?: string;
  fee?: number;
  memo?: string;
  status: string;
};
