import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AddressSearch from "@/components/common/AddressSearch";
import { toast } from "react-hot-toast";
import Image from "next/image";
import * as customerApi from "@/lib/api/customerApi";

// 환경 변수에서 API URL 가져오기
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

interface CustomerFormData {
  id?: string | number;
  name: string;
  email: string;
  company: string;
  phone: string;
  address: string;
  status: string;
  grade: string;
  profileImage: string;
  profileImageFile: File | null;
  customerType: "customer" | "singer";
  statusMessage: string;
  department: string;
  genre: string;
  agency: string;
  memo: string;
  assignedTo: string;
  price?: number;
  experience?: number;
  rating?: number;
  highResPhoto?: File | null;
  songList?: File | null;
  mrFile?: File | null;
  otherFiles: File[];
}

interface CustomerFormProps {
  initialData?: Partial<CustomerFormData>;
  onSubmit: (data: CustomerFormData, files: FormData) => Promise<void>;
  isEdit?: boolean;
}

export default function CustomerForm({
  initialData,
  onSubmit,
  isEdit = false,
}: CustomerFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});

  // 고객 정보 상태
  const [customerData, setCustomerData] = useState<CustomerFormData>({
    name: "",
    email: "",
    company: "",
    phone: "",
    address: "",
    status: "active",
    grade: "3",
    profileImage: "",
    profileImageFile: null,
    customerType: "customer",
    statusMessage: "",
    department: "",
    genre: "",
    agency: "",
    memo: "",
    assignedTo: "",
    price: 0,
    experience: 0,
    rating: 3,
    highResPhoto: null,
    songList: null,
    mrFile: null,
    otherFiles: [],
    ...initialData,
  });

  // 기존 프로필 이미지 URL
  const existingProfileImageUrl = customerData?.profileImage
    ? customerData.profileImage.startsWith("http")
      ? customerData.profileImage
      : `${API_URL}/files/${customerData.profileImage}/data`
    : null;

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

  // 프로필 이미지 업로드 핸들러
  const handleProfileImageUpload = async (file: File) => {
    if (!file) return;

    // 파일 크기 제한 10MB
    if (file.size > 10 * 1024 * 1024) {
      toast.error("파일 크기는 10MB를 초과할 수 없습니다.");
      return;
    }

    // 이미지 파일만 허용
    if (!file.type.startsWith("image/")) {
      toast.error("이미지 파일만 업로드할 수 있습니다.");
      return;
    }

    try {
      setIsSubmitting(true);
      toast.loading("이미지 업로드 중...");

      // 이미 저장된 고객인 경우
      if (customerData.id) {
        const uploadResponse = await customerApi.uploadCustomerProfileImage(
          file,
          customerData.id
        );

        console.log("이미지 업로드 응답:", uploadResponse);

        // 폼 데이터 업데이트
        setCustomerData({
          ...customerData,
          profileImage: uploadResponse.id,
          profileImageFile: file,
        });

        toast.dismiss();
        toast.success("이미지가 업로드되었습니다.");
      } else {
        // 새 고객인 경우 (임시 미리보기만 설정)
        const reader = new FileReader();
        reader.onloadend = () => {
          setCustomerData({
            ...customerData,
            profileImage: reader.result as string,
            profileImageFile: file,
          });
        };
        reader.readAsDataURL(file);
        toast.dismiss();
        toast.success(
          "이미지가 임시 저장되었습니다. 고객 저장 시 함께 업로드됩니다."
        );
      }
    } catch (error) {
      console.error("이미지 업로드 중 오류 발생:", error);
      toast.dismiss();
      toast.error("이미지 업로드 중 오류가 발생했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // 파일 업로드 처리 함수
  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    fieldName: string
  ) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    // 파일 크기 제한 (20MB)
    const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20MB

    if (fieldName === "otherFiles") {
      // 여러 파일 처리
      const fileArray = Array.from(files);

      // 파일 크기 검사
      for (const file of fileArray) {
        if (file.size > MAX_FILE_SIZE) {
          toast.error(`파일 크기가 20MB를 초과했습니다: ${file.name}`);
          return;
        }
      }

      setCustomerData({
        ...customerData,
        [fieldName]: fileArray,
      });
    } else {
      // 단일 파일 처리
      const file = files[0];

      // 파일 크기 검사
      if (file.size > MAX_FILE_SIZE) {
        toast.error(`파일 크기가 20MB를 초과했습니다: ${file.name}`);
        return;
      }

      if (fieldName === "profileImageFile") {
        // 프로필 이미지는 미리보기 위해 base64로 변환하고 파일 객체도 저장
        if (file.size > 5 * 1024 * 1024) {
          toast.error("프로필 이미지 크기는 5MB를 초과할 수 없습니다.");
          return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
          setCustomerData({
            ...customerData,
            profileImage: reader.result as string, // 미리보기용 base64
            profileImageFile: file, // 업로드용 파일 객체
          });
        };
        reader.readAsDataURL(file);
      } else {
        // 다른 파일들은 File 객체 그대로 저장
        setCustomerData({
          ...customerData,
          [fieldName]: file,
        });
      }
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

  // 폼 제출 처리
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 필수 필드 검증
    let isValid = true;
    const newValidationErrors: Record<string, string> = {};

    // 이름은 항상 필수
    if (!customerData.name.trim()) {
      newValidationErrors.name = "이름은 필수 항목입니다.";
      isValid = false;
    }

    // 이메일은 항상 필수
    if (!customerData.email.trim()) {
      newValidationErrors.email = "이메일은 필수 항목입니다.";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(customerData.email)) {
      newValidationErrors.email = "유효한 이메일 형식이 아닙니다.";
      isValid = false;
    }

    // 전화번호는 항상 필수
    if (!customerData.phone.trim()) {
      newValidationErrors.phone = "전화번호는 필수 항목입니다.";
      isValid = false;
    }

    // 주소는 항상 필수
    if (!customerData.address.trim()) {
      newValidationErrors.address = "주소는 필수 항목입니다.";
      isValid = false;
    }

    // 고객 유형에 따른 추가 검증
    if (customerData.customerType === "customer") {
      // 회사/소속은 고객인 경우 필수
      if (!customerData.company.trim()) {
        newValidationErrors.company = "회사/소속은 필수 항목입니다.";
        isValid = false;
      }
    } else {
      // 가수인 경우 필수 항목 검증
      if (!customerData.agency.trim()) {
        newValidationErrors.agency = "소속사는 필수 항목입니다.";
        isValid = false;
      }
      if (!customerData.genre.trim()) {
        newValidationErrors.genre = "장르는 필수 항목입니다.";
        isValid = false;
      }
    }

    // 프로필 이미지 크기 제한 검증
    if (
      customerData.profileImageFile &&
      customerData.profileImageFile.size > 10 * 1024 * 1024
    ) {
      newValidationErrors.profileImage =
        "프로필 이미지 크기는 10MB 이하여야 합니다.";
      isValid = false;
    }

    // 검증 오류 업데이트
    setValidationErrors(newValidationErrors);

    if (!isValid) {
      return;
    }

    setIsSubmitting(true);

    try {
      await onSubmit(customerData, {
        profileImageFile: customerData.profileImageFile,
        highResPhoto: customerData.highResPhoto,
        songList: customerData.songList,
        mrFile: customerData.mrFile,
        otherFiles: customerData.otherFiles,
      });
    } catch (error: any) {
      console.error("등록 중 오류 발생:", error);

      // 중복 키 오류 처리
      if (
        error.response &&
        error.response.data &&
        error.response.data.message &&
        error.response.data.message.includes("duplicate key")
      ) {
        toast.error("이미 등록된 이메일입니다. 다른 이메일을 사용해주세요.");
        setValidationErrors({
          ...validationErrors,
          email: "이미 등록된 이메일입니다.",
        });
      } else {
        toast.error("등록 중 오류가 발생했습니다.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // 취소 처리
  const handleCancel = () => {
    if (confirm("입력 중인 정보가 사라집니다. 취소하시겠습니까?")) {
      router.back();
    }
  };

  return (
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
            <select
              id="customerType"
              name="customerType"
              value={customerData.customerType}
              onChange={handleChange}
              className="w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              disabled={isEdit} // 수정 모드에서는 고객 유형 변경 불가
            >
              <option value="customer">일반 고객</option>
              <option value="singer">가수</option>
            </select>
          </div>

          {/* 프로필 이미지 */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              프로필 이미지
            </label>
            <div className="flex items-center space-x-4">
              <div className="w-32 h-32 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center border border-gray-300">
                {customerData.profileImage ? (
                  <Image
                    src={existingProfileImageUrl || ""}
                    alt="프로필 이미지"
                    width={128}
                    height={128}
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <span className="text-gray-400">이미지 없음</span>
                )}
              </div>
              <div>
                <input
                  type="file"
                  id="profileImageFile"
                  accept="image/*"
                  onChange={(e) =>
                    handleProfileImageUpload(e.target.files?.[0])
                  }
                  className="hidden"
                />
                <label
                  htmlFor="profileImageFile"
                  className="bg-blue-50 text-blue-600 py-2 px-4 rounded cursor-pointer hover:bg-blue-100 inline-block"
                >
                  이미지 업로드
                </label>
                <p className="text-xs text-gray-500 mt-1">
                  최대 5MB, JPG, PNG, GIF 형식 지원
                </p>
              </div>
            </div>
          </div>

          {/* 이름 */}
          <div className="mb-6">
            <label
              htmlFor="name"
              className="block text-sm font-semibold text-gray-700 mb-2"
            >
              이름 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={customerData.name}
              onChange={handleChange}
              placeholder="이름을 입력하세요"
              className="w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
              placeholder="email@example.com"
              className="w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          {/* 전화번호 */}
          <div className="mb-6">
            <label
              htmlFor="phone"
              className="block text-sm font-semibold text-gray-700 mb-2"
            >
              전화번호 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="phone"
              name="phone"
              value={customerData.phone}
              onChange={handleChange}
              placeholder="010-1234-5678"
              className="w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          {/* 상태 메시지 */}
          <div className="mb-6">
            <label
              htmlFor="statusMessage"
              className="block text-sm font-semibold text-gray-700 mb-2"
            >
              상태 메시지
            </label>
            <input
              type="text"
              id="statusMessage"
              name="statusMessage"
              value={customerData.statusMessage}
              onChange={handleChange}
              placeholder="상태 메시지를 입력하세요"
              className="w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* 메모 */}
          <div className="mb-6">
            <label
              htmlFor="memo"
              className="block text-sm font-semibold text-gray-700 mb-2"
            >
              메모
            </label>
            <textarea
              id="memo"
              name="memo"
              value={customerData.memo}
              onChange={handleChange}
              placeholder="추가 정보를 입력하세요"
              rows={3}
              className="w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            ></textarea>
          </div>
        </div>

        {/* 우측 섹션: 상세 정보 */}
        <div>
          <h2 className="text-xl font-bold text-gray-800 mb-6 pb-2 border-b border-gray-200">
            상세 정보
          </h2>

          {customerData.customerType === "customer" ? (
            // 일반 고객 정보
            <>
              {/* 회사/소속 */}
              <div className="mb-6">
                <label
                  htmlFor="company"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  회사/소속 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="company"
                  name="company"
                  value={customerData.company}
                  onChange={handleChange}
                  placeholder="회사 또는 소속을 입력하세요"
                  className="w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              {/* 부서 */}
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
                  placeholder="부서를 입력하세요"
                  className="w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
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
                  className="w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="5">VIP (5등급)</option>
                  <option value="4">골드 (4등급)</option>
                  <option value="3">실버 (3등급)</option>
                  <option value="2">브론즈 (2등급)</option>
                  <option value="1">기본 (1등급)</option>
                </select>
              </div>

              {/* 담당자 */}
              <div className="mb-6">
                <label
                  htmlFor="assignedTo"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  담당자
                </label>
                <input
                  type="text"
                  id="assignedTo"
                  name="assignedTo"
                  value={customerData.assignedTo}
                  onChange={handleChange}
                  placeholder="담당자를 입력하세요"
                  className="w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </>
          ) : (
            // 가수 정보
            <>
              {/* 소속사 */}
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
                  placeholder="소속사를 입력하세요"
                  className="w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* 장르 */}
              <div className="mb-6">
                <label
                  htmlFor="genre"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  주요 장르
                </label>
                <input
                  type="text"
                  id="genre"
                  name="genre"
                  value={customerData.genre}
                  onChange={handleChange}
                  placeholder="주요 장르를 입력하세요 (예: 발라드, 팝, R&B)"
                  className="w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* 가격 */}
              <div className="mb-6">
                <label
                  htmlFor="price"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  기본 공연료 (원)
                </label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={customerData.price}
                  onChange={handleChange}
                  placeholder="기본 공연료를 입력하세요"
                  className="w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* 경력 */}
              <div className="mb-6">
                <label
                  htmlFor="experience"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  경력 (년)
                </label>
                <input
                  type="number"
                  id="experience"
                  name="experience"
                  value={customerData.experience}
                  onChange={handleChange}
                  placeholder="경력 연수를 입력하세요"
                  className="w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* 평점 */}
              <div className="mb-6">
                <label
                  htmlFor="rating"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  평점
                </label>
                <select
                  id="rating"
                  name="rating"
                  value={customerData.rating}
                  onChange={handleChange}
                  className="w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="5">5점 (최상)</option>
                  <option value="4">4점 (상)</option>
                  <option value="3">3점 (중)</option>
                  <option value="2">2점 (하)</option>
                  <option value="1">1점 (최하)</option>
                </select>
              </div>

              {/* 고해상도 사진 업로드 */}
              <div className="mb-6">
                <label
                  htmlFor="highResPhoto"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  고해상도 사진
                </label>
                <div className="flex items-center justify-between border border-gray-300 rounded-lg p-3">
                  <span className="text-gray-500">
                    {customerData.highResPhoto
                      ? customerData.highResPhoto.name
                      : "고해상도 사진 업로드"}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    id="highResPhoto"
                    onChange={(e) => handleFileChange(e, "highResPhoto")}
                  />
                  <label
                    htmlFor="highResPhoto"
                    className="cursor-pointer px-3 py-1.5 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
                  >
                    파일 선택
                  </label>
                </div>
              </div>

              {/* 곡 목록 업로드 */}
              <div className="mb-6">
                <label
                  htmlFor="songList"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  자기선곡리스트
                </label>
                <div className="flex items-center justify-between border border-gray-300 rounded-lg p-3">
                  <span className="text-gray-500">
                    {customerData.songList
                      ? customerData.songList.name
                      : "가수 선곡 목록 업로드"}
                  </span>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx,.xls,.xlsx"
                    className="hidden"
                    id="songList"
                    onChange={(e) => handleFileChange(e, "songList")}
                  />
                  <label
                    htmlFor="songList"
                    className="cursor-pointer px-3 py-1.5 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
                  >
                    파일 선택
                  </label>
                </div>
              </div>

              {/* MR 자료 업로드 */}
              <div className="mb-6">
                <label
                  htmlFor="mrFile"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  MR자료
                </label>
                <div className="flex items-center justify-between border border-gray-300 rounded-lg p-3">
                  <span className="text-gray-500">
                    {customerData.mrFile
                      ? customerData.mrFile.name
                      : "MR 파일 업로드"}
                  </span>
                  <input
                    type="file"
                    accept="audio/*"
                    className="hidden"
                    id="mrFile"
                    onChange={(e) => handleFileChange(e, "mrFile")}
                  />
                  <label
                    htmlFor="mrFile"
                    className="cursor-pointer px-3 py-1.5 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
                  >
                    파일 선택
                  </label>
                </div>
              </div>

              {/* 기타 자료 업로드 */}
              <div className="mb-6">
                <label
                  htmlFor="otherFiles"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  기타 자료
                </label>
                <div className="flex items-center justify-between border border-gray-300 rounded-lg p-3">
                  <span className="text-gray-500">
                    {customerData.otherFiles.length > 0
                      ? `${customerData.otherFiles.length}개 파일 선택됨`
                      : "추가 자료 업로드"}
                  </span>
                  <input
                    type="file"
                    className="hidden"
                    id="otherFiles"
                    multiple
                    onChange={(e) => handleFileChange(e, "otherFiles")}
                  />
                  <label
                    htmlFor="otherFiles"
                    className="cursor-pointer px-3 py-1.5 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
                  >
                    파일 선택
                  </label>
                </div>
                {customerData.otherFiles.length > 0 && (
                  <div className="mt-2 text-sm text-gray-600">
                    <p>
                      {customerData.otherFiles
                        .map((file) => file.name)
                        .join(", ")}
                    </p>
                  </div>
                )}
              </div>
            </>
          )}

          {/* 공통 필드 */}
          {/* 주소 */}
          <div className="mb-6">
            <label
              htmlFor="address"
              className="block text-sm font-semibold text-gray-700 mb-2"
            >
              주소 <span className="text-red-500">*</span>
            </label>
            <div className="flex items-start space-x-2">
              <div className="flex-grow">
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={customerData.address}
                  onChange={handleChange}
                  placeholder="주소를 입력하세요"
                  className="w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                  readOnly
                />
              </div>
              <AddressSearch onAddressSelect={handleAddressSelect} />
            </div>
          </div>

          {/* 상태 */}
          <div className="mb-6">
            <label
              htmlFor="status"
              className="block text-sm font-semibold text-gray-700 mb-2"
            >
              상태
            </label>
            <select
              id="status"
              name="status"
              value={customerData.status}
              onChange={handleChange}
              className="w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="active">활성</option>
              <option value="inactive">비활성</option>
            </select>
          </div>
        </div>
      </div>

      {/* 버튼 영역 */}
      <div className="mt-8 flex justify-end space-x-4">
        <button
          type="button"
          onClick={handleCancel}
          className="px-6 py-2 border border-gray-300 rounded-md shadow-sm text-base font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          취소
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className={`px-6 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white ${
            isSubmitting
              ? "bg-blue-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          }`}
        >
          {isSubmitting ? "처리 중..." : isEdit ? "수정" : "등록"}
        </button>
      </div>
    </form>
  );
}
