"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AddressSearch from "@/components/common/AddressSearch";

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
    grade: "신규",
    profileImage: "",
    customerType: "customer", // customer 또는 singer
    statusMessage: "",
    department: "",
    genre: "",
    agency: "",
    memo: "",
    assignedTo: "",
  });

  // 폼 로딩 상태
  const [isLoading, setIsLoading] = useState(true);

  // 입력 필드 변경 처리
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setCustomerData({
      ...customerData,
      [name]: value,
    });
  };

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
            ? "일반"
            : "신규",
        profileImage: "",
        customerType: "customer",
        statusMessage: "",
        department: "",
        genre: "",
        agency: "",
        memo: "",
        assignedTo: "",
      };

      setCustomerData(customerInfo);
      setIsLoading(false);
    }, 500);
  }, [customerId]);

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

  // 주소 선택 처리
  const handleAddressSelect = (selectedAddress: {
    postcode: string;
    address: string;
    detailAddress: string;
  }) => {
    setCustomerData({
      ...customerData,
      address: `${selectedAddress.address} ${selectedAddress.detailAddress}`,
    });
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
      <div className="bg-white rounded-lg shadow p-8">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* 좌측 섹션: 프로필 및 상태 메시지 */}
            <div>
              <h2 className="text-xl font-bold text-gray-800 mb-6 pb-2 border-b border-gray-200">
                프로필 정보
              </h2>

              {/* 고객 유형 선택 */}
              <div className="mb-6">
                <label
                  htmlFor="customerType"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  고객 유형 <span className="text-red-500">*</span>
                </label>
                <div className="flex space-x-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="customerType"
                      value="customer"
                      checked={customerData.customerType === "customer"}
                      onChange={handleChange}
                      className="mr-2"
                    />
                    <span className="text-gray-700">일반 고객</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="customerType"
                      value="singer"
                      checked={customerData.customerType === "singer"}
                      onChange={handleChange}
                      className="mr-2"
                    />
                    <span className="text-gray-700">가수</span>
                  </label>
                </div>
              </div>

              {/* 프로필 이미지 */}
              <div className="mb-6">
                <label
                  htmlFor="profileImage"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  프로필 이미지
                </label>
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    {customerData.profileImage ? (
                      <img
                        src={customerData.profileImage}
                        alt="프로필 미리보기"
                        className="w-32 h-32 object-cover rounded-full border-2 border-gray-200"
                      />
                    ) : (
                      <div className="w-32 h-32 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center">
                        <span className="text-gray-400">이미지 없음</span>
                      </div>
                    )}
                    <input
                      type="file"
                      id="profileImage"
                      name="profileImage"
                      accept="image/jpeg,image/png"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          if (file.size > 5 * 1024 * 1024) {
                            alert("파일 크기는 5MB를 초과할 수 없습니다.");
                            return;
                          }
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            setCustomerData({
                              ...customerData,
                              profileImage: reader.result as string,
                            });
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                  </div>
                  <div className="text-sm text-gray-500">
                    <p>• JPG, PNG 파일만 가능</p>
                    <p>• 최대 5MB까지 업로드 가능</p>
                  </div>
                </div>
              </div>

              {/* 상태 메시지 */}
              <div className="mb-6">
                <label
                  htmlFor="statusMessage"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  상태 메시지
                </label>
                <textarea
                  id="statusMessage"
                  name="statusMessage"
                  value={customerData.statusMessage}
                  onChange={handleChange}
                  maxLength={100}
                  placeholder="한 줄 소개를 입력하세요 (100자 이내)"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-900 font-medium h-24 resize-none"
                />
                <div className="text-right text-sm text-gray-500 mt-1">
                  {customerData.statusMessage.length}/100
                </div>
              </div>
            </div>

            {/* 우측 섹션: 기본 정보 및 추가 정보 */}
            <div>
              <h2 className="text-xl font-bold text-gray-800 mb-6 pb-2 border-b border-gray-200">
                기본 정보
              </h2>

              {/* 고객명 */}
              <div className="mb-6">
                <label
                  htmlFor="name"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  {customerData.customerType === "singer" ? "가수명" : "고객명"}{" "}
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={customerData.name}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-900 font-medium"
                  required
                />
              </div>

              {/* 이메일 */}
              <div className="mb-6">
                <label
                  htmlFor="email"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  이메일 <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={customerData.email}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-900 font-medium"
                  required
                />
              </div>

              {/* 연락처 */}
              <div className="mb-6">
                <label
                  htmlFor="phone"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  연락처 <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={customerData.phone}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-900 font-medium"
                  required
                />
              </div>

              {/* 주소 */}
              <div className="mb-6">
                <AddressSearch
                  onAddressSelect={handleAddressSelect}
                  label={
                    customerData.customerType === "singer"
                      ? "활동 지역"
                      : "주소"
                  }
                />
              </div>

              {/* 추가 정보 */}
              <div className="mb-6">
                <label
                  htmlFor={
                    customerData.customerType === "singer" ? "genre" : "company"
                  }
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  {customerData.customerType === "singer"
                    ? "장르"
                    : "회사/소속"}
                </label>
                <input
                  type="text"
                  id={
                    customerData.customerType === "singer" ? "genre" : "company"
                  }
                  name={
                    customerData.customerType === "singer" ? "genre" : "company"
                  }
                  value={
                    customerData.customerType === "singer"
                      ? customerData.genre
                      : customerData.company
                  }
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-900 font-medium"
                />
              </div>

              {customerData.customerType === "singer" && (
                <div className="mb-6">
                  <label
                    htmlFor="agency"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    소속사
                  </label>
                  <input
                    type="text"
                    id="agency"
                    name="agency"
                    value={customerData.agency}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-900 font-medium"
                  />
                </div>
              )}

              {customerData.customerType === "customer" && (
                <div className="mb-6">
                  <label
                    htmlFor="department"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    부서
                  </label>
                  <input
                    type="text"
                    id="department"
                    name="department"
                    value={customerData.department}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-900 font-medium"
                  />
                </div>
              )}

              {/* 담당자 지정 */}
              <div className="mb-6">
                <label
                  htmlFor="assignedTo"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  담당자
                </label>
                <select
                  id="assignedTo"
                  name="assignedTo"
                  value={customerData.assignedTo}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-900 font-medium"
                >
                  <option value="">담당자 선택</option>
                  <option value="manager1">김상담</option>
                  <option value="manager2">이상담</option>
                  <option value="manager3">박상담</option>
                </select>
              </div>

              {/* 내부 메모 */}
              <div className="mb-6">
                <label
                  htmlFor="memo"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  내부 메모
                </label>
                <textarea
                  id="memo"
                  name="memo"
                  value={customerData.memo}
                  onChange={handleChange}
                  placeholder="내부 메모를 입력하세요"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-900 font-medium h-24 resize-none"
                />
              </div>
            </div>
          </div>

          {/* 폼 제출 버튼 */}
          <div className="flex justify-end space-x-3 pt-6 mt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={handleCancel}
              className="px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              취소
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-orange-600 text-white rounded-lg font-medium hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
            >
              수정
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
