"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { schedules as dummySchedules, Schedule } from "@/utils/dummyData";

export default function SchedulesPage() {
  const router = useRouter();
  const [schedules, setSchedules] = useState<Schedule[]>([]);

  useEffect(() => {
    // 실제로는 API 호출로 처리
    setSchedules(dummySchedules);
  }, []);

  // 필터 상태
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [dateFilter, setDateFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [viewMode, setViewMode] = useState<"list" | "calendar">("list");

  // 달력 현재 연도와 월 (기본값: 현재 날짜)
  const today = new Date();
  const [currentYear, setCurrentYear] = useState<number>(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState<number>(
    today.getMonth() + 1
  ); // JavaScript 월은 0-indexed

  // 필터링된 스케줄 목록
  const filteredSchedules = schedules.filter((schedule) => {
    // 상태 필터
    if (statusFilter !== "all" && schedule.status !== statusFilter) {
      return false;
    }

    // 검색어 필터
    if (
      searchQuery &&
      !schedule.eventTitle.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !schedule.customerName
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) &&
      !schedule.singerName.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !schedule.id.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }

    return true;
  });

  // 상태에 따른 배지 색상
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
        return status;
    }
  };

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
  const getMonthName = (month: number): string => {
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
    return monthNames[month - 1];
  };

  // 날짜 포맷팅 함수
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ko-KR");
  };

  return (
    <div className="pb-10">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">일정 관리</h1>
          <p className="text-gray-600 mt-1">
            모든 행사 일정을 확인하고 관리하세요.
          </p>
        </div>
        <Link
          href="/admin/schedules/calendar"
          className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
        >
          캘린더 보기
        </Link>
      </div>

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
            {schedules.length === 0 ? (
              <tr>
                <td colSpan={9} className="px-6 py-4 text-center text-gray-500">
                  등록된 일정이 없습니다.
                </td>
              </tr>
            ) : (
              schedules.map((schedule) => (
                <tr key={schedule.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {schedule.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {schedule.eventTitle}
                    </div>
                    <div className="text-sm text-gray-500">
                      매칭: {schedule.matchId}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {schedule.customerName}
                    </div>
                    <div className="text-sm text-gray-500">
                      {schedule.customerCompany}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {schedule.singerName}
                    </div>
                    <div className="text-sm text-gray-500">
                      {schedule.singerAgency}
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
                    <Link
                      href={`/admin/schedules/${schedule.id}`}
                      className="text-orange-600 hover:text-orange-900 mr-3"
                    >
                      상세
                    </Link>
                    <Link
                      href={`/admin/schedules/${schedule.id}/edit`}
                      className="text-orange-600 hover:text-orange-900"
                    >
                      수정
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
