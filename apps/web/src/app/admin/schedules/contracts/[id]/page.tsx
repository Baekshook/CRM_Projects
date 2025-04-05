"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Contract } from "@/utils/dummyData";
import {
  getContractByIdTemp,
  deleteContract,
  signContract,
} from "@/services/schedulesApi";

export default function ContractDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [contract, setContract] = useState<Contract | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState<boolean>(false);
  const [signLoading, setSignLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchContract = async () => {
      try {
        setLoading(true);
        setError(null);
        // 실제 API 연동 시: const data = await getContractById(params.id as string);
        const data = await getContractByIdTemp(params.id as string);

        if (!data) {
          setError("계약 정보를 찾을 수 없습니다.");
          return;
        }

        setContract(data);
      } catch (err) {
        console.error("계약 상세 조회 오류:", err);
        setError("계약 정보를 불러오는데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchContract();
    }
  }, [params.id]);

  const handleCancel = async () => {
    if (!contract) return;

    const confirmed = window.confirm("정말로 이 계약을 취소하시겠습니까?");
    if (!confirmed) return;

    try {
      setDeleteLoading(true);
      await deleteContract(contract.id);
      setContract({ ...contract, contractStatus: "cancelled" });
      alert("계약이 취소되었습니다.");
    } catch (err) {
      console.error("계약 취소 오류:", err);
      alert("계약 취소에 실패했습니다.");
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleSign = async () => {
    if (!contract) return;

    const confirmed = window.confirm("계약서에 서명하시겠습니까?");
    if (!confirmed) return;

    try {
      setSignLoading(true);
      const signatureData = {
        signatureDate: new Date().toISOString(),
      };
      await signContract(contract.id, signatureData);
      setContract({
        ...contract,
        contractStatus: "signed",
        signedAt: new Date().toISOString(),
      });
      alert("계약서에 서명되었습니다.");
    } catch (err) {
      console.error("계약 서명 오류:", err);
      alert("계약 서명에 실패했습니다.");
    } finally {
      setSignLoading(false);
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
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString("ko-KR");
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
          <p className="mt-2 text-gray-600">계약 정보를 불러오는 중...</p>
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
          <div className="mt-4 flex justify-center space-x-3">
            <button
              className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
              onClick={() => window.location.reload()}
            >
              새로고침
            </button>
            <Link
              href="/admin/schedules/contracts"
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
            >
              목록으로
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!contract) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="text-yellow-500 text-xl mb-2">⚠️ 알림</div>
          <p className="text-gray-700">존재하지 않는 계약입니다.</p>
          <Link
            href="/admin/schedules/contracts"
            className="mt-4 inline-block px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
          >
            목록으로
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-10">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">계약 상세</h1>
          <p className="text-gray-600 mt-1">계약 번호: {contract.id}</p>
        </div>
        <div className="flex space-x-4">
          {contract.contractStatus !== "signed" &&
            contract.contractStatus !== "completed" &&
            contract.contractStatus !== "cancelled" && (
              <>
                <button
                  onClick={handleSign}
                  disabled={signLoading}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
                >
                  {signLoading ? "서명 중..." : "계약 서명"}
                </button>
                <Link
                  href={`/admin/schedules/contracts/${contract.id}/edit`}
                  className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                >
                  계약 수정
                </Link>
              </>
            )}
          {contract.contractStatus !== "cancelled" && (
            <button
              onClick={handleCancel}
              disabled={deleteLoading}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
            >
              {deleteLoading ? "취소 중..." : "계약 취소"}
            </button>
          )}
          <Link
            href="/admin/schedules/contracts"
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            목록으로
          </Link>
        </div>
      </div>

      {/* 계약 정보 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              계약 정보
            </h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-500">
                  계약 상태
                </span>
                <span
                  className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getContractStatusBadgeClass(
                    contract.contractStatus
                  )}`}
                >
                  {getContractStatusText(contract.contractStatus)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-500">
                  결제 상태
                </span>
                <span
                  className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getPaymentStatusBadgeClass(
                    contract.paymentStatus
                  )}`}
                >
                  {getPaymentStatusText(contract.paymentStatus)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-500">
                  계약 금액
                </span>
                <span className="text-sm text-gray-900 font-semibold">
                  {contract.contractAmount}원
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-500">
                  생성일
                </span>
                <span className="text-sm text-gray-900">
                  {formatDate(contract.createdAt)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-500">
                  서명일
                </span>
                <span className="text-sm text-gray-900">
                  {formatDate(contract.signedAt || "")}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              이벤트 정보
            </h2>
            <div className="space-y-4">
              <div>
                <span className="block text-sm font-medium text-gray-500">
                  이벤트명
                </span>
                <span className="mt-1 block text-sm text-gray-900">
                  {contract.eventTitle}
                </span>
              </div>
              <div>
                <span className="block text-sm font-medium text-gray-500">
                  행사 날짜
                </span>
                <span className="mt-1 block text-sm text-gray-900">
                  {formatDate(contract.eventDate)}
                </span>
              </div>
              <div>
                <span className="block text-sm font-medium text-gray-500">
                  장소
                </span>
                <span className="mt-1 block text-sm text-gray-900">
                  {contract.venue}
                </span>
              </div>
              <div>
                <span className="block text-sm font-medium text-gray-500">
                  일정 ID
                </span>
                <span className="mt-1 block text-sm text-gray-900">
                  {contract.scheduleId}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 고객 및 가수 정보 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              고객 정보
            </h2>
            <div className="space-y-4">
              <div>
                <span className="block text-sm font-medium text-gray-500">
                  고객명
                </span>
                <span className="mt-1 block text-sm text-gray-900">
                  {contract.customerName}
                </span>
              </div>
              <div>
                <span className="block text-sm font-medium text-gray-500">
                  회사명
                </span>
                <span className="mt-1 block text-sm text-gray-900">
                  {contract.customerCompany}
                </span>
              </div>
              <div>
                <span className="block text-sm font-medium text-gray-500">
                  고객 ID
                </span>
                <span className="mt-1 block text-sm text-gray-900">
                  {contract.customerId}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              가수 정보
            </h2>
            <div className="space-y-4">
              <div>
                <span className="block text-sm font-medium text-gray-500">
                  가수명
                </span>
                <span className="mt-1 block text-sm text-gray-900">
                  {contract.singerName}
                </span>
              </div>
              <div>
                <span className="block text-sm font-medium text-gray-500">
                  소속사
                </span>
                <span className="mt-1 block text-sm text-gray-900">
                  {contract.singerAgency}
                </span>
              </div>
              <div>
                <span className="block text-sm font-medium text-gray-500">
                  가수 ID
                </span>
                <span className="mt-1 block text-sm text-gray-900">
                  {contract.singerId}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 계약서 보기 */}
      <div className="bg-white rounded-lg shadow overflow-hidden mb-6">
        <div className="p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            계약서 미리보기
          </h2>
          <div className="border border-gray-300 p-8 bg-gray-50 rounded-lg min-h-[300px]">
            <div className="text-center mb-8">
              <h3 className="text-xl font-bold mb-2">공연 계약서</h3>
              <p className="text-gray-600">계약번호: {contract.id}</p>
            </div>

            <div className="mb-6">
              <p className="text-sm mb-4">
                본 계약서는 다음과 같이 {contract.customerCompany}(이하
                "고객")와 {contract.singerAgency} 소속 {contract.singerName}
                (이하 "가수") 간에 체결됩니다.
              </p>

              <div className="mb-4">
                <h4 className="font-semibold mb-2">1. 공연 정보</h4>
                <p className="text-sm">- 행사명: {contract.eventTitle}</p>
                <p className="text-sm">
                  - 공연 일시: {formatDate(contract.eventDate)}
                </p>
                <p className="text-sm">- 공연 장소: {contract.venue}</p>
              </div>

              <div className="mb-4">
                <h4 className="font-semibold mb-2">2. 계약 금액</h4>
                <p className="text-sm">
                  - 총 계약금액: {contract.contractAmount}원
                </p>
                <p className="text-sm">
                  - 계약금(50%):{" "}
                  {parseInt(contract.contractAmount.replace(/,/g, "")) / 2}원
                </p>
                <p className="text-sm">
                  - 잔금(50%):{" "}
                  {parseInt(contract.contractAmount.replace(/,/g, "")) / 2}원
                </p>
              </div>

              <div className="mb-4">
                <h4 className="font-semibold mb-2">3. 기타 조항</h4>
                <p className="text-sm">
                  - 양 당사자는 본 계약의 내용을 성실히 이행해야 합니다.
                </p>
                <p className="text-sm">
                  - 불가항력적인 사유로 계약을 이행할 수 없는 경우, 상호
                  협의하에 계약을 조정하거나 해지할 수 있습니다.
                </p>
              </div>
            </div>

            <div className="flex justify-between">
              <div>
                <p className="font-semibold mb-2">고객 서명</p>
                <div className="h-16 w-40 border border-gray-300 rounded flex items-center justify-center">
                  {contract.contractStatus === "signed" ||
                  contract.contractStatus === "completed" ? (
                    <p className="font-semibold text-blue-600">
                      {contract.customerName}
                    </p>
                  ) : (
                    <p className="text-gray-400 text-sm">미서명</p>
                  )}
                </div>
              </div>

              <div>
                <p className="font-semibold mb-2">가수 서명</p>
                <div className="h-16 w-40 border border-gray-300 rounded flex items-center justify-center">
                  {contract.contractStatus === "signed" ||
                  contract.contractStatus === "completed" ? (
                    <p className="font-semibold text-blue-600">
                      {contract.singerName}
                    </p>
                  ) : (
                    <p className="text-gray-400 text-sm">미서명</p>
                  )}
                </div>
              </div>
            </div>

            {contract.signedAt && (
              <div className="text-right mt-4 text-sm text-gray-500">
                서명일: {formatDate(contract.signedAt)}
              </div>
            )}
          </div>
          <div className="mt-4 flex justify-end">
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              onClick={() => window.print()}
            >
              인쇄하기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
