"use client";

import { useState, useCallback, useEffect } from "react";
import {
  getDashboardData,
  getDashboardDataTemp,
} from "@/services/dashboardApi";
import StatCard from "@/components/dashboard/StatCard";
import RecentRequest from "@/components/dashboard/RecentRequest";
import ScheduleItem from "@/components/dashboard/ScheduleItem";
import RecentNotification from "@/components/dashboard/RecentNotification";
import DateFilter from "@/components/dashboard/DateFilter";

export default function DashboardPage() {
  const [stats, setStats] = useState<{
    requestCount: number;
    negotiationCount: number;
    contractCount: number;
    avgNegotiationDays: number;
  } | null>(null);
  const [recentRequests, setRecentRequests] = useState<any[]>([]);
  const [todaySchedules, setTodaySchedules] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dateFilter, setDateFilter] = useState<string>("today");
  const [dateRange, setDateRange] = useState<{
    startDate: Date | null;
    endDate: Date | null;
  }>({
    startDate: null,
    endDate: null,
  });

  // 대시보드 데이터 로드
  const loadDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // 임시 데이터 사용 (API 연결이 불안정한 경우를 대비)
      const tempData = await getDashboardDataTemp(
        dateFilter,
        dateRange.startDate?.toISOString().split("T")[0],
        dateRange.endDate?.toISOString().split("T")[0]
      );

      // 상태 업데이트 (먼저 임시 데이터로 설정)
      setStats(tempData.stats);
      setRecentRequests(tempData.recentRequests);
      setTodaySchedules(tempData.todaySchedules);
      setNotifications(tempData.notifications);

      // 실제 API 호출 시도
      try {
        const data = await getDashboardData(
          dateFilter,
          dateRange.startDate?.toISOString().split("T")[0],
          dateRange.endDate?.toISOString().split("T")[0]
        );

        // 실제 데이터로 업데이트
        setStats(data.stats);
        setRecentRequests(data.recentRequests);
        setTodaySchedules(data.todaySchedules);
        setNotifications(data.notifications);
      } catch (apiError) {
        console.error("API 연결 실패, 임시 데이터를 사용합니다:", apiError);
        // 이미 임시 데이터가 설정되어 있으므로 추가 조치 필요 없음
      }
    } catch (error) {
      console.error("대시보드 데이터 로드 오류:", error);
      setError("데이터를 불러오는 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  }, [dateFilter, dateRange]);

  // 컴포넌트 마운트 시 데이터 로드
  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  // 날짜 필터 변경 핸들러
  const handleDateFilterChange = (
    newFilter: string,
    newRange?: { startDate: Date | null; endDate: Date | null }
  ) => {
    setDateFilter(newFilter);
    if (newRange) {
      setDateRange(newRange);
    }
  };

  // 로딩 상태 표시
  if (loading && !stats) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
          <p className="mt-4 text-gray-700">대시보드 데이터를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  // 오류 상태 표시
  if (error) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="text-center text-red-500">
          <p className="text-xl font-semibold">오류 발생</p>
          <p className="mt-2">{error}</p>
          <button
            onClick={loadDashboardData}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            다시 시도
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">대시보드</h1>

      {/* 날짜 필터 */}
      <div className="mb-6">
        <DateFilter
          currentFilter={dateFilter}
          dateRange={dateRange}
          onFilterChange={handleDateFilterChange}
        />
      </div>

      {/* 통계 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats && (
          <>
            <StatCard
              title="요청서"
              value={stats.requestCount}
              icon="document"
              color="blue"
            />
            <StatCard
              title="협상 중"
              value={stats.negotiationCount}
              icon="chat"
              color="orange"
            />
            <StatCard
              title="계약 완료"
              value={stats.contractCount}
              icon="check"
              color="green"
            />
            <StatCard
              title="평균 협상 일수"
              value={stats.avgNegotiationDays}
              unit="일"
              icon="clock"
              color="purple"
            />
          </>
        )}
      </div>

      {/* 최근 요청서 & 오늘의 일정 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-bold mb-4">최근 요청서</h2>
          <div className="space-y-3">
            {recentRequests.length > 0 ? (
              recentRequests.map((request, index) => (
                <RecentRequest key={request.id || index} request={request} />
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">
                최근 요청서가 없습니다.
              </p>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-bold mb-4">오늘의 일정</h2>
          <div className="space-y-3">
            {todaySchedules.length > 0 ? (
              todaySchedules.map((schedule, index) => (
                <ScheduleItem key={schedule.id || index} schedule={schedule} />
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">
                오늘 예정된 일정이 없습니다.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* 최근 알림 */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-bold mb-4">최근 알림</h2>
        <div className="space-y-3">
          {notifications.length > 0 ? (
            notifications.map((notification, index) => (
              <RecentNotification key={index} notification={notification} />
            ))
          ) : (
            <p className="text-gray-500 text-center py-4">
              최근 알림이 없습니다.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
