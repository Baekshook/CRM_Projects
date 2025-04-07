"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Contract, Schedule } from "@/types/scheduleTypes";
import { createContract, getAllSchedules } from "@/services/schedulesApi";

export default function NewContractPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const scheduleId = searchParams.get("scheduleId");

  const [saving, setSaving] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(
    null
  );
  const [formData, setFormData] = useState<Partial<Contract>>({
    contractStatus: "draft",
    paymentStatus: "unpaid",
    createdAt: new Date().toISOString(),
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        setLoading(true);
        const data = await getAllSchedules();
        setSchedules(data);

        // 선택된 일정이 URL에서 넘어왔다면 해당 일정을 찾음
        if (scheduleId) {
          const schedule =
            data.find((s: Schedule) => s.id === scheduleId) || null;
          if (schedule) {
            setSelectedSchedule(schedule);
            populateFormFromSchedule(schedule);
          }
        }
      } catch (error) {
        console.error("일정 목록 조회 오류:", error);
        alert("일정 정보를 불러오는데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchSchedules();
  }, [scheduleId]);

  const handleScheduleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = e.target.value;
    if (!selectedId) {
      setSelectedSchedule(null);
      return;
    }

    const schedule = schedules.find((s) => s.id === selectedId);
    if (schedule) {
      setSelectedSchedule(schedule);
      setFormData({
        ...formData,
        scheduleId: schedule.id,
        requestId: schedule.requestId,
        matchId: schedule.matchId,
        customerId: schedule.customerId,
        customerName: schedule.customerName,
        customerCompany: schedule.customerCompany,
        singerId: schedule.singerId,
        singerName: schedule.singerName,
        singerAgency: schedule.singerAgency,
        eventTitle: schedule.eventTitle,
        eventDate: schedule.eventDate,
        venue: schedule.venue,
      });
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.scheduleId) {
      newErrors.scheduleId = "일정을 선택해주세요.";
    }

    if (!formData.eventTitle?.trim()) {
      newErrors.eventTitle = "이벤트명은 필수 입력 항목입니다.";
    }

    if (!formData.eventDate?.trim()) {
      newErrors.eventDate = "이벤트 날짜는 필수 입력 항목입니다.";
    }

    if (!formData.venue?.trim()) {
      newErrors.venue = "장소는 필수 입력 항목입니다.";
    }

    if (!formData.contractAmount?.trim()) {
      newErrors.contractAmount = "계약 금액은 필수 입력 항목입니다.";
    } else if (isNaN(Number(formData.contractAmount.replace(/,/g, "")))) {
      newErrors.contractAmount = "계약 금액은 숫자만 입력해주세요.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setSaving(true);
      const newContract = await createContract(formData);
      alert("계약이 성공적으로 생성되었습니다.");
      router.push(`/admin/schedules/contracts/${newContract.id}`);
    } catch (err) {
      console.error("계약 생성 오류:", err);
      alert("계약 등록에 실패했습니다.");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    const confirmed = window.confirm(
      "입력한 내용이 저장되지 않을 수 있습니다. 정말 취소하시겠습니까?"
    );
    if (confirmed) {
      router.push("/admin/schedules/contracts");
    }
  };

  // 날짜 포맷팅 함수
  const formatDateForInput = (dateString: string) => {
    if (!dateString) return "";
    return dateString.split("T")[0];
  };

  const populateFormFromSchedule = (schedule: Schedule) => {
    setFormData({
      ...formData,
      scheduleId: schedule.id,
      requestId: schedule.requestId,
      matchId: schedule.matchId,
      customerId: schedule.customerId,
      customerName: schedule.customerName,
      customerCompany: schedule.customerCompany,
      singerId: schedule.singerId,
      singerName: schedule.singerName,
      singerAgency: schedule.singerAgency,
      eventTitle: schedule.eventTitle,
      eventDate: schedule.eventDate,
      venue: schedule.venue,
      contractAmount: "0", // 기본값
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div
            className="spinner-border inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent"
            role="status"
          >
            <span className="sr-only">로딩중...</span>
          </div>
          <p className="mt-2 text-gray-600">데이터를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-10">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">새 계약 등록</h1>
          <p className="text-gray-600 mt-1">새로운 계약 정보를 입력하세요.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-lg shadow overflow-hidden p-6">
          <h2 className="text-lg font-medium text-gray-800 mb-4">일정 선택</h2>
          <div>
            <label
              htmlFor="scheduleId"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              일정 <span className="text-red-500">*</span>
            </label>
            <select
              id="scheduleId"
              name="scheduleId"
              value={formData.scheduleId || ""}
              onChange={handleScheduleChange}
              className={`w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 ${
                errors.scheduleId ? "border-red-500" : ""
              }`}
            >
              <option value="">일정을 선택하세요</option>
              {schedules
                .filter((schedule) => !schedule.status.includes("cancelled"))
                .map((schedule) => (
                  <option key={schedule.id} value={schedule.id}>
                    {schedule.eventTitle} - {schedule.eventDate.split("T")[0]} (
                    {schedule.customerName})
                  </option>
                ))}
            </select>
            {errors.scheduleId && (
              <p className="mt-1 text-sm text-red-600">{errors.scheduleId}</p>
            )}
          </div>
        </div>

        {selectedSchedule && (
          <>
            <div className="bg-white rounded-lg shadow overflow-hidden p-6">
              <h2 className="text-lg font-medium text-gray-800 mb-4">
                기본 정보
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="eventTitle"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    이벤트명 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="eventTitle"
                    name="eventTitle"
                    value={formData.eventTitle || ""}
                    onChange={handleChange}
                    className={`w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 ${
                      errors.eventTitle ? "border-red-500" : ""
                    }`}
                  />
                  {errors.eventTitle && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.eventTitle}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="eventDate"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    이벤트 날짜 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    id="eventDate"
                    name="eventDate"
                    value={formatDateForInput(formData.eventDate || "")}
                    onChange={handleChange}
                    className={`w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 ${
                      errors.eventDate ? "border-red-500" : ""
                    }`}
                  />
                  {errors.eventDate && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.eventDate}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="venue"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    장소 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="venue"
                    name="venue"
                    value={formData.venue || ""}
                    onChange={handleChange}
                    className={`w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 ${
                      errors.venue ? "border-red-500" : ""
                    }`}
                  />
                  {errors.venue && (
                    <p className="mt-1 text-sm text-red-600">{errors.venue}</p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="contractAmount"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    계약 금액 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="contractAmount"
                    name="contractAmount"
                    placeholder="예: 1000000"
                    value={formData.contractAmount || ""}
                    onChange={handleChange}
                    className={`w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 ${
                      errors.contractAmount ? "border-red-500" : ""
                    }`}
                  />
                  {errors.contractAmount && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.contractAmount}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="contractStatus"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    계약 상태
                  </label>
                  <select
                    id="contractStatus"
                    name="contractStatus"
                    value={formData.contractStatus || "draft"}
                    onChange={handleChange}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                  >
                    <option value="draft">초안</option>
                    <option value="sent">전송됨</option>
                    <option value="signed">서명됨</option>
                    <option value="completed">완료</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="paymentStatus"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    결제 상태
                  </label>
                  <select
                    id="paymentStatus"
                    name="paymentStatus"
                    value={formData.paymentStatus || "unpaid"}
                    onChange={handleChange}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                  >
                    <option value="unpaid">미결제</option>
                    <option value="partial">부분결제</option>
                    <option value="paid">결제완료</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden p-6">
              <h2 className="text-lg font-medium text-gray-800 mb-4">
                고객 정보
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="customerName"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    고객명
                  </label>
                  <input
                    type="text"
                    id="customerName"
                    name="customerName"
                    value={formData.customerName || ""}
                    readOnly
                    className="w-full rounded-md border-gray-300 shadow-sm bg-gray-50"
                  />
                </div>

                <div>
                  <label
                    htmlFor="customerCompany"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    회사
                  </label>
                  <input
                    type="text"
                    id="customerCompany"
                    name="customerCompany"
                    value={formData.customerCompany || ""}
                    readOnly
                    className="w-full rounded-md border-gray-300 shadow-sm bg-gray-50"
                  />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden p-6">
              <h2 className="text-lg font-medium text-gray-800 mb-4">
                아티스트 정보
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="singerName"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    가수명
                  </label>
                  <input
                    type="text"
                    id="singerName"
                    name="singerName"
                    value={formData.singerName || ""}
                    readOnly
                    className="w-full rounded-md border-gray-300 shadow-sm bg-gray-50"
                  />
                </div>

                <div>
                  <label
                    htmlFor="singerAgency"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    소속사
                  </label>
                  <input
                    type="text"
                    id="singerAgency"
                    name="singerAgency"
                    value={formData.singerAgency || ""}
                    readOnly
                    className="w-full rounded-md border-gray-300 shadow-sm bg-gray-50"
                  />
                </div>
              </div>
            </div>
          </>
        )}

        <div className="flex justify-end space-x-2">
          <button
            type="button"
            onClick={handleCancel}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
          >
            취소
          </button>
          <button
            type="submit"
            disabled={saving || !selectedSchedule}
            className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50"
          >
            {saving ? "저장 중..." : "저장"}
          </button>
        </div>
      </form>
    </div>
  );
}
