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
    <div className="p-6">
      {/* 헤더 */}
      <PageHeader
        title="고객 자료 관리"
        description="고객 및 가수 관련 자료를 관리합니다."
        backUrl="/admin/customers"
      />

      {/* 필터 영역 */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              검색
            </label>
            <input
              type="text"
              value={filters.search}
              onChange={(e) => handleFilterChange({ search: e.target.value })}
              placeholder="파일명, 설명, 태그로 검색..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              파일 유형
            </label>
            <select
              value={filters.type || ""}
              onChange={(e) =>
                handleFilterChange({
                  type: e.target.value as ResourceType | undefined,
                })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">모든 유형</option>
              <option value="document">문서</option>
              <option value="image">이미지</option>
              <option value="video">비디오</option>
              <option value="audio">오디오</option>
              <option value="other">기타</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              정렬
            </label>
            <div className="flex space-x-2">
              <select
                value={filters.sortBy}
                onChange={(e) => handleFilterChange({ sortBy: e.target.value })}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
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
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="desc">내림차순</option>
                <option value="asc">오름차순</option>
              </select>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              엔티티 타입
            </label>
            <select
              value={entityType}
              onChange={(e) =>
                setEntityType(e.target.value as "customer" | "singer" | "all")
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">모든 유형</option>
              <option value="customer">고객</option>
              <option value="singer">가수</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              고객/가수 선택
            </label>
            <select
              value={customerId || ""}
              onChange={(e) => setCustomerId(e.target.value || null)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
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
          </div>
        </div>
      </div>

      {/* 도구 모음 */}
      <div className="flex justify-between items-center mb-4">
        <div className="text-sm text-gray-600">
          {resources.length}개 자료
          {selectedResources.length > 0 &&
            ` (${selectedResources.length}개 선택됨)`}
        </div>
        <div className="flex space-x-2">
          {selectedResources.length > 0 && (
            <button
              onClick={handleBulkDelete}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
            >
              선택 삭제
            </button>
          )}
          <button
            onClick={handleUpload}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
          >
            자료 업로드
          </button>
        </div>
      </div>

      {/* 자료 목록 테이블 */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-500">자료를 불러오는 중입니다...</p>
          </div>
        ) : resources.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-gray-500">
              등록된 자료가 없습니다. 새 자료를 업로드해보세요.
            </p>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-3 px-4 text-left w-12">
                  <input
                    type="checkbox"
                    checked={
                      selectedResources.length === resources.length &&
                      resources.length > 0
                    }
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="rounded text-blue-500 focus:ring-blue-500"
                  />
                </th>
                <th className="py-3 px-4 text-left w-12">유형</th>
                <th className="py-3 px-4 text-left">파일명</th>
                <th className="py-3 px-4 text-left">소유자</th>
                <th className="py-3 px-4 text-left">카테고리</th>
                <th className="py-3 px-4 text-left">크기</th>
                <th className="py-3 px-4 text-left">업로드일</th>
                <th className="py-3 px-4 text-left w-24">관리</th>
              </tr>
            </thead>
            <tbody>
              {resources.map((resource) => (
                <tr
                  key={resource.id}
                  className="border-t border-gray-200 hover:bg-gray-50"
                >
                  <td className="py-3 px-4">
                    <input
                      type="checkbox"
                      checked={selectedResources.includes(resource.id)}
                      onChange={() => handleSelectResource(resource.id)}
                      className="rounded text-blue-500 focus:ring-blue-500"
                    />
                  </td>
                  <td className="py-3 px-4 text-xl">
                    {getTypeIcon(resource.type)}
                  </td>
                  <td className="py-3 px-4">
                    <a
                      href={resource.fileUrl}
                      target="_blank"
                      className="text-blue-600 hover:underline font-medium"
                    >
                      {resource.name}
                    </a>
                    {resource.description && (
                      <p className="text-xs text-gray-500 mt-1">
                        {resource.description}
                      </p>
                    )}
                    {resource.tags && resource.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1">
                        {resource.tags.map((tag, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-1 bg-gray-100 text-xs text-gray-600 rounded"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </td>
                  <td className="py-3 px-4 text-sm">
                    {getEntityName(resource.entityId, resource.entityType)}
                  </td>
                  <td className="py-3 px-4 text-sm">{resource.category}</td>
                  <td className="py-3 px-4 text-sm">
                    {formatFileSize(resource.fileSize)}
                  </td>
                  <td className="py-3 px-4 text-sm">
                    {formatDate(resource.uploadedAt)}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex space-x-2">
                      <a
                        href={resource.fileUrl}
                        target="_blank"
                        className="text-blue-500 hover:text-blue-700"
                        title="다운로드"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                          />
                        </svg>
                      </a>
                      <button
                        onClick={() => handleDelete(resource.id)}
                        className="text-red-500 hover:text-red-700"
                        title="삭제"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
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
