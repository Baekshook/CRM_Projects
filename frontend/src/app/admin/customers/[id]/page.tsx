"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

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

  // 새 메모 상태
  const [newNote, setNewNote] = useState<string>("");

  // 샘플 고객 데이터
  const customer = {
    id: customerId,
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
        : "고객",
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
    registrationDate:
      customerId === "CUST-001"
        ? "2025-01-15"
        : customerId === "CUST-002"
        ? "2025-01-20"
        : customerId === "CUST-003"
        ? "2025-02-05"
        : customerId === "CUST-004"
        ? "2025-02-10"
        : customerId === "CUST-005"
        ? "2025-02-15"
        : customerId === "CUST-006"
        ? "2025-02-20"
        : "2025-01-01",
    status:
      customerId === "CUST-005" || customerId === "CUST-009"
        ? "inactive"
        : "active",
    grade:
      customerId === "CUST-001" ||
      customerId === "CUST-004" ||
      customerId === "CUST-006" ||
      customerId === "CUST-007" ||
      customerId === "CUST-010"
        ? "일반"
        : "신규",
    address: "서울특별시 강남구 테헤란로 123",
    contactHistory: [
      {
        date: "2025-04-10",
        type: "전화",
        detail: "일정 조율 및 요구사항 확인",
      },
      { date: "2025-04-05", type: "이메일", detail: "견적서 발송" },
      { date: "2025-03-15", type: "대면 미팅", detail: "초기 상담" },
    ],
  };

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
  ].filter(
    (req) =>
      customerId === "CUST-001" ||
      (customerId === "CUST-002" && ["REQ-005", "REQ-012"].includes(req.id)) ||
      (customerId === "CUST-003" && req.id === "REQ-012")
  );

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
  const getGradeColor = (grade: string) => {
    switch (grade) {
      case "일반":
        return "bg-green-100 text-green-800";
      case "신규":
        return "bg-blue-100 text-blue-800";
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

  // 새 메모 추가
  const handleAddNote = () => {
    if (!newNote.trim()) {
      alert("메모 내용을 입력해주세요.");
      return;
    }

    const newNoteItem: CustomerNote = {
      id: `NOTE-${customerNotes.length + 1001}`,
      date: new Date().toISOString().split("T")[0],
      content: newNote,
      createdBy: "현재 사용자",
    };

    setCustomerNotes([newNoteItem, ...customerNotes]);
    setNewNote("");
  };

  return (
    <>
      {/* 상단 네비게이션 및 액션 */}
      <div className="flex justify-between mb-6">
        <div>
          <button
            onClick={() => router.back()}
            className="inline-flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-1"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z"
                clipRule="evenodd"
              />
            </svg>
            목록으로 돌아가기
          </button>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => router.push(`/admin/customers/${customerId}/edit`)}
            className="px-4 py-2 bg-orange-600 text-white rounded-md shadow hover:bg-orange-700 focus:outline-none"
          >
            정보 수정
          </button>
          <button
            onClick={() => {
              if (confirm("정말로 이 고객을 삭제하시겠습니까?")) {
                alert(`고객 ${customerId}가 삭제되었습니다.`);
                router.push("/admin/customers");
              }
            }}
            className="px-4 py-2 bg-red-600 text-white rounded-md shadow hover:bg-red-700 focus:outline-none"
          >
            고객 삭제
          </button>
        </div>
      </div>

      {/* 고객 기본 정보 */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex justify-between items-start mb-4">
          <h1 className="text-2xl font-bold text-gray-800 flex items-center">
            {customer.name}
            <span
              className={`ml-2 px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                customer.status
              )}`}
            >
              {customer.status === "active" ? "활성" : "비활성"}
            </span>
            <span
              className={`ml-2 px-2 py-1 text-xs font-semibold rounded-full ${getGradeColor(
                customer.grade
              )}`}
            >
              {customer.grade}
            </span>
          </h1>
          <div className="text-sm text-gray-500">고객 ID: {customerId}</div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <div className="mb-4">
              <p className="text-sm font-medium text-gray-500">회사/단체명</p>
              <p className="text-base text-gray-800">{customer.company}</p>
            </div>
            <div className="mb-4">
              <p className="text-sm font-medium text-gray-500">이메일</p>
              <p className="text-base text-gray-800">{customer.email}</p>
            </div>
            <div className="mb-4">
              <p className="text-sm font-medium text-gray-500">연락처</p>
              <p className="text-base text-gray-800">{customer.phone}</p>
            </div>
          </div>
          <div>
            <div className="mb-4">
              <p className="text-sm font-medium text-gray-500">주소</p>
              <p className="text-base text-gray-800">{customer.address}</p>
            </div>
            <div className="mb-4">
              <p className="text-sm font-medium text-gray-500">가입일</p>
              <p className="text-base text-gray-800">
                {customer.registrationDate}
              </p>
            </div>
            <div className="mb-4">
              <p className="text-sm font-medium text-gray-500">최근 요청</p>
              <p className="text-base text-gray-800">
                {customerRequests.length > 0
                  ? `${customerRequests[0].date} (${customerRequests[0].title})`
                  : "없음"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 연락 이력 */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">연락 이력</h2>
          <button className="px-3 py-1 bg-orange-600 text-white text-sm rounded-md shadow hover:bg-orange-700 focus:outline-none">
            + 연락 이력 추가
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  날짜
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  유형
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  내용
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {customer.contactHistory.map((contact, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {contact.date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {contact.type}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {contact.detail}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 요청 내역 */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">요청 내역</h2>
          <button
            className="px-3 py-1 bg-orange-600 text-white text-sm rounded-md shadow hover:bg-orange-700 focus:outline-none"
            onClick={() =>
              router.push("/admin/requests/new?customerId=" + customerId)
            }
          >
            + 새 요청 등록
          </button>
        </div>
        {customerRequests.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    요청 ID
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    제목
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    요청일
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
                    금액
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
                {customerRequests.map((request) => (
                  <tr key={request.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {request.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {request.title}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {request.date}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getRequestStatusColor(
                          request.status
                        )}`}
                      >
                        {request.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {request.amount > 0
                        ? `${request.amount.toLocaleString()}원`
                        : "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <Link
                        href={`/admin/requests/${request.id}`}
                        className="text-blue-600 hover:text-blue-800 mr-3"
                      >
                        보기
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-10 text-center text-gray-500">
            요청 내역이 없습니다.
          </div>
        )}
      </div>

      {/* 고객 메모 */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">메모</h2>

        {/* 메모 입력 */}
        <div className="mb-4">
          <textarea
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            rows={3}
            placeholder="고객에 대한 메모를 입력하세요..."
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
          ></textarea>
          <div className="flex justify-end mt-2">
            <button
              className="px-4 py-2 bg-orange-600 text-white rounded-md shadow hover:bg-orange-700 focus:outline-none"
              onClick={handleAddNote}
            >
              메모 추가
            </button>
          </div>
        </div>

        {/* 메모 목록 */}
        <div className="space-y-4">
          {customerNotes.map((note) => (
            <div
              key={note.id}
              className="p-4 border border-gray-200 rounded-md"
            >
              <div className="flex justify-between mb-2">
                <div className="text-sm text-gray-500">
                  {note.date} | {note.createdBy}
                </div>
                <button
                  className="text-red-600 hover:text-red-800 text-sm"
                  onClick={() => {
                    if (confirm("이 메모를 삭제하시겠습니까?")) {
                      setCustomerNotes(
                        customerNotes.filter((n) => n.id !== note.id)
                      );
                    }
                  }}
                >
                  삭제
                </button>
              </div>
              <p className="text-gray-800">{note.content}</p>
            </div>
          ))}

          {customerNotes.length === 0 && (
            <div className="py-6 text-center text-gray-500">
              등록된 메모가 없습니다.
            </div>
          )}
        </div>
      </div>
    </>
  );
}
