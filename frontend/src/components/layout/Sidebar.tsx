"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MenuItem } from "./MenuItems";

interface SidebarProps {
  menuItems: MenuItem[];
  isSidebarOpen: boolean;
  setIsSidebarOpen: (isOpen: boolean) => void;
}

export default function Sidebar({
  menuItems,
  isSidebarOpen,
  setIsSidebarOpen,
}: SidebarProps) {
  const pathname = usePathname();
  const [expandedMenu, setExpandedMenu] = useState<string | null>(null);

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
    // 대시보드 메뉴의 경우 정확히 "/admin" 경로일 때만 활성화
    if (path === "/admin") {
      return pathname === "/admin";
    }

    // 서브메뉴 경로인 경우 정확히 일치할 때만 활성화
    if (path.includes("/admin/customers/")) {
      return pathname === path;
    }

    // 요청서 서브메뉴 경로인 경우 정확히 일치할 때만 활성화
    if (path.includes("/admin/requests/")) {
      return pathname === path;
    }

    // 메인 메뉴 경로인 경우
    // 'admin/customers'처럼 정확히 일치하거나, 서브메뉴가 없는 경우 해당 경로로 시작하는 모든 페이지 활성화
    if (path === "/admin/customers") {
      return pathname === path;
    }

    // 요청서 메인 메뉴 경로인 경우
    if (path === "/admin/requests") {
      return pathname === path;
    }

    // 그 외 메뉴의 경우 기존과 같이 처리
    return pathname === path || pathname.startsWith(`${path}/`);
  };

  return (
    <div
      className={`fixed inset-y-0 left-0 z-30 w-64 bg-white shadow transform ${
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      } transition-transform duration-300 ease-in-out mt-16 md:translate-x-0 md:static md:h-auto md:inset-auto`}
    >
      {/* 모바일에서 사이드바 닫기 버튼 */}
      <div className="md:hidden p-4 flex justify-end">
        <button
          onClick={() => setIsSidebarOpen(false)}
          className="text-gray-500 hover:text-gray-600 focus:outline-none"
        >
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
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      {/* 사이드바 내용 */}
      <div className="h-full py-4 overflow-y-auto">
        <nav className="px-2 space-y-1">
          {menuItems.map((item) => (
            <div key={item.name}>
              <div className="flex">
                <Link
                  href={item.path}
                  className={`${
                    isActive(item.path)
                      ? "bg-orange-100 text-orange-600"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  } group flex flex-1 items-center px-2 py-2 text-base font-medium rounded-md`}
                >
                  <div
                    className={`${
                      isActive(item.path)
                        ? "text-orange-600"
                        : "text-gray-400 group-hover:text-gray-500"
                    } mr-3 h-6 w-6`}
                  >
                    {item.icon}
                  </div>
                  <span>{item.name}</span>
                </Link>
                {item.subMenus && (
                  <button
                    onClick={() => toggleMenu(item.name)}
                    className={`${
                      isActive(item.path)
                        ? "bg-orange-100 text-orange-600"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    } flex items-center px-2 rounded-md`}
                  >
                    <svg
                      className={`h-5 w-5 transition-transform duration-200 ${
                        expandedMenu === item.name ? "transform rotate-180" : ""
                      }`}
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                )}
              </div>

              {/* 하위 메뉴 */}
              {item.subMenus && expandedMenu === item.name && (
                <div className="mt-1 pl-8 space-y-1">
                  {item.subMenus.map((subItem) => (
                    <Link
                      key={subItem.name}
                      href={subItem.path}
                      className={`${
                        isActive(subItem.path)
                          ? "bg-orange-50 text-orange-600"
                          : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                      } group flex items-center px-2 py-2 text-sm rounded-md`}
                    >
                      {subItem.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>
      </div>
    </div>
  );
}
