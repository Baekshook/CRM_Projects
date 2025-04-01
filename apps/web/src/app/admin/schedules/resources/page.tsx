"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { singers } from "@/utils/dummyData";

// 임시 장소 데이터 (실제로는 dummyData.ts에 추가해야 함)
const venues = [
  {
    id: "VENUE-001",
    name: "그랜드 호텔 볼룸",
    address: "서울시 강남구 테헤란로 123",
    capacity: 300,
    facilities: "무대, 음향시스템, 조명, 케이터링",
    contactPerson: "김매니저",
    contactPhone: "02-123-4567",
    contactEmail: "manager@grandhotel.com",
    status: "available",
  },
  {
    id: "VENUE-002",
    name: "시티 컨벤션 센터",
    address: "서울시 서초구 반포대로 45",
    capacity: 500,
    facilities: "대형 무대, 프로젝터, 음향시스템, WiFi",
    contactPerson: "이담당자",
    contactPhone: "02-234-5678",
    contactEmail: "info@cityconvention.com",
    status: "available",
  },
  {
    id: "VENUE-003",
    name: "대학교 대강당",
    address: "서울시 마포구 와우산로 94",
    capacity: 800,
    facilities: "대형 무대, 음향시스템, 대형 스크린",
    contactPerson: "박교수",
    contactPhone: "02-345-6789",
    contactEmail: "hall@university.edu",
    status: "maintenance",
  },
  {
    id: "VENUE-004",
    name: "문화예술회관",
    address: "서울시 종로구 세종대로 175",
    capacity: 1200,
    facilities: "프로페셔널 무대, 최신 음향시스템, 분장실",
    contactPerson: "최관리자",
    contactPhone: "02-456-7890",
    contactEmail: "info@culturecenter.org",
    status: "available",
  },
];

