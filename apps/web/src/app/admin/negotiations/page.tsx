"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  getAllNegotiations,
  getAllCustomers,
  getAllSingers,
  Negotiation,
  Customer,
  Singer,
  updateNegotiation,
} from "@/services/negotiationsApi";

// 협상 관리에서 사용할 상태 정의
type NegotiationStatus =
  | "pending"
  | "in-progress"
  | "final-quote"
  | "cancelled"
  | "completed";

// 협상 상태 텍스트 변환 함수
const getStatusText = (status: NegotiationStatus): string => {
  switch (status) {
    case "pending":
      return "견적 검토";
    case "in-progress":
      return "협상 중";
    case "final-quote":
      return "최종 견적서";
    case "cancelled":
      return "취소";
    case "completed":
      return "완료";
    default:
      return "알 수 없음";
  }
};

export default function NegotiationsPage() {
  const router = useRouter();
  const [negotiations, setNegotiations] = useState<Negotiation[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [singers, setSingers] = useState<Singer[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // 필터 상태
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [customerFilter, setCustomerFilter] = useState<string>("all");
  const [singerFilter, setSingerFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // 협상 및 고객, 가수 데이터 로드
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        // 데이터 병렬로 로드
        const [negotiationsData, customersData, singersData] =
          await Promise.all([
            getAllNegotiations(),
            getAllCustomers(),
            getAllSingers(),
          ]);

        setNegotiations(negotiationsData);
        setCustomers(customersData);
        setSingers(singersData);
      } catch (err) {
        console.error("데이터 로드 중 오류:", err);
        setError(
          "API 서버에 연결할 수 없습니다. 백엔드 서버가 실행 중인지 확인하세요."
        );
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // 고객 및 가수 정보를 ID로 조회하는 함수
  const getCustomerById = (id: string) => {
    return customers.find((customer) => customer.id === id);
  };

  const getSingerById = (id: string) => {
    return singers.find((singer) => singer.id === id);
  };

  // 필터링된 협상 목록 (고객 및 가수 정보 포함)
  const filteredNegotiations = negotiations
    .map((negotiation) => ({
      ...negotiation,
      customer: getCustomerById(negotiation.customerId),
      singer: getSingerById(negotiation.singerId),
    }))
    .filter((negotiation) => {
      // 상태 필터
      if (statusFilter !== "all" && negotiation.status !== statusFilter) {
        return false;
      }

      // 고객 필터
      if (
        customerFilter !== "all" &&
        negotiation.customerId !== customerFilter
      ) {
        return false;
      }

      // 가수 필터
      if (singerFilter !== "all" && negotiation.singerId !== singerFilter) {
        return false;
      }

      // 검색어 필터 (제목, 고객명, 가수명)
      if (
        searchQuery &&
        !negotiation.title?.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !negotiation.customer?.name
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase()) &&
        !negotiation.singer?.name
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase())
      ) {
        return false;
      }

      return true;
    });

  // 상태에 따른 배지 색상
  const getStatusColor = (status: NegotiationStatus) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "in-progress":
        return "bg-blue-100 text-blue-800";
      case "final-quote":
        return "bg-purple-100 text-purple-800";
      case "completed":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // 날짜를 기준으로 마감일 스타일 지정
  const getDueDateStyle = (dueDate: string) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diff = Math.floor(
      (due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (diff < 0) {
      return "text-red-600 font-medium";
    } else if (diff <= 3) {
      return "text-orange-600 font-medium";
    } else {
      return "text-gray-600";
    }
  };

  // 상세 페이지로 이동
  const handleViewDetail = (id: string) => {
    router.push(`/admin/negotiations/${id}`);
  };

  // 협상 수정 페이지로 이동
  const handleEdit = (id: string) => {
    router.push(`/admin/negotiations/${id}/edit`);
  };

  // 협상 취소 처리
  const handleCancel = async (id: string) => {
    if (confirm("정말로 이 협상을 취소하시겠습니까?")) {
      try {
        setLoading(true);
        // 상태를 'cancelled'로 업데이트
        await updateNegotiation(id, { status: "cancelled" });

        // 화면에 바로 적용
        setNegotiations(
          negotiations.map((n) =>
            n.id === id ? { ...n, status: "cancelled" } : n
          )
        );

        alert("협상이 취소되었습니다.");
      } catch (err) {
        console.error("협상 취소 중 오류 발생:", err);
        alert("협상 취소에 실패했습니다. 다시 시도해주세요.");
      } finally {
        setLoading(false);
      }
    }
  };

  // 날짜 포맷팅 함수
  const formatDate = (dateString: string) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString("ko-KR");
  };

  return (
    <div className="pb-10">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-black">매칭/협상 관리</h1>
          <p className="text-black mt-1">
            모든 진행중인 협상 및 매칭을 확인하고 관리하세요.
          </p>
        </div>
        <Link
          href="/admin/negotiations/new"
          className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
        >
          새 협상 등록
        </Link>
      </div>

      {/* 서브메뉴 추가 */}
      <div className="flex mb-6 border-b border-gray-200">
        <Link
          href="/admin/negotiations/pending"
          className="px-4 py-2 mr-2 text-gray-700 hover:text-orange-600 hover:border-orange-600 border-b-2 border-transparent"
        >
          견적 검토
        </Link>
        <Link
          href="/admin/negotiations/in-progress"
          className="px-4 py-2 mr-2 text-gray-700 hover:text-orange-600 hover:border-orange-600 border-b-2 border-transparent"
        >
          협상 진행
        </Link>
        <Link
          href="/admin/negotiations/final-quote"
          className="px-4 py-2 mr-2 text-gray-700 hover:text-orange-600 hover:border-orange-600 border-b-2 border-transparent"
        >
          최종 견적서
        </Link>
        <Link
          href="/admin/negotiations/cancelled"
          className="px-4 py-2 text-gray-700 hover:text-orange-600 hover:border-orange-600 border-b-2 border-transparent"
        >
          취소된 협상
        </Link>
      </div>

      {/* 필터 섹션 */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div>
            <label className="block text-sm font-medium text-black mb-1">
              검색
            </label>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="제목, 고객명, 가수명 검색..."
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-black mb-1">
              상태
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
            >
              <option value="all">모든 상태</option>
              <option value="pending">견적 검토</option>
              <option value="in-progress">협상 중</option>
              <option value="final-quote">최종 견적서</option>
              <option value="completed">완료</option>
              <option value="cancelled">취소</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-black mb-1">
              고객
            </label>
            <select
              value={customerFilter}
              onChange={(e) => setCustomerFilter(e.target.value)}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
            >
              <option value="all">모든 고객</option>
              {customers.map((customer) => (
                <option key={customer.id} value={customer.id}>
                  {customer.name}{" "}
                  {customer.company ? `(${customer.company})` : ""}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-black mb-1">
              가수
            </label>
            <select
              value={singerFilter}
              onChange={(e) => setSingerFilter(e.target.value)}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
            >
              <option value="all">모든 가수</option>
              {singers.map((singer) => (
                <option key={singer.id} value={singer.id}>
                  {singer.name} {singer.agency ? `(${singer.agency})` : ""}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={() => {
                setStatusFilter("all");
                setCustomerFilter("all");
                setSingerFilter("all");
                setSearchQuery("");
              }}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
            >
              필터 초기화
            </button>
          </div>
        </div>
      </div>

      {/* 협상 목록 */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-4 py-2 border-b border-gray-200 bg-gray-50">
          <h2 className="text-sm font-medium text-black">
            총 {filteredNegotiations.length}개의 협상/매칭
          </h2>
        </div>

        {/* 로딩 중 표시 */}
        {loading && (
          <div className="flex justify-center items-center p-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
              <p className="text-gray-600">데이터를 불러오는 중입니다...</p>
            </div>
          </div>
        )}

        {/* 에러 메시지 */}
        {error && !loading && (
          <div className="bg-red-50 border border-red-200 text-red-800 p-4 m-4 rounded-md">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-red-500"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">
                  오류가 발생했습니다
                </h3>
                <p className="mt-1 text-sm text-red-700">{error}</p>
                <p className="mt-2 text-sm text-red-700">
                  백엔드 API 서버가 실행 중인지 확인하세요.
                  (http://localhost:4000/api)
                </p>
              </div>
            </div>
          </div>
        )}

        {/* 데이터 테이블 */}
        {!loading && !error && (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                    제목
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                    고객
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                    가수
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                    초기 금액
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                    최종 금액
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                    상태
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                    이벤트 날짜
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                    최근 업데이트
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-black uppercase tracking-wider">
                    관리
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredNegotiations.length === 0 ? (
                  <tr>
                    <td
                      colSpan={10}
                      className="px-6 py-4 text-center text-black"
                    >
                      등록된 협상/매칭이 없습니다.
                    </td>
                  </tr>
                ) : (
                  filteredNegotiations.map((negotiation) => (
                    <tr key={negotiation.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {negotiation.id.substring(0, 8)}...
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {negotiation.title || "제목 없음"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {negotiation.customer?.name || "고객 정보 없음"}
                        </div>
                        <div className="text-xs text-gray-500">
                          {negotiation.customer?.company || "-"}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {negotiation.singer?.name || "가수 정보 없음"}
                        </div>
                        <div className="text-xs text-gray-500">
                          {negotiation.singer?.agency || "-"}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {negotiation.initialAmount?.toLocaleString() || 0}원
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {negotiation.finalAmount?.toLocaleString() || 0}원
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                            negotiation.status as NegotiationStatus
                          )}`}
                        >
                          {getStatusText(
                            negotiation.status as NegotiationStatus
                          )}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {formatDate(negotiation.eventDate || "")}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {formatDate(negotiation.updatedAt || "")}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex space-x-2 justify-end">
                          <button
                            className="text-blue-600 hover:text-blue-900"
                            onClick={() => handleViewDetail(negotiation.id)}
                          >
                            상세
                          </button>
                          <button
                            className="text-orange-600 hover:text-orange-900"
                            onClick={() => handleEdit(negotiation.id)}
                          >
                            수정
                          </button>
                          {negotiation.status !== "cancelled" && (
                            <button
                              className="text-red-600 hover:text-red-900"
                              onClick={() => handleCancel(negotiation.id)}
                            >
                              취소
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
