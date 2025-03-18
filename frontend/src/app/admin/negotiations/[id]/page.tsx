"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

// 협상 타입 정의
interface Negotiation {
  id: string;
  requestId: string;
  requestTitle: string;
  customer: string;
  customerContact: string;
  singer: string;
  agency: string;
  agencyContact: string;
  price: string;
  status: string;
  lastUpdate: string;
  dueDate: string;
  eventDate: string;
  eventLocation: string;
  details: string;
}

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
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState<string>("");
  const [activeTab, setActiveTab] = useState<string>("details");
  const [statusOptions] = useState<string[]>([
    "견적 제안",
    "협상 중",
    "계약 대기",
    "계약 완료",
    "취소",
  ]);
  const [newStatus, setNewStatus] = useState<string>("");
  const [newPrice, setNewPrice] = useState<string>("");

  // 샘플 협상 데이터
  const sampleNegotiations: Negotiation[] = [
    {
      id: "NEG-001",
      requestId: "REQ-001",
      requestTitle: "2023 연말 기업 행사",
      customer: "(주)이벤트 플래닝",
      customerContact: "김담당 / 010-1234-5678 / event@planning.com",
      singer: "가수 A",
      agency: "엔터테인먼트 A",
      agencyContact: "박매니저 / 010-8765-4321 / manager@entA.com",
      price: "3,000,000원",
      status: "협상 중",
      lastUpdate: "2023-11-16",
      dueDate: "2023-11-20",
      eventDate: "2023-12-20",
      eventLocation: "서울 강남구 삼성동 OO호텔",
      details:
        "연말 기업 행사로, 직원들을 위한 공연이 필요합니다. 가요, 댄스 등 다양한 장르의 공연을 원합니다. 행사 시간은 약 2시간이며, 사회자도 함께 요청합니다.",
    },
    {
      id: "NEG-002",
      requestId: "REQ-002",
      requestTitle: "12월 결혼식 축가",
      customer: "웨딩 홀 A",
      customerContact: "이담당 / 010-2345-6789 / wedding@hallA.com",
      singer: "가수 B",
      agency: "엔터테인먼트 B",
      agencyContact: "최매니저 / 010-9876-5432 / manager@entB.com",
      price: "1,200,000원",
      status: "계약 대기",
      lastUpdate: "2023-11-15",
      dueDate: "2023-11-18",
      eventDate: "2023-12-10",
      eventLocation: "서울 서초구 반포동 OO웨딩홀",
      details:
        "결혼식 축가로 발라드 2곡을 요청합니다. 신랑 신부 입장 시와 케이크 커팅 시간에 각각 한 곡씩 불러주시면 됩니다.",
    },
  ];

  // 샘플 메시지 데이터
  const sampleMessages: Message[] = [
    {
      id: "MSG-001",
      sender: "관리자",
      senderType: "admin",
      content:
        "안녕하세요, 요청하신 공연에 대한 견적을 전달드립니다. 가수 A의 공연료는 3,000,000원입니다.",
      timestamp: "2023-11-14 10:30",
      isRead: true,
    },
    {
      id: "MSG-002",
      sender: "김담당 (고객)",
      senderType: "customer",
      content:
        "안녕하세요, 견적 감사합니다. 예산이 조금 부족한데, 2,800,000원으로 가능할까요?",
      timestamp: "2023-11-14 14:20",
      isRead: true,
    },
    {
      id: "MSG-003",
      sender: "박매니저 (소속사)",
      senderType: "agency",
      content:
        "안녕하세요, 문의 주셔서 감사합니다. 공연 시간이 2시간이라 조정이 어렵습니다. 다만, 사회자 비용을 조정해서 2,900,000원까지는 가능합니다.",
      timestamp: "2023-11-15 09:45",
      isRead: true,
    },
    {
      id: "MSG-004",
      sender: "관리자",
      senderType: "admin",
      content:
        "소속사에서 2,900,000원으로 조정 가능하다고 합니다. 어떻게 생각하시나요?",
      timestamp: "2023-11-15 10:30",
      isRead: true,
    },
    {
      id: "MSG-005",
      sender: "김담당 (고객)",
      senderType: "customer",
      content: "네, 2,900,000원이면 괜찮을 것 같습니다. 진행해주세요.",
      timestamp: "2023-11-16 11:15",
      isRead: false,
    },
  ];

  // 협상 데이터 로드
  useEffect(() => {
    // 실제 구현에서는 API 호출로 데이터를 가져옴
    const foundNegotiation = sampleNegotiations.find(
      (neg) => neg.id === negotiationId
    );
    if (foundNegotiation) {
      setNegotiation(foundNegotiation);
      setNewStatus(foundNegotiation.status);
      setNewPrice(foundNegotiation.price.replace("원", ""));
      // 메시지 데이터 로드
      setMessages(sampleMessages);
    } else {
      // 협상이 없으면 목록 페이지로 리다이렉트
      router.push("/admin/negotiations");
    }
  }, [negotiationId, router]);

  // 상태 변경 처리
  const handleStatusChange = () => {
    if (negotiation && newStatus && newStatus !== negotiation.status) {
      // 실제 구현에서는 API 호출로 상태 업데이트
      setNegotiation({ ...negotiation, status: newStatus });

      // 메시지에 상태 변경 기록 추가
      const statusMessage: Message = {
        id: `MSG-${messages.length + 1}`,
        sender: "관리자",
        senderType: "admin",
        content: `상태가 "${negotiation.status}"에서 "${newStatus}"(으)로 변경되었습니다.`,
        timestamp: new Date().toLocaleString(),
        isRead: true,
      };
      setMessages([...messages, statusMessage]);
    }
  };

  // 가격 변경 처리
  const handlePriceChange = () => {
    if (negotiation && newPrice) {
      const formattedPrice = `${newPrice}원`;
      if (formattedPrice !== negotiation.price) {
        // 실제 구현에서는 API 호출로 가격 업데이트
        setNegotiation({ ...negotiation, price: formattedPrice });

        // 메시지에 가격 변경 기록 추가
        const priceMessage: Message = {
          id: `MSG-${messages.length + 1}`,
          sender: "관리자",
          senderType: "admin",
          content: `제안 금액이 "${negotiation.price}"에서 "${formattedPrice}"(으)로 변경되었습니다.`,
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
      case "견적 제안":
        return "bg-blue-100 text-blue-800";
      case "협상 중":
        return "bg-yellow-100 text-yellow-800";
      case "계약 대기":
        return "bg-purple-100 text-purple-800";
      case "계약 완료":
        return "bg-green-100 text-green-800";
      case "취소":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
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

  if (!negotiation) {
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
          <h1 className="text-2xl font-bold text-gray-800">협상 상세</h1>
        </div>
        <div className="flex justify-between items-center">
          <p className="text-gray-600">
            협상 ID: {negotiation.id} | 마지막 업데이트:{" "}
            {negotiation.lastUpdate}
          </p>
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
              negotiation.status
            )}`}
          >
            {negotiation.status}
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
            메시지 (
            {messages.filter((m) => !m.isRead).length > 0
              ? `${messages.filter((m) => !m.isRead).length}`
              : messages.length}
            )
          </button>
        </nav>
      </div>

      {/* 협상 정보 탭 */}
      {activeTab === "details" && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              {negotiation.requestTitle}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">
                  요청 ID
                </h3>
                <p className="text-gray-900">
                  <Link
                    href={`/admin/requests/${negotiation.requestId}`}
                    className="text-orange-600 hover:text-orange-800"
                  >
                    {negotiation.requestId}
                  </Link>
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">
                  현재 제안 금액
                </h3>
                <p className="text-gray-900 font-bold">{negotiation.price}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">
                  행사 일자
                </h3>
                <p className="text-gray-900">{negotiation.eventDate}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">
                  행사 장소
                </h3>
                <p className="text-gray-900">{negotiation.eventLocation}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-blue-700 mb-2">
                  고객 정보
                </h3>
                <p className="text-gray-900 mb-1">{negotiation.customer}</p>
                <p className="text-gray-600 text-sm">
                  {negotiation.customerContact}
                </p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-purple-700 mb-2">
                  가수/소속사 정보
                </h3>
                <p className="text-gray-900 mb-1">
                  {negotiation.singer} / {negotiation.agency}
                </p>
                <p className="text-gray-600 text-sm">
                  {negotiation.agencyContact}
                </p>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-500 mb-1">
                요청 상세 내용
              </h3>
              <p className="text-gray-900 whitespace-pre-line">
                {negotiation.details}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-gray-700 mb-3">
                  상태 변경
                </h3>
                <div className="flex items-end space-x-4">
                  <div className="flex-1">
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
                  <button
                    className="bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded-md"
                    onClick={handleStatusChange}
                  >
                    변경
                  </button>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-gray-700 mb-3">
                  금액 변경
                </h3>
                <div className="flex items-end space-x-4">
                  <div className="flex-1">
                    <div className="relative rounded-md shadow-sm">
                      <input
                        type="text"
                        id="price"
                        className="w-full rounded-md border border-gray-300 py-2 pl-3 pr-12 focus:outline-none focus:ring-2 focus:ring-orange-500"
                        value={newPrice}
                        onChange={(e) =>
                          setNewPrice(e.target.value.replace(/[^0-9,]/g, ""))
                        }
                        placeholder="금액 입력"
                      />
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <span className="text-gray-500 sm:text-sm">원</span>
                      </div>
                    </div>
                  </div>
                  <button
                    className="bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded-md"
                    onClick={handlePriceChange}
                  >
                    변경
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
              <h2 className="text-lg font-bold text-gray-800">메시지 내역</h2>
              <div className="flex space-x-2">
                <button className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-3 rounded-md text-sm">
                  고객에게 메시지
                </button>
                <button className="bg-purple-500 hover:bg-purple-600 text-white py-1 px-3 rounded-md text-sm">
                  소속사에게 메시지
                </button>
              </div>
            </div>

            {/* 메시지 목록 */}
            <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`border rounded-lg p-4 ${getMessageStyle(
                    message.senderType
                  )}`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-medium">{message.sender}</span>
                    <span className="text-xs text-gray-500">
                      {message.timestamp}
                    </span>
                  </div>
                  <p className="text-gray-800 whitespace-pre-line">
                    {message.content}
                  </p>
                </div>
              ))}
            </div>

            {/* 메시지 입력 */}
            <div className="mt-4">
              <div className="flex items-end space-x-2">
                <div className="flex-1">
                  <textarea
                    className="w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    rows={3}
                    placeholder="메시지를 입력하세요..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                  ></textarea>
                </div>
                <button
                  className="bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded-md h-12"
                  onClick={handleSendMessage}
                >
                  전송
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                * 이 메시지는 고객과 소속사 모두에게 전송됩니다.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
