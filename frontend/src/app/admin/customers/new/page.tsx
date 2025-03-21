"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import AddressSearch from "@/components/common/AddressSearch";

export default function NewCustomerPage() {
  const router = useRouter();

  // 고객 정보 상태
  const [customerData, setCustomerData] = useState({
    name: "",
    email: "",
    company: "",
    phone: "",
    address: "",
    status: "active",
    grade: 3, // 1-5 등급으로 변경
    profileImage: "",
    customerType: "customer", // customer 또는 singer
    statusMessage: "",
    department: "",
    genre: "",
    agency: "",
    memo: "",
    assignedTo: "",
  });

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
    alert("새 고객이 등록되었습니다.");
    router.push("/admin/customers");
  };

  // 취소 처리
  const handleCancel = () => {
    if (confirm("입력 중인 정보가 사라집니다. 취소하시겠습니까?")) {
      router.back();
    }
  };

  // 고객 자료 저장소로 이동
  const handleResourcesPage = () => {
    // 실제 앱에서는 고객 ID를 포함하여 이동
    // 데모에서는 경로만 표시
    alert("고객 자료 저장소로 이동합니다.");
    router.push("/admin/customers/resources");
  };

  return (
    <>
      {/* 페이지 헤더 */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">신규 고객 등록</h1>
        <p className="text-gray-600 mt-1">새로운 고객의 정보를 입력하세요.</p>
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

              {/* 등급 */}
              <div className="mb-6">
                <label
                  htmlFor="grade"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  등급
                </label>
                <select
                  id="grade"
                  name="grade"
                  value={customerData.grade}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-900 font-medium"
                >
                  <option value={1}>1등급 (최우수)</option>
                  <option value={2}>2등급 (우수)</option>
                  <option value={3}>3등급 (일반)</option>
                  <option value={4}>4등급 (관심)</option>
                  <option value={5}>5등급 (신규)</option>
                </select>
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

              {/* 가수 관련 추가 정보 */}
              {customerData.customerType === "singer" && (
                <div className="mt-8">
                  <h2 className="text-xl font-bold text-gray-800 mb-6 pb-2 border-b border-gray-200">
                    가수 자료 관리
                  </h2>

                  <div className="mb-6">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      고화질 사진
                    </label>
                    <div className="flex items-center justify-between border border-gray-300 rounded-lg p-3">
                      <span className="text-gray-500">
                        고화질 프로필 사진 업로드
                      </span>
                      <input
                        type="file"
                        accept="image/jpeg,image/png"
                        className="hidden"
                        id="highResPhoto"
                      />
                      <label
                        htmlFor="highResPhoto"
                        className="cursor-pointer px-3 py-1.5 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
                      >
                        파일 선택
                      </label>
                    </div>
                  </div>

                  <div className="mb-6">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      자기선곡리스트
                    </label>
                    <div className="flex items-center justify-between border border-gray-300 rounded-lg p-3">
                      <span className="text-gray-500">
                        가수 선곡 목록 업로드
                      </span>
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx,.xls,.xlsx"
                        className="hidden"
                        id="songList"
                      />
                      <label
                        htmlFor="songList"
                        className="cursor-pointer px-3 py-1.5 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
                      >
                        파일 선택
                      </label>
                    </div>
                  </div>

                  <div className="mb-6">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      MR자료
                    </label>
                    <div className="flex items-center justify-between border border-gray-300 rounded-lg p-3">
                      <span className="text-gray-500">MR 파일 업로드</span>
                      <input
                        type="file"
                        accept="audio/*"
                        className="hidden"
                        id="mrFile"
                      />
                      <label
                        htmlFor="mrFile"
                        className="cursor-pointer px-3 py-1.5 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
                      >
                        파일 선택
                      </label>
                    </div>
                  </div>

                  <div className="mb-6">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      기타 자료
                    </label>
                    <div className="flex items-center justify-between border border-gray-300 rounded-lg p-3">
                      <span className="text-gray-500">추가 자료 업로드</span>
                      <input
                        type="file"
                        className="hidden"
                        id="otherFiles"
                        multiple
                      />
                      <label
                        htmlFor="otherFiles"
                        className="cursor-pointer px-3 py-1.5 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
                      >
                        파일 선택
                      </label>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 버튼 영역 */}
          <div className="flex justify-between mt-10">
            <div>
              <button
                type="button"
                onClick={handleResourcesPage}
                className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 mr-4"
              >
                {customerData.customerType === "singer" ? "가수" : "고객"} 자료
                관리
              </button>
            </div>
            <div className="flex gap-4">
              <button
                type="button"
                onClick={handleCancel}
                className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              >
                취소
              </button>
              <button
                type="submit"
                className="px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
              >
                등록하기
              </button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}
