import axios from "axios";

const API_BASE_URL = "http://localhost:4000/api";

// 협상 인터페이스
export interface Negotiation {
  id: string;
  customerId: string;
  singerId: string;
  status: "pending" | "in-progress" | "final-quote" | "cancelled" | "completed";
  title?: string;
  description?: string;
  initialAmount: number;
  finalAmount: number;
  eventDate?: string;
  eventLocation?: string;
  eventType?: string;
  eventDuration?: number;
  isUrgent: boolean;
  deadline?: string;
  notes?: string;
  requirements?: string;
  assignedTo?: string;
  createdAt: string;
  updatedAt: string;
  customer?: any;
  singer?: any;
  quotes?: Quote[];
  logs?: NegotiationLog[];
}

// 고객 인터페이스
export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  company?: string;
  position?: string;
  address?: string;
  notes?: string;
  type?: string;
  segment?: string;
  createdAt: string;
  updatedAt: string;
}

// 가수 인터페이스
export interface Singer {
  id: string;
  name: string;
  email: string;
  phone: string;
  agency?: string;
  genre?: string;
  fee?: number;
  description?: string;
  rating?: number;
  createdAt: string;
  updatedAt: string;
}

// 요청서 인터페이스
export interface Request {
  id: string;
  customerId: string;
  title: string;
  eventType: string;
  eventDate: string;
  venue: string;
  budget: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  description?: string;
  requirements?: string;
  customer?: Customer;
  singerId?: string;
  singer?: Singer;
}

// 견적서 인터페이스
export interface Quote {
  id: string;
  negotiationId: string;
  amount: number;
  status: "draft" | "sent" | "accepted" | "rejected" | "revised" | "final";
  description?: string;
  validUntil?: string;
  items?: QuoteItem[];
  tax: number;
  discount: number;
  discountReason?: string;
  terms?: string;
  notes?: string;
  createdBy?: string;
  updatedBy?: string;
  isFinal: boolean;
  createdAt: string;
  updatedAt: string;
}

// 견적서 항목 인터페이스
export interface QuoteItem {
  id: string;
  name: string;
  description?: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

// 협상 로그 인터페이스
export interface NegotiationLog {
  id: string;
  negotiationId: string;
  matchId?: string;
  date: string;
  type: string;
  content: string;
  user: string;
  createdAt: string;
}

// 가수 후보 인터페이스
export interface SingerCandidate {
  id: string;
  requestId: string;
  singerId: string;
  status: string;
  price?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  singer?: Singer;
}

// 요청서 로그 인터페이스
export interface RequestLog {
  id: string;
  requestId: string;
  date: string;
  action: string;
  user: string;
  createdAt: string;
}

// 협상 생성용 인터페이스
export interface CreateNegotiationParams {
  customerId: string;
  singerId?: string;
  status?:
    | "pending"
    | "in-progress"
    | "final-quote"
    | "cancelled"
    | "completed";
  title: string;
  description?: string;
  initialAmount?: number;
  finalAmount?: number;
  eventDate?: string;
  eventLocation?: string;
  eventType?: string;
  eventDuration?: number;
  isUrgent?: boolean;
  deadline?: string;
  notes?: string;
  requirements?: string;
  assignedTo?: string;
  requestId?: string;
}

// 모든 협상 데이터 가져오기
export const getAllNegotiations = async (query?: any) => {
  try {
    const queryString = query ? new URLSearchParams(query).toString() : "";
    const response = await axios.get(
      `${API_BASE_URL}/negotiations?${queryString}`
    );
    return response.data;
  } catch (error) {
    console.error("협상 목록 조회 실패:", error);
    throw error;
  }
};

// 특정 상태의 협상 데이터 가져오기
export const getNegotiationsByStatus = async (status: string) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/negotiations/status/${status}`
    );
    return response.data;
  } catch (error) {
    console.error(`${status} 상태의 협상 목록 조회 실패:`, error);
    throw error; // 에러를 그대로 전달
  }
};

// 상태명 표시 변환 함수
const getStatusDisplayName = (status: string): string => {
  switch (status) {
    case "pending":
      return "견적 검토";
    case "in-progress":
      return "협상 중";
    case "final-quote":
      return "최종 견적서";
    case "completed":
      return "완료됨";
    case "cancelled":
      return "취소됨";
    default:
      return "알 수 없음";
  }
};

// 특정 협상 데이터 가져오기
export const getNegotiationById = async (id: string) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/negotiations/${id}`);
    return response.data;
  } catch (error) {
    console.error("협상 상세 정보 조회 실패:", error);
    throw error; // 에러를 그대로 전달
  }
};

