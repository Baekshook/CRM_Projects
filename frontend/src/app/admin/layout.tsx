"use client";
import { ReactNode, useState } from "react";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import { menuItems } from "@/components/layout/MenuData";

export default function AdminLayout({ children }: { children: ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* 헤더 */}
      <Header
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />

      <div className="flex overflow-hidden">
        {/* 사이드바 */}
        <Sidebar
          menuItems={menuItems}
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
        />

        {/* 메인 콘텐츠 */}
        <main className="flex-1 relative z-20 overflow-y-auto focus:outline-none p-6 bg-gray-100">
          {/* 사이드바 오픈 오버레이 */}
          {isSidebarOpen && (
            <div
              className="fixed inset-0 z-10 bg-black bg-opacity-50 md:hidden"
              onClick={() => setIsSidebarOpen(false)}
            ></div>
          )}

          {children}
        </main>
      </div>
    </div>
  );
}
