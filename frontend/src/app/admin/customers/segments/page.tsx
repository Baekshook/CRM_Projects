"use client";
import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import PageHeader from "@/components/common/PageHeader";
import {
  customers as dummyCustomers,
  singers as dummySingers,
} from "@/utils/dummyData";
import { Entity } from "@/components/customers/types";

// 세그먼트 타입 정의
interface Segment {
  id: string;
  name: string;
  description: string;
  criteria: {
    type?: "customer" | "singer" | "all";
    status?: "active" | "inactive" | "all";
    grade?: string;
    minContractCount?: number;
    maxContractCount?: number;
    lastRequestDate?: string;
    registrationDateStart?: string;
    registrationDateEnd?: string;
    customFields?: Record<string, any>;
  };
  color: string;
  entityCount: number;
  createdAt: string;
  updatedAt: string;
}

// 더미 세그먼트 데이터
const dummySegments: Segment[] = [
  {
    id: "seg-001",
    name: "신규 고객",
    description: "최근 3개월 내 등록된 고객",
    criteria: {
      type: "customer",
      registrationDateStart: new Date(
        Date.now() - 90 * 24 * 60 * 60 * 1000
      ).toISOString(),
    },
    color: "#4F46E5",
    entityCount: 12,
    createdAt: "2023-01-15T12:00:00Z",
    updatedAt: "2023-01-15T12:00:00Z",
  },
  {
    id: "seg-002",
    name: "VIP 가수",
    description: "VIP 등급의 가수",
    criteria: {
      type: "singer",
      grade: "VIP",
    },
    color: "#EC4899",
    entityCount: 5,
    createdAt: "2023-01-10T09:30:00Z",
    updatedAt: "2023-02-05T14:45:00Z",
  },
  {
    id: "seg-003",
    name: "장기 미활동 고객",
    description: "최근 6개월간 요청이 없는 고객",
    criteria: {
      type: "customer",
      lastRequestDate: new Date(
        Date.now() - 180 * 24 * 60 * 60 * 1000
      ).toISOString(),
    },
    color: "#EF4444",
    entityCount: 8,
    createdAt: "2023-02-20T10:15:00Z",
    updatedAt: "2023-05-12T11:30:00Z",
  },
  {
    id: "seg-004",
    name: "다중 계약 고객",
    description: "5개 이상의 계약을 체결한 고객",
    criteria: {
      type: "customer",
      minContractCount: 5,
    },
    color: "#10B981",
    entityCount: 3,
    createdAt: "2023-03-05T16:20:00Z",
    updatedAt: "2023-03-05T16:20:00Z",
  },
  {
    id: "seg-005",
    name: "인기 가수",
    description: "계약 수가 10개 이상인 가수",
    criteria: {
      type: "singer",
      minContractCount: 10,
    },
    color: "#F59E0B",
    entityCount: 7,
    createdAt: "2023-04-18T11:45:00Z",
    updatedAt: "2023-05-20T09:30:00Z",
  },
];

// 색상 선택 옵션
const colorOptions = [
  { name: "인디고", value: "#4F46E5" },
  { name: "핑크", value: "#EC4899" },
  { name: "레드", value: "#EF4444" },
  { name: "그린", value: "#10B981" },
  { name: "옐로우", value: "#F59E0B" },
  { name: "퍼플", value: "#8B5CF6" },
  { name: "블루", value: "#3B82F6" },
  { name: "티일", value: "#14B8A6" },
];

