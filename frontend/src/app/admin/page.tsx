"use client";
import { useState } from "react";
import Link from "next/link";

// 통계 카드 컴포넌트
interface StatCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  color: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, color }) => {
  return (
    <div className={`bg-white rounded-lg shadow p-5 border-l-4 ${color}`}>
      <div className="flex justify-between items-center">
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <p className="text-2xl font-bold mt-1">{value}</p>
        </div>
        <div className="text-gray-400">{icon}</div>
      </div>
    </div>
  );
};

// 최근 요청서 컴포넌트
interface RecentRequestProps {
  id: string;
  title: string;
  customer: string;
  date: string;
  status: string;
}

const RecentRequest: React.FC<RecentRequestProps> = ({
  id,
  title,
  customer,
  date,
  status,
}) => {
  // 상태에 따른 배지 색상
  const getStatusColor = (status: string) => {
    switch (status) {
      case "요청중":
        return "bg-blue-100 text-blue-800";
      case "검토중":
        return "bg-yellow-100 text-yellow-800";
      case "협상 진행":
        return "bg-purple-100 text-purple-800";
      case "견적 완료":
        return "bg-green-100 text-green-800";
      case "취소":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="border-b border-gray-200 py-3">
      <div className="flex justify-between items-start">
        <div>
          <Link
            href={`/admin/requests/${id}`}
            className="text-orange-600 hover:text-orange-800 font-medium"
          >
            {title}
          </Link>
          <p className="text-sm text-gray-500 mt-1">{customer}</p>
        </div>
        <div className="flex flex-col items-end">
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
              status
            )}`}
          >
            {status}
          </span>
          <span className="text-xs text-gray-500 mt-1">{date}</span>
        </div>
      </div>
    </div>
  );
};

// 오늘의 스케줄 컴포넌트
interface ScheduleItemProps {
  id: string;
  title: string;
  time: string;
  type: string;
}

const ScheduleItem: React.FC<ScheduleItemProps> = ({
  id,
  title,
  time,
  type,
}) => {
  // 타입에 따른 테두리 색상
  const getBorderColor = (type: string) => {
    switch (type) {
      case "견적 요청":
        return "border-blue-300";
      case "계약":
        return "border-green-300";
      case "스케줄 변경":
        return "border-yellow-300";
      default:
        return "border-gray-300";
    }
  };

  return (
    <div
      className={`border-l-4 ${getBorderColor(
        type
      )} pl-3 py-2 mb-3 bg-gray-50 rounded-r`}
    >
      <p className="font-medium text-gray-800">{title}</p>
      <div className="flex justify-between text-sm mt-1">
        <span className="text-gray-500">{time}</span>
        <span className="text-gray-600">{type}</span>
      </div>
    </div>
  );
};

export default function AdminDashboard() {
  // 날짜 필터 상태
  const [dateFilter, setDateFilter] = useState<string>("today");

  return (
    <div>
      {/* 페이지 헤더 */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">대시보드</h1>
        <p className="text-gray-600 mt-1">
          CRM 시스템의 주요 지표와 활동을 확인하세요.
        </p>
      </div>

      {/* 날짜 필터 */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="flex space-x-2">
          <button
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              dateFilter === "today"
                ? "bg-orange-500 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
            onClick={() => setDateFilter("today")}
          >
            오늘
          </button>
          <button
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              dateFilter === "week"
                ? "bg-orange-500 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
            onClick={() => setDateFilter("week")}
          >
            이번 주
          </button>
          <button
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              dateFilter === "month"
                ? "bg-orange-500 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
            onClick={() => setDateFilter("month")}
          >
            이번 달
          </button>
        </div>
      </div>

      {/* 통계 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <Link href="/admin/requests">
          <StatCard
            title="전체 요청"
            value="0건"
            color="border-blue-500"
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            }
          />
        </Link>
        <Link href="/admin/negotiations">
          <StatCard
            title="진행 중인 협상"
            value="0건"
            color="border-yellow-500"
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"
                />
              </svg>
            }
          />
        </Link>
        <Link href="/admin/schedules">
          <StatCard
            title="완료된 계약"
            value="0건"
            color="border-green-500"
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            }
          />
        </Link>
        <StatCard
          title="평균 협상 시간"
          value="0일"
          color="border-purple-500"
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          }
        />
      </div>

      {/* 메인 콘텐츠 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 최근 요청서 */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="flex justify-between items-center p-5 border-b border-gray-200">
              <h2 className="text-lg font-bold text-gray-800">최근 요청서</h2>
              <Link
                href="/admin/requests"
                className="text-orange-600 hover:text-orange-800 text-sm"
              >
                모두 보기
              </Link>
            </div>
            <div className="p-5">
              <div className="text-center py-10 text-gray-500">
                아직 요청서가 없습니다.
              </div>
            </div>
          </div>
        </div>

        {/* 사이드바 */}
        <div className="space-y-6">
          {/* 오늘의 스케줄 */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="flex justify-between items-center p-5 border-b border-gray-200">
              <h2 className="text-lg font-bold text-gray-800">오늘의 스케줄</h2>
              <Link
                href="/admin/schedules"
                className="text-orange-600 hover:text-orange-800 text-sm"
              >
                모두 보기
              </Link>
            </div>
            <div className="p-5">
              <div className="text-center py-10 text-gray-500">
                오늘 예정된 스케줄이 없습니다.
              </div>
            </div>
          </div>

          {/* 최근 알림 */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="flex justify-between items-center p-5 border-b border-gray-200">
              <h2 className="text-lg font-bold text-gray-800">최근 알림</h2>
              <Link
                href="/admin/notifications"
                className="text-orange-600 hover:text-orange-800 text-sm"
              >
                모두 보기
              </Link>
            </div>
            <div className="p-5">
              <div className="text-center py-10 text-gray-500">
                새로운 알림이 없습니다.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
