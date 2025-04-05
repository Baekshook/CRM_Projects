"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  getNegotiationsByStatus,
  getAllCustomers,
  getAllSingers,
  Negotiation,
  Customer,
  Singer,
} from "@/services/negotiationsApi";

export default function InProgressNegotiationsPage() {
  const router = useRouter();
  const [negotiations, setNegotiations] = useState<Negotiation[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [singers, setSingers] = useState<Singer[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // 필터 상태
  const [customerFilter, setCustomerFilter] = useState<string>("all");
  const [singerFilter, setSingerFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // 데이터 로드
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        // 데이터 병렬로 로드
        const [negotiationsData, customersData, singersData] =
          await Promise.all([
            getNegotiationsByStatus("in-progress"),
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

  // 필터링된 협상 목록
  const filteredNegotiations = negotiations
    .map((negotiation) => ({
      ...negotiation,
      customer: getCustomerById(negotiation.customerId),
      singer: getSingerById(negotiation.singerId),
    }))
    .filter((negotiation) => {
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

      // 검색어 필터
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

  // 날짜 포맷팅 함수
  const formatDate = (dateString: string) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString("ko-KR");
  };

  // 상세 페이지로 이동
  const handleViewDetail = (id: string) => {
    router.push(`/admin/negotiations/${id}`);
  };

  // 협상 수정 페이지로 이동
  const handleEdit = (id: string) => {
    router.push(`/admin/negotiations/${id}/edit`);
  };

  return (
    <div className="pb-10">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-black">협상 진행 중</h1>
          <p className="text-black mt-1">현재 협상 중인 매칭 목록입니다.</p>
        </div>
        <Link
          href="/admin/negotiations"
          className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 mr-2"
        >
          전체 목록으로
        </Link>
      </div>

      {/* 필터 섹션 */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
            총 {filteredNegotiations.length}개의 협상 진행 중
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
                    견적 금액
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
                      colSpan={8}
                      className="px-6 py-4 text-center text-black"
                    >
                      협상 진행 중인 매칭이 없습니다.
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
