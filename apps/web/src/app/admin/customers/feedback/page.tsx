"use client";
import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import PageHeader from "@/components/common/PageHeader";
import customerApi from "@/services/customerApi";
import singerApi from "@/services/singerApi";
import axios from "axios";

// 피드백 타입 정의
interface Feedback {
  id: string;
  customerId: string;
  customerName: string;
  singerId?: string;
  singerName?: string;
  rating: number;
  content: string;
  category: "quality" | "service" | "communication" | "price" | "other";
  status: "new" | "inProgress" | "resolved" | "closed";
  createdAt: string;
  updatedAt: string;
  response?: string;
  responseAt?: string;
}

// API URL
const API_URL =
  "https://crm-backend-env-env.eba-m3mmahdu.ap-northeast-1.elasticbeanstalk.com/api";

// 별점 컴포넌트
function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center">
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
}

// 상태 뱃지 컴포넌트
function StatusBadge({ status }: { status: string }) {
  const getStatusStyles = () => {
    switch (status) {
      case "new":
        return "bg-blue-100 text-blue-800";
      case "inProgress":
        return "bg-yellow-100 text-yellow-800";
      case "resolved":
        return "bg-green-100 text-green-800";
      case "closed":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusLabel = () => {
    switch (status) {
      case "new":
        return "신규";
      case "inProgress":
        return "처리 중";
      case "resolved":
        return "해결됨";
      case "closed":
        return "종료";
      default:
        return status;
    }
  };

  return (
    <span
      className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusStyles()}`}
    >
      {getStatusLabel()}
    </span>
  );
}

// 카테고리 뱃지 컴포넌트
function CategoryBadge({ category }: { category: string }) {
  const getCategoryStyles = () => {
    switch (category) {
      case "quality":
        return "bg-purple-100 text-purple-800";
      case "service":
        return "bg-indigo-100 text-indigo-800";
      case "communication":
        return "bg-blue-100 text-blue-800";
      case "price":
        return "bg-green-100 text-green-800";
      case "other":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getCategoryLabel = () => {
    switch (category) {
      case "quality":
        return "품질";
      case "service":
        return "서비스";
      case "communication":
        return "의사소통";
      case "price":
        return "가격";
      case "other":
        return "기타";
      default:
        return category;
    }
  };

  return (
    <span
      className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryStyles()}`}
    >
      {getCategoryLabel()}
    </span>
  );
}

