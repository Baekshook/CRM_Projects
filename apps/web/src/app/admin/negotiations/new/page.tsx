"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  createNegotiation,
  getAllCustomers,
  getAllSingers,
  getAllRequests,
  Customer,
  Singer,
  Request,
} from "@/services/negotiationsApi";

export default function NewNegotiationPage() {
  const router = useRouter();

  // 상태
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [singers, setSingers] = useState<Singer[]>([]);
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // 폼 데이터
  const [formData, setFormData] = useState({
    title: "",
    customerId: "",
    singerId: "",
    requestId: "",
    initialAmount: "",
    finalAmount: "",
    eventDate: "",
    eventLocation: "",
    requirements: "",
    notes: "",
    status: "pending",
  });

  // 데이터 로드
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        // 고객, 가수, 요청서 데이터를 병렬로 로드
        const [customersData, singersData, requestsData] = await Promise.all([
          getAllCustomers(),
          getAllSingers(),
          getAllRequests(),
        ]);

        setCustomers(customersData);
        setSingers(singersData);
        setRequests(requestsData);
      } catch (err) {
        console.error("데이터 로드 중 오류:", err);
        setError("데이터를 불러오는 중 오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // 요청서 선택 시 데이터 자동 채우기
  const handleRequestChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const requestId = e.target.value;

    if (!requestId) {
      return;
    }

    const selectedRequest = requests.find((req) => req.id === requestId);
    if (selectedRequest) {
      setFormData({
        ...formData,
        requestId,
        title: selectedRequest.title || formData.title,
        customerId: selectedRequest.customerId || formData.customerId,
        eventDate: selectedRequest.eventDate || formData.eventDate,
        eventLocation: selectedRequest.venue || formData.eventLocation,
        requirements: selectedRequest.requirements || formData.requirements,
        initialAmount:
          String(selectedRequest.budget || "") || formData.initialAmount,
      });
    }
  };

  // 폼 입력 처리
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // 폼 제출 처리
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setSubmitting(true);
      setError(null);

      // 필수 필드 검증
      if (!formData.title || !formData.customerId || !formData.status) {
        setError("제목, 고객, 상태는 필수 항목입니다.");
        setSubmitting(false);
        return;
      }

      // 금액 검증 (PostgreSQL int 타입의 최대값은 약 21억)
      const MAX_INT_VALUE = 2147483647;
      const initialAmount = formData.initialAmount
        ? Number(formData.initialAmount)
        : undefined;
      const finalAmount = formData.finalAmount
        ? Number(formData.finalAmount)
        : undefined;

      if (
        initialAmount &&
        (isNaN(initialAmount) || initialAmount > MAX_INT_VALUE)
      ) {
        setError("초기 견적 금액이 너무 큽니다. 21억 원 이하로 입력해주세요.");
        setSubmitting(false);
        return;
      }

      if (finalAmount && (isNaN(finalAmount) || finalAmount > MAX_INT_VALUE)) {
        setError("최종 계약 금액이 너무 큽니다. 21억 원 이하로 입력해주세요.");
        setSubmitting(false);
        return;
      }

      // 숫자 필드 변환
      const negotiationData = {
        ...formData,
        initialAmount: initialAmount,
        finalAmount: finalAmount,
        // isUrgent 필드에 기본값 추가
        isUrgent: false,
      };

      console.log("서버로 전송될 데이터:", negotiationData);

      // API 호출로 새 협상 등록
      const result = await createNegotiation(negotiationData);

      alert("협상이 등록되었습니다.");
      router.push(`/admin/negotiations/${result.id}`);
    } catch (err) {
      console.error("협상 등록 중 오류:", err);
      setError("협상 등록에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="pb-10">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-black">새 협상 등록</h1>
          <p className="text-black mt-1">새로운 협상 정보를 등록합니다.</p>
        </div>
        <Link
          href="/admin/negotiations"
          className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
        >
          목록으로
        </Link>
      </div>

      {/* 로딩 중 표시 */}
      {loading ? (
        <div className="flex justify-center items-center p-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
            <p className="text-gray-600">데이터를 불러오는 중입니다...</p>
          </div>
        </div>
      ) : (
        <div className="bg-white shadow rounded-lg p-6">
          {/* 에러 메시지 */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-800 p-4 mb-6 rounded-md">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-red-500"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">
                    오류가 발생했습니다
                  </h3>
                  <p className="mt-1 text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* 기존 요청서 선택 필드 */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  기존 요청서 선택 (선택사항)
                </label>
                <select
                  name="requestId"
                  value={formData.requestId}
                  onChange={handleRequestChange}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                >
                  <option value="">직접 입력</option>
                  {requests.map((request) => (
                    <option key={request.id} value={request.id}>
                      {request.title} -{" "}
                      {request.customer?.name || "고객 정보 없음"}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  기존 요청서를 선택하면 관련 정보가 자동으로 입력됩니다.
                </p>
              </div>

              {/* 제목 */}
              <div className="md:col-span-2">
                <label
                  htmlFor="title"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  제목 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                  placeholder="협상 제목을 입력하세요"
                />
              </div>

              {/* 고객 선택 */}
              <div>
                <label
                  htmlFor="customerId"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  고객 <span className="text-red-500">*</span>
                </label>
                <select
                  id="customerId"
                  name="customerId"
                  value={formData.customerId}
                  onChange={handleChange}
                  required
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                >
                  <option value="">고객 선택</option>
                  {customers.map((customer) => (
                    <option key={customer.id} value={customer.id}>
                      {customer.name}{" "}
                      {customer.company ? `(${customer.company})` : ""}
                    </option>
                  ))}
                </select>
              </div>

              {/* 가수 선택 */}
              <div>
                <label
                  htmlFor="singerId"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  가수
                </label>
                <select
                  id="singerId"
                  name="singerId"
                  value={formData.singerId}
                  onChange={handleChange}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                >
                  <option value="">가수 선택</option>
                  {singers.map((singer) => (
                    <option key={singer.id} value={singer.id}>
                      {singer.name} {singer.agency ? `(${singer.agency})` : ""}
                    </option>
                  ))}
                </select>
              </div>

              {/* 초기 금액 */}
              <div>
                <label
                  htmlFor="initialAmount"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  초기 견적 금액
                </label>
                <input
                  type="number"
                  id="initialAmount"
                  name="initialAmount"
                  value={formData.initialAmount}
                  onChange={handleChange}
                  max={2147483647}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                  placeholder="예: 1000000"
                />
                <p className="text-xs text-gray-500 mt-1">
                  최대 21억 원까지 입력 가능합니다.
                </p>
              </div>

              {/* 최종 금액 */}
              <div>
                <label
                  htmlFor="finalAmount"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  최종 계약 금액
                </label>
                <input
                  type="number"
                  id="finalAmount"
                  name="finalAmount"
                  value={formData.finalAmount}
                  onChange={handleChange}
                  max={2147483647}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                  placeholder="아직 협상 중이면 비워두세요"
                />
                <p className="text-xs text-gray-500 mt-1">
                  최대 21억 원까지 입력 가능합니다.
                </p>
              </div>

              {/* 이벤트 일자 */}
              <div>
                <label
                  htmlFor="eventDate"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  이벤트 날짜
                </label>
                <input
                  type="date"
                  id="eventDate"
                  name="eventDate"
                  value={formData.eventDate}
                  onChange={handleChange}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                />
              </div>

              {/* 이벤트 장소 */}
              <div>
                <label
                  htmlFor="eventLocation"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  이벤트 장소
                </label>
                <input
                  type="text"
                  id="eventLocation"
                  name="eventLocation"
                  value={formData.eventLocation}
                  onChange={handleChange}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                  placeholder="이벤트가 열릴 장소"
                />
              </div>

              {/* 상태 */}
              <div>
                <label
                  htmlFor="status"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  상태 <span className="text-red-500">*</span>
                </label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  required
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                >
                  <option value="pending">견적 검토</option>
                  <option value="in-progress">협상 중</option>
                  <option value="final-quote">최종 견적서</option>
                  <option value="completed">완료</option>
                  <option value="cancelled">취소</option>
                </select>
              </div>

              {/* 요구사항 */}
              <div className="md:col-span-2">
                <label
                  htmlFor="requirements"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  요구사항
                </label>
                <textarea
                  id="requirements"
                  name="requirements"
                  value={formData.requirements}
                  onChange={handleChange}
                  rows={4}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                  placeholder="고객의 요구사항이나 특별 요청사항"
                ></textarea>
              </div>

              {/* 메모 */}
              <div className="md:col-span-2">
                <label
                  htmlFor="notes"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  메모
                </label>
                <textarea
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  rows={4}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                  placeholder="내부 메모나 참고사항"
                ></textarea>
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <Link
                href="/admin/negotiations"
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              >
                취소
              </Link>
              <button
                type="submit"
                disabled={submitting}
                className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:bg-orange-300"
              >
                {submitting ? "등록 중..." : "협상 등록"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