// 협상 생성하기
export const createNegotiation = async (
  negotiationData: CreateNegotiationParams
) => {
  try {
    // 입력 데이터 검증
    const MAX_INT_VALUE = 2147483647;

    // 데이터 정리
    const cleanedData = { ...negotiationData };

    // 금액 필드 검증 및 정리
    if (cleanedData.initialAmount !== undefined) {
      const amount = Number(cleanedData.initialAmount);
      if (isNaN(amount) || amount > MAX_INT_VALUE) {
        throw new Error("초기 견적 금액이 유효하지 않습니다.");
      }
      cleanedData.initialAmount = amount;
    }

    if (cleanedData.finalAmount !== undefined) {
      const amount = Number(cleanedData.finalAmount);
      if (isNaN(amount) || amount > MAX_INT_VALUE) {
        throw new Error("최종 계약 금액이 유효하지 않습니다.");
      }
      cleanedData.finalAmount = amount;
    }

    // 필수 필드 확인
    if (!cleanedData.customerId) {
      throw new Error("고객 정보가 필요합니다.");
    }

    if (!cleanedData.status) {
      cleanedData.status = "pending"; // 기본값 설정
    }

    // isUrgent 필드 추가
    cleanedData.isUrgent = cleanedData.isUrgent || false;

    console.log("전송할 협상 데이터:", cleanedData);
    const response = await axios.post(
      `${API_BASE_URL}/negotiations`,
      cleanedData
    );
    return response.data;
  } catch (error) {
    console.error("협상 생성 실패:", error);
    throw error;
  }
};

// 협상 업데이트하기
export const updateNegotiation = async (id: string, negotiationData: any) => {
  try {
    // 데이터 유효성 검증
    const cleanedData = { ...negotiationData };

    // 가격 필드 검증
    if (cleanedData.initialAmount !== undefined) {
      const MAX_INT_VALUE = 2147483647;
      const amount = Number(cleanedData.initialAmount);
      if (isNaN(amount) || amount > MAX_INT_VALUE) {
        throw new Error("초기 견적 금액이 유효하지 않습니다.");
      }
      cleanedData.initialAmount = amount;
    }

    // API 호출
    console.log(`협상 ID ${id} 업데이트 데이터:`, cleanedData);
    const response = await axios.patch(
      `${API_BASE_URL}/negotiations/${id}`,
      cleanedData
    );
    return response.data;
  } catch (error) {
    console.error("협상 업데이트 실패:", error);
    throw error; // 에러를 그대로 전달
  }
};

// 협상 삭제하기
export const deleteNegotiation = async (id: string) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/negotiations/${id}`);
    return response.data;
  } catch (error) {
    console.error("협상 삭제 실패:", error);
    throw error;
  }
};

// 특정 협상의 견적서 목록 가져오기
export const getQuotesByNegotiationId = async (negotiationId: string) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/negotiations/${negotiationId}/quotes`
    );
    return response.data;
  } catch (error) {
    console.error("견적서 목록 조회 실패:", error);
    throw error;
  }
};

// 특정 견적서 가져오기
export const getQuoteById = async (id: string) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/negotiations/quotes/${id}`
    );
    return response.data;
  } catch (error) {
    console.error("견적서 상세 정보 조회 실패:", error);
    throw error;
  }
};

// 견적서 생성하기
export const createQuote = async (quoteData: any) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/negotiations/quotes`,
      quoteData
    );
    return response.data;
  } catch (error) {
    console.error("견적서 생성 실패:", error);
    throw error;
  }
};

