"use client";
import { useState } from "react";

interface DateFilterProps {
  dateFilter: string;
  setDateFilter: (filter: string) => void;
  customStartDate: string;
  customEndDate: string;
  setCustomStartDate: (date: string) => void;
  setCustomEndDate: (date: string) => void;
}

export const DateFilter: React.FC<DateFilterProps> = ({
  dateFilter,
  setDateFilter,
  customStartDate,
  customEndDate,
  setCustomStartDate,
  setCustomEndDate,
}) => {
  const [isCustomRange, setIsCustomRange] = useState(false);

  const handleApplyCustomRange = () => {
    if (customStartDate && customEndDate) {
      setDateFilter("custom");
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-4 mb-6">
      <div className="flex flex-wrap space-x-2 mb-3">
        <button
          className={`px-4 py-2 rounded-md text-sm font-medium ${
            dateFilter === "today"
              ? "bg-orange-500 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
          onClick={() => {
            setDateFilter("today");
            setIsCustomRange(false);
          }}
        >
          오늘
        </button>
        <button
          className={`px-4 py-2 rounded-md text-sm font-medium ${
            dateFilter === "week"
              ? "bg-orange-500 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
          onClick={() => {
            setDateFilter("week");
            setIsCustomRange(false);
          }}
        >
          이번 주
        </button>
        <button
          className={`px-4 py-2 rounded-md text-sm font-medium ${
            dateFilter === "month"
              ? "bg-orange-500 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
          onClick={() => {
            setDateFilter("month");
            setIsCustomRange(false);
          }}
        >
          이번 달
        </button>
        <button
          className={`px-4 py-2 rounded-md text-sm font-medium ${
            isCustomRange
              ? "bg-orange-500 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
          onClick={() => setIsCustomRange(!isCustomRange)}
        >
          직접 설정
        </button>
      </div>

      {isCustomRange && (
        <div className="flex flex-wrap items-center space-x-3 mt-3">
          <div className="flex items-center">
            <span className="text-sm text-gray-600 mr-2">시작일:</span>
            <input
              type="date"
              value={customStartDate}
              onChange={(e) => setCustomStartDate(e.target.value)}
              className="border border-gray-300 rounded-md p-2 text-sm"
            />
          </div>
          <div className="flex items-center">
            <span className="text-sm text-gray-600 mr-2">종료일:</span>
            <input
              type="date"
              value={customEndDate}
              onChange={(e) => setCustomEndDate(e.target.value)}
              className="border border-gray-300 rounded-md p-2 text-sm"
            />
          </div>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded-md text-sm font-medium"
            onClick={handleApplyCustomRange}
          >
            적용
          </button>
        </div>
      )}
    </div>
  );
};

export default DateFilter;
