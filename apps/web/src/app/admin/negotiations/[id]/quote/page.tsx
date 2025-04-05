"use client";
import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  getNegotiationById,
  getCustomerById,
  getSingerById,
  Negotiation,
  Customer,
  Singer,
} from "@/services/negotiationsApi";

export default function QuotePage() {
  const router = useRouter();
  const params = useParams();
  const negotiationId = params.id as string;
  const printRef = useRef<HTMLDivElement>(null);

  // 상태
  const [negotiation, setNegotiation] = useState<Negotiation | null>(null);
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [singer, setSinger] = useState<Singer | null>(null);
  const [quoteNo, setQuoteNo] = useState<string>("");
  const [currentDate, setCurrentDate] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        // 협상 데이터 로드
        const negotiationData = await getNegotiationById(negotiationId);
        setNegotiation(negotiationData);

        // 견적서 번호 설정
        setQuoteNo(`Q-${negotiationId.substring(0, 8)}`);

        // 현재 날짜 설정
        const date = new Date();
        setCurrentDate(date.toLocaleDateString("ko-KR"));

        // 고객 및 가수 정보 로드
        if (negotiationData) {
          if (negotiationData.customerId) {
            const customerData = await getCustomerById(
              negotiationData.customerId
            );
            setCustomer(customerData);
          }

          if (negotiationData.singerId) {
            const singerData = await getSingerById(negotiationData.singerId);
            setSinger(singerData);
          }
        }
      } catch (err) {
        console.error("견적서 데이터 로드 중 오류:", err);
        setError("견적서 정보를 불러오지 못했습니다.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [negotiationId]);

  // 견적서 인쇄 처리
  const handlePrint = () => {
    const content = printRef.current;
    if (content) {
      const printWindow = window.open("", "", "width=800,height=800");
      if (printWindow) {
        printWindow.document.write("<html><head><title>견적서</title>");
        printWindow.document.write(
          '<link rel="stylesheet" href="/styles/globals.css">'
        );
        printWindow.document.write(
          "<style>body { font-family: Arial, sans-serif; }</style>"
        );
        printWindow.document.write("</head><body>");
        printWindow.document.write(content.innerHTML);
        printWindow.document.write("</body></html>");
        printWindow.document.close();

        // 약간의 지연 후 인쇄 실행 (스타일 로딩을 위해)
        setTimeout(() => {
          printWindow.print();
          printWindow.close();
        }, 250);
      }
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
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (error || !negotiation) {
    return (
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
            <p className="mt-1 text-sm text-red-700">
              {error || "견적서 정보를 불러오지 못했습니다."}
            </p>
            <div className="mt-3">
              <Link
                href="/admin/negotiations"
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              >
                목록으로 돌아가기
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* 페이지 헤더 */}
      <div className="mb-6">
        <div className="flex items-center mb-2">
          <Link
            href={`/admin/negotiations/${negotiationId}`}
            className="text-gray-500 hover:text-gray-700 mr-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
          </Link>
          <h1 className="text-2xl font-bold text-gray-800">견적서 상세</h1>
        </div>
        <div className="flex justify-between items-center">
          <p className="text-gray-600">
            견적서 번호: {quoteNo} | 작성일: {currentDate}
          </p>
          <div className="flex space-x-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              인쇄하기
            </button>
            <Link
              href="/admin/negotiations/final-quote"
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              목록으로
            </Link>
          </div>
        </div>
      </div>

      {/* 견적서 내용 */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-6" ref={printRef}>
          {/* 견적서 머리말 */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold">견 적 서</h1>
            <p className="mt-2 text-gray-700">견적서 번호: {quoteNo}</p>
          </div>

          {/* 고객 정보 및 발행 정보 */}
          <div className="grid grid-cols-2 gap-6 mb-8">
            <div className="border rounded-lg p-4">
              <h2 className="text-lg font-semibold mb-2 pb-2 border-b">
                고객 정보
              </h2>
              <div className="space-y-2">
                <p>
                  <strong>회사명:</strong> {customer?.company || "-"}
                </p>
                <p>
                  <strong>담당자:</strong> {customer?.name || "-"}
                </p>
                <p>
                  <strong>연락처:</strong> {customer?.phone || "-"}
                </p>
                <p>
                  <strong>이메일:</strong> {customer?.email || "-"}
                </p>
                <p>
                  <strong>주소:</strong> {customer?.address || "-"}
                </p>
              </div>
            </div>
            <div className="border rounded-lg p-4">
              <h2 className="text-lg font-semibold mb-2 pb-2 border-b">
                견적 정보
              </h2>
              <div className="space-y-2">
                <p>
                  <strong>견적 번호:</strong> {quoteNo}
                </p>
                <p>
                  <strong>발행일:</strong> {currentDate}
                </p>
                <p>
                  <strong>유효기간:</strong> 발행일로부터 30일
                </p>
                <p>
                  <strong>담당자:</strong> 관리자
                </p>
              </div>
            </div>
          </div>

          {/* 견적 내용 */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-4 pb-2 border-b">
              견적 내용
            </h2>
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                    항목
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                    상세 내용
                  </th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">
                    금액
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="px-4 py-3 text-sm text-gray-700">공연료</td>
                  <td className="px-4 py-3 text-sm text-gray-700">
                    {singer?.name || "-"} ({singer?.agency || "-"}) -{" "}
                    {negotiation.title || "-"} 공연
                    <br />
                    <span className="text-xs text-gray-500">
                      일시: {formatDate(negotiation.eventDate || "")} | 장소:{" "}
                      {negotiation.eventLocation || "-"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700 text-right">
                    {negotiation.finalAmount
                      ? negotiation.finalAmount.toLocaleString()
                      : 0}
                    원
                  </td>
                </tr>
                <tr>
                  <td
                    colSpan={2}
                    className="px-4 py-3 text-sm text-gray-700 text-right font-medium"
                  >
                    총 견적 금액 (부가세 포함)
                  </td>
                  <td className="px-4 py-3 text-base text-gray-900 text-right font-bold">
                    {negotiation.finalAmount
                      ? negotiation.finalAmount.toLocaleString()
                      : 0}
                    원
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* 요구사항 및 참고사항 */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-4 pb-2 border-b">
              요구사항 및 참고사항
            </h2>
            <div className="p-4 border rounded-lg bg-gray-50">
              <p className="whitespace-pre-line text-gray-700">
                {negotiation.requirements || "요구사항 없음"}
              </p>
              {negotiation.notes && (
                <div className="mt-4 pt-4 border-t">
                  <p className="font-medium mb-2">추가 참고사항:</p>
                  <p className="whitespace-pre-line text-gray-700">
                    {negotiation.notes}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* 결제 조건 */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-4 pb-2 border-b">
              결제 조건
            </h2>
            <ul className="list-disc list-inside space-y-2 pl-4 text-gray-700">
              <li>계약금 50%는 계약 체결 시 입금</li>
              <li>잔금 50%는 행사 7일 전까지 입금</li>
              <li>
                입금 계좌: 우리은행 1234-567-890123 (주식회사 가수매니지먼트)
              </li>
              <li>문의사항은 담당자에게 연락 부탁드립니다.</li>
            </ul>
          </div>

          {/* 회사 정보 */}
          <div className="mt-10 pt-6 border-t text-center">
            <div className="text-xl font-bold mb-2">
              주식회사 가수매니지먼트
            </div>
            <p className="text-gray-700">
              서울특별시 강남구 테헤란로 123 | 대표: 홍길동 | 사업자등록번호:
              123-45-67890
              <br />
              전화: 02-1234-5678 | 이메일: info@singersmgmt.com | 웹사이트:
              www.singersmgmt.com
            </p>
          </div>

          {/* 도장/서명 영역 */}
          <div className="mt-8 flex justify-end">
            <div className="border-2 border-gray-300 rounded-lg h-24 w-24 flex items-center justify-center text-center p-2 text-gray-500">
              (인)
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
