import axios from "axios";

const API_BASE_URL = "http://localhost:4000/api";

// 계약 인터페이스
export interface Contract {
  id: string;
  customerId: string;
  singerId: string;
  customerName?: string;
  singerName?: string;
  date: string;
  amount: number;
  status: "pending" | "completed" | "canceled";
  type: string;
  category: string;
  createdAt?: string;
  updatedAt?: string;
}

// 차트 데이터 인터페이스
export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string[] | string;
    borderColor?: string[] | string;
    borderWidth?: number;
  }[];
}

// 분기별 데이터 인터페이스
export interface QuarterlyData {
  quarter: string;
  contractCount: number;
  totalAmount: number;
  averageAmount: number;
}

// 계약 필터 인터페이스
export interface ContractFilters {
  customerId?: string;
  singerId?: string;
  startDate?: string;
  endDate?: string;
  status?: string;
  type?: string;
  category?: string;
  minAmount?: number;
  maxAmount?: number;
}

/**
 * 모든 계약 또는 필터링된 계약 목록을 가져옵니다.
 */
export const getContracts = async (
  filters?: ContractFilters
): Promise<Contract[]> => {
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
    const response = await axios.get(`${API_BASE_URL}/contracts${queryString}`);
    return response.data;
  } catch (error) {
    console.error("계약 목록 조회 실패:", error);
    throw error;
  }
};

/**
 * 특정 계약의 상세 정보를 가져옵니다.
 */
export const getContractById = async (id: string): Promise<Contract> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/contracts/${id}`);
    return response.data;
  } catch (error) {
    console.error(`계약 ID ${id} 상세 조회 실패:`, error);
    throw error;
  }
};

/**
 * 계약을 생성합니다.
 */
export const createContract = async (
  contract: Omit<Contract, "id">
): Promise<Contract> => {
  try {
    const response = await axios.post(`${API_BASE_URL}/contracts`, contract);
    return response.data;
  } catch (error) {
    console.error("계약 생성 실패:", error);
    throw error;
  }
};

/**
 * 계약을 업데이트합니다.
 */
export const updateContract = async (
  id: string,
  contract: Partial<Contract>
): Promise<Contract> => {
  try {
    const response = await axios.patch(
      `${API_BASE_URL}/contracts/${id}`,
      contract
    );
    return response.data;
  } catch (error) {
    console.error(`계약 ID ${id} 업데이트 실패:`, error);
    throw error;
  }
};

/**
 * 계약을 삭제합니다.
 */
export const deleteContract = async (id: string): Promise<boolean> => {
  try {
    await axios.delete(`${API_BASE_URL}/contracts/${id}`);
    return true;
  } catch (error) {
    console.error(`계약 ID ${id} 삭제 실패:`, error);
    throw error;
  }
};

/**
 * 월별 계약 통계를 가져옵니다.
 */
export const getMonthlyStats = async (): Promise<ChartData> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/contracts/stats/monthly`);
    return response.data;
  } catch (error) {
    console.error("월별 계약 통계 조회 실패:", error);
    throw error;
  }
};

/**
 * 카테고리별 계약 통계를 가져옵니다.
 */
export const getCategoryStats = async (): Promise<ChartData> => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/contracts/stats/category`
    );
    return response.data;
  } catch (error) {
    console.error("카테고리별 계약 통계 조회 실패:", error);
    throw error;
  }
};

/**
 * 계약 유형별 통계를 가져옵니다.
 */
export const getTypeStats = async (): Promise<ChartData> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/contracts/stats/type`);
    return response.data;
  } catch (error) {
    console.error("계약 유형별 통계 조회 실패:", error);
    throw error;
  }
};

/**
 * 분기별 계약 통계를 가져옵니다.
 */
export const getQuarterlyStats = async (): Promise<QuarterlyData[]> => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/contracts/stats/quarterly`
    );
    return response.data;
  } catch (error) {
    console.error("분기별 계약 통계 조회 실패:", error);
    throw error;
  }
};

/**
 * 최다 계약 금액 기준 상위 고객 목록을 가져옵니다.
 */
export const getTopCustomers = async (
  limit: number = 5
): Promise<{ name: string; totalAmount: number; contractCount: number }[]> => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/contracts/stats/top-customers?limit=${limit}`
    );
    return response.data;
  } catch (error) {
    console.error("최다 계약 고객 조회 실패:", error);
    throw error;
  }
};

/**
 * 최다 계약 금액 기준 상위 가수 목록을 가져옵니다.
 */
export const getTopSingers = async (
  limit: number = 5
): Promise<{ name: string; totalAmount: number; contractCount: number }[]> => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/contracts/stats/top-singers?limit=${limit}`
    );
    return response.data;
  } catch (error) {
    console.error("최다 계약 가수 조회 실패:", error);
    throw error;
  }
};
