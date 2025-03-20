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
    let allEntities: Entity[] = [];

    // 타입에 따라 엔티티 필터링
    if (criteria.type === "all" || !criteria.type) {
      allEntities = [...dummyCustomers, ...dummySingers];
    } else if (criteria.type === "customer") {
      allEntities = [...dummyCustomers];
    } else if (criteria.type === "singer") {
      allEntities = [...dummySingers];
    }

    // 상태에 따라 필터링
    if (criteria.status && criteria.status !== "all") {
      allEntities = allEntities.filter((e) => e.status === criteria.status);
    }

    // 등급에 따라 필터링
    if (criteria.grade && criteria.grade !== "all") {
      allEntities = allEntities.filter((e) => e.grade === criteria.grade);
    }

    // 계약 수에 따라 필터링
    if (criteria.minContractCount) {
      allEntities = allEntities.filter(
        (e) => (e.contractCount || 0) >= (criteria.minContractCount || 0)
      );
    }

    if (criteria.maxContractCount) {
      allEntities = allEntities.filter(
        (e) => (e.contractCount || 0) <= (criteria.maxContractCount || 0)
      );
    }

    // 날짜에 따라 필터링 (간단한 구현)
    if (criteria.registrationDateStart) {
      const startDate = new Date(criteria.registrationDateStart);
      allEntities = allEntities.filter(
        (e) => new Date(e.registrationDate) >= startDate
      );
    }

    if (criteria.registrationDateEnd) {
      const endDate = new Date(criteria.registrationDateEnd);
      allEntities = allEntities.filter(
        (e) => new Date(e.registrationDate) <= endDate
      );
    }

    return allEntities.length;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <PageHeader
        title="고객 세그먼트 관리"
        description="고객을 특정 기준으로 분류하여 효과적으로 관리합니다."
        actions={
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 flex items-center"
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
            세그먼트 추가
          </button>
        }
      />

      {/* 추가 폼 */}
      {showAddForm && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">새 세그먼트 추가</h2>
          <form onSubmit={handleAddSegment}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  세그먼트 이름
                </label>
                <input
                  type="text"
                  name="name"
                  value={newSegment.name}
                  onChange={handleInputChange}
                  className="w-full border-gray-300 rounded-md shadow-sm focus:border-orange-500 focus:ring-orange-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  색상
                </label>
                <div className="flex space-x-2">
                  {colorOptions.map((color) => (
                    <div
                      key={color.value}
                      onClick={() =>
                        setNewSegment({ ...newSegment, color: color.value })
                      }
                      className={`w-8 h-8 rounded-full cursor-pointer border-2 ${
                        newSegment.color === color.value
                          ? "border-gray-900"
                          : "border-transparent"
                      }`}
                      style={{ backgroundColor: color.value }}
                      title={color.name}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                설명
              </label>
              <textarea
                name="description"
                value={newSegment.description}
                onChange={handleInputChange}
                rows={2}
                className="w-full border-gray-300 rounded-md shadow-sm focus:border-orange-500 focus:ring-orange-500"
              />
            </div>

            <h3 className="text-md font-medium text-gray-700 mb-2">
              세그먼트 조건
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  유형
                </label>
                <select
                  name="criteria.type"
                  value={newSegment.criteria?.type}
                  onChange={handleInputChange}
                  className="w-full border-gray-300 rounded-md shadow-sm focus:border-orange-500 focus:ring-orange-500"
                >
                  <option value="all">모든 유형</option>
                  <option value="customer">고객</option>
                  <option value="singer">가수</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  상태
                </label>
                <select
                  name="criteria.status"
                  value={newSegment.criteria?.status}
                  onChange={handleInputChange}
                  className="w-full border-gray-300 rounded-md shadow-sm focus:border-orange-500 focus:ring-orange-500"
                >
                  <option value="all">모든 상태</option>
                  <option value="active">활성</option>
                  <option value="inactive">비활성</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  등급
                </label>
                <select
                  name="criteria.grade"
                  value={newSegment.criteria?.grade}
                  onChange={handleInputChange}
                  className="w-full border-gray-300 rounded-md shadow-sm focus:border-orange-500 focus:ring-orange-500"
                >
                  <option value="all">모든 등급</option>
                  <option value="일반">일반</option>
                  <option value="VIP">VIP</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  최소 계약 수
                </label>
                <input
                  type="number"
                  name="criteria.minContractCount"
                  value={newSegment.criteria?.minContractCount || ""}
                  onChange={handleInputChange}
                  min="0"
                  className="w-full border-gray-300 rounded-md shadow-sm focus:border-orange-500 focus:ring-orange-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  최대 계약 수
                </label>
                <input
                  type="number"
                  name="criteria.maxContractCount"
                  value={newSegment.criteria?.maxContractCount || ""}
                  onChange={handleInputChange}
                  min="0"
                  className="w-full border-gray-300 rounded-md shadow-sm focus:border-orange-500 focus:ring-orange-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  등록일 시작
                </label>
                <input
                  type="date"
                  name="criteria.registrationDateStart"
                  value={
                    newSegment.criteria?.registrationDateStart
                      ? new Date(newSegment.criteria.registrationDateStart)
                          .toISOString()
                          .split("T")[0]
                      : ""
                  }
                  onChange={handleInputChange}
                  className="w-full border-gray-300 rounded-md shadow-sm focus:border-orange-500 focus:ring-orange-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  등록일 종료
                </label>
                <input
                  type="date"
                  name="criteria.registrationDateEnd"
                  value={
                    newSegment.criteria?.registrationDateEnd
                      ? new Date(newSegment.criteria.registrationDateEnd)
                          .toISOString()
                          .split("T")[0]
                      : ""
                  }
                  onChange={handleInputChange}
                  className="w-full border-gray-300 rounded-md shadow-sm focus:border-orange-500 focus:ring-orange-500"
                />
              </div>
            </div>

            {/* 프리뷰 결과 */}
            <div className="bg-gray-50 p-4 rounded-md mb-4">
              <p className="text-sm text-gray-700">
                <span className="font-medium">예상 결과:</span> 현재 조건에
                해당하는 엔티티는 약{" "}
                <span className="font-bold text-orange-600">
                  {calculateEntityCount(newSegment.criteria || {})}
                </span>
                개 입니다.
              </p>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
              >
                취소
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600"
              >
                저장
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 세그먼트 목록 */}
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <p className="text-gray-500">데이터를 불러오는 중...</p>
        </div>
      ) : segments.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <p className="text-gray-500 mb-4">세그먼트가 없습니다.</p>
          <button
            onClick={() => setShowAddForm(true)}
            className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600"
          >
            첫 세그먼트 추가하기
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {segments.map((segment) => (
            <div
              key={segment.id}
              className="bg-white rounded-lg shadow-md overflow-hidden border-t-4"
              style={{ borderTopColor: segment.color }}
            >
              <div className="p-4">
                <div className="flex justify-between items-start">
                  <h3 className="text-lg font-semibold">{segment.name}</h3>
                  <div className="flex space-x-2">
                    <button
                      className="text-gray-400 hover:text-gray-600"
                      title="편집"
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
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      </svg>
                    </button>
                    <button
                      className="text-gray-400 hover:text-red-600"
                      title="삭제"
                      onClick={() => handleDeleteSegment(segment.id)}
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
                <p className="text-sm text-gray-600 mt-1">
                  {segment.description}
                </p>

                <div className="flex items-center mt-3">
                  <svg
                    className="w-5 h-5 text-gray-400 mr-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                  <span className="text-sm font-medium">
                    {segment.entityCount} 명
                  </span>
                </div>
              </div>

              <div className="px-4 py-3 bg-gray-50 border-t border-gray-100">
                <h4 className="text-xs font-medium text-gray-500 uppercase mb-2">
                  세그먼트 조건
                </h4>
                <div className="space-y-1">
                  {segment.criteria.type && segment.criteria.type !== "all" && (
                    <div className="flex items-center">
                      <span className="text-xs text-gray-500 w-24">유형:</span>
                      <span className="text-xs font-medium">
                        {segment.criteria.type === "customer" ? "고객" : "가수"}
                      </span>
                    </div>
                  )}
                  {segment.criteria.status &&
                    segment.criteria.status !== "all" && (
                      <div className="flex items-center">
                        <span className="text-xs text-gray-500 w-24">
                          상태:
                        </span>
                        <span className="text-xs font-medium">
                          {segment.criteria.status === "active"
                            ? "활성"
                            : "비활성"}
                        </span>
                      </div>
                    )}
                  {segment.criteria.grade &&
                    segment.criteria.grade !== "all" && (
                      <div className="flex items-center">
                        <span className="text-xs text-gray-500 w-24">
                          등급:
                        </span>
                        <span className="text-xs font-medium">
                          {segment.criteria.grade}
                        </span>
                      </div>
                    )}
                  {segment.criteria.minContractCount && (
                    <div className="flex items-center">
                      <span className="text-xs text-gray-500 w-24">
                        최소 계약:
                      </span>
                      <span className="text-xs font-medium">
                        {segment.criteria.minContractCount}개
                      </span>
                    </div>
                  )}
                  {segment.criteria.registrationDateStart && (
                    <div className="flex items-center">
                      <span className="text-xs text-gray-500 w-24">
                        등록일 이후:
                      </span>
                      <span className="text-xs font-medium">
                        {new Date(
                          segment.criteria.registrationDateStart
                        ).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-white px-4 py-3 border-t border-gray-100 flex justify-between items-center">
                <span className="text-xs text-gray-500">
                  {new Date(segment.updatedAt).toLocaleDateString()} 업데이트
                </span>
                <button className="text-sm text-orange-600 hover:text-orange-800 font-medium">
                  목록 보기
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
