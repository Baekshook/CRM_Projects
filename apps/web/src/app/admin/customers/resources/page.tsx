"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import PageHeader from "@/components/common/PageHeader";
import {
  ResourceItem,
  ResourceType,
  ResourceFilters,
} from "@/components/customers/types";
import { toast } from "react-hot-toast";
import customerApi from "@/services/customerApi";
import singerApi from "@/services/singerApi";
import Image from "next/image";

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
  const [customers, setCustomers] = useState<any[]>([]);
  const [singers, setSingers] = useState<any[]>([]);
  const [entityType, setEntityType] = useState<"customer" | "singer" | "all">(
    "all"
  );

  useEffect(() => {
    // 고객 목록 불러오기
    const fetchCustomers = async () => {
      try {
        const response = await customerApi.getAll();
        setCustomers(response);
      } catch (error) {
        console.error("고객 목록 조회 오류:", error);
      }
    };

    // 가수 목록 불러오기
    const fetchSingers = async () => {
      try {
        const response = await singerApi.getAll();
        setSingers(response);
      } catch (error) {
        console.error("가수 목록 조회 오류:", error);
      }
    };

    fetchCustomers();
    fetchSingers();
  }, []);

  useEffect(() => {
    fetchResources();
  }, [filters, customerId, entityType]);

  const fetchResources = async () => {
    try {
      setIsLoading(true);

      let fileResources: ResourceItem[] = [];

      // 선택된 고객/가수 ID가 있는 경우, 해당 엔티티의 파일만 가져옴
      if (customerId) {
        let fetchedFiles;
        if (entityType === "customer" || entityType === "all") {
          try {
            fetchedFiles = await customerApi.getFiles(customerId);

            const customerFiles = fetchedFiles.map((file: any) => ({
              id: file.id,
              entityId: file.entityId,
              entityType: file.entityType,
              name: file.originalName,
              type: getFileType(file.mimeType),
              fileUrl: customerApi.getFileUrl(file.id),
              fileSize: file.size,
              uploadedAt: file.uploadedAt,
              description: file.category || "고객 파일",
              category: file.category || "미분류",
              tags: [file.category, "고객"],
              mimeType: file.mimeType,
              isStoredInDb: file.isStoredInDb,
            }));

            fileResources = [...fileResources, ...customerFiles];
          } catch (error) {
            console.error("고객 파일 조회 오류:", error);
          }
        }

        if (entityType === "singer" || entityType === "all") {
          try {
            fetchedFiles = await singerApi.getFiles(customerId);

            const singerFiles = fetchedFiles.map((file: any) => ({
              id: file.id,
              entityId: file.entityId,
              entityType: file.entityType,
              name: file.originalName,
              type: getFileType(file.mimeType),
              fileUrl: singerApi.getFileUrl(file.id),
              fileSize: file.size,
              uploadedAt: file.uploadedAt,
              description: file.category || "가수 파일",
              category: file.category || "미분류",
              tags: [file.category, "가수"],
              mimeType: file.mimeType,
              isStoredInDb: file.isStoredInDb,
            }));

            fileResources = [...fileResources, ...singerFiles];
          } catch (error) {
            console.error("가수 파일 조회 오류:", error);
          }
        }
      } else {
        // 모든 고객과 가수의 파일을 가져오는 로직
        const customerFiles = [];
        const singerFiles = [];

        if (entityType === "customer" || entityType === "all") {
          // 모든 고객의 첫 10명에 대해서만 파일 가져오기 (성능 때문에)
          const customersToFetch = customers.slice(0, 10);
          for (const customer of customersToFetch) {
            try {
              const files = await customerApi.getFiles(customer.id);
              const mappedFiles = files.map((file: any) => ({
                id: file.id,
                entityId: file.entityId,
                entityType: file.entityType,
                name: file.originalName,
                type: getFileType(file.mimeType),
                fileUrl: customerApi.getFileUrl(file.id),
                fileSize: file.size,
                uploadedAt: file.uploadedAt,
                description: file.category || "고객 파일",
                category: file.category || "미분류",
                tags: [file.category, "고객"],
                mimeType: file.mimeType,
                isStoredInDb: file.isStoredInDb,
              }));

              customerFiles.push(...mappedFiles);
            } catch (error) {
              console.error(`고객 ${customer.id} 파일 조회 오류:`, error);
            }
          }
        }

        if (entityType === "singer" || entityType === "all") {
          // 모든 가수의 첫 10명에 대해서만 파일 가져오기 (성능 때문에)
          const singersToFetch = singers.slice(0, 10);
          for (const singer of singersToFetch) {
            try {
              const files = await singerApi.getFiles(singer.id);
              const mappedFiles = files.map((file: any) => ({
                id: file.id,
                entityId: file.entityId,
                entityType: file.entityType,
                name: file.originalName,
                type: getFileType(file.mimeType),
                fileUrl: singerApi.getFileUrl(file.id),
                fileSize: file.size,
                uploadedAt: file.uploadedAt,
                description: file.category || "가수 파일",
                category: file.category || "미분류",
                tags: [file.category, "가수"],
                mimeType: file.mimeType,
                isStoredInDb: file.isStoredInDb,
              }));

              singerFiles.push(...mappedFiles);
            } catch (error) {
              console.error(`가수 ${singer.id} 파일 조회 오류:`, error);
            }
          }
        }

        fileResources = [...customerFiles, ...singerFiles];
      }

      // 필터링 로직
      let filteredResources = [...fileResources];

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

  const getFileType = (mimeType: string): ResourceType => {
    if (mimeType.startsWith("image/")) return "image";
    if (mimeType.startsWith("audio/")) return "audio";
    if (mimeType.startsWith("video/")) return "video";
    if (mimeType === "application/pdf") return "document";
    if (
      mimeType.includes("document") ||
      mimeType.includes("sheet") ||
      mimeType.includes("presentation")
    )
      return "document";
    return "other";
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

  const handleDelete = async (id: string) => {
    if (confirm("정말로 이 자료를 삭제하시겠습니까?")) {
      try {
        // 실제 API 호출로 파일 삭제
        const fileToDelete = resources.find((res) => res.id === id);
        if (!fileToDelete) {
          throw new Error("삭제할 파일을 찾을 수 없습니다.");
        }

        // 백엔드 API 호출하여 삭제
        await fetch(`http://localhost:4000/api/files/${id}`, {
          method: "DELETE",
        });

        const updatedResources = resources.filter(
          (resource) => resource.id !== id
        );
        setResources(updatedResources);
        setSelectedResources((prev) => prev.filter((resId) => resId !== id));
        toast.success("자료가 삭제되었습니다.");
      } catch (error) {
        console.error("자료 삭제 오류:", error);
        toast.error("자료 삭제에 실패했습니다.");
      }
    }
  };

  const handleBulkDelete = async () => {
    if (
      confirm(`선택된 ${selectedResources.length}개 자료를 삭제하시겠습니까?`)
    ) {
      try {
        // 실제 API 호출로 선택된 모든 파일 삭제
        for (const id of selectedResources) {
          await fetch(`http://localhost:4000/api/files/${id}`, {
            method: "DELETE",
          });
        }

        const updatedResources = resources.filter(
          (resource) => !selectedResources.includes(resource.id)
        );
        setResources(updatedResources);
        setSelectedResources([]);
        toast.success(`${selectedResources.length}개 자료가 삭제되었습니다.`);
      } catch (error) {
        console.error("다중 자료 삭제 오류:", error);
        toast.error("자료 삭제에 실패했습니다.");
      }
    }
  };

  const handleUpload = () => {
    // 업로드 페이지로 이동
    router.push("/admin/customers/resources/upload");
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    if (bytes < 1024 * 1024 * 1024)
      return (bytes / (1024 * 1024)).toFixed(1) + " MB";
    return (bytes / (1024 * 1024 * 1024)).toFixed(1) + " GB";
  };

  const formatDate = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("ko-KR", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (error) {
      return "날짜 오류";
    }
  };

  const getTypeIcon = (type: ResourceType): string => {
    switch (type) {
      case "document":
        return "📄";
      case "image":
        return "🖼️";
      case "video":
        return "🎬";
      case "audio":
        return "🎵";
      default:
        return "📁";
    }
  };

  const getEntityName = (entityId: string, entityType: string): string => {
    if (entityType === "customer") {
      const customer = customers.find((c) => c.id.toString() === entityId);
      return customer ? customer.name : `고객 ${entityId}`;
    } else if (entityType === "singer") {
      const singer = singers.find((s) => s.id.toString() === entityId);
      return singer ? singer.name : `가수 ${entityId}`;
    }
    return `알 수 없음 ${entityId}`;
  };

  return (
    <div className="p-4 md:p-8">
      {/* 헤더 */}
      <PageHeader
        title="고객 자료 관리"
        description="고객 및 가수 관련 자료를 관리합니다."
        backUrl="/admin/customers"
      />

      {/* 검색 및 필터링 영역 */}
      <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="자료 검색"
              className="w-full rounded-md border-gray-300"
              value={filters.search}
              onChange={(e) => handleFilterChange({ search: e.target.value })}
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <select
              className="rounded-md border-gray-300"
              value={entityType}
              onChange={(e) =>
                setEntityType(e.target.value as "customer" | "singer" | "all")
              }
            >
              <option value="all">모든 유형</option>
              <option value="customer">고객</option>
              <option value="singer">가수</option>
            </select>

            <select
              className="rounded-md border-gray-300"
              value={customerId || ""}
              onChange={(e) => setCustomerId(e.target.value || null)}
            >
              <option value="">모든 고객/가수</option>
              {entityType === "all" || entityType === "customer" ? (
                <optgroup label="고객">
                  {customers.map((customer) => (
                    <option key={`customer-${customer.id}`} value={customer.id}>
                      {customer.name} (고객)
                    </option>
                  ))}
                </optgroup>
              ) : null}
              {entityType === "all" || entityType === "singer" ? (
                <optgroup label="가수">
                  {singers.map((singer) => (
                    <option key={`singer-${singer.id}`} value={singer.id}>
                      {singer.name} (가수)
                    </option>
                  ))}
                </optgroup>
              ) : null}
            </select>

            <select
              className="rounded-md border-gray-300"
              value={filters.type || ""}
              onChange={(e) =>
                handleFilterChange({
                  type: e.target.value as ResourceType | undefined,
                })
              }
            >
              <option value="">모든 파일 유형</option>
              <option value="document">문서</option>
              <option value="image">이미지</option>
              <option value="video">비디오</option>
              <option value="audio">오디오</option>
              <option value="other">기타</option>
            </select>
          </div>
        </div>
      </div>

      {/* 액션 버튼 영역 */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex gap-2">
          <button
            onClick={() =>
              handleSelectAll(
                !(
                  selectedResources.length === resources.length &&
                  resources.length > 0
                )
              )
            }
            className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded-md text-sm"
          >
            {selectedResources.length === resources.length &&
            resources.length > 0
              ? "전체 선택 해제"
              : "전체 선택"}
          </button>
          {selectedResources.length > 0 && (
            <button
              onClick={handleBulkDelete}
              className="px-3 py-1 bg-red-100 hover:bg-red-200 text-red-700 rounded-md text-sm"
            >
              선택 삭제 ({selectedResources.length})
            </button>
          )}
        </div>
        <button
          onClick={handleUpload}
          className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-md"
        >
          자료 업로드
        </button>
      </div>

      {/* 자료 목록 */}
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <div
              className="spinner-border inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent"
              role="status"
            >
              <span className="sr-only">로딩중...</span>
            </div>
            <p className="mt-2 text-gray-600">데이터를 불러오는 중...</p>
          </div>
        </div>
      ) : resources.length === 0 ? (
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <p className="text-xl text-gray-500">자료가 없습니다.</p>
          <button
            onClick={handleUpload}
            className="mt-4 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-md"
          >
            첫 자료 업로드하기
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="w-10 px-6 py-3">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300"
                    checked={
                      selectedResources.length === resources.length &&
                      resources.length > 0
                    }
                    onChange={() =>
                      handleSelectAll(
                        !(
                          selectedResources.length === resources.length &&
                          resources.length > 0
                        )
                      )
                    }
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  파일
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  소유자
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  카테고리
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  크기
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  업로드 날짜
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  작업
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {resources.map((resource) => (
                <tr key={resource.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300"
                      checked={selectedResources.includes(resource.id)}
                      onChange={() => handleSelectResource(resource.id)}
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 mr-3">
                        {getTypeIcon(resource.type)}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {resource.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {resource.description || "설명 없음"}
                        </div>
                        {resource.tags && resource.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-1">
                            {resource.tags.map((tag, index) => (
                              <span
                                key={index}
                                className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {getEntityName(resource.entityId, resource.entityType)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                      {resource.category || "기타"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {formatFileSize(resource.fileSize)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {formatDate(resource.uploadedAt)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <a
                      href={resource.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-indigo-600 hover:text-indigo-900 mr-3"
                    >
                      보기
                    </a>
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
        </div>
      )}
    </div>
  );
}
