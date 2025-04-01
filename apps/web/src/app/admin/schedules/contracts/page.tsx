"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { contracts, customers, singers } from "@/utils/dummyData";

export default function ContractsPage() {
  const router = useRouter();
  // 필터 상태
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [customerFilter, setCustomerFilter] = useState<string>("all");
  const [singerFilter, setSingerFilter] = useState<string>("all");
  const [paymentFilter, setPaymentFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // 필터링된 계약 목록
  const filteredContracts = contracts.filter((contract) => {
    // 상태 필터
    if (statusFilter !== "all" && contract.contractStatus !== statusFilter) {
      return false;
    }

    // 고객 필터
    if (customerFilter !== "all" && contract.customerId !== customerFilter) {
      return false;
    }

    // 가수 필터
    if (singerFilter !== "all" && contract.singerId !== singerFilter) {
      return false;
    }

    // 결제 상태 필터
    if (paymentFilter !== "all" && contract.paymentStatus !== paymentFilter) {
      return false;
    }

    // 검색어 필터
    if (
      searchQuery &&
      !contract.eventTitle.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !contract.customerName
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) &&
      !contract.singerName.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !contract.id.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }

    return true;
  });

  // 상태에 따른 배지 색상
  const getContractStatusBadgeClass = (status: string) => {
    switch (status) {
      case "draft":
        return "bg-gray-100 text-gray-800";
      case "sent":
        return "bg-blue-100 text-blue-800";
      case "signed":
        return "bg-green-100 text-green-800";
      case "completed":
        return "bg-purple-100 text-purple-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPaymentStatusBadgeClass = (status: string) => {
    switch (status) {
      case "unpaid":
        return "bg-red-100 text-red-800";
      case "partial":
        return "bg-yellow-100 text-yellow-800";
      case "paid":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getContractStatusText = (status: string) => {
    switch (status) {
      case "draft":
        return "초안";
      case "sent":
        return "전송됨";
      case "signed":
        return "서명됨";
      case "completed":
        return "완료";
      case "cancelled":
        return "취소";
      default:
        return status;
    }
  };

  const getPaymentStatusText = (status: string) => {
    switch (status) {
      case "unpaid":
        return "미결제";
      case "partial":
        return "부분결제";
      case "paid":
        return "결제완료";
      default:
        return status;
    }
  };

  // 날짜 포맷팅 함수
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ko-KR");
  };

  // 상세 페이지로 이동
  const handleViewDetail = (id: string) => {
    router.push(`/admin/schedules/contracts/${id}`);
  };

  // 계약서 수정 페이지로 이동
  const handleEdit = (id: string) => {
    router.push(`/admin/schedules/contracts/${id}/edit`);
  };

  // 계약서 취소 처리
  const handleCancel = (id: string) => {
    if (confirm("정말로 이 계약을 취소하시겠습니까?")) {
      alert(`계약 ${id}가 취소되었습니다.`);
      // 실제 구현에서는 API 호출 필요
    }
  };

  return (
    <div className="pb-10">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">계약 관리</h1>
          <p className="text-gray-600 mt-1">모든 계약을 확인하고 관리하세요.</p>
        </div>
        <Link
          href="/admin/schedules/contracts/new"
          className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
        >
          새 계약 등록
        </Link>
      </div>

      {/* 필터 섹션 */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              검색
            </label>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="계약명, 고객명, 가수명 검색..."
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              계약 상태
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
            >
              <option value="all">모든 상태</option>
              <option value="draft">초안</option>
              <option value="sent">전송됨</option>
              <option value="signed">서명됨</option>
              <option value="completed">완료</option>
              <option value="cancelled">취소</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              결제 상태
            </label>
            <select
              value={paymentFilter}
              onChange={(e) => setPaymentFilter(e.target.value)}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
            >
              <option value="all">모든 상태</option>
              <option value="unpaid">미결제</option>
              <option value="partial">부분결제</option>
              <option value="paid">결제완료</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
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

          <div className="flex items-end">
            <button
              onClick={() => {
                setStatusFilter("all");
                setCustomerFilter("all");
                setSingerFilter("all");
                setPaymentFilter("all");
                setSearchQuery("");
              }}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
            >
              필터 초기화
            </button>
          </div>
        </div>
      </div>

      {/* 계약 목록 */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-4 py-2 border-b border-gray-200 bg-gray-50">
          <h2 className="text-sm font-medium text-gray-700">
            총 {filteredContracts.length}개의 계약
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  계약 번호
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  이벤트 정보
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  고객 정보
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  가수 정보
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  계약 금액
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  계약 상태
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  결제 상태
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  등록일
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  관리
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredContracts.length === 0 ? (
                <tr>
                  <td
                    colSpan={9}
                    className="px-6 py-4 text-center text-gray-500"
                  >
                    등록된 계약이 없습니다.
                  </td>
                </tr>
              ) : (
                filteredContracts.map((contract) => (
                  <tr key={contract.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {contract.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {contract.eventTitle}
                      </div>
                      <div className="text-xs text-gray-500">
                        {formatDate(contract.eventDate)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {contract.customerName}
                      </div>
                      <div className="text-xs text-gray-500">
                        {contract.customerCompany}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {contract.singerName}
                      </div>
                      <div className="text-xs text-gray-500">
                        {contract.singerAgency}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {contract.contractAmount}원
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getContractStatusBadgeClass(
                          contract.contractStatus
                        )}`}
                      >
                        {getContractStatusText(contract.contractStatus)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getPaymentStatusBadgeClass(
                          contract.paymentStatus
                        )}`}
                      >
                        {getPaymentStatusText(contract.paymentStatus)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(contract.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex space-x-2 justify-end">
                        <button
                          className="text-blue-600 hover:text-blue-900"
                          onClick={() => handleViewDetail(contract.id)}
                        >
                          상세
                        </button>
                        {contract.contractStatus !== "completed" &&
                          contract.contractStatus !== "cancelled" && (
                            <button
                              className="text-orange-600 hover:text-orange-900"
                              onClick={() => handleEdit(contract.id)}
                            >
                              수정
                            </button>
                          )}
                        {contract.contractStatus !== "cancelled" && (
                          <button
                            className="text-red-600 hover:text-red-900"
                            onClick={() => handleCancel(contract.id)}
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