export default function FeedbackPage() {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showResponseForm, setShowResponseForm] = useState<string | null>(null);
  const [customers, setCustomers] = useState<any[]>([]);
  const [singers, setSingers] = useState<any[]>([]);
  const [responseText, setResponseText] = useState("");
  const [filter, setFilter] = useState({
    status: "all",
    category: "all",
    rating: "all",
  });

  const [newFeedback, setNewFeedback] = useState<Partial<Feedback>>({
    customerId: "",
    singerId: "",
    rating: 5,
    content: "",
    category: "quality",
    status: "new",
  });

  // 데이터 로드
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        // 고객 및 가수 데이터 로드
        const [customersData, singersData] = await Promise.all([
          customerApi.getAll(),
          singerApi.getAll(),
        ]);
        setCustomers(customersData);
        setSingers(singersData);

        // 피드백 데이터 로드
        try {
          const response = await axios.get(`${API_URL}/feedbacks`);
          setFeedbacks(response.data);
        } catch (error) {
          console.error("피드백 데이터 로드 오류:", error);
          // API 연결이 안되면 로컬 스토리지에서 불러오기
          const storedFeedback = localStorage.getItem("feedbacks");
          if (storedFeedback) {
            setFeedbacks(JSON.parse(storedFeedback));
          } else {
            // 초기 피드백이 없다면 빈 배열 사용
            setFeedbacks([]);
          }
        }
      } catch (error) {
        console.error("데이터 로드 오류:", error);
        toast.error("데이터를 불러오는데 실패했습니다.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // 피드백 변경시 로컬 스토리지에 저장
  useEffect(() => {
    if (feedbacks.length > 0) {
      localStorage.setItem("feedbacks", JSON.stringify(feedbacks));
    }
  }, [feedbacks]);

  // 필터링된 피드백 목록
  const filteredFeedbacks = feedbacks.filter((feedback) => {
    if (filter.status !== "all" && feedback.status !== filter.status) {
      return false;
    }

    if (filter.category !== "all" && feedback.category !== filter.category) {
      return false;
    }

    if (filter.rating !== "all") {
      const ratingValue = parseInt(filter.rating);
      if (feedback.rating !== ratingValue) {
        return false;
      }
    }

    return true;
  });

  // 필터 변경 핸들러
  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilter({
      ...filter,
      [name]: value,
    });
  };

  // 폼 입력 변경 핸들러
  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setNewFeedback({
      ...newFeedback,
      [name]: value,
    });
  };

  // 피드백 추가 핸들러
  const handleAddFeedback = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // 고객 이름 가져오기
      const selectedCustomer = customers.find(
        (c) => c.id === newFeedback.customerId
      );
      const selectedSinger = newFeedback.singerId
        ? singers.find((s) => s.id === newFeedback.singerId)
        : undefined;

      if (!selectedCustomer) {
        toast.error("고객을 선택해주세요.");
        return;
      }

      const now = new Date().toISOString();

      const feedbackData = {
        customerId: newFeedback.customerId || "",
        customerName: selectedCustomer.name,
        singerId: newFeedback.singerId || undefined,
        singerName: selectedSinger?.name,
        rating: newFeedback.rating || 5,
        content: newFeedback.content || "",
        category: newFeedback.category || "quality",
        status: "new",
        createdAt: now,
        updatedAt: now,
      };

      // API 호출하여 피드백 저장
      try {
        const response = await axios.post(`${API_URL}/feedbacks`, feedbackData);
        const newFeedbackWithId = response.data;
        setFeedbacks([...feedbacks, newFeedbackWithId]);
        toast.success("피드백이 추가되었습니다.");
      } catch (error) {
        console.error("피드백 저장 API 오류:", error);
        // API 연결이 안되면 로컬에만 저장
        const newId = `fb-${Math.floor(Math.random() * 1000)
          .toString()
          .padStart(3, "0")}`;
        const feedback: Feedback = {
          id: newId,
          ...(feedbackData as any),
        };
        setFeedbacks([...feedbacks, feedback]);
        toast.success("피드백이 추가되었습니다. (로컬에만 저장됨)");
      }

      setShowAddForm(false);
      setNewFeedback({
        customerId: "",
        singerId: "",
        rating: 5,
        content: "",
        category: "quality",
        status: "new",
      });
    } catch (error) {
      console.error("피드백 추가 오류:", error);
      toast.error("피드백 추가에 실패했습니다.");
    }
  };

  // 피드백 삭제 핸들러
  const handleDeleteFeedback = async (id: string) => {
    if (confirm("이 피드백을 삭제하시겠습니까?")) {
      try {
        // API 호출하여 피드백 삭제
        try {
          await axios.delete(`${API_URL}/feedbacks/${id}`);
        } catch (error) {
          console.error("피드백 삭제 API 오류:", error);
          // API 오류는 무시하고 UI에서만 삭제
        }

        setFeedbacks(feedbacks.filter((feedback) => feedback.id !== id));
        toast.success("피드백이 삭제되었습니다.");
      } catch (error) {
        console.error("피드백 삭제 오류:", error);
        toast.error("피드백 삭제에 실패했습니다.");
      }
    }
  };

  // 피드백 상태 업데이트 핸들러
  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      const now = new Date().toISOString();
      const updatedFeedbacks = feedbacks.map((feedback) => {
        if (feedback.id === id) {
          const updatedFeedback = {
            ...feedback,
            status: newStatus as any,
            updatedAt: now,
          };

          // API 호출하여 피드백 상태 업데이트
          try {
            axios.patch(`${API_URL}/feedbacks/${id}`, {
              status: newStatus,
              updatedAt: now,
            });
          } catch (error) {
            console.error("피드백 상태 업데이트 API 오류:", error);
            // API 오류는 무시하고 UI만 업데이트
          }

          return updatedFeedback;
        }
        return feedback;
      });

      setFeedbacks(updatedFeedbacks);
      toast.success("피드백 상태가 업데이트되었습니다.");
    } catch (error) {
      console.error("피드백 상태 업데이트 오류:", error);
      toast.error("피드백 상태 업데이트에 실패했습니다.");
    }
  };

  // 피드백 응답 저장 핸들러
  const handleSaveResponse = async (id: string) => {
    if (!responseText.trim()) {
      toast.error("응답 내용을 입력해주세요.");
      return;
    }

    try {
      const now = new Date().toISOString();
      const updatedFeedbacks = feedbacks.map((feedback) => {
        if (feedback.id === id) {
          const updatedFeedback = {
            ...feedback,
            response: responseText,
            responseAt: now,
            status: "inProgress" as const,
            updatedAt: now,
          };

          // API 호출하여 피드백 응답 업데이트
          try {
            axios.patch(`${API_URL}/feedbacks/${id}`, {
              response: responseText,
              responseAt: now,
              status: "inProgress",
              updatedAt: now,
            });
          } catch (error) {
            console.error("피드백 응답 업데이트 API 오류:", error);
            // API 오류는 무시하고 UI만 업데이트
          }

          return updatedFeedback;
        }
        return feedback;
      });

      setFeedbacks(updatedFeedbacks);
      setShowResponseForm(null);
      setResponseText("");
      toast.success("응답이 저장되었습니다.");
    } catch (error) {
      console.error("응답 저장 오류:", error);
      toast.error("응답 저장에 실패했습니다.");
    }
  };

  // 로딩 중 상태 처리
  if (isLoading) {
    return (
      <div className="p-6">
        <PageHeader
          title="고객 피드백"
          description="고객의 피드백을 관리합니다."
        />
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <PageHeader
        title="고객 피드백"
        description="고객의 피드백을 관리합니다."
      />

      {/* 필터 및 추가 버튼 */}
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div className="flex flex-wrap gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              상태
            </label>
            <select
              name="status"
              value={filter.status}
              onChange={handleFilterChange}
              className="border border-gray-300 rounded-md px-3 py-2 w-40"
            >
              <option value="all">모든 상태</option>
              <option value="new">신규</option>
              <option value="inProgress">처리 중</option>
              <option value="resolved">해결됨</option>
              <option value="closed">종료</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              카테고리
            </label>
            <select
              name="category"
              value={filter.category}
              onChange={handleFilterChange}
              className="border border-gray-300 rounded-md px-3 py-2 w-40"
            >
              <option value="all">모든 카테고리</option>
              <option value="quality">품질</option>
              <option value="service">서비스</option>
              <option value="communication">의사소통</option>
              <option value="price">가격</option>
              <option value="other">기타</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              별점
            </label>
            <select
              name="rating"
              value={filter.rating}
              onChange={handleFilterChange}
              className="border border-gray-300 rounded-md px-3 py-2 w-40"
            >
              <option value="all">모든 평점</option>
              <option value="5">5점</option>
              <option value="4">4점</option>
              <option value="3">3점</option>
              <option value="2">2점</option>
              <option value="1">1점</option>
            </select>
          </div>
        </div>
        <div>
          <button
            onClick={() => setShowAddForm(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            피드백 추가
          </button>
        </div>
      </div>

      {/* 피드백 추가 폼 */}
      {showAddForm && (
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">새 피드백 추가</h2>
          <form onSubmit={handleAddFeedback} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  고객*
                </label>
                <select
                  name="customerId"
                  value={newFeedback.customerId}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                >
                  <option value="">고객 선택</option>
                  {customers.map((customer) => (
                    <option key={customer.id} value={customer.id}>
                      {customer.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  가수 (선택사항)
                </label>
                <select
                  name="singerId"
                  value={newFeedback.singerId}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="">가수 선택</option>
                  {singers.map((singer) => (
                    <option key={singer.id} value={singer.id}>
                      {singer.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                카테고리
              </label>
              <select
                name="category"
                value={newFeedback.category}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="quality">품질</option>
                <option value="service">서비스</option>
                <option value="communication">의사소통</option>
                <option value="price">가격</option>
                <option value="other">기타</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                별점
              </label>
              <div className="flex space-x-4">
                {[1, 2, 3, 4, 5].map((value) => (
                  <label key={value} className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="rating"
                      value={value}
                      checked={Number(newFeedback.rating) === value}
                      onChange={handleInputChange}
                      className="w-4 h-4 text-blue-600"
                    />
                    <span>{value}점</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                내용*
              </label>
              <textarea
                name="content"
                value={newFeedback.content}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-100 transition"
              >
                취소
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
              >
                피드백 제출
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 피드백 목록 */}
      {filteredFeedbacks.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-6 text-center text-gray-500">
          피드백이 없습니다.
        </div>
      ) : (
        <div className="space-y-6">
          {filteredFeedbacks.map((feedback) => (
            <div
              key={feedback.id}
              className="bg-white rounded-lg shadow overflow-hidden"
            >
              <div className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center space-x-3">
                      <h3 className="text-lg font-semibold">
                        {feedback.customerName}
                      </h3>
                      {feedback.singerName && (
                        <span className="text-gray-600">
                          {">"} {feedback.singerName}
                        </span>
                      )}
                      <StarRating rating={feedback.rating} />
                    </div>
                    <div className="flex space-x-2 mt-2">
                      <StatusBadge status={feedback.status} />
                      <CategoryBadge category={feedback.category} />
                      <span className="text-gray-500 text-sm">
                        {new Date(feedback.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <div className="relative">
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          const dropdownButton =
                            e.currentTarget.nextElementSibling;
                          if (dropdownButton) {
                            dropdownButton.classList.toggle("hidden");
                          }
                        }}
                        className="text-gray-500 hover:text-gray-700 focus:outline-none"
                      >
                        <svg
                          className="h-5 w-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                          />
                        </svg>
                      </button>
                      <div className="hidden absolute right-0 z-10 mt-2 w-48 bg-white rounded-md shadow-lg py-1">
                        <button
                          onClick={() => handleDeleteFeedback(feedback.id)}
                          className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                        >
                          삭제
                        </button>
                        <div className="border-t border-gray-100 my-1"></div>
                        {feedback.status !== "new" && (
                          <button
                            onClick={() =>
                              handleUpdateStatus(feedback.id, "new")
                            }
                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            신규로 변경
                          </button>
                        )}
                        {feedback.status !== "inProgress" && (
                          <button
                            onClick={() =>
                              handleUpdateStatus(feedback.id, "inProgress")
                            }
                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            처리 중으로 변경
                          </button>
                        )}
                        {feedback.status !== "resolved" && (
                          <button
                            onClick={() =>
                              handleUpdateStatus(feedback.id, "resolved")
                            }
                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            해결됨으로 변경
                          </button>
                        )}
                        {feedback.status !== "closed" && (
                          <button
                            onClick={() =>
                              handleUpdateStatus(feedback.id, "closed")
                            }
                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            종료로 변경
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 text-gray-700">
                  <p>{feedback.content}</p>
                </div>

                {feedback.response && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <h4 className="text-sm font-medium text-gray-600 mb-1">
                      응답 (
                      {new Date(feedback.responseAt || "").toLocaleDateString()}
                      )
                    </h4>
                    <p className="text-gray-700">{feedback.response}</p>
                  </div>
                )}

                {!feedback.response && feedback.status !== "closed" && (
                  <div className="mt-4">
                    {showResponseForm === feedback.id ? (
                      <div>
                        <textarea
                          value={responseText}
                          onChange={(e) => setResponseText(e.target.value)}
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md"
                          placeholder="응답을 입력하세요..."
                        />
                        <div className="flex justify-end space-x-2 mt-2">
                          <button
                            onClick={() => {
                              setShowResponseForm(null);
                              setResponseText("");
                            }}
                            className="px-3 py-1 border border-gray-300 text-gray-700 rounded hover:bg-gray-100 transition text-sm"
                          >
                            취소
                          </button>
                          <button
                            onClick={() => handleSaveResponse(feedback.id)}
                            className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition text-sm"
                          >
                            응답 저장
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => setShowResponseForm(feedback.id)}
                        className="text-blue-600 hover:text-blue-800 text-sm"
                      >
                        응답 작성
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
