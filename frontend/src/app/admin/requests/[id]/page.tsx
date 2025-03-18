"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

// 요청서 타입 정의
interface Request {
  id: string;
  title: string;
  customer: string;
  date: string;
  status: string;
  budget: string;
  location: string;
  attendees: number;
  details?: string;
}

// 가수 후보 타입 정의
interface SingerCandidate {
  id: string;
  name: string;
  agency: string;
  rating: number;
  price: string;
  status: string;
}

// 로그 타입 정의
interface Log {
  id: string;
  date: string;
  action: string;
  user: string;
}

export default function RequestDetailPage() {
  const router = useRouter();
  const params = useParams();
  const requestId = params.id as string;

  // 상태
  const [request, setRequest] = useState<Request | null>(null);
  const [singerCandidates, setSingerCandidates] = useState<SingerCandidate[]>(
    []
  );
  const [logs, setLogs] = useState<Log[]>([]);
  const [activeTab, setActiveTab] = useState<string>("details");
  const [statusOptions] = useState<string[]>([
    "요청중",
    "검토중",
    "협상 진행",
    "견적 완료",
    "취소",
  ]);
  const [newStatus, setNewStatus] = useState<string>("");
  const [comment, setComment] = useState<string>("");

  // 샘플 요청서 데이터
  const sampleRequests: Request[] = [
    {
      id: "REQ-001",
      title: "2023 연말 기업 행사",
      customer: "(주)이벤트 플래닝",
      date: "2023-11-15",
      status: "협상 진행",
      budget: "5,000,000원",
      location: "서울 강남구 삼성동",
      attendees: 150,
      details:
        "연말 기업 행사로, 직원들을 위한 공연이 필요합니다. 가요, 댄스 등 다양한 장르의 공연을 원합니다. 행사 시간은 약 2시간이며, 사회자도 함께 요청합니다.",
    },
    {
      id: "REQ-002",
      title: "12월 결혼식 축가",
      customer: "웨딩 홀 A",
      date: "2023-11-14",
      status: "견적 완료",
      budget: "1,200,000원",
      location: "서울 서초구 반포동",
      attendees: 200,
      details:
        "결혼식 축가로 발라드 2곡을 요청합니다. 신랑 신부 입장 시와 케이크 커팅 시간에 각각 한 곡씩 불러주시면 됩니다.",
    },
    {
      id: "REQ-003",
      title: "돌잔치 행사",
      customer: "김철수",
      date: "2023-11-13",
      status: "요청중",
      budget: "800,000원",
      location: "경기도 성남시 분당구",
      attendees: 50,
      details:
        "아이 돌잔치에 어린이들이 좋아하는 공연을 해주실 가수나 퍼포머를 찾고 있습니다. 약 30분 정도의 공연을 원합니다.",
    },
    {
      id: "REQ-004",
      title: "대학 축제 공연",
      customer: "대학 축제 위원회",
      date: "2023-11-12",
      status: "검토중",
      budget: "3,500,000원",
      location: "서울 관악구",
      attendees: 500,
      details:
        "대학 축제 메인 공연으로 인기 가수의 공연을 요청합니다. 약 1시간 정도의 공연이 필요하며, 학생들이 좋아하는 댄스 음악 위주로 구성해주세요.",
    },
  ];

  // 샘플 가수 후보 데이터
  const sampleSingerCandidates: SingerCandidate[] = [
    {
      id: "SINGER-001",
      name: "가수 A",
      agency: "엔터테인먼트 A",
      rating: 4.8,
      price: "3,000,000원",
      status: "견적 도착",
    },
    {
      id: "SINGER-002",
      name: "가수 B",
      agency: "엔터테인먼트 B",
      rating: 4.5,
      price: "2,800,000원",
      status: "협상 중",
    },
    {
      id: "SINGER-003",
      name: "가수 C",
      agency: "엔터테인먼트 C",
      rating: 4.2,
      price: "2,500,000원",
      status: "조회",
    },
  ];

  // 샘플 로그 데이터
  const sampleLogs: Log[] = [
    {
      id: "LOG-001",
      date: "2023-11-15 14:30",
      action: "상태 변경: 검토중 → 협상 진행",
      user: "관리자",
    },
    {
      id: "LOG-002",
      date: "2023-11-14 11:20",
      action: "가수 후보 추가: 가수 A, 가수 B, 가수 C",
      user: "관리자",
    },
    {
      id: "LOG-003",
      date: "2023-11-13 09:45",
      action: "요청서 검토 시작",
      user: "관리자",
    },
    {
      id: "LOG-004",
      date: "2023-11-12 16:10",
      action: "요청서 접수",
      user: "시스템",
    },
  ];

  // 요청서 데이터 로드
  useEffect(() => {
    // 실제 구현에서는 API 호출로 데이터를 가져옴
    const foundRequest = sampleRequests.find((req) => req.id === requestId);
    if (foundRequest) {
      setRequest(foundRequest);
      setNewStatus(foundRequest.status);
      // 가수 후보 및 로그 데이터 로드
      setSingerCandidates(sampleSingerCandidates);
      setLogs(sampleLogs);
    } else {
      // 요청서가 없으면 목록 페이지로 리다이렉트
      router.push("/admin/requests");
    }
  }, [requestId, router]);

  // 상태 변경 처리
  const handleStatusChange = () => {
    if (request && newStatus && newStatus !== request.status) {
      // 실제 구현에서는 API 호출로 상태 업데이트
      setRequest({ ...request, status: newStatus });

      // 로그에 상태 변경 기록 추가
      const newLog: Log = {
        id: `LOG-${logs.length + 1}`,
        date: new Date().toLocaleString(),
        action: `상태 변경: ${request.status} → ${newStatus}`,
        user: "관리자",
      };
      setLogs([newLog, ...logs]);

      // 코멘트가 있으면 로그에 추가
      if (comment.trim()) {
        const commentLog: Log = {
          id: `LOG-${logs.length + 2}`,
          date: new Date().toLocaleString(),
          action: `코멘트 추가: ${comment}`,
          user: "관리자",
        };
        setLogs([commentLog, ...logs]);
        setComment("");
      }
    }
  };

  // 상태에 따른 배지 색상
  const getStatusColor = (status: string) => {
    switch (status) {
      case "요청중":
        return "bg-blue-100 text-blue-800";
      case "검토중":
        return "bg-yellow-100 text-yellow-800";
      case "협상 진행":
        return "bg-purple-100 text-purple-800";
      case "견적 완료":
        return "bg-green-100 text-green-800";
      case "취소":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // 가수 후보 상태에 따른 배지 색상
  const getSingerStatusColor = (status: string) => {
    switch (status) {
      case "조회":
        return "bg-gray-100 text-gray-800";
      case "견적 도착 전":
        return "bg-blue-100 text-blue-800";
      case "견적 도착":
        return "bg-green-100 text-green-800";
      case "협상 중":
        return "bg-purple-100 text-purple-800";
      case "최종 확정":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (!request) {
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
            href="/admin/requests"
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
          <h1 className="text-2xl font-bold text-gray-800">요청서 상세</h1>
        </div>
        <div className="flex justify-between items-center">
          <p className="text-gray-600">
            요청 번호: {request.id} | 제출일: {request.date}
          </p>
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
              request.status
            )}`}
          >
            {request.status}
          </span>
        </div>
      </div>

      {/* 탭 메뉴 */}
      <div className="mb-6 border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === "details"
                ? "border-orange-500 text-orange-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
            onClick={() => setActiveTab("details")}
          >
            요청서 정보
          </button>
          <button
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === "singers"
                ? "border-orange-500 text-orange-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
            onClick={() => setActiveTab("singers")}
          >
            가수 후보 ({singerCandidates.length})
          </button>
          <button
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === "logs"
                ? "border-orange-500 text-orange-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
            onClick={() => setActiveTab("logs")}
          >
            변경 이력
          </button>
        </nav>
      </div>

      {/* 요청서 정보 탭 */}
      {activeTab === "details" && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              {request.title}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">
                  고객 정보
                </h3>
                <p className="text-gray-900">{request.customer}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">예산</h3>
                <p className="text-gray-900">{request.budget}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">
                  행사 장소
                </h3>
                <p className="text-gray-900">{request.location}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">
                  참석 인원
                </h3>
                <p className="text-gray-900">{request.attendees}명</p>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-500 mb-1">
                상세 내용
              </h3>
              <p className="text-gray-900 whitespace-pre-line">
                {request.details}
              </p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-gray-700 mb-3">
                상태 변경
              </h3>
              <div className="flex items-end space-x-4">
                <div className="flex-1">
                  <label
                    htmlFor="status"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    상태
                  </label>
                  <select
                    id="status"
                    className="w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                  >
                    {statusOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex-1">
                  <label
                    htmlFor="comment"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    코멘트 (선택)
                  </label>
                  <input
                    type="text"
                    id="comment"
                    className="w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="상태 변경에 대한 코멘트"
                  />
                </div>
                <button
                  className="bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded-md"
                  onClick={handleStatusChange}
                >
                  변경
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 가수 후보 탭 */}
      {activeTab === "singers" && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-gray-800">
                가수 후보 목록
              </h2>
              <button className="bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded-md">
                가수 추가
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      가수명
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      소속사
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      평점
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      제안 금액
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      상태
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      액션
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {singerCandidates.map((singer) => (
                    <tr key={singer.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {singer.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {singer.agency}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex items-center">
                          <span className="text-yellow-500 mr-1">★</span>
                          {singer.rating.toFixed(1)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {singer.price}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getSingerStatusColor(
                            singer.status
                          )}`}
                        >
                          {singer.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex space-x-2">
                          <button className="text-blue-600 hover:text-blue-800">
                            상세
                          </button>
                          <button className="text-green-600 hover:text-green-800">
                            협상
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 변경 이력 탭 */}
      {activeTab === "logs" && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-6">
            <h2 className="text-lg font-bold text-gray-800 mb-4">변경 이력</h2>

            <div className="space-y-4">
              {logs.map((log) => (
                <div
                  key={log.id}
                  className="border-l-4 border-gray-300 pl-4 py-2"
                >
                  <p className="text-gray-900">{log.action}</p>
                  <div className="flex text-sm text-gray-500 mt-1">
                    <p>{log.date}</p>
                    <p className="ml-4">처리자: {log.user}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
