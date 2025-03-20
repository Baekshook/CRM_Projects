"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface Request {
  id: string;
  title: string;
  customerName: string;
  customerCompany: string;
  eventDate: string;
  venue: string;
  budget: string;
}

interface Singer {
  id: string;
  name: string;
  agency: string;
  rating: number;
}

export default function NewMatchPage() {
  const router = useRouter();
  const [requests, setRequests] = useState<Request[]>([]);
  const [singers, setSingers] = useState<Singer[]>([]);
  const [matchData, setMatchData] = useState({
    requestId: "",
    singerId: "",
    status: "pending",
    requirements: "",
  });

  // 요청서 목록 로드
  useEffect(() => {
    // 실제로는 API 호출로 처리
    const loadRequests = async () => {
      // 임시 데이터
      const dummyRequests = [
        {
          id: "REQ-001",
          title: "웨딩 축가",
          customerName: "김민수",
          customerCompany: "(주)이벤트 플래닝",
          eventDate: "2024-06-15",
          venue: "웨딩홀 A",
          budget: "5000000",
        },
        {
          id: "REQ-002",
          title: "기업 행사",
          customerName: "이지영",
          customerCompany: "웨딩 홀 A",
          eventDate: "2024-07-01",
          venue: "컨퍼런스 센터",
          budget: "8000000",
        },
      ];
      setRequests(dummyRequests);
    };
    loadRequests();
  }, []);

  // 가수 목록 로드
  useEffect(() => {
    // 실제로는 API 호출로 처리
    const loadSingers = async () => {
      // 임시 데이터
      const dummySingers = [
        {
          id: "SINGER-001",
          name: "가수 A",
          agency: "엔터테인먼트 A",
          rating: 4.8,
        },
        {
          id: "SINGER-002",
          name: "가수 B",
          agency: "엔터테인먼트 B",
          rating: 4.5,
        },
      ];
      setSingers(dummySingers);
    };
    loadSingers();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // API 호출로 처리
    alert("매칭이 등록되었습니다.");
    router.push("/admin/matches");
  };

  const handleCancel = () => {
    if (confirm("입력 중인 정보가 사라집니다. 취소하시겠습니까?")) {
      router.back();
    }
  };

  // 선택된 요청서 정보
  const selectedRequest = requests.find(
    (req) => req.id === matchData.requestId
  );

  return (
    <div className="pb-10">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">새 매칭 등록</h1>
        <p className="text-gray-600 mt-1">새로운 매칭을 등록하세요.</p>
      </div>

      <div className="bg-white rounded-lg shadow p-8">
        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            {/* 요청서 선택 */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                요청서 <span className="text-red-500">*</span>
              </label>
              <select
                value={matchData.requestId}
                onChange={(e) =>
                  setMatchData({ ...matchData, requestId: e.target.value })
                }
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-900 font-medium"
                required
              >
                <option value="">요청서를 선택하세요</option>
                {requests.map((request) => (
                  <option key={request.id} value={request.id}>
                    {request.title} - {request.customerName} (
                    {request.customerCompany})
                  </option>
                ))}
              </select>
            </div>

            {/* 선택된 요청서 정보 */}
            {selectedRequest && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-gray-700 mb-3">
                  요청서 정보
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">이벤트 날짜</p>
                    <p className="text-sm font-medium text-gray-900">
                      {selectedRequest.eventDate}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">장소</p>
                    <p className="text-sm font-medium text-gray-900">
                      {selectedRequest.venue}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">예산</p>
                    <p className="text-sm font-medium text-gray-900">
                      {Number(selectedRequest.budget).toLocaleString()}원
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* 가수 선택 */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                가수 <span className="text-red-500">*</span>
              </label>
              <select
                value={matchData.singerId}
                onChange={(e) =>
                  setMatchData({ ...matchData, singerId: e.target.value })
                }
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-900 font-medium"
                required
              >
                <option value="">가수를 선택하세요</option>
                {singers.map((singer) => (
                  <option key={singer.id} value={singer.id}>
                    {singer.name} ({singer.agency}) - 평점: {singer.rating}
                  </option>
                ))}
              </select>
            </div>

            {/* 상태 */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                상태 <span className="text-red-500">*</span>
              </label>
              <select
                value={matchData.status}
                onChange={(e) =>
                  setMatchData({ ...matchData, status: e.target.value })
                }
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-900 font-medium"
                required
              >
                <option value="pending">대기중</option>
                <option value="negotiating">협상중</option>
                <option value="confirmed">확정</option>
                <option value="cancelled">취소</option>
              </select>
            </div>

            {/* 요구사항 */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                요구사항
              </label>
              <textarea
                value={matchData.requirements}
                onChange={(e) =>
                  setMatchData({
                    ...matchData,
                    requirements: e.target.value,
                  })
                }
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-900 font-medium h-32 resize-none"
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
              className="px-6 py-2.5 bg-orange-600 text-white rounded-lg font-medium hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
            >
              등록
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
