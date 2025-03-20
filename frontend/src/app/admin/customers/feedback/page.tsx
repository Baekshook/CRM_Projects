"use client";
import { useState, useEffect } from "react";
import PageHeader from "@/components/common/PageHeader";
import { toast } from "react-hot-toast";
import {
  customers as dummyCustomers,
  singers as dummySingers,
} from "@/utils/dummyData";

// 피드백 타입 정의
interface Feedback {
  id: string;
  customerId: string;
  customerName: string;
  singerId?: string;
  singerName?: string;
  contractId?: string;
  rating: number; // 1-5
  content: string;
  category: "서비스" | "가격" | "가수" | "일정" | "기타";
  status: "신규" | "확인" | "처리중" | "완료" | "무시";
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
  response?: string;
  responseAt?: string;
}

// 더미 피드백 데이터 생성 함수
const generateDummyFeedbacks = (): Feedback[] => {
  return [
    {
      id: "feed-001",
      customerId: dummyCustomers[0].id,
      customerName: dummyCustomers[0].name,
      singerId: dummySingers[0] ? dummySingers[0].id : "sing-005",
      singerName: dummySingers[0] ? dummySingers[0].name : "이지은",
      contractId: "contract-123",
      rating: 5,
      content:
        "가수 분이 너무 좋았고, 직원분들의 응대도 정말 친절했습니다. 다음에도 꼭 이용하고 싶어요.",
      category: "가수",
      status: "확인",
      isPublic: true,
      createdAt: "2023-06-10T15:30:00Z",
      updatedAt: "2023-06-10T16:00:00Z",
    },
    {
      id: "feed-002",
      customerId: dummyCustomers[2] ? dummyCustomers[2].id : "cust-003",
      customerName: dummyCustomers[2] ? dummyCustomers[2].name : "박준호",
      singerId: dummySingers[1] ? dummySingers[1].id : "sing-002",
      singerName: dummySingers[1] ? dummySingers[1].name : "이준호",
      contractId: "contract-124",
      rating: 3,
      content:
        "가수는 좋았으나 행사 당일 너무 늦게 도착해서 준비 시간이 부족했습니다. 이 부분이 개선되면 좋겠어요.",
      category: "일정",
      status: "처리중",
      isPublic: true,
      createdAt: "2023-06-08T09:45:00Z",
      updatedAt: "2023-06-09T10:20:00Z",
      response:
        "말씀해주신 일정 관련 문제 때문에 불편을 드려 정말 죄송합니다. 해당 문제를 담당자와 함께 검토 중이며, 개선 방안을 마련하고 있습니다.",
      responseAt: "2023-06-09T10:20:00Z",
    },
    {
      id: "feed-003",
      customerId: dummyCustomers[3] ? dummyCustomers[3].id : "cust-005",
      customerName: dummyCustomers[3] ? dummyCustomers[3].name : "최유진",
      singerId: dummySingers[2] ? dummySingers[2].id : "sing-008",
      singerName: dummySingers[2] ? dummySingers[2].name : "박서연",
      contractId: "contract-130",
      rating: 2,
      content:
        "계약 금액에 비해 서비스 질이 기대에 미치지 못했습니다. 가수 분의 공연은 좋았으나 음향 문제가 있었습니다.",
      category: "서비스",
      status: "처리중",
      isPublic: false,
      createdAt: "2023-06-05T18:10:00Z",
      updatedAt: "2023-06-06T09:30:00Z",
      response:
        "불편을 드려 죄송합니다. 음향 문제에 대해 자세히 알려주실 수 있을까요? 개선을 위해 추가 정보가 필요합니다.",
      responseAt: "2023-06-06T09:30:00Z",
    },
    {
      id: "feed-004",
      customerId: dummyCustomers[4] ? dummyCustomers[4].id : "cust-010",
      customerName: dummyCustomers[4] ? dummyCustomers[4].name : "권나은",
      singerId: dummySingers[0] ? dummySingers[0].id : "sing-001",
      singerName: dummySingers[0] ? dummySingers[0].name : "김태희",
      contractId: "contract-135",
      rating: 1,
      content:
        "가격이 너무 비쌉니다. 타 업체와 비교했을 때 20% 이상 차이가 났어요. 서비스 내용은 비슷한데 가격 차이가 너무 큽니다.",
      category: "가격",
      status: "신규",
      isPublic: false,
      createdAt: "2023-06-03T11:20:00Z",
      updatedAt: "2023-06-03T11:20:00Z",
    },
    {
      id: "feed-005",
      customerId: dummyCustomers[1] ? dummyCustomers[1].id : "cust-007",
      customerName: dummyCustomers[1] ? dummyCustomers[1].name : "이지영",
      singerId: dummySingers[1] ? dummySingers[1].id : "sing-004",
      singerName: dummySingers[1] ? dummySingers[1].name : "이준호",
      contractId: "contract-140",
      rating: 4,
      content:
        "전반적으로 만족스러웠습니다. 다만 계약 과정에서 소통이 조금 부족했던 점이 아쉽습니다.",
      category: "서비스",
      status: "완료",
      isPublic: true,
      createdAt: "2023-05-28T14:50:00Z",
      updatedAt: "2023-05-29T10:15:00Z",
      response:
        "소중한 피드백 감사합니다. 계약 과정의 소통 문제를 개선하기 위해 프로세스를 재검토하고 있습니다. 다음에는 더 나은 경험을 제공해 드리겠습니다.",
      responseAt: "2023-05-29T10:15:00Z",
    },
    {
      id: "feed-006",
      customerId: dummyCustomers[2] ? dummyCustomers[2].id : "cust-012",
      customerName: dummyCustomers[2] ? dummyCustomers[2].name : "박준호",
      singerId: dummySingers[2] ? dummySingers[2].id : "sing-007",
      singerName: dummySingers[2] ? dummySingers[2].name : "박서연",
      contractId: "contract-142",
      rating: 5,
      content:
        "정말 완벽한 서비스였습니다. 특히 담당자분의 세심한 배려와 전문성에 감동받았습니다. 다른 분들에게도 적극 추천하고 싶습니다.",
      category: "서비스",
      status: "확인",
      isPublic: true,
      createdAt: "2023-05-25T16:40:00Z",
      updatedAt: "2023-05-26T09:10:00Z",
    },
  ];
};

