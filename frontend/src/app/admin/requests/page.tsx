"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

// 요청서 타입 정의
interface Request {
  id: string;
  title: string;
  customer: string;
  date: string;
  status: string;
  budget: string;
  location: string;
  attendees: number;
}

export default function RequestsPage() {
  const router = useRouter();
  // 필터 상태
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [dateFilter, setDateFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // 액션 상태
  const [activeRequestId, setActiveRequestId] = useState<string | null>(null);

  // 샘플 요청서 데이터
  const requests: Request[] = [
    {
      id: "REQ-001",
      title: "연간 기업 행사",
      customer: "(주)이벤트 플래닝",
      date: "2025-02-10",
      status: "협상 진행",
      budget: "5,000,000원",
      location: "서울 강남구 삼성동",
      attendees: 150,
    },
    {
      id: "REQ-002",
      title: "결혼식 축가",
      customer: "웨딩 홀 A",
      date: "2025-02-12",
      status: "견적 완료",
      budget: "1,200,000원",
      location: "서울 서초구 반포동",
      attendees: 200,
    },
    {
      id: "REQ-003",
      title: "대학 축제 공연",
      customer: "대학 축제 위원회",
      date: "2025-03-15",
      status: "검토중",
      budget: "3,500,000원",
      location: "서울 관악구",
      attendees: 500,
    },
    {
      id: "REQ-004",
      title: "기업 봄맞이 행사",
      customer: "(주)테크놀로지",
      date: "2025-03-05",
      status: "견적 완료",
      budget: "4,200,000원",
      location: "서울 영등포구",
      attendees: 120,
    },
    {
      id: "REQ-005",
      title: "지역 축제 공연",
      customer: "OO시 문화재단",
      date: "2025-02-25",
      status: "요청중",
      budget: "2,800,000원",
      location: "경기도 고양시",
      attendees: 300,
    },
    {
      id: "REQ-006",
      title: "신제품 론칭 행사",
      customer: "(주)코스메틱 브랜드",
      date: "2025-02-05",
      status: "협상 진행",
      budget: "3,000,000원",
      location: "서울 강남구 신사동",
      attendees: 100,
    },
    {
      id: "REQ-007",
      title: "방송 프로그램 출연",
      customer: "OO방송국",
      date: "2025-02-08",
      status: "견적 완료",
      budget: "2,500,000원",
      location: "서울 마포구",
      attendees: 50,
    },
    {
      id: "REQ-008",
      title: "봄맞이 특별 공연",
      customer: "OO쇼핑몰",
      date: "2025-04-15",
      status: "협상 진행",
      budget: "1,800,000원",
      location: "서울 중구",
      attendees: 200,
    },
    {
      id: "REQ-009",
      title: "기업 창립 기념일 행사",
      customer: "(주)테크 솔루션",
      date: "2025-04-10",
      status: "견적 완료",
      budget: "4,500,000원",
      location: "경기도 성남시 분당구",
      attendees: 180,
    },
    {
      id: "REQ-010",
      title: "라디오 공개방송",
      customer: "OO라디오",
      date: "2025-04-05",
      status: "협상 진행",
      budget: "1,500,000원",
      location: "서울 영등포구",
      attendees: 80,
    },
    {
      id: "REQ-011",
      title: "사내 워크숍 축하공연",
      customer: "(주)글로벌 테크",
      date: "2025-02-20",
      status: "견적 완료",
      budget: "2,200,000원",
      location: "강원도 평창",
      attendees: 70,
    },
    {
      id: "REQ-012",
      title: "벚꽃 축제 공연",
      customer: "OO구청",
      date: "2025-03-25",
      status: "검토중",
      budget: "3,000,000원",
      location: "서울 여의도 공원",
      attendees: 400,
    },
    {
      id: "REQ-013",
      title: "신간 북콘서트",
      customer: "OO출판사",
      date: "2025-03-01",
      status: "요청중",
      budget: "1,000,000원",
      location: "서울 종로구",
      attendees: 60,
    },
    {
      id: "REQ-014",
      title: "브랜드 팝업스토어 이벤트",
      customer: "(주)패션 그룹",
      date: "2025-04-30",
      status: "협상 진행",
      budget: "2,800,000원",
      location: "서울 강남구",
      attendees: 120,
    },
    {
      id: "REQ-015",
      title: "어린이날 특별공연",
      customer: "OO테마파크",
      date: "2025-04-20",
      status: "견적 완료",
      budget: "3,200,000원",
      location: "경기도 용인시",
      attendees: 250,
    },
    {
      id: "REQ-016",
      title: "대기업 채용설명회 축하공연",
      customer: "(주)대형그룹",
      date: "2025-03-10",
      status: "견적 완료",
      budget: "1,800,000원",
      location: "서울 송파구",
      attendees: 150,
    },
    {
      id: "REQ-017",
      title: "스포츠 브랜드 런칭쇼",
      customer: "글로벌 스포츠",
      date: "2025-04-01",
      status: "협상 진행",
      budget: "4,000,000원",
      location: "서울 중구",
      attendees: 200,
    },
    {
      id: "REQ-018",
      title: "뮤직 페스티벌 게스트",
      customer: "OO엔터테인먼트",
      date: "2025-05-05",
      status: "검토중",
      budget: "3,500,000원",
      location: "인천 송도",
      attendees: 350,
    },
    {
      id: "REQ-019",
      title: "대학 입학식 축하공연",
      customer: "OO대학교",
      date: "2025-02-15",
      status: "견적 완료",
      budget: "2,000,000원",
      location: "서울 노원구",
      attendees: 500,
    },
    {
      id: "REQ-020",
      title: "IT 컨퍼런스 클로징 공연",
      customer: "테크 얼라이언스",
      date: "2025-05-15",
      status: "요청중",
      budget: "2,500,000원",
      location: "부산 해운대구",
      attendees: 300,
    },
  ];

  // 필터링된 요청서 목록
  const filteredRequests = requests.filter((request) => {
    // 상태 필터
    if (statusFilter !== "all" && request.status !== statusFilter) {
      return false;
    }

    // 검색어 필터
    if (
      searchQuery &&
      !request.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !request.customer.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !request.id.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }

    return true;
  });

  // 상태에 따른 배지 색상
  const getStatusColor = (status: string) => {
    switch (status) {
      case "요청중":
        return "bg-blue-100 text-blue-800";
      case "검토중":
        return "bg-yellow-100 text-yellow-800";
      case "협상 진행":
        return "bg-purple-100 text-purple-800";
      case "견적 완료":
        return "bg-green-100 text-green-800";
      case "취소":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // 요청서 상세 페이지로 이동
  const handleViewDetail = (id: string) => {
    router.push(`/admin/requests/${id}`);
  };

  // 요청서 수정
  const handleEdit = (id: string) => {
    router.push(`/admin/requests/${id}/edit`);
  };

  // 요청서 삭제
  const handleDelete = (id: string) => {
    if (confirm("정말로 이 요청서를 삭제하시겠습니까?")) {
      // 실제로는 API 호출이 필요하지만 현재는 샘플 데이터만 사용
      alert(`요청서 ${id}가 삭제되었습니다.`);
      // 실제 구현에서는 목록을 다시 불러오거나 상태 업데이트 필요
    }
  };

  return (
    <>
      {/* 페이지 헤더 */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">요청서 관리</h1>
        <p className="text-gray-600 mt-1">
          고객이 제출한 사전견적요청서를 관리하고 상태를 업데이트합니다.
        </p>
      </div>

      {/* 상태 필터 버튼 */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="flex flex-wrap gap-2 mb-4">
          <button
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              statusFilter === "all"
                ? "bg-orange-500 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
            onClick={() => setStatusFilter("all")}
          >
            전체
          </button>
          <button
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              statusFilter === "요청중"
                ? "bg-blue-500 text-white"
                : "bg-blue-100 text-blue-800 hover:bg-blue-200"
            }`}
            onClick={() => setStatusFilter("요청중")}
          >
            요청중
          </button>
          <button
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              statusFilter === "검토중"
                ? "bg-yellow-500 text-white"
                : "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
            }`}
            onClick={() => setStatusFilter("검토중")}
          >
            검토중
          </button>
          <button
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              statusFilter === "협상 진행"
                ? "bg-purple-500 text-white"
                : "bg-purple-100 text-purple-800 hover:bg-purple-200"
            }`}
            onClick={() => setStatusFilter("협상 진행")}
          >
            협상 진행
          </button>
          <button
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              statusFilter === "견적 완료"
                ? "bg-green-500 text-white"
                : "bg-green-100 text-green-800 hover:bg-green-200"
            }`}
            onClick={() => setStatusFilter("견적 완료")}
          >
            견적 완료
          </button>
          <button
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              statusFilter === "취소"
                ? "bg-red-500 text-white"
                : "bg-red-100 text-red-800 hover:bg-red-200"
            }`}
            onClick={() => setStatusFilter("취소")}
          >
            취소
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* 날짜 필터 */}
          <div>
            <label
              htmlFor="date-filter"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              날짜
            </label>
            <select
              id="date-filter"
              className="w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
            >
              <option value="all">전체 기간</option>
              <option value="today">오늘</option>
              <option value="week">이번 주</option>
              <option value="month">이번 달</option>
              <option value="custom">직접 설정</option>
            </select>
          </div>

          {/* 검색 */}
          <div>
            <label
              htmlFor="search"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              검색
            </label>
            <div className="relative">
              <input
                type="text"
                id="search"
                placeholder="요청서 번호, 제목, 고객명 검색"
                className="w-full rounded-md border border-gray-300 py-2 pl-10 pr-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <div className="absolute left-3 top-2.5 text-gray-400">
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
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 요청서 목록 */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  요청 번호
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  제목
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  고객
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  제출일
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  상태
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  예산
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  액션
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredRequests.map((request) => (
                <tr
                  key={request.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {request.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <Link
                      href={`/admin/requests/${request.id}`}
                      className="text-orange-600 hover:text-orange-800"
                    >
                      {request.title}
                    </Link>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {request.customer}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {request.date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                        request.status
                      )}`}
                    >
                      {request.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {request.budget}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex space-x-2 relative">
                      <button
                        onClick={() => handleViewDetail(request.id)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        상세
                      </button>
                      <button
                        onClick={() => handleEdit(request.id)}
                        className="text-green-600 hover:text-green-800"
                      >
                        수정
                      </button>
                      <button
                        onClick={() => handleDelete(request.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        삭제
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 페이지네이션 */}
        <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                전체 <span className="font-medium">{requests.length}</span> 건
                중{" "}
                <span className="font-medium">{filteredRequests.length}</span>{" "}
                건 표시
              </p>
            </div>
            <div>
              <nav
                className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                aria-label="Pagination"
              >
                <a
                  href="#"
                  className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                >
                  <span className="sr-only">이전</span>
                  <svg
                    className="h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
                <a
                  href="#"
                  aria-current="page"
                  className="z-10 bg-orange-50 border-orange-500 text-orange-600 relative inline-flex items-center px-4 py-2 border text-sm font-medium"
                >
                  1
                </a>
                <a
                  href="#"
                  className="bg-white border-gray-300 text-gray-500 hover:bg-gray-50 relative inline-flex items-center px-4 py-2 border text-sm font-medium"
                >
                  2
                </a>
                <a
                  href="#"
                  className="bg-white border-gray-300 text-gray-500 hover:bg-gray-50 relative inline-flex items-center px-4 py-2 border text-sm font-medium"
                >
                  3
                </a>
                <a
                  href="#"
                  className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                >
                  <span className="sr-only">다음</span>
                  <svg
                    className="h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
