"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Schedule } from "@/utils/dummyData";
import { createSchedule } from "@/services/schedulesApi";

export default function NewSchedulePage() {
  const router = useRouter();
  const [saving, setSaving] = useState<boolean>(false);
  const [formData, setFormData] = useState<Partial<Schedule>>({
    status: "scheduled",
    eventDate: new Date().toISOString().split("T")[0], // 오늘 날짜를 기본값으로
    startTime: "12:00",
    endTime: "15:00",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 필수 필드 검증
    const requiredFields = [
      "eventTitle",
      "customerName",
      "singerName",
      "eventDate",
      "venue",
    ];
    const missingFields = requiredFields.filter(
      (field) => !formData[field as keyof Partial<Schedule>]
    );

    if (missingFields.length > 0) {
      alert(`다음 필드를 입력해주세요: ${missingFields.join(", ")}`);
      return;
    }

    try {
      setSaving(true);
      const newSchedule = await createSchedule(formData);
      alert("새 일정이 등록되었습니다.");
      router.push(`/admin/schedules/${newSchedule.id}`);
    } catch (err) {
      console.error("일정 생성 오류:", err);
      alert("일정 등록에 실패했습니다.");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    const confirmed = window.confirm(
      "입력한 내용이 저장되지 않을 수 있습니다. 정말 취소하시겠습니까?"
    );
    if (confirmed) {
      router.push("/admin/schedules");
    }
  };

  return (
    <div className="pb-10">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">새 일정 등록</h1>
          <p className="text-gray-600 mt-1">새로운 일정 정보를 입력하세요.</p>
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
                    이벤트 제목 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="eventTitle"
                    name="eventTitle"
                    value={formData.eventTitle || ""}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label
                    htmlFor="matchId"
                    className="block text-sm font-medium text-gray-700"
                  >
                    매칭 번호 (선택사항)
                  </label>
                  <input
                    type="text"
                    id="matchId"
                    name="matchId"
                    value={formData.matchId || ""}
                    onChange={handleChange}
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
                    value={formData.status || "scheduled"}
                    onChange={handleChange}
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
                    날짜 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    id="eventDate"
                    name="eventDate"
                    value={formData.eventDate || ""}
                    onChange={handleChange}
                    required
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
                    value={formData.startTime || ""}
                    onChange={handleChange}
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
                    value={formData.endTime || ""}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label
                    htmlFor="venue"
                    className="block text-sm font-medium text-gray-700"
                  >
                    장소 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="venue"
                    name="venue"
                    value={formData.venue || ""}
                    onChange={handleChange}
                    required
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
                    고객명 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="customerName"
                    name="customerName"
                    value={formData.customerName || ""}
                    onChange={handleChange}
                    required
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
                    value={formData.customerCompany || ""}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label
                    htmlFor="customerId"
                    className="block text-sm font-medium text-gray-700"
                  >
                    고객 ID
                  </label>
                  <input
                    type="text"
                    id="customerId"
                    name="customerId"
                    value={formData.customerId || ""}
                    onChange={handleChange}
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
                    가수명 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="singerName"
                    name="singerName"
                    value={formData.singerName || ""}
                    onChange={handleChange}
                    required
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
                    value={formData.singerAgency || ""}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label
                    htmlFor="singerId"
                    className="block text-sm font-medium text-gray-700"
                  >
                    가수 ID
                  </label>
                  <input
                    type="text"
                    id="singerId"
                    name="singerId"
                    value={formData.singerId || ""}
                    onChange={handleChange}
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
                value={formData.details || ""}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                placeholder="행사 관련 요구사항이나 특이사항을 입력하세요."
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
              disabled={saving}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50"
            >
              {saving ? "저장 중..." : "저장"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