export default function SegmentsPage() {
  const [segments, setSegments] = useState<Segment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingSegment, setEditingSegment] = useState<Segment | null>(null);
  const [newSegment, setNewSegment] = useState<Partial<Segment>>({
    name: "",
    description: "",
    criteria: {
      type: "all",
      status: "all",
    },
    color: colorOptions[0].value,
  });

  // 세그먼트 데이터 로드
  useEffect(() => {
    try {
      setIsLoading(true);
      // API 호출 대신 더미 데이터 사용
      setSegments(dummySegments);
    } catch (error) {
      console.error("데이터 로드 오류:", error);
      toast.error("세그먼트 데이터를 불러오는데 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 폼 입력 변경 핸들러
  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    if (name.startsWith("criteria.")) {
      const criteriaField = name.split(".")[1];
      setNewSegment({
        ...newSegment,
        criteria: {
          ...newSegment.criteria,
          [criteriaField]: value,
        },
      });
    } else {
      setNewSegment({
        ...newSegment,
        [name]: value,
      });
    }
  };

  // 세그먼트 추가 핸들러
  const handleAddSegment = (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const newId = `seg-${Math.floor(Math.random() * 1000)
        .toString()
        .padStart(3, "0")}`;
      const now = new Date().toISOString();

      const segment: Segment = {
        id: newId,
        name: newSegment.name || "",
        description: newSegment.description || "",
        criteria: newSegment.criteria || {},
        color: newSegment.color || colorOptions[0].value,
        entityCount: 0, // 실제로는 DB 쿼리 결과 개수
        createdAt: now,
        updatedAt: now,
      };

      setSegments([...segments, segment]);
      setShowAddForm(false);
      setNewSegment({
        name: "",
        description: "",
        criteria: {
          type: "all",
          status: "all",
        },
        color: colorOptions[0].value,
      });

      toast.success("세그먼트가 추가되었습니다.");
    } catch (error) {
      console.error("세그먼트 추가 오류:", error);
      toast.error("세그먼트 추가에 실패했습니다.");
    }
  };

  // 세그먼트 삭제 핸들러
  const handleDeleteSegment = (id: string) => {
    if (confirm("정말 이 세그먼트를 삭제하시겠습니까?")) {
      try {
        setSegments(segments.filter((segment) => segment.id !== id));
        toast.success("세그먼트가 삭제되었습니다.");
      } catch (error) {
        console.error("세그먼트 삭제 오류:", error);
        toast.error("세그먼트 삭제에 실패했습니다.");
      }
    }
  };

  // 세그먼트 프리뷰 - 해당 세그먼트 조건에 맞는 엔티티 개수 계산
  const calculateEntityCount = (criteria: Segment["criteria"]): number => {
    let filteredEntities: any[] = [];

    // 타입에 따라 엔티티 필터링
    if (criteria.type === "all" || !criteria.type) {
      filteredEntities = [...dummyCustomers, ...dummySingers];
    } else if (criteria.type === "customer") {
      filteredEntities = [...dummyCustomers];
    } else if (criteria.type === "singer") {
      filteredEntities = [...dummySingers];
    }

    // 상태에 따라 필터링
    if (criteria.status && criteria.status !== "all") {
      filteredEntities = filteredEntities.filter(
        (e) => e.status === criteria.status
      );
    }

    // 등급에 따라 필터링
    if (criteria.grade && criteria.grade !== "all") {
      filteredEntities = filteredEntities.filter(
        (e) => e.grade === criteria.grade
      );
    }

    // 계약 수에 따라 필터링
    if (criteria.minContractCount) {
      filteredEntities = filteredEntities.filter(
        (e) => (e.contractCount || 0) >= (criteria.minContractCount || 0)
      );
    }

    if (criteria.maxContractCount) {
      filteredEntities = filteredEntities.filter(
        (e) => (e.contractCount || 0) <= (criteria.maxContractCount || 0)
      );
    }

    // 최근 요청일에 따라 필터링
    if (criteria.lastRequestDate) {
      const compareDate = new Date(criteria.lastRequestDate);
      filteredEntities = filteredEntities.filter((e) => {
        if (!e.lastRequestDate) return false;
        const lastRequestDate = new Date(e.lastRequestDate);
        return lastRequestDate <= compareDate;
      });
    }

    // 등록일에 따라 필터링
    if (criteria.registrationDateStart) {
      const startDate = new Date(criteria.registrationDateStart);
      filteredEntities = filteredEntities.filter((e) => {
        if (!e.registrationDate) return false;
        const registrationDate = new Date(e.registrationDate);
        return registrationDate >= startDate;
      });
    }

    if (criteria.registrationDateEnd) {
      const endDate = new Date(criteria.registrationDateEnd);
      filteredEntities = filteredEntities.filter((e) => {
        if (!e.registrationDate) return false;
        const registrationDate = new Date(e.registrationDate);
        return registrationDate <= endDate;
      });
    }

    return filteredEntities.length;
  };

  // 세그먼트 프리뷰 데이터 업데이트
  const updateSegmentPreview = () => {
    const count = calculateEntityCount(newSegment.criteria || {});
    return count;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <PageHeader title="고객 세그먼트" />

      <div className="mb-6 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-black">세그먼트 관리</h2>
          <p className="text-black mt-1">
            고객과 가수를 세그먼트로 분류하여 관리합니다.
          </p>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 px-4 rounded-lg flex items-center transition duration-200"
        >
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
          {showAddForm ? "취소" : "세그먼트 추가"}
        </button>
      </div>

      {showAddForm && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h3 className="text-lg font-bold text-black mb-4">세그먼트 추가</h3>
          <form onSubmit={handleAddSegment}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-black mb-1"
                >
                  세그먼트 이름
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={newSegment.name}
                  onChange={handleInputChange}
                  className="mt-1 focus:ring-orange-500 focus:border-orange-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="color"
                  className="block text-sm font-medium text-black mb-1"
                >
                  색상
                </label>
                <select
                  id="color"
                  name="color"
                  value={newSegment.color}
                  onChange={handleInputChange}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-black border-gray-300 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm rounded-md"
                >
                  {colorOptions.map((color) => (
                    <option key={color.value} value={color.value}>
                      {color.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="md:col-span-2">
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-black mb-1"
                >
                  설명
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={2}
                  value={newSegment.description}
                  onChange={handleInputChange}
                  className="mt-1 focus:ring-orange-500 focus:border-orange-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                />
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <h4 className="text-md font-medium text-black mb-3">조건 설정</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label
                    htmlFor="criteria.type"
                    className="block text-sm font-medium text-black mb-1"
                  >
                    유형
                  </label>
                  <select
                    id="criteria.type"
                    name="criteria.type"
                    value={newSegment.criteria?.type || "all"}
                    onChange={handleInputChange}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-black border-gray-300 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm rounded-md"
                  >
                    <option value="all">모든 유형</option>
                    <option value="customer">고객</option>
                    <option value="singer">가수</option>
                  </select>
                </div>
                <div>
                  <label
                    htmlFor="criteria.status"
                    className="block text-sm font-medium text-black mb-1"
                  >
                    상태
                  </label>
                  <select
                    id="criteria.status"
                    name="criteria.status"
                    value={newSegment.criteria?.status || "all"}
                    onChange={handleInputChange}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-black border-gray-300 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm rounded-md"
                  >
                    <option value="all">모든 상태</option>
                    <option value="active">활성</option>
                    <option value="inactive">비활성</option>
                  </select>
                </div>
                <div>
                  <label
                    htmlFor="criteria.grade"
                    className="block text-sm font-medium text-black mb-1"
                  >
                    등급
                  </label>
                  <select
                    id="criteria.grade"
                    name="criteria.grade"
                    value={newSegment.criteria?.grade || "all"}
                    onChange={handleInputChange}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-black border-gray-300 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm rounded-md"
                  >
                    <option value="all">모든 등급</option>
                    <option value="일반">일반</option>
                    <option value="VIP">VIP</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                <div>
                  <label
                    htmlFor="criteria.minContractCount"
                    className="block text-sm font-medium text-black mb-1"
                  >
                    최소 계약 수
                  </label>
                  <input
                    type="number"
                    id="criteria.minContractCount"
                    name="criteria.minContractCount"
                    value={newSegment.criteria?.minContractCount || ""}
                    onChange={handleInputChange}
                    className="mt-1 focus:ring-orange-500 focus:border-orange-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    min="0"
                  />
                </div>
                <div>
                  <label
                    htmlFor="criteria.maxContractCount"
                    className="block text-sm font-medium text-black mb-1"
                  >
                    최대 계약 수
                  </label>
                  <input
                    type="number"
                    id="criteria.maxContractCount"
                    name="criteria.maxContractCount"
                    value={newSegment.criteria?.maxContractCount || ""}
                    onChange={handleInputChange}
                    className="mt-1 focus:ring-orange-500 focus:border-orange-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    min="0"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                <div>
                  <label
                    htmlFor="criteria.registrationDateStart"
                    className="block text-sm font-medium text-black mb-1"
                  >
                    등록일 시작
                  </label>
                  <input
                    type="date"
                    id="criteria.registrationDateStart"
                    name="criteria.registrationDateStart"
                    value={
                      newSegment.criteria?.registrationDateStart
                        ? new Date(newSegment.criteria.registrationDateStart)
                            .toISOString()
                            .split("T")[0]
                        : ""
                    }
                    onChange={handleInputChange}
                    className="mt-1 focus:ring-orange-500 focus:border-orange-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label
                    htmlFor="criteria.registrationDateEnd"
                    className="block text-sm font-medium text-black mb-1"
                  >
                    등록일 종료
                  </label>
                  <input
                    type="date"
                    id="criteria.registrationDateEnd"
                    name="criteria.registrationDateEnd"
                    value={
                      newSegment.criteria?.registrationDateEnd
                        ? new Date(newSegment.criteria.registrationDateEnd)
                            .toISOString()
                            .split("T")[0]
                        : ""
                    }
                    onChange={handleInputChange}
                    className="mt-1 focus:ring-orange-500 focus:border-orange-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
              </div>

              <div className="mt-3">
                <label
                  htmlFor="criteria.lastRequestDate"
                  className="block text-sm font-medium text-black mb-1"
                >
                  마지막 요청일 이전
                </label>
                <input
                  type="date"
                  id="criteria.lastRequestDate"
                  name="criteria.lastRequestDate"
                  value={
                    newSegment.criteria?.lastRequestDate
                      ? new Date(newSegment.criteria.lastRequestDate)
                          .toISOString()
                          .split("T")[0]
                      : ""
                  }
                  onChange={handleInputChange}
                  className="mt-1 focus:ring-orange-500 focus:border-orange-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                />
              </div>

              <div className="mt-4 p-3 bg-orange-50 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-black">
                    예상 일치 항목:
                  </span>
                  <span className="text-lg font-bold text-orange-600">
                    {updateSegmentPreview()} 명
                  </span>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="mr-2 bg-white border border-gray-300 rounded-md shadow-sm py-2 px-4 text-sm font-medium text-black hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
              >
                취소
              </button>
              <button
                type="submit"
                className="bg-orange-500 border border-transparent rounded-md shadow-sm py-2 px-4 text-sm font-medium text-white hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
              >
                세그먼트 저장
              </button>
            </div>
          </form>
        </div>
      )}

      {isLoading ? (
        <div className="text-center py-12">
          <svg
            className="animate-spin h-8 w-8 text-orange-500 mx-auto"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          <p className="mt-2 text-black">로딩 중...</p>
        </div>
      ) : segments.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <p className="text-black">세그먼트 데이터가 없습니다.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {segments.map((segment) => (
            <div
              key={segment.id}
              className="bg-white rounded-lg shadow-md overflow-hidden transition-all hover:shadow-lg"
            >
              <div
                className="h-2"
                style={{ backgroundColor: segment.color }}
              ></div>
              <div className="p-5">
                <div className="flex justify-between items-start">
                  <h3 className="text-lg font-bold text-black">
                    {segment.name}
                  </h3>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleDeleteSegment(segment.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
                <p className="text-sm text-black mt-1">
                  {segment.description || "설명이 없습니다."}
                </p>

                <div className="mt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-black">
                      엔티티 수:
                    </span>
                    <span className="text-sm font-bold text-black">
                      {segment.entityCount}
                    </span>
                  </div>

                  {segment.criteria.type !== "all" && (
                    <div className="flex justify-between items-center mt-1">
                      <span className="text-sm font-medium text-black">
                        유형:
                      </span>
                      <span className="text-sm text-black">
                        {segment.criteria.type === "customer" ? "고객" : "가수"}
                      </span>
                    </div>
                  )}

                  {segment.criteria.status !== "all" && (
                    <div className="flex justify-between items-center mt-1">
                      <span className="text-sm font-medium text-black">
                        상태:
                      </span>
                      <span className="text-sm text-black">
                        {segment.criteria.status === "active"
                          ? "활성"
                          : "비활성"}
                      </span>
                    </div>
                  )}

                  {segment.criteria.grade &&
                    segment.criteria.grade !== "all" && (
                      <div className="flex justify-between items-center mt-1">
                        <span className="text-sm font-medium text-black">
                          등급:
                        </span>
                        <span className="text-sm text-black">
                          {segment.criteria.grade}
                        </span>
                      </div>
                    )}

                  {segment.criteria.minContractCount && (
                    <div className="flex justify-between items-center mt-1">
                      <span className="text-sm font-medium text-black">
                        최소 계약 수:
                      </span>
                      <span className="text-sm text-black">
                        {segment.criteria.minContractCount}
                      </span>
                    </div>
                  )}

                  {segment.criteria.maxContractCount && (
                    <div className="flex justify-between items-center mt-1">
                      <span className="text-sm font-medium text-black">
                        최대 계약 수:
                      </span>
                      <span className="text-sm text-black">
                        {segment.criteria.maxContractCount}
                      </span>
                    </div>
                  )}

                  {segment.criteria.lastRequestDate && (
                    <div className="flex justify-between items-center mt-1">
                      <span className="text-sm font-medium text-black">
                        마지막 요청일:
                      </span>
                      <span className="text-sm text-black">
                        {new Date(
                          segment.criteria.lastRequestDate
                        ).toLocaleDateString()}{" "}
                        이전
                      </span>
                    </div>
                  )}

                  {segment.criteria.registrationDateStart && (
                    <div className="flex justify-between items-center mt-1">
                      <span className="text-sm font-medium text-black">
                        등록일 시작:
                      </span>
                      <span className="text-sm text-black">
                        {new Date(
                          segment.criteria.registrationDateStart
                        ).toLocaleDateString()}
                      </span>
                    </div>
                  )}

                  {segment.criteria.registrationDateEnd && (
                    <div className="flex justify-between items-center mt-1">
                      <span className="text-sm font-medium text-black">
                        등록일 종료:
                      </span>
                      <span className="text-sm text-black">
                        {new Date(
                          segment.criteria.registrationDateEnd
                        ).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                </div>

                <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
                  <span className="text-xs text-black">
                    생성일: {new Date(segment.createdAt).toLocaleDateString()}
                  </span>
                  <button className="text-orange-600 hover:text-orange-900 text-sm font-medium">
                    엔티티 보기
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
