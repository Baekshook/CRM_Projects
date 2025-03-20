"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface Match {
  id: string;
  requestId: string;
  requestTitle: string;
  customerName: string;
  customerCompany: string;
  singerName: string;
  singerAgency: string;
  eventDate: string;
  venue: string;
  status: string;
  budget: string;
  requirements: string;
  createdAt: string;
}

export default function MatchEditPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const matchId = params.id;
  const [matchData, setMatchData] = useState<Match>({
    id: "",
    requestId: "",
    requestTitle: "",
    customerName: "",
    customerCompany: "",
    singerName: "",
    singerAgency: "",
    eventDate: "",
    venue: "",
    status: "",
    budget: "",
    requirements: "",
    createdAt: "",
  });

  useEffect(() => {
    // 실제로는 API 호출로 처리
    const loadMatch = async () => {
      // 임시 데이터
      const dummyMatch = {
        id: matchId,
        requestId: "REQ-001",
        requestTitle: "웨딩 축가",
        customerName: "김민수",
        customerCompany: "(주)이벤트 플래닝",
        singerName: "가수 A",
        singerAgency: "엔터테인먼트 A",
        eventDate: "2024-06-15",
        venue: "웨딩홀 A",
        status: "negotiating",
        budget: "5000000",
        requirements: "축가 2곡, 축하공연 30분",
        createdAt: "2024-03-20",
      };
      setMatchData(dummyMatch);
    };
    loadMatch();
  }, [matchId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // API 호출로 처리
    alert("매칭 정보가 수정되었습니다.");
    router.push("/admin/matches");
  };

  const handleCancel = () => {
    if (confirm("변경 사항이 저장되지 않을 수 있습니다. 취소하시겠습니까?")) {
      router.back();
    }
  };

  return (
    <div className="pb-10">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">매칭 정보 수정</h1>
        <p className="text-gray-600 mt-1">매칭 ID: {matchId}</p>
      </div>

      <div className="bg-white rounded-lg shadow p-8">
        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            {/* 요청서 정보 */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                요청서 제목 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={matchData.requestTitle}
                onChange={(e) =>
                  setMatchData({ ...matchData, requestTitle: e.target.value })
                }
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-900 font-medium"
                required
              />
            </div>

            {/* 고객 정보 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  고객명 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={matchData.customerName}
                  onChange={(e) =>
                    setMatchData({ ...matchData, customerName: e.target.value })
                  }
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-900 font-medium"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  회사명 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={matchData.customerCompany}
                  onChange={(e) =>
                    setMatchData({
                      ...matchData,
                      customerCompany: e.target.value,
                    })
                  }
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-900 font-medium"
                  required
                />
              </div>
            </div>

            {/* 가수 정보 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  가수명 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={matchData.singerName}
                  onChange={(e) =>
                    setMatchData({ ...matchData, singerName: e.target.value })
                  }
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-900 font-medium"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  소속사 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={matchData.singerAgency}
                  onChange={(e) =>
                    setMatchData({ ...matchData, singerAgency: e.target.value })
                  }
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-900 font-medium"
                  required
                />
              </div>
            </div>

            {/* 이벤트 정보 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  이벤트 날짜 <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={matchData.eventDate}
                  onChange={(e) =>
                    setMatchData({ ...matchData, eventDate: e.target.value })
                  }
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-900 font-medium"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  장소 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={matchData.venue}
                  onChange={(e) =>
                    setMatchData({ ...matchData, venue: e.target.value })
                  }
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-900 font-medium"
                  required
                />
              </div>
            </div>

            {/* 예산 및 상태 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  예산 <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={matchData.budget}
                  onChange={(e) =>
                    setMatchData({ ...matchData, budget: e.target.value })
                  }
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-900 font-medium"
                  required
                />
              </div>
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
              저장
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
