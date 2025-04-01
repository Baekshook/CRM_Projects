"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { matches, customers, singers } from "@/utils/dummyData";

export default function CancelledNegotiationsPage() {
  const router = useRouter();
  // 필터 상태
  const [customerFilter, setCustomerFilter] = useState<string>("all");
  const [singerFilter, setSingerFilter] = useState<string>("all");
  const [dateFilter, setDateFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // 취소(cancelled) 상태의 매칭만 필터링
  const cancelledMatches = matches.filter(
    (match) => match.status === "cancelled"
  );

  // 필터링된 매칭 목록
  const filteredMatches = cancelledMatches.filter((match) => {
    // 고객 필터
    if (customerFilter !== "all" && match.customerId !== customerFilter) {
      return false;
    }

    // 가수 필터
    if (singerFilter !== "all" && match.singerId !== singerFilter) {
      return false;
    }

    // 검색어 필터
    if (
      searchQuery &&
      !match.requestTitle.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !match.customerName.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !match.singerName.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }

    return true;
  });

  // 날짜 포맷팅 함수
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ko-KR");
  };

  // 상세 페이지로 이동
  const handleViewDetail = (id: string) => {
    router.push(`/admin/negotiations/${id}`);
  };

  return (
    <div className="pb-10">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-black">취소된 협상</h1>
          <p className="text-black mt-1">취소된 매칭/협상 목록입니다.</p>
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
                  {customer.name} ({customer.company})
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
                  {singer.name} ({singer.agency})
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={() => {
                setCustomerFilter("all");
                setSingerFilter("all");
                setDateFilter("all");
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
            총 {filteredMatches.length}개의 취소된 협상
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                  매칭 ID
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
                  제안 금액
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                  이벤트 날짜
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                  취소 일자
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-black uppercase tracking-wider">
                  관리
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredMatches.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-4 text-center text-black">
                    취소된 협상이 없습니다.
                  </td>
                </tr>
              ) : (
                filteredMatches.map((match) => (
                  <tr key={match.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {match.id}
                      <br />
                      <span className="text-xs text-gray-500">
                        {match.requestId}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {match.requestTitle}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {match.customerName}
                      </div>
                      <div className="text-xs text-gray-500">
                        {match.customerCompany}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {match.singerName}
                      </div>
                      <div className="text-xs text-gray-500">
                        {match.singerAgency}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {match.price.toLocaleString()}원
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {formatDate(match.eventDate)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {formatDate(match.updatedAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex space-x-2 justify-end">
                        <button
                          className="text-blue-600 hover:text-blue-900"
                          onClick={() => handleViewDetail(match.id)}
                        >
                          상세
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
