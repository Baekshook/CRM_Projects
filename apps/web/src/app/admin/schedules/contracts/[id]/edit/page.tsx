"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Contract } from "@/utils/dummyData";
import { getContractByIdTemp, updateContract } from "@/services/schedulesApi";

export default function EditContractPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const contractId = params.id;
  const [isLoading, setIsLoading] = useState(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Contract>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetchContract = async () => {
      try {
        setIsLoading(true);
        setError(null);
        // 실제 API 연동 시: const data = await getContractById(contractId);
        const data = await getContractByIdTemp(contractId);

        if (!data) {
          setError("계약 정보를 찾을 수 없습니다.");
          return;
        }

        setFormData(data);
      } catch (err) {
        console.error("계약 상세 조회 오류:", err);
        setError("계약 정보를 불러오는데 실패했습니다.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchContract();
  }, [contractId]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.eventTitle?.trim()) {
      newErrors.eventTitle = "이벤트명은 필수 입력 항목입니다.";
    }

    if (!formData.eventDate?.trim()) {
      newErrors.eventDate = "이벤트 날짜는 필수 입력 항목입니다.";
    }

    if (!formData.venue?.trim()) {
      newErrors.venue = "장소는 필수 입력 항목입니다.";
    }

    if (!formData.contractAmount?.trim()) {
      newErrors.contractAmount = "계약 금액은 필수 입력 항목입니다.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setSaving(true);
      await updateContract(contractId, formData);
      alert("계약이 수정되었습니다.");
      router.push(`/admin/schedules/contracts/${contractId}`);
    } catch (err) {
      console.error("계약 수정 오류:", err);
      alert("계약 수정에 실패했습니다.");
    } finally {
      setSaving(false);
    }
  };

  if (isLoading) {
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

  return (
    <div className="pb-10">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">계약 수정</h1>
          <p className="text-gray-600 mt-1">계약 ID: {contractId}</p>
        </div>
        <div className="flex space-x-2">
          <Link
            href={`/admin/schedules/contracts/${contractId}`}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
          >
            취소
          </Link>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-lg shadow overflow-hidden p-6">
          <h2 className="text-lg font-medium text-gray-800 mb-4">기본 정보</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="eventTitle"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                이벤트명
              </label>
              <input
                type="text"
                id="eventTitle"
                name="eventTitle"
                value={formData.eventTitle || ""}
                onChange={handleChange}
                className={`w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 ${
                  errors.eventTitle ? "border-red-500" : ""
                }`}
              />
              {errors.eventTitle && (
                <p className="mt-1 text-sm text-red-600">{errors.eventTitle}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="eventDate"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                이벤트 날짜
              </label>
              <input
                type="date"
                id="eventDate"
                name="eventDate"
                value={formData.eventDate?.split("T")[0] || ""}
                onChange={handleChange}
                className={`w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 ${
                  errors.eventDate ? "border-red-500" : ""
                }`}
              />
              {errors.eventDate && (
                <p className="mt-1 text-sm text-red-600">{errors.eventDate}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="venue"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                장소
              </label>
              <input
                type="text"
                id="venue"
                name="venue"
                value={formData.venue || ""}
                onChange={handleChange}
                className={`w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 ${
                  errors.venue ? "border-red-500" : ""
                }`}
              />
              {errors.venue && (
                <p className="mt-1 text-sm text-red-600">{errors.venue}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="contractAmount"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                계약 금액
              </label>
              <input
                type="text"
                id="contractAmount"
                name="contractAmount"
                value={formData.contractAmount || ""}
                onChange={handleChange}
                className={`w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 ${
                  errors.contractAmount ? "border-red-500" : ""
                }`}
              />
              {errors.contractAmount && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.contractAmount}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="contractStatus"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                계약 상태
              </label>
              <select
                id="contractStatus"
                name="contractStatus"
                value={formData.contractStatus || ""}
                onChange={handleChange}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
              >
                <option value="draft">초안</option>
                <option value="sent">전송됨</option>
                <option value="signed">서명됨</option>
                <option value="completed">완료</option>
                <option value="cancelled">취소</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="paymentStatus"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                결제 상태
              </label>
              <select
                id="paymentStatus"
                name="paymentStatus"
                value={formData.paymentStatus || ""}
                onChange={handleChange}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
              >
                <option value="unpaid">미결제</option>
                <option value="partial">부분결제</option>
                <option value="paid">결제완료</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="signedAt"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                서명일
              </label>
              <input
                type="date"
                id="signedAt"
                name="signedAt"
                value={formData.signedAt?.split("T")[0] || ""}
                onChange={handleChange}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden p-6">
          <h2 className="text-lg font-medium text-gray-800 mb-4">고객 정보</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="customerName"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                고객명
              </label>
              <input
                type="text"
                id="customerName"
                name="customerName"
                value={formData.customerName || ""}
                onChange={handleChange}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                readOnly
              />
            </div>

            <div>
              <label
                htmlFor="customerCompany"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                회사
              </label>
              <input
                type="text"
                id="customerCompany"
                name="customerCompany"
                value={formData.customerCompany || ""}
                onChange={handleChange}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                readOnly
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden p-6">
          <h2 className="text-lg font-medium text-gray-800 mb-4">
            아티스트 정보
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="singerName"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                가수명
              </label>
              <input
                type="text"
                id="singerName"
                name="singerName"
                value={formData.singerName || ""}
                onChange={handleChange}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                readOnly
              />
            </div>

            <div>
              <label
                htmlFor="singerAgency"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                소속사
              </label>
              <input
                type="text"
                id="singerAgency"
                name="singerAgency"
                value={formData.singerAgency || ""}
                onChange={handleChange}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                readOnly
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-2">
          <Link
            href={`/admin/schedules/contracts/${contractId}`}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
          >
            취소
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50"
          >
            {saving ? "저장 중..." : "저장"}
          </button>
        </div>
      </form>
    </div>
  );
}
