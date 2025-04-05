"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Contract } from "@/utils/dummyData";
import { getAllContractsTemp, deleteContract } from "@/services/schedulesApi";

export default function ContractsPage() {
  const router = useRouter();
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [customers, setCustomers] = useState<
    { id: string; name: string; company: string }[]
  >([]);
  const [singers, setSingers] = useState<{ id: string; name: string }[]>([]);

  // 필터 상태
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [customerFilter, setCustomerFilter] = useState<string>("all");
  const [singerFilter, setSingerFilter] = useState<string>("all");
  const [paymentFilter, setPaymentFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  useEffect(() => {
    const fetchContracts = async () => {
      try {
        setLoading(true);
        setError(null);
        // 실제 API 연동 시: const data = await getAllContracts();
        const data = await getAllContractsTemp();
        setContracts(data);

        // 고객 및 가수 목록 추출 (중복 제거)
        const uniqueCustomers = Array.from(
          new Map(
            data.map((contract) => [
              contract.customerId,
              {
                id: contract.customerId,
                name: contract.customerName,
                company: contract.customerCompany,
              },
            ])
          ).values()
        );

        const uniqueSingers = Array.from(
          new Map(
            data.map((contract) => [
              contract.singerId,
              {
                id: contract.singerId,
                name: contract.singerName,
              },
            ])
          ).values()
        );

        setCustomers(uniqueCustomers);
        setSingers(uniqueSingers);
      } catch (err) {
        console.error("계약 목록 조회 오류:", err);
        setError("계약 목록을 불러오는데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchContracts();
  }, []);

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
  const handleCancel = async (id: string) => {
    const confirmed = window.confirm("정말로 이 계약을 취소하시겠습니까?");
    if (!confirmed) return;

    try {
      await deleteContract(id);
      alert(`계약 ${id}가 취소되었습니다.`);

      // 목록에서 해당 계약 제거 또는 상태 업데이트
      setContracts(
        contracts.map((contract) =>
          contract.id === id
            ? { ...contract, contractStatus: "cancelled" }
            : contract
        )
      );
    } catch (err) {
      console.error("계약 취소 오류:", err);
      alert("계약 취소에 실패했습니다.");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div
            className="spinner-border inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent"
            role="status"
          >
            <span className="sr-only">로딩중...</span>
          </div>
          <p className="mt-2 text-gray-600">계약 목록을 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-2">⚠️ 오류</div>
          <p className="text-gray-700">{error}</p>
          <button
            className="mt-4 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
            onClick={() => window.location.reload()}
          >
            새로고침
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-10">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">계약 관리</h1>
          <p className="text-gray-600 mt-1">
            모든 계약 내역을 관리하고 상태를 확인하세요.
          </p>
        </div>
        <Link
          href="/admin/schedules/contracts/new"
          className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg flex items-center"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-1"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
              clipRule="evenodd"
            />
          </svg>
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
