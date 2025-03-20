"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

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

interface NegotiationLog {
  id: string;
  date: string;
  type: string;
  content: string;
  user: string;
}

export default function MatchDetailPage() {
  const router = useRouter();
  const params = useParams();
  const matchId = params.id as string;

  const [match, setMatch] = useState<Match | null>(null);
  const [negotiationLogs, setNegotiationLogs] = useState<NegotiationLog[]>([]);
  const [newLog, setNewLog] = useState({
    type: "note",
    content: "",
  });

  useEffect(() => {
    // 실제로는 API 호출로 데이터를 가져옴
    const dummyMatch: Match = {
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

    const dummyLogs: NegotiationLog[] = [
      {
        id: "LOG-001",
        date: "2024-03-20 14:30",
        type: "price",
        content: "가격 협상: 5,000,000원 → 4,800,000원",
        user: "관리자",
      },
      {
        id: "LOG-002",
        date: "2024-03-19 11:20",
        type: "note",
        content: "고객과 통화 완료. 축가 2곡으로 확정",
        user: "관리자",
      },
    ];

    setMatch(dummyMatch);
    setNegotiationLogs(dummyLogs);
  }, [matchId]);

  const handleAddLog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLog.content.trim()) return;

    const log: NegotiationLog = {
      id: `LOG-${negotiationLogs.length + 1}`,
      date: new Date().toLocaleString(),
      type: newLog.type,
      content: newLog.content,
      user: "관리자",
    };

    setNegotiationLogs([log, ...negotiationLogs]);
    setNewLog({ type: "note", content: "" });
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "negotiating":
        return "bg-blue-100 text-blue-800";
      case "confirmed":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "pending":
        return "대기중";
      case "negotiating":
        return "협상중";
      case "confirmed":
        return "확정";
      case "cancelled":
        return "취소";
      default:
        return status;
    }
  };

  if (!match) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div>
      {/* 페이지 헤더 */}
      <div className="mb-6">
        <div className="flex items-center mb-2">
          <Link
            href="/admin/matches"
            className="text-gray-500 hover:text-gray-700 mr-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
          </Link>
          <h1 className="text-2xl font-bold text-gray-800">매칭 상세</h1>
        </div>
        <div className="flex justify-between items-center">
          <p className="text-gray-600">
            매칭 번호: {match.id} | 등록일: {match.createdAt}
          </p>
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBadgeClass(
              match.status
            )}`}
          >
            {getStatusText(match.status)}
          </span>
        </div>
      </div>

      {/* 매칭 정보 */}
      <div className="bg-white rounded-lg shadow overflow-hidden mb-6">
        <div className="p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            {match.requestTitle}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">
                고객 정보
              </h3>
              <p className="text-gray-900">{match.customerName}</p>
              <p className="text-gray-500">{match.customerCompany}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">
                가수 정보
              </h3>
              <p className="text-gray-900">{match.singerName}</p>
              <p className="text-gray-500">{match.singerAgency}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">
                이벤트 날짜
              </h3>
              <p className="text-gray-900">{match.eventDate}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">장소</h3>
              <p className="text-gray-900">{match.venue}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">예산</h3>
              <p className="text-gray-900">
                {Number(match.budget).toLocaleString()}원
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">
                요청서 번호
              </h3>
              <p className="text-gray-900">{match.requestId}</p>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-500 mb-1">요구사항</h3>
            <p className="text-gray-900 whitespace-pre-line">
              {match.requirements}
            </p>
          </div>
        </div>
      </div>

      {/* 협상 이력 */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">협상 이력</h2>

          {/* 새 협상 이력 추가 */}
          <form onSubmit={handleAddLog} className="mb-6">
            <div className="flex space-x-4">
              <div className="flex-1">
                <select
                  value={newLog.type}
                  onChange={(e) =>
                    setNewLog({ ...newLog, type: e.target.value })
                  }
                  className="w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="note">메모</option>
                  <option value="price">가격 협상</option>
                  <option value="schedule">일정 협상</option>
                  <option value="other">기타</option>
                </select>
              </div>
              <div className="flex-1">
                <input
                  type="text"
                  value={newLog.content}
                  onChange={(e) =>
                    setNewLog({ ...newLog, content: e.target.value })
                  }
                  className="w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="협상 내용을 입력하세요"
                />
              </div>
              <button
                type="submit"
                className="bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded-md"
              >
                추가
              </button>
            </div>
          </form>

          {/* 협상 이력 목록 */}
          <div className="space-y-4">
            {negotiationLogs.map((log) => (
              <div
                key={log.id}
                className="border-l-4 border-gray-300 pl-4 py-2"
              >
                <div className="flex items-center justify-between">
                  <p className="text-gray-900">{log.content}</p>
                  <span className="text-sm text-gray-500">{log.date}</span>
                </div>
                <p className="text-sm text-gray-500 mt-1">처리자: {log.user}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
