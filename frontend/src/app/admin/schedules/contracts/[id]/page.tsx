"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Contract, contracts, payments } from "@/utils/dummyData";

export default function ContractDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const [contract, setContract] = useState<Contract | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const contractId = params.id;

  useEffect(() => {
    // 실제 환경에서는 API 호출로 대체
    const foundContract = contracts.find((c) => c.id === contractId);
    setContract(foundContract || null);
    setIsLoading(false);
  }, [contractId]);

  const formatDate = (dateString: string) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString("ko-KR");
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

  const handleEdit = () => {
    router.push(`/admin/schedules/contracts/${contractId}/edit`);
  };

  const handleCancel = () => {
    if (confirm("정말로 이 계약을 취소하시겠습니까?")) {
      alert(`계약 ${contractId}가 취소되었습니다.`);
      // 실제 구현에서는 API 호출 필요
    }
  };

  // 계약에 관련된 결제 내역 조회
  const contractPayments = payments.filter(
    (payment) => payment.contractId === contractId
  );

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-500">로딩 중...</p>
      </div>
    );
  }

  if (!contract) {
    return (
      <div className="bg-white rounded-lg shadow p-6 text-center">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">
          계약 정보를 찾을 수 없습니다
        </h2>
        <p className="text-gray-500 mb-6">
          요청하신 계약 정보가 존재하지 않거나 접근 권한이 없습니다.
        </p>
        <Link
          href="/admin/schedules/contracts"
          className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
        >
          계약 목록으로 돌아가기
        </Link>
      </div>
    );
  }

  return (
    <div className="pb-10">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">계약 상세 정보</h1>
          <p className="text-gray-600 mt-1">계약 ID: {contract.id}</p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={handleEdit}
            className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
          >
            계약 수정
          </button>
          <Link
            href="/admin/schedules/contracts"
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
          >
            목록으로 돌아가기
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden mb-6">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h2 className="text-lg font-medium text-gray-800">기본 정보</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">
                이벤트명
              </h3>
              <p className="text-base text-gray-900">{contract.eventTitle}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">
                이벤트 날짜
              </h3>
              <p className="text-base text-gray-900">
                {formatDate(contract.eventDate)}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">장소</h3>
              <p className="text-base text-gray-900">{contract.venue}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">
                계약 상태
              </h3>
              <span
                className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getContractStatusBadgeClass(
                  contract.contractStatus
                )}`}
              >
                {getContractStatusText(contract.contractStatus)}
              </span>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">
                계약 금액
              </h3>
              <p className="text-base text-gray-900">
                {contract.contractAmount}원
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">
                결제 상태
              </h3>
              <span
                className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getPaymentStatusBadgeClass(
                  contract.paymentStatus
                )}`}
              >
                {getPaymentStatusText(contract.paymentStatus)}
              </span>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">
                계약서 생성일
              </h3>
              <p className="text-base text-gray-900">
                {formatDate(contract.createdAt)}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">서명일</h3>
              <p className="text-base text-gray-900">
                {contract.signedAt ? formatDate(contract.signedAt) : "-"}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <h2 className="text-lg font-medium text-gray-800">고객 정보</h2>
          </div>
          <div className="p-6">
            <div className="mb-4">
              <h3 className="text-sm font-medium text-gray-500 mb-1">고객명</h3>
              <p className="text-base text-gray-900">{contract.customerName}</p>
            </div>
            <div className="mb-4">
              <h3 className="text-sm font-medium text-gray-500 mb-1">회사</h3>
              <p className="text-base text-gray-900">
                {contract.customerCompany}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">
                고객 ID
              </h3>
              <p className="text-base text-gray-900">{contract.customerId}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <h2 className="text-lg font-medium text-gray-800">아티스트 정보</h2>
          </div>
          <div className="p-6">
            <div className="mb-4">
              <h3 className="text-sm font-medium text-gray-500 mb-1">가수명</h3>
              <p className="text-base text-gray-900">{contract.singerName}</p>
            </div>
            <div className="mb-4">
              <h3 className="text-sm font-medium text-gray-500 mb-1">소속사</h3>
              <p className="text-base text-gray-900">{contract.singerAgency}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">
                가수 ID
              </h3>
              <p className="text-base text-gray-900">{contract.singerId}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden mb-6">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
          <h2 className="text-lg font-medium text-gray-800">결제 내역</h2>
          <button className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700">
            결제 등록
          </button>
        </div>
        <div className="overflow-x-auto">
          {contractPayments.length > 0 ? (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    결제 ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    금액
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    결제 방법
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    결제일
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    상태
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {contractPayments.map((payment) => (
                  <tr key={payment.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {payment.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {payment.amount}원
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {payment.paymentMethod}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatDate(payment.paymentDate)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          payment.status === "completed"
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {payment.status === "completed"
                          ? "완료"
                          : payment.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="p-6 text-center text-gray-500">
              등록된 결제 내역이 없습니다.
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-end space-x-2">
        {contract.contractStatus !== "cancelled" && (
          <button
            onClick={handleCancel}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            계약 취소
          </button>
        )}
      </div>
    </div>
  );
}
