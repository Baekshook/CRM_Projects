"use client";
import { ReactNode, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

// 사이드바 메뉴 아이템 타입 정의
interface MenuItem {
  name: string;
  path: string;
  icon: JSX.Element;
  subMenus?: { name: string; path: string }[];
}

export default function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [expandedMenu, setExpandedMenu] = useState<string | null>(null);

  // 사이드바 메뉴 정의
  const menuItems: MenuItem[] = [
    {
      name: "대시보드",
      path: "/admin",
      icon: (
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
            d="M4 6h16M4 12h8m-8 6h16"
          />
        </svg>
      ),
    },
    {
      name: "요청서 관리",
      path: "/admin/requests",
      icon: (
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
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
      ),
      subMenus: [
        { name: "전체 요청서", path: "/admin/requests" },
        { name: "진행 중", path: "/admin/requests/in-progress" },
        { name: "완료", path: "/admin/requests/completed" },
        { name: "취소", path: "/admin/requests/canceled" },
      ],
    },
    {
      name: "매칭/협상 관리",
      path: "/admin/negotiations",
      icon: (
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
            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
      ),
      subMenus: [
        { name: "매칭 관리", path: "/admin/negotiations" },
        { name: "협상 진행", path: "/admin/negotiations/negotiations" },
        { name: "최종 견적서", path: "/admin/negotiations/final-quotes" },
      ],
    },
    {
      name: "스케줄/계약 관리",
      path: "/admin/schedules",
      icon: (
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
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      ),
      subMenus: [
        { name: "스케줄 달력", path: "/admin/schedules" },
        { name: "계약 관리", path: "/admin/schedules/contracts" },
        { name: "리소스 관리", path: "/admin/schedules/resources" },
      ],
    },
    {
      name: "섭외 공고 관리",
      path: "/admin/recruitments",
      icon: (
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
            d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"
          />
        </svg>
      ),
    },
    {
      name: "후기/리뷰 관리",
      path: "/admin/reviews",
      icon: (
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
            d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
          />
        </svg>
      ),
    },
    {
      name: "알림/로그 관리",
      path: "/admin/notifications",
      icon: (
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
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
          />
        </svg>
      ),
    },
  ];

  // 메뉴 확장/축소 토글 함수
  const toggleMenu = (menuName: string) => {
    if (expandedMenu === menuName) {
      setExpandedMenu(null);
    } else {
      setExpandedMenu(menuName);
    }
  };

  // 현재 경로가 해당 메뉴 경로와 일치하는지 확인
  const isActive = (path: string) => {
    return pathname === path || pathname.startsWith(`${path}/`);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* 사이드바 */}
      <div className="w-64 bg-white shadow-md">
        {/* 로고 */}
        <div className="flex items-center justify-center h-16 border-b">
          <Link href="/admin" className="text-xl font-semibold text-gray-800">
            CRM 관리자
          </Link>
        </div>

        {/* 메뉴 */}
        <div className="py-4">
          <ul>
            {menuItems.map((item) => (
              <li key={item.name} className="mb-1">
                <div
                  className={`flex items-center justify-between px-4 py-2 cursor-pointer ${
                    isActive(item.path)
                      ? "bg-orange-100 text-orange-600"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                  onClick={() => (item.subMenus ? toggleMenu(item.name) : null)}
                >
                  <Link
                    href={item.path}
                    className="flex items-center w-full"
                    onClick={(e) => item.subMenus && e.preventDefault()}
                  >
                    <span className="mr-2">{item.icon}</span>
                    <span>{item.name}</span>
                  </Link>
                  {item.subMenus && (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className={`h-4 w-4 transition-transform ${
                        expandedMenu === item.name ? "rotate-180" : ""
                      }`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  )}
                </div>

                {/* 서브메뉴 */}
                {item.subMenus && expandedMenu === item.name && (
                  <ul className="pl-10 mt-1">
                    {item.subMenus.map((subItem) => (
                      <li key={subItem.name}>
                        <Link
                          href={subItem.path}
                          className={`block py-2 ${
                            pathname === subItem.path
                              ? "text-orange-600"
                              : "text-gray-600 hover:text-gray-800"
                          }`}
                        >
                          {subItem.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </div>

        {/* 요약 정보 */}
        <div className="absolute bottom-0 w-64 border-t p-4">
          <div className="text-sm text-gray-600">
            <div className="mb-2">진행 중 요청: 12건</div>
            <div>협상 진행: 5건</div>
          </div>
        </div>
      </div>

      {/* 메인 컨텐츠 */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* 헤더 */}
        <header className="bg-white shadow-sm h-16 flex items-center justify-between px-6">
          {/* 검색 바 */}
          <div className="relative w-64">
            <input
              type="text"
              placeholder="검색..."
              className="w-full pl-10 pr-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-orange-500"
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

          {/* 우측 메뉴 */}
          <div className="flex items-center">
            {/* 알림 아이콘 */}
            <button className="p-2 rounded-full text-gray-600 hover:bg-gray-100 relative">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
              </svg>
              <span className="absolute top-1 right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                3
              </span>
            </button>

            {/* 사용자 프로필 */}
            <div className="ml-4 relative flex items-center">
              <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center overflow-hidden">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-gray-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
              <span className="ml-2 text-gray-700">관리자</span>
            </div>
          </div>
        </header>

        {/* 메인 컨텐츠 영역 */}
        <main className="flex-1 overflow-y-auto p-6 bg-gray-100">
          {children}
        </main>

        {/* 푸터 */}
        <footer className="bg-white border-t py-4 px-6">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-600">
              © 2025 CRM 시스템. All rights reserved.
            </div>
            <div className="text-sm text-gray-500">
              <Link href="#" className="mr-4 hover:text-gray-700">
                이용약관
              </Link>
              <Link href="#" className="mr-4 hover:text-gray-700">
                개인정보 처리방침
              </Link>
              <Link href="#" className="hover:text-gray-700">
                도움말
              </Link>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
