"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { schedules as dummySchedules, Schedule } from "@/utils/dummyData";

export default function ScheduleDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [schedule, setSchedule] = useState<Schedule | null>(null);

  useEffect(() => {
    // 실제로는 API 호출로 처리
    const scheduleData = dummySchedules.find((s) => s.id === params.id);
    if (scheduleData) {
      setSchedule(scheduleData);
    }
  }, [params.id]);

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "scheduled":
        return "bg-blue-100 text-blue-800";
      case "in_progress":
        return "bg-yellow-100 text-yellow-800";
      case "completed":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      case "changed":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "scheduled":
        return "예정됨";
      case "in_progress":
        return "진행중";
      case "completed":
        return "완료";
      case "cancelled":
        return "취소";
      case "changed":
        return "변경됨";
      default:
        return status;
    }
  };

  if (!schedule) {
    return <div>Loading...</div>;
  }

  return (
    <div className="pb-10">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">일정 상세</h1>
          <p className="text-gray-600 mt-1">일정 번호: {schedule.id}</p>
        </div>
        <div className="flex space-x-4">
          <Link
            href={`/admin/schedules/${schedule.id}/edit`}
            className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
          >
            일정 수정
          </Link>
          <Link
            href="/admin/schedules"
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            목록으로
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 이벤트 정보 */}
            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                이벤트 정보
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500">
                    이벤트 제목
                  </label>
                  <div className="mt-1 text-sm text-gray-900">
                    {schedule.eventTitle}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">
                    매칭 번호
                  </label>
                  <div className="mt-1 text-sm text-gray-900">
                    {schedule.matchId}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">
                    상태
                  </label>
                  <div className="mt-1">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(
                        schedule.status
                      )}`}
                    >
                      {getStatusText(schedule.status)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* 일정 정보 */}
            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                일정 정보
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500">
                    일시
                  </label>
                  <div className="mt-1 text-sm text-gray-900">
                    {schedule.eventDate} {schedule.startTime} -{" "}
                    {schedule.endTime}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">
                    장소
                  </label>
                  <div className="mt-1 text-sm text-gray-900">
                    {schedule.venue}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">
                    등록일
                  </label>
                  <div className="mt-1 text-sm text-gray-900">
                    {schedule.createdAt}
                  </div>
                </div>
              </div>
            </div>

            {/* 고객 정보 */}
            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                고객 정보
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500">
                    고객명
                  </label>
                  <div className="mt-1 text-sm text-gray-900">
                    {schedule.customerName}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">
                    회사명
                  </label>
                  <div className="mt-1 text-sm text-gray-900">
                    {schedule.customerCompany}
                  </div>
                </div>
              </div>
            </div>

            {/* 가수 정보 */}
            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                가수 정보
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500">
                    가수명
                  </label>
                  <div className="mt-1 text-sm text-gray-900">
                    {schedule.singerName}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">
                    소속사
                  </label>
                  <div className="mt-1 text-sm text-gray-900">
                    {schedule.singerAgency}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 요구사항 및 특이사항 */}
          <div className="mt-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              요구사항 및 특이사항
            </h2>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-700 whitespace-pre-line">
                {schedule.details || "등록된 요구사항이 없습니다."}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
