export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://crm-backend-env-env.eba-m3mmahdu.ap-northeast-1.elasticbeanstalk.com/api";

export const API_ENDPOINTS = {
  // 인증 관련
  LOGIN: "/auth/login",
  REGISTER: "/auth/register",

  // 공연 관련
  PERFORMANCES: "/performances",
  PERFORMANCE_CATEGORIES: "/performances/categories",

  // 사용자 관련
  USER_PROFILE: "/users/profile",
  USER_BOOKINGS: "/users/bookings",
};

export const getApiUrl = (endpoint: string) => `${API_BASE_URL}${endpoint}`;
