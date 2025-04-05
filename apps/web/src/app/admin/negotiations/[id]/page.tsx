"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  getNegotiationById,
  getCustomerById,
  getSingerById,
  getNegotiationLogs,
  updateNegotiation,
  Negotiation,
} from "@/services/negotiationsApi";

// 메시지 타입 정의
interface Message {
  id: string;
  sender: string;
  senderType: "admin" | "customer" | "agency";
  content: string;
  timestamp: string;
  isRead: boolean;
}

export default function NegotiationDetailPage() {
  const router = useRouter();
  const params = useParams();
  const negotiationId = params.id as string;

  // 상태
  const [negotiation, setNegotiation] = useState<Negotiation | null>(null);
  const [customer, setCustomer] = useState<any | null>(null);
  const [singer, setSinger] = useState<any | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState<string>("");
  const [activeTab, setActiveTab] = useState<string>("details");
  const [statusOptions] = useState<string[]>([
    "pending",
    "in-progress",
    "final-quote",
    "cancelled",
    "completed",
  ]);
  const [newStatus, setNewStatus] = useState<string>("");
  const [newPrice, setNewPrice] = useState<string>("");
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // 협상 데이터 로드
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        // 협상 데이터 로드
        const negotiationData = await getNegotiationById(negotiationId);
        setNegotiation(negotiationData);
        setNewStatus(negotiationData.status);
        setNewPrice(negotiationData.initialAmount?.toString() || "0");

        // 고객 및 가수 데이터 로드
        if (negotiationData.customerId) {
          try {
            const customerData = await getCustomerById(
              negotiationData.customerId
            );
            setCustomer(customerData);
          } catch (customerError) {
            console.error("고객 데이터 로드 중 오류:", customerError);
            setError("고객 정보를 불러오는 중 오류가 발생했습니다.");
          }
        }

        if (negotiationData.singerId) {
          try {
            const singerData = await getSingerById(negotiationData.singerId);
            setSinger(singerData);
          } catch (singerError) {
            console.error("가수 데이터 로드 중 오류:", singerError);
            setError("가수 정보를 불러오는 중 오류가 발생했습니다.");
          }
        }

        // 로그 데이터 로드
        try {
          const logsData = await getNegotiationLogs(negotiationId);
          setLogs(logsData);

          // 메시지 데이터 생성
          const generatedMessages: Message[] = [];

          // 로그를 기반으로 메시지 생성
          if (Array.isArray(logsData) && logsData.length > 0) {
            logsData.forEach((log, index) => {
              const message: Message = {
                id: `MSG-${index + 1}`,
                sender: log.user,
                senderType:
                  log.user === "관리자"
                    ? "admin"
                    : log.user.includes("소속사")
                    ? "agency"
                    : "customer",
                content: log.content,
                timestamp: log.date,
                isRead: true,
              };
              generatedMessages.push(message);
            });
          }

          // 기본 메시지 추가
          if (generatedMessages.length === 0) {
            generatedMessages.push({
              id: "MSG-001",
              sender: "관리자",
              senderType: "admin",
              content: `안녕하세요, 요청하신 공연에 대한 견적을 검토중입니다. 공연료는 ${
                negotiationData.initialAmount?.toLocaleString() || 0
              }원 입니다.`,
              timestamp: new Date().toLocaleString(),
              isRead: true,
            });
          }

          setMessages(generatedMessages);
        } catch (logsError) {
          console.error("로그 데이터 로드 중 오류:", logsError);
          setError("협상 기록을 불러오는 중 오류가 발생했습니다.");
          setMessages([
            {
              id: "MSG-error",
              sender: "시스템",
              senderType: "admin",
              content: "협상 기록을 불러오는 중 오류가 발생했습니다.",
              timestamp: new Date().toLocaleString(),
              isRead: true,
            },
          ]);
        }
      } catch (err: any) {
        console.error("협상 데이터 로드 중 오류:", err);
        const errorMsg =
          err.response?.data?.message ||
          err.message ||
          "데이터를 불러오는 중 오류가 발생했습니다.";
        setError(`협상 정보를 불러오는 중 오류가 발생했습니다: ${errorMsg}`);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [negotiationId]);

  // 상태 변경 처리
  const handleStatusChange = async () => {
    if (negotiation && newStatus && newStatus !== negotiation.status) {
      try {
        setLoading(true);

        // 이전 상태 저장
        const previousStatus = negotiation.status;

        // API 호출로 상태 업데이트
        await updateNegotiation(negotiation.id, { status: newStatus });

        // 상태 업데이트 후 협상 데이터 다시 로드
        const updatedNegotiation = await getNegotiationById(negotiation.id);
        setNegotiation(updatedNegotiation);

        // 메시지에 상태 변경 기록 추가
        const statusMessage: Message = {
          id: `MSG-${messages.length + 1}`,
          sender: "관리자",
          senderType: "admin",
          content: `상태가 "${getStatusText(
            previousStatus
          )}"에서 "${getStatusText(newStatus)}"(으)로 변경되었습니다.`,
          timestamp: new Date().toLocaleString(),
          isRead: true,
        };
        setMessages([...messages, statusMessage]);

        alert("협상 상태가 변경되었습니다.");
      } catch (err: any) {
        console.error("상태 변경 중 오류:", err);

        // 자세한 오류 메시지 표시
        const errorMessage =
          err.response?.data?.message ||
          err.message ||
          "알 수 없는 오류가 발생했습니다.";
        alert(`상태 변경에 실패했습니다: ${errorMessage}`);
      } finally {
        setLoading(false);
      }
    }
  };

  // 가격 변경 처리
  const handlePriceChange = async () => {
    if (negotiation && newPrice) {
      try {
        setLoading(true);

        const priceValue = parseInt(newPrice.replace(/,/g, ""));
        if (priceValue !== negotiation.initialAmount) {
          // 이전 가격 저장
          const previousPrice = negotiation.initialAmount;

          // API 호출로 가격 업데이트
          await updateNegotiation(negotiation.id, {
            initialAmount: priceValue,
          });

          // 협상 데이터 다시 로드
          const updatedNegotiation = await getNegotiationById(negotiation.id);
          setNegotiation(updatedNegotiation);

          // 메시지에 가격 변경 기록 추가
          const priceMessage: Message = {
            id: `MSG-${messages.length + 1}`,
            sender: "관리자",
            senderType: "admin",
            content: `제안 금액이 "${
              previousPrice?.toLocaleString() || 0
            }원"에서 "${priceValue.toLocaleString()}원"(으)로 변경되었습니다.`,
            timestamp: new Date().toLocaleString(),
            isRead: true,
          };
          setMessages([...messages, priceMessage]);

          alert("협상 금액이 변경되었습니다.");
        }
      } catch (err: any) {
        console.error("가격 변경 중 오류:", err);

        // 자세한 오류 메시지 표시
        const errorMessage =
          err.response?.data?.message ||
          err.message ||
          "알 수 없는 오류가 발생했습니다.";
        alert(`금액 변경에 실패했습니다: ${errorMessage}`);
      } finally {
        setLoading(false);
      }
    }
  };

  // 메시지 전송 처리
  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const message: Message = {
        id: `MSG-${messages.length + 1}`,
        sender: "관리자",
        senderType: "admin",
        content: newMessage,
        timestamp: new Date().toLocaleString(),
        isRead: true,
      };
      setMessages([...messages, message]);
      setNewMessage("");
    }
  };

  // 상태에 따른 배지 색상
  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "in-progress":
        return "bg-blue-100 text-blue-800";
      case "final-quote":
        return "bg-purple-100 text-purple-800";
      case "completed":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // 협상 상태 텍스트 변환
  const getStatusText = (status: string): string => {
    switch (status) {
      case "pending":
        return "견적 검토";
      case "in-progress":
        return "협상 중";
      case "final-quote":
        return "최종 견적서";
      case "completed":
        return "완료";
      case "cancelled":
        return "취소";
      default:
        return "알 수 없음";
    }
  };

  // 발신자 타입에 따른 메시지 스타일
  const getMessageStyle = (senderType: string) => {
    switch (senderType) {
      case "admin":
        return "bg-orange-50 border-orange-200";
      case "customer":
        return "bg-blue-50 border-blue-200";
      case "agency":
        return "bg-purple-50 border-purple-200";
      default:
        return "bg-gray-50 border-gray-200";
    }
  };

  // 날짜 포맷팅 함수
  const formatDate = (dateString: string) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString("ko-KR");
  };

  // 로딩 중이거나 데이터가 없을 때 표시
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">데이터를 불러오는 중입니다...</p>
        </div>
      </div>
    );
  }

  // 오류가 발생한 경우
  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-800 p-6 rounded-lg">
        <div className="flex items-center mb-4">
          <svg
            className="h-6 w-6 text-red-600 mr-3"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <h3 className="text-lg font-medium">오류가 발생했습니다</h3>
        </div>
        <p className="mb-4">{error}</p>
        <div className="flex space-x-4">
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            페이지 새로고침
          </button>
          <Link
            href="/admin/negotiations"
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
          >
            협상 목록으로 돌아가기
          </Link>
        </div>
      </div>
    );
  }

  // 데이터가 없는 경우
  if (!negotiation) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 p-6 rounded-lg">
        <div className="flex items-center mb-4">
          <svg
            className="h-6 w-6 text-yellow-600 mr-3"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h3 className="text-lg font-medium">협상 정보를 찾을 수 없습니다</h3>
        </div>
        <p className="mb-4">
          요청하신 협상 정보를 찾을 수 없습니다. 협상이 삭제되었거나 존재하지
          않는 ID일 수 있습니다.
        </p>
        <Link
          href="/admin/negotiations"
          className="px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700"
        >
          협상 목록으로 돌아가기
        </Link>
      </div>
    );
  }

  return (
    <div>
      {/* 페이지 헤더 */}
      <div className="mb-6">
        <div className="flex items-center mb-2">
          <Link
            href="/admin/negotiations"
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
          <h1 className="text-2xl font-bold text-gray-800">협상 상세 정보</h1>
        </div>
        <div className="flex justify-between items-center">
          <p className="text-gray-600">
            협상 ID: {negotiation.id} | 최근 수정:{" "}
            {formatDate(negotiation.updatedAt)}
          </p>
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
              negotiation.status
            )}`}
          >
            {getStatusText(negotiation.status)}
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
            협상 정보
          </button>
          <button
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === "messages"
                ? "border-orange-500 text-orange-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
            onClick={() => setActiveTab("messages")}
          >
            메시지 ({messages.length})
          </button>
          <button
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === "logs"
                ? "border-orange-500 text-orange-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
            onClick={() => setActiveTab("logs")}
          >
            협상 이력
          </button>
        </nav>
      </div>

      {/* 협상 정보 탭 */}
      {activeTab === "details" && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              {negotiation.title || "제목 없음"}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">
                  고객 정보
                </h3>
                <div className="text-gray-900">
                  <p>{customer?.name || "고객 정보 없음"}</p>
                  <p className="text-sm text-gray-600">
                    {customer?.company || "-"}
                  </p>
                  {customer && (
                    <p className="text-sm text-gray-600 mt-1">
                      연락처: {customer.phone} | 이메일: {customer.email}
                    </p>
                  )}
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">
                  가수 정보
                </h3>
                <div className="text-gray-900">
                  <p>{singer?.name || "가수 정보 없음"}</p>
                  <p className="text-sm text-gray-600">
                    {singer?.agency || "-"}
                  </p>
                  {singer && (
                    <p className="text-sm text-gray-600 mt-1">
                      연락처: {singer.phone} | 이메일: {singer.email}
                    </p>
                  )}
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">
                  행사 정보
                </h3>
                <div className="text-gray-900">
                  <p>날짜: {formatDate(negotiation.eventDate || "")}</p>
                  <p className="text-sm text-gray-600">
                    장소: {negotiation.eventLocation || "-"}
                  </p>
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">
                  제안 금액
                </h3>
                <p className="text-gray-900 font-semibold">
                  {negotiation.initialAmount?.toLocaleString() || 0}원
                </p>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-500 mb-1">
                요구사항 및 상세 내용
              </h3>
              <p className="text-gray-900 whitespace-pre-line">
                {negotiation.requirements || "요구사항이 없습니다."}
              </p>
              {negotiation.notes && (
                <p className="text-gray-900 whitespace-pre-line mt-2">
                  <strong>메모: </strong>
                  {negotiation.notes}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                          {getStatusText(option)}
                        </option>
                      ))}
                    </select>
                  </div>
                  <button
                    className="bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded-md"
                    onClick={handleStatusChange}
                    disabled={loading}
                  >
                    {loading ? "처리 중..." : "상태 변경"}
                  </button>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-gray-700 mb-3">
                  금액 변경
                </h3>
                <div className="flex items-end space-x-4">
                  <div className="flex-1">
                    <label
                      htmlFor="price"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      제안 금액
                    </label>
                    <input
                      type="text"
                      id="price"
                      className="w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
                      value={newPrice}
                      onChange={(e) => setNewPrice(e.target.value)}
                      placeholder="금액 (원)"
                    />
                  </div>
                  <button
                    className="bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded-md"
                    onClick={handlePriceChange}
                    disabled={loading}
                  >
                    {loading ? "처리 중..." : "금액 변경"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 메시지 탭 */}
      {activeTab === "messages" && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-gray-800">
                커뮤니케이션 기록
              </h2>
            </div>

            <div className="mb-6 h-96 overflow-y-auto p-4 border border-gray-200 rounded-lg">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`rounded-lg border p-4 ${getMessageStyle(
                      message.senderType
                    )}`}
                  >
                    <div className="flex justify-between mb-2">
                      <span className="font-medium">{message.sender}</span>
                      <span className="text-xs text-gray-500">
                        {message.timestamp}
                      </span>
                    </div>
                    <p className="text-gray-800">{message.content}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex space-x-2">
              <input
                type="text"
                className="flex-1 rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="메시지를 입력하세요..."
                onKeyPress={(e) => {
                  if (e.key === "Enter") handleSendMessage();
                }}
              />
              <button
                className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                onClick={handleSendMessage}
              >
                전송
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 협상 이력 탭 */}
      {activeTab === "logs" && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-6">
            <h2 className="text-lg font-bold text-gray-800 mb-4">협상 이력</h2>

            <div className="space-y-4">
              {logs.length > 0 ? (
                logs.map((log) => (
                  <div
                    key={log.id}
                    className="border-l-4 border-gray-300 pl-4 py-2"
                  >
                    <p className="text-gray-900">{log.content}</p>
                    <div className="flex text-sm text-gray-500 mt-1">
                      <p>{formatDate(log.date)}</p>
                      <p className="ml-4">처리자: {log.user}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">협상 이력이 없습니다.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
