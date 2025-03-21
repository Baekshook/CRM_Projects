"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import PageHeader from "@/components/common/PageHeader";
import {
  ResourceItem,
  ResourceType,
  ResourceFilters,
} from "@/components/customers/types";
import { customers } from "@/utils/dummyData";
import { toast } from "react-hot-toast";

export default function CustomerResourcesPage() {
  const router = useRouter();
  const [resources, setResources] = useState<ResourceItem[]>([]);
  const [selectedResources, setSelectedResources] = useState<string[]>([]);
  const [filters, setFilters] = useState<ResourceFilters>({
    search: "",
    sortBy: "uploadedAt",
    sortOrder: "desc",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [customerId, setCustomerId] = useState<string | null>(null);

  useEffect(() => {
    fetchResources();
  }, [filters]);

  // 샘플 자료 데이터
  const dummyResources: ResourceItem[] = [
    {
      id: "RES-001",
      entityId: "CUST-001",
      name: "계약서 템플릿.pdf",
      type: "document",
      fileUrl: "/files/contracts/template.pdf",
      fileSize: 1254000,
      uploadedAt: "2025-02-15T10:30:00Z",
      description: "표준 계약서 템플릿",
      category: "계약",
      tags: ["계약", "템플릿", "표준"],
    },
    {
      id: "RES-002",
      entityId: "CUST-001",
      name: "이벤트 기획안.docx",
      type: "document",
      fileUrl: "/files/plans/event_plan.docx",
      fileSize: 2458000,
      uploadedAt: "2025-02-10T14:15:00Z",
      description: "행사 기획 제안서",
      category: "기획",
      tags: ["기획", "제안", "행사"],
    },
    {
      id: "RES-003",
      entityId: "CUST-002",
      name: "웨딩홀 사진.jpg",
      type: "image",
      fileUrl: "/files/venues/wedding_hall.jpg",
      fileSize: 3542000,
      uploadedAt: "2025-02-05T09:45:00Z",
      description: "웨딩홀 전경 이미지",
      category: "장소",
      tags: ["웨딩", "장소", "사진"],
    },
    {
      id: "RES-004",
      entityId: "CUST-003",
      name: "축제 일정표.xlsx",
      type: "document",
      fileUrl: "/files/schedules/festival_schedule.xlsx",
      fileSize: 1845000,
      uploadedAt: "2025-01-28T11:20:00Z",
      description: "대학 축제 일정 및 타임테이블",
      category: "일정",
      tags: ["축제", "일정", "대학"],
    },
    {
      id: "RES-005",
      entityId: "CUST-001",
      name: "프레젠테이션.pptx",
      type: "document",
      fileUrl: "/files/presentations/client_ppt.pptx",
      fileSize: 5120000,
      uploadedAt: "2025-01-20T16:00:00Z",
      description: "고객사 행사 프레젠테이션",
      category: "프레젠테이션",
      tags: ["발표", "PPT", "행사"],
    },
  ];

  const fetchResources = () => {
    try {
      setIsLoading(true);

      // 실제 앱에서는 API 호출로 데이터 가져오기
      setResources(dummyResources);

      // 필터링 로직
      let filteredResources = [...dummyResources];

      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        filteredResources = filteredResources.filter(
          (resource) =>
            resource.name.toLowerCase().includes(searchLower) ||
            resource.description?.toLowerCase().includes(searchLower) ||
            resource.tags?.some((tag) =>
              tag.toLowerCase().includes(searchLower)
            )
        );
      }

      if (filters.type) {
        filteredResources = filteredResources.filter(
          (resource) => resource.type === filters.type
        );
      }

      if (filters.category) {
        filteredResources = filteredResources.filter(
          (resource) => resource.category === filters.category
        );
      }

      if (filters.entityId) {
        filteredResources = filteredResources.filter(
          (resource) => resource.entityId === filters.entityId
        );
      }

      // 정렬
      filteredResources.sort((a, b) => {
        if (filters.sortBy === "name") {
          return filters.sortOrder === "asc"
            ? a.name.localeCompare(b.name)
            : b.name.localeCompare(a.name);
        } else if (filters.sortBy === "uploadedAt") {
          return filters.sortOrder === "asc"
            ? new Date(a.uploadedAt).getTime() -
                new Date(b.uploadedAt).getTime()
            : new Date(b.uploadedAt).getTime() -
                new Date(a.uploadedAt).getTime();
        } else {
          // fileSize
          return filters.sortOrder === "asc"
            ? a.fileSize - b.fileSize
            : b.fileSize - a.fileSize;
        }
      });

      setResources(filteredResources);
    } catch (error) {
      console.error("자료 목록 불러오기 오류:", error);
      toast.error("자료 목록을 불러오는데 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilterChange = (newFilters: Partial<ResourceFilters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedResources(resources.map((resource) => resource.id));
    } else {
      setSelectedResources([]);
    }
  };

  const handleSelectResource = (id: string) => {
    setSelectedResources((prev) =>
      prev.includes(id) ? prev.filter((resId) => resId !== id) : [...prev, id]
    );
  };

  const handleDelete = (id: string) => {
    if (confirm("정말로 이 자료를 삭제하시겠습니까?")) {
      try {
        // 실제 앱에서는 API 호출
        const updatedResources = resources.filter(
          (resource) => resource.id !== id
        );
        setResources(updatedResources);
        setSelectedResources((prev) => prev.filter((resId) => resId !== id));
        toast.success("자료가 삭제되었습니다.");
      } catch (error) {
        toast.error("자료 삭제에 실패했습니다.");
      }
    }
  };

  const handleBulkDelete = () => {
    if (
      confirm(`선택된 ${selectedResources.length}개 자료를 삭제하시겠습니까?`)
    ) {
      try {
        // 실제 앱에서는 API 호출
        const updatedResources = resources.filter(
          (resource) => !selectedResources.includes(resource.id)
        );
        setResources(updatedResources);
        setSelectedResources([]);
        toast.success(`${selectedResources.length}개 자료가 삭제되었습니다.`);
      } catch (error) {
        toast.error("자료 삭제에 실패했습니다.");
      }
    }
  };

  const handleUpload = () => {
    // 파일 업로드 모달 열기 (실제 구현시)
    alert("파일 업로드 기능은 실제 앱에서 구현됩니다.");
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) {
      return bytes + " B";
    } else if (bytes < 1024 * 1024) {
      return (bytes / 1024).toFixed(1) + " KB";
    } else if (bytes < 1024 * 1024 * 1024) {
      return (bytes / (1024 * 1024)).toFixed(1) + " MB";
    } else {
      return (bytes / (1024 * 1024 * 1024)).toFixed(1) + " GB";
    }
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getTypeIcon = (type: ResourceType): string => {
    switch (type) {
      case "document":
        return "📄";
      case "image":
        return "🖼️";
      case "audio":
        return "🎵";
      case "video":
        return "🎬";
      default:
        return "📦";
    }
  };

  const getCustomerName = (customerId: string): string => {
    const customer = customers.find((c) => c.id === customerId);
    return customer ? customer.name : customerId;
  };

  return (
    <div className="pb-10">
      <PageHeader
        title="고객 자료 관리"
        description="고객별 자료를 관리하고 조회합니다."
      />

      {/* 필터 및 액션 영역 */}
      <div className="mb-6 bg-white rounded-lg shadow p-4">
        <div className="flex flex-wrap justify-between items-center gap-4">
          {/* 검색 */}
          <div className="flex-grow max-w-md">
            <input
              type="text"
              placeholder="자료명, 설명, 태그 검색..."
              value={filters.search}
              onChange={(e) => handleFilterChange({ search: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded-lg"
            />
          </div>

          {/* 필터 */}
          <div className="flex gap-2">
            <select
              value={filters.type || ""}
              onChange={(e) =>
                handleFilterChange({
                  type: (e.target.value as ResourceType) || undefined,
                })
              }
              className="p-2 border border-gray-300 rounded-lg"
            >
              <option value="">모든 자료 타입</option>
              <option value="document">문서</option>
              <option value="image">이미지</option>
              <option value="audio">오디오</option>
              <option value="video">비디오</option>
              <option value="other">기타</option>
            </select>

            <select
              value={filters.entityId || ""}
              onChange={(e) =>
                handleFilterChange({ entityId: e.target.value || undefined })
              }
              className="p-2 border border-gray-300 rounded-lg"
            >
              <option value="">모든 고객</option>
              {customers.map((customer) => (
                <option key={customer.id} value={customer.id}>
                  {customer.name}
                </option>
              ))}
            </select>

            <select
              value={filters.sortBy}
              onChange={(e) =>
                handleFilterChange({
                  sortBy: e.target.value as "name" | "uploadedAt" | "fileSize",
                })
              }
              className="p-2 border border-gray-300 rounded-lg"
            >
              <option value="uploadedAt">업로드 날짜</option>
              <option value="name">파일명</option>
              <option value="fileSize">파일 크기</option>
            </select>

            <select
              value={filters.sortOrder}
              onChange={(e) =>
                handleFilterChange({
                  sortOrder: e.target.value as "asc" | "desc",
                })
              }
              className="p-2 border border-gray-300 rounded-lg"
            >
              <option value="desc">내림차순</option>
              <option value="asc">오름차순</option>
            </select>
          </div>

          {/* 버튼 */}
          <div className="flex gap-2">
            {selectedResources.length > 0 && (
              <button
                onClick={handleBulkDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                {selectedResources.length}개 삭제
              </button>
            )}
            <button
              onClick={handleUpload}
              className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
            >
              자료 업로드
            </button>
          </div>
        </div>
      </div>

      {/* 자료 목록 */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {isLoading ? (
          <div className="p-6 text-center text-gray-500">
            자료를 불러오는 중...
          </div>
        ) : resources.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            <p className="mb-4">등록된 자료가 없습니다.</p>
            <button
              onClick={handleUpload}
              className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
            >
              자료 업로드
            </button>
          </div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-8">
                  <input
                    type="checkbox"
                    checked={
                      selectedResources.length === resources.length &&
                      resources.length > 0
                    }
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  자료
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  타입
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  크기
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  업로드 날짜
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  관련 고객
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  관리
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {resources.map((resource) => (
                <tr key={resource.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={selectedResources.includes(resource.id)}
                      onChange={() => handleSelectResource(resource.id)}
                      className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <span className="text-2xl mr-3">
                        {getTypeIcon(resource.type)}
                      </span>
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {resource.name}
                        </div>
                        {resource.description && (
                          <div className="text-sm text-gray-500">
                            {resource.description}
                          </div>
                        )}
                        {resource.tags && resource.tags.length > 0 && (
                          <div className="mt-1 flex flex-wrap gap-1">
                            {resource.tags.map((tag, idx) => (
                              <span
                                key={idx}
                                className="px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded-full"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {resource.type === "document" && "문서"}
                    {resource.type === "image" && "이미지"}
                    {resource.type === "audio" && "오디오"}
                    {resource.type === "video" && "비디오"}
                    {resource.type === "other" && "기타"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatFileSize(resource.fileSize)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(resource.uploadedAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <a
                      href={`/admin/customers/${resource.entityId}`}
                      className="text-sm text-orange-600 hover:text-orange-900"
                    >
                      {getCustomerName(resource.entityId)}
                    </a>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button className="text-orange-600 hover:text-orange-900 mr-3">
                      다운로드
                    </button>
                    <button
                      onClick={() => handleDelete(resource.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      삭제
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
