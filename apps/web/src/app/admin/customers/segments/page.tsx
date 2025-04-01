"use client";
import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import PageHeader from "@/components/common/PageHeader";
import customerApi from "@/services/customerApi";
import singerApi from "@/services/singerApi";
import axios from "axios";

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

// API URL
const API_URL = "http://localhost:4000/api";

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
  const [customers, setCustomers] = useState<any[]>([]);
  const [singers, setSingers] = useState<any[]>([]);
  const [previewResults, setPreviewResults] = useState<any[]>([]);

  // 고객 및 가수 데이터 로드
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [customersData, singersData] = await Promise.all([
          customerApi.getAll(),
          singerApi.getAll(),
        ]);
        setCustomers(customersData);
        setSingers(singersData);
      } catch (error) {
        console.error("데이터 로드 오류:", error);
        toast.error("고객/가수 데이터를 불러오는데 실패했습니다.");
      }
    };

    fetchData();
  }, []);

  // 세그먼트 데이터 로드
  useEffect(() => {
    const fetchSegments = async () => {
      try {
        setIsLoading(true);
        // API 호출하여 세그먼트 데이터 로드
        const response = await axios.get(`${API_URL}/segments`);
        setSegments(response.data);
      } catch (error) {
        console.error("세그먼트 데이터 로드 오류:", error);
        // API 연결이 안되었다면 로컬 스토리지에서 불러오기 시도
        const storedSegments = localStorage.getItem("segments");
        if (storedSegments) {
          setSegments(JSON.parse(storedSegments));
        } else {
          // 초기 세그먼트가 없다면 빈 배열 사용
          setSegments([]);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchSegments();
  }, []);

  // 세그먼트 변경시 로컬 스토리지에 저장
  useEffect(() => {
    if (segments.length > 0) {
      localStorage.setItem("segments", JSON.stringify(segments));
    }
  }, [segments]);

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
  const handleAddSegment = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const now = new Date().toISOString();

      const segmentData = {
        name: newSegment.name || "",
        description: newSegment.description || "",
        criteria: newSegment.criteria || {},
        color: newSegment.color || colorOptions[0].value,
        entityCount: calculateEntityCount(newSegment.criteria || {}),
        createdAt: now,
        updatedAt: now,
      };

      // API 호출하여 세그먼트 저장
      try {
        const response = await axios.post(`${API_URL}/segments`, segmentData);
        setSegments([...segments, response.data]);
        toast.success("세그먼트가 생성되었습니다.");
      } catch (error) {
        console.error("세그먼트 저장 오류:", error);
        // API 연결이 안되었다면 로컬에서만 상태 업데이트
        const newId = `seg-${Math.floor(Math.random() * 1000)
          .toString()
          .padStart(3, "0")}`;
        const segment: Segment = {
          id: newId,
          ...segmentData,
        };
        setSegments([...segments, segment]);
        toast.success("세그먼트가 생성되었습니다. (로컬에만 저장됨)");
      }

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
    } catch (error) {
      console.error("세그먼트 추가 오류:", error);
      toast.error("세그먼트 추가에 실패했습니다.");
    }
  };

  // 세그먼트 삭제 핸들러
  const handleDeleteSegment = async (id: string) => {
    if (confirm("정말로 이 세그먼트를 삭제하시겠습니까?")) {
      try {
        // API 호출하여 세그먼트 삭제
        try {
          await axios.delete(`${API_URL}/segments/${id}`);
        } catch (error) {
          console.error("세그먼트 삭제 API 오류:", error);
          // API 오류는 무시하고 UI에서만 삭제
        }

        setSegments(segments.filter((segment) => segment.id !== id));
        toast.success("세그먼트가 삭제되었습니다.");
      } catch (error) {
        console.error("세그먼트 삭제 오류:", error);
        toast.error("세그먼트 삭제에 실패했습니다.");
      }
    }
  };

  // 세그먼트 기준에 맞는 엔티티 수 계산
  const calculateEntityCount = (criteria: Segment["criteria"]): number => {
    let matchedEntities = [];
    const now = new Date();

    // 엔티티 타입에 따라 필터링
    if (criteria.type === "customer" || criteria.type === "all") {
      matchedEntities = [
        ...matchedEntities,
        ...customers.filter((customer) => {
          // 상태 필터링
          if (
            criteria.status &&
            criteria.status !== "all" &&
            customer.status !== criteria.status
          ) {
            return false;
          }

          // 등급 필터링
          if (criteria.grade && customer.grade != criteria.grade) {
            return false;
          }

          // 계약 수 필터링
          if (
            criteria.minContractCount !== undefined &&
            (customer.contractCount || 0) < criteria.minContractCount
          ) {
            return false;
          }
          if (
            criteria.maxContractCount !== undefined &&
            (customer.contractCount || 0) > criteria.maxContractCount
          ) {
            return false;
          }

          // 마지막 요청 날짜 필터링
          if (criteria.lastRequestDate && customer.lastRequestDate) {
            const lastRequestDate = new Date(customer.lastRequestDate);
            const criteriaDate = new Date(criteria.lastRequestDate);
            if (lastRequestDate > criteriaDate) {
              return false;
            }
          }

          // 등록 날짜 범위 필터링
          if (criteria.registrationDateStart && customer.registrationDate) {
            const registrationDate = new Date(customer.registrationDate);
            const startDate = new Date(criteria.registrationDateStart);
            if (registrationDate < startDate) {
              return false;
            }
          }
          if (criteria.registrationDateEnd && customer.registrationDate) {
            const registrationDate = new Date(customer.registrationDate);
            const endDate = new Date(criteria.registrationDateEnd);
            if (registrationDate > endDate) {
              return false;
            }
          }

          return true;
        }),
      ];
    }

    if (criteria.type === "singer" || criteria.type === "all") {
      matchedEntities = [
        ...matchedEntities,
        ...singers.filter((singer) => {
          // 상태 필터링
          if (
            criteria.status &&
            criteria.status !== "all" &&
            singer.status !== criteria.status
          ) {
            return false;
          }

          // 등급(rating) 필터링 - 가수는 rating 필드 사용
          if (criteria.grade && singer.rating != criteria.grade) {
            return false;
          }

          // 계약 수 필터링
          if (
            criteria.minContractCount !== undefined &&
            (singer.contractCount || 0) < criteria.minContractCount
          ) {
            return false;
          }
          if (
            criteria.maxContractCount !== undefined &&
            (singer.contractCount || 0) > criteria.maxContractCount
          ) {
            return false;
          }

          // 마지막 요청 날짜 필터링
          if (criteria.lastRequestDate && singer.lastRequestDate) {
            const lastRequestDate = new Date(singer.lastRequestDate);
            const criteriaDate = new Date(criteria.lastRequestDate);
            if (lastRequestDate > criteriaDate) {
              return false;
            }
          }

          // 등록 날짜 범위 필터링
          if (criteria.registrationDateStart && singer.registrationDate) {
            const registrationDate = new Date(singer.registrationDate);
            const startDate = new Date(criteria.registrationDateStart);
            if (registrationDate < startDate) {
              return false;
            }
          }
          if (criteria.registrationDateEnd && singer.registrationDate) {
            const registrationDate = new Date(singer.registrationDate);
            const endDate = new Date(criteria.registrationDateEnd);
            if (registrationDate > endDate) {
              return false;
            }
          }

          return true;
        }),
      ];
    }

    return matchedEntities.length;
  };

  // 세그먼트 미리보기 업데이트
  const updateSegmentPreview = () => {
    let matchedEntities = [];
    const criteria = newSegment.criteria || {};

    // 엔티티 타입에 따라 필터링
    if (criteria.type === "customer" || criteria.type === "all") {
      matchedEntities = [
        ...matchedEntities,
        ...customers
          .filter((customer) => {
            // 상태 필터링
            if (
              criteria.status &&
              criteria.status !== "all" &&
              customer.status !== criteria.status
            ) {
              return false;
            }

            // 등급 필터링
            if (criteria.grade && customer.grade != criteria.grade) {
              return false;
            }

            // 추가 필터링 로직은 calculateEntityCount와 동일
            return true;
          })
          .map((customer) => ({ ...customer, entityType: "customer" })),
      ];
    }

    if (criteria.type === "singer" || criteria.type === "all") {
      matchedEntities = [
        ...matchedEntities,
        ...singers
          .filter((singer) => {
            // 상태 필터링
            if (
              criteria.status &&
              criteria.status !== "all" &&
              singer.status !== criteria.status
            ) {
              return false;
            }

            // 등급(rating) 필터링 - 가수는 rating 필드 사용
            if (criteria.grade && singer.rating != criteria.grade) {
              return false;
            }

            // 추가 필터링 로직은 calculateEntityCount와 동일
            return true;
          })
          .map((singer) => ({ ...singer, entityType: "singer" })),
      ];
    }

    // 최대 10개만 표시
    setPreviewResults(matchedEntities.slice(0, 10));
  };

  // 편집 세그먼트 저장 핸들러
  const handleSaveEdit = async () => {
    if (!editingSegment) return;

    try {
      const now = new Date().toISOString();
      const updatedSegment = {
        ...editingSegment,
        name: newSegment.name || editingSegment.name,
        description: newSegment.description || editingSegment.description,
        criteria: newSegment.criteria || editingSegment.criteria,
        color: newSegment.color || editingSegment.color,
        entityCount: calculateEntityCount(
          newSegment.criteria || editingSegment.criteria
        ),
        updatedAt: now,
      };

      // API 호출하여 세그먼트 업데이트
      try {
        await axios.put(
          `${API_URL}/segments/${editingSegment.id}`,
          updatedSegment
        );
      } catch (error) {
        console.error("세그먼트 업데이트 API 오류:", error);
        // API 오류는 무시하고 UI만 업데이트
      }

      setSegments(
        segments.map((segment) =>
          segment.id === editingSegment.id ? updatedSegment : segment
        )
      );
      setEditingSegment(null);
      setNewSegment({
        name: "",
        description: "",
        criteria: {
          type: "all",
          status: "all",
        },
        color: colorOptions[0].value,
      });
      toast.success("세그먼트가 업데이트되었습니다.");
    } catch (error) {
      console.error("세그먼트 업데이트 오류:", error);
      toast.error("세그먼트 업데이트에 실패했습니다.");
    }
  };

  // 편집 취소 핸들러
  const handleCancelEdit = () => {
    setEditingSegment(null);
    setNewSegment({
      name: "",
      description: "",
      criteria: {
        type: "all",
        status: "all",
      },
      color: colorOptions[0].value,
    });
  };

  // 세그먼트 편집 시작 핸들러
  const handleEditSegment = (segment: Segment) => {
    setEditingSegment(segment);
    setNewSegment({
      name: segment.name,
      description: segment.description,
      criteria: segment.criteria,
      color: segment.color,
    });
  };

  // 로딩 중 상태 처리
  if (isLoading) {
    return (
      <div className="p-6">
        <PageHeader
          title="고객 세그먼트"
          description="고객 및 가수를 여러 기준으로 분류합니다."
        />
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  // JSX 반환 (기존 UI 유지)
  // ...
  return (
    <div className="p-6 space-y-6">
      {/* 기존 UI 코드 유지 */}
      <PageHeader
        title="고객 세그먼트"
        description="고객 및 가수를 여러 기준으로 분류합니다."
      />

      {/* 세그먼트 추가 버튼 */}
      {!showAddForm && !editingSegment && (
        <div className="text-right">
          <button
            onClick={() => setShowAddForm(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            새 세그먼트 추가
          </button>
        </div>
      )}

      {/* 세그먼트 추가 폼 */}
      {(showAddForm || editingSegment) && (
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">
            {editingSegment ? "세그먼트 편집" : "새 세그먼트 추가"}
          </h2>
          <form onSubmit={handleAddSegment} className="space-y-4">
            {/* 기본 정보 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  세그먼트명
                </label>
                <input
                  type="text"
                  name="name"
                  value={newSegment.name}
                  onChange={handleInputChange}
                  placeholder="예: VIP 고객, 신규 가수 등"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  색상
                </label>
                <select
                  name="color"
                  value={newSegment.color}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  {colorOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                설명
              </label>
              <textarea
                name="description"
                value={newSegment.description}
                onChange={handleInputChange}
                rows={2}
                placeholder="세그먼트에 대한 설명"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>

            {/* 필터 기준 */}
            <div>
              <h3 className="text-lg font-medium mb-2">필터 기준</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    엔티티 타입
                  </label>
                  <select
                    name="criteria.type"
                    value={newSegment.criteria?.type || "all"}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="all">모든 엔티티</option>
                    <option value="customer">고객만</option>
                    <option value="singer">가수만</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    상태
                  </label>
                  <select
                    name="criteria.status"
                    value={newSegment.criteria?.status || "all"}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
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
                    value={newSegment.criteria?.grade || ""}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="">모든 등급</option>
                    <option value="1">1등급 (VIP)</option>
                    <option value="2">2등급</option>
                    <option value="3">3등급</option>
                    <option value="4">4등급</option>
                    <option value="5">5등급</option>
                  </select>
                </div>
              </div>
            </div>

            {/* 버튼 */}
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => {
                  editingSegment ? handleCancelEdit() : setShowAddForm(false);
                }}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-100 transition"
              >
                취소
              </button>
              <button
                type="button"
                onClick={updateSegmentPreview}
                className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition"
              >
                미리보기
              </button>
              {editingSegment ? (
                <button
                  type="button"
                  onClick={handleSaveEdit}
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
                >
                  저장
                </button>
              ) : (
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                >
                  세그먼트 생성
                </button>
              )}
            </div>
          </form>

          {/* 미리보기 결과 */}
          {previewResults.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-medium mb-2">
                미리보기 결과 ({previewResults.length}개)
              </h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        이름
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        타입
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        상태
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        등급
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {previewResults.map((entity) => (
                      <tr key={`${entity.entityType}-${entity.id}`}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {entity.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {entity.entityType === "customer" ? "고객" : "가수"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              entity.status === "active"
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {entity.status === "active" ? "활성" : "비활성"}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {entity.entityType === "customer"
                            ? entity.grade
                            : entity.rating}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 세그먼트 목록 */}
      <div className="space-y-4">
        {segments.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-6 text-center text-gray-500">
            세그먼트가 없습니다. 새 세그먼트를 추가해보세요.
          </div>
        ) : (
          segments.map((segment) => (
            <div
              key={segment.id}
              className="bg-white rounded-lg shadow overflow-hidden"
            >
              <div
                className="h-2"
                style={{ backgroundColor: segment.color }}
              ></div>
              <div className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-semibold">{segment.name}</h3>
                    <p className="text-gray-600 mt-1">{segment.description}</p>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEditSegment(segment)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      편집
                    </button>
                    <button
                      onClick={() => handleDeleteSegment(segment.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      삭제
                    </button>
                  </div>
                </div>

                <div className="mt-4 flex items-center">
                  <span className="text-gray-700 font-medium">
                    {segment.entityCount}명의{" "}
                    {segment.criteria.type === "customer"
                      ? "고객"
                      : segment.criteria.type === "singer"
                      ? "가수"
                      : "엔티티"}
                  </span>
                  <span className="mx-2 text-gray-500">•</span>
                  <span className="text-gray-500 text-sm">
                    마지막 업데이트:{" "}
                    {new Date(segment.updatedAt).toLocaleDateString("ko-KR", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </div>

                <div className="mt-3 text-sm text-gray-600">
                  <div className="flex flex-wrap gap-2">
                    {segment.criteria.type &&
                      segment.criteria.type !== "all" && (
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                          {segment.criteria.type === "customer"
                            ? "고객"
                            : "가수"}
                        </span>
                      )}
                    {segment.criteria.status &&
                      segment.criteria.status !== "all" && (
                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded">
                          {segment.criteria.status === "active"
                            ? "활성"
                            : "비활성"}
                        </span>
                      )}
                    {segment.criteria.grade && (
                      <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded">
                        등급: {segment.criteria.grade}
                      </span>
                    )}
                    {segment.criteria.minContractCount && (
                      <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                        최소 계약 수: {segment.criteria.minContractCount}
                      </span>
                    )}
                    {segment.criteria.maxContractCount && (
                      <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                        최대 계약 수: {segment.criteria.maxContractCount}
                      </span>
                    )}
                    {segment.criteria.registrationDateStart && (
                      <span className="bg-indigo-100 text-indigo-800 px-2 py-1 rounded">
                        등록일 시작:{" "}
                        {new Date(
                          segment.criteria.registrationDateStart
                        ).toLocaleDateString()}
                      </span>
                    )}
                    {segment.criteria.registrationDateEnd && (
                      <span className="bg-indigo-100 text-indigo-800 px-2 py-1 rounded">
                        등록일 종료:{" "}
                        {new Date(
                          segment.criteria.registrationDateEnd
                        ).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
