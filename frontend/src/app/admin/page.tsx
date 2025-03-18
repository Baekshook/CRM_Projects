"use client";
import { useState } from "react";
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

export default function AdminDashboard() {
  // 날짜 필터 상태
  const [dateFilter, setDateFilter] = useState<string>("today");

  // 더미 요청서 데이터
  const recentRequests: RecentRequestProps[] = [
    {
      id: "REQ-018",
      title: "뮤직 페스티벌 게스트",
      customer: "OO엔터테인먼트",
      date: "2025-05-05",
      status: "검토중",
    },
    {
      id: "REQ-020",
      title: "IT 컨퍼런스 클로징 공연",
      customer: "테크 얼라이언스",
      date: "2025-05-15",
      status: "요청중",
    },
    {
      id: "REQ-014",
      title: "브랜드 팝업스토어 이벤트",
      customer: "(주)패션 그룹",
      date: "2025-04-30",
      status: "협상 진행",
    },
    {
      id: "REQ-015",
      title: "어린이날 특별공연",
      customer: "OO테마파크",
      date: "2025-04-20",
      status: "견적 완료",
    },
    {
      id: "REQ-017",
      title: "스포츠 브랜드 런칭쇼",
      customer: "글로벌 스포츠",
      date: "2025-04-01",
      status: "협상 진행",
    },
  ];

  // 오늘의 스케줄 데이터
  const todaySchedules: ScheduleItemProps[] = [
    {
      id: "REQ-015",
      title: "어린이날 특별공연 최종 점검",
      time: "10:00 - 11:00",
      customer: "OO테마파크",
      location: "서울 특별시",
    },
    {
      id: "REQ-020",
      title: "IT 컨퍼런스 견적 논의",
      time: "13:30 - 14:30",
      customer: "테크 얼라이언스",
      location: "부산 광역시",
    },
    {
      id: "REQ-014",
      title: "팝업스토어 계약서 서명",
      time: "16:00 - 17:00",
      customer: "(주)패션 그룹",
      location: "대구 광역시",
    },
  ];

  // 최근 알림 데이터
  const notifications = [
    {
      message: "어린이날 특별공연 계약서 서명이 필요합니다",
      time: "10분 전",
      color: "orange" as const,
    },
    {
      message: "스포츠 브랜드 런칭쇼 협상 미팅 요청",
      time: "1시간 전",
      color: "blue" as const,
    },
    {
      message: "IT 컨퍼런스 클로징 공연 견적서 검토 완료",
      time: "3시간 전",
      color: "green" as const,
    },
  ];

  return (
    <>
      {/* 페이지 헤더 */}
      <PageHeader
        title="대시보드"
        description="CRM 시스템의 주요 지표와 활동을 확인하세요."
      />

      {/* 날짜 필터 */}
      <DateFilter dateFilter={dateFilter} setDateFilter={setDateFilter} />

      {/* 통계 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <Link href="/admin/requests">
          <StatCard
            title="전체 요청"
            value="20건"
            color="border-blue-500"
            icon={<RequestIcon />}
          />
        </Link>
        <Link href="/admin/negotiations">
          <StatCard
            title="진행 중인 협상"
            value="7건"
            color="border-yellow-500"
            icon={<NegotiationIcon />}
          />
        </Link>
        <Link href="/admin/schedules">
          <StatCard
            title="완료된 계약"
            value="12건"
            color="border-green-500"
            icon={<ContractIcon />}
          />
        </Link>
        <StatCard
          title="평균 협상 시간"
          value="5일"
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
