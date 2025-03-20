"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  requests as dummyRequests,
  customers as dummyCustomers,
  singers as dummySingers,
  Customer,
} from "@/utils/dummyData";

interface Request {
  id: string;
  customerId: string;
  customerName: string;
  customerCompany: string;
  title: string;
  eventType: string;
  eventDate: string;
  venue: string;
  budget: string;
  requirements: string;
  status: string;
  createdAt: string;
  singerId?: string;
  singerName?: string;
}

export default function RequestEditPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const requestId = params.id;
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [singers, setSingers] = useState<any[]>([]);
  const [requestData, setRequestData] = useState<Request>({
    id: "",
    customerId: "",
    customerName: "",
    customerCompany: "",
    title: "",
    eventType: "",
    eventDate: "",
    venue: "",
    budget: "",
    requirements: "",
    status: "",
    createdAt: "",
    singerId: "",
    singerName: "",
  });

  // 고객 목록 로드
  useEffect(() => {
    setCustomers(dummyCustomers);
    setSingers(dummySingers);
  }, []);

  // 요청서 데이터 로드
  useEffect(() => {
    const foundRequest = dummyRequests.find((req) => req.id === requestId);

    if (foundRequest) {
      setRequestData({
        id: foundRequest.id,
        customerId: foundRequest.customerId,
        customerName: foundRequest.customerName,
        customerCompany: foundRequest.customerCompany,
        title: foundRequest.title || "",
        eventType: foundRequest.eventType,
        eventDate: foundRequest.eventDate,
        venue: foundRequest.venue,
        budget: foundRequest.budget,
        requirements: foundRequest.requirements || "",
        status: foundRequest.status,
        createdAt: foundRequest.createdAt,
        singerId: foundRequest.singerId || "",
        singerName: foundRequest.singerName || "",
      });
    } else {
      // 요청서를 찾을 수 없으면 목록 페이지로 리다이렉트
      alert("요청서를 찾을 수 없습니다.");
      router.push("/admin/requests");
    }
  }, [requestId, router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // API 호출로 처리
    alert("요청서가 수정되었습니다.");
    router.push("/admin/requests");
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
    const selectedSinger = singers.find((s) => s.id === singerId);
    if (selectedSinger) {
      setRequestData({
        ...requestData,
        singerId,
        singerName: selectedSinger.name,
      });
    } else {
      setRequestData({
        ...requestData,
        singerId: "",
        singerName: "",
      });
    }
  };

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
                    {customer.name} ({customer.company})
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
                    {singer.name} ({singer.agency})
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
                <option value="웨딩">웨딩</option>
                <option value="기업 행사">기업 행사</option>
                <option value="축제">축제</option>
                <option value="콘서트">콘서트</option>
                <option value="기타">기타</option>
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
                type="number"
                value={requestData.budget}
                onChange={(e) =>
                  setRequestData({ ...requestData, budget: e.target.value })
                }
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-900 font-medium"
                required
              />
            </div>

            {/* 요구사항 */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                요구사항
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
              className="px-6 py-2.5 bg-orange-600 text-white rounded-lg font-medium hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
            >
              저장
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
