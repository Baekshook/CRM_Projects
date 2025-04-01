import { getApiUrl } from "@/config/api";

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export async function fetchApi<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(getApiUrl(endpoint), {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "서버 오류가 발생했습니다.");
    }

    return {
      success: true,
      data: data as T,
    };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "알 수 없는 오류가 발생했습니다.",
    };
  }
}

export const api = {
  get: <T>(endpoint: string, options: RequestInit = {}) =>
    fetchApi<T>(endpoint, { ...options, method: "GET" }),

  post: <T>(endpoint: string, body: any, options: RequestInit = {}) =>
    fetchApi<T>(endpoint, {
      ...options,
      method: "POST",
      body: JSON.stringify(body),
    }),

  put: <T>(endpoint: string, body: any, options: RequestInit = {}) =>
    fetchApi<T>(endpoint, {
      ...options,
      method: "PUT",
      body: JSON.stringify(body),
    }),

  delete: <T>(endpoint: string, options: RequestInit = {}) =>
    fetchApi<T>(endpoint, { ...options, method: "DELETE" }),
};

const API_URL = 'http://localhost:4000/api';

// API 응답 타입
interface ApiResponse<T> {
  data?: T;
  error?: string;
}

// 고객 API
export const customerApi = {
  // 모든 고객 조회
  getAll: async (): Promise<ApiResponse<any[]>> => {
    try {
      const response = await fetch(`${API_URL}/customers`);
      if (!response.ok) {
        throw new Error('고객 목록을 불러오는데 실패했습니다.');
      }
      const data = await response.json();
      return { data };
    } catch (error) {
      return { error: error.message };
    }
  },

  // 특정 고객 조회
  getById: async (id: string): Promise<ApiResponse<any>> => {
    try {
      const response = await fetch(`${API_URL}/customers/${id}`);
      if (!response.ok) {
        throw new Error('고객 정보를 불러오는데 실패했습니다.');
      }
      const data = await response.json();
      return { data };
    } catch (error) {
      return { error: error.message };
    }
  },

  // 고객 생성
  create: async (customer: any): Promise<ApiResponse<any>> => {
    try {
      const response = await fetch(`${API_URL}/customers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(customer),
      });
      if (!response.ok) {
        throw new Error('고객 생성에 실패했습니다.');
      }
      const data = await response.json();
      return { data };
    } catch (error) {
      return { error: error.message };
    }
  },

  // 고객 수정
  update: async (id: string, customer: any): Promise<ApiResponse<any>> => {
    try {
      const response = await fetch(`${API_URL}/customers/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(customer),
      });
      if (!response.ok) {
        throw new Error('고객 정보 수정에 실패했습니다.');
      }
      const data = await response.json();
      return { data };
    } catch (error) {
      return { error: error.message };
    }
  },

  // 고객 삭제
  remove: async (id: string): Promise<ApiResponse<boolean>> => {
    try {
      const response = await fetch(`${API_URL}/customers/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('고객 삭제에 실패했습니다.');
      }
      return { data: true };
    } catch (error) {
      return { error: error.message };
    }
  },
};

// 가수 API
export const singerApi = {
  // 모든 가수 조회
  getAll: async (): Promise<ApiResponse<any[]>> => {
    try {
      const response = await fetch(`${API_URL}/singers`);
      if (!response.ok) {
        throw new Error('가수 목록을 불러오는데 실패했습니다.');
      }
      const data = await response.json();
      return { data };
    } catch (error) {
      return { error: error.message };
    }
  },

  // 특정 가수 조회
  getById: async (id: string): Promise<ApiResponse<any>> => {
    try {
      const response = await fetch(`${API_URL}/singers/${id}`);
      if (!response.ok) {
        throw new Error('가수 정보를 불러오는데 실패했습니다.');
      }
      const data = await response.json();
      return { data };
    } catch (error) {
      return { error: error.message };
    }
  },

  // 가수 생성
  create: async (singer: any): Promise<ApiResponse<any>> => {
    try {
      const response = await fetch(`${API_URL}/singers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(singer),
      });
      if (!response.ok) {
        throw new Error('가수 생성에 실패했습니다.');
      }
      const data = await response.json();
      return { data };
    } catch (error) {
      return { error: error.message };
    }
  },

  // 가수 수정
  update: async (id: string, singer: any): Promise<ApiResponse<any>> => {
    try {
      const response = await fetch(`${API_URL}/singers/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(singer),
      });
      if (!response.ok) {
        throw new Error('가수 정보 수정에 실패했습니다.');
      }
      const data = await response.json();
      return { data };
    } catch (error) {
      return { error: error.message };
    }
  },

  // 가수 삭제
  remove: async (id: string): Promise<ApiResponse<boolean>> => {
    try {
      const response = await fetch(`${API_URL}/singers/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('가수 삭제에 실패했습니다.');
      }
      return { data: true };
    } catch (error) {
      return { error: error.message };
    }
  },
};

// 요청 API
export const requestApi = {
  // 모든 요청 조회
  getAll: async (): Promise<ApiResponse<any[]>> => {
    try {
      const response = await fetch(`${API_URL}/requests`);
      if (!response.ok) {
        throw new Error('요청 목록을 불러오는데 실패했습니다.');
      }
      const data = await response.json();
      return { data };
    } catch (error) {
      return { error: error.message };
    }
  },

  // 특정 요청 조회
  getById: async (id: string): Promise<ApiResponse<any>> => {
    try {
      const response = await fetch(`${API_URL}/requests/${id}`);
      if (!response.ok) {
        throw new Error('요청 정보를 불러오는데 실패했습니다.');
      }
      const data = await response.json();
      return { data };
    } catch (error) {
      return { error: error.message };
    }
  },

  // 요청 생성
  create: async (request: any): Promise<ApiResponse<any>> => {
    try {
      const response = await fetch(`${API_URL}/requests`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });
      if (!response.ok) {
        throw new Error('요청 생성에 실패했습니다.');
      }
      const data = await response.json();
      return { data };
    } catch (error) {
      return { error: error.message };
    }
  },

  // 요청 수정
  update: async (id: string, request: any): Promise<ApiResponse<any>> => {
    try {
      const response = await fetch(`${API_URL}/requests/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });
      if (!response.ok) {
        throw new Error('요청 정보 수정에 실패했습니다.');
      }
      const data = await response.json();
      return { data };
    } catch (error) {
      return { error: error.message };
    }
  },

  // 요청 삭제
  remove: async (id: string): Promise<ApiResponse<boolean>> => {
    try {
      const response = await fetch(`${API_URL}/requests/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('요청 삭제에 실패했습니다.');
      }
      return { data: true };
    } catch (error) {
      return { error: error.message };
    }
  },
};
