import axios from "axios";

// 백엔드 서버 URL
const API_URL = "http://localhost:4000/api";

export interface Singer {
  id: number | string;
  name: string;
  agency: string;
  genre: string;
  rating: number;
  price: number;
  email: string;
  phone: string;
  statusMessage: string;
  address: string;
  experience: number;
  contractCount: number;
  profileImage?: string;
  status?: string;
  type?: string;
  role?: string;
  memo?: string;
  assignedTo?: string;
}

const singerApi = {
  getAll: async (filters?: any): Promise<Singer[]> => {
    try {
      const response = await axios.get(`${API_URL}/singers`, {
        params: filters,
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching singers:", error);
      throw error;
    }
  },

  getById: async (id: string | number): Promise<Singer> => {
    try {
      const response = await axios.get(`${API_URL}/singers/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching singer ${id}:`, error);
      throw error;
    }
  },

  create: async (singer: Omit<Singer, "id">): Promise<Singer> => {
    try {
      console.log(
        "Creating singer with data:",
        JSON.stringify(
          {
            ...singer,
            profileImage: singer.profileImage
              ? "이미지 데이터 (생략됨)"
              : undefined,
          },
          null,
          2
        )
      );

      // 서버가 기대하는 정확한 형태로 변환
      const payload = {
        name: singer.name,
        email: singer.email,
        phone: singer.phone,
        agency: singer.agency || "정보 없음",
        genre: singer.genre || "정보 없음",
        address: singer.address || "정보 없음",
        statusMessage: singer.statusMessage || "",
        price: Number(singer.price || 0),
        experience: Number(singer.experience || 0),
        rating: Number(singer.rating || 1),
        type: "singer",
        role: "singer",
        status: singer.status || "active",
        memo: singer.memo || "",
      };

      // profileImage 필드는 별도로 업로드할 것이므로 제거
      delete payload.profileImage;

      console.log("Final singer payload:", JSON.stringify(payload, null, 2));

      const response = await axios.post(`${API_URL}/singers`, payload);
      console.log("Singer created successfully:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error creating singer:", error);
      if (axios.isAxiosError(error) && error.response) {
        console.error("Error response data:", error.response.data);
        console.error("Error status:", error.response.status);
        if (
          error.response.data.message &&
          Array.isArray(error.response.data.message)
        ) {
          console.error("Validation errors:", error.response.data.message);
        }
      }
      throw error;
    }
  },

  update: async (
    id: string | number,
    singer: Partial<Singer>
  ): Promise<Singer> => {
    try {
      if (!id) {
        throw new Error("ID가 필요합니다.");
      }

      console.log(`Updating singer with ID: ${id}`);
      console.log("Update payload:", JSON.stringify(singer, null, 2));

      // PATCH 메소드로 업데이트 (부분 수정)
      const response = await axios.patch(`${API_URL}/singers/${id}`, singer);
      console.log("Update response:", response.data);
      return response.data;
    } catch (error) {
      console.error(`Error updating singer ${id}:`, error);
      if (axios.isAxiosError(error) && error.response) {
        console.error("Error response data:", error.response.data);
        console.error("Error response status:", error.response.status);
      }
      throw error;
    }
  },

  updateStatus: async (
    id: string | number,
    status: string
  ): Promise<Singer> => {
    try {
      if (!id) {
        throw new Error("ID가 필요합니다.");
      }

      const response = await axios.patch(`${API_URL}/singers/${id}`, {
        status,
      });
      return response.data;
    } catch (error) {
      console.error(`Error updating singer status ${id}:`, error);
      throw error;
    }
  },

  delete: async (id: string | number): Promise<void> => {
    try {
      if (!id) {
        throw new Error("ID가 필요합니다.");
      }

      await axios.delete(`${API_URL}/singers/${id}`);
    } catch (error) {
      console.error(`Error deleting singer ${id}:`, error);
      throw error;
    }
  },

  uploadProfileImage: async (
    id: string | number,
    formData: FormData
  ): Promise<any> => {
    try {
      if (!id) {
        throw new Error("ID가 필요합니다.");
      }

      console.log(`가수 ID: ${id}에 대한 프로필 이미지 업로드 시작`);

      // FormData 내용 로깅
      const file = formData.get("file") as File;
      if (file) {
        console.log(
          `- file: ${file.name}, 타입: ${file.type}, 크기: ${(
            file.size / 1024
          ).toFixed(2)}KB`
        );
      } else {
        console.error("FormData에 file이 없습니다.");
        throw new Error("업로드할 파일이 없습니다.");
      }

      // FormData 데이터 확인
      console.log("FormData 키 목록:");
      for (const key of formData.keys()) {
        console.log(`- ${key}: ${formData.get(key)}`);
      }

      // 프로필 이미지를 DB에 직접 저장하는 엔드포인트 사용
      const response = await axios.post(
        `${API_URL}/files/upload-to-db`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          timeout: 60000,
          maxContentLength: Infinity,
          maxBodyLength: Infinity,
        }
      );

      console.log(
        "프로필 이미지가 DB에 성공적으로 업로드되었습니다:",
        response.data
      );

      // 가수 정보 업데이트 (프로필 이미지 ID 연결)
      if (response.data && response.data.id) {
        await singerApi.update(id, { profileImage: response.data.id });
        console.log(
          `가수 정보가 업데이트되었습니다. 프로필 이미지 ID: ${response.data.id}`
        );
      }

      return response.data;
    } catch (error) {
      console.error(`가수 ${id}의 프로필 이미지 업로드 중 오류 발생:`, error);
      if (axios.isAxiosError(error) && error.response) {
        console.error("오류 응답 데이터:", error.response.data);
        console.error("오류 상태 코드:", error.response.status);
      }
      throw error;
    }
  },

  // 파일 업로드 메소드 추가
  uploadFiles: async (
    id: string | number,
    formData: FormData
  ): Promise<any> => {
    try {
      if (!id) {
        throw new Error("ID가 필요합니다.");
      }

      // FormData 내용 로깅
      console.log(`가수 ID: ${id}에 대한 파일 업로드 시작`);
      console.log("FormData 키 목록:");
      for (const key of formData.keys()) {
        console.log(`- ${key}`);
      }

      // 업로드 방식 설정 (DB 저장 또는 파일 시스템)
      formData.append("storeInDb", "true"); // PostgreSQL에 직접 저장
      formData.append("entityType", "singer");
      formData.append("entityId", id.toString());

      if (formData.has("profileImage")) {
        const profileImage = formData.get("profileImage") as File;
        console.log(
          `- profileImage: ${profileImage.name}, 타입: ${
            profileImage.type
          }, 크기: ${(profileImage.size / 1024).toFixed(2)}KB`
        );
      }

      // 백엔드 주소 디버깅
      console.log("백엔드 API URL:", API_URL);

      // 프로필 이미지인 경우 DB에 직접 저장하는 엔드포인트 사용
      if (formData.has("profileImage")) {
        const profileImage = formData.get("profileImage") as File;
        const newFormData = new FormData();
        newFormData.append("file", profileImage);
        newFormData.append("entityType", "singer");
        newFormData.append("entityId", id.toString());
        newFormData.append("category", "profileImage");

        const response = await axios.post(
          `${API_URL}/files/upload-to-db`,
          newFormData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
            timeout: 60000,
            maxContentLength: Infinity,
            maxBodyLength: Infinity,
          }
        );

        console.log("Profile image uploaded directly to DB:", response.data);
        return response.data;
      }

      // 파일이 한 개인지 여러 개인지 확인
      const isSingleFile = formData.has("file") || formData.has("profileImage");

      // 엔드포인트 선택
      let uploadUrl;
      if (isSingleFile) {
        uploadUrl = `${API_URL}/files/upload`;

        // profileImage를 file로 변경
        if (formData.has("profileImage")) {
          const profileImage = formData.get("profileImage");
          formData.delete("profileImage");
          formData.append("file", profileImage as Blob);
          formData.append("category", "profileImage");
        }
      } else {
        uploadUrl = `${API_URL}/files/multi-upload`;

        // 파일 필드명을 'files'로 변경
        const files = [];
        for (const key of formData.keys()) {
          if (
            key !== "entityType" &&
            key !== "entityId" &&
            key !== "category" &&
            key !== "storeInDb"
          ) {
            const file = formData.get(key);
            files.push(file);
            formData.delete(key);
          }
        }

        files.forEach((file) => {
          formData.append("files", file as Blob);
        });
      }

      console.log(`선택된 업로드 URL: ${uploadUrl}`);

      const response = await axios.post(uploadUrl, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        timeout: 60000,
        maxContentLength: Infinity,
        maxBodyLength: Infinity,
      });

      console.log("Files uploaded successfully:", response.data);
      return response.data;
    } catch (error) {
      console.error(`Error uploading files for singer ${id}:`, error);
      if (axios.isAxiosError(error) && error.response) {
        console.error("Error response data:", error.response.data);
        console.error("Error response status:", error.response.status);
        console.error("Error response headers:", error.response.headers);
        console.error("Request URL:", error.config?.url);

        // 유효성 검사 오류 자세히 출력
        if (error.response.data.message) {
          if (Array.isArray(error.response.data.message)) {
            console.error("Validation errors:");
            error.response.data.message.forEach((msg: string, i: number) => {
              console.error(`  ${i + 1}. ${msg}`);
            });
          } else {
            console.error("Error message:", error.response.data.message);
          }
        }
      }
      throw error;
    }
  },

  // 파일 직접 가져오기
  getFileUrl: (fileId: string): string => {
    return `${API_URL}/files/${fileId}/data`;
  },

  // 가수 관련 파일 목록 가져오기
  getFiles: async (id: string | number): Promise<any[]> => {
    try {
      if (!id) {
        throw new Error("ID가 필요합니다.");
      }

      const response = await axios.get(
        `${API_URL}/files/by-entity/singer/${id}`
      );
      return response.data;
    } catch (error) {
      console.error(`Error fetching files for singer ${id}:`, error);
      throw error;
    }
  },
};

export default singerApi;
