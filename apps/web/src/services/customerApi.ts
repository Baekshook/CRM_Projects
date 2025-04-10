import axios from "axios";
import { API_URL, getApiPath } from "./apiConfig";

// 백엔드 서버 URL - 중앙 설정에서 가져옴
// const API_URL = "http://localhost:4000/api";

export interface Customer {
  id: number | string;
  name: string;
  company: string;
  email: string;
  phone: string;
  grade: number;
  status: string;
  contractCount: number;
  registrationDate: string;
  address: string;
  memo: string;
  profileImage?: string;
  statusMessage?: string;
}

const customerApi = {
  getAll: async (filters?: any): Promise<Customer[]> => {
    try {
      const response = await axios.get(getApiPath("/customers"), {
        params: filters,
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching customers:", error);
      throw error;
    }
  },

  getById: async (id: string | number): Promise<Customer> => {
    try {
      const response = await axios.get(getApiPath(`/customers/${id}`));
      return response.data;
    } catch (error) {
      console.error(`Error fetching customer ${id}:`, error);
      throw error;
    }
  },

  create: async (customer: Omit<Customer, "id">): Promise<Customer> => {
    try {
      console.log(
        "Creating customer with data:",
        JSON.stringify(
          {
            ...customer,
            profileImage: customer.profileImage
              ? "이미지 데이터 (생략됨)"
              : undefined,
          },
          null,
          2
        )
      );

      // 서버가 기대하는 정확한 형태로 변환
      const payload = {
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        company: customer.company || "정보 없음",
        address: customer.address || "정보 없음",
        grade: Number(customer.grade || 3),
        type: "customer",
        role: "customer",
        status: customer.status || "active",
        statusMessage: customer.statusMessage || "",
        registrationDate: new Date().toISOString(),
        memo: customer.memo || "",
        department: customer.department || "",
        assignedTo: customer.assignedTo || "",
      };

      // profileImage 필드는 별도로 업로드할 것이므로 제거
      delete payload.profileImage;

      console.log("Final customer payload:", JSON.stringify(payload, null, 2));

      const response = await axios.post(getApiPath("/customers"), payload);
      console.log("Customer created successfully:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error creating customer:", error);
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
    customer: Partial<Customer>
  ): Promise<Customer> => {
    try {
      if (!id) {
        throw new Error("ID가 필요합니다.");
      }

      console.log(`Updating customer with ID: ${id}`);
      console.log("Update payload:", JSON.stringify(customer, null, 2));

      const response = await axios.patch(
        getApiPath(`/customers/${id}`),
        customer
      );
      console.log("Update response:", response.data);
      return response.data;
    } catch (error) {
      console.error(`Error updating customer ${id}:`, error);
      if (axios.isAxiosError(error) && error.response) {
        console.error("Error response data:", error.response.data);
        console.error(
          "Error message details:",
          JSON.stringify(error.response.data.message)
        );
        console.error("Error response status:", error.response.status);
      }
      throw error;
    }
  },

  updateStatus: async (
    id: string | number,
    status: string
  ): Promise<Customer> => {
    try {
      if (!id) {
        throw new Error("ID가 필요합니다.");
      }

      const response = await axios.patch(getApiPath(`/customers/${id}`), {
        status,
      });
      return response.data;
    } catch (error) {
      console.error(`Error updating customer status ${id}:`, error);
      throw error;
    }
  },

  delete: async (id: string | number): Promise<void> => {
    try {
      if (!id) {
        throw new Error("ID가 필요합니다.");
      }

      await axios.delete(getApiPath(`/customers/${id}`));
    } catch (error) {
      console.error(`Error deleting customer ${id}:`, error);
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

      console.log(`고객 ID: ${id}에 대한 프로필 이미지 업로드 시작`);

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
        getApiPath("/files/upload-to-db"),
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

      // 고객 정보 업데이트 (프로필 이미지 ID 연결)
      if (response.data && response.data.id) {
        await customerApi.update(id, { profileImage: response.data.id });
        console.log(
          `고객 정보가 업데이트되었습니다. 프로필 이미지 ID: ${response.data.id}`
        );
      }

      return response.data;
    } catch (error) {
      console.error(`고객 ${id}의 프로필 이미지 업로드 중 오류 발생:`, error);
      if (axios.isAxiosError(error) && error.response) {
        console.error("오류 응답 데이터:", error.response.data);
        console.error("오류 상태 코드:", error.response.status);
      }
      throw error;
    }
  },

  uploadFiles: async (
    id: string | number,
    formData: FormData
  ): Promise<any> => {
    try {
      if (!id) {
        throw new Error("ID가 필요합니다.");
      }

      // FormData 내용 로깅
      console.log(`고객 ID: ${id}에 대한 파일 업로드 시작`);
      console.log("FormData 키 목록:");
      for (const key of formData.keys()) {
        console.log(`- ${key}`);
      }

      // 업로드 방식 설정 (DB 저장 또는 파일 시스템)
      formData.append("storeInDb", "true"); // PostgreSQL에 직접 저장
      formData.append("entityType", "customer");
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
        newFormData.append("entityType", "customer");
        newFormData.append("entityId", id.toString());
        newFormData.append("category", "profileImage");

        const response = await axios.post(
          getApiPath("/files/upload-to-db"),
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
        uploadUrl = getApiPath("/files/upload");

        // profileImage를 file로 변경
        if (formData.has("profileImage")) {
          const profileImage = formData.get("profileImage");
          formData.delete("profileImage");
          formData.append("file", profileImage as Blob);
          formData.append("category", "profileImage");
        }
      } else {
        uploadUrl = getApiPath("/files/multi-upload");

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
      console.error(`Error uploading files for customer ${id}:`, error);
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
    return getApiPath(`/files/${fileId}/data`);
  },

  // 고객 관련 파일 목록 가져오기
  getFiles: async (id: string | number): Promise<any[]> => {
    try {
      if (!id) {
        throw new Error("ID가 필요합니다.");
      }

      const response = await axios.get(
        getApiPath(`/files/by-entity/customer/${id}`)
      );
      return response.data;
    } catch (error) {
      console.error(`Error fetching files for customer ${id}:`, error);
      throw error;
    }
  },
};

export default customerApi;
