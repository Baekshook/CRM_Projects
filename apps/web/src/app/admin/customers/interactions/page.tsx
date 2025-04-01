"use client";
import { useState, useEffect } from "react";
import PageHeader from "@/components/common/PageHeader";
import { toast } from "react-hot-toast";
import { customers, singers } from "@/utils/dummyData";

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

// 더미 데이터 생성
const generateDummyInteractions = (): Interaction[] => {
  return [
    {
      id: "int-001",
      customerId: customers[0].id,
      customerName: customers[0].name,
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
      customerId: customers[2] ? customers[2].id : "cust-003",
      customerName: customers[2] ? customers[2].name : "박준호",
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
      customerId: customers[3] ? customers[3].id : "cust-004",
      customerName: customers[3] ? customers[3].name : "최유진",
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
      customerId: customers[4] ? customers[4].id : "cust-005",
      customerName: customers[4] ? customers[4].name : "권나은",
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
      customerId: singers[0] ? singers[0].id : "singer-001",
      customerName: singers[0] ? singers[0].name : "김태희",
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
};

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
      setInteractions(generateDummyInteractions());
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
        customerId: customers[0].id,
        customerName: customers[0].name,
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
    if (confirm("정말 이 상호작용을 삭제하시겠습니까?")) {
      try {
        setInteractions(interactions.filter((item) => item.id !== id));
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
    const { name, value, type } = e.target as HTMLInputElement;
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setNewInteraction({ ...newInteraction, [name]: checked });
    } else {
      setNewInteraction({ ...newInteraction, [name]: value });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <PageHeader title="고객 상호작용" />

      <div className="mb-6 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-black">상호작용 관리</h2>
          <p className="text-black mt-1">
            모든 고객 상호작용을 조회하고 관리합니다.
          </p>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 px-4 rounded-lg flex items-center transition duration-200"
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
          {showAddForm ? "취소" : "상호작용 추가"}
        </button>
      </div>

      {showAddForm && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h3 className="text-lg font-bold text-black mb-4">상호작용 추가</h3>
          <form onSubmit={handleAddInteraction}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="type"
                  className="block text-sm font-medium text-black mb-1"
                >
                  유형
                </label>
                <select
                  id="type"
                  name="type"
                  value={newInteraction.type}
                  onChange={handleInputChange}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base text-black border-gray-300 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm rounded-md"
                >
                  <option value="call">통화</option>
                  <option value="email">이메일</option>
                  <option value="meeting">미팅</option>
                  <option value="other">기타</option>
                </select>
              </div>
              <div>
                <label
                  htmlFor="subject"
                  className="block text-sm font-medium text-black mb-1"
                >
                  제목
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={newInteraction.subject}
                  onChange={handleInputChange}
                  required
                  className="mt-1 focus:ring-orange-500 focus:border-orange-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                />
              </div>
              <div className="md:col-span-2">
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-black mb-1"
                >
                  설명
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={3}
                  value={newInteraction.description}
                  onChange={handleInputChange}
                  required
                  className="mt-1 focus:ring-orange-500 focus:border-orange-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label
                  htmlFor="outcome"
                  className="block text-sm font-medium text-black mb-1"
                >
                  결과
                </label>
                <input
                  type="text"
                  id="outcome"
                  name="outcome"
                  value={newInteraction.outcome}
                  onChange={handleInputChange}
                  required
                  className="mt-1 focus:ring-orange-500 focus:border-orange-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label
                  htmlFor="duration"
                  className="block text-sm font-medium text-black mb-1"
                >
                  소요 시간 (분)
                </label>
                <input
                  type="number"
                  id="duration"
                  name="duration"
                  value={newInteraction.duration || ""}
                  onChange={handleInputChange}
                  className="mt-1 focus:ring-orange-500 focus:border-orange-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                />
              </div>
              <div className="flex items-center">
                <input
                  id="followUpRequired"
                  name="followUpRequired"
                  type="checkbox"
                  checked={newInteraction.followUpRequired}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                />
                <label
                  htmlFor="followUpRequired"
                  className="ml-2 block text-sm text-black"
                >
                  후속 조치 필요
                </label>
              </div>
              {newInteraction.followUpRequired && (
                <div>
                  <label
                    htmlFor="followUpDate"
                    className="block text-sm font-medium text-black mb-1"
                  >
                    후속 조치 일정
                  </label>
                  <input
                    type="datetime-local"
                    id="followUpDate"
                    name="followUpDate"
                    value={
                      newInteraction.followUpDate
                        ? new Date(newInteraction.followUpDate)
                            .toISOString()
                            .slice(0, 16)
                        : ""
                    }
                    onChange={handleInputChange}
                    className="mt-1 focus:ring-orange-500 focus:border-orange-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
              )}
            </div>
            <div className="mt-4 flex justify-end">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="mr-2 bg-white border border-gray-300 rounded-md shadow-sm py-2 px-4 text-sm font-medium text-black hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
              >
                취소
              </button>
              <button
                type="submit"
                className="bg-orange-500 border border-transparent rounded-md shadow-sm py-2 px-4 text-sm font-medium text-white hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
              >
                추가
              </button>
            </div>
          </form>
        </div>
      )}

      {isLoading ? (
        <div className="text-center py-12">
          <svg
            className="animate-spin h-8 w-8 text-orange-500 mx-auto"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          <p className="mt-2 text-black">로딩 중...</p>
        </div>
      ) : interactions.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <p className="text-black">상호작용 데이터가 없습니다.</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider"
                  >
                    고객명/담당자
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider"
                  >
                    유형/제목
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider"
                  >
                    날짜
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider"
                  >
                    결과
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider"
                  >
                    후속 조치
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-right text-xs font-medium text-black uppercase tracking-wider"
                  >
                    액션
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {interactions.map((interaction) => {
                  const typeInfo = getInteractionTypeInfo(interaction.type);
                  return (
                    <tr key={interaction.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-black">
                          {interaction.customerName}
                        </div>
                        <div className="text-sm text-black">
                          {interaction.createdBy}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <span
                            className={`inline-flex items-center p-1.5 rounded-full ${typeInfo.bgColor} ${typeInfo.textColor} mr-2`}
                          >
                            {typeInfo.icon}
                          </span>
                          <div>
                            <div className="text-sm font-medium text-black">
                              {typeInfo.label}
                            </div>
                            <div className="text-sm text-black">
                              {interaction.subject}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-black">
                          {formatDate(interaction.date)}
                        </div>
                        {interaction.duration && (
                          <div className="text-sm text-black">
                            {interaction.duration}분
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-black">
                          {interaction.outcome}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {interaction.followUpRequired ? (
                          <div>
                            <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded">
                              필요
                            </span>
                            {interaction.followUpDate && (
                              <div className="text-sm mt-1 text-black">
                                {formatDate(interaction.followUpDate)}
                              </div>
                            )}
                          </div>
                        ) : (
                          <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">
                            불필요
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() =>
                            handleDeleteInteraction(interaction.id)
                          }
                          className="text-red-600 hover:text-red-900"
                        >
                          삭제
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
