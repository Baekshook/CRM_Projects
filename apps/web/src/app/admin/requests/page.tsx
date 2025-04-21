"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  getAllRequests,
  getAllCustomers,
  getAllSingers,
  Request,
  Customer,
  Singer,
  deleteRequest,
} from "@/services/negotiationsApi";

// API URL
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

export default function RequestsPage() {
  const router = useRouter();
  const [requests, setRequests] = useState<Request[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [singers, setSingers] = useState<Singer[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // 필터 상태
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [customerFilter, setCustomerFilter] = useState<string>("all");
  const [singerFilter, setSingerFilter] = useState<string>("all");
  const [dateFilter, setDateFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // 액션 상태
  const [activeRequestId, setActiveRequestId] = useState<string | null>(null);

  // 데이터 로드
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        // 데이터 병렬로 로드
        const [requestsData, customersData, singersData] = await Promise.all([
          getAllRequests(),
          getAllCustomers(),
          getAllSingers(),
        ]);

        setRequests(requestsData);
        setCustomers(customersData);
        setSingers(singersData);
      } catch (err) {
        console.error("데이터 로드 중 오류:", err);
        setError(
          "API 서버에 연결할 수 없습니다. 백엔드 서버가 실행 중인지 확인하세요."
        );
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // 고객 및 가수 정보를 ID로 조회하는 함수
  const getCustomerById = (id: string) => {
    return customers.find((customer) => customer.id === id);
  };

  const getSingerById = (id: string) => {
    return singers.find((singer) => singer.id === id);
  };

  // 필터링된 요청서 목록
  const filteredRequests = requests
    .map((request) => ({
      ...request,
      customer: getCustomerById(request.customerId),
      singer: request.singerId ? getSingerById(request.singerId) : undefined,
    }))
    .filter((request) => {
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
        !request.title?.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !request.customer?.name
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase()) &&
        !request.customer?.company
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase()) &&
        !request.id.toLowerCase().includes(searchQuery.toLowerCase())
      ) {
        return false;
      }

      // 날짜 필터
      if (dateFilter !== "all") {
        const currentDate = new Date();
        const requestDate = new Date(request.createdAt);
        const diffDays = Math.ceil(
          (currentDate.getTime() - requestDate.getTime()) /
            (1000 * 60 * 60 * 24)
        );

        if (
          (dateFilter === "7days" && diffDays > 7) ||
          (dateFilter === "30days" && diffDays > 30) ||
          (dateFilter === "90days" && diffDays > 90)
        ) {
          return false;
        }
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
  const handleDelete = async (id: string) => {
    if (confirm("정말로 이 요청서를 삭제하시겠습니까?")) {
      try {
        setLoading(true);
        const result = await deleteRequest(id);

        // 삭제 성공 시 로컬 상태 업데이트
        alert("요청서가 삭제되었습니다.");
        setRequests(requests.filter((req) => req.id !== id));
      } catch (error) {
        console.error("요청서 삭제 실패:", error);
        alert("요청서 삭제에 실패했습니다. 다시 시도해주세요.");
      } finally {
        setLoading(false);
      }
    }
  };

  // 날짜 포맷팅 함수
  const formatDate = (dateString: string) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString("ko-KR");
  };

  // 오류 메시지 렌더링
  if (error) {
    return (
      <div className="rounded-md bg-red-50 p-4">
        <div className="flex">
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">
              오류가 발생했습니다
            </h3>
            <p className="mt-1 text-sm text-red-700">{error}</p>
            <p className="mt-2 text-sm text-red-700">
              백엔드 API 서버가 실행 중인지 확인하세요. ({API_URL})
            </p>
          </div>
        </div>
      </div>
    );
  }

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
              {customers.map((customer) => (
                <option key={customer.id} value={customer.id}>
                  {customer.name}{" "}
                  {customer.company ? `(${customer.company})` : ""}
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
              {singers.map((singer) => (
                <option key={singer.id} value={singer.id}>
                  {singer.name} {singer.agency ? `(${singer.agency})` : ""}
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

        {/* 로딩 중 표시 */}
        {loading && (
          <div className="flex justify-center items-center p-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
              <p className="text-gray-600">데이터를 불러오는 중입니다...</p>
            </div>
          </div>
        )}

        {/* 데이터 테이블 */}
        {!loading && !error && (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                    요청 ID
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
                    이벤트 유형
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                    이벤트 날짜
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                    예산
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                    상태
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                    생성일
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-black uppercase tracking-wider">
                    관리
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredRequests.length === 0 ? (
                  <tr>
                    <td
                      colSpan={10}
                      className="px-6 py-4 text-center text-black"
                    >
                      {loading ? "로딩 중..." : "요청서가 없습니다."}
                    </td>
                  </tr>
                ) : (
                  filteredRequests.map((request) => (
                    <tr
                      key={request.id}
                      className={`hover:bg-gray-50 ${
                        activeRequestId === request.id ? "bg-gray-50" : ""
                      }`}
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {request.id.substring(0, 8)}...
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {request.title || "제목 없음"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {request.customer?.name || "고객 정보 없음"}
                        </div>
                        <div className="text-xs text-gray-500">
                          {request.customer?.company || "-"}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {request.singer ? (
                          <div>
                            <div className="text-sm text-gray-900">
                              {request.singer.name}
                            </div>
                            <div className="text-xs text-gray-500">
                              {request.singer.agency || "-"}
                            </div>
                          </div>
                        ) : (
                          <span className="text-gray-400">미지정</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {request.eventType}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatDate(request.eventDate)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {request.budget}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(
                            request.status
                          )}`}
                        >
                          {getStatusText(request.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(request.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex space-x-2 justify-end">
                          <button
                            className="text-blue-600 hover:text-blue-900"
                            onClick={() => handleViewDetail(request.id)}
                          >
                            상세
                          </button>
                          <button
                            className="text-orange-600 hover:text-orange-900"
                            onClick={() => handleEdit(request.id)}
                          >
                            수정
                          </button>
                          <button
                            className="text-red-600 hover:text-red-900"
                            onClick={() => handleDelete(request.id)}
                          >
                            삭제
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
