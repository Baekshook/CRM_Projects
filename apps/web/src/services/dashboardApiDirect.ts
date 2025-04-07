import {
  requests,
  schedules,
  matches,
  contracts,
  negotiationLogs,
} from "@/utils/dummyData";

// 백엔드 서버 URL
const API_URL = "http://localhost:4000/api";

// 대시보드 통계 데이터 인터페이스
export interface DashboardStats {
  requestCount: number;
  negotiationCount: number;
  contractCount: number;
  avgNegotiationDays: number;
}

// 대시보드 데이터 인터페이스
export interface DashboardData {
  stats: DashboardStats;
  recentRequests: any[];
  todaySchedules: any[];
  notifications: any[];
}

// 대시보드 통계 조회 - 직접 API 사용
export const getDashboardStats = async (
  dateFilter?: string,
  startDate?: string,
  endDate?: string
) => {
  try {
    // 개별 API에서 데이터 직접 가져오기
    const [requestsResponse, schedulesResponse, contractsResponse] =
      await Promise.all([
        fetch(`${API_URL}/requests`),
        fetch(`${API_URL}/schedules`),
        fetch(`${API_URL}/contracts`),
      ]);

    // 응답 확인
    if (
      !requestsResponse.ok ||
      !schedulesResponse.ok ||
      !contractsResponse.ok
    ) {
      console.warn("API 요청 실패, 임시 데이터를 사용합니다.");
      return getDashboardStatsTemp(dateFilter, startDate, endDate);
    }

    // 데이터 추출
    const requests = await requestsResponse.json();
    const schedules = await schedulesResponse.json();
    const contracts = await contractsResponse.json();

    // 통계 계산
    const requestCount = requests?.length || 0;
    const negotiationCount =
      requests?.filter((req) => req.status === "in_progress")?.length || 0;
    const contractCount = contracts?.length || 0;

    // 평균 협상 기간은 임시 데이터
    const avgNegotiationDays = 5;

    return {
      requestCount,
      negotiationCount,
      contractCount,
      avgNegotiationDays,
    };
  } catch (error) {
    console.error("대시보드 통계 조회 오류:", error);
    console.warn("오류 발생, 임시 데이터를 사용합니다.");
    return getDashboardStatsTemp(dateFilter, startDate, endDate);
  }
};

// 최근 요청서 조회 - 직접 API 사용
export const getRecentRequests = async (limit = 5) => {
  try {
    const response = await fetch(`${API_URL}/requests`);

    if (!response.ok) {
      console.warn("API 요청 실패, 임시 데이터를 사용합니다.");
      return getRecentRequestsTemp(limit);
    }

    const allRequests = await response.json();

    // 날짜 기준 최신순 정렬 후 제한된 개수만 반환
    return allRequests
      .sort(
        (a, b) =>
          new Date(b.createdAt || "").getTime() -
          new Date(a.createdAt || "").getTime()
      )
      .slice(0, limit)
      .map((request) => ({
        id: request.id,
        title: request.title || "무제",
        customer: request.customerName || "고객명 없음",
        date: new Date(request.createdAt || new Date()).toLocaleDateString(
          "ko-KR"
        ),
        status:
          request.status === "pending"
            ? "요청 접수"
            : request.status === "in_progress"
            ? "협상 진행"
            : request.status === "completed"
            ? "계약 완료"
            : "요청 취소",
      }));
  } catch (error) {
    console.error("최근 요청서 조회 오류:", error);
    console.warn("오류 발생, 임시 데이터를 사용합니다.");
    return getRecentRequestsTemp(limit);
  }
};