export default function ResourcesPage() {
  const router = useRouter();
  // 현재 선택된 리소스 타입
  const [resourceType, setResourceType] = useState<"singer" | "venue">(
    "singer"
  );

  // 필터 상태
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // 필터링된 가수 목록
  const filteredSingers = singers.filter((singer) => {
    // 상태 필터
    if (statusFilter !== "all" && singer.status !== statusFilter) {
      return false;
    }

    // 검색어 필터
    if (
      searchQuery &&
      !singer.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !singer.agency.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !singer.genre.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }

    return true;
  });

  // 필터링된 장소 목록
  const filteredVenues = venues.filter((venue) => {
    // 상태 필터
    if (statusFilter !== "all" && venue.status !== statusFilter) {
      return false;
    }

    // 검색어 필터
    if (
      searchQuery &&
      !venue.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !venue.address.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }

    return true;
  });

  // 상태에 따른 배지 색상
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "active":
      case "available":
        return "bg-green-100 text-green-800";
      case "inactive":
      case "maintenance":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "active":
        return "활동중";
      case "inactive":
        return "비활성";
      case "available":
        return "이용가능";
      case "maintenance":
        return "점검중";
      default:
        return status;
    }
  };

  // 등급 표시
  const renderGrade = (grade: number) => {
    return (
      <div className="flex items-center">
        {Array.from({ length: grade }).map((_, index) => (
          <svg
            key={index}
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 text-yellow-400"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
        {Array.from({ length: 5 - grade }).map((_, index) => (
          <svg
            key={index + grade}
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 text-gray-300"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
    );
  };

  // 가수 상세 페이지로 이동
  const handleViewSingerDetail = (id: string) => {
    router.push(`/admin/singers/${id}`);
  };

  // 장소 상세 페이지로 이동
  const handleViewVenueDetail = (id: string) => {
    router.push(`/admin/venues/${id}`);
  };

  return (
    <div className="pb-10">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">리소스 관리</h1>
          <p className="text-gray-600 mt-1">
            가수와 장소 리소스를 확인하고 관리하세요.
          </p>
        </div>
        <div className="flex space-x-2">
          {resourceType === "singer" && (
            <Link
              href="/admin/singers/new"
              className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
            >
              새 가수 등록
            </Link>
          )}
          {resourceType === "venue" && (
            <Link
              href="/admin/venues/new"
              className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
            >
              새 장소 등록
            </Link>
          )}
        </div>
      </div>

      {/* 리소스 타입 선택 */}
      <div className="flex mb-6 border-b border-gray-200">
        <button
          onClick={() => setResourceType("singer")}
          className={`px-4 py-2 mr-2 text-gray-700 border-b-2 ${
            resourceType === "singer"
              ? "border-orange-600 text-orange-600"
              : "border-transparent hover:text-orange-600 hover:border-orange-600"
          }`}
        >
          가수
        </button>
        <button
          onClick={() => setResourceType("venue")}
          className={`px-4 py-2 text-gray-700 border-b-2 ${
            resourceType === "venue"
              ? "border-orange-600 text-orange-600"
              : "border-transparent hover:text-orange-600 hover:border-orange-600"
          }`}
        >
          장소
        </button>
      </div>

      {/* 필터 섹션 */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              검색
            </label>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                resourceType === "singer"
                  ? "가수명, 소속사, 장르 검색..."
                  : "장소명, 주소 검색..."
              }
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              상태
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
            >
              <option value="all">모든 상태</option>
              {resourceType === "singer" ? (
                <>
                  <option value="active">활동중</option>
                  <option value="inactive">비활성</option>
                </>
              ) : (
                <>
                  <option value="available">이용가능</option>
                  <option value="maintenance">점검중</option>
                </>
              )}
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={() => {
                setStatusFilter("all");
                setSearchQuery("");
              }}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
            >
              필터 초기화
            </button>
          </div>
        </div>
      </div>

      {/* 리소스 목록 */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-4 py-2 border-b border-gray-200 bg-gray-50">
          <h2 className="text-sm font-medium text-gray-700">
            총{" "}
            {resourceType === "singer"
              ? filteredSingers.length
              : filteredVenues.length}
            개의 {resourceType === "singer" ? "가수" : "장소"}
          </h2>
        </div>

        {resourceType === "singer" ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    가수 ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    이름
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    소속사
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    장르
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    등급
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    평점
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    금액
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    상태
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    관리
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredSingers.length === 0 ? (
                  <tr>
                    <td
                      colSpan={9}
                      className="px-6 py-4 text-center text-gray-500"
                    >
                      등록된 가수가 없습니다.
                    </td>
                  </tr>
                ) : (
                  filteredSingers.map((singer) => (
                    <tr key={singer.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {singer.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {singer.profileImage && (
                            <div className="flex-shrink-0 h-10 w-10 mr-3">
                              <img
                                className="h-10 w-10 rounded-full"
                                src={singer.profileImage}
                                alt={singer.name}
                              />
                            </div>
                          )}
                          <div className="text-sm font-medium text-gray-900">
                            {singer.name}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {singer.agency}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {singer.genre}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {renderGrade(singer.grade)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {singer.rating.toFixed(1)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {singer.price.toLocaleString()}원
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(
                            singer.status
                          )}`}
                        >
                          {getStatusText(singer.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex space-x-2 justify-end">
                          <button
                            className="text-blue-600 hover:text-blue-900"
                            onClick={() => handleViewSingerDetail(singer.id)}
                          >
                            상세
                          </button>
                          <Link
                            href={`/admin/singers/${singer.id}/edit`}
                            className="text-orange-600 hover:text-orange-900"
                          >
                            수정
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    장소 ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    이름
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    주소
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    수용 인원
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    시설
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    담당자
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    상태
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    관리
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredVenues.length === 0 ? (
                  <tr>
                    <td
                      colSpan={8}
                      className="px-6 py-4 text-center text-gray-500"
                    >
                      등록된 장소가 없습니다.
                    </td>
                  </tr>
                ) : (
                  filteredVenues.map((venue) => (
                    <tr key={venue.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {venue.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {venue.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {venue.address}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {venue.capacity}명
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                        {venue.facilities}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {venue.contactPerson}
                        </div>
                        <div className="text-xs text-gray-500">
                          {venue.contactPhone}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(
                            venue.status
                          )}`}
                        >
                          {getStatusText(venue.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex space-x-2 justify-end">
                          <button
                            className="text-blue-600 hover:text-blue-900"
                            onClick={() => handleViewVenueDetail(venue.id)}
                          >
                            상세
                          </button>
                          <Link
                            href={`/admin/venues/${venue.id}/edit`}
                            className="text-orange-600 hover:text-orange-900"
                          >
                            수정
                          </Link>
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
