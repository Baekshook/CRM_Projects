"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

// 협상 타입 정의
interface Negotiation {
  id: string;
  requestId: string;
  requestTitle: string;
  customer: string;
  singer: string;
  agency: string;
  price: string;
  status: string;
  lastUpdate: string;
  dueDate: string;
}

export default function NegotiationsPage() {
  const router = useRouter();
  // 필터 상태
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [dateFilter, setDateFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // 샘플 협상 데이터
  const negotiations: Negotiation[] = [
    {
      id: "NEG-001",
      requestId: "REQ-001",
      requestTitle: "연간 기업 행사",
      customer: "(주)이벤트 플래닝",
      singer: "가수 A",
      agency: "엔터테인먼트 A",
      price: "4,500,000원",
      status: "협상 중",
      lastUpdate: "2025-02-12",
      dueDate: "2025-02-14",
    },
    {
      id: "NEG-002",
      requestId: "REQ-002",
      requestTitle: "결혼식 축가",
      customer: "웨딩 홀 A",
      singer: "가수 B",
      agency: "엔터테인먼트 B",
      price: "1,200,000원",
      status: "계약 대기",
      lastUpdate: "2025-02-15",
      dueDate: "2025-02-18",
    },
    {
      id: "NEG-003",
      requestId: "REQ-003",
      requestTitle: "대학 축제 공연",
      customer: "대학 축제 위원회",
      singer: "가수 C",
      agency: "엔터테인먼트 C",
      price: "3,200,000원",
      status: "협상 중",
      lastUpdate: "2025-03-18",
      dueDate: "2025-03-22",
    },
    {
      id: "NEG-004",
      requestId: "REQ-004",
      requestTitle: "기업 봄맞이 행사",
      customer: "(주)테크놀로지",
      singer: "가수 D",
      agency: "엔터테인먼트 D",
      price: "4,000,000원",
      status: "계약 완료",
      lastUpdate: "2025-03-08",
      dueDate: "2025-03-10",
    },
    {
      id: "NEG-005",
      requestId: "REQ-005",
      requestTitle: "지역 축제 공연",
      customer: "OO시 문화재단",
      singer: "가수 E",
      agency: "엔터테인먼트 E",
      price: "2,800,000원",
      status: "견적 검토",
      lastUpdate: "2025-02-28",
      dueDate: "2025-03-03",
    },
    {
      id: "NEG-006",
      requestId: "REQ-006",
      requestTitle: "신제품 론칭 행사",
      customer: "(주)코스메틱 브랜드",
      singer: "가수 F",
      agency: "엔터테인먼트 F",
      price: "2,800,000원",
      status: "협상 중",
      lastUpdate: "2025-02-08",
      dueDate: "2025-02-12",
    },
    {
      id: "NEG-007",
      requestId: "REQ-007",
      requestTitle: "방송 프로그램 출연",
      customer: "OO방송국",
      singer: "가수 G",
      agency: "엔터테인먼트 G",
      price: "2,300,000원",
      status: "계약 대기",
      lastUpdate: "2025-02-10",
      dueDate: "2025-02-13",
    },
    {
      id: "NEG-008",
      requestId: "REQ-008",
      requestTitle: "봄맞이 특별 공연",
      customer: "OO쇼핑몰",
      singer: "가수 H",
      agency: "엔터테인먼트 H",
      price: "1,700,000원",
      status: "협상 중",
      lastUpdate: "2025-04-17",
      dueDate: "2025-04-20",
    },
    {
      id: "NEG-009",
      requestId: "REQ-009",
      requestTitle: "기업 창립 기념일 행사",
      customer: "(주)테크 솔루션",
      singer: "가수 I",
      agency: "엔터테인먼트 I",
      price: "4,200,000원",
      status: "계약 완료",
      lastUpdate: "2025-04-13",
      dueDate: "2025-04-15",
    },
    {
      id: "NEG-010",
      requestId: "REQ-010",
      requestTitle: "라디오 공개방송",
      customer: "OO라디오",
      singer: "가수 A",
      agency: "엔터테인먼트 A",
      price: "1,400,000원",
      status: "협상 중",
      lastUpdate: "2025-04-08",
      dueDate: "2025-04-12",
    },
    {
      id: "NEG-011",
      requestId: "REQ-011",
      requestTitle: "사내 워크숍 축하공연",
      customer: "(주)글로벌 테크",
      singer: "가수 J",
      agency: "엔터테인먼트 J",
      price: "2,100,000원",
      status: "계약 완료",
      lastUpdate: "2025-02-23",
      dueDate: "2025-02-25",
    },
    {
      id: "NEG-012",
      requestId: "REQ-012",
      requestTitle: "벚꽃 축제 공연",
      customer: "OO구청",
      singer: "가수 K",
      agency: "엔터테인먼트 K",
      price: "2,800,000원",
      status: "협상 중",
      lastUpdate: "2025-03-28",
      dueDate: "2025-04-01",
    },
    {
      id: "NEG-013",
      requestId: "REQ-013",
      requestTitle: "신간 북콘서트",
      customer: "OO출판사",
      singer: "가수 L",
      agency: "엔터테인먼트 L",
      price: "950,000원",
      status: "견적 검토",
      lastUpdate: "2025-03-04",
      dueDate: "2025-03-07",
    },
    {
      id: "NEG-014",
      requestId: "REQ-014",
      requestTitle: "브랜드 팝업스토어 이벤트",
      customer: "(주)패션 그룹",
      singer: "가수 M",
      agency: "엔터테인먼트 M",
      price: "2,600,000원",
      status: "협상 중",
      lastUpdate: "2025-05-02",
      dueDate: "2025-05-06",
    },
    {
      id: "NEG-015",
      requestId: "REQ-015",
      requestTitle: "어린이날 특별공연",
      customer: "OO테마파크",
      singer: "가수 N",
      agency: "엔터테인먼트 N",
      price: "3,000,000원",
      status: "계약 대기",
      lastUpdate: "2025-04-25",
      dueDate: "2025-04-28",
    },
    {
      id: "NEG-016",
      requestId: "REQ-016",
      requestTitle: "대기업 채용설명회 축하공연",
      customer: "(주)대형그룹",
      singer: "가수 O",
      agency: "엔터테인먼트 O",
      price: "1,700,000원",
      status: "계약 완료",
      lastUpdate: "2025-03-12",
      dueDate: "2025-03-15",
    },
    {
      id: "NEG-017",
      requestId: "REQ-017",
      requestTitle: "스포츠 브랜드 런칭쇼",
      customer: "글로벌 스포츠",
      singer: "가수 P",
      agency: "엔터테인먼트 P",
      price: "3,800,000원",
      status: "협상 중",
      lastUpdate: "2025-04-05",
      dueDate: "2025-04-08",
    },
    {
      id: "NEG-018",
      requestId: "REQ-018",
      requestTitle: "뮤직 페스티벌 게스트",
      customer: "OO엔터테인먼트",
      singer: "가수 Q",
      agency: "엔터테인먼트 Q",
      price: "3,200,000원",
      status: "견적 검토",
      lastUpdate: "2025-05-08",
      dueDate: "2025-05-12",
    },
    {
      id: "NEG-019",
      requestId: "REQ-019",
      requestTitle: "대학 입학식 축하공연",
      customer: "OO대학교",
      singer: "가수 R",
      agency: "엔터테인먼트 R",
      price: "1,900,000원",
      status: "계약 완료",
      lastUpdate: "2025-02-20",
      dueDate: "2025-02-23",
    },
    {
      id: "NEG-020",
      requestId: "REQ-020",
      requestTitle: "IT 컨퍼런스 클로징 공연",
      customer: "테크 얼라이언스",
      singer: "가수 S",
      agency: "엔터테인먼트 S",
      price: "2,300,000원",
      status: "견적 검토",
      lastUpdate: "2025-05-18",
      dueDate: "2025-05-22",
    },
  ];

  // 필터링된 협상 목록
  const filteredNegotiations = negotiations.filter((negotiation) => {
    // 상태 필터
    if (statusFilter !== "all" && negotiation.status !== statusFilter) {
      return false;
    }

    // 검색어 필터
    if (
      searchQuery &&
      !negotiation.requestTitle
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) &&
      !negotiation.customer.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !negotiation.singer.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !negotiation.id.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }

    return true;
  });

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

  // 마감일 임박 여부에 따른 스타일
  const getDueDateStyle = (dueDate: string) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return "text-red-600 font-bold";
    } else if (diffDays <= 2) {
      return "text-orange-600 font-bold";
    } else {
      return "text-gray-500";
    }
  };

  // 협상 상세 페이지로 이동
  const handleViewDetail = (id: string) => {
    router.push(`/admin/negotiations/${id}`);
  };

  // 협상 수정
  const handleEdit = (id: string) => {
    router.push(`/admin/negotiations/${id}/edit`);
  };

  // 협상 취소
  const handleCancel = (id: string) => {
    if (confirm("정말로 이 협상을 취소하시겠습니까?")) {
      // 실제로는 API 호출이 필요하지만 현재는 샘플 데이터만 사용
      alert(`협상 ${id}가 취소되었습니다.`);
      // 실제 구현에서는 목록을 다시 불러오거나 상태 업데이트 필요
    }
  };

  return (
    <>
      {/* 페이지 헤더 */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">매칭/협상 관리</h1>
        <p className="text-gray-600 mt-1">
          요청과 파트너 매칭, 그리고 협상 과정을 관리하고 추적합니다.
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
              statusFilter === "협상 중"
                ? "bg-blue-500 text-white"
                : "bg-blue-100 text-blue-800 hover:bg-blue-200"
            }`}
            onClick={() => setStatusFilter("협상 중")}
          >
            협상 중
          </button>
          <button
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              statusFilter === "견적 제안"
                ? "bg-yellow-500 text-white"
                : "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
            }`}
            onClick={() => setStatusFilter("견적 제안")}
          >
            견적 제안
          </button>
          <button
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              statusFilter === "계약 대기"
                ? "bg-purple-500 text-white"
                : "bg-purple-100 text-purple-800 hover:bg-purple-200"
            }`}
            onClick={() => setStatusFilter("계약 대기")}
          >
            계약 대기
          </button>
          <button
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              statusFilter === "계약 완료"
                ? "bg-green-500 text-white"
                : "bg-green-100 text-green-800 hover:bg-green-200"
            }`}
            onClick={() => setStatusFilter("계약 완료")}
          >
            계약 완료
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
                placeholder="요청서 제목, 고객명, 가수명 검색"
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

      {/* 협상 목록 */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  협상 ID
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  요청서
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
                  가수
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  제안 금액
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
                  마감일
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
              {filteredNegotiations.map((negotiation) => (
                <tr
                  key={negotiation.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {negotiation.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <Link
                      href={`/admin/requests/${negotiation.requestId}`}
                      className="text-orange-600 hover:text-orange-800"
                    >
                      {negotiation.requestTitle}
                    </Link>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {negotiation.customer}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div>
                      <div>{negotiation.singer}</div>
                      <div className="text-xs text-gray-400">
                        {negotiation.agency}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {negotiation.price}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                        negotiation.status
                      )}`}
                    >
                      {negotiation.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={getDueDateStyle(negotiation.dueDate)}>
                      {negotiation.dueDate}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleViewDetail(negotiation.id)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        상세
                      </button>
                      <button
                        onClick={() => handleEdit(negotiation.id)}
                        className="text-green-600 hover:text-green-800"
                      >
                        수정
                      </button>
                      <button
                        onClick={() => handleCancel(negotiation.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        취소
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
                전체 <span className="font-medium">{negotiations.length}</span>{" "}
                건 중{" "}
                <span className="font-medium">
                  {filteredNegotiations.length}
                </span>{" "}
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
