"use client";
import { useState, useEffect } from "react";
import PageHeader from "@/components/common/PageHeader";
import { toast } from "react-hot-toast";

// 상호작용 타입 정의
interface Interaction {
  id: string;
  customerId: string;
  customerName: string;
  type: "call" | "email" | "meeting" | "other";
  date: string;
  duration?: number;
  subject: string;
  description: string;
  outcome: string;
  followUpRequired: boolean;
  followUpDate?: string;
  createdBy: string;
}

// 더미 데이터
const dummyInteractions: Interaction[] = [
  {
    id: "int-001",
    customerId: "cust-001",
    customerName: "김민수",
    type: "call",
    date: "2023-06-15T10:30:00",
    duration: 15,
    subject: "행사 일정 문의",
    description: "7월 회사 창립 기념 행사에 대한 가수 섭외 문의",
    outcome: "요청서 작성 예정",
    followUpRequired: true,
    followUpDate: "2023-06-17T14:00:00",
    createdBy: "이영희",
  },
  {
    id: "int-002",
    customerId: "cust-003",
    customerName: "박지성",
    type: "meeting",
    date: "2023-06-14T15:00:00",
    duration: 60,
    subject: "계약 조건 협의",
    description: "대형 이벤트 계약 조건 및 가격 협의",
    outcome: "계약서 수정 요청",
    followUpRequired: true,
    followUpDate: "2023-06-20T11:00:00",
    createdBy: "이영희",
  },
  {
    id: "int-003",
    customerId: "cust-007",
    customerName: "최유리",
    type: "email",
    date: "2023-06-13T09:15:00",
    subject: "견적서 문의",
    description: "이전에 보낸 견적서에 대한 추가 질문",
    outcome: "수정된 견적서 발송 완료",
    followUpRequired: false,
    createdBy: "김재원",
  },
  {
    id: "int-004",
    customerId: "cust-010",
    customerName: "정태영",
    type: "call",
    date: "2023-06-12T13:45:00",
    duration: 10,
    subject: "불만 접수",
    description: "이전 행사에서 가수 지각 관련 불만",
    outcome: "사과 및 다음 행사 할인 제안",
    followUpRequired: true,
    followUpDate: "2023-06-19T10:00:00",
    createdBy: "김재원",
  },
  {
    id: "int-005",
    customerId: "cust-012",
    customerName: "강동원",
    type: "meeting",
    date: "2023-06-10T16:30:00",
    duration: 45,
    subject: "신규 계약 논의",
    description: "연간 행사 계약 가능성 논의",
    outcome: "관심 있음, 세부 조건 검토 중",
    followUpRequired: true,
    followUpDate: "2023-06-24T15:00:00",
    createdBy: "이영희",
  },
];

// 날짜 포맷팅 함수
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
    2,
    "0"
  )}-${String(date.getDate()).padStart(2, "0")} ${String(
    date.getHours()
  ).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
};

// 상호작용 유형에 따른 아이콘과 스타일
const getInteractionTypeInfo = (type: string) => {
  switch (type) {
    case "call":
      return {
        icon: (
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
            />
          </svg>
        ),
        bgColor: "bg-blue-100",
        textColor: "text-blue-800",
        label: "통화",
      };
    case "email":
      return {
        icon: (
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
        ),
        bgColor: "bg-green-100",
        textColor: "text-green-800",
        label: "이메일",
      };
    case "meeting":
      return {
        icon: (
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
        ),
        bgColor: "bg-purple-100",
        textColor: "text-purple-800",
        label: "미팅",
      };
    default:
      return {
        icon: (
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        ),
        bgColor: "bg-gray-100",
        textColor: "text-gray-800",
        label: "기타",
      };
  }
};

