"use client";

import React from "react";
import Link from "next/link";

interface RecentRequestProps {
  request: {
    id: string;
    title: string;
    customer?: string;
    date?: string;
    status?: string;
  };
}

const RecentRequest = ({ request }: RecentRequestProps) => {
  // 상태에 따른 배지 색상 결정
  const getBadgeColor = (status?: string) => {
    switch (status) {
      case "요청 접수":
        return "bg-blue-100 text-blue-800";
      case "협상 진행":
        return "bg-orange-100 text-orange-800";
      case "계약 완료":
        return "bg-green-100 text-green-800";
      case "요청 취소":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Link href={`/admin/requests/${request.id}`}>
      <div className="p-3 border border-gray-200 rounded-md hover:bg-gray-50 cursor-pointer transition-colors">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <h3 className="font-medium text-gray-900 truncate">
              {request.title || "제목 없음"}
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              {request.customer || "고객명 없음"} ·{" "}
              {request.date || "날짜 정보 없음"}
            </p>
          </div>
          {request.status && (
            <span
              className={`px-2 py-1 text-xs rounded-full ${getBadgeColor(
                request.status
              )}`}
            >
              {request.status}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
};

export default RecentRequest;
