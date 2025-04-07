"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Schedule } from "@/types/scheduleTypes";
import { getAllSchedules, deleteSchedule } from "@/services/schedulesApi";

// 상태에 따른 배지 클래스 반환 함수
const getStatusBadgeClass = (status: string) => {
  switch (status) {
    case "scheduled":
      return "bg-blue-100 text-blue-800";
    case "in_progress":
      return "bg-yellow-100 text-yellow-800";
    case "completed":
      return "bg-green-100 text-green-800";
    case "cancelled":
      return "bg-red-100 text-red-800";
    case "changed":
      return "bg-purple-100 text-purple-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

// 상태에 따른 텍스트 반환 함수
const getStatusText = (status: string) => {
  switch (status) {
    case "scheduled":
      return "예정됨";
    case "in_progress":
      return "진행중";
    case "completed":
      return "완료";
    case "cancelled":
      return "취소";
    case "changed":
      return "변경됨";
    default:
      return "알 수 없음";
  }
};

export default function SchedulesPage() {
  const router = useRouter();
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [filteredSchedules, setFilteredSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [currentMonth, setCurrentMonth] = useState<number>(
    new Date().getMonth() + 1
  );
  const [currentYear, setCurrentYear] = useState<number>(
    new Date().getFullYear()
  );
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [viewMode, setViewMode] = useState<"list" | "calendar">("list");

  // 상태 필터 옵션
  const statusOptions = [
    { value: "all", label: "전체" },
    { value: "scheduled", label: "예정됨" },
    { value: "in_progress", label: "진행중" },
    { value: "completed", label: "완료" },
    { value: "cancelled", label: "취소" },
    { value: "changed", label: "변경됨" },
  ];

  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getAllSchedules();
        setSchedules(data);
        setFilteredSchedules(data);
      } catch (err) {
        console.error("일정 목록 조회 오류:", err);
        setError("일정 정보를 불러오는데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchSchedules();
  }, []);

  useEffect(() => {
    // 필터링 로직
    let result = [...schedules];

    // 상태 필터
    if (statusFilter !== "all") {
      result = result.filter((schedule) => schedule.status === statusFilter);
    }

    // 월 필터
    result = result.filter((schedule) => {
      const eventDate = new Date(schedule.eventDate);
      return (
        eventDate.getMonth() + 1 === currentMonth &&
        eventDate.getFullYear() === currentYear
      );
    });

    // 검색어 필터
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (schedule) =>
          schedule.eventTitle.toLowerCase().includes(query) ||
          schedule.customerName.toLowerCase().includes(query) ||
          schedule.singerName.toLowerCase().includes(query) ||
          schedule.venue.toLowerCase().includes(query)
      );
    }

    setFilteredSchedules(result);
  }, [schedules, statusFilter, currentMonth, currentYear, searchQuery]);

  // 필터 상태
  const [dateFilter, setDateFilter] = useState<string>("all");

  // 날짜가 오늘 이전인지 확인
  const isPastDate = (dateStr: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const date = new Date(dateStr);
    return date < today;
  };

  // 날짜가 오늘인지 확인
  const isToday = (dateStr: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const date = new Date(dateStr);
    date.setHours(0, 0, 0, 0);
    return date.getTime() === today.getTime();
  };

  // 이벤트 수 계산 함수
  const getEventCount = (date: number): number => {
    // 날짜 형식 변환
    const dateStr = `${currentYear}-${currentMonth
      .toString()
      .padStart(2, "0")}-${date.toString().padStart(2, "0")}`;

    // 해당 날짜의 스케줄 필터링
    const eventsOnDate = schedules.filter((schedule) => {
      // 날짜만 비교 (YYYY-MM-DD)
      const scheduleDate = schedule.eventDate.includes("T")
        ? schedule.eventDate.split("T")[0]
        : schedule.eventDate;
      return scheduleDate === dateStr;
    });

    return eventsOnDate.length;
  };

  // 특정 날짜의 이벤트 목록 가져오기
  const getEventsForDate = (date: number): Schedule[] => {
    const dateStr = `${currentYear}-${currentMonth
      .toString()
      .padStart(2, "0")}-${date.toString().padStart(2, "0")}`;

    return schedules.filter((schedule) => {
      const scheduleDate = schedule.eventDate.includes("T")
        ? schedule.eventDate.split("T")[0]
        : schedule.eventDate;
      return scheduleDate === dateStr;
    });
  };

  // 이벤트 배경색 랜덤 할당
  const getEventColor = (index: number): string => {
    const colors = [
      "bg-blue-100 text-blue-800",
      "bg-green-100 text-green-800",
      "bg-purple-100 text-purple-800",
      "bg-yellow-100 text-yellow-800",
      "bg-orange-100 text-orange-800",
      "bg-pink-100 text-pink-800",
    ];

    return colors[index % colors.length];
  };

  // 스케줄 상세 페이지로 이동
  const handleViewDetail = (id: string) => {
    router.push(`/admin/schedules/${id}`);
  };

  // 계약서 보기/수정
  const handleContract = (id: string) => {
    router.push(`/admin/schedules/${id}/contract`);
  };

  // 스케줄 취소/변경
  const handleModify = (id: string) => {
    router.push(`/admin/schedules/${id}/edit`);
  };

  // 스케줄 삭제 처리
  const handleDeleteSchedule = async (id: string) => {
    if (
      window.confirm(
        "정말로 이 일정을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다."
      )
    ) {
      try {
        await deleteSchedule(id);
        alert("일정이 삭제되었습니다.");
        // 삭제 후 목록 새로고침
        setSchedules(schedules.filter((schedule) => schedule.id !== id));
      } catch (err) {
        console.error("일정 삭제 오류:", err);
        alert("일정 삭제 중 오류가 발생했습니다.");
      }
    }
  };

  // 이전 달로 이동
  const goToPreviousMonth = () => {
    if (currentMonth === 1) {
      // 1월에서 이전으로 가면 전년도 12월로
      if (currentYear > 2020) {
        setCurrentYear(currentYear - 1);
        setCurrentMonth(12);
      }
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  // 다음 달로 이동
  const goToNextMonth = () => {
    if (currentMonth === 12) {
      // 12월에서 다음으로 가면 다음년도 1월로
      if (currentYear < 2100) {
        setCurrentYear(currentYear + 1);
        setCurrentMonth(1);
      }
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  // 해당 월의 마지막 날짜 구하기
  const getLastDayOfMonth = (year: number, month: number): number => {
    return new Date(year, month, 0).getDate();
  };

  // 해당 월의 첫 날짜의 요일 구하기 (0: 일요일, 1: 월요일, ...)
  const getFirstDayOfMonth = (year: number, month: number): number => {
    return new Date(year, month - 1, 1).getDay();
  };

  // 캘린더에 표시할 이전 달의 날짜들 계산
  const getPreviousMonthDays = (): number[] => {
    const firstDay = getFirstDayOfMonth(currentYear, currentMonth);
    if (firstDay === 0) return []; // 첫째 날이 일요일이면 이전 달 날짜 필요 없음

    const prevMonth = currentMonth === 1 ? 12 : currentMonth - 1;
    const prevYear = currentMonth === 1 ? currentYear - 1 : currentYear;
    const lastDayOfPrevMonth = getLastDayOfMonth(prevYear, prevMonth);

    const days: number[] = [];
    for (let i = firstDay - 1; i >= 0; i--) {
      days.push(lastDayOfPrevMonth - i);
    }
    return days;
  };

  // 캘린더에 표시할 다음 달의 날짜들 계산
  const getNextMonthDays = (): number[] => {
    const firstDay = getFirstDayOfMonth(currentYear, currentMonth);
    const lastDay = getLastDayOfMonth(currentYear, currentMonth);

    // 총 필요한 칸 수에서 이미 사용한 칸 수를 뺌 (한 행은 7칸)
    const totalCells = 42; // 6주 * 7일 = 42칸
    const usedCells = firstDay + lastDay;
    const remainingCells = totalCells - usedCells;

    const days: number[] = [];
    for (let i = 1; i <= remainingCells; i++) {
      days.push(i);
    }
    return days.slice(0, 14); // 최대 2주(14일)까지만 표시
  };

  // 월 이름 가져오기
  const getMonthName = (): string => {
    const monthNames = [
      "1",
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9",
      "10",
      "11",
      "12",
    ];
    return monthNames[currentMonth - 1];
  };

  // 날짜 포맷팅 함수
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ko-KR");
  };

  // 새 일정 등록 페이지로 이동
  const handleAddSchedule = () => {
    router.push("/admin/schedules/new");
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div
            className="spinner-border inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent"
            role="status"
          >
            <span className="sr-only">로딩중...</span>
          </div>
          <p className="mt-2 text-gray-600">일정 목록을 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-2">⚠️ 오류</div>
          <p className="text-gray-700">{error}</p>
          <button
            className="mt-4 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
            onClick={() => window.location.reload()}
          >
            새로고침
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-10">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">일정 관리</h1>
          <p className="text-gray-600 mt-1">
            모든 일정을 한눈에 확인하고 관리하세요.
          </p>
        </div>
        <div className="flex gap-2">
          <Link
            href="/admin/schedules/contracts"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            계약 관리
          </Link>
          <Link
            href="/admin/schedules/new"
            className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
          >
            새 일정 등록
          </Link>
        </div>
      </div>

      {/* 필터 섹션 */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              검색
            </label>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="일정명, 고객명, 가수명 검색..."
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              상태 필터
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
            >
              <option value="all">모든 상태</option>
              <option value="scheduled">예정됨</option>
              <option value="in_progress">진행중</option>
              <option value="completed">완료</option>
              <option value="cancelled">취소</option>
              <option value="changed">변경됨</option>
            </select>
          </div>

          <div className="flex items-end space-x-2">
            <button
              onClick={() => {
                setStatusFilter("all");
                setSearchQuery("");
              }}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
            >
              필터 초기화
            </button>

            {/* 목록/달력 전환 버튼 */}
            <div className="flex border border-gray-300 rounded-md overflow-hidden">
              <button
                onClick={() => setViewMode("list")}
                className={`px-4 py-2 ${
                  viewMode === "list"
                    ? "bg-orange-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                목록
              </button>
              <button
                onClick={() => setViewMode("calendar")}
                className={`px-4 py-2 ${
                  viewMode === "calendar"
                    ? "bg-orange-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                달력
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 월간 달력 - 달력 뷰일 때만 표시 */}
      {viewMode === "calendar" && (
        <div className="bg-white rounded-lg shadow overflow-hidden mb-6">
          <div className="flex justify-between items-center p-4 border-b">
            <button
              onClick={goToPreviousMonth}
              className="p-2 rounded-full hover:bg-gray-100"
            >
              &lt;
            </button>
            <h2 className="text-xl font-semibold">
              {currentYear}년 {getMonthName()}월
            </h2>
            <button
              onClick={goToNextMonth}
              className="p-2 rounded-full hover:bg-gray-100"
            >
              &gt;
            </button>
          </div>

          <div className="grid grid-cols-7 gap-px bg-gray-200">
            {/* 요일 헤더 */}
            {["일", "월", "화", "수", "목", "금", "토"].map((day) => (
              <div key={day} className="p-2 text-center font-medium bg-gray-50">
                {day}
              </div>
            ))}

            {/* 이전 달 날짜 */}
            {getPreviousMonthDays().map((day) => (
              <div
                key={`prev-${day}`}
                className="min-h-[100px] p-2 bg-white text-gray-400"
              >
                {day}
              </div>
            ))}

            {/* 현재 달 날짜 */}
            {Array.from(
              { length: getLastDayOfMonth(currentYear, currentMonth) },
              (_, i) => i + 1
            ).map((day) => {
              const dateStr = `${currentYear}-${currentMonth
                .toString()
                .padStart(2, "0")}-${day.toString().padStart(2, "0")}`;
              const events = schedules.filter((schedule) => {
                const scheduleDate = schedule.eventDate.includes("T")
                  ? schedule.eventDate.split("T")[0]
                  : schedule.eventDate;
                return scheduleDate === dateStr;
              });

              return (
                <div
                  key={`current-${day}`}
                  className={`min-h-[100px] p-2 bg-white ${
                    isToday(dateStr) ? "bg-orange-50" : ""
                  }`}
                >
                  <div className="font-medium">{day}</div>
                  <div className="mt-1 space-y-1 max-h-[80px] overflow-y-auto">
                    {events.map((event, idx) => (
                      <div
                        key={event.id}
                        className={`text-xs p-1 rounded ${getEventColor(idx)}`}
                      >
                        <div className="font-medium truncate">
                          {event.eventTitle}
                        </div>
                        <div className="flex justify-between mt-1">
                          <span className="truncate">{event.singerName}</span>
                          <span>{event.startTime.substring(0, 5)}</span>
                        </div>
                        <div className="flex space-x-1 mt-1">
                          <button
                            onClick={() => handleViewDetail(event.id)}
                            className="text-xs bg-blue-500 text-white px-1 py-0.5 rounded"
                          >
                            상세
                          </button>
                          <button
                            onClick={() => handleModify(event.id)}
                            className="text-xs bg-green-500 text-white px-1 py-0.5 rounded"
                          >
                            수정
                          </button>
                          <button
                            onClick={() => handleDeleteSchedule(event.id)}
                            className="text-xs bg-red-500 text-white px-1 py-0.5 rounded"
                          >
                            삭제
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}

            {/* 다음 달 날짜 */}
            {getNextMonthDays().map((day) => (
              <div
                key={`next-${day}`}
                className="min-h-[100px] p-2 bg-white text-gray-400"
              >
                {day}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 목록 뷰 - 목록 뷰일 때만 표시 */}
      {viewMode === "list" && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  일정 번호
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  이벤트 정보
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  고객 정보
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  가수 정보
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  일시
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  장소
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  상태
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  등록일
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  관리
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredSchedules.length === 0 ? (
                <tr>
                  <td
                    colSpan={9}
                    className="px-6 py-4 text-center text-gray-500"
                  >
                    등록된 일정이 없습니다.
                  </td>
                </tr>
              ) : (
                filteredSchedules.map((schedule) => (
                  <tr key={schedule.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {schedule.id.substring(0, 8)}...
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {schedule.eventTitle}
                      </div>
                      <div className="text-sm text-gray-500">
                        매칭:{" "}
                        {schedule.matchId
                          ? schedule.matchId.substring(0, 8) + "..."
                          : "없음"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {schedule.customerName}
                      </div>
                      <div className="text-sm text-gray-500">
                        {schedule.customerCompany || "없음"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {schedule.singerName}
                      </div>
                      <div className="text-sm text-gray-500">
                        {schedule.singerAgency || "없음"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {formatDate(schedule.eventDate)}
                      </div>
                      <div className="text-sm text-gray-500">
                        {schedule.startTime} - {schedule.endTime}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {schedule.venue}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(
                          schedule.status
                        )}`}
                      >
                        {getStatusText(schedule.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(schedule.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => handleViewDetail(schedule.id)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          상세
                        </button>
                        <button
                          onClick={() => handleModify(schedule.id)}
                          className="text-green-600 hover:text-green-900"
                        >
                          수정
                        </button>
                        <button
                          onClick={() => handleDeleteSchedule(schedule.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          삭제
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
