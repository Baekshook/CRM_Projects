"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import customerApi from "@/services/customerApi";
import singerApi from "@/services/singerApi";
import { toast } from "react-hot-toast";
import { formatDate } from "@/utils/dateUtils";
import Image from "next/image";

// API URL
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

// 고객 요청 타입
interface CustomerRequest {
  id: string;
  title: string;
  date: string;
  status: string;
  amount: number;
}

// 고객 메모 타입
interface CustomerNote {
  id: string;
  date: string;
  content: string;
  createdBy: string;
}

export default function CustomerDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const customerId = params.id;
  const [isLoading, setIsLoading] = useState(true);
  const [customer, setCustomer] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  // 새 메모 상태
  const [newNote, setNewNote] = useState<string>("");

  // 고객 요청 내역 샘플 데이터
  const customerRequests: CustomerRequest[] = [
    {
      id: "REQ-001",
      title: "신년 행사 기획",
      date: "2025-02-15",
      status: "계약 완료",
      amount: 5000000,
    },
    {
      id: "REQ-005",
      title: "제품 론칭 이벤트",
      date: "2025-03-10",
      status: "진행 중",
      amount: 3800000,
    },
    {
      id: "REQ-012",
      title: "사내 워크샵",
      date: "2025-04-05",
      status: "협의 중",
      amount: 2500000,
    },
    {
      id: "REQ-018",
      title: "연말 시상식",
      date: "2025-04-20",
      status: "요청 접수",
      amount: 0,
    },
  ];

  // 고객 메모 샘플 데이터
  const [customerNotes, setCustomerNotes] = useState<CustomerNote[]>([
    {
      id: "NOTE-001",
      date: "2025-04-12",
      content: "특별 할인 적용 가능 고객",
      createdBy: "김담당",
    },
    {
      id: "NOTE-002",
      date: "2025-03-25",
      content: "연락 시 저녁 시간대 선호",
      createdBy: "이매니저",
    },
    {
      id: "NOTE-003",
      date: "2025-03-05",
      content: "작년 행사 진행 시 만족도 높았음",
      createdBy: "박대리",
    },
  ]);

  // 고객 데이터 불러오기
  useEffect(() => {
    const fetchCustomerData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        console.log("Customer ID:", customerId, "Type:", typeof customerId);

        // ID가 유효하지 않은 경우 처리
        if (!customerId) {
          setError(`유효하지 않은 ID 형식입니다: ${customerId}`);
          return;
        }

        // 고객 ID로 데이터 조회 시도
        try {
          const data = await customerApi.getById(customerId);
          console.log("Customer data fetched:", data);
          setCustomer({
            ...data,
            type: "customer",
          });
          return;
        } catch (err) {
          // 고객 데이터가 없으면 가수 데이터 조회 시도
          console.log("Failed to fetch customer, trying singer:", err);
        }

        // 가수 ID로 데이터 조회
        try {
          const data = await singerApi.getById(customerId);
          console.log("Singer data fetched:", data);
          setCustomer({
            ...data,
            type: "singer",
          });
        } catch (err) {
          console.log("Failed to fetch singer:", err);
          setError("해당 ID의 고객 또는 가수를 찾을 수 없습니다.");
        }
      } catch (error) {
        console.error("데이터 조회 중 오류 발생:", error);
        setError("데이터를 불러오는 중 오류가 발생했습니다.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCustomerData();
  }, [customerId]);

  // 상태에 따른 배지 색상
  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "inactive":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // 등급에 따른 배지 색상
  const getGradeColor = (grade: string | number) => {
    const numGrade = typeof grade === "string" ? parseInt(grade) : grade;
    switch (numGrade) {
      case 1:
        return "bg-gray-100 text-gray-800";
      case 2:
        return "bg-blue-100 text-blue-800";
      case 3:
        return "bg-green-100 text-green-800";
      case 4:
        return "bg-purple-100 text-purple-800";
      case 5:
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // 요청 상태에 따른 배지 색상
  const getRequestStatusColor = (status: string) => {
    switch (status) {
      case "계약 완료":
        return "bg-green-100 text-green-800";
      case "진행 중":
        return "bg-blue-100 text-blue-800";
      case "협의 중":
        return "bg-yellow-100 text-yellow-800";
      case "요청 접수":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // 메모 추가 처리
  const handleAddNote = () => {
    if (!newNote.trim()) {
      toast.error("메모 내용을 입력해주세요.");
      return;
    }

    const newNoteObj: CustomerNote = {
      id: `NOTE-${Math.floor(Math.random() * 1000)}`,
      date: new Date().toISOString().split("T")[0],
      content: newNote,
      createdBy: "현재 사용자",
    };

    setCustomerNotes([newNoteObj, ...customerNotes]);
    setNewNote("");
    toast.success("메모가 추가되었습니다.");
  };

  // 삭제 처리
  const handleDelete = async () => {
    if (!confirm("정말로 이 고객을 삭제하시겠습니까?")) {
      return;
    }

    try {
      if (customer.type === "customer") {
        await customerApi.delete(customerId);
      } else {
        await singerApi.delete(customerId);
      }

      toast.success("삭제되었습니다.");
      router.push("/admin/customers");
    } catch (error) {
      console.error("삭제 중 오류 발생:", error);
      toast.error("삭제 중 오류가 발생했습니다.");
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error || !customer) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
        {error || "고객 정보를 찾을 수 없습니다."}
      </div>
    );
  }

  // 기존 렌더링 JSX는 유지하되, customer 객체의 속성을 올바르게 사용하도록 수정
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">
          {customer.type === "customer" ? "고객 상세" : "가수 상세"}
        </h1>
        <div className="flex gap-4">
          <Link
            href={`/admin/${
              customer.type === "customer" ? "customers" : "singers"
            }/edit/${customerId}`}
            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            편집
          </Link>
          <button
            onClick={handleDelete}
            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            삭제
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="flex">
          <div className="p-4 flex-1">
            <div className="flex flex-col sm:flex-row">
              <div className="flex flex-col items-center mb-4 sm:mb-0 sm:mr-6">
                <div className="relative w-32 h-32 mb-3">
                  {customer.profileImage ? (
                    <Image
                      src={
                        customer.profileImage.startsWith("http")
                          ? customer.profileImage
                          : `${API_URL}/files/${customer.profileImage}/data`
                      }
                      alt={customer.name}
                      fill
                      className="rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center">
                      <span className="text-gray-500 text-4xl">
                        {customer.name?.substring(0, 1) || "?"}
                      </span>
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-600 uppercase mb-2">
                    이름
                  </h3>
                  <p className="text-gray-900">{customer.name}</p>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-600 uppercase mb-2">
                    이메일
                  </h3>
                  <p className="text-gray-900">{customer.email}</p>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-600 uppercase mb-2">
                    {customer.type === "customer" ? "회사" : "소속사"}
                  </h3>
                  <p className="text-gray-900">
                    {customer.type === "customer"
                      ? customer.company
                      : customer.agency}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-600 uppercase mb-2">
                    전화번호
                  </h3>
                  <p className="text-gray-900">{customer.phone}</p>
                </div>
                {customer.type === "singer" && (
                  <>
                    <div>
                      <h3 className="text-sm font-semibold text-gray-600 uppercase mb-2">
                        장르
                      </h3>
                      <p className="text-gray-900">{customer.genre}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-gray-600 uppercase mb-2">
                        가격
                      </h3>
                      <p className="text-gray-900">
                        {new Intl.NumberFormat("ko-KR", {
                          style: "currency",
                          currency: "KRW",
                        }).format(customer.price || 0)}
                      </p>
                    </div>
                  </>
                )}
                <div>
                  <h3 className="text-sm font-semibold text-gray-600 uppercase mb-2">
                    등록일
                  </h3>
                  <p className="text-gray-900">
                    {formatDate(customer.registrationDate)}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-600 uppercase mb-2">
                    상태
                  </h3>
                  <span
                    className={`px-2 py-1 text-sm rounded-full ${getStatusColor(
                      customer.status
                    )}`}
                  >
                    {customer.status === "active" ? "활성" : "비활성"}
                  </span>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-600 uppercase mb-2">
                    등급
                  </h3>
                  <span
                    className={`px-2 py-1 text-sm rounded-full ${getGradeColor(
                      customer.type === "customer"
                        ? customer.grade
                        : customer.rating
                    )}`}
                  >
                    {customer.type === "customer"
                      ? `${customer.grade}등급`
                      : `${customer.rating}점`}
                  </span>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-600 uppercase mb-2">
                    주소
                  </h3>
                  <p className="text-gray-900">{customer.address}</p>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-600 uppercase mb-2">
                    계약 건수
                  </h3>
                  <p className="text-gray-900">
                    {customer.contractCount || 0}건
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-600 uppercase mb-2">
                    마지막 요청일
                  </h3>
                  <p className="text-gray-900">
                    {formatDate(customer.lastRequestDate)}
                  </p>
                </div>
              </div>

              {/* 오른쪽 패널: 프로필 이미지, 상태 메시지, 메모 */}
              <div className="lg:col-span-1 space-y-6">
                {/* 프로필 이미지 */}
                <div className="bg-white rounded-lg shadow p-6">
                  <h2 className="text-xl font-semibold mb-4 pb-2 border-b border-gray-200">
                    프로필 이미지
                  </h2>
                  <div className="flex justify-center">
                    {customer.profileImage ? (
                      <div className="w-48 h-48 rounded-md overflow-hidden relative">
                        <Image
                          src={
                            customer.profileImage.startsWith("http")
                              ? customer.profileImage
                              : `${API_URL}/files/${customer.profileImage}/data`
                          }
                          alt={customer.name}
                          fill
                          className="object-cover"
                          onError={(e) => {
                            console.error(
                              `이미지 로드 실패: ${customer.profileImage}`
                            );
                            // 이미지 로드 실패 시 기본 이미지 표시
                            e.currentTarget.src = `/images/profile-placeholder.png`;
                          }}
                          sizes="(max-width: 768px) 100vw, 192px"
                          priority
                        />
                      </div>
                    ) : (
                      <div className="w-48 h-48 bg-gray-200 rounded-md flex items-center justify-center">
                        <div className="w-24 h-24 rounded-full bg-gray-300 flex items-center justify-center">
                          <span className="text-4xl font-bold text-gray-500">
                            {customer.name.charAt(0)}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* 상태 메시지 */}
                <div className="bg-white rounded-lg shadow p-6">
                  <h2 className="text-xl font-semibold mb-4 pb-2 border-b border-gray-200">
                    상태 메시지
                  </h2>
                  <p className="text-gray-700">
                    {customer.statusMessage || "등록된 상태 메시지가 없습니다."}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
