"use client";
import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { matches, customers, singers } from "@/utils/dummyData";

export default function QuotePage() {
  const router = useRouter();
  const params = useParams();
  const negotiationId = params.id as string;
  const printRef = useRef<HTMLDivElement>(null);

  // 상태
  const [match, setMatch] = useState<any | null>(null);
  const [customer, setCustomer] = useState<any | null>(null);
  const [singer, setSinger] = useState<any | null>(null);
  const [quoteNo, setQuoteNo] = useState<string>("");
  const [currentDate, setCurrentDate] = useState<string>("");

  useEffect(() => {
    // dummyData.ts에서 매칭 데이터 찾기
    const foundMatch = matches.find((m) => m.id === negotiationId);
    if (foundMatch) {
      setMatch(foundMatch);

      // 관련 고객 및 가수 정보 조회
      const relatedCustomer = customers.find(
        (c) => c.id === foundMatch.customerId
      );
      const relatedSinger = singers.find((s) => s.id === foundMatch.singerId);

      setCustomer(relatedCustomer || null);
      setSinger(relatedSinger || null);

      // 견적서 번호 생성 (매칭 ID에서 MATCH 제거하고 Q 추가)
      setQuoteNo(`Q-${foundMatch.id.replace("MATCH-", "")}`);

      // 현재 날짜 설정
      const date = new Date();
      setCurrentDate(date.toLocaleDateString("ko-KR"));
    } else {
      // 매칭이 없으면 목록 페이지로 리다이렉트
      alert("매칭/협상 정보를 찾을 수 없습니다.");
      router.push("/admin/negotiations");
    }
  }, [negotiationId, router]);

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
    const date = new Date(dateString);
    return date.toLocaleDateString("ko-KR");
  };

  if (!match) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div>
      {/* 페이지 헤더 */}
      <div className="mb-6">
        <div className="flex items-center mb-2">
          <Link
            href={`/admin/negotiations/${match.id}`}
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
                  <strong>회사명:</strong>{" "}
                  {customer?.company || match.customerCompany}
                </p>
                <p>
                  <strong>담당자:</strong>{" "}
                  {customer?.name || match.customerName}
                </p>
                <p>
                  <strong>연락처:</strong> {customer?.phone || "정보 없음"}
                </p>
                <p>
                  <strong>이메일:</strong> {customer?.email || "정보 없음"}
                </p>
                <p>
                  <strong>주소:</strong> {customer?.address || "정보 없음"}
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
                    {match.singerName} ({match.singerAgency}) -{" "}
                    {match.requestTitle} 공연
                    <br />
                    <span className="text-xs text-gray-500">
                      일시: {formatDate(match.eventDate)} | 장소: {match.venue}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700 text-right">
                    {match.price.toLocaleString()}원
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
                    {match.price.toLocaleString()}원
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
                {match.requirements}
              </p>
              {match.notes && (
                <div className="mt-4 pt-4 border-t">
                  <p className="font-medium mb-2">추가 참고사항:</p>
                  <p className="whitespace-pre-line text-gray-700">
                    {match.notes}
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
