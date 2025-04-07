import axios from "axios";

// API 기본 URL 설정
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

// 가수 타입 정의
export interface Singer {
  id: string;
  name: string;
  email: string;
  phone: string;
  profileImage?: string;
  genre?: string;
  bio?: string;
  createdAt: string;
  updatedAt: string;
  status?: string;
  rating?: number;
}

// 가수 목록 조회
export const getAllSingers = async () => {
  try {
    const response = await axios.get(`${API_URL}/singers`);
    return response.data;
  } catch (error) {
    console.error("가수 목록 조회 오류:", error);
    throw error;
  }
};

// 가수 상세 조회
export const getSingerById = async (id: string) => {
  try {
    const response = await axios.get(`${API_URL}/singers/${id}`);
    return response.data;
  } catch (error) {
    console.error("가수 상세 조회 오류:", error);
    throw error;
  }
};

// 가수 생성
export const createSinger = async (singerData: Partial<Singer>) => {
  try {
    const response = await axios.post(`${API_URL}/singers`, singerData);
    return response.data;
  } catch (error) {
    console.error("가수 생성 오류:", error);
    throw error;
  }
};

// 가수 정보 수정
export const updateSinger = async (id: string, singerData: Partial<Singer>) => {
  try {
    const response = await axios.patch(`${API_URL}/singers/${id}`, singerData);
    return response.data;
  } catch (error) {
    console.error("가수 정보 수정 오류:", error);
    throw error;
  }
};

// 가수 삭제
export const deleteSinger = async (id: string) => {
  try {
    const response = await axios.delete(`${API_URL}/singers/${id}`);
    return response.data;
  } catch (error) {
    console.error("가수 삭제 오류:", error);
    throw error;
  }
};

// 가수 프로필 이미지 업로드
export const uploadSingerProfileImage = async (
  id: string,
  formData: FormData
) => {
  try {
    const response = await axios.post(
      `${API_URL}/singers/${id}/profile-image`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("가수 프로필 이미지 업로드 오류:", error);
    throw error;
  }
};

// 가수 검색
export const searchSingers = async (query: string) => {
  try {
    const response = await axios.get(
      `${API_URL}/singers/search?query=${query}`
    );
    return response.data;
  } catch (error) {
    console.error("가수 검색 오류:", error);
    throw error;
  }
};

// 기본 내보내기
export default {
  getAllSingers,
  getSingerById,
  createSinger,
  updateSinger,
  deleteSinger,
  uploadSingerProfileImage,
  searchSingers,
};
