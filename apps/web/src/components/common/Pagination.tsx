"use client";

import React from "react";

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  filteredItems: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  totalItems,
  filteredItems,
  onPageChange,
}) => {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  if (totalPages <= 1) {
    return (
      <div className="flex justify-between items-center text-sm text-gray-500">
        <div>
          총 {totalItems}개 항목 중 {filteredItems}개 표시
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-between items-center">
      <div className="text-sm text-gray-500">
        총 {totalItems}개 항목 중 {filteredItems}개 표시
      </div>
      <div className="flex space-x-1">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`px-3 py-1 rounded ${
            currentPage === 1
              ? "text-gray-400 cursor-not-allowed"
              : "text-gray-700 hover:bg-gray-100"
          }`}
        >
          이전
        </button>
        {pages.map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`px-3 py-1 rounded ${
              page === currentPage
                ? "bg-orange-500 text-white"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            {page}
          </button>
        ))}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`px-3 py-1 rounded ${
            currentPage === totalPages
              ? "text-gray-400 cursor-not-allowed"
              : "text-gray-700 hover:bg-gray-100"
          }`}
        >
          다음
        </button>
      </div>
    </div>
  );
};

export default Pagination;
