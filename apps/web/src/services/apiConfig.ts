// API 설정 파일

// 백엔드 API URL 가져오기 - HTTP를 HTTPS로 강제 변환
let apiUrl =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://crm-backend-env-env.eba-m3mmahdu.ap-northeast-1.elasticbeanstalk.com/api";

// HTTP를 HTTPS로 강제 변환
if (apiUrl.startsWith("http://")) {
  apiUrl = apiUrl.replace("http://", "https://");
  console.log("보안을 위해 HTTP가 HTTPS로 변환되었습니다.");
}

// URL 끝에 슬래시가 있으면 제거
if (apiUrl.endsWith("/")) {
  apiUrl = apiUrl.slice(0, -1);
}

export const API_URL = apiUrl;

// API 요청 경로 생성 유틸리티 함수
export const getApiPath = (path: string): string => {
  // 경로가 슬래시로 시작하는지 확인하고 슬래시 조정
  const formattedPath = path.startsWith("/") ? path : `/${path}`;
  return `${API_URL}${formattedPath}`;
};

export default {
  API_URL,
  getApiPath,
};
