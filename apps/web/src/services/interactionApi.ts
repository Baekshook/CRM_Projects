import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

export interface Interaction {
  id: string;
  title: string;
  content?: string;
  type: string;
  customerId?: string;
  customer?: any;
  userId?: string;
  contactName?: string;
  contactEmail?: string;
  contactPhone?: string;
  interactionDate?: string;
  status: string;
  metadata?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface CreateInteractionDTO {
  title: string;
  content?: string;
  type: string;
  customerId?: string;
  userId?: string;
  contactName?: string;
  contactEmail?: string;
  contactPhone?: string;
  interactionDate?: string;
  status?: string;
  metadata?: Record<string, any>;
}

export interface UpdateInteractionDTO {
  title?: string;
  content?: string;
  type?: string;
  customerId?: string;
  userId?: string;
  contactName?: string;
  contactEmail?: string;
  contactPhone?: string;
  interactionDate?: string;
  status?: string;
  metadata?: Record<string, any>;
}

class InteractionApi {
  async getAll(customerId?: string): Promise<Interaction[]> {
    try {
      console.log("Fetching interactions...");
      const url = customerId
        ? `${API_URL}/interactions?customerId=${customerId}`
        : `${API_URL}/interactions`;

      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      console.error("상호작용 목록 조회 실패:", error);
      throw error;
    }
  }

  async getById(id: string): Promise<Interaction> {
    try {
      console.log(`Fetching interaction with id: ${id}`);
      const response = await axios.get(`${API_URL}/interactions/${id}`);
      return response.data;
    } catch (error) {
      console.error(`상호작용 데이터 로드 실패 (ID: ${id}):`, error);
      throw error;
    }
  }

  async create(interaction: CreateInteractionDTO): Promise<Interaction> {
    try {
      console.log("Creating new interaction:", interaction);
      const response = await axios.post(`${API_URL}/interactions`, interaction);
      return response.data;
    } catch (error) {
      console.error("상호작용 생성 실패:", error);
      throw error;
    }
  }

  async update(
    id: string,
    interaction: UpdateInteractionDTO
  ): Promise<Interaction> {
    try {
      console.log(`Updating interaction ${id}:`, interaction);
      const response = await axios.patch(
        `${API_URL}/interactions/${id}`,
        interaction
      );
      return response.data;
    } catch (error) {
      console.error(`상호작용 업데이트 실패 (ID: ${id}):`, error);
      throw error;
    }
  }

  async delete(id: string): Promise<void> {
    try {
      console.log(`Deleting interaction with id: ${id}`);
      await axios.delete(`${API_URL}/interactions/${id}`);
    } catch (error) {
      console.error(`상호작용 삭제 실패 (ID: ${id}):`, error);
      throw error;
    }
  }
}

export const interactionApi = new InteractionApi();
