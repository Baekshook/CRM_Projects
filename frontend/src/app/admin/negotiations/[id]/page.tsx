"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  matches,
  negotiationLogs,
  customers,
  singers,
  requests,
} from "@/utils/dummyData";

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
  const [match, setMatch] = useState<any | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState<string>("");
  const [activeTab, setActiveTab] = useState<string>("details");
  const [statusOptions] = useState<string[]>([
    "pending",
    "negotiating",
    "confirmed",
    "cancelled",
  ]);
  const [newStatus, setNewStatus] = useState<string>("");
  const [newPrice, setNewPrice] = useState<string>("");
  const [logs, setLogs] = useState<any[]>([]);

  // 협상 데이터 로드
  useEffect(() => {
    // dummyData.ts에서 매칭 데이터 찾기
    const foundMatch = matches.find((m) => m.id === negotiationId);
    if (foundMatch) {
      setMatch(foundMatch);
      setNewStatus(foundMatch.status);
      setNewPrice(foundMatch.price.toString());

      // 해당 매칭의 로그 데이터 조회
      const matchLogs = negotiationLogs.filter(
        (log) => log.matchId === negotiationId
      );
      setLogs(matchLogs);

      // 메시지 데이터 생성
      const generatedMessages: Message[] = [];

      // 로그를 기반으로 메시지 생성
      matchLogs.forEach((log, index) => {
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

      // 기본 메시지 추가
      if (generatedMessages.length === 0) {
        generatedMessages.push({
          id: "MSG-001",
          sender: "관리자",
          senderType: "admin",
          content: `안녕하세요, 요청하신 공연에 대한 견적을 검토중입니다. 가수 ${
            foundMatch.singerName
          }의 공연료는 ${foundMatch.price.toLocaleString()}원 입니다.`,
          timestamp: new Date().toLocaleString(),
          isRead: true,
        });
      }

      setMessages(generatedMessages);
    } else {
      // 협상이 없으면 목록 페이지로 리다이렉트
      alert("매칭/협상 정보를 찾을 수 없습니다.");
      router.push("/admin/negotiations");
    }
  }, [negotiationId, router]);

  // 상태 변경 처리
  const handleStatusChange = () => {
    if (match && newStatus && newStatus !== match.status) {
      // 실제 구현에서는 API 호출로 상태 업데이트
      setMatch({ ...match, status: newStatus });

      // 메시지에 상태 변경 기록 추가
      const statusMessage: Message = {
        id: `MSG-${messages.length + 1}`,
        sender: "관리자",
        senderType: "admin",
        content: `상태가 "${getStatusText(match.status)}"에서 "${getStatusText(
          newStatus
        )}"(으)로 변경되었습니다.`,
        timestamp: new Date().toLocaleString(),
        isRead: true,
      };
      setMessages([...messages, statusMessage]);
    }
  };

  // 가격 변경 처리
  const handlePriceChange = () => {
    if (match && newPrice) {
      const priceValue = parseInt(newPrice.replace(/,/g, ""));
      if (priceValue !== match.price) {
        // 실제 구현에서는 API 호출로 가격 업데이트
        setMatch({ ...match, price: priceValue });

        // 메시지에 가격 변경 기록 추가
        const priceMessage: Message = {
          id: `MSG-${messages.length + 1}`,
          sender: "관리자",
          senderType: "admin",
          content: `제안 금액이 "${match.price.toLocaleString()}원"에서 "${priceValue.toLocaleString()}원"(으)로 변경되었습니다.`,
          timestamp: new Date().toLocaleString(),
          isRead: true,
        };
        setMessages([...messages, priceMessage]);
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

  // 협상 상태 텍스트 변환
  const getStatusText = (status: string): string => {
    switch (status) {
      case "pending":
        return "견적 검토";
      case "negotiating":
        return "협상 중";
      case "confirmed":
        return "계약 확정";
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
    const date = new Date(dateString);
    return date.toLocaleDateString("ko-KR");
  };

  if (!match) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  // 매칭에 연결된 요청서 조회
  const relatedRequest = requests.find((req) => req.id === match.requestId);

  // 관련 고객 정보 조회
  const customer = customers.find((c) => c.id === match.customerId);

  // 관련 가수 정보 조회
  const singer = singers.find((s) => s.id === match.singerId);

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
            매칭 ID: {match.id} | 요청서 ID: {match.requestId} | 최근 수정:{" "}
            {formatDate(match.updatedAt)}
          </p>
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
              match.status
            )}`}
          >
            {getStatusText(match.status)}
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
            매칭/협상 정보
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
              {match.requestTitle}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">
                  고객 정보
                </h3>
                <div className="text-gray-900">
                  <p>{match.customerName}</p>
                  <p className="text-sm text-gray-600">
                    {match.customerCompany}
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
                  <p>{match.singerName}</p>
                  <p className="text-sm text-gray-600">{match.singerAgency}</p>
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
                  <p>날짜: {formatDate(match.eventDate)}</p>
                  <p className="text-sm text-gray-600">장소: {match.venue}</p>
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">
                  제안 금액
                </h3>
                <p className="text-gray-900 font-semibold">
                  {match.price.toLocaleString()}원
                </p>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-500 mb-1">
                요구사항 및 상세 내용
              </h3>
              <p className="text-gray-900 whitespace-pre-line">
                {match.requirements || "요구사항이 없습니다."}
              </p>
              {match.notes && (
                <p className="text-gray-900 whitespace-pre-line mt-2">
                  <strong>메모: </strong>
                  {match.notes}
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
                  >
                    상태 변경
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
                  >
                    금액 변경
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
                      <p>{log.date}</p>
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