// 별점 컴포넌트
const StarRating = ({ rating }: { rating: number }) => {
  return (
    <div className="flex">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          className={`w-5 h-5 ${
            star <= rating ? "text-yellow-400" : "text-gray-300"
          }`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
};

// 피드백 상태 뱃지
const StatusBadge = ({ status }: { status: Feedback["status"] }) => {
  const getStatusColor = () => {
    switch (status) {
      case "신규":
        return "bg-blue-100 text-blue-800";
      case "확인":
        return "bg-yellow-100 text-yellow-800";
      case "처리중":
        return "bg-purple-100 text-purple-800";
      case "완료":
        return "bg-green-100 text-green-800";
      case "무시":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor()}`}
    >
      {status}
    </span>
  );
};

// 카테고리 뱃지
const CategoryBadge = ({ category }: { category: Feedback["category"] }) => {
  const getCategoryColor = () => {
    switch (category) {
      case "서비스":
        return "bg-indigo-100 text-indigo-800";
      case "가격":
        return "bg-red-100 text-red-800";
      case "가수":
        return "bg-pink-100 text-pink-800";
      case "일정":
        return "bg-orange-100 text-orange-800";
      case "기타":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryColor()}`}
    >
      {category}
    </span>
  );
};

export default function FeedbackPage() {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedFeedback, setSelectedFeedback] = useState<Feedback | null>(
    null
  );
  const [responseText, setResponseText] = useState("");
  const [filter, setFilter] = useState<{
    status: Feedback["status"] | "all";
    rating: number | "all";
    category: Feedback["category"] | "all";
    isPublic: boolean | "all";
  }>({
    status: "all",
    rating: "all",
    category: "all",
    isPublic: "all",
  });

  // 피드백 데이터 로드
  useEffect(() => {
    try {
      setIsLoading(true);
      // API 호출 대신 더미 데이터 사용
      setFeedbacks(generateDummyFeedbacks());
    } catch (error) {
      console.error("데이터 로드 오류:", error);
      toast.error("피드백 데이터를 불러오는데 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 필터링된 피드백
  const filteredFeedbacks = feedbacks.filter((feedback) => {
    const statusMatch =
      filter.status === "all" || feedback.status === filter.status;
    const ratingMatch =
      filter.rating === "all" || feedback.rating === filter.rating;
    const categoryMatch =
      filter.category === "all" || feedback.category === filter.category;
    const publicMatch =
      filter.isPublic === "all" || feedback.isPublic === filter.isPublic;
    return statusMatch && ratingMatch && categoryMatch && publicMatch;
  });

  // 필터 변경 핸들러
  const handleFilterChange = (
    e: React.ChangeEvent<HTMLSelectElement>,
    field: keyof typeof filter
  ) => {
    const value = e.target.value;
    setFilter({
      ...filter,
      [field]:
        value === "all"
          ? "all"
          : field === "rating"
          ? parseInt(value)
          : field === "isPublic"
          ? value === "true"
          : value,
    });
  };

  // 응답 제출 핸들러
  const handleResponseSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedFeedback) return;

    try {
      const updatedFeedbacks = feedbacks.map((feedback) => {
        if (feedback.id === selectedFeedback.id) {
          return {
            ...feedback,
            status: "처리중" as const,
            response: responseText,
            responseAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
        }
        return feedback;
      });

      setFeedbacks(updatedFeedbacks);
      setSelectedFeedback(null);
      setResponseText("");
      toast.success("피드백에 대한 응답이 처리되었습니다.");
    } catch (error) {
      console.error("응답 저장 오류:", error);
      toast.error("응답 저장에 실패했습니다.");
    }
  };

  // 상태 변경 핸들러
  const handleStatusChange = (id: string, newStatus: Feedback["status"]) => {
    try {
      const updatedFeedbacks = feedbacks.map((feedback) => {
        if (feedback.id === id) {
          return {
            ...feedback,
            status: newStatus,
            updatedAt: new Date().toISOString(),
          };
        }
        return feedback;
      });

      setFeedbacks(updatedFeedbacks);
      toast.success(`피드백 상태가 "${newStatus}"로 변경되었습니다.`);
    } catch (error) {
      console.error("상태 변경 오류:", error);
      toast.error("상태 변경에 실패했습니다.");
    }
  };

  // 공개 설정 변경 핸들러
  const handlePublicChange = (id: string) => {
    try {
      const updatedFeedbacks = feedbacks.map((feedback) => {
        if (feedback.id === id) {
          return {
            ...feedback,
            isPublic: !feedback.isPublic,
            updatedAt: new Date().toISOString(),
          };
        }
        return feedback;
      });

      setFeedbacks(updatedFeedbacks);
      toast.success(
        `피드백이 ${
          updatedFeedbacks.find((f) => f.id === id)?.isPublic
            ? "공개"
            : "비공개"
        }로 설정되었습니다.`
      );
    } catch (error) {
      console.error("공개 설정 변경 오류:", error);
      toast.error("공개 설정 변경에 실패했습니다.");
    }
  };

  // 날짜 포맷팅
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
      2,
      "0"
    )}-${String(date.getDate()).padStart(2, "0")} ${String(
      date.getHours()
    ).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <PageHeader title="고객 피드백" />

      <div className="mb-6 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-black">피드백 관리</h2>
          <p className="text-black mt-1">
            고객의 피드백을 확인하고 응답합니다.
          </p>
        </div>
      </div>

      {/* 필터링 */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <h3 className="text-lg font-bold text-black mb-4">필터</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label
              htmlFor="statusFilter"
              className="block text-sm font-medium text-black mb-1"
            >
              상태
            </label>
            <select
              id="statusFilter"
              className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
              value={filter.status}
              onChange={(e) => handleFilterChange(e, "status")}
            >
              <option value="all">모든 상태</option>
              <option value="신규">신규</option>
              <option value="확인">확인</option>
              <option value="처리중">처리중</option>
              <option value="완료">완료</option>
              <option value="무시">무시</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="ratingFilter"
              className="block text-sm font-medium text-black mb-1"
            >
              평점
            </label>
            <select
              id="ratingFilter"
              className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
              value={filter.rating}
              onChange={(e) => handleFilterChange(e, "rating")}
            >
              <option value="all">모든 평점</option>
              <option value="5">⭐⭐⭐⭐⭐ (5)</option>
              <option value="4">⭐⭐⭐⭐ (4)</option>
              <option value="3">⭐⭐⭐ (3)</option>
              <option value="2">⭐⭐ (2)</option>
              <option value="1">⭐ (1)</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="categoryFilter"
              className="block text-sm font-medium text-black mb-1"
            >
              카테고리
            </label>
            <select
              id="categoryFilter"
              className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
              value={filter.category}
              onChange={(e) => handleFilterChange(e, "category")}
            >
              <option value="all">모든 카테고리</option>
              <option value="서비스">서비스</option>
              <option value="가격">가격</option>
              <option value="가수">가수</option>
              <option value="일정">일정</option>
              <option value="기타">기타</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="publicFilter"
              className="block text-sm font-medium text-black mb-1"
            >
              공개 여부
            </label>
            <select
              id="publicFilter"
              className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
              value={String(filter.isPublic)}
              onChange={(e) => handleFilterChange(e, "isPublic")}
            >
              <option value="all">모든 피드백</option>
              <option value="true">공개</option>
              <option value="false">비공개</option>
            </select>
          </div>
        </div>
      </div>

      {/* 피드백 목록 */}
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
      ) : filteredFeedbacks.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <p className="text-black">피드백 데이터가 없습니다.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredFeedbacks.map((feedback) => (
            <div
              key={feedback.id}
              className="bg-white rounded-lg shadow-md p-6 transition-all hover:shadow-lg"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="text-lg font-bold text-black">
                      {feedback.customerName}
                    </h3>
                    <StatusBadge status={feedback.status} />
                    <CategoryBadge category={feedback.category} />
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        feedback.isPublic
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {feedback.isPublic ? "공개" : "비공개"}
                    </span>
                  </div>
                  <div className="text-sm text-black mt-1">
                    가수: {feedback.singerName || "정보 없음"} | 계약:{" "}
                    {feedback.contractId || "정보 없음"}
                  </div>
                  <div className="flex items-center space-x-2 mt-1">
                    <StarRating rating={feedback.rating} />
                    <span className="text-sm text-black">
                      {formatDate(feedback.createdAt)}
                    </span>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <div className="dropdown dropdown-end">
                    <button className="bg-white border border-gray-300 rounded-md py-1 px-3 text-xs font-medium text-black hover:bg-gray-50">
                      상태 변경
                    </button>
                    <div className="dropdown-content z-10 hidden absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1">
                      <button
                        onClick={() => handleStatusChange(feedback.id, "신규")}
                        className="block w-full text-left px-4 py-2 text-sm text-black hover:bg-gray-100"
                      >
                        신규
                      </button>
                      <button
                        onClick={() => handleStatusChange(feedback.id, "확인")}
                        className="block w-full text-left px-4 py-2 text-sm text-black hover:bg-gray-100"
                      >
                        확인
                      </button>
                      <button
                        onClick={() =>
                          handleStatusChange(feedback.id, "처리중")
                        }
                        className="block w-full text-left px-4 py-2 text-sm text-black hover:bg-gray-100"
                      >
                        처리중
                      </button>
                      <button
                        onClick={() => handleStatusChange(feedback.id, "완료")}
                        className="block w-full text-left px-4 py-2 text-sm text-black hover:bg-gray-100"
                      >
                        완료
                      </button>
                      <button
                        onClick={() => handleStatusChange(feedback.id, "무시")}
                        className="block w-full text-left px-4 py-2 text-sm text-black hover:bg-gray-100"
                      >
                        무시
                      </button>
                    </div>
                  </div>
                  <button
                    onClick={() => handlePublicChange(feedback.id)}
                    className="bg-white border border-gray-300 rounded-md py-1 px-3 text-xs font-medium text-black hover:bg-gray-50"
                  >
                    {feedback.isPublic ? "비공개로 변경" : "공개로 변경"}
                  </button>
                  <button
                    onClick={() => {
                      setSelectedFeedback(feedback);
                      setResponseText(feedback.response || "");
                    }}
                    className="bg-orange-500 border border-transparent rounded-md py-1 px-3 text-xs font-medium text-white hover:bg-orange-600"
                  >
                    응답
                  </button>
                </div>
              </div>

              <div className="bg-gray-50 rounded p-4 text-black">
                {feedback.content}
              </div>

              {feedback.response && (
                <div className="mt-4">
                  <h4 className="text-sm font-medium text-black mb-1">
                    응답
                    {feedback.responseAt &&
                      ` (${formatDate(feedback.responseAt)})`}
                  </h4>
                  <div className="bg-orange-50 rounded p-4 text-black">
                    {feedback.response}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* 응답 모달 */}
      {selectedFeedback && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg w-full max-w-2xl">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-black">피드백 응답</h3>
                <button
                  onClick={() => {
                    setSelectedFeedback(null);
                    setResponseText("");
                  }}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <div className="mb-4">
                <div className="bg-gray-50 rounded p-4 text-black">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="font-medium">
                      {selectedFeedback.customerName}
                    </span>
                    <StarRating rating={selectedFeedback.rating} />
                    <CategoryBadge category={selectedFeedback.category} />
                  </div>
                  {selectedFeedback.content}
                </div>
              </div>

              <form onSubmit={handleResponseSubmit}>
                <div className="mb-4">
                  <label
                    htmlFor="response"
                    className="block text-sm font-medium text-black mb-1"
                  >
                    응답 내용
                  </label>
                  <textarea
                    id="response"
                    rows={5}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                    value={responseText}
                    onChange={(e) => setResponseText(e.target.value)}
                    required
                  ></textarea>
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedFeedback(null);
                      setResponseText("");
                    }}
                    className="bg-white border border-gray-300 rounded-md shadow-sm py-2 px-4 text-sm font-medium text-black hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                  >
                    취소
                  </button>
                  <button
                    type="submit"
                    className="bg-orange-500 border border-transparent rounded-md shadow-sm py-2 px-4 text-sm font-medium text-white hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                  >
                    응답 저장
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
