"use client";

import React from "react";
import { CustomerActionProps, EntityType, ViewMode } from "./types";

const CustomerActions: React.FC<CustomerActionProps> = ({
  selectedCount,
  viewMode,
  onViewModeChange,
  onAdd,
  onBulkDelete,
  onBulkStatus,
  type,
}) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow flex flex-wrap justify-between items-center">
      <div className="flex items-center space-x-4">
        <span className="text-sm text-gray-500">
          {selectedCount > 0
            ? `${selectedCount}개 항목 선택됨`
            : "항목을 선택하세요"}
        </span>
        {selectedCount > 0 && (
          <>
            <button
              onClick={() => onBulkStatus("active")}
              className="px-3 py-1 text-sm bg-green-500 text-white rounded hover:bg-green-600"
            >
              활성화
            </button>
            <button
              onClick={() => onBulkStatus("inactive")}
              className="px-3 py-1 text-sm bg-yellow-500 text-white rounded hover:bg-yellow-600"
            >
              비활성화
            </button>
            <button
              onClick={onBulkDelete}
              className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600"
            >
              삭제
            </button>
          </>
        )}
      </div>

      <div className="flex items-center mt-4 sm:mt-0">
        <div className="flex border rounded overflow-hidden mr-4">
          <button
            onClick={() => onViewModeChange("table")}
            className={`px-3 py-1 ${
              viewMode === "table"
                ? "bg-orange-500 text-white"
                : "bg-white text-gray-700"
            }`}
          >
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
                d="M3 10h18M3 14h18M3 18h18M3 6h18"
              />
            </svg>
          </button>
          <button
            onClick={() => onViewModeChange("card")}
            className={`px-3 py-1 ${
              viewMode === "card"
                ? "bg-orange-500 text-white"
                : "bg-white text-gray-700"
            }`}
          >
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
                d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
              />
            </svg>
          </button>
        </div>

        <button
          onClick={() => onAdd(type)}
          className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 flex items-center"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
          {type === "customer" ? "신규 고객" : "신규 가수"}
        </button>
      </div>
    </div>
  );
};

export default CustomerActions;
