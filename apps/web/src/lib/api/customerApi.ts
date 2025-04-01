import axios from "axios";

const API_BASE_URL = "http://localhost:4000/api";

// 모든 고객 데이터 가져오기
export const getAll = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/customers`);
    return response.data;
  } catch (error) {
    console.error("고객 목록 조회 실패:", error);
    throw error;
  }
};

// ID로 고객 데이터 가져오기
export const getById = async (id: string) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/customers/${id}`);
    return response.data;
  } catch (error) {
    console.error(`고객 ID ${id} 조회 실패:`, error);
    throw error;
  }
};

// 신규 고객 생성하기
export const create = async (customerData: any) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/customers`,
      customerData
    );
    return response.data;
  } catch (error) {
    console.error("고객 생성 실패:", error);
    throw error;
  }
};

// 고객 정보 업데이트하기
export const update = async (id: string, customerData: any) => {
  try {
    const response = await axios.patch(
      `${API_BASE_URL}/customers/${id}`,
      customerData
    );
    return response.data;
  } catch (error) {
    console.error(`고객 ID ${id} 업데이트 실패:`, error);
    throw error;
  }
};

// 고객 삭제하기
export const remove = async (id: string) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/customers/${id}`);
    return response.data;
  } catch (error) {
    console.error(`고객 ID ${id} 삭제 실패:`, error);
    throw error;
  }
};

export const uploadCustomerProfileImage = async (
  file: File,
  customerId: string
): Promise<any> => {
  try {
    console.log(`고객 프로필 이미지 업로드 시작 - 고객ID: ${customerId}`);
    console.log(
      `파일 정보: 이름=${file.name}, 크기=${file.size}바이트, 타입=${file.type}`
    );

    // FormData 객체 생성 및 파일 추가
    const formData = new FormData();
    formData.append("file", file);
    formData.append("entityType", "customer");
    formData.append("entityId", customerId);
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
      `${API_BASE_URL}/files/upload-to-db`,
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

    // 고객 정보 업데이트 - profileImage 필드에 파일 ID 설정
    if (response.data && response.data.id) {
      await update(customerId, {
        profileImageId: response.data.id,
        profileImage: response.data.id, // 호환성을 위해 두 필드 모두 업데이트
      });
      console.log(
        `고객(${customerId}) 프로필 이미지 ID(${response.data.id}) 업데이트 완료`
      );
    }

    return response.data;
  } catch (error) {
    console.error("파일 업로드 실패:", error);
    throw error;
  }
};

// 고객 파일 업로드
export const uploadFiles = async (id: string, formData: FormData) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/customers/${id}/files`,
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
    console.error(`고객 ID ${id} 파일 업로드 실패:`, error);
    throw error;
  }
};

// customerApi 객체 생성
const customerApi = {
  getAll,
  getById,
  create,
  update,
  delete: remove,
  uploadFiles,
  uploadProfileImage: uploadCustomerProfileImage,
};

export default customerApi;