// 견적서 업데이트하기
export const updateQuote = async (id: string, quoteData: any) => {
  try {
    const response = await axios.patch(
      `${API_BASE_URL}/negotiations/quotes/${id}`,
      quoteData
    );
    return response.data;
  } catch (error) {
    console.error("견적서 업데이트 실패:", error);
    throw error;
  }
};

// 협상 로그 가져오기
export const getNegotiationLogs = async (negotiationId: string) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/negotiations/${negotiationId}/logs`
    );
    return response.data;
  } catch (error) {
    console.error("협상 로그 조회 실패:", error);
    throw error; // 에러를 그대로 전달
  }
};

// 협상 로그 추가하기
export const addNegotiationLog = async (logData: any) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/negotiations/logs`,
      logData
    );
    return response.data;
  } catch (error) {
    console.error("협상 로그 추가 실패:", error);
    throw error;
  }
};

// 모든 고객 데이터 가져오기
export const getAllCustomers = async (query?: any) => {
  try {
    const queryString = query ? new URLSearchParams(query).toString() : "";
    const response = await axios.get(
      `${API_BASE_URL}/customers?${queryString}`
    );
    return response.data;
  } catch (error) {
    console.error("고객 목록 조회 실패:", error);
    // 임시 더미 데이터 반환 (개발 중 오류 시)
    return [
      {
        id: "dummy-cust-001",
        name: "김철수",
        email: "customer1@example.com",
        phone: "010-1234-5678",
        company: "ABC 기업",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "dummy-cust-002",
        name: "이영희",
        email: "customer2@example.com",
        phone: "010-2345-6789",
        company: "XYZ 홀딩스",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];
  }
};

// 특정 고객 데이터 가져오기
export const getCustomerById = async (id: string) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/customers/${id}`);
    return response.data;
  } catch (error) {
    console.error("고객 상세 정보 조회 실패:", error);
    // 임시 더미 데이터 반환 (개발 중 오류 시)
    return {
      id: id,
      name: "고객 " + id.substring(0, 4),
      email: `customer${id.substring(0, 2)}@example.com`,
      phone: "010-0000-0000",
      company: "더미 회사",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }
};

// 모든 가수 데이터 가져오기
export const getAllSingers = async (query?: any) => {
  try {
    const queryString = query ? new URLSearchParams(query).toString() : "";
    const response = await axios.get(`${API_BASE_URL}/singers?${queryString}`);
    return response.data;
  } catch (error) {
    console.error("가수 목록 조회 실패:", error);
    // 임시 더미 데이터 반환 (개발 중 오류 시)
    return [
      {
        id: "dummy-singer-001",
        name: "박지성",
        email: "singer1@example.com",
        phone: "010-9876-5432",
        agency: "스타 엔터테인먼트",
        rating: 4.8,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "dummy-singer-002",
        name: "최동욱",
        email: "singer2@example.com",
        phone: "010-8765-4321",
        agency: "드림 뮤직",
        rating: 4.2,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];
  }
};

// 특정 가수 데이터 가져오기
export const getSingerById = async (id: string) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/singers/${id}`);
    return response.data;
  } catch (error) {
    console.error("가수 상세 정보 조회 실패:", error);
    // 임시 더미 데이터 반환 (개발 중 오류 시)
    return {
      id: id,
      name: "가수 " + id.substring(0, 4),
      email: `singer${id.substring(0, 2)}@example.com`,
      phone: "010-0000-0000",
      agency: "더미 기획사",
      rating: 4.3,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }
};

