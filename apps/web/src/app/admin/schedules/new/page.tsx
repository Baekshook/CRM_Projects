"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Schedule } from "@/types/scheduleTypes";
import { createSchedule, getAllSingers } from "@/services/schedulesApi";
import { Singer } from "@/types/scheduleTypes";
import customerApi, { Customer } from "@/services/customerApi";

export default function NewSchedulePage() {
  const router = useRouter();
  const [saving, setSaving] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [singers, setSingers] = useState<Singer[]>([]);
  const [formData, setFormData] = useState<Partial<Schedule>>({
    status: "scheduled",
    eventDate: new Date().toISOString().split("T")[0], // 오늘 날짜를 기본값으로
    startTime: "12:00",
    endTime: "15:00",
    scheduledDate: new Date().toISOString(),
    location: "",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });

  const [error, setError] = useState<string | null>(null);

  // 고객 및 가수 데이터 로드
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        // 고객 및 가수 데이터 가져오기
        const [customerData, singerData] = await Promise.all([
          customerApi.getAll(),
          getAllSingers(),
        ]);
        setCustomers(customerData);
        setSingers(singerData);
      } catch (err) {
        console.error("데이터 로딩 오류:", err);
        setError("고객 또는 가수 데이터를 불러오는데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

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

    // 고객 선택 시 관련 정보 자동 업데이트
    if (name === "customerId") {
      const selectedCustomer = customers.find((c) => c.id === value);
      if (selectedCustomer) {
        setFormData((prev) => ({
          ...prev,
          customerId: value,
          customerName: selectedCustomer.name,
          customerCompany: selectedCustomer.company || "",
        }));
      }
    }

    // 가수 선택 시 관련 정보 자동 업데이트
    if (name === "singerId") {
      const selectedSinger = singers.find((s) => s.id === value);
      if (selectedSinger) {
        setFormData((prev) => ({
          ...prev,
          singerId: value,
          singerName: selectedSinger.name,
          singerAgency: selectedSinger.agency || "",
        }));
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 필수 필드 검증
    const requiredFields = [
      "eventTitle",
      "customerId",
      "customerName",
      "singerId",
      "singerName",
      "eventDate",
      "venue",
      "details",
      "location",
    ];
    const missingFields = requiredFields.filter(
      (field) => !formData[field as keyof Partial<Schedule>]
    );

    if (missingFields.length > 0) {
      alert(`다음 필드를 입력해주세요: ${missingFields.join(", ")}`);
      return;
    }

    // 외래 키 검증
    if (!customers.find((c) => c.id === formData.customerId)) {
      alert("유효하지 않은 고객 ID입니다. 다시 고객을 선택해주세요.");
      return;
    }

    if (!singers.find((s) => s.id === formData.singerId)) {
      alert("유효하지 않은 가수 ID입니다. 다시 가수를 선택해주세요.");
      return;
    }

    try {
      setSaving(true);

      // 데이터 준비
      const scheduleData: Partial<Schedule> = {
        ...formData,
        // scheduledDate 필드를 날짜 형식으로 설정
        scheduledDate: new Date(formData.eventDate as string).toISOString(),

        // UUID 관련 필드를 null로 설정
        requestId: null,
        matchId: null,

        // 빈 문자열 필드 처리
        customerCompany: formData.customerCompany || "",
        singerAgency: formData.singerAgency || "",
        description: formData.description || "",
        startTime: formData.startTime || "12:00",
        endTime: formData.endTime || "15:00",

        // 선택적 필드에 기본값 설정
        status: formData.status || "scheduled",
      };

      console.log("전송할 데이터:", scheduleData);

      const newSchedule = await createSchedule(scheduleData);
      alert("새 일정이 등록되었습니다.");
      router.push(`/admin/schedules/${newSchedule.id}`);
    } catch (err: any) {
      console.error("일정 생성 오류:", err);

      // 에러 메시지 추출
      let errorMessage = "일정 등록에 실패했습니다.";
      if (err.response) {
        // 서버 응답이 있는 경우
        const responseData = err.response.data;

        if (responseData.message) {
          if (Array.isArray(responseData.message)) {
            errorMessage = `일정 등록 실패: ${responseData.message.join(", ")}`;
          } else {
            errorMessage = `일정 등록 실패: ${responseData.message}`;
          }
        } else if (responseData.error) {
          errorMessage = `일정 등록 실패: ${responseData.error}`;
        }

        // 외래 키 위반 오류에 대한 더 명확한 메시지
        if (errorMessage.includes("Foreign key constraint violation")) {
          errorMessage =
            "일정 등록 실패: 고객 또는 가수 정보가 데이터베이스에 존재하지 않습니다. 다시 선택해주세요.";
        }
      }

      alert(errorMessage);
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
                <div>
                  <label
                    htmlFor="location"
                    className="block text-sm font-medium text-gray-700"
                  >
                    주소 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    value={formData.location || ""}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                    placeholder="주소를 입력하세요"
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
                    htmlFor="customerId"
                    className="block text-sm font-medium text-gray-700"
                  >
                    고객 선택 <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="customerId"
                    name="customerId"
                    value={formData.customerId || ""}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                  >
                    <option value="">고객을 선택하세요</option>
                    {customers.map((customer) => (
                      <option key={customer.id} value={customer.id}>
                        {customer.name} - {customer.company || "소속 없음"}
                      </option>
                    ))}
                  </select>
                </div>
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
                    value={formData.customerName || ""}
                    onChange={handleChange}
                    readOnly
                    className="mt-1 block w-full rounded-md border-gray-300 bg-gray-100 shadow-sm"
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
                    readOnly
                    className="mt-1 block w-full rounded-md border-gray-300 bg-gray-100 shadow-sm"
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
                    htmlFor="singerId"
                    className="block text-sm font-medium text-gray-700"
                  >
                    가수 선택 <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="singerId"
                    name="singerId"
                    value={formData.singerId || ""}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                  >
                    <option value="">가수를 선택하세요</option>
                    {singers.map((singer) => (
                      <option key={singer.id} value={singer.id}>
                        {singer.name} - {singer.agency || "소속 없음"}
                      </option>
                    ))}
                  </select>
                </div>
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
                    value={formData.singerName || ""}
                    onChange={handleChange}
                    readOnly
                    className="mt-1 block w-full rounded-md border-gray-300 bg-gray-100 shadow-sm"
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
                    readOnly
                    className="mt-1 block w-full rounded-md border-gray-300 bg-gray-100 shadow-sm"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 요구사항 및 특이사항 */}
          <div className="mt-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              요구사항 및 특이사항 <span className="text-red-500">*</span>
            </h2>
            <div>
              <textarea
                id="details"
                name="details"
                rows={4}
                value={formData.details || ""}
                onChange={handleChange}
                required
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
