"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { schedules as dummySchedules, Schedule } from "@/utils/dummyData";

export default function EditSchedulePage() {
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("일정이 수정되었습니다.");
    router.push("/admin/schedules");
  };

  const handleCancel = () => {
    const confirmed = window.confirm(
      "변경사항이 저장되지 않을 수 있습니다. 정말 취소하시겠습니까?"
    );
    if (confirmed) {
      router.back();
    }
  };

  if (!schedule) {
    return <div>Loading...</div>;
  }

  return (
    <div className="pb-10">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">일정 수정</h1>
          <p className="text-gray-600 mt-1">일정 번호: {schedule.id}</p>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-lg shadow overflow-hidden"
      >
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 이벤트 정보 */}
            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                이벤트 정보
              </h2>
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="eventTitle"
                    className="block text-sm font-medium text-gray-700"
                  >
                    이벤트 제목
                  </label>
                  <input
                    type="text"
                    id="eventTitle"
                    name="eventTitle"
                    defaultValue={schedule.eventTitle}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label
                    htmlFor="status"
                    className="block text-sm font-medium text-gray-700"
                  >
                    상태
                  </label>
                  <select
                    id="status"
                    name="status"
                    defaultValue={schedule.status}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                  >
                    <option value="scheduled">예정됨</option>
                    <option value="in_progress">진행중</option>
                    <option value="completed">완료</option>
                    <option value="cancelled">취소</option>
                    <option value="changed">변경됨</option>
                  </select>
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
                  <label
                    htmlFor="eventDate"
                    className="block text-sm font-medium text-gray-700"
                  >
                    날짜
                  </label>
                  <input
                    type="date"
                    id="eventDate"
                    name="eventDate"
                    defaultValue={schedule.eventDate}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label
                    htmlFor="startTime"
                    className="block text-sm font-medium text-gray-700"
                  >
                    시작 시간
                  </label>
                  <input
                    type="time"
                    id="startTime"
                    name="startTime"
                    defaultValue={schedule.startTime}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label
                    htmlFor="endTime"
                    className="block text-sm font-medium text-gray-700"
                  >
                    종료 시간
                  </label>
                  <input
                    type="time"
                    id="endTime"
                    name="endTime"
                    defaultValue={schedule.endTime}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label
                    htmlFor="venue"
                    className="block text-sm font-medium text-gray-700"
                  >
                    장소
                  </label>
                  <input
                    type="text"
                    id="venue"
                    name="venue"
                    defaultValue={schedule.venue}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                  />
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
                  <label
                    htmlFor="customerName"
                    className="block text-sm font-medium text-gray-700"
                  >
                    고객명
                  </label>
                  <input
                    type="text"
                    id="customerName"
                    name="customerName"
                    defaultValue={schedule.customerName}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label
                    htmlFor="customerCompany"
                    className="block text-sm font-medium text-gray-700"
                  >
                    회사명
                  </label>
                  <input
                    type="text"
                    id="customerCompany"
                    name="customerCompany"
                    defaultValue={schedule.customerCompany}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                  />
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
                  <label
                    htmlFor="singerName"
                    className="block text-sm font-medium text-gray-700"
                  >
                    가수명
                  </label>
                  <input
                    type="text"
                    id="singerName"
                    name="singerName"
                    defaultValue={schedule.singerName}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label
                    htmlFor="singerAgency"
                    className="block text-sm font-medium text-gray-700"
                  >
                    소속사
                  </label>
                  <input
                    type="text"
                    id="singerAgency"
                    name="singerAgency"
                    defaultValue={schedule.singerAgency}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 요구사항 및 특이사항 */}
          <div className="mt-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              요구사항 및 특이사항
            </h2>
            <div>
              <textarea
                id="details"
                name="details"
                rows={4}
                defaultValue={schedule.details}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
              />
            </div>
          </div>

          {/* 버튼 */}
          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
            >
              취소
            </button>
            <button
              type="submit"
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
            >
              저장
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
