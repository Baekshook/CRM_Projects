import axios from "axios";
import {
  ResourceItem,
  ResourceType,
  SingerResourceCategory,
} from "@/components/customers/types";

const API_BASE_URL = "http://localhost:4000/api";

export interface ResourceFilters {
  entityId?: string; // 가수 ID
  category?: string;
  type?: string;
  tags?: string[];
  startDate?: string;
  endDate?: string;
  searchTerm?: string;
}

// 가수 자료 관련 API 함수 모음
export const getResources = async (
  filters?: ResourceFilters
): Promise<ResourceItem[]> => {
  try {
    // 쿼리 파라미터 구성
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (Array.isArray(value)) {
            value.forEach((v) => params.append(`${key}[]`, v));
          } else if (value !== "") {
            params.append(key, value.toString());
          }
        }
      });
    }

    const queryString = params.toString() ? `?${params.toString()}` : "";
    const response = await axios.get(`${API_BASE_URL}/resources${queryString}`);
    return response.data;
  } catch (error) {
    console.error("자료 목록 조회 실패:", error);
    throw error;
  }
};

/**
 * 자료를 업로드합니다.
 */
export const uploadResource = async (
  file: File,
  entityId: string,
  category: string,
  description?: string,
  tags?: string[]
): Promise<ResourceItem> => {
  try {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("entityId", entityId);
    formData.append("entityType", "singer"); // 현재는 가수 자료만 처리
    formData.append("category", category);

    if (description) {
      formData.append("description", description);
    }

    // 파일 유형에 따라 자동 태그 생성
    const fileType = getFileType(file.type);
    const defaultTags = getDefaultTags(category, fileType);

    const allTags = [...(tags || []), ...defaultTags];
    if (allTags.length > 0) {
      allTags.forEach((tag) => formData.append("tags[]", tag));
    }

    const response = await axios.post(
      `${API_BASE_URL}/resources/upload`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("자료 업로드 실패:", error);
    throw error;
  }
};

/**
 * 자료를 삭제합니다.
 */
export const deleteResource = async (id: string): Promise<boolean> => {
  try {
    await axios.delete(`${API_BASE_URL}/resources/${id}`);
    return true;
  } catch (error) {
    console.error(`자료 ID ${id} 삭제 실패:`, error);
    throw error;
  }
};

/**
 * 파일 타입을 MIME 타입으로부터 결정합니다.
 */
function getFileType(mimeType: string): string {
  if (mimeType.startsWith("image/")) {
    return "image";
  } else if (mimeType.startsWith("video/")) {
    return "video";
  } else if (mimeType.startsWith("audio/")) {
    return "audio";
  } else if (mimeType === "application/pdf") {
    return "document";
  } else if (
    mimeType === "application/msword" ||
    mimeType ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
    mimeType === "application/vnd.ms-excel" ||
    mimeType ===
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
    mimeType === "application/vnd.ms-powerpoint" ||
    mimeType ===
      "application/vnd.openxmlformats-officedocument.presentationml.presentation"
  ) {
    return "document";
  }
  return "other";
}

/**
 * 카테고리와 파일 타입에 따라 기본 태그를 생성합니다.
 */
function getDefaultTags(category: string, fileType: string): string[] {
  const tags: string[] = [];

  // 카테고리별 기본 태그
  if (category === "profile") {
    tags.push("프로필");
  } else if (category === "performance") {
    tags.push("공연");
  } else if (category === "contract") {
    tags.push("계약");
  } else if (category === "portfolio") {
    tags.push("포트폴리오");
  }

  // 파일 타입별 기본 태그
  if (fileType === "image") {
    tags.push("이미지");
  } else if (fileType === "video") {
    tags.push("영상");
  } else if (fileType === "audio") {
    tags.push("음원");
  } else if (fileType === "document") {
    tags.push("문서");
  }

  return tags;
}