export default function InteractionsPage() {
  const [interactions, setInteractions] = useState<Interaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newInteraction, setNewInteraction] = useState<Partial<Interaction>>({
    type: "call",
    subject: "",
    description: "",
    outcome: "",
    followUpRequired: false,
  });

  // 상호작용 데이터 로드
  useEffect(() => {
    try {
      setIsLoading(true);
      // API 호출 대신 더미 데이터 사용
      setInteractions(dummyInteractions);
    } catch (error) {
      console.error("데이터 로드 오류:", error);
      toast.error("상호작용 데이터를 불러오는데 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 상호작용 추가 핸들러
  const handleAddInteraction = (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const newId = `int-${Math.floor(Math.random() * 1000)
        .toString()
        .padStart(3, "0")}`;

      const interaction: Interaction = {
        id: newId,
        customerId: "cust-001", // 실제로는 선택된 고객 ID로 대체
        customerName: "신규 고객", // 실제로는 선택된 고객 이름으로 대체
        type: newInteraction.type as "call" | "email" | "meeting" | "other",
        date: new Date().toISOString(),
        duration: newInteraction.duration,
        subject: newInteraction.subject || "",
        description: newInteraction.description || "",
        outcome: newInteraction.outcome || "",
        followUpRequired: newInteraction.followUpRequired || false,
        followUpDate: newInteraction.followUpRequired
          ? newInteraction.followUpDate
          : undefined,
        createdBy: "현재 사용자", // 실제로는 로그인된 사용자 이름으로 대체
      };

      setInteractions([interaction, ...interactions]);
      setShowAddForm(false);
      setNewInteraction({
        type: "call",
        subject: "",
        description: "",
        outcome: "",
        followUpRequired: false,
      });

      toast.success("상호작용이 추가되었습니다.");
    } catch (error) {
      console.error("상호작용 추가 오류:", error);
      toast.error("상호작용 추가에 실패했습니다.");
    }
  };

  // 상호작용 삭제 핸들러
  const handleDeleteInteraction = (id: string) => {
    if (confirm("정말 이 상호작용 기록을 삭제하시겠습니까?")) {
      try {
        setInteractions(
          interactions.filter((interaction) => interaction.id !== id)
        );
        toast.success("상호작용이 삭제되었습니다.");
      } catch (error) {
        console.error("상호작용 삭제 오류:", error);
        toast.error("상호작용 삭제에 실패했습니다.");
      }
    }
  };

  // 폼 입력 변경 핸들러
  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;

    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setNewInteraction({ ...newInteraction, [name]: checked });
    } else {
      setNewInteraction({ ...newInteraction, [name]: value });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <PageHeader
        title="고객 상호작용 관리"
        description="고객과의 모든 상호작용을 기록하고 관리합니다."
        actions={
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 flex items-center"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
            상호작용 추가
          </button>
        }
      />

      {/* 추가 폼 */}
      {showAddForm && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">새 상호작용 추가</h2>
          <form onSubmit={handleAddInteraction}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  상호작용 유형
                </label>
                <select
                  name="type"
                  value={newInteraction.type}
                  onChange={handleInputChange}
                  className="w-full border-gray-300 rounded-md shadow-sm focus:border-orange-500 focus:ring-orange-500"
                  required
                >
                  <option value="call">통화</option>
                  <option value="email">이메일</option>
                  <option value="meeting">미팅</option>
                  <option value="other">기타</option>
                </select>
              </div>
              {(newInteraction.type === "call" ||
                newInteraction.type === "meeting") && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    소요 시간 (분)
                  </label>
                  <input
                    type="number"
                    name="duration"
                    value={newInteraction.duration || ""}
                    onChange={handleInputChange}
                    className="w-full border-gray-300 rounded-md shadow-sm focus:border-orange-500 focus:ring-orange-500"
                  />
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  제목
                </label>
                <input
                  type="text"
                  name="subject"
                  value={newInteraction.subject}
                  onChange={handleInputChange}
                  className="w-full border-gray-300 rounded-md shadow-sm focus:border-orange-500 focus:ring-orange-500"
                  required
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                내용
              </label>
              <textarea
                name="description"
                value={newInteraction.description}
                onChange={handleInputChange}
                rows={3}
                className="w-full border-gray-300 rounded-md shadow-sm focus:border-orange-500 focus:ring-orange-500"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                결과
              </label>
              <textarea
                name="outcome"
                value={newInteraction.outcome}
                onChange={handleInputChange}
                rows={2}
                className="w-full border-gray-300 rounded-md shadow-sm focus:border-orange-500 focus:ring-orange-500"
                required
              />
            </div>

            <div className="flex items-center mb-4">
              <input
                type="checkbox"
                id="followUpRequired"
                name="followUpRequired"
                checked={newInteraction.followUpRequired}
                onChange={handleInputChange}
                className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
              />
              <label
                htmlFor="followUpRequired"
                className="ml-2 block text-sm text-gray-700"
              >
                후속 조치 필요
              </label>
            </div>

            {newInteraction.followUpRequired && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  후속 조치 날짜
                </label>
                <input
                  type="datetime-local"
                  name="followUpDate"
                  value={newInteraction.followUpDate}
                  onChange={handleInputChange}
                  className="w-full border-gray-300 rounded-md shadow-sm focus:border-orange-500 focus:ring-orange-500"
                  required
                />
              </div>
            )}

            <div className="flex justify-end space-x-3 mt-6">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
              >
                취소
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600"
              >
                저장
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 상호작용 목록 */}
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <p className="text-gray-500">데이터를 불러오는 중...</p>
        </div>
      ) : interactions.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <p className="text-gray-500 mb-4">상호작용 기록이 없습니다.</p>
          <button
            onClick={() => setShowAddForm(true)}
            className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600"
          >
            첫 상호작용 추가하기
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md divide-y">
          {interactions.map((interaction) => {
            const typeInfo = getInteractionTypeInfo(interaction.type);

            return (
              <div key={interaction.id} className="p-4 hover:bg-gray-50">
                <div className="flex justify-between items-start">
                  <div className="flex items-center">
                    <div
                      className={`flex-shrink-0 p-2 rounded-full ${typeInfo.bgColor}`}
                    >
                      {typeInfo.icon}
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-semibold">
                        {interaction.subject}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {interaction.customerName} ·{" "}
                        {formatDate(interaction.date)}
                        {interaction.duration && ` · ${interaction.duration}분`}
                      </p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      className="text-gray-400 hover:text-gray-600"
                      title="편집"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      </svg>
                    </button>
                    <button
                      className="text-gray-400 hover:text-red-600"
                      title="삭제"
                      onClick={() => handleDeleteInteraction(interaction.id)}
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
                <div className="mt-3 text-sm text-gray-700">
                  <p>{interaction.description}</p>
                </div>
                <div className="mt-2">
                  <span className="text-sm font-medium text-gray-700">
                    결과:{" "}
                  </span>
                  <span className="text-sm text-gray-600">
                    {interaction.outcome}
                  </span>
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="text-xs text-gray-500">
                      생성자: {interaction.createdBy}
                    </span>
                  </div>
                  {interaction.followUpRequired && (
                    <div className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full flex items-center">
                      <svg
                        className="w-4 h-4 mr-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      후속 조치{" "}
                      {interaction.followUpDate
                        ? formatDate(interaction.followUpDate)
                        : "필요"}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