// 오늘의 일정 조회 - 직접 API 사용
export const getTodaySchedules = async () => {
  try {
    const response = await fetch(`${API_URL}/schedules`);

    if (!response.ok) {
      console.warn("API 요청 실패, 임시 데이터를 사용합니다.");
      return getTodaySchedulesTemp();
    }

    const allSchedules = await response.json();

    // 오늘 날짜 계산
    const today = new Date();
    const todayStr = `${today.getFullYear()}-${String(
      today.getMonth() + 1
    ).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

    // 오늘 일정만 필터링
    return allSchedules
      .filter((schedule) => {
        const scheduleDate = schedule.eventDate?.split("T")[0];
        return scheduleDate === todayStr;
      })
      .map((schedule) => ({
        id: schedule.id,
        title: schedule.eventTitle || "무제 일정",
        time: `${schedule.startTime || "00:00"} - ${
          schedule.endTime || "00:00"
        }`,
        customer: schedule.customerName || "고객명 없음",
        location: schedule.venue || "장소 미정",
      }));
  } catch (error) {
    console.error("오늘의 일정 조회 오류:", error);
    console.warn("오류 발생, 임시 데이터를 사용합니다.");
    return getTodaySchedulesTemp();
  }
};

// 최근 알림 조회 - 직접 API 사용
export const getRecentNotifications = async (limit = 5) => {
  // 알림 API가 없으므로 요청과 일정을 조합하여 가상 알림 생성
  try {
    const [requestsResponse, schedulesResponse, contractsResponse] =
      await Promise.all([
        fetch(`${API_URL}/requests`),
        fetch(`${API_URL}/schedules`),
        fetch(`${API_URL}/contracts`),
      ]);

    if (
      !requestsResponse.ok ||
      !schedulesResponse.ok ||
      !contractsResponse.ok
    ) {
      console.warn("API 요청 실패, 임시 데이터를 사용합니다.");
      return getRecentNotificationsTemp(limit);
    }

    const requests = await requestsResponse.json();
    const schedules = await schedulesResponse.json();
    const contracts = await contractsResponse.json();

    // 데이터를 활용해 가상 알림 생성
    const notifications = [
      // 요청 알림
      ...requests.slice(0, 3).map((req) => ({
        message: `새 요청: ${req.title || "무제 요청"}`,
        time: new Date(req.createdAt || new Date()).toLocaleDateString("ko-KR"),
        color: "orange" as const,
      })),

      // 일정 알림
      ...schedules.slice(0, 3).map((schedule) => ({
        message: `예정된 일정: ${schedule.eventTitle || "무제 일정"}`,
        time: new Date(schedule.eventDate || new Date()).toLocaleDateString(
          "ko-KR"
        ),
        color: "blue" as const,
      })),

      // 계약 알림
      ...contracts.slice(0, 3).map((contract) => ({
        message: `계약 상태: ${
          contract.status === "pending"
            ? "대기중"
            : contract.status === "signed"
            ? "서명 완료"
            : contract.status === "completed"
            ? "완료됨"
            : "진행중"
        }`,
        time: new Date(
          contract.updatedAt || contract.createdAt || new Date()
        ).toLocaleDateString("ko-KR"),
        color: "green" as const,
      })),
    ];

    // 최신순으로 정렬 후 제한된 개수만 반환
    return notifications
      .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
      .slice(0, limit);
  } catch (error) {
    console.error("최근 알림 조회 오류:", error);
    console.warn("오류 발생, 임시 데이터를 사용합니다.");
    return getRecentNotificationsTemp(limit);
  }
};

// 전체 대시보드 데이터 직접 조회
export const getDashboardData = async (
  dateFilter?: string,
  startDate?: string,
  endDate?: string
) => {
  try {
    // 각 데이터 동시에 가져오기
    const [stats, recentRequests, todaySchedules, notifications] =
      await Promise.all([
        getDashboardStats(dateFilter, startDate, endDate),
        getRecentRequests(),
        getTodaySchedules(),
        getRecentNotifications(),
      ]);

    return {
      stats,
      recentRequests,
      todaySchedules,
      notifications,
    };
  } catch (error) {
    console.error("대시보드 데이터 조회 오류:", error);
    console.warn("오류 발생, 임시 데이터를 사용합니다.");
    return getDashboardDataTemp(dateFilter, startDate, endDate);
  }
};

// 백엔드 연동 전 임시로 사용할 함수들
export const getDashboardStatsTemp = async (
  dateFilter?: string,
  startDate?: string,
  endDate?: string
) => {
  // 날짜 필터링 로직
  const filteredData = filterDataByDate(dateFilter, startDate, endDate);

  // 통계 데이터 계산
  const requestCount = filteredData.filteredRequests.length;
  const negotiationCount = filteredData.filteredMatches.filter(
    (match) => match.status === "negotiating"
  ).length;
  const contractCount = filteredData.filteredContracts.length;

  // 평균 협상 기간 계산
  const negotiationDays = filteredData.filteredMatches
    .filter((match) => match.status !== "pending")
    .map((match) => {
      const startDate = new Date(match.createdAt);
      const endDate = new Date(match.updatedAt);
      const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays;
    });

  const avgNegotiationDays =
    negotiationDays.length > 0
      ? Math.round(
          negotiationDays.reduce((sum, days) => sum + days, 0) /
            negotiationDays.length
        )
      : 0;

  return {
    requestCount,
    negotiationCount,
    contractCount,
    avgNegotiationDays,
  };
};

export const getRecentRequestsTemp = async (limit = 5) => {
  return requests
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    .slice(0, limit)
    .map((request) => ({
      id: request.id,
      title: request.title,
      customer: request.customerName,
      date: new Date(request.createdAt).toLocaleDateString("ko-KR"),
      status:
        request.status === "pending"
          ? "요청 접수"
          : request.status === "in_progress"
          ? "협상 진행"
          : request.status === "completed"
          ? "계약 완료"
          : "요청 취소",
    }));
};

export const getTodaySchedulesTemp = async () => {
  const today = new Date();
  const todayStr = `${today.getFullYear()}-${String(
    today.getMonth() + 1
  ).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

  return schedules
    .filter((schedule) => {
      const scheduleDate = schedule.eventDate.split("T")[0];
      return scheduleDate === todayStr;
    })
    .map((schedule) => ({
      id: schedule.id,
      title: schedule.eventTitle,
      time: `${schedule.startTime} - ${schedule.endTime}`,
      customer: schedule.customerName,
      location: schedule.venue,
    }));
};

export const getRecentNotificationsTemp = async (limit = 5) => {
  return negotiationLogs
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, limit)
    .map((log) => {
      let color: "orange" | "blue" | "green" | "red" | "purple" | "gray" =
        "gray";

      switch (log.type) {
        case "status_change":
          color = "blue";
          break;
        case "price_change":
          color = "green";
          break;
        case "message":
          color = "orange";
          break;
        default:
          color = "gray";
      }

      return {
        message: log.content,
        time: new Date(log.date).toLocaleDateString("ko-KR"),
        color: color,
      };
    });
};

export const getDashboardDataTemp = async (
  dateFilter?: string,
  startDate?: string,
  endDate?: string
) => {
  const stats = await getDashboardStatsTemp(dateFilter, startDate, endDate);
  const recentRequests = await getRecentRequestsTemp();
  const todaySchedules = await getTodaySchedulesTemp();
  const notifications = await getRecentNotificationsTemp();

  return {
    stats,
    recentRequests,
    todaySchedules,
    notifications,
  };
};

// 날짜 필터링 헬퍼 함수
const filterDataByDate = (
  dateFilter = "today",
  startDateStr = "",
  endDateStr = ""
) => {
  const today = new Date();
  const startOfDay = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate()
  );
  const endOfDay = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
    23,
    59,
    59
  );

  let startDate: Date;
  let endDate: Date;

  switch (dateFilter) {
    case "today":
      startDate = startOfDay;
      endDate = endOfDay;
      break;
    case "week":
      // 현재 날짜부터 7일 전까지
      startDate = new Date(today);
      startDate.setDate(today.getDate() - 7);
      endDate = endOfDay;
      break;
    case "month":
      // 현재 날짜부터 30일 전까지
      startDate = new Date(today);
      startDate.setDate(today.getDate() - 30);
      endDate = endOfDay;
      break;
    case "custom":
      // 사용자 지정 날짜
      if (startDateStr && endDateStr) {
        startDate = new Date(startDateStr);
        endDate = new Date(endDateStr);
        endDate.setHours(23, 59, 59);
      } else {
        startDate = startOfDay;
        endDate = endOfDay;
      }
      break;
    default:
      startDate = startOfDay;
      endDate = endOfDay;
  }

  const isInDateRange = (date: string) => {
    const itemDate = new Date(date);
    return itemDate >= startDate && itemDate <= endDate;
  };

  // 각 데이터 필터링
  const filteredRequests = requests.filter((req) =>
    isInDateRange(req.createdAt)
  );
  const filteredSchedules = schedules.filter((sch) =>
    isInDateRange(sch.eventDate)
  );
  const filteredMatches = matches.filter((match) =>
    isInDateRange(match.createdAt)
  );
  const filteredContracts = contracts.filter((contract) =>
    isInDateRange(contract.createdAt)
  );

  return {
    filteredRequests,
    filteredSchedules,
    filteredMatches,
    filteredContracts,
  };
};
