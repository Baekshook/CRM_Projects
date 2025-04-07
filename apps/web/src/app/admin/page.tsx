"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import StatCard from "@/components/dashboard/StatCard";
import DateFilter from "@/components/dashboard/DateFilter";
import Section from "@/components/common/Section";
import PageHeader from "@/components/common/PageHeader";
import RecentRequest, {
  RecentRequestProps,
} from "@/components/requests/RecentRequest";
import ScheduleItem, {
  ScheduleItemProps,
} from "@/components/schedules/ScheduleItem";
import RecentNotification from "@/components/dashboard/RecentNotification";
import {
  RequestIcon,
  NegotiationIcon,
  ContractIcon,
  TimeIcon,
} from "@/components/common/DashboardIcons";
import {
  DashboardStats,
  getDashboardStats,
  getRecentRequests,
  getTodaySchedules,
  getRecentNotifications,
  getDashboardStatsTemp,
  getRecentRequestsTemp,
  getTodaySchedulesTemp,
  getRecentNotificationsTemp,
} from "@/services/dashboardApiDirect";

export default function AdminDashboard() {
  // 날짜 필터 상태
  const [dateFilter, setDateFilter] = useState<string>("today");
  const [customStartDate, setCustomStartDate] = useState<string>("");
  const [customEndDate, setCustomEndDate] = useState<string>("");

  // 데이터 및 로딩 상태
  const [stats, setStats] = useState<DashboardStats>({
    requestCount: 0,
    negotiationCount: 0,
    contractCount: 0,
    avgNegotiationDays: 0,
  });
  const [recentRequests, setRecentRequests] = useState<RecentRequestProps[]>(
    []
  );
  const [todaySchedules, setTodaySchedules] = useState<ScheduleItemProps[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);

        // 직접 API 사용 시도
        try {
          // 통계 데이터 조회
          const statsData = await getDashboardStats(
            dateFilter,
            customStartDate,
            customEndDate
          );
          setStats(statsData);

          // 최근 요청서 조회
          const requestsData = await getRecentRequests();
          setRecentRequests(requestsData);

          // 오늘의 일정 조회
          const schedulesData = await getTodaySchedules();
          setTodaySchedules(schedulesData);

          // 최근 알림 조회
          const notificationsData = await getRecentNotifications();
          setNotifications(notificationsData);
        } catch (apiError) {
          console.warn("API 요청 실패, 임시 데이터를 사용합니다:", apiError);

          // 임시 데이터 사용
          const statsData = await getDashboardStatsTemp(
            dateFilter,
            customStartDate,
            customEndDate
          );
          setStats(statsData);

          const requestsData = await getRecentRequestsTemp();
          setRecentRequests(requestsData);

          const schedulesData = await getTodaySchedulesTemp();
          setTodaySchedules(schedulesData);

          const notificationsData = await getRecentNotificationsTemp();
          setNotifications(notificationsData);
        }
      } catch (err) {
        console.error("대시보드 데이터 조회 오류:", err);
        setError("대시보드 데이터를 불러오는데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [dateFilter, customStartDate, customEndDate]);

  // 로딩 중 상태 표시
  if (loading && !recentRequests.length) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div
            className="spinner-border inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent"
            role="status"
          >
            <span className="sr-only">로딩중...</span>
          </div>
          <p className="mt-2 text-gray-600">대시보드 데이터를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  // 에러 상태 표시
  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-2">⚠️ 오류</div>
          <p className="text-gray-700">{error}</p>
          <button
            className="mt-4 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
            onClick={() => window.location.reload()}
          >
            새로고침
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* 페이지 헤더 */}
      <PageHeader
        title="대시보드"
        description="CRM 시스템의 주요 지표와 활동을 확인하세요."
      />

      {/* 날짜 필터 */}
      <DateFilter
        dateFilter={dateFilter}
        setDateFilter={setDateFilter}
        customStartDate={customStartDate}
        customEndDate={customEndDate}
        setCustomStartDate={setCustomStartDate}
        setCustomEndDate={setCustomEndDate}
      />

      {/* 통계 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <Link href="/admin/requests">
          <StatCard
            title="전체 요청"
            value={`${stats.requestCount}건`}
            color="border-blue-500"
            icon={<RequestIcon />}
          />
        </Link>
        <Link href="/admin/negotiations">
          <StatCard
            title="진행 중인 협상"
            value={`${stats.negotiationCount}건`}
            color="border-yellow-500"
            icon={<NegotiationIcon />}
          />
        </Link>
        <Link href="/admin/schedules/contracts">
          <StatCard
            title="완료된 계약"
            value={`${stats.contractCount}건`}
            color="border-green-500"
            icon={<ContractIcon />}
          />
        </Link>
        <StatCard
          title="평균 협상 시간"
          value={`${stats.avgNegotiationDays}일`}
          color="border-purple-500"
          icon={<TimeIcon />}
        />
      </div>

      {/* 메인 콘텐츠 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 최근 요청서 */}
        <div className="lg:col-span-2">
          <Section title="최근 요청서" viewAllLink="/admin/requests">
            {recentRequests.length > 0 ? (
              recentRequests.map((request) => (
                <RecentRequest
                  key={request.id}
                  id={request.id}
                  title={request.title}
                  customer={request.customer}
                  date={request.date}
                  status={request.status}
                />
              ))
            ) : (
              <div className="text-center py-10 text-gray-500">
                아직 요청서가 없습니다.
              </div>
            )}
          </Section>
        </div>

        {/* 사이드바 */}
        <div className="space-y-6">
          {/* 오늘의 스케줄 */}
          <Section title="오늘의 스케줄" viewAllLink="/admin/schedules">
            {todaySchedules.length > 0 ? (
              todaySchedules.map((schedule) => (
                <ScheduleItem
                  key={schedule.id}
                  id={schedule.id}
                  title={schedule.title}
                  time={schedule.time}
                  customer={schedule.customer}
                  location={schedule.location}
                />
              ))
            ) : (
              <div className="text-center py-10 text-gray-500">
                오늘 예정된 스케줄이 없습니다.
              </div>
            )}
          </Section>

          {/* 최근 알림 */}
          <Section title="최근 알림" viewAllLink="/admin/notifications">
            {notifications.length > 0 ? (
              notifications.map((notification, index) => (
                <RecentNotification
                  key={index}
                  message={notification.message}
                  time={notification.time}
                  color={notification.color}
                />
              ))
            ) : (
              <div className="text-center py-10 text-gray-500">
                알림이 없습니다.
              </div>
            )}
          </Section>
        </div>
      </div>
    </>
  );
}
