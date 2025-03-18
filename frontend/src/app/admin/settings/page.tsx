"use client";
import { useState } from "react";
import Link from "next/link";

export default function SettingsPage() {
  const [companyName, setCompanyName] = useState("Company B");
  const [companyEmail, setCompanyEmail] = useState("admin@companyb.com");
  const [companyPhone, setCompanyPhone] = useState("02-1234-5678");
  const [language, setLanguage] = useState("ko");
  const [timezone, setTimezone] = useState("Asia/Seoul");
  const [dateFormat, setDateFormat] = useState("YYYY-MM-DD");
  const [timeFormat, setTimeFormat] = useState("HH:mm");
  const [currency, setCurrency] = useState("KRW");
  const [notifications, setNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [dataRetention, setDataRetention] = useState(12);
  const [theme, setTheme] = useState("light");

  const handleSave = () => {
    // 실제 구현에서는 API 호출로 설정 저장
    alert("설정이 저장되었습니다.");
  };

  return (
    <>
      {/* 페이지 헤더 */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">일반 설정</h1>
        <p className="text-gray-600 mt-1">
          CRM 시스템의 기본 설정을 관리합니다.
        </p>
      </div>

      {/* 설정 탭 */}
      <div className="bg-white rounded-lg shadow mb-6">
        <div className="flex flex-wrap border-b">
          <Link
            href="/admin/settings"
            className="px-4 py-2 border-b-2 border-orange-500 font-medium text-sm text-orange-600"
          >
            일반 설정
          </Link>
          <Link
            href="/admin/settings/users"
            className="px-4 py-2 border-b-2 border-transparent font-medium text-sm text-gray-500 hover:text-gray-700 hover:border-gray-300"
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

      {/* 설정 폼 */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* 회사 정보 섹션 */}
          <div className="col-span-2">
            <h2 className="text-lg font-medium text-gray-900 border-b pb-2 mb-4">
              회사 정보
            </h2>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <label
                  htmlFor="company-name"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  회사명
                </label>
                <input
                  type="text"
                  id="company-name"
                  className="w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                />
              </div>
              <div>
                <label
                  htmlFor="company-email"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  이메일
                </label>
                <input
                  type="email"
                  id="company-email"
                  className="w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  value={companyEmail}
                  onChange={(e) => setCompanyEmail(e.target.value)}
                />
              </div>
              <div>
                <label
                  htmlFor="company-phone"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  전화번호
                </label>
                <input
                  type="text"
                  id="company-phone"
                  className="w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  value={companyPhone}
                  onChange={(e) => setCompanyPhone(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* 지역화 설정 섹션 */}
          <div className="col-span-2">
            <h2 className="text-lg font-medium text-gray-900 border-b pb-2 mb-4">
              지역화 설정
            </h2>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <label
                  htmlFor="language"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  언어
                </label>
                <select
                  id="language"
                  className="w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                >
                  <option value="ko">한국어</option>
                  <option value="en">English</option>
                  <option value="ja">日本語</option>
                  <option value="zh">中文</option>
                </select>
              </div>
              <div>
                <label
                  htmlFor="timezone"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  시간대
                </label>
                <select
                  id="timezone"
                  className="w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  value={timezone}
                  onChange={(e) => setTimezone(e.target.value)}
                >
                  <option value="Asia/Seoul">아시아/서울 (GMT+9)</option>
                  <option value="Asia/Tokyo">아시아/도쿄 (GMT+9)</option>
                  <option value="America/New_York">미국/뉴욕 (GMT-5)</option>
                  <option value="Europe/London">유럽/런던 (GMT+0)</option>
                </select>
              </div>
              <div>
                <label
                  htmlFor="date-format"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  날짜 형식
                </label>
                <select
                  id="date-format"
                  className="w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  value={dateFormat}
                  onChange={(e) => setDateFormat(e.target.value)}
                >
                  <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                  <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                  <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                </select>
              </div>
              <div>
                <label
                  htmlFor="time-format"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  시간 형식
                </label>
                <select
                  id="time-format"
                  className="w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  value={timeFormat}
                  onChange={(e) => setTimeFormat(e.target.value)}
                >
                  <option value="HH:mm">24시간 (HH:mm)</option>
                  <option value="hh:mm A">12시간 (hh:mm AM/PM)</option>
                </select>
              </div>
              <div>
                <label
                  htmlFor="currency"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  통화
                </label>
                <select
                  id="currency"
                  className="w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                >
                  <option value="KRW">대한민국 원 (₩)</option>
                  <option value="USD">미국 달러 ($)</option>
                  <option value="JPY">일본 엔 (¥)</option>
                  <option value="EUR">유로 (€)</option>
                </select>
              </div>
            </div>
          </div>

          {/* 시스템 설정 섹션 */}
          <div className="col-span-2">
            <h2 className="text-lg font-medium text-gray-900 border-b pb-2 mb-4">
              시스템 설정
            </h2>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="flex items-center">
                <input
                  id="notifications"
                  type="checkbox"
                  className="h-4 w-4 text-orange-600 rounded border-gray-300 focus:ring-orange-500"
                  checked={notifications}
                  onChange={(e) => setNotifications(e.target.checked)}
                />
                <label
                  htmlFor="notifications"
                  className="ml-2 block text-sm text-gray-700"
                >
                  시스템 알림 활성화
                </label>
              </div>
              <div className="flex items-center">
                <input
                  id="email-notifications"
                  type="checkbox"
                  className="h-4 w-4 text-orange-600 rounded border-gray-300 focus:ring-orange-500"
                  checked={emailNotifications}
                  onChange={(e) => setEmailNotifications(e.target.checked)}
                />
                <label
                  htmlFor="email-notifications"
                  className="ml-2 block text-sm text-gray-700"
                >
                  이메일 알림 활성화
                </label>
              </div>
              <div>
                <label
                  htmlFor="data-retention"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  데이터 보존 기간 (개월)
                </label>
                <select
                  id="data-retention"
                  className="w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  value={dataRetention}
                  onChange={(e) => setDataRetention(Number(e.target.value))}
                >
                  <option value="6">6개월</option>
                  <option value="12">12개월</option>
                  <option value="24">24개월</option>
                  <option value="36">36개월</option>
                  <option value="0">무제한</option>
                </select>
              </div>
              <div>
                <label
                  htmlFor="theme"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  테마
                </label>
                <select
                  id="theme"
                  className="w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  value={theme}
                  onChange={(e) => setTheme(e.target.value)}
                >
                  <option value="light">라이트 모드</option>
                  <option value="dark">다크 모드</option>
                  <option value="system">시스템 설정 따르기</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* 저장 버튼 */}
        <div className="mt-6 flex justify-end">
          <button
            className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500"
            onClick={handleSave}
          >
            설정 저장
          </button>
        </div>
      </div>
    </>
  );
}
