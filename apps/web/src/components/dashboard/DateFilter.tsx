"use client";
import React, { useState } from "react";

interface DateFilterProps {
  currentFilter: string;
  dateRange: {
    startDate: Date | null;
    endDate: Date | null;
  };
  onFilterChange: (
    filter: string,
    dateRange?: { startDate: Date | null; endDate: Date | null }
  ) => void;
}

const DateFilter = ({
  currentFilter,
  dateRange,
  onFilterChange,
}: DateFilterProps) => {
  const [showCustomDates, setShowCustomDates] = useState(
    currentFilter === "custom"
  );

  // 날짜를 입력 형식으로 변환
  const formatDateForInput = (date: Date | null) => {
    if (!date) return "";
    return date.toISOString().split("T")[0];
  };

  // 필터 버튼 클릭 처리
  const handleFilterClick = (filter: string) => {
    if (filter === "custom") {
      setShowCustomDates(true);
    } else {
      setShowCustomDates(false);
      onFilterChange(filter);
    }
  };

  // 사용자 지정 날짜 변경 처리
  const handleCustomDateChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "start" | "end"
  ) => {
    const newDate = e.target.value ? new Date(e.target.value) : null;

    const newDateRange = {
      ...dateRange,
      [type === "start" ? "startDate" : "endDate"]: newDate,
    };

    onFilterChange("custom", newDateRange);
  };

  // 필터 버튼 스타일
  const getButtonStyle = (filter: string) => {
    return filter === currentFilter
      ? "bg-orange-600 text-white"
      : "bg-gray-100 text-gray-700 hover:bg-gray-200";
  };

  return (
    <div className="mb-6">
      <h3 className="text-sm font-medium text-gray-700 mb-2">기간 필터</h3>
      <div className="flex flex-wrap gap-2">
        <button
          className={`px-3 py-1.5 rounded-md text-sm ${getButtonStyle(
            "today"
          )}`}
          onClick={() => handleFilterClick("today")}
        >
          오늘
        </button>
        <button
          className={`px-3 py-1.5 rounded-md text-sm ${getButtonStyle("week")}`}
          onClick={() => handleFilterClick("week")}
        >
          최근 7일
        </button>
        <button
          className={`px-3 py-1.5 rounded-md text-sm ${getButtonStyle(
            "month"
          )}`}
          onClick={() => handleFilterClick("month")}
        >
          최근 30일
        </button>
        <button
          className={`px-3 py-1.5 rounded-md text-sm ${getButtonStyle(
            "custom"
          )}`}
          onClick={() => handleFilterClick("custom")}
        >
          사용자 지정
        </button>
      </div>

      {showCustomDates && (
        <div className="flex flex-wrap gap-4 mt-3">
          <div>
            <label
              htmlFor="start-date"
              className="block text-sm text-gray-700 mb-1"
            >
              시작일
            </label>
            <input
              type="date"
              id="start-date"
              className="px-3 py-2 border border-gray-300 rounded-md text-sm"
              value={formatDateForInput(dateRange.startDate)}
              onChange={(e) => handleCustomDateChange(e, "start")}
            />
          </div>
          <div>
            <label
              htmlFor="end-date"
              className="block text-sm text-gray-700 mb-1"
            >
              종료일
            </label>
            <input
              type="date"
              id="end-date"
              className="px-3 py-2 border border-gray-300 rounded-md text-sm"
              value={formatDateForInput(dateRange.endDate)}
              onChange={(e) => handleCustomDateChange(e, "end")}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default DateFilter;
