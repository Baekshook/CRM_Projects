"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import PageHeader from "@/components/common/PageHeader";
import { singers } from "@/utils/dummyData";
import { toast } from "react-hot-toast";

// 섭외 공고 인터페이스
interface Recruitment {
  id: string;
  title: string;
  description: string;
  genre: string;
  location: string;
  eventDate: string;
  budget: string;
  requirements: string;
  status: "open" | "closed" | "draft";
  createdAt: string;
  updatedAt: string;
  applicants: number;
}

export default function RecruitmentsPage() {
  const router = useRouter();
  const [recruitments, setRecruitments] = useState<Recruitment[]>([]);
  const [selectedRecruitments, setSelectedRecruitments] = useState<string[]>(
    []
  );
  const [filters, setFilters] = useState({
    search: "",
    status: "",
    sortBy: "createdAt",
    sortOrder: "desc",
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchRecruitments();
  }, [filters]);

  // 샘플 섭외 공고 데이터
  const dummyRecruitments: Recruitment[] = [
    {
      id: "REC-001",
      title: "신년 기업 행사 가수 섭외",
      description: "2026년 1월 신년 기업 행사에 출연할 가수를 모집합니다.",
      genre: "발라드",
      location: "서울 강남구",
      eventDate: "2026-01-15",
      budget: "3,000,000",
      requirements: "30분 내외 공연, 댄서 포함",
      status: "open",
      createdAt: "2025-10-15T10:30:00Z",
      updatedAt: "2025-10-15T10:30:00Z",
      applicants: 3,
    },
    {
      id: "REC-002",
      title: "대학 축제 헤드라이너 모집",
      description:
        "서울대학교 축제 마지막 날 헤드라이너로 출연할 가수를 찾습니다.",
      genre: "댄스",
      location: "서울 관악구",
      eventDate: "2025-05-20",
      budget: "5,000,000",
      requirements: "90분 이상 단독 공연, 인기곡 위주",
      status: "open",
      createdAt: "2025-02-10T14:15:00Z",
      updatedAt: "2025-02-15T09:20:00Z",
      applicants: 5,
    },
    {
      id: "REC-003",
      title: "결혼식 축가 요청",
      description: "5월 결혼식 축가로 참여할 발라드 가수를 찾습니다.",
      genre: "발라드",
      location: "부산 해운대구",
      eventDate: "2025-05-10",
      budget: "1,500,000",
      requirements: "결혼식 축가 2곡, 경험자 우대",
      status: "closed",
      createdAt: "2025-01-20T11:45:00Z",
      updatedAt: "2025-02-28T16:30:00Z",
      applicants: 2,
    },
    {
      id: "REC-004",
      title: "기업 송년회 공연자 모집",
      description: "2025년 송년회 행사를 위한 가수를 찾습니다.",
      genre: "팝",
      location: "서울 여의도",
      eventDate: "2025-12-20",
      budget: "4,000,000",
      requirements: "60분 공연, 외국어 가능자 우대",
      status: "open",
      createdAt: "2025-09-05T09:30:00Z",
      updatedAt: "2025-09-10T11:15:00Z",
      applicants: 0,
    },
    {
      id: "REC-005",
      title: "신제품 런칭 행사 가수 모집",
      description: "화장품 브랜드 신제품 런칭 행사에 참여할 가수를 모집합니다.",
      genre: "R&B",
      location: "서울 명동",
      eventDate: "2025-04-15",
      budget: "3,500,000",
      requirements: "45분 공연, 브랜드 이미지와 부합하는 아티스트",
      status: "draft",
      createdAt: "2025-02-01T15:20:00Z",
      updatedAt: "2025-02-01T15:20:00Z",
      applicants: 0,
    },
  ];

  const fetchRecruitments = () => {
    try {
      setIsLoading(true);

      // 실제 앱에서는 API 호출로 데이터 가져오기
      // setRecruitments(await apiCall('/api/recruitments'));

      // 필터링 로직
      let filteredRecruitments = [...dummyRecruitments];

      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        filteredRecruitments = filteredRecruitments.filter(
          (recruitment) =>
            recruitment.title.toLowerCase().includes(searchLower) ||
            recruitment.description.toLowerCase().includes(searchLower) ||
            recruitment.genre.toLowerCase().includes(searchLower) ||
            recruitment.location.toLowerCase().includes(searchLower)
        );
      }

      if (filters.status) {
        filteredRecruitments = filteredRecruitments.filter(
          (recruitment) => recruitment.status === filters.status
        );
      }

      // 정렬
      filteredRecruitments.sort((a, b) => {
        if (filters.sortBy === "title") {
          return filters.sortOrder === "asc"
            ? a.title.localeCompare(b.title)
            : b.title.localeCompare(a.title);
        } else if (filters.sortBy === "createdAt") {
          return filters.sortOrder === "asc"
            ? new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
            : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        } else if (filters.sortBy === "eventDate") {
          return filters.sortOrder === "asc"
            ? new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime()
            : new Date(b.eventDate).getTime() - new Date(a.eventDate).getTime();
        } else {
          return filters.sortOrder === "asc"
            ? parseInt(a.budget.replace(/,/g, "")) -
                parseInt(b.budget.replace(/,/g, ""))
            : parseInt(b.budget.replace(/,/g, "")) -
                parseInt(a.budget.replace(/,/g, ""));
        }
      });

      setRecruitments(filteredRecruitments);
    } catch (error) {
      console.error("섭외 공고 목록 불러오기 오류:", error);
      toast.error("섭외 공고 목록을 불러오는데 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilterChange = (newFilters: Partial<typeof filters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedRecruitments(
        recruitments.map((recruitment) => recruitment.id)
      );
    } else {
      setSelectedRecruitments([]);
    }
  };

  const handleSelectRecruitment = (id: string) => {
    setSelectedRecruitments((prev) =>
      prev.includes(id) ? prev.filter((recId) => recId !== id) : [...prev, id]
    );
  };

  const handleDelete = (id: string) => {
    if (confirm("정말로 이 섭외 공고를 삭제하시겠습니까?")) {
      try {
        // 실제 앱에서는 API 호출
        const updatedRecruitments = recruitments.filter(
          (recruitment) => recruitment.id !== id
        );
        setRecruitments(updatedRecruitments);
        setSelectedRecruitments((prev) => prev.filter((recId) => recId !== id));
        toast.success("섭외 공고가 삭제되었습니다.");
      } catch (error) {
        toast.error("섭외 공고 삭제에 실패했습니다.");
      }
    }
  };

  const handleBulkDelete = () => {
    if (
      confirm(
        `선택된 ${selectedRecruitments.length}개 섭외 공고를 삭제하시겠습니까?`
      )
    ) {
      try {
        // 실제 앱에서는 API 호출
        const updatedRecruitments = recruitments.filter(
          (recruitment) => !selectedRecruitments.includes(recruitment.id)
        );
        setRecruitments(updatedRecruitments);
        setSelectedRecruitments([]);
        toast.success(
          `${selectedRecruitments.length}개 섭외 공고가 삭제되었습니다.`
        );
      } catch (error) {
        toast.error("섭외 공고 삭제에 실패했습니다.");
      }
    }
  };

  const handleCreate = () => {
    // 섭외 공고 생성 페이지로 이동 (실제 구현시)
    router.push("/admin/recruitments/new");
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "open":
        return (
          <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
            진행중
          </span>
        );
      case "closed":
        return (
          <span className="px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
            마감
          </span>
        );
      case "draft":
        return (
          <span className="px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
            임시저장
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="pb-10">
      <PageHeader
        title="섭외 공고 관리"
        description="가수 섭외를 위한 공고를 관리하고 지원자를 확인합니다."
      />

      {/* 필터 및 액션 영역 */}
      <div className="mb-6 bg-white rounded-lg shadow p-4">
        <div className="flex flex-wrap justify-between items-center gap-4">
          {/* 검색 */}
          <div className="flex-grow max-w-md">
            <input
              type="text"
              placeholder="제목, 설명, 장르, 지역 검색..."
              value={filters.search}
              onChange={(e) => handleFilterChange({ search: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded-lg"
            />
          </div>

          {/* 필터 */}
          <div className="flex gap-2">
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange({ status: e.target.value })}
              className="p-2 border border-gray-300 rounded-lg"
            >
              <option value="">모든 상태</option>
              <option value="open">진행중</option>
              <option value="closed">마감</option>
              <option value="draft">임시저장</option>
            </select>

            <select
              value={filters.sortBy}
              onChange={(e) => handleFilterChange({ sortBy: e.target.value })}
              className="p-2 border border-gray-300 rounded-lg"
            >
              <option value="createdAt">등록일</option>
              <option value="eventDate">행사일</option>
              <option value="title">제목</option>
              <option value="budget">예산</option>
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
            {selectedRecruitments.length > 0 && (
              <button
                onClick={handleBulkDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                {selectedRecruitments.length}개 삭제
              </button>
            )}
            <button
              onClick={handleCreate}
              className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
            >
              새 공고 등록
            </button>
          </div>
        </div>
      </div>

      {/* 섭외 공고 목록 */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {isLoading ? (
          <div className="p-6 text-center text-gray-500">
            섭외 공고를 불러오는 중...
          </div>
        ) : recruitments.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            <p className="mb-4">등록된 섭외 공고가 없습니다.</p>
            <button
              onClick={handleCreate}
              className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
            >
              새 공고 등록
            </button>
          </div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-8">
                  <input
                    type="checkbox"
                    checked={
                      selectedRecruitments.length === recruitments.length &&
                      recruitments.length > 0
                    }
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  공고
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  장르
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  지역
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  행사일
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  예산
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  상태
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  지원자
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  관리
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {recruitments.map((recruitment) => (
                <tr key={recruitment.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={selectedRecruitments.includes(recruitment.id)}
                      onChange={() => handleSelectRecruitment(recruitment.id)}
                      className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {recruitment.title}
                      </div>
                      <div className="text-sm text-gray-500 line-clamp-2">
                        {recruitment.description}
                      </div>
                      <div className="text-xs text-gray-400 mt-1">
                        등록일: {formatDate(recruitment.createdAt)}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {recruitment.genre}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {recruitment.location}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(recruitment.eventDate)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {recruitment.budget}원
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(recruitment.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {recruitment.applicants}명
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      className="text-orange-600 hover:text-orange-900 mr-3"
                      onClick={() =>
                        router.push(`/admin/recruitments/${recruitment.id}`)
                      }
                    >
                      상세
                    </button>
                    <button
                      onClick={() => handleDelete(recruitment.id)}
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
