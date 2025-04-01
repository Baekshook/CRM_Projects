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
  requests,
  schedules,
  matches,
  contracts,
  negotiationLogs,
} from "@/utils/dummyData";

export default function AdminDashboard() {
  // 날짜 필터 상태
  const [dateFilter, setDateFilter] = useState<string>("today");
  const [customStartDate, setCustomStartDate] = useState<string>("");
  const [customEndDate, setCustomEndDate] = useState<string>("");
  const [filteredRequests, setFilteredRequests] = useState<typeof requests>([]);
  const [filteredSchedules, setFilteredSchedules] = useState<typeof schedules>(
    []
  );
  const [filteredMatches, setFilteredMatches] = useState<typeof matches>([]);
  const [filteredContracts, setFilteredContracts] = useState<typeof contracts>(
    []
  );
  const [requestCount, setRequestCount] = useState<number>(0);
  const [negotiationCount, setNegotiationCount] = useState<number>(0);
  const [contractCount, setContractCount] = useState<number>(0);
  const [avgNegotiationDays, setAvgNegotiationDays] = useState<number>(0);

  // 날짜에 따른 필터링 로직
  const filterDataByDate = (date: string) => {
    const today = new Date();
    const startOfDay = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );
    const endOfDay = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
      23,
      59,
      59
    );

    let startDate: Date;
    let endDate: Date;

    switch (dateFilter) {
      case "today":
        startDate = startOfDay;
        endDate = endOfDay;
        break;
      case "week":
        // 현재 날짜부터 7일 전까지
        startDate = new Date(today);
        startDate.setDate(today.getDate() - 7);
        endDate = endOfDay;
        break;
      case "month":
        // 현재 날짜부터 30일 전까지
        startDate = new Date(today);
        startDate.setDate(today.getDate() - 30);
        endDate = endOfDay;
        break;
      case "custom":
        // 사용자 지정 날짜
        if (customStartDate && customEndDate) {
          startDate = new Date(customStartDate);
          endDate = new Date(customEndDate);
          endDate.setHours(23, 59, 59);
        } else {
          return true; // 날짜가 설정되지 않은 경우 모든 데이터 표시
        }
        break;
      default:
        return true; // 기본값은 모든 데이터 표시
    }

    const itemDate = new Date(date);
    return itemDate >= startDate && itemDate <= endDate;
  };

  // 최근 요청서 데이터
  const recentRequests: RecentRequestProps[] = filteredRequests
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    .slice(0, 5)
    .map((request) => ({
      id: request.id,
      title: request.title,
      customer: request.customerName,
      date: new Date(request.createdAt).toLocaleDateString("ko-KR"),
      status:
        request.status === "pending"
          ? "요청 접수"
          : request.status === "in_progress"
          ? "협상 진행"
          : request.status === "completed"
          ? "계약 완료"
          : "요청 취소",
    }));

  // 오늘의 스케줄 데이터
  const todaySchedules: ScheduleItemProps[] = filteredSchedules.map(
    (schedule) => ({
      id: schedule.id,
      title: schedule.eventTitle,
      time: `${schedule.startTime} - ${schedule.endTime}`,
      customer: schedule.customerName,
      location: schedule.venue,
    })
  );

  // 최근 알림 데이터 (협상 로그에서 추출)
  const notifications = negotiationLogs
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5)
    .map((log) => {
      let color: "orange" | "blue" | "green" | "red" | "purple" | "gray" =
        "gray";

      switch (log.type) {
        case "status_change":
          color = "blue";
          break;
        case "price_change":
          color = "green";
          break;
        case "message":
          color = "orange";
          break;
        default:
          color = "gray";
      }

      return {
        message: log.content,
        time: new Date(log.date).toLocaleDateString("ko-KR"),
        color: color,
      };
    });

  useEffect(() => {
    // 날짜 필터에 따라 데이터 필터링
    const filteredReq = requests.filter((req) =>
      filterDataByDate(req.createdAt)
    );
    const filteredSch = schedules.filter((sch) =>
      filterDataByDate(sch.eventDate)
    );
    const filteredMat = matches.filter((match) =>
      filterDataByDate(match.createdAt)
    );
    const filteredCon = contracts.filter((contract) =>
      filterDataByDate(contract.createdAt)
    );

    setFilteredRequests(filteredReq);
    setFilteredSchedules(filteredSch);
    setFilteredMatches(filteredMat);
    setFilteredContracts(filteredCon);

    // 통계 데이터 계산
    setRequestCount(filteredReq.length);
    setNegotiationCount(
      filteredMat.filter((match) => match.status === "negotiating").length
    );
    setContractCount(filteredCon.length);

    // 평균 협상 기간 계산 (샘플)
    const negotiationDays = filteredMat
      .filter((match) => match.status !== "pending")
      .map((match) => {
        const startDate = new Date(match.createdAt);
        const endDate = new Date(match.updatedAt);
        const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
      });

    const avgDays =
      negotiationDays.length > 0
        ? Math.round(
            negotiationDays.reduce((sum, days) => sum + days, 0) /
              negotiationDays.length
          )
        : 0;

    setAvgNegotiationDays(avgDays);
  }, [dateFilter, customStartDate, customEndDate]);

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
            value={`${requestCount}건`}
            color="border-blue-500"
            icon={<RequestIcon />}
          />
        </Link>
        <Link href="/admin/negotiations">
          <StatCard
            title="진행 중인 협상"
            value={`${negotiationCount}건`}
            color="border-yellow-500"
            icon={<NegotiationIcon />}
          />
        </Link>
        <Link href="/admin/schedules">
          <StatCard
            title="완료된 계약"
            value={`${contractCount}건`}
            color="border-green-500"
            icon={<ContractIcon />}
          />
        </Link>
        <StatCard
          title="평균 협상 시간"
          value={`${avgNegotiationDays}일`}
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
            {notifications.map((notification, index) => (
              <RecentNotification
                key={index}
                message={notification.message}
                time={notification.time}
                color={notification.color}
              />
            ))}
          </Section>
        </div>
      </div>
    </>
  );
}
