"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  getAllCustomers,
  getAllSingers,
  createRequest,
} from "@/services/negotiationsApi";
import { Customer, Singer } from "@/services/negotiationsApi";

export default function NewRequestPage() {
  const router = useRouter();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [singers, setSingers] = useState<Singer[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [requestData, setRequestData] = useState({
    customerId: "",
    singerId: "",
    title: "",
    eventType: "",
    eventDate: "",
    eventTime: "",
    venue: "",
    budget: "",
    requirements: "요청 사항 없음",
    description: "추가 세부 사항 없음",
    status: "pending",
  });

  // 고객 및 가수 목록 로드
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        // 데이터 병렬로 로드
        const [customersData, singersData] = await Promise.all([
          getAllCustomers(),
          getAllSingers(),
        ]);

        setCustomers(customersData);
        setSingers(singersData);
      } catch (err) {
        console.error("데이터 로드 중 오류:", err);
        setError("데이터를 가져오는 중 오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // 고객 ID로 고객 정보 찾기
  const getCustomerInfo = (customerId: string) => {
    const customer = customers.find((c) => c.id === customerId);
    return {
      name: customer?.name || "",
      company: customer?.company || "정보 없음",
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);

      // 선택한 고객 정보 가져오기
      const customerInfo = getCustomerInfo(requestData.customerId);

      // 서버에서 요구하는 형식으로 데이터 변환
      const requestPayload = {
        customerId: requestData.customerId,
        customerName: customerInfo.name,
        customerCompany: customerInfo.company,
        singerId: requestData.singerId || null,
        title: requestData.title,
        eventType: requestData.eventType,
        eventDate: new Date(requestData.eventDate).toISOString().split("T")[0],
        eventTime: requestData.eventTime || "00:00",
        venue: requestData.venue,
        budget: requestData.budget,
        status: "pending",
        requirements: requestData.requirements || "요청 사항 없음",
        description: requestData.description || "추가 세부 사항 없음",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      console.log("요청 페이로드:", requestPayload); // 디버깅용

      const result = await createRequest(requestPayload);

      if (result && result.id) {
        alert("견적 요청이 등록되었습니다.");
        router.push("/admin/requests");
      } else {
        throw new Error("요청 등록 중 오류가 발생했습니다");
      }
    } catch (err: any) {
      console.error("요청서 등록 중 오류:", err);
      setError("요청서 등록에 실패했습니다. " + (err.message || ""));
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (confirm("입력 중인 정보가 사라집니다. 취소하시겠습니까?")) {
      router.back();
    }
  };

  return (
    <div className="pb-10">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">새 견적 요청</h1>
        <p className="text-gray-600 mt-1">새로운 견적 요청을 등록하세요.</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 p-4 mb-6 rounded-md">
          <p>{error}</p>
        </div>
      )}

      <div className="bg-white rounded-lg shadow p-8">
        {loading && !error ? (
          <div className="flex justify-center items-center p-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
          </div>
        ) : (
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
                  onChange={(e) =>
                    setRequestData({
                      ...requestData,
                      customerId: e.target.value,
                    })
                  }
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
                  value={requestData.singerId}
                  onChange={(e) =>
                    setRequestData({
                      ...requestData,
                      singerId: e.target.value,
                    })
                  }
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-900 font-medium"
                >
                  <option value="">가수를 선택하세요 (선택사항)</option>
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
                    setRequestData({
                      ...requestData,
                      eventType: e.target.value,
                    })
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
                    setRequestData({
                      ...requestData,
                      eventDate: e.target.value,
                    })
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
                    setRequestData({
                      ...requestData,
                      eventTime: e.target.value,
                    })
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
                  placeholder="예: 1,000,000"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-900 font-medium"
                  required
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
                  placeholder="요구사항을 입력하세요"
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
                  placeholder="행사 관련 추가 설명을 입력하세요"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-900 font-medium h-32 resize-none"
                  required
                />
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
                {loading ? "등록 중..." : "등록"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
