"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function CustomerEditPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const customerId = params.id;

  // 고객 정보 상태
  const [customerData, setCustomerData] = useState({
    name: "",
    email: "",
    company: "",
    phone: "",
    address: "",
    status: "active",
    grade: "일반",
  });

  // 폼 로딩 상태
  const [isLoading, setIsLoading] = useState(true);

  // 고객 데이터 로드 (실제로는 API 호출로 처리)
  useEffect(() => {
    // 실제 앱에서는 여기서 API를 호출해야 합니다
    // 여기서는 샘플 데이터를 사용하고 있습니다
    setTimeout(() => {
      const customerInfo = {
        name:
          customerId === "CUST-001"
            ? "김민수"
            : customerId === "CUST-002"
            ? "이지영"
            : customerId === "CUST-003"
            ? "박준호"
            : customerId === "CUST-004"
            ? "최유진"
            : customerId === "CUST-005"
            ? "정승현"
            : customerId === "CUST-006"
            ? "권나은"
            : "고객명",
        email:
          customerId === "CUST-001"
            ? "minsu.kim@example.com"
            : customerId === "CUST-002"
            ? "jiyoung.lee@example.com"
            : customerId === "CUST-003"
            ? "junho.park@example.com"
            : customerId === "CUST-004"
            ? "yujin.choi@example.com"
            : customerId === "CUST-005"
            ? "seunghyun.jung@example.com"
            : customerId === "CUST-006"
            ? "naeun.kwon@example.com"
            : "email@example.com",
        company:
          customerId === "CUST-001"
            ? "(주)이벤트 플래닝"
            : customerId === "CUST-002"
            ? "웨딩 홀 A"
            : customerId === "CUST-003"
            ? "대학 축제 위원회"
            : customerId === "CUST-004"
            ? "(주)테크놀로지"
            : customerId === "CUST-005"
            ? "OO시 문화재단"
            : customerId === "CUST-006"
            ? "(주)코스메틱 브랜드"
            : "회사/단체명",
        phone:
          customerId === "CUST-001"
            ? "010-1234-5678"
            : customerId === "CUST-002"
            ? "010-2345-6789"
            : customerId === "CUST-003"
            ? "010-3456-7890"
            : customerId === "CUST-004"
            ? "010-4567-8901"
            : customerId === "CUST-005"
            ? "010-5678-9012"
            : customerId === "CUST-006"
            ? "010-6789-0123"
            : "010-0000-0000",
        address: "서울특별시 강남구 테헤란로 123",
        status:
          customerId === "CUST-005" || customerId === "CUST-009"
            ? "inactive"
            : "active",
        grade:
          customerId === "CUST-001" ||
          customerId === "CUST-004" ||
          customerId === "CUST-007" ||
          customerId === "CUST-010"
            ? "VIP"
            : customerId === "CUST-006" || customerId === "CUST-011"
            ? "VVIP"
            : "일반",
      };

      setCustomerData(customerInfo);
      setIsLoading(false);
    }, 500);
  }, [customerId]);

  // 입력 필드 변경 처리
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setCustomerData({
      ...customerData,
      [name]: value,
    });
  };

  // 폼 제출 처리
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // 유효성 검사
    if (!customerData.name || !customerData.email || !customerData.phone) {
      alert("필수 입력 항목을 모두 입력해주세요.");
      return;
    }

    // 이메일 형식 검사
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(customerData.email)) {
      alert("유효한 이메일 주소를 입력해주세요.");
      return;
    }

    // 전화번호 형식 검사
    const phoneRegex = /^010-\d{4}-\d{4}$/;
    if (!phoneRegex.test(customerData.phone)) {
      alert("전화번호 형식은 010-0000-0000 형태로 입력해주세요.");
      return;
    }

    // 실제 앱에서는 여기서 API 호출을 통해 데이터를 저장해야 합니다.
    alert("고객 정보가 수정되었습니다.");
    router.push(`/admin/customers/${customerId}`);
  };

  // 취소 처리
  const handleCancel = () => {
    if (confirm("변경 사항이 저장되지 않을 수 있습니다. 취소하시겠습니까?")) {
      router.back();
    }
  };

  if (isLoading) {
    return (
      <>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
        </div>
      </>
    );
  }

  return (
    <div className="pb-10">
      {/* 페이지 헤더 */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">고객 정보 수정</h1>
        <p className="text-gray-600 mt-1">고객 ID: {customerId}</p>
      </div>

      {/* 폼 */}
      <div className="bg-white rounded-lg shadow p-6">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* 기본 정보 섹션 */}
            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                기본 정보
              </h2>

              {/* 고객명 */}
              <div className="mb-4">
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  고객명 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={customerData.name}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  required
                />
              </div>

              {/* 이메일 */}
              <div className="mb-4">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  이메일 <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={customerData.email}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  required
                />
              </div>

              {/* 연락처 */}
              <div className="mb-4">
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  연락처 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="phone"
                  name="phone"
                  value={customerData.phone}
                  onChange={handleChange}
                  placeholder="010-0000-0000"
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  형식: 010-0000-0000
                </p>
              </div>
            </div>

            {/* 추가 정보 섹션 */}
            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                추가 정보
              </h2>

              {/* 회사/단체명 */}
              <div className="mb-4">
                <label
                  htmlFor="company"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  회사/단체명
                </label>
                <input
                  type="text"
                  id="company"
                  name="company"
                  value={customerData.company}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              {/* 주소 */}
              <div className="mb-4">
                <label
                  htmlFor="address"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  주소
                </label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={customerData.address}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              {/* 상태 */}
              <div className="mb-4">
                <label
                  htmlFor="status"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  상태
                </label>
                <select
                  id="status"
                  name="status"
                  value={customerData.status}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="active">활성</option>
                  <option value="inactive">비활성</option>
                </select>
              </div>

              {/* 등급 */}
              <div className="mb-4">
                <label
                  htmlFor="grade"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  등급
                </label>
                <select
                  id="grade"
                  name="grade"
                  value={customerData.grade}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="일반">일반</option>
                  <option value="VIP">VIP</option>
                  <option value="VVIP">VVIP</option>
                </select>
              </div>
            </div>
          </div>

          {/* 폼 제출 버튼 */}
          <div className="flex justify-end space-x-2 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 focus:outline-none"
            >
              취소
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-orange-600 text-white rounded-md shadow hover:bg-orange-700 focus:outline-none"
            >
              저장
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
