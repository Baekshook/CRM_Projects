"use client";
import { useState } from "react";
import Link from "next/link";

// 사용자 타입 정의
interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  lastLogin: string;
  status: string;
}

export default function UsersPage() {
  // 필터 상태
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

  // 사용자 데이터
  const users: User[] = [
    {
      id: "USR-001",
      name: "관리자",
      email: "admin@companyb.com",
      role: "관리자",
      department: "시스템 관리팀",
      lastLogin: "2025-03-15 14:30",
      status: "활성",
    },
    {
      id: "USR-002",
      name: "김매니저",
      email: "manager@companyb.com",
      role: "매니저",
      department: "영업팀",
      lastLogin: "2025-03-14 09:45",
      status: "활성",
    },
    {
      id: "USR-003",
      name: "박상담",
      email: "sales@companyb.com",
      role: "상담원",
      department: "영업팀",
      lastLogin: "2025-03-15 11:20",
      status: "활성",
    },
    {
      id: "USR-004",
      name: "이회계",
      email: "accounting@companyb.com",
      role: "회계",
      department: "재무팀",
      lastLogin: "2025-03-13 16:15",
      status: "활성",
    },
    {
      id: "USR-005",
      name: "최마케팅",
      email: "marketing@companyb.com",
      role: "마케팅",
      department: "마케팅팀",
      lastLogin: "2025-03-12 10:30",
      status: "휴면",
    },
    {
      id: "USR-006",
      name: "정스케줄",
      email: "schedule@companyb.com",
      role: "스케줄러",
      department: "운영팀",
      lastLogin: "2025-03-15 08:55",
      status: "활성",
    },
    {
      id: "USR-007",
      name: "강계약",
      email: "contract@companyb.com",
      role: "계약담당",
      department: "법무팀",
      lastLogin: "2025-03-10 13:40",
      status: "활성",
    },
  ];

  // 필터링된 사용자 목록
  const filteredUsers = users.filter((user) => {
    // 역할 필터
    if (roleFilter !== "all" && user.role !== roleFilter) {
      return false;
    }

    // 상태 필터
    if (statusFilter !== "all" && user.status !== statusFilter) {
      return false;
    }

    // 검색어 필터
    if (
      searchQuery &&
      !user.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !user.email.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !user.id.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }

    return true;
  });

  // 상태에 따른 배지 색상
  const getStatusColor = (status: string) => {
    switch (status) {
      case "활성":
        return "bg-green-100 text-green-800";
      case "휴면":
        return "bg-yellow-100 text-yellow-800";
      case "잠금":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // 체크박스 전체 선택/해제
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedUsers(filteredUsers.map((user) => user.id));
    } else {
      setSelectedUsers([]);
    }
  };

  // 개별 사용자 선택/해제
  const handleSelectUser = (
    e: React.ChangeEvent<HTMLInputElement>,
    userId: string
  ) => {
    if (e.target.checked) {
      setSelectedUsers([...selectedUsers, userId]);
    } else {
      setSelectedUsers(selectedUsers.filter((id) => id !== userId));
    }
  };

  // 선택된 사용자에 대한 일괄 작업
  const handleBulkAction = (action: string) => {
    if (selectedUsers.length === 0) {
      alert("선택된 사용자가 없습니다.");
      return;
    }

    if (action === "delete") {
      if (confirm(`${selectedUsers.length}명의 사용자를 삭제하시겠습니까?`)) {
        // 실제 구현에서는 API 호출로 삭제
        alert(`${selectedUsers.length}명의 사용자가 삭제되었습니다.`);
        setSelectedUsers([]);
      }
    } else if (action === "activate") {
      if (confirm(`${selectedUsers.length}명의 사용자를 활성화하시겠습니까?`)) {
        // 실제 구현에서는 API 호출로 상태 변경
        alert(`${selectedUsers.length}명의 사용자가 활성화되었습니다.`);
        setSelectedUsers([]);
      }
    } else if (action === "deactivate") {
      if (
        confirm(`${selectedUsers.length}명의 사용자를 비활성화하시겠습니까?`)
      ) {
        // 실제 구현에서는 API 호출로 상태 변경
        alert(`${selectedUsers.length}명의 사용자가 비활성화되었습니다.`);
        setSelectedUsers([]);
      }
    }
  };

  // 새 사용자 추가
  const handleAddUser = () => {
    // 실제 구현에서는 새 사용자 생성 페이지로 이동
    alert("새 사용자 생성 페이지로 이동합니다.");
  };

  return (
    <>
      {/* 페이지 헤더 */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">사용자 관리</h1>
        <p className="text-gray-600 mt-1">
          시스템 사용자 계정을 관리하고 권한을 부여합니다.
        </p>
      </div>

      {/* 설정 탭 */}
      <div className="bg-white rounded-lg shadow mb-6">
        <div className="flex flex-wrap border-b">
          <Link
            href="/admin/settings"
            className="px-4 py-2 border-b-2 border-transparent font-medium text-sm text-gray-500 hover:text-gray-700 hover:border-gray-300"
          >
            일반 설정
          </Link>
          <Link
            href="/admin/settings/users"
            className="px-4 py-2 border-b-2 border-orange-500 font-medium text-sm text-orange-600"
          >
            사용자 관리
          </Link>
          <Link
            href="/admin/settings/roles"
            className="px-4 py-2 border-b-2 border-transparent font-medium text-sm text-gray-500 hover:text-gray-700 hover:border-gray-300"
          >
            권한 설정
          </Link>
          <Link
            href="/admin/settings/notifications"
            className="px-4 py-2 border-b-2 border-transparent font-medium text-sm text-gray-500 hover:text-gray-700 hover:border-gray-300"
          >
            알림 설정
          </Link>
          <Link
            href="/admin/settings/backup"
            className="px-4 py-2 border-b-2 border-transparent font-medium text-sm text-gray-500 hover:text-gray-700 hover:border-gray-300"
          >
            데이터 백업
          </Link>
        </div>
      </div>

      {/* 필터 및 액션 */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="flex flex-wrap justify-between mb-4">
          <div className="flex flex-wrap gap-2 mb-4 md:mb-0">
            <button
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                roleFilter === "all"
                  ? "bg-orange-500 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
              onClick={() => setRoleFilter("all")}
            >
              전체 역할
            </button>
            <button
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                roleFilter === "관리자"
                  ? "bg-orange-500 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
              onClick={() => setRoleFilter("관리자")}
            >
              관리자
            </button>
            <button
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                roleFilter === "매니저"
                  ? "bg-orange-500 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
              onClick={() => setRoleFilter("매니저")}
            >
              매니저
            </button>
            <button
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                roleFilter === "상담원"
                  ? "bg-orange-500 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
              onClick={() => setRoleFilter("상담원")}
            >
              상담원
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 focus:outline-none"
              onClick={handleAddUser}
            >
              새 사용자 추가
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* 상태 필터 */}
          <div>
            <label
              htmlFor="status-filter"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              상태
            </label>
            <select
              id="status-filter"
              className="w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">전체 상태</option>
              <option value="활성">활성</option>
              <option value="휴면">휴면</option>
              <option value="잠금">잠금</option>
            </select>
          </div>

          {/* 검색 */}
          <div>
            <label
              htmlFor="search"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              검색
            </label>
            <div className="relative">
              <input
                type="text"
                id="search"
                placeholder="이름, 이메일, ID 검색"
                className="w-full rounded-md border border-gray-300 py-2 pl-10 pr-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <div className="absolute left-3 top-2.5 text-gray-400">
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
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* 일괄 액션 버튼 */}
        {selectedUsers.length > 0 && (
          <div className="mt-4 p-2 bg-gray-50 rounded-md">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700">
                {selectedUsers.length}명의 사용자 선택됨
              </div>
              <div className="flex gap-2">
                <button
                  className="px-3 py-1 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none"
                  onClick={() => handleBulkAction("activate")}
                >
                  활성화
                </button>
                <button
                  className="px-3 py-1 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 focus:outline-none"
                  onClick={() => handleBulkAction("deactivate")}
                >
                  비활성화
                </button>
                <button
                  className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none"
                  onClick={() => handleBulkAction("delete")}
                >
                  삭제
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 사용자 목록 테이블 */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    className="h-4 w-4 text-orange-600 rounded border-gray-300 focus:ring-orange-500"
                    checked={
                      selectedUsers.length === filteredUsers.length &&
                      filteredUsers.length > 0
                    }
                    onChange={handleSelectAll}
                  />
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  ID/이름
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  이메일
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  역할/부서
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  마지막 로그인
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  상태
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  액션
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr
                  key={user.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      className="h-4 w-4 text-orange-600 rounded border-gray-300 focus:ring-orange-500"
                      checked={selectedUsers.includes(user.id)}
                      onChange={(e) => handleSelectUser(e, user.id)}
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {user.name}
                    </div>
                    <div className="text-xs text-gray-500">{user.id}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{user.role}</div>
                    <div className="text-xs text-gray-500">
                      {user.department}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.lastLogin}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                        user.status
                      )}`}
                    >
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex space-x-2">
                      <button className="text-blue-600 hover:text-blue-800">
                        상세
                      </button>
                      <button className="text-green-600 hover:text-green-800">
                        수정
                      </button>
                      <button className="text-red-600 hover:text-red-800">
                        삭제
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 페이지네이션 */}
        <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                전체 <span className="font-medium">{users.length}</span> 명 중{" "}
                <span className="font-medium">{filteredUsers.length}</span> 명
                표시
              </p>
            </div>
            <div>
              <nav
                className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                aria-label="Pagination"
              >
                <a
                  href="#"
                  className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                >
                  <span className="sr-only">이전</span>
                  <svg
                    className="h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
                <a
                  href="#"
                  aria-current="page"
                  className="z-10 bg-orange-50 border-orange-500 text-orange-600 relative inline-flex items-center px-4 py-2 border text-sm font-medium"
                >
                  1
                </a>
                <a
                  href="#"
                  className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                >
                  <span className="sr-only">다음</span>
                  <svg
                    className="h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
