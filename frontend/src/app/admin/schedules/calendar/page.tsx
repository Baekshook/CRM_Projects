"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { schedules as dummySchedules, Schedule } from "@/utils/dummyData";

export default function CalendarPage() {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    // 실제로는 API 호출로 처리
    setSchedules(dummySchedules);
  }, []);

  const getMonthDays = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };

  const getMonthName = (month: number) => {
    return new Date(0, month).toLocaleString("ko-KR", { month: "long" });
  };

  const goToPreviousMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1)
    );
  };

  const goToNextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1)
    );
  };

  const getSchedulesForDate = (date: number) => {
    const dateStr = `${currentDate.getFullYear()}-${String(
      currentDate.getMonth() + 1
    ).padStart(2, "0")}-${String(date).padStart(2, "0")}`;
    return schedules.filter((schedule) => {
      const scheduleDate = schedule.eventDate.includes("T")
        ? schedule.eventDate.split("T")[0]
        : schedule.eventDate;
      return scheduleDate === dateStr;
    });
  };

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

  const isToday = (date: number) => {
    const today = new Date();
    return (
      today.getDate() === date &&
      today.getMonth() === currentDate.getMonth() &&
      today.getFullYear() === currentDate.getFullYear()
    );
  };

  const renderCalendar = () => {
    const daysInMonth = getMonthDays(
      currentDate.getFullYear(),
      currentDate.getMonth()
    );
    const firstDayOfMonth = getFirstDayOfMonth(
      currentDate.getFullYear(),
      currentDate.getMonth()
    );
    const days = [];

    // 이전 달의 날짜들
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(
        <div
          key={`empty-${i}`}
          className="h-32 border border-gray-200 p-2 bg-gray-50"
        ></div>
      );
    }

    // 현재 달의 날짜들
    for (let day = 1; day <= daysInMonth; day++) {
      const daySchedules = getSchedulesForDate(day);
      days.push(
        <div
          key={day}
          className={`h-32 border border-gray-200 p-2 ${
            isToday(day) ? "bg-orange-50" : ""
          }`}
        >
          <div className="flex justify-between items-center mb-2">
            <span
              className={`text-sm font-medium ${
                (firstDayOfMonth + day - 1) % 7 === 0
                  ? "text-red-500"
                  : (firstDayOfMonth + day - 1) % 7 === 6
                  ? "text-blue-500"
                  : ""
              }`}
            >
              {day}
            </span>
            {daySchedules.length > 0 && (
              <span className="text-xs bg-gray-700 text-white w-5 h-5 rounded-full flex items-center justify-center">
                {daySchedules.length}
              </span>
            )}
          </div>
          <div className="space-y-1">
            {daySchedules.slice(0, 2).map((schedule) => (
              <Link
                key={schedule.id}
                href={`/admin/schedules/${schedule.id}`}
                className={`block text-xs p-1 rounded truncate ${getStatusBadgeClass(
                  schedule.status
                )}`}
              >
                {schedule.eventTitle}
              </Link>
            ))}
            {daySchedules.length > 2 && (
              <div className="text-xs text-gray-500 text-center">
                +{daySchedules.length - 2}개
              </div>
            )}
          </div>
        </div>
      );
    }

    return days;
  };

  return (
    <div className="pb-10">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">일정 캘린더</h1>
          <p className="text-gray-600 mt-1">월별 일정을 확인하세요.</p>
        </div>
        <Link
          href="/admin/schedules"
          className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
        >
          목록 보기
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-6">
          {/* 달력 헤더 */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-gray-800">
              {currentDate.getFullYear()}년{" "}
              {getMonthName(currentDate.getMonth())}
            </h2>
            <div className="flex space-x-2">
              <button
                onClick={goToPreviousMonth}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
              <button
                onClick={goToNextMonth}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* 요일 헤더 */}
          <div className="grid grid-cols-7 gap-2 mb-2">
            {["일", "월", "화", "수", "목", "금", "토"].map((day, index) => (
              <div
                key={day}
                className={`text-center text-sm font-medium py-2 ${
                  index === 0
                    ? "text-red-500"
                    : index === 6
                    ? "text-blue-500"
                    : ""
                }`}
              >
                {day}
              </div>
            ))}
          </div>

          {/* 달력 그리드 */}
          <div className="grid grid-cols-7 gap-2">{renderCalendar()}</div>
        </div>
      </div>
    </div>
  );
}
