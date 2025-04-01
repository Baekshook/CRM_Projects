"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  requests as dummyRequests,
  customers as dummyCustomers,
  singers as dummySingers,
} from "@/utils/dummyData";

// 요청서 타입 정의
interface Request {
  id: string;
  customerId: string;
  customerName: string;
  customerCompany: string;
  eventType: string;
  eventDate: string;
  venue: string;
  budget: string;
  status: string;
  createdAt: string;
  title: string;
  customer?: {
    id: string;
    name: string;
    company: string;
  };
  singerId?: string;
  singerName?: string;
  singer?: {
    id: string;
    name: string;
    agency: string;
  };
}

export default function RequestsPage() {
  const router = useRouter();

  // 필터 상태
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [customerFilter, setCustomerFilter] = useState<string>("all");
  const [singerFilter, setSingerFilter] = useState<string>("all");
  const [dateFilter, setDateFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // 액션 상태
  const [activeRequestId, setActiveRequestId] = useState<string | null>(null);

  // 필터링된 요청서 목록
  const filteredRequests = dummyRequests.filter((request) => {
    // 상태 필터
    if (statusFilter !== "all" && request.status !== statusFilter) {
      return false;
    }

    // 고객 필터
    if (customerFilter !== "all" && request.customerId !== customerFilter) {
      return false;
    }

    // 가수 필터 (매칭된 요청만 해당)
    if (singerFilter !== "all" && request.singerId !== singerFilter) {
      return false;
    }

    // 검색어 필터
    if (
      searchQuery &&
      !request.customerName.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !request.customerCompany
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) &&
      !request.id.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !request.title.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }

    return true;
  });

  // 상태에 따른 배지 색상
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "in_progress":
        return "bg-blue-100 text-blue-800";
      case "completed":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "pending":
        return "대기중";
      case "in_progress":
        return "진행중";
      case "completed":
        return "완료";
      case "cancelled":
        return "취소";
      default:
        return status;
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
      alert(`요청서 ${id}가 삭제되었습니다.`);
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
          <h1 className="text-2xl font-bold text-black">견적 요청서 관리</h1>
          <p className="text-black mt-1">
            모든 견적 요청서를 확인하고 관리하세요.
          </p>
        </div>
        <Link
          href="/admin/requests/new"
          className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
        >
          새 견적 요청
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
              placeholder="고객명, 제목, 요청번호 검색..."
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
              <option value="pending">대기중</option>
              <option value="in_progress">진행중</option>
              <option value="completed">완료</option>
              <option value="cancelled">취소</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-black mb-1">
              고객 필터
            </label>
            <select
              value={customerFilter}
              onChange={(e) => setCustomerFilter(e.target.value)}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
            >
              <option value="all">모든 고객</option>
              {dummyCustomers.map((customer) => (
                <option key={customer.id} value={customer.id}>
                  {customer.name} ({customer.company})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-black mb-1">
              가수 필터
            </label>
            <select
              value={singerFilter}
              onChange={(e) => setSingerFilter(e.target.value)}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
            >
              <option value="all">모든 가수</option>
              {dummySingers.map((singer) => (
                <option key={singer.id} value={singer.id}>
                  {singer.name} ({singer.agency})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-black mb-1">
              기간
            </label>
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
            >
              <option value="all">전체 기간</option>
              <option value="7days">최근 7일</option>
              <option value="30days">최근 30일</option>
              <option value="90days">최근 90일</option>
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

      {/* 요청서 목록 */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-4 py-2 border-b border-gray-200 bg-gray-50">
          <h2 className="text-sm font-medium text-black">
            총 {filteredRequests.length}개의 요청서
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                  요청서 번호
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                  제목
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                  고객명
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                  가수명
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                  행사 유형
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                  이벤트 날짜
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                  장소
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                  예산
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                  상태
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                  등록일
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-black uppercase tracking-wider">
                  관리
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredRequests.length === 0 ? (
                <tr>
                  <td colSpan={10} className="px-6 py-4 text-center text-black">
                    요청서가 없습니다.
                  </td>
                </tr>
              ) : (
                filteredRequests.map((request) => (
                  <tr key={request.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-black">
                      {request.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                      {request.title}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                      {request.customerName}
                      <div className="text-xs text-gray-500">
                        {request.customerCompany}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                      {request.singerName ? (
                        <>
                          {request.singerName}
                          <div className="text-xs text-gray-500">
                            {request.singer?.agency}
                          </div>
                        </>
                      ) : (
                        <span className="text-gray-400">미지정</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                      {request.eventType}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                      {request.eventDate}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                      {request.venue}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                      {Number(request.budget).toLocaleString()}원
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(
                          request.status
                        )}`}
                      >
                        {getStatusText(request.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                      {formatDate(request.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link
                        href={`/admin/requests/${request.id}`}
                        className="text-orange-600 hover:text-orange-900 mr-3"
                      >
                        상세
                      </Link>
                      <Link
                        href={`/admin/requests/${request.id}/edit`}
                        className="text-orange-600 hover:text-orange-900"
                      >
                        수정
                      </Link>
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
