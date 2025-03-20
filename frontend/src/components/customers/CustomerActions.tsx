"use client";

import { useState } from "react";
import { EntityType, ViewMode } from "./types";

interface CustomerActionsProps {
  selectedCount: number;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  onAdd: (type: EntityType) => void;
  onBulkDelete: () => void;
  onBulkStatus: (status: "active" | "inactive") => void;
  type: EntityType;
}

export default function CustomerActions({
  selectedCount,
  viewMode,
  onViewModeChange,
  onAdd,
  onBulkDelete,
  onBulkStatus,
  type,
}: CustomerActionsProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
      <div className="flex-1 flex justify-between sm:hidden">
        <button
          onClick={() => onAdd(type)}
          className="relative inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700"
        >
          {type === "customer" ? "신규 고객 등록" : "신규 가수 등록"}
        </button>
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
        >
          더보기
        </button>
      </div>
      <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-gray-700">
            <span className="font-medium">{selectedCount}</span>명 선택됨
          </p>
        </div>
        <div className="flex space-x-3">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => onViewModeChange("table")}
              className={`p-2 rounded-md ${
                viewMode === "table"
                  ? "bg-orange-100 text-orange-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
              </svg>
            </button>
            <button
              onClick={() => onViewModeChange("card")}
              className={`p-2 rounded-md ${
                viewMode === "card"
                  ? "bg-orange-100 text-orange-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                />
              </svg>
            </button>
          </div>
          <button
            onClick={() => onAdd(type)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
          >
            {type === "customer" ? "신규 고객 등록" : "신규 가수 등록"}
          </button>
          {selectedCount > 0 && (
            <div className="relative">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
              >
                일괄 관리
              </button>
              {isMenuOpen && (
                <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 divide-y divide-gray-100 z-10">
                  <div className="py-1">
                    <button
                      onClick={() => {
                        onBulkStatus("active");
                        setIsMenuOpen(false);
                      }}
                      className="group flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <svg
                        className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      활성화
                    </button>
                    <button
                      onClick={() => {
                        onBulkStatus("inactive");
                        setIsMenuOpen(false);
                      }}
                      className="group flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <svg
                        className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      비활성화
                    </button>
                    <button
                      onClick={() => {
                        onBulkDelete();
                        setIsMenuOpen(false);
                      }}
                      className="group flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                    >
                      <svg
                        className="mr-3 h-5 w-5 text-red-400 group-hover:text-red-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                      삭제
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
