"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  getRequestById,
  getAllCustomers,
  getAllSingers,
  updateRequest,
  Customer,
  Singer,
  Request,
} from "@/services/negotiationsApi";

export default function RequestEditPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const requestId = params.id;
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [singers, setSingers] = useState<Singer[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [requestData, setRequestData] = useState<any>({
    id: "",
    customerId: "",
    customerName: "",
    customerCompany: "",
    title: "",
    eventType: "",
    eventDate: "",
    eventTime: "",
    venue: "",
    budget: "",
    requirements: "",
    description: "",
    status: "",
    createdAt: "",
    singerId: "",
  });

  // 데이터 로드
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        // 데이터 병렬로 로드
        const [request, customersData, singersData] = await Promise.all([
          getRequestById(requestId),
          getAllCustomers(),
          getAllSingers(),
        ]);

        if (!request) {
          throw new Error("요청서를 찾을 수 없습니다.");
        }

        setRequestData({
          id: request.id,
          customerId: request.customerId,
          customerName: request.customerName || "",
          customerCompany: request.customerCompany || "",
          title: request.title || "",
          eventType: request.eventType || "",
          eventDate: request.eventDate
            ? new Date(request.eventDate).toISOString().split("T")[0]
            : "",
          eventTime: request.eventTime || "00:00",
          venue: request.venue || "",
          budget: request.budget || "",
          requirements: request.requirements || "",
          description: request.description || "",
          status: request.status || "pending",
          createdAt: request.createdAt,
          singerId: request.singerId || "",
        });

        setCustomers(customersData);
        setSingers(singersData);
      } catch (err: any) {
        console.error("데이터 로드 중 오류:", err);
        setError(
          err.message || "요청서 데이터를 불러오는 중 오류가 발생했습니다."
        );
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [requestId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);

      // 선택한 고객 정보 가져오기
      const selectedCustomer = customers.find(
        (c) => c.id === requestData.customerId
      );

      // 업데이트할 데이터 준비
      const updatedData = {
        ...requestData,
        customerName: selectedCustomer?.name || requestData.customerName,
        customerCompany:
          selectedCustomer?.company || requestData.customerCompany,
        updatedAt: new Date().toISOString(),
      };

      // API 호출로 요청서 업데이트
      await updateRequest(requestId, updatedData);

      alert("요청서가 수정되었습니다.");
      router.push(`/admin/requests/${requestId}`);
    } catch (err: any) {
      console.error("요청서 수정 중 오류:", err);
      setError(err.message || "요청서 수정에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (confirm("변경 사항이 저장되지 않을 수 있습니다. 취소하시겠습니까?")) {
      router.back();
    }
  };

  const handleCustomerChange = (customerId: string) => {
    const selectedCustomer = customers.find((c) => c.id === customerId);
    if (selectedCustomer) {
      setRequestData({
        ...requestData,
        customerId,
        customerName: selectedCustomer.name,
        customerCompany: selectedCustomer.company || "",
      });
    }
  };

  const handleSingerChange = (singerId: string) => {
    setRequestData({
      ...requestData,
      singerId: singerId || "",
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-800 p-4 mb-6 rounded-md">
        <p>{error}</p>
        <button
          onClick={() => router.back()}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
        >
          뒤로 가기
        </button>
      </div>
    );
  }

  return (
    <div className="pb-10">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">요청서 수정</h1>
        <p className="text-gray-600 mt-1">요청서 ID: {requestId}</p>
      </div>

      <div className="bg-white rounded-lg shadow p-8">
        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            {/* 제목 */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                제목 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={requestData.title}
                onChange={(e) =>
                  setRequestData({ ...requestData, title: e.target.value })
                }
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-900 font-medium"
                required
              />
            </div>

            {/* 고객 선택 */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                고객 <span className="text-red-500">*</span>
              </label>
              <select
                value={requestData.customerId}
                onChange={(e) => handleCustomerChange(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-900 font-medium"
                required
              >
                <option value="">고객을 선택하세요</option>
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
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                가수
              </label>
              <select
                value={requestData.singerId || ""}
                onChange={(e) => handleSingerChange(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-900 font-medium"
              >
                <option value="">가수를 선택하세요</option>
                {singers.map((singer) => (
                  <option key={singer.id} value={singer.id}>
                    {singer.name} {singer.agency ? `(${singer.agency})` : ""}
                  </option>
                ))}
              </select>
            </div>

            {/* 이벤트 유형 */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                이벤트 유형 <span className="text-red-500">*</span>
              </label>
              <select
                value={requestData.eventType}
                onChange={(e) =>
                  setRequestData({ ...requestData, eventType: e.target.value })
                }
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-900 font-medium"
                required
              >
                <option value="">이벤트 유형을 선택하세요</option>
                <option value="wedding">웨딩</option>
                <option value="corporate">기업 행사</option>
                <option value="festival">축제</option>
                <option value="concert">콘서트</option>
                <option value="other">기타</option>
              </select>
            </div>

            {/* 이벤트 날짜 */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                이벤트 날짜 <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={requestData.eventDate}
                onChange={(e) =>
                  setRequestData({ ...requestData, eventDate: e.target.value })
                }
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-900 font-medium"
                required
              />
            </div>

            {/* 이벤트 시간 */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                이벤트 시간 <span className="text-red-500">*</span>
              </label>
              <input
                type="time"
                value={requestData.eventTime}
                onChange={(e) =>
                  setRequestData({ ...requestData, eventTime: e.target.value })
                }
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-900 font-medium"
                required
              />
            </div>

            {/* 장소 */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                장소 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={requestData.venue}
                onChange={(e) =>
                  setRequestData({ ...requestData, venue: e.target.value })
                }
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-900 font-medium"
                required
              />
            </div>

            {/* 예산 */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                예산 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={requestData.budget}
                onChange={(e) =>
                  setRequestData({ ...requestData, budget: e.target.value })
                }
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-900 font-medium"
                required
                placeholder="예: 1,000,000"
              />
            </div>

            {/* 요구사항 */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                요구사항 <span className="text-red-500">*</span>
              </label>
              <textarea
                value={requestData.requirements}
                onChange={(e) =>
                  setRequestData({
                    ...requestData,
                    requirements: e.target.value,
                  })
                }
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-900 font-medium h-32 resize-none"
                required
              />
            </div>

            {/* 상세 설명 */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                상세 설명 <span className="text-red-500">*</span>
              </label>
              <textarea
                value={requestData.description}
                onChange={(e) =>
                  setRequestData({
                    ...requestData,
                    description: e.target.value,
                  })
                }
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-900 font-medium h-32 resize-none"
                required
              />
            </div>

            {/* 상태 */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                상태 <span className="text-red-500">*</span>
              </label>
              <select
                value={requestData.status}
                onChange={(e) =>
                  setRequestData({ ...requestData, status: e.target.value })
                }
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-900 font-medium"
                required
              >
                <option value="pending">대기중</option>
                <option value="in_progress">진행중</option>
                <option value="completed">완료</option>
                <option value="cancelled">취소</option>
              </select>
            </div>
          </div>

          {/* 버튼 */}
          <div className="flex justify-end space-x-3 pt-6 mt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={handleCancel}
              className="px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 bg-orange-600 text-white rounded-lg font-medium hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:bg-orange-300"
            >
              {loading ? "저장 중..." : "저장"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
