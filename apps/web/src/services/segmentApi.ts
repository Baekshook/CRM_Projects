import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

export interface Segment {
  id: string;
  name: string;
  description?: string;
  entityType: string;
  criteria?: Record<string, any>;
  memberCount: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSegmentDTO {
  name: string;
  description?: string;
  entityType: string;
  criteria?: Record<string, any>;
  isActive?: boolean;
}

export interface UpdateSegmentDTO {
  name?: string;
  description?: string;
  entityType?: string;
  criteria?: Record<string, any>;
  isActive?: boolean;
}

class SegmentApi {
  async getAll(): Promise<Segment[]> {
    try {
      console.log("Fetching all segments...");
      const response = await axios.get(`${API_URL}/segments`);
      return response.data;
    } catch (error) {
      console.error("세그먼트 데이터 로드 오류:", error);
      throw error;
    }
  }

  async getById(id: string): Promise<Segment> {
    try {
      console.log(`Fetching segment with id: ${id}`);
      const response = await axios.get(`${API_URL}/segments/${id}`);
      return response.data;
    } catch (error) {
      console.error(`세그먼트 데이터 로드 오류 (ID: ${id}):`, error);
      throw error;
    }
  }

  async create(segment: CreateSegmentDTO): Promise<Segment> {
    try {
      console.log("Creating new segment:", segment);
      const response = await axios.post(`${API_URL}/segments`, segment);
      return response.data;
    } catch (error) {
      console.error("세그먼트 생성 오류:", error);
      throw error;
    }
  }

  async update(id: string, segment: UpdateSegmentDTO): Promise<Segment> {
    try {
      console.log(`Updating segment ${id}:`, segment);
      const response = await axios.patch(`${API_URL}/segments/${id}`, segment);
      return response.data;
    } catch (error) {
      console.error(`세그먼트 업데이트 오류 (ID: ${id}):`, error);
      throw error;
    }
  }

  async delete(id: string): Promise<void> {
    try {
      console.log(`Deleting segment with id: ${id}`);
      await axios.delete(`${API_URL}/segments/${id}`);
    } catch (error) {
      console.error(`세그먼트 삭제 오류 (ID: ${id}):`, error);
      throw error;
    }
  }
}

export const segmentApi = new SegmentApi();
