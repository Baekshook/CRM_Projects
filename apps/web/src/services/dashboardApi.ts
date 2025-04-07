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

// 대시보드 통계 조회
export const getDashboardStats = async (
  dateFilter?: string,
  startDate?: string,
  endDate?: string
) => {
  try {
    let url = `${API_URL}/dashboard/stats`;

    if (dateFilter) {
      url += `?dateFilter=${dateFilter}`;
      if (dateFilter === "custom" && startDate && endDate) {
        url += `&startDate=${startDate}&endDate=${endDate}`;
      }
    }

    const response = await fetch(url);
    if (!response.ok) {
      // 백엔드 API가 아직 없는 경우를 위한 폴백
      console.warn("백엔드 API 연결 실패, 임시 데이터를 사용합니다.");
      return getDashboardStatsTemp(dateFilter, startDate, endDate);
    }
    return await response.json();
  } catch (error) {
    console.error("대시보드 통계 조회 오류:", error);
    console.warn("오류 발생, 임시 데이터를 사용합니다.");
    return getDashboardStatsTemp(dateFilter, startDate, endDate);
  }
};

// 최근 요청서 조회
export const getRecentRequests = async (limit = 5) => {
  try {
    const response = await fetch(
      `${API_URL}/dashboard/recent-requests?limit=${limit}`
    );
    if (!response.ok) {
      // 백엔드 API가 아직 없는 경우를 위한 폴백
      console.warn("백엔드 API 연결 실패, 임시 데이터를 사용합니다.");
      return getRecentRequestsTemp(limit);
    }
    return await response.json();
  } catch (error) {
    console.error("최근 요청서 조회 오류:", error);
    console.warn("오류 발생, 임시 데이터를 사용합니다.");
    return getRecentRequestsTemp(limit);
  }
};

// 오늘의 일정 조회
export const getTodaySchedules = async () => {
  try {
    const response = await fetch(`${API_URL}/dashboard/today-schedules`);
    if (!response.ok) {
      // 백엔드 API가 아직 없는 경우를 위한 폴백
      console.warn("백엔드 API 연결 실패, 임시 데이터를 사용합니다.");
      return getTodaySchedulesTemp();
    }
    return await response.json();
  } catch (error) {
    console.error("오늘의 일정 조회 오류:", error);
    console.warn("오류 발생, 임시 데이터를 사용합니다.");
    return getTodaySchedulesTemp();
  }
};

// 최근 알림 조회
export const getRecentNotifications = async (limit = 5) => {
  try {
    const response = await fetch(
      `${API_URL}/dashboard/notifications?limit=${limit}`
    );
    if (!response.ok) {
      // 백엔드 API가 아직 없는 경우를 위한 폴백
      console.warn("백엔드 API 연결 실패, 임시 데이터를 사용합니다.");
      return getRecentNotificationsTemp(limit);
    }
    return await response.json();
  } catch (error) {
    console.error("최근 알림 조회 오류:", error);
    console.warn("오류 발생, 임시 데이터를 사용합니다.");
    return getRecentNotificationsTemp(limit);
  }
};

// 전체 대시보드 데이터 조회
export const getDashboardData = async (
  dateFilter?: string,
  startDate?: string,
  endDate?: string
) => {
  try {
    let url = `${API_URL}/dashboard`;

    if (dateFilter) {
      url += `?dateFilter=${dateFilter}`;
      if (dateFilter === "custom" && startDate && endDate) {
        url += `&startDate=${startDate}&endDate=${endDate}`;
      }
    }

    const response = await fetch(url);
    if (!response.ok) {
      // 백엔드 API가 아직 없는 경우를 위한 폴백
      console.warn("백엔드 API 연결 실패, 임시 데이터를 사용합니다.");
      return getDashboardDataTemp(dateFilter, startDate, endDate);
    }
    return await response.json();
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
