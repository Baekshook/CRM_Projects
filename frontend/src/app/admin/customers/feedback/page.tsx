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

// 더미 피드백 데이터
const dummyFeedbacks: Feedback[] = [
  {
    id: "feed-001",
    customerId: "cust-001",
    customerName: "김민수",
    singerId: "sing-005",
    singerName: "이지은",
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
    customerId: "cust-003",
    customerName: "박지성",
    singerId: "sing-002",
    singerName: "김범수",
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
    customerId: "cust-005",
    customerName: "이영희",
    singerId: "sing-008",
    singerName: "정준영",
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
    customerId: "cust-010",
    customerName: "정태영",
    singerId: "sing-001",
    singerName: "아이유",
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
    customerId: "cust-007",
    customerName: "최유리",
    singerId: "sing-004",
    singerName: "성시경",
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
    customerId: "cust-012",
    customerName: "강동원",
    singerId: "sing-007",
    singerName: "거미",
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
      setFeedbacks(dummyFeedbacks);
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
        value === "all" ? "all" : field === "rating" ? parseInt(value) : value,
    });
  };

  // 피드백 응답 제출 핸들러
  const handleResponseSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedFeedback) return;

    try {
      // 실제 환경에서는 API 호출로 응답 저장
      const now = new Date().toISOString();
      const updatedFeedbacks = feedbacks.map((feedback) => {
        if (feedback.id === selectedFeedback.id) {
          return {
            ...feedback,
            response: responseText,
            responseAt: now,
            status: "처리중" as Feedback["status"],
            updatedAt: now,
          };
        }
        return feedback;
      });

      setFeedbacks(updatedFeedbacks);
      setSelectedFeedback(null);
      setResponseText("");
      toast.success("응답이 저장되었습니다.");
    } catch (error) {
      console.error("응답 저장 오류:", error);
      toast.error("응답 저장에 실패했습니다.");
    }
  };

  // 피드백 상태 변경 핸들러
  const handleStatusChange = (id: string, newStatus: Feedback["status"]) => {
    try {
      // 실제 환경에서는 API 호출로 상태 변경
      const now = new Date().toISOString();
      const updatedFeedbacks = feedbacks.map((feedback) => {
        if (feedback.id === id) {
          return {
            ...feedback,
            status: newStatus,
            updatedAt: now,
          };
        }
        return feedback;
      });

      setFeedbacks(updatedFeedbacks);
      toast.success("상태가 변경되었습니다.");
    } catch (error) {
      console.error("상태 변경 오류:", error);
      toast.error("상태 변경에 실패했습니다.");
    }
  };

  // 피드백 공개 여부 변경 핸들러
  const handlePublicChange = (id: string) => {
    try {
      // 실제 환경에서는 API 호출로 공개 여부 변경
      const now = new Date().toISOString();
      const updatedFeedbacks = feedbacks.map((feedback) => {
        if (feedback.id === id) {
          return {
            ...feedback,
            isPublic: !feedback.isPublic,
            updatedAt: now,
          };
        }
        return feedback;
      });

      setFeedbacks(updatedFeedbacks);
      toast.success("공개 설정이 변경되었습니다.");
    } catch (error) {
      console.error("공개 설정 변경 오류:", error);
      toast.error("공개 설정 변경에 실패했습니다.");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <PageHeader
        title="고객 피드백 관리"
        description="서비스에 대한 고객의 피드백과 평가를 관리합니다."
      />

      {/* 필터 */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="flex flex-wrap gap-4 items-center">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              상태
            </label>
            <select
              value={filter.status}
              onChange={(e) => handleFilterChange(e, "status")}
              className="border-gray-300 rounded-md shadow-sm focus:border-orange-500 focus:ring-orange-500"
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
            <label className="block text-sm font-medium text-gray-700 mb-1">
              별점
            </label>
            <select
              value={filter.rating}
              onChange={(e) => handleFilterChange(e, "rating")}
              className="border-gray-300 rounded-md shadow-sm focus:border-orange-500 focus:ring-orange-500"
            >
              <option value="all">모든 별점</option>
              <option value="5">5점</option>
              <option value="4">4점</option>
              <option value="3">3점</option>
              <option value="2">2점</option>
              <option value="1">1점</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              카테고리
            </label>
            <select
              value={filter.category}
              onChange={(e) => handleFilterChange(e, "category")}
              className="border-gray-300 rounded-md shadow-sm focus:border-orange-500 focus:ring-orange-500"
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
            <label className="block text-sm font-medium text-gray-700 mb-1">
              공개 여부
            </label>
            <select
              value={
                filter.isPublic === "all"
                  ? "all"
                  : filter.isPublic
                  ? "true"
                  : "false"
              }
              onChange={(e) =>
                setFilter({
                  ...filter,
                  isPublic:
                    e.target.value === "all"
                      ? "all"
                      : e.target.value === "true",
                })
              }
              className="border-gray-300 rounded-md shadow-sm focus:border-orange-500 focus:ring-orange-500"
            >
              <option value="all">모두</option>
              <option value="true">공개</option>
              <option value="false">비공개</option>
            </select>
          </div>
        </div>
      </div>

      {/* 피드백 응답 모달 */}
      {selectedFeedback && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-2xl w-full">
            <div className="flex justify-between items-start">
              <h3 className="text-lg font-semibold">피드백 응답</h3>
              <button
                onClick={() => {
                  setSelectedFeedback(null);
                  setResponseText("");
                }}
                className="text-gray-400 hover:text-gray-600"
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
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="mt-4 p-4 bg-gray-50 rounded-md">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-medium">
                    {selectedFeedback.customerName}
                  </h4>
                  <p className="text-sm text-gray-500">
                    {new Date(selectedFeedback.createdAt).toLocaleDateString()}{" "}
                    ·
                    {selectedFeedback.singerName &&
                      ` 가수: ${selectedFeedback.singerName} · `}
                    <CategoryBadge category={selectedFeedback.category} />
                  </p>
                </div>
                <StarRating rating={selectedFeedback.rating} />
              </div>
              <p className="mt-2">{selectedFeedback.content}</p>
            </div>

            <form onSubmit={handleResponseSubmit} className="mt-4">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  응답
                </label>
                <textarea
                  value={responseText}
                  onChange={(e) => setResponseText(e.target.value)}
                  rows={4}
                  className="w-full border-gray-300 rounded-md shadow-sm focus:border-orange-500 focus:ring-orange-500"
                  placeholder="고객에게 응답할 내용을 입력하세요."
                  required
                />
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedFeedback(null);
                    setResponseText("");
                  }}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600"
                >
                  응답 저장
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 피드백 목록 */}
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <p className="text-gray-500">데이터를 불러오는 중...</p>
        </div>
      ) : filteredFeedbacks.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <p className="text-gray-500">조건에 맞는 피드백이 없습니다.</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md">
          {filteredFeedbacks.map((feedback) => (
            <div
              key={feedback.id}
              className="p-6 border-b border-gray-200 last:border-b-0 hover:bg-gray-50"
            >
              <div className="flex justify-between items-start">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center">
                      <span className="text-white font-bold">
                        {feedback.customerName.charAt(0)}
                      </span>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-medium">{feedback.customerName}</h3>
                    <div className="flex flex-wrap items-center text-sm text-gray-500 space-x-2 mt-1">
                      <span>
                        {new Date(feedback.createdAt).toLocaleDateString()}
                      </span>
                      <span>·</span>
                      <StarRating rating={feedback.rating} />
                      <span>·</span>
                      <CategoryBadge category={feedback.category} />
                      <span>·</span>
                      <StatusBadge status={feedback.status} />
                      {feedback.isPublic ? (
                        <span className="inline-flex items-center text-green-600 text-xs">
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
                              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                            />
                          </svg>
                          공개
                        </span>
                      ) : (
                        <span className="inline-flex items-center text-gray-400 text-xs">
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
                              d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18"
                            />
                          </svg>
                          비공개
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handlePublicChange(feedback.id)}
                    className="text-gray-400 hover:text-gray-600"
                    title={feedback.isPublic ? "비공개로 변경" : "공개로 변경"}
                  >
                    {feedback.isPublic ? (
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
                          d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18"
                        />
                      </svg>
                    ) : (
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
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                    )}
                  </button>

                  <div className="relative group">
                    <button
                      className="text-gray-400 hover:text-gray-600"
                      title="상태 변경"
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
                          d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                        />
                      </svg>
                    </button>
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg hidden group-hover:block z-10">
                      <div className="py-1">
                        <button
                          onClick={() =>
                            handleStatusChange(feedback.id, "신규")
                          }
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                        >
                          신규로 변경
                        </button>
                        <button
                          onClick={() =>
                            handleStatusChange(feedback.id, "확인")
                          }
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                        >
                          확인으로 변경
                        </button>
                        <button
                          onClick={() =>
                            handleStatusChange(feedback.id, "처리중")
                          }
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                        >
                          처리중으로 변경
                        </button>
                        <button
                          onClick={() =>
                            handleStatusChange(feedback.id, "완료")
                          }
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                        >
                          완료로 변경
                        </button>
                        <button
                          onClick={() =>
                            handleStatusChange(feedback.id, "무시")
                          }
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                        >
                          무시로 변경
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-3">
                <p className="text-gray-700">{feedback.content}</p>
              </div>

              {feedback.response && (
                <div className="mt-4 pl-4 border-l-4 border-orange-200">
                  <div className="flex justify-between items-center">
                    <p className="text-sm font-medium">담당자 응답</p>
                    <p className="text-xs text-gray-500">
                      {new Date(feedback.responseAt || "").toLocaleDateString()}
                    </p>
                  </div>
                  <p className="text-sm mt-1 text-gray-600">
                    {feedback.response}
                  </p>
                </div>
              )}

              <div className="mt-4 flex justify-between items-center">
                <div>
                  {feedback.singerId && (
                    <div className="text-sm text-gray-500">
                      가수: {feedback.singerName}
                    </div>
                  )}
                </div>

                {!feedback.response && (
                  <button
                    onClick={() => {
                      setSelectedFeedback(feedback);
                      setResponseText(feedback.response || "");
                    }}
                    className="text-sm text-orange-600 hover:text-orange-700 font-medium"
                  >
                    응답하기
                  </button>
                )}

                {feedback.response && (
                  <button
                    onClick={() => {
                      setSelectedFeedback(feedback);
                      setResponseText(feedback.response || "");
                    }}
                    className="text-sm text-gray-600 hover:text-gray-700"
                  >
                    응답 수정
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
