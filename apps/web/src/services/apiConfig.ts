// src/services/api.ts 또는 유사한 파일
import axios from "axios";

// API URL 정의
export const API_URL = process.env.NEXT_PUBLIC_API_URL;

// API 경로 생성 유틸리티 함수
export const getApiPath = (path: string): string => {
  return `${API_URL}${path.startsWith("/") ? path : `/${path}`}`;
};

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true, // CORS credentials 설정
  timeout: 30000, // 타임아웃 설정
});

// 요청 인터셉터 추가
api.interceptors.request.use(
  (config) => {
    console.log(`API 요청: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error("API 요청 오류:", error);
    return Promise.reject(error);
  }
);

// 응답 인터셉터 추가
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error("API 응답 오류:", error.response?.status, error.message);
    // 오류 처리 로직
    return Promise.reject(error);
  }
);

export default api;
