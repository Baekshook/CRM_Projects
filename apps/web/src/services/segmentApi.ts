import axios from "axios";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://crm-backend-env-env.eba-m3mmahdu.ap-northeast-1.elasticbeanstalk.com/api";

export interface Segment {
  id?: number;
  name: string;
  description: string;
  criteria: string;
  tags?: string[];
  createdAt?: string;
  updatedAt?: string;
  customerCount?: number;
}

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export const segmentApi = {
  getAll: async (): Promise<Segment[]> => {
    try {
      const response = await axios.get(`${API_URL}/segments`);
      return response.data;
    } catch (error) {
      console.error("세그먼트 목록 조회 실패:", error);
      throw error;
    }
  },

  getById: async (id: number | string): Promise<Segment> => {
    try {
      const response = await axios.get(`${API_URL}/segments/${id}`);
      return response.data;
    } catch (error) {
      console.error(`세그먼트 ${id} 조회 실패:`, error);
      throw error;
    }
  },

  create: async (segment: Segment): Promise<Segment> => {
    try {
      const response = await axios.post(`${API_URL}/segments`, segment);
      return response.data;
    } catch (error) {
      console.error("세그먼트 생성 실패:", error);
      throw error;
    }
  },

  update: async (
    id: number | string,
    segment: Partial<Segment>
  ): Promise<Segment> => {
    try {
      const response = await axios.patch(`${API_URL}/segments/${id}`, segment);
      return response.data;
    } catch (error) {
      console.error(`세그먼트 ${id} 업데이트 실패:`, error);
      throw error;
    }
  },

  delete: async (id: number | string): Promise<void> => {
    try {
      await axios.delete(`${API_URL}/segments/${id}`);
    } catch (error) {
      console.error(`세그먼트 ${id} 삭제 실패:`, error);
      throw error;
    }
  },
};
