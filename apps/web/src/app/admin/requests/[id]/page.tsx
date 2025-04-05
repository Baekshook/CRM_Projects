"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  getRequestById,
  getAllSingers,
  updateRequest,
  addNegotiationLog,
  Request,
  Singer,
  getSingerCandidatesByRequestId,
  getRequestLogs,
  addRequestLog,
  SingerCandidate as APISingerCandidate,
  RequestLog,
  addSingerCandidate,
  updateSingerCandidateStatus,
} from "@/services/negotiationsApi";

// 로그 타입 정의
interface Log {
  id: string;
  date: string;
  action: string;
  user: string;
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

export default function RequestDetailPage() {
  const router = useRouter();
  const params = useParams();
  const requestId = params.id as string;

  // 상태
  const [request, setRequest] = useState<Request | null>(null);
  const [singers, setSingers] = useState<Singer[]>([]);
  const [singerCandidates, setSingerCandidates] = useState<SingerCandidate[]>(
    []
  );
  const [logs, setLogs] = useState<Log[]>([]);
  const [activeTab, setActiveTab] = useState<string>("details");
  const [statusOptions] = useState<string[]>([
    "pending",
    "in_progress",
    "completed",
    "cancelled",
  ]);
  const [newStatus, setNewStatus] = useState<string>("");
  const [comment, setComment] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // 요청서 데이터 로드
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        // 데이터 병렬로 로드
        const [requestData, singersData, candidatesData, logsData] =
          await Promise.all([
            getRequestById(requestId),
            getAllSingers(),
            getSingerCandidatesByRequestId(requestId).catch(() => []), // 실패시 빈 배열 반환
            getRequestLogs(requestId).catch(() => []), // 실패시 빈 배열 반환
          ]);

        setRequest(requestData);
        setSingers(singersData);
        setNewStatus(requestData.status);

        // 가수 후보 데이터 설정
        if (candidatesData && candidatesData.length > 0) {
          // API에서 가져온 가수 후보 데이터 사용
          const formattedCandidates = candidatesData.map(
            (candidate: APISingerCandidate) => {
              const singerInfo =
                singersData.find((s: Singer) => s.id === candidate.singerId) ||
                {};
              return {
                id: candidate.id,
                name: singerInfo.name || "이름 없음",
                agency: singerInfo.agency || "-",
                rating: 4.0, // 기본 평점 값 사용
                price:
                  typeof candidate.price === "number"
                    ? `${candidate.price}원`
                    : candidate.price ||
                      `${(Math.floor(Math.random() * 300) + 100) * 10000}원`,
                status: candidate.status || "조회",
              };
            }
          );
          setSingerCandidates(formattedCandidates);
        } else {
          // API에서 데이터를 가져오지 못한 경우 샘플 데이터 사용
          const sampleSingerCandidates: SingerCandidate[] = singersData
            .slice(0, 3)
            .map((singer: Singer) => ({
              id: `sample-${singer.id}`,
              name: singer.name,
              agency: singer.agency || "-",
              rating: singer.rating || 4.5,
              price: `${(Math.floor(Math.random() * 300) + 100) * 10000}원`,
              status: ["조회", "견적 도착", "협상 중"][
                Math.floor(Math.random() * 3)
              ],
            }));
          setSingerCandidates(sampleSingerCandidates);
        }

        // 로그 데이터 설정
        if (logsData && logsData.length > 0) {
          // API에서 가져온 로그 데이터 사용
          const formattedLogs = logsData.map((log: RequestLog) => ({
            id: log.id,
            date: new Date(log.date || log.createdAt).toLocaleString(),
            action: log.action,
            user: log.user || "관리자",
          }));
          setLogs(formattedLogs);
        } else {
          // API에서 데이터를 가져오지 못한 경우 샘플 데이터 생성
          const sampleLogs: Log[] = [
            {
              id: "LOG-001",
              date: "2023-12-15 15:30:25",
              action: "요청서 등록",
              user: "관리자",
            },
            {
              id: "LOG-002",
              date: new Date().toLocaleString(),
              action: "요청서 조회",
              user: "관리자",
            },
          ];
          setLogs(sampleLogs);
        }
      } catch (err) {
        console.error("요청서 데이터 로드 중 오류:", err);
        setError("요청서 정보를 불러오지 못했습니다.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [requestId]);

  // 상태 변경 처리
  const handleStatusChange = async () => {
    if (request && newStatus && newStatus !== request.status) {
      try {
        setLoading(true);
        // API 호출로 상태 업데이트
        await updateRequest(requestId, { ...request, status: newStatus });

        // 요청서 상태 업데이트
        setRequest({ ...request, status: newStatus });

        // 로그에 상태 변경 기록 추가
        const newLogData = {
          requestId,
          date: new Date().toISOString(),
          action: `상태 변경: ${getStatusText(
            request.status
          )} → ${getStatusText(newStatus)}`,
          user: "관리자",
        };

        try {
          // API 호출로 로그 추가
          const addedLog = await addRequestLog(newLogData);

          const newLog: Log = {
            id: addedLog.id || `LOG-${Date.now()}`,
            date: new Date().toLocaleString(),
            action: newLogData.action,
            user: newLogData.user,
          };

          setLogs([newLog, ...logs]);
        } catch (logErr) {
          console.error("로그 추가 중 오류:", logErr);
          // 로컬에서만 로그 추가
          const newLog: Log = {
            id: `LOG-${Date.now()}`,
            date: new Date().toLocaleString(),
            action: newLogData.action,
            user: newLogData.user,
          };
          setLogs([newLog, ...logs]);
        }

        // 코멘트가 있으면 로그에 추가
        if (comment.trim()) {
          const commentLogData = {
            requestId,
            date: new Date().toISOString(),
            action: `코멘트 추가: ${comment}`,
            user: "관리자",
          };

          try {
            // API 호출로 코멘트 로그 추가
            const addedCommentLog = await addRequestLog(commentLogData);

            const commentLog: Log = {
              id: addedCommentLog.id || `LOG-${Date.now()}`,
              date: new Date().toLocaleString(),
              action: commentLogData.action,
              user: commentLogData.user,
            };

            setLogs([commentLog, ...logs]);
          } catch (logErr) {
            console.error("코멘트 로그 추가 중 오류:", logErr);
            // 로컬에서만 로그 추가
            const commentLog: Log = {
              id: `LOG-${Date.now()}`,
              date: new Date().toLocaleString(),
              action: commentLogData.action,
              user: commentLogData.user,
            };
            setLogs([commentLog, ...logs]);
          }

          setComment("");
        }
      } catch (err) {
        console.error("요청서 상태 변경 중 오류:", err);
        setError("요청서 상태를 변경하지 못했습니다.");
      } finally {
        setLoading(false);
      }
    }
  };

  // 상태에 따른 배지 색상
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "in_progress":
        return "bg-blue-100 text-blue-800";
      case "completed":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // 상태 텍스트 변환
  const getStatusText = (status: string) => {
    switch (status) {
      case "pending":
        return "대기중";
      case "in_progress":
        return "진행중";
      case "completed":
        return "완료";
      case "cancelled":
        return "취소";
      default:
        return status;
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

  // 날짜 포맷팅 함수
  const formatDate = (dateString: string) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString("ko-KR");
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-800 p-4 m-4 rounded-md">
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
    );
  }

  if (!request) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <p className="text-gray-500 mb-4">요청서를 찾을 수 없습니다.</p>
          <Link
            href="/admin/requests"
            className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
          >
            목록으로 돌아가기
          </Link>
        </div>
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
            요청 번호: {request.id} | 제출일: {formatDate(request.createdAt)}
          </p>
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBadgeClass(
              request.status
            )}`}
          >
            {getStatusText(request.status)}
          </span>
        </div>
      </div>

      {/* 탭 메뉴 */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === "details"
                ? "border-orange-500 text-orange-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
            onClick={() => setActiveTab("details")}
          >
            요청 상세
          </button>
          <button
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === "singers"
                ? "border-orange-500 text-orange-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
            onClick={() => setActiveTab("singers")}
          >
            가수 후보
          </button>
          <button
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === "logs"
                ? "border-orange-500 text-orange-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
            onClick={() => setActiveTab("logs")}
          >
            활동 로그
          </button>
        </nav>
      </div>

      {/* 요청 상세 탭 */}
      {activeTab === "details" && (
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-200 bg-gray-50">
            <h2 className="text-lg font-medium text-gray-900">요청 정보</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">제목</h3>
                <p className="text-base text-gray-900">{request.title}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">고객</h3>
                <p className="text-base text-gray-900">
                  {request.customer?.name || "-"}{" "}
                  {request.customer?.company
                    ? `(${request.customer.company})`
                    : ""}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">
                  이벤트 유형
                </h3>
                <p className="text-base text-gray-900">{request.eventType}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">
                  이벤트 날짜
                </h3>
                <p className="text-base text-gray-900">
                  {formatDate(request.eventDate)}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">장소</h3>
                <p className="text-base text-gray-900">{request.venue}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">예산</h3>
                <p className="text-base text-gray-900">{request.budget}</p>
              </div>
              <div className="md:col-span-2">
                <h3 className="text-sm font-medium text-gray-500 mb-1">
                  요구사항
                </h3>
                <p className="text-base text-gray-900">
                  {request.requirements || "요구사항이 없습니다."}
                </p>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-base font-medium text-gray-900 mb-4">
                상태 변경
              </h3>
              <div className="flex items-end space-x-4">
                <div className="w-1/3">
                  <label
                    htmlFor="status"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    상태 선택
                  </label>
                  <select
                    id="status"
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                  >
                    {statusOptions.map((status) => (
                      <option key={status} value={status}>
                        {getStatusText(status)}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="w-2/3">
                  <label
                    htmlFor="comment"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    코멘트 (선택)
                  </label>
                  <input
                    type="text"
                    id="comment"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                    placeholder="상태 변경 이유 등 코멘트를 남길 수 있습니다."
                  />
                </div>
                <button
                  type="button"
                  onClick={handleStatusChange}
                  disabled={request.status === newStatus || loading}
                  className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:bg-orange-300"
                >
                  {loading ? "변경 중..." : "상태 변경"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 가수 후보 탭 */}
      {activeTab === "singers" && (
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
            <h2 className="text-lg font-medium text-gray-900">
              가수 후보 목록
            </h2>
            <div className="flex space-x-2">
              <button
                onClick={() => {
                  if (!singers || singers.length === 0) {
                    alert("가수 데이터를 불러올 수 없습니다.");
                    return;
                  }

                  // 가수 선택 모달 또는 추가 로직 구현
                  const singerId = prompt(
                    "추가할 가수 ID를 입력하세요:\n" +
                      singers
                        .slice(0, 5)
                        .map((s) => `${s.id}: ${s.name} (${s.agency || ""})`)
                        .join("\n")
                  );

                  if (singerId) {
                    const selectedSinger = singers.find(
                      (s) => s.id === singerId
                    );
                    if (!selectedSinger) {
                      alert("해당 ID의 가수를 찾을 수 없습니다.");
                      return;
                    }

                    const newCandidate = {
                      requestId,
                      singerId,
                      status: "조회",
                      price: `${Math.floor(Math.random() * 500 + 100) * 10000}`,
                      notes: "새로운 가수 후보",
                      createdAt: new Date().toISOString(),
                      updatedAt: new Date().toISOString(),
                    };

                    // 가수 후보 추가 API 호출
                    addSingerCandidate(newCandidate)
                      .then((result) => {
                        // 성공 시 가수 후보 목록에 추가
                        const newCandidateDisplay = {
                          id: result.id || `new-${Date.now()}`,
                          name: selectedSinger.name,
                          agency: selectedSinger.agency || "-",
                          rating: 4.0,
                          price: `${newCandidate.price}원`,
                          status: newCandidate.status,
                        };
                        setSingerCandidates([
                          ...singerCandidates,
                          newCandidateDisplay,
                        ]);

                        // 로그에 추가
                        const logData = {
                          requestId,
                          date: new Date().toISOString(),
                          action: `가수 후보 추가: ${selectedSinger.name}`,
                          user: "관리자",
                        };

                        addRequestLog(logData)
                          .then((log) => {
                            const newLog = {
                              id: log.id || `LOG-${Date.now()}`,
                              date: new Date().toLocaleString(),
                              action: logData.action,
                              user: logData.user,
                            };
                            setLogs([newLog, ...logs]);
                          })
                          .catch((err) => {
                            console.error("로그 추가 중 오류:", err);
                          });

                        alert(
                          `${selectedSinger.name} 가수를 후보로 추가했습니다.`
                        );
                      })
                      .catch((err) => {
                        console.error("가수 후보 추가 실패:", err);
                        alert("가수 후보 추가에 실패했습니다.");
                      });
                  }
                }}
                className="px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 text-sm"
              >
                가수 추가
              </button>
              <Link
                href={`/admin/requests/${requestId}/edit`}
                className="px-3 py-1 bg-orange-600 text-white rounded-md hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 text-sm"
              >
                요청서 수정
              </Link>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    가수
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    소속사
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    평점
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    예상 비용
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    상태
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    액션
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {singerCandidates.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-6 py-4 text-center text-gray-500"
                    >
                      등록된 가수 후보가 없습니다.
                    </td>
                  </tr>
                ) : (
                  singerCandidates.map((singer) => (
                    <tr key={singer.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {singer.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {singer.agency}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex items-center">
                          {Array.from(Array(5)).map((_, i) => (
                            <svg
                              key={i}
                              xmlns="http://www.w3.org/2000/svg"
                              className={`h-4 w-4 ${
                                i < Math.floor(singer.rating)
                                  ? "text-yellow-400"
                                  : "text-gray-300"
                              }`}
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                          <span className="ml-1 text-gray-500">
                            {singer.rating.toFixed(1)}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {singer.price}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getSingerStatusColor(
                            singer.status
                          )}`}
                        >
                          {singer.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          className="text-orange-600 hover:text-orange-900 mr-3"
                          onClick={() => {
                            // 견적 상태로 변경
                            const newStatus = "견적 도착";

                            // 만약 실제 API 엔드포인트가 있다면 호출
                            if (singer.id.startsWith("sample-")) {
                              // 샘플 데이터는 로컬에서만 변경
                              const updatedCandidates = singerCandidates.map(
                                (c) =>
                                  c.id === singer.id
                                    ? { ...c, status: newStatus }
                                    : c
                              );
                              setSingerCandidates(updatedCandidates);

                              alert("견적이 도착했습니다.");
                            } else {
                              // 실제 API 호출
                              updateSingerCandidateStatus(singer.id, newStatus)
                                .then(() => {
                                  // 상태 업데이트
                                  const updatedCandidates =
                                    singerCandidates.map((c) =>
                                      c.id === singer.id
                                        ? { ...c, status: newStatus }
                                        : c
                                    );
                                  setSingerCandidates(updatedCandidates);

                                  // 로그 추가
                                  const logData = {
                                    requestId,
                                    date: new Date().toISOString(),
                                    action: `가수 후보 상태 변경: ${singer.name} - ${newStatus}`,
                                    user: "관리자",
                                  };

                                  addRequestLog(logData).catch((err) => {
                                    console.error("로그 추가 중 오류:", err);
                                  });

                                  alert("견적이 도착했습니다.");
                                })
                                .catch((err) => {
                                  console.error(
                                    "가수 후보 상태 변경 중 오류:",
                                    err
                                  );
                                  alert("상태 변경에 실패했습니다.");
                                });
                            }
                          }}
                        >
                          견적 보기
                        </button>
                        <button
                          className="text-orange-600 hover:text-orange-900"
                          onClick={() => {
                            // 협상 상태로 변경
                            const newStatus = "협상 중";

                            // 만약 실제 API 엔드포인트가 있다면 호출
                            if (singer.id.startsWith("sample-")) {
                              // 샘플 데이터는 로컬에서만 변경
                              const updatedCandidates = singerCandidates.map(
                                (c) =>
                                  c.id === singer.id
                                    ? { ...c, status: newStatus }
                                    : c
                              );
                              setSingerCandidates(updatedCandidates);

                              alert("협상 상태로 변경되었습니다.");
                            } else {
                              // 실제 API 호출
                              updateSingerCandidateStatus(singer.id, newStatus)
                                .then(() => {
                                  // 상태 업데이트
                                  const updatedCandidates =
                                    singerCandidates.map((c) =>
                                      c.id === singer.id
                                        ? { ...c, status: newStatus }
                                        : c
                                    );
                                  setSingerCandidates(updatedCandidates);

                                  // 로그 추가
                                  const logData = {
                                    requestId,
                                    date: new Date().toISOString(),
                                    action: `가수 후보 상태 변경: ${singer.name} - ${newStatus}`,
                                    user: "관리자",
                                  };

                                  addRequestLog(logData).catch((err) => {
                                    console.error("로그 추가 중 오류:", err);
                                  });

                                  alert("협상 상태로 변경되었습니다.");
                                })
                                .catch((err) => {
                                  console.error(
                                    "가수 후보 상태 변경 중 오류:",
                                    err
                                  );
                                  alert("상태 변경에 실패했습니다.");
                                });
                            }
                          }}
                        >
                          협상하기
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 활동 로그 탭 */}
      {activeTab === "logs" && (
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-200 bg-gray-50">
            <h2 className="text-lg font-medium text-gray-900">활동 로그</h2>
          </div>
          <div className="divide-y divide-gray-200">
            {logs.length === 0 ? (
              <div className="px-6 py-4 text-center text-gray-500">
                로그 기록이 없습니다.
              </div>
            ) : (
              logs.map((log) => (
                <div key={log.id} className="px-6 py-4">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-900">
                      {log.user}
                    </span>
                    <span className="text-sm text-gray-500">{log.date}</span>
                  </div>
                  <p className="mt-1 text-sm text-gray-900">{log.action}</p>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
