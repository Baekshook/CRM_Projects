"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import PageHeader from "@/components/common/PageHeader";
import { reviews, singers, customers, contracts } from "@/utils/dummyData";
import { toast } from "react-hot-toast";

export default function ReviewsPage() {
  const router = useRouter();
  const [reviewsList, setReviewsList] = useState([...reviews]);
  const [selectedReviews, setSelectedReviews] = useState<string[]>([]);
  const [filters, setFilters] = useState({
    search: "",
    rating: "",
    status: "",
    sortBy: "createdAt",
    sortOrder: "desc",
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchReviews();
  }, [filters]);

  const fetchReviews = () => {
    try {
      setIsLoading(true);

      // 필터링 로직
      let filteredReviews = [...reviews];

      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        filteredReviews = filteredReviews.filter(
          (review) =>
            review.content.toLowerCase().includes(searchLower) ||
            review.customerName.toLowerCase().includes(searchLower) ||
            review.singerName.toLowerCase().includes(searchLower)
        );
      }

      if (filters.rating) {
        filteredReviews = filteredReviews.filter(
          (review) => review.rating === parseInt(filters.rating)
        );
      }

      if (filters.status) {
        filteredReviews = filteredReviews.filter(
          (review) => review.status === filters.status
        );
      }

      // 정렬
      filteredReviews.sort((a, b) => {
        if (filters.sortBy === "createdAt") {
          return filters.sortOrder === "asc"
            ? new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
            : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        } else if (filters.sortBy === "rating") {
          return filters.sortOrder === "asc"
            ? a.rating - b.rating
            : b.rating - a.rating;
        } else {
          // customerName
          return filters.sortOrder === "asc"
            ? a.customerName.localeCompare(b.customerName)
            : b.customerName.localeCompare(a.customerName);
        }
      });

      setReviewsList(filteredReviews);
    } catch (error) {
      console.error("리뷰 목록 불러오기 오류:", error);
      toast.error("리뷰 목록을 불러오는데 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilterChange = (newFilters: Partial<typeof filters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedReviews(reviewsList.map((review) => review.id));
    } else {
      setSelectedReviews([]);
    }
  };

  const handleSelectReview = (id: string) => {
    setSelectedReviews((prev) =>
      prev.includes(id) ? prev.filter((revId) => revId !== id) : [...prev, id]
    );
  };

  const handleDelete = (id: string) => {
    if (confirm("정말로 이 리뷰를 삭제하시겠습니까?")) {
      try {
        // 실제 앱에서는 API 호출
        const updatedReviews = reviewsList.filter((review) => review.id !== id);
        setReviewsList(updatedReviews);
        setSelectedReviews((prev) => prev.filter((revId) => revId !== id));
        toast.success("리뷰가 삭제되었습니다.");
      } catch (error) {
        toast.error("리뷰 삭제에 실패했습니다.");
      }
    }
  };

  const handleBulkDelete = () => {
    if (
      confirm(`선택된 ${selectedReviews.length}개 리뷰를 삭제하시겠습니까?`)
    ) {
      try {
        // 실제 앱에서는 API 호출
        const updatedReviews = reviewsList.filter(
          (review) => !selectedReviews.includes(review.id)
        );
        setReviewsList(updatedReviews);
        setSelectedReviews([]);
        toast.success(`${selectedReviews.length}개 리뷰가 삭제되었습니다.`);
      } catch (error) {
        toast.error("리뷰 삭제에 실패했습니다.");
      }
    }
  };

  const handleStatusChange = (
    id: string,
    newStatus: "published" | "hidden"
  ) => {
    try {
      // 실제 앱에서는 API 호출
      const updatedReviews = reviewsList.map((review) =>
        review.id === id ? { ...review, status: newStatus } : review
      );
      setReviewsList(updatedReviews);
      toast.success(
        `리뷰 상태가 ${
          newStatus === "published" ? "게시됨" : "숨김"
        }으로 변경되었습니다.`
      );
    } catch (error) {
      toast.error("리뷰 상태 변경에 실패했습니다.");
    }
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getCustomerLink = (customerId: string) => {
    return `/admin/customers/${customerId}`;
  };

  const getSingerLink = (singerId: string) => {
    return `/admin/customers/${singerId}`;
  };

  const getContractLink = (contractId: string) => {
    return `/admin/schedules/contracts/${contractId}`;
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <span key={i} className="text-xl">
            {i < rating ? "★" : "☆"}
          </span>
        ))}
        <span className="ml-2 text-gray-700">{rating}/5</span>
      </div>
    );
  };

  return (
    <div className="pb-10">
      <PageHeader
        title="후기/리뷰 관리"
        description="고객과 가수 간의 후기 및 리뷰를 관리합니다."
      />

      {/* 필터 및 액션 영역 */}
      <div className="mb-6 bg-white rounded-lg shadow p-4">
        <div className="flex flex-wrap justify-between items-center gap-4">
          {/* 검색 */}
          <div className="flex-grow max-w-md">
            <input
              type="text"
              placeholder="고객명, 가수명, 내용 검색..."
              value={filters.search}
              onChange={(e) => handleFilterChange({ search: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded-lg"
            />
          </div>

          {/* 필터 */}
          <div className="flex gap-2">
            <select
              value={filters.rating}
              onChange={(e) => handleFilterChange({ rating: e.target.value })}
              className="p-2 border border-gray-300 rounded-lg"
            >
              <option value="">모든 평점</option>
              {[1, 2, 3, 4, 5].map((rating) => (
                <option key={rating} value={rating}>
                  {rating}점
                </option>
              ))}
            </select>

            <select
              value={filters.status}
              onChange={(e) => handleFilterChange({ status: e.target.value })}
              className="p-2 border border-gray-300 rounded-lg"
            >
              <option value="">모든 상태</option>
              <option value="published">게시됨</option>
              <option value="hidden">숨김</option>
            </select>

            <select
              value={filters.sortBy}
              onChange={(e) => handleFilterChange({ sortBy: e.target.value })}
              className="p-2 border border-gray-300 rounded-lg"
            >
              <option value="createdAt">등록일</option>
              <option value="rating">평점</option>
              <option value="customerName">고객명</option>
            </select>

            <select
              value={filters.sortOrder}
              onChange={(e) =>
                handleFilterChange({ sortOrder: e.target.value })
              }
              className="p-2 border border-gray-300 rounded-lg"
            >
              <option value="desc">내림차순</option>
              <option value="asc">오름차순</option>
            </select>
          </div>

          {/* 버튼 */}
          <div className="flex gap-2">
            {selectedReviews.length > 0 && (
              <button
                onClick={handleBulkDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                {selectedReviews.length}개 삭제
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 리뷰 목록 */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {isLoading ? (
          <div className="p-6 text-center text-gray-500">
            리뷰를 불러오는 중...
          </div>
        ) : reviewsList.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            <p className="mb-4">등록된 리뷰가 없습니다.</p>
          </div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-8">
                  <input
                    type="checkbox"
                    checked={
                      selectedReviews.length === reviewsList.length &&
                      reviewsList.length > 0
                    }
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  리뷰 내용
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  평점
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  고객
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  가수
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  계약 정보
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  등록일
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  상태
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  관리
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {reviewsList.map((review) => (
                <tr key={review.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={selectedReviews.includes(review.id)}
                      onChange={() => handleSelectReview(review.id)}
                      className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 max-w-md">
                      {review.content}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {renderStars(review.rating)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <a
                      href={getCustomerLink(review.customerId)}
                      className="text-sm text-orange-600 hover:text-orange-900"
                    >
                      {review.customerName}
                    </a>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <a
                      href={getSingerLink(review.singerId)}
                      className="text-sm text-orange-600 hover:text-orange-900"
                    >
                      {review.singerName}
                    </a>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <a
                      href={getContractLink(review.contractId)}
                      className="text-sm text-orange-600 hover:text-orange-900"
                    >
                      계약 상세
                    </a>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(review.createdAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {review.status === "published" ? (
                      <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                        게시됨
                      </span>
                    ) : (
                      <span className="px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
                        숨김
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    {review.status === "published" ? (
                      <button
                        onClick={() => handleStatusChange(review.id, "hidden")}
                        className="text-orange-600 hover:text-orange-900 mr-3"
                      >
                        숨기기
                      </button>
                    ) : (
                      <button
                        onClick={() =>
                          handleStatusChange(review.id, "published")
                        }
                        className="text-green-600 hover:text-green-900 mr-3"
                      >
                        게시하기
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(review.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      삭제
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
