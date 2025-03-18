"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

// 스케줄/계약 타입 정의
interface Schedule {
  id: string;
  title: string;
  customer: string;
  singer: string;
  date: string;
  time: string;
  location: string;
  status: string;
  contractStatus: string;
  paymentStatus: string;
}

export default function SchedulesPage() {
  const router = useRouter();
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

  // 샘플 스케줄 데이터
  const schedules: Schedule[] = [
    {
      id: "REQ-001",
      title: "연간 기업 행사",
      customer: "(주)이벤트 플래닝",
      singer: "가수 A",
      date: "2025-02-15",
      time: "18:00 - 20:00",
      location: "서울 강남구 삼성동 OO호텔",
      status: "확정",
      contractStatus: "계약 완료",
      paymentStatus: "선금 완료",
    },
    {
      id: "REQ-002",
      title: "결혼식 축가",
      customer: "웨딩 홀 A",
      singer: "가수 B",
      date: "2025-02-20",
      time: "13:00 - 13:30",
      location: "서울 서초구 반포동 OO웨딩홀",
      status: "확정",
      contractStatus: "계약 완료",
      paymentStatus: "미납",
    },
    {
      id: "REQ-003",
      title: "대학 축제 공연",
      customer: "대학 축제 위원회",
      singer: "가수 C",
      date: "2025-03-25",
      time: "19:00 - 20:30",
      location: "서울 관악구 OO대학교 운동장",
      status: "확정",
      contractStatus: "계약서 검토중",
      paymentStatus: "미납",
    },
    {
      id: "REQ-004",
      title: "기업 봄맞이 행사",
      customer: "(주)테크놀로지",
      singer: "가수 D",
      date: "2025-03-15",
      time: "19:00 - 21:00",
      location: "서울 영등포구 OO컨벤션",
      status: "확정",
      contractStatus: "계약 완료",
      paymentStatus: "완납",
    },
    {
      id: "REQ-005",
      title: "지역 축제 공연",
      customer: "OO시 문화재단",
      singer: "가수 E",
      date: "2025-03-05",
      time: "17:00 - 18:30",
      location: "경기도 고양시 OO공원",
      status: "조정 필요",
      contractStatus: "계약서 검토중",
      paymentStatus: "미납",
    },
    {
      id: "REQ-006",
      title: "신제품 론칭 행사",
      customer: "(주)코스메틱 브랜드",
      singer: "가수 F",
      date: "2025-02-15",
      time: "14:00 - 15:30",
      location: "서울 강남구 신사동 OO갤러리",
      status: "확정",
      contractStatus: "계약 완료",
      paymentStatus: "완납",
    },
    {
      id: "REQ-007",
      title: "방송 프로그램 출연",
      customer: "OO방송국",
      singer: "가수 G",
      date: "2025-02-15",
      time: "18:00 - 20:00",
      location: "서울 마포구 OO방송국",
      status: "확정",
      contractStatus: "계약 완료",
      paymentStatus: "선금 완료",
    },
    {
      id: "REQ-008",
      title: "봄맞이 특별 공연",
      customer: "OO쇼핑몰",
      singer: "가수 H",
      date: "2025-04-24",
      time: "17:00 - 18:30",
      location: "서울 중구 OO쇼핑몰 광장",
      status: "확정",
      contractStatus: "계약 완료",
      paymentStatus: "미납",
    },
    {
      id: "REQ-009",
      title: "기업 창립 기념일 행사",
      customer: "(주)테크 솔루션",
      singer: "가수 I",
      date: "2025-04-20",
      time: "15:00 - 16:00",
      location: "경기도 성남시 분당구 OO빌딩",
      status: "확정",
      contractStatus: "계약 완료",
      paymentStatus: "완납",
    },
    {
      id: "REQ-010",
      title: "라디오 공개방송",
      customer: "OO라디오",
      singer: "가수 A",
      date: "2025-04-20",
      time: "12:00 - 13:30",
      location: "서울 영등포구 OO공개홀",
      status: "확정",
      contractStatus: "계약 완료",
      paymentStatus: "선금 완료",
    },
    {
      id: "REQ-011",
      title: "사내 워크숍 축하공연",
      customer: "(주)글로벌 테크",
      singer: "가수 J",
      date: "2025-02-28",
      time: "19:00 - 20:00",
      location: "강원도 평창 OO리조트",
      status: "확정",
      contractStatus: "계약 완료",
      paymentStatus: "완납",
    },
    {
      id: "REQ-012",
      title: "벚꽃 축제 공연",
      customer: "OO구청",
      singer: "가수 K",
      date: "2025-04-05",
      time: "14:00 - 15:30",
      location: "서울 여의도 공원",
      status: "확정",
      contractStatus: "계약 완료",
      paymentStatus: "선금 완료",
    },
    {
      id: "REQ-013",
      title: "신간 북콘서트",
      customer: "OO출판사",
      singer: "가수 L",
      date: "2025-03-12",
      time: "16:00 - 17:30",
      location: "서울 종로구 OO서점",
      status: "조정 필요",
      contractStatus: "계약서 검토중",
      paymentStatus: "미납",
    },
    {
      id: "REQ-014",
      title: "브랜드 팝업스토어 이벤트",
      customer: "(주)패션 그룹",
      singer: "가수 M",
      date: "2025-05-10",
      time: "13:00 - 14:30",
      location: "서울 강남구 OO백화점",
      status: "확정",
      contractStatus: "계약 완료",
      paymentStatus: "선금 완료",
    },
    {
      id: "REQ-015",
      title: "어린이날 특별공연",
      customer: "OO테마파크",
      singer: "가수 N",
      date: "2025-05-05",
      time: "11:00 - 12:30",
      location: "경기도 용인시 OO랜드",
      status: "확정",
      contractStatus: "계약 완료",
      paymentStatus: "완납",
    },
    {
      id: "REQ-016",
      title: "대기업 채용설명회 축하공연",
      customer: "(주)대형그룹",
      singer: "가수 O",
      date: "2025-03-20",
      time: "17:30 - 18:30",
      location: "서울 송파구 OO대학교",
      status: "확정",
      contractStatus: "계약 완료",
      paymentStatus: "완납",
    },
    {
      id: "REQ-017",
      title: "스포츠 브랜드 런칭쇼",
      customer: "글로벌 스포츠",
      singer: "가수 P",
      date: "2025-04-15",
      time: "18:00 - 19:30",
      location: "서울 중구 OO스타디움",
      status: "확정",
      contractStatus: "계약 완료",
      paymentStatus: "선금 완료",
    },
    {
      id: "REQ-018",
      title: "뮤직 페스티벌 게스트",
      customer: "OO엔터테인먼트",
      singer: "가수 Q",
      date: "2025-05-18",
      time: "20:00 - 21:00",
      location: "인천 송도 OO공원",
      status: "확정",
      contractStatus: "계약서 검토중",
      paymentStatus: "미납",
    },
    {
      id: "REQ-019",
      title: "대학 입학식 축하공연",
      customer: "OO대학교",
      singer: "가수 R",
      date: "2025-03-02",
      time: "10:00 - 11:00",
      location: "서울 노원구 OO대학교 강당",
      status: "확정",
      contractStatus: "계약 완료",
      paymentStatus: "완납",
    },
    {
      id: "REQ-020",
      title: "IT 컨퍼런스 클로징 공연",
      customer: "테크 얼라이언스",
      singer: "가수 S",
      date: "2025-05-25",
      time: "17:00 - 18:00",
      location: "부산 해운대구 OO컨벤션센터",
      status: "조정 필요",
      contractStatus: "계약서 검토중",
      paymentStatus: "미납",
    },
  ];

  // 필터링된 스케줄 목록
  const filteredSchedules = schedules.filter((schedule) => {
    // 상태 필터
    if (statusFilter !== "all" && schedule.status !== statusFilter) {
      return false;
    }

    // 검색어 필터
    if (
      searchQuery &&
      !schedule.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !schedule.customer.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !schedule.singer.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !schedule.id.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }

    return true;
  });

  // 상태에 따른 배지 색상
  const getStatusColor = (status: string) => {
    switch (status) {
      case "확정":
        return "bg-green-100 text-green-800";
      case "조정 필요":
        return "bg-yellow-100 text-yellow-800";
      case "취소":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // 계약 상태에 따른 배지 색상
  const getContractStatusColor = (status: string) => {
    switch (status) {
      case "계약 완료":
        return "bg-green-100 text-green-800";
      case "계약서 검토중":
        return "bg-blue-100 text-blue-800";
      case "계약서 발송":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // 결제 상태에 따른 배지 색상
  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case "완납":
        return "bg-green-100 text-green-800";
      case "선금 완료":
        return "bg-blue-100 text-blue-800";
      case "미납":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
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
      const scheduleDate = schedule.date.split(" ")[0];
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
      const scheduleDate = schedule.date.split(" ")[0];
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

  return (
    <>
      {/* 페이지 헤더 */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">스케줄/계약 관리</h1>
        <p className="text-gray-600 mt-1">
          예약된 공연과 이벤트 일정 및 계약 상태를 관리합니다.
        </p>
      </div>

      {/* 뷰 모드 토글 */}
      <div className="flex justify-between mb-6">
        <div className="flex space-x-2">
          <button
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              viewMode === "list"
                ? "bg-orange-500 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
            onClick={() => setViewMode("list")}
          >
            목록 보기
          </button>
          <button
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              viewMode === "calendar"
                ? "bg-orange-500 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
            onClick={() => setViewMode("calendar")}
          >
            캘린더 보기
          </button>
        </div>
      </div>

      {/* 상태 필터 버튼 */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="flex flex-wrap gap-2 mb-4">
          <button
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              statusFilter === "all"
                ? "bg-orange-500 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
            onClick={() => setStatusFilter("all")}
          >
            전체
          </button>
          <button
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              statusFilter === "확정"
                ? "bg-green-500 text-white"
                : "bg-green-100 text-green-800 hover:bg-green-200"
            }`}
            onClick={() => setStatusFilter("확정")}
          >
            확정
          </button>
          <button
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              statusFilter === "조정 필요"
                ? "bg-yellow-500 text-white"
                : "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
            }`}
            onClick={() => setStatusFilter("조정 필요")}
          >
            조정 필요
          </button>
          <button
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              statusFilter === "취소"
                ? "bg-red-500 text-white"
                : "bg-red-100 text-red-800 hover:bg-red-200"
            }`}
            onClick={() => setStatusFilter("취소")}
          >
            취소
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* 날짜 필터 */}
          <div>
            <label
              htmlFor="date-filter"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              날짜
            </label>
            <select
              id="date-filter"
              className="w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
            >
              <option value="all">전체 기간</option>
              <option value="today">오늘</option>
              <option value="week">이번 주</option>
              <option value="month">이번 달</option>
              <option value="custom">직접 설정</option>
            </select>
          </div>

          {/* 검색 */}
          <div>
            <label
              htmlFor="search"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              검색
            </label>
            <div className="relative">
              <input
                type="text"
                id="search"
                placeholder="일정 ID, 제목, 고객명, 가수명 검색"
                className="w-full rounded-md border border-gray-300 py-2 pl-10 pr-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <div className="absolute left-3 top-2.5 text-gray-400">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 리스트 뷰에서 액션 부분 수정 */}
      {viewMode === "list" && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    ID
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    제목
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    고객
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    가수
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    일시
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    상태
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    계약
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    결제
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    액션
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredSchedules.map((schedule) => (
                  <tr
                    key={schedule.id}
                    className={`hover:bg-gray-50 transition-colors ${
                      isPastDate(schedule.date) ? "bg-gray-50" : ""
                    } ${isToday(schedule.date) ? "bg-yellow-50" : ""}`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {schedule.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <Link
                        href={`/admin/schedules/${schedule.id}`}
                        className="text-orange-600 hover:text-orange-800"
                      >
                        {schedule.title}
                      </Link>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {schedule.customer}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {schedule.singer}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div>
                        <div>{schedule.date}</div>
                        <div className="text-xs text-gray-400">
                          {schedule.time}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                          schedule.status
                        )}`}
                      >
                        {schedule.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getContractStatusColor(
                          schedule.contractStatus
                        )}`}
                      >
                        {schedule.contractStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getPaymentStatusColor(
                          schedule.paymentStatus
                        )}`}
                      >
                        {schedule.paymentStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleViewDetail(schedule.id)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          상세
                        </button>
                        <button
                          onClick={() => handleContract(schedule.id)}
                          className="text-green-600 hover:text-green-800"
                        >
                          계약서
                        </button>
                        <button
                          onClick={() => handleModify(schedule.id)}
                          className="text-yellow-600 hover:text-yellow-800"
                        >
                          변경
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* 페이지네이션 */}
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  전체 <span className="font-medium">{schedules.length}</span>{" "}
                  건 중{" "}
                  <span className="font-medium">
                    {filteredSchedules.length}
                  </span>{" "}
                  건 표시
                </p>
              </div>
              <div>
                <nav
                  className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                  aria-label="Pagination"
                >
                  <a
                    href="#"
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                  >
                    <span className="sr-only">이전</span>
                    <svg
                      className="h-5 w-5"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </a>
                  <a
                    href="#"
                    aria-current="page"
                    className="z-10 bg-orange-50 border-orange-500 text-orange-600 relative inline-flex items-center px-4 py-2 border text-sm font-medium"
                  >
                    1
                  </a>
                  <a
                    href="#"
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                  >
                    <span className="sr-only">다음</span>
                    <svg
                      className="h-5 w-5"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </a>
                </nav>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 캘린더 뷰 - 일별 이벤트 수 표시 */}
      {viewMode === "calendar" && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold text-gray-800">
                {currentYear}년 {getMonthName(currentMonth)}월
              </h2>
              <div className="flex space-x-2">
                <button
                  className="bg-white border border-gray-300 rounded-md p-2"
                  onClick={goToPreviousMonth}
                  disabled={currentYear === 2020 && currentMonth === 1}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-gray-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </button>
                <button
                  className="bg-white border border-gray-300 rounded-md p-2"
                  onClick={goToNextMonth}
                  disabled={currentYear === 2100 && currentMonth === 12}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-gray-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </div>
            </div>

            {/* 캘린더 그리드 */}
            <div className="grid grid-cols-7 gap-2">
              {/* 요일 헤더 */}
              {["일", "월", "화", "수", "목", "금", "토"].map((day, index) => (
                <div
                  key={day}
                  className={`text-center font-medium py-2 ${
                    index === 0
                      ? "text-red-500"
                      : index === 6
                      ? "text-blue-500"
                      : "text-gray-500"
                  }`}
                >
                  {day}
                </div>
              ))}

              {/* 날짜 셀 - 이전 달 */}
              {getPreviousMonthDays().map((date) => (
                <div
                  key={`prev-${date}`}
                  className="h-32 border border-gray-200 p-2 bg-gray-50"
                >
                  <div className="text-gray-400 text-sm">{date}</div>
                </div>
              ))}

              {/* 날짜 셀 - 현재 달 */}
              {Array.from(
                { length: getLastDayOfMonth(currentYear, currentMonth) },
                (_, i) => i + 1
              ).map((date) => {
                const eventsCount = getEventCount(date);
                const events = getEventsForDate(date);
                const currentDateStr = `${currentYear}-${currentMonth
                  .toString()
                  .padStart(2, "0")}-${date.toString().padStart(2, "0")}`;

                return (
                  <div
                    key={`current-${date}`}
                    className={`h-32 border border-gray-200 p-2 ${
                      isToday(currentDateStr) ? "bg-yellow-50" : ""
                    }`}
                  >
                    <div className="flex justify-between">
                      <div
                        className={`text-sm ${
                          (getFirstDayOfMonth(currentYear, currentMonth) +
                            date -
                            1) %
                            7 ===
                          0
                            ? "text-red-500"
                            : (getFirstDayOfMonth(currentYear, currentMonth) +
                                date -
                                1) %
                                7 ===
                              6
                            ? "text-blue-500"
                            : "text-gray-700"
                        }`}
                      >
                        {date}
                      </div>
                      {eventsCount > 0 && (
                        <div className="text-xs bg-gray-700 text-white w-5 h-5 rounded-full flex items-center justify-center">
                          {eventsCount}
                        </div>
                      )}
                    </div>

                    {/* 스케줄 이벤트 동적 표시 */}
                    {events.length > 0 && (
                      <div className="mt-1">
                        {events.slice(0, 3).map((event, idx) => (
                          <div
                            key={event.id}
                            className={`${getEventColor(
                              idx
                            )} text-xs p-1 rounded mb-1 truncate`}
                          >
                            {event.title}
                          </div>
                        ))}
                        {events.length > 3 && (
                          <div className="text-xs text-gray-500 text-center">
                            +{events.length - 3}개 더 보기
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}

              {/* 날짜 셀 - 다음 달 */}
              {getNextMonthDays().map((date) => (
                <div
                  key={`next-${date}`}
                  className="h-32 border border-gray-200 p-2 bg-gray-50"
                >
                  <div className="text-gray-400 text-sm">{date}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