// 모든 요청 데이터 가져오기
export const getAllRequests = async (query?: any) => {
  try {
    const queryString = query ? new URLSearchParams(query).toString() : "";
    const response = await axios.get(`${API_BASE_URL}/requests?${queryString}`);
    return response.data;
  } catch (error) {
    console.error("요청 목록 조회 실패:", error);
    // 임시 더미 데이터 반환 (개발 중 오류 시)
    return [
      {
        id: "dummy-req-001",
        customerId: "dummy-cust-001",
        title: "기업 행사 공연 요청",
        eventType: "기업행사",
        eventDate: new Date().toISOString(),
        venue: "서울 강남구 코엑스",
        budget: 5000000,
        status: "pending",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "dummy-req-002",
        customerId: "dummy-cust-002",
        title: "결혼식 축가 요청",
        eventType: "결혼식",
        eventDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        venue: "서울 송파구 롯데호텔",
        budget: 1000000,
        status: "in_progress",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];
  }
};

// 상태별 요청 데이터 가져오기 (클라이언트 측 필터링)
export const getRequestsByStatus = async (status: string) => {
  try {
    // 백엔드에 status 엔드포인트가 없으므로 모든 요청을 가져온 후 필터링
    const allRequests = await getAllRequests();
    return allRequests.filter((request: any) => request.status === status);
  } catch (error) {
    console.error(`${status} 상태의 요청 목록 조회 실패:`, error);
    // 임시 더미 데이터 반환 (개발 중 오류 시)
    return [
      {
        id: `dummy-${status}-001`,
        customerId: "dummy-cust-001",
        title: `${status} 상태의 샘플 요청`,
        eventType: "기업행사",
        eventDate: new Date().toISOString(),
        venue: "서울 강남구",
        budget: 3000000,
        status: status,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];
  }
};

// 특정 요청 데이터 가져오기
export const getRequestById = async (id: string) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/requests/${id}`);
    return response.data;
  } catch (error) {
    console.error("요청 상세 정보 조회 실패:", error);
    // 임시 더미 데이터 반환 (개발 중 오류 시)
    return {
      id: id,
      customerId: "dummy-cust-001",
      title: "더미 요청 데이터",
      eventType: "기업행사",
      eventDate: new Date().toISOString(),
      venue: "서울 강남구",
      budget: 3000000,
      status: "pending",
      description: "API 오류로 인한 임시 데이터입니다.",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }
};

// 새 요청 생성하기
export const createRequest = async (requestData: any) => {
  try {
    // 서버가 요구하는 필수 필드 검증
    const requiredFields = [
      "customerId",
      "customerName",
      "customerCompany",
      "title",
      "eventType",
      "eventDate",
      "eventTime",
      "venue",
      "budget",
      "requirements",
      "description",
    ];

    const missingFields = requiredFields.filter((field) => !requestData[field]);

    if (missingFields.length > 0) {
      throw new Error(
        `다음 필수 필드가 누락되었습니다: ${missingFields.join(", ")}`
      );
    }

    // 서버 형식에 맞게 데이터 변환
    const data = {
      ...requestData,
      // 서버에서 budget을 문자열로 요구함
      budget:
        typeof requestData.budget === "string"
          ? requestData.budget
          : String(requestData.budget),

      // 나머지 필드 처리
      requirements: requestData.requirements || "요청 사항 없음",
      description: requestData.description || "추가 세부 사항 없음",
      status: requestData.status || "pending",
    };

    console.log("API 요청 데이터:", data); // 디버깅용 로그

    const response = await axios.post(`${API_BASE_URL}/requests`, data);
    return response.data;
  } catch (error: any) {
    console.error("요청 생성 실패:", error);

    if (error.response) {
      console.error("서버 응답:", error.response.data);

      // 서버에서 구체적인 오류 메시지가 있으면 그것을 사용
      if (error.response.data && error.response.data.message) {
        const messages = Array.isArray(error.response.data.message)
          ? error.response.data.message
          : [error.response.data.message];

        console.error("서버 오류 메시지:", messages.join(", "));
        throw new Error(messages.join(", "));
      }
    }

    throw error; // 오류를 다시 throw하여 호출 측에서 처리하도록 함
  }
};

// 요청 업데이트하기
export const updateRequest = async (id: string, requestData: any) => {
  try {
    const data = {
      ...requestData,
      updatedAt: new Date().toISOString(),
    };

    const response = await axios.patch(`${API_BASE_URL}/requests/${id}`, data);
    return response.data;
  } catch (error) {
    console.error("요청 업데이트 실패:", error);
    // 임시 더미 데이터 반환 (개발 중 오류 시)
    return {
      id: id,
      ...requestData,
      updatedAt: new Date().toISOString(),
    };
  }
};

// 요청 삭제하기
export const deleteRequest = async (id: string) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/requests/${id}`);
    console.log("삭제 API 응답:", response.data);
    return response.data;
  } catch (error) {
    console.error("요청 삭제 실패:", error);
    throw error; // 실제 오류를 그대로 던짐
  }
};

