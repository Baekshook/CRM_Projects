"use client";
import { useState } from "react";
import Link from "next/link";

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
  // 필터 상태
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [dateFilter, setDateFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [viewMode, setViewMode] = useState<"list" | "calendar">("list");

  // 샘플 스케줄 데이터
  const schedules: Schedule[] = [
    {
      id: "SCH-001",
      title: "2023 연말 기업 행사",
      customer: "(주)이벤트 플래닝",
      singer: "가수 A",
      date: "2023-12-20",
      time: "18:00 - 20:00",
      location: "서울 강남구 삼성동 OO호텔",
      status: "확정",
      contractStatus: "계약 완료",
      paymentStatus: "선금 완료",
    },
    {
      id: "SCH-002",
      title: "12월 결혼식 축가",
      customer: "웨딩 홀 A",
      singer: "가수 B",
      date: "2023-12-10",
      time: "13:00 - 13:30",
      location: "서울 서초구 반포동 OO웨딩홀",
      status: "확정",
      contractStatus: "계약 완료",
      paymentStatus: "미납",
    },
    {
      id: "SCH-003",
      title: "대학 축제 공연",
      customer: "대학 축제 위원회",
      singer: "가수 C",
      date: "2023-11-25",
      time: "19:00 - 20:30",
      location: "서울 관악구 OO대학교 운동장",
      status: "확정",
      contractStatus: "계약서 검토중",
      paymentStatus: "미납",
    },
    {
      id: "SCH-004",
      title: "기업 송년회",
      customer: "(주)테크놀로지",
      singer: "가수 D",
      date: "2023-12-15",
      time: "19:00 - 21:00",
      location: "서울 영등포구 OO컨벤션",
      status: "확정",
      contractStatus: "계약 완료",
      paymentStatus: "완납",
    },
    {
      id: "SCH-005",
      title: "지역 축제 공연",
      customer: "OO시 문화재단",
      singer: "가수 E",
      date: "2023-12-05",
      time: "17:00 - 18:30",
      location: "경기도 고양시 OO공원",
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

  return (
    <div>
      {/* 페이지 헤더 */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">스케줄/계약 관리</h1>
        <p className="text-gray-600 mt-1">
          확정된 공연 스케줄과 계약 상태를 관리합니다.
        </p>
      </div>

      {/* 필터 및 검색 */}
      <div className="bg-white rounded-lg shadow p-5 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* 상태 필터 */}
          <div>
            <label
              htmlFor="status-filter"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              상태
            </label>
            <select
              id="status-filter"
              className="w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">전체</option>
              <option value="확정">확정</option>
              <option value="조정 필요">조정 필요</option>
              <option value="취소">취소</option>
            </select>
          </div>

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
                placeholder="제목, 고객명, 가수명 검색"
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

          {/* 뷰 모드 전환 */}
          <div>
            <label
              htmlFor="view-mode"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              보기 모드
            </label>
            <div className="flex rounded-md shadow-sm">
              <button
                type="button"
                className={`flex-1 py-2 px-4 text-sm font-medium rounded-l-md border ${
                  viewMode === "list"
                    ? "bg-orange-500 text-white border-orange-500"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                }`}
                onClick={() => setViewMode("list")}
              >
                목록
              </button>
              <button
                type="button"
                className={`flex-1 py-2 px-4 text-sm font-medium rounded-r-md border ${
                  viewMode === "calendar"
                    ? "bg-orange-500 text-white border-orange-500"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                }`}
                onClick={() => setViewMode("calendar")}
              >
                캘린더
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 목록 뷰 */}
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
                        <Link
                          href={`/admin/schedules/${schedule.id}`}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          상세
                        </Link>
                        <button className="text-green-600 hover:text-green-800">
                          계약서
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

      {/* 캘린더 뷰 */}
      {viewMode === "calendar" && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold text-gray-800">2023년 11월</h2>
              <div className="flex space-x-2">
                <button className="bg-white border border-gray-300 rounded-md p-2">
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
                <button className="bg-white border border-gray-300 rounded-md p-2">
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
              {[29, 30, 31].map((date) => (
                <div
                  key={`prev-${date}`}
                  className="h-32 border border-gray-200 p-2 bg-gray-50"
                >
                  <div className="text-gray-400 text-sm">{date}</div>
                </div>
              ))}

              {/* 날짜 셀 - 현재 달 */}
              {Array.from({ length: 25 }, (_, i) => i + 1).map((date) => (
                <div
                  key={`current-${date}`}
                  className={`h-32 border border-gray-200 p-2 ${
                    date === 15 ? "bg-yellow-50" : ""
                  }`}
                >
                  <div
                    className={`text-sm ${
                      (date + 3) % 7 === 0
                        ? "text-red-500"
                        : (date + 3) % 7 === 6
                        ? "text-blue-500"
                        : "text-gray-700"
                    }`}
                  >
                    {date}
                  </div>

                  {/* 스케줄 이벤트 */}
                  {date === 5 && (
                    <div className="mt-1">
                      <div className="bg-green-100 text-green-800 text-xs p-1 rounded mb-1 truncate">
                        지역 축제 공연
                      </div>
                    </div>
                  )}
                  {date === 10 && (
                    <div className="mt-1">
                      <div className="bg-blue-100 text-blue-800 text-xs p-1 rounded mb-1 truncate">
                        결혼식 축가
                      </div>
                    </div>
                  )}
                  {date === 15 && (
                    <div className="mt-1">
                      <div className="bg-purple-100 text-purple-800 text-xs p-1 rounded mb-1 truncate">
                        기업 송년회
                      </div>
                    </div>
                  )}
                  {date === 20 && (
                    <div className="mt-1">
                      <div className="bg-orange-100 text-orange-800 text-xs p-1 rounded mb-1 truncate">
                        연말 기업 행사
                      </div>
                    </div>
                  )}
                  {date === 25 && (
                    <div className="mt-1">
                      <div className="bg-yellow-100 text-yellow-800 text-xs p-1 rounded mb-1 truncate">
                        대학 축제 공연
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {/* 날짜 셀 - 다음 달 */}
              {[1, 2].map((date) => (
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
    </div>
  );
}
