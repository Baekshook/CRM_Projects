import axios from "axios";
import { API_URL, getApiPath } from "./apiConfig";

// 백엔드 서버 URL - 중앙 설정에서 가져옴
// const API_URL = "http://localhost:4000/api";

// 모든 가수 데이터 가져오기
export const getAll = async () => {
  try {
    const response = await axios.get(getApiPath("/singers"));
    return response.data;
  } catch (error) {
    console.error("가수 목록 조회 실패:", error);
    throw error;
  }
};

// ID로 가수 데이터 가져오기
export const getById = async (id: string) => {
  try {
    const response = await axios.get(getApiPath(`/singers/${id}`));
    return response.data;
  } catch (error) {
    console.error(`가수 ID ${id} 조회 실패:`, error);
    throw error;
  }
};

// 신규 가수 생성하기
export const create = async (singerData: any) => {
  try {
    const response = await axios.post(getApiPath("/singers"), singerData);
    return response.data;
  } catch (error) {
    console.error("가수 생성 실패:", error);
    throw error;
  }
};

// 가수 정보 업데이트하기
export const update = async (id: string, singerData: any) => {
  try {
    const response = await axios.patch(
      getApiPath(`/singers/${id}`),
      singerData
    );
    return response.data;
  } catch (error) {
    console.error(`가수 ID ${id} 업데이트 실패:`, error);
    throw error;
  }
};

// 가수 삭제하기
export const remove = async (id: string) => {
  try {
    const response = await axios.delete(getApiPath(`/singers/${id}`));
    return response.data;
  } catch (error) {
    console.error(`가수 ID ${id} 삭제 실패:`, error);
    throw error;
  }
};

// 가수 파일 목록 가져오기
export const getFiles = async (id: string) => {
  try {
    const response = await axios.get(getApiPath(`/singers/${id}/files`));
    return response.data;
  } catch (error) {
    console.error(`가수 ID ${id} 파일 목록 조회 실패:`, error);
    throw error;
  }
};

// 파일 URL 생성
export const getFileUrl = (fileId: string) => {
  return `${getApiPath(`/files/${fileId}/data`)}`;
};

// 가수 파일 업로드
export const uploadFiles = async (id: string, formData: FormData) => {
  try {
    const response = await axios.post(
      getApiPath(`/singers/${id}/files`),
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        timeout: 30000,
      }
    );
    return response.data;
  } catch (error) {
    console.error(`가수 ID ${id} 파일 업로드 실패:`, error);
    throw error;
  }
};

export const uploadSingerProfileImage = async (
  file: File,
  singerId: string
): Promise<any> => {
  try {
    console.log(`가수 프로필 이미지 업로드 시작 - 가수ID: ${singerId}`);
    console.log(
      `파일 정보: 이름=${file.name}, 크기=${file.size}바이트, 타입=${file.type}`
    );

    // FormData 객체 생성 및 파일 추가
    const formData = new FormData();
    formData.append("file", file);
    formData.append("entityType", "singer");
    formData.append("entityId", singerId);
    formData.append("category", "profile");

    // FormData 내용 디버깅 로그
    console.log("FormData 내용:");
    for (const pair of formData.entries()) {
      console.log(
        `- ${pair[0]}: ${pair[0] === "file" ? "파일 객체" : pair[1]}`
      );
    }

    // 파일 업로드 API 요청
    const response = await axios.post(
      getApiPath("/files/upload-to-db"),
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        timeout: 30000, // 30초 타임아웃
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / (progressEvent.total || 1)
          );
          console.log(`업로드 진행률: ${percentCompleted}%`);
        },
      }
    );

    console.log("파일 업로드 성공:", response.data);

    // 가수 정보 업데이트 - profileImage 필드에 파일 ID 설정
    if (response.data && response.data.id) {
      await update(singerId, {
        profileImageId: response.data.id,
        profileImage: response.data.id, // 호환성을 위해 두 필드 모두 업데이트
      });
      console.log(
        `가수(${singerId}) 프로필 이미지 ID(${response.data.id}) 업데이트 완료`
      );
    }

    return response.data;
  } catch (error) {
    console.error("파일 업로드 실패:", error);
    throw error;
  }
};

// singerApi 객체 생성
const singerApi = {
  getAll,
  getById,
  create,
  update,
  delete: remove,
  uploadFiles,
  uploadProfileImage: uploadSingerProfileImage,
  getFiles,
  getFileUrl,
};

export default singerApi;