// 특정 요청서의 가수 후보 목록 가져오기
export const getSingerCandidatesByRequestId = async (requestId: string) => {
  try {
    // API 엔드포인트가 구현되지 않아 404 오류 발생
    // const response = await axios.get(
    //   `${API_BASE_URL}/requests/${requestId}/candidates`
    // );
    // return response.data;

    // 임시 더미 데이터 바로 반환
    console.log("가수 후보 목록에 더미 데이터를 사용합니다");
    return [];
  } catch (error) {
    console.error("가수 후보 목록 조회 실패:", error);
    return [];
  }
};

// 가수 후보 추가하기
export const addSingerCandidate = async (candidateData: any) => {
  try {
    // API 엔드포인트가 구현되지 않았을 수 있음
    // const response = await axios.post(
    //   `${API_BASE_URL}/requests/candidates`,
    //   candidateData
    // );
    // return response.data;

    console.log("가수 후보 추가 API 요청:", candidateData);
    // 임시 더미 응답 데이터
    return {
      id: `candidate-${Date.now()}`,
      ...candidateData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  } catch (error) {
    console.error("가수 후보 추가 실패:", error);
    throw error;
  }
};

// 가수 후보 상태 변경하기
export const updateSingerCandidateStatus = async (
  candidateId: string,
  status: string
) => {
  try {
    // API 엔드포인트가 구현되지 않았을 수 있음
    // const response = await axios.patch(
    //   `${API_BASE_URL}/requests/candidates/${candidateId}`,
    //   { status }
    // );
    // return response.data;

    console.log(
      `가수 후보 상태 변경 API 요청: ID ${candidateId}, 상태 ${status}`
    );
    // 임시 더미 응답 데이터
    return {
      id: candidateId,
      status: status,
      updatedAt: new Date().toISOString(),
    };
  } catch (error) {
    console.error("가수 후보 상태 변경 실패:", error);
    throw error;
  }
};

// 요청서 로그 목록 가져오기
export const getRequestLogs = async (requestId: string) => {
  try {
    // API 엔드포인트가 구현되지 않아 404 오류 발생
    // const response = await axios.get(
    //   `${API_BASE_URL}/requests/${requestId}/logs`
    // );
    // return response.data;

    // 임시 더미 데이터 바로 반환
    console.log("요청서 로그에 더미 데이터를 사용합니다");
    return [
      {
        id: "LOG-001",
        requestId: requestId,
        date: new Date().toISOString(),
        action: "요청서 조회",
        user: "관리자",
        createdAt: new Date().toISOString(),
      },
    ];
  } catch (error) {
    console.error("요청서 로그 조회 실패:", error);
    return [];
  }
};

// 요청서 로그 추가하기
export const addRequestLog = async (logData: any) => {
  try {
    // API 엔드포인트가 구현되지 않았을 수 있음
    // const response = await axios.post(`${API_BASE_URL}/requests/logs`, logData);
    // return response.data;

    console.log("요청서 로그 추가 API 요청:", logData);
    // 임시 더미 응답 데이터
    return {
      id: `log-${Date.now()}`,
      ...logData,
      createdAt: new Date().toISOString(),
    };
  } catch (error) {
    console.error("요청서 로그 추가 실패:", error);
    throw error;
  }
};
