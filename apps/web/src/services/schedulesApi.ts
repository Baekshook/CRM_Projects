import { Schedule, Contract } from "@/utils/dummyData";

// Schedule 인터페이스는 dummyData에서 임포트하여 사용합니다.

// 일정 관련 API 함수들

// 모든 일정 조회
export const getAllSchedules = async () => {
  try {
    const response = await fetch("/api/schedules");
    if (!response.ok) {
      throw new Error("일정 목록을 불러오는데 실패했습니다.");
    }
    return await response.json();
  } catch (error) {
    console.error("일정 목록 조회 오류:", error);
    throw error;
  }
};

// 상태별 일정 조회
export const getSchedulesByStatus = async (status: string) => {
  try {
    const response = await fetch(`/api/schedules?status=${status}`);
    if (!response.ok) {
      throw new Error(`${status} 상태의 일정을 불러오는데 실패했습니다.`);
    }
    return await response.json();
  } catch (error) {
    console.error("상태별 일정 조회 오류:", error);
    throw error;
  }
};

// 일정 상세 조회
export const getScheduleById = async (id: string) => {
  try {
    const response = await fetch(`/api/schedules/${id}`);
    if (!response.ok) {
      throw new Error("일정 상세 정보를 불러오는데 실패했습니다.");
    }
    return await response.json();
  } catch (error) {
    console.error("일정 상세 조회 오류:", error);
    throw error;
  }
};

// 일정 생성
export const createSchedule = async (scheduleData: Partial<Schedule>) => {
  try {
    const response = await fetch("/api/schedules", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(scheduleData),
    });

    if (!response.ok) {
      throw new Error("일정 생성에 실패했습니다.");
    }

    return await response.json();
  } catch (error) {
    console.error("일정 생성 오류:", error);
    throw error;
  }
};

// 일정 수정
export const updateSchedule = async (
  id: string,
  scheduleData: Partial<Schedule>
) => {
  try {
    const response = await fetch(`/api/schedules/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(scheduleData),
    });

    if (!response.ok) {
      throw new Error("일정 수정에 실패했습니다.");
    }

    return await response.json();
  } catch (error) {
    console.error("일정 수정 오류:", error);
    throw error;
  }
};

// 일정 삭제
export const deleteSchedule = async (id: string) => {
  try {
    const response = await fetch(`/api/schedules/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("일정 삭제에 실패했습니다.");
    }

    return await response.json();
  } catch (error) {
    console.error("일정 삭제 오류:", error);
    throw error;
  }
};

// 날짜별 일정 조회
export const getSchedulesByDate = async (
  year: number,
  month: number,
  day?: number
) => {
  try {
    let url = `/api/schedules/date?year=${year}&month=${month}`;
    if (day) {
      url += `&day=${day}`;
    }

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("날짜별 일정을 불러오는데 실패했습니다.");
    }

    return await response.json();
  } catch (error) {
    console.error("날짜별 일정 조회 오류:", error);
    throw error;
  }
};

// ========== 계약 관련 API 함수들 ==========

// 모든 계약 조회
export const getAllContracts = async () => {
  try {
    const response = await fetch("/api/contracts");
    if (!response.ok) {
      throw new Error("계약 목록을 불러오는데 실패했습니다.");
    }
    return await response.json();
  } catch (error) {
    console.error("계약 목록 조회 오류:", error);
    throw error;
  }
};

// 상태별 계약 조회
export const getContractsByStatus = async (status: string) => {
  try {
    const response = await fetch(`/api/contracts?status=${status}`);
    if (!response.ok) {
      throw new Error(`${status} 상태의 계약을 불러오는데 실패했습니다.`);
    }
    return await response.json();
  } catch (error) {
    console.error("상태별 계약 조회 오류:", error);
    throw error;
  }
};

// 계약 상세 조회
export const getContractById = async (id: string) => {
  try {
    const response = await fetch(`/api/contracts/${id}`);
    if (!response.ok) {
      throw new Error("계약 상세 정보를 불러오는데 실패했습니다.");
    }
    return await response.json();
  } catch (error) {
    console.error("계약 상세 조회 오류:", error);
    throw error;
  }
};

// 계약 생성
export const createContract = async (contractData: Partial<Contract>) => {
  try {
    const response = await fetch("/api/contracts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(contractData),
    });

    if (!response.ok) {
      throw new Error("계약 생성에 실패했습니다.");
    }

    return await response.json();
  } catch (error) {
    console.error("계약 생성 오류:", error);
    throw error;
  }
};

// 계약 수정
export const updateContract = async (
  id: string,
  contractData: Partial<Contract>
) => {
  try {
    const response = await fetch(`/api/contracts/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(contractData),
    });

    if (!response.ok) {
      throw new Error("계약 수정에 실패했습니다.");
    }

    return await response.json();
  } catch (error) {
    console.error("계약 수정 오류:", error);
    throw error;
  }
};

// 계약 삭제
export const deleteContract = async (id: string) => {
  try {
    const response = await fetch(`/api/contracts/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("계약 삭제에 실패했습니다.");
    }

    return await response.json();
  } catch (error) {
    console.error("계약 삭제 오류:", error);
    throw error;
  }
};

// 계약서 서명
export const signContract = async (id: string, signatureData: any) => {
  try {
    const response = await fetch(`/api/contracts/${id}/sign`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(signatureData),
    });

    if (!response.ok) {
      throw new Error("계약서 서명에 실패했습니다.");
    }

    return await response.json();
  } catch (error) {
    console.error("계약서 서명 오류:", error);
    throw error;
  }
};

// 일정 목록을 위한 임시 데이터
// 실제 백엔드 연동 시 이 부분은 제거하고 서버에서 데이터를 가져옵니다.
import {
  schedules as dummySchedules,
  contracts as dummyContracts,
} from "@/utils/dummyData";

// 백엔드 연동 전 임시로 사용할 함수들
export const getAllSchedulesTemp = async () => {
  return dummySchedules;
};

export const getScheduleByIdTemp = async (id: string) => {
  return dummySchedules.find((schedule) => schedule.id === id) || null;
};

export const getAllContractsTemp = async () => {
  return dummyContracts;
};

export const getContractByIdTemp = async (id: string) => {
  return dummyContracts.find((contract) => contract.id === id) || null;
};

// 계약 목록을 위한 임시 데이터 함수들
export const getAllContractsTemp = async () => {
  return dummyContracts;
};

export const getContractsByStatusTemp = async (status: string) => {
  return dummyContracts.filter((contract) =>
    status === "all" ? true : contract.contractStatus === status
  );
};

export const getContractByIdTemp = async (id: string) => {
  const contract = dummyContracts.find((contract) => contract.id === id);
  if (!contract) {
    throw new Error("계약을 찾을 수 없습니다.");
  }
  return contract;
};
