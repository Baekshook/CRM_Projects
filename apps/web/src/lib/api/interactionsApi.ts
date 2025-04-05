import axios from "axios";

const API_BASE_URL = "http://localhost:4000/api";

// 고객 상호작용 인터페이스
export interface Interaction {
  id: string;
  customerId: string;
  type: string;
  date: string;
  subject: string;
  content?: string;
  outcome?: string;
  followUpRequired?: boolean;
  followUpDate?: string;
  contactMethod?: string;
  contactPerson?: string;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

// 상호작용 필터 인터페이스
export interface InteractionFilters {
  customerId?: string;
  type?: string;
  startDate?: string;
  endDate?: string;
  followUpRequired?: boolean;
}

/**
 * 모든 상호작용 또는 필터링된 상호작용 목록을 가져옵니다.
 */
export const getInteractions = async (
  filters?: InteractionFilters
): Promise<Interaction[]> => {
  try {
    // 쿼리 파라미터 구성
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          params.append(key, value.toString());
        }
      });
    }

    const queryString = params.toString() ? `?${params.toString()}` : "";
    const response = await axios.get(
      `${API_BASE_URL}/interactions${queryString}`
    );
    return response.data;
  } catch (error) {
    console.error("상호작용 목록 조회 실패:", error);
    throw error;
  }
};

/**
 * 특정 상호작용의 상세 정보를 가져옵니다.
 */
export const getInteractionById = async (id: string): Promise<Interaction> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/interactions/${id}`);
    return response.data;
  } catch (error) {
    console.error(`상호작용 ID ${id} 상세 조회 실패:`, error);
    throw error;
  }
};

/**
 * 상호작용을 생성합니다.
 */
export const createInteraction = async (
  interaction: Omit<Interaction, "id">
): Promise<Interaction> => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/interactions`,
      interaction
    );
    return response.data;
  } catch (error) {
    console.error("상호작용 생성 실패:", error);
    throw error;
  }
};

/**
 * 상호작용을 업데이트합니다.
 */
export const updateInteraction = async (
  id: string,
  interaction: Partial<Interaction>
): Promise<Interaction> => {
  try {
    const response = await axios.patch(
      `${API_BASE_URL}/interactions/${id}`,
      interaction
    );
    return response.data;
  } catch (error) {
    console.error(`상호작용 ID ${id} 업데이트 실패:`, error);
    throw error;
  }
};

/**
 * 상호작용을 삭제합니다.
 */
export const deleteInteraction = async (id: string): Promise<boolean> => {
  try {
    await axios.delete(`${API_BASE_URL}/interactions/${id}`);
    return true;
  } catch (error) {
    console.error(`상호작용 ID ${id} 삭제 실패:`, error);
    throw error;
  }
};

/**
 * 후속조치가 필요한 상호작용 목록을 가져옵니다.
 */
export const getFollowUpInteractions = async (): Promise<Interaction[]> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/interactions/follow-up`);
    return response.data;
  } catch (error) {
    console.error("후속조치 필요 상호작용 조회 실패:", error);
    throw error;
  }
};

/**
 * 특정 고객의 상호작용 통계를 가져옵니다.
 */
export const getInteractionStats = async (
  customerId: string
): Promise<{
  total: number;
  byType: Record<string, number>;
  recent: Interaction[];
}> => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/interactions/stats/${customerId}`
    );
    return response.data;
  } catch (error) {
    console.error(`고객 ID ${customerId}의 상호작용 통계 조회 실패:`, error);
    throw error;
  }
};
