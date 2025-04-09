// API 설정 파일

// 환경 변수 또는 기본값 사용
export const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://crm-backend-env-env.eba-m3mmahdu.ap-northeast-1.elasticbeanstalk.com/api";

export default {
  API_URL,
};
