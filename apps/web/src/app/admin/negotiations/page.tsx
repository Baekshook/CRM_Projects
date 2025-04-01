"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { matches, customers, singers } from "@/utils/dummyData";

// 협상 관리에서 사용할 상태 정의
type NegotiationStatus = "pending" | "negotiating" | "confirmed" | "cancelled";

// 협상 상태 텍스트 변환 함수
const getStatusText = (status: NegotiationStatus): string => {
  switch (status) {
    case "pending":
      return "견적 검토";
    case "negotiating":
      return "협상 중";
    case "confirmed":
      return "계약 확정";
    case "cancelled":
      return "취소";
    default:
      return "알 수 없음";
  }
};

export default function NegotiationsPage() {
  const router = useRouter();
  // 필터 상태
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [customerFilter, setCustomerFilter] = useState<string>("all");
  const [singerFilter, setSingerFilter] = useState<string>("all");
  const [dateFilter, setDateFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // 필터링된 매칭 목록
  const filteredMatches = matches.filter((match) => {
    // 상태 필터
    if (statusFilter !== "all" && match.status !== statusFilter) {
      return false;
    }

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

  // 상태에 따른 배지 색상
  const getStatusColor = (status: NegotiationStatus) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "negotiating":
        return "bg-blue-100 text-blue-800";
      case "confirmed":
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
  const handleCancel = (id: string) => {
    if (confirm("정말로 이 협상을 취소하시겠습니까?")) {
      alert(`협상 ${id}가 취소되었습니다.`);
      // 실제 구현에서는 API 호출 필요
    }
  };

  // 날짜 포맷팅 함수
  const formatDate = (dateString: string) => {
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
              <option value="negotiating">협상 중</option>
              <option value="confirmed">계약 확정</option>
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
                setStatusFilter("all");
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
            총 {filteredMatches.length}개의 협상/매칭
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                  요청서/매칭 ID
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
              {filteredMatches.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-6 py-4 text-center text-black">
                    등록된 협상/매칭이 없습니다.
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
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                          match.status as NegotiationStatus
                        )}`}
                      >
                        {getStatusText(match.status as NegotiationStatus)}
                      </span>
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
                        <button
                          className="text-orange-600 hover:text-orange-900"
                          onClick={() => handleEdit(match.id)}
                        >
                          수정
                        </button>
                        {match.status !== "cancelled" && (
                          <button
                            className="text-red-600 hover:text-red-900"
                            onClick={() => handleCancel(match.id)}
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
      </div>
    </div>
  );
}
