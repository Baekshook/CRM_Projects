"use client";
import { useState, ChangeEvent } from "react";

interface CustomerFilterProps {
  statusFilter: string;
  setStatusFilter: (status: string) => void;
  gradeFilter: string;
  setGradeFilter: (grade: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export const CustomerFilter: React.FC<CustomerFilterProps> = ({
  statusFilter,
  setStatusFilter,
  gradeFilter,
  setGradeFilter,
  searchQuery,
  setSearchQuery,
}) => {
  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className="flex flex-col md:flex-row justify-between mb-6">
      <div className="flex flex-wrap items-center mb-4 md:mb-0">
        {/* 상태 필터 버튼 */}
        <div>
          <span className="text-sm font-medium text-gray-700 mr-2">상태:</span>
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
            className={`ml-2 px-4 py-2 rounded-md text-sm font-medium ${
              statusFilter === "active"
                ? "bg-green-500 text-white"
                : "bg-green-100 text-green-800 hover:bg-green-200"
            }`}
            onClick={() => setStatusFilter("active")}
          >
            활성
          </button>
          <button
            className={`ml-2 px-4 py-2 rounded-md text-sm font-medium ${
              statusFilter === "inactive"
                ? "bg-gray-500 text-white"
                : "bg-gray-100 text-gray-800 hover:bg-gray-200"
            }`}
            onClick={() => setStatusFilter("inactive")}
          >
            비활성
          </button>
        </div>

        {/* 등급 필터 버튼 */}
        <div className="ml-4">
          <span className="text-sm font-medium text-gray-700 mr-2">등급:</span>
          <button
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              gradeFilter === "all"
                ? "bg-orange-500 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
            onClick={() => setGradeFilter("all")}
          >
            전체
          </button>
          <button
            className={`ml-2 px-4 py-2 rounded-md text-sm font-medium ${
              gradeFilter === "일반"
                ? "bg-blue-500 text-white"
                : "bg-blue-100 text-blue-800 hover:bg-blue-200"
            }`}
            onClick={() => setGradeFilter("일반")}
          >
            일반
          </button>
          <button
            className={`ml-2 px-4 py-2 rounded-md text-sm font-medium ${
              gradeFilter === "VIP"
                ? "bg-purple-500 text-white"
                : "bg-purple-100 text-purple-800 hover:bg-purple-200"
            }`}
            onClick={() => setGradeFilter("VIP")}
          >
            VIP
          </button>
          <button
            className={`ml-2 px-4 py-2 rounded-md text-sm font-medium ${
              gradeFilter === "VVIP"
                ? "bg-red-500 text-white"
                : "bg-red-100 text-red-800 hover:bg-red-200"
            }`}
            onClick={() => setGradeFilter("VVIP")}
          >
            VVIP
          </button>
        </div>
      </div>

      {/* 검색 */}
      <div className="relative w-full md:w-96">
        <input
          type="text"
          placeholder="고객명, 이메일, 회사명 검색"
          className="w-full rounded-md border border-gray-300 py-2 pl-10 pr-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
          value={searchQuery}
          onChange={handleSearchChange}
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
  );
};

export default CustomerFilter;
