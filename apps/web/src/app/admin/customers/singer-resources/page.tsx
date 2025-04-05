"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import PageHeader from "@/components/common/PageHeader";
import { Badge } from "@/components/ui/badge";
import {
  ResourceItem,
  ResourceFilters,
  getResources,
  deleteResource,
} from "@/services/resourcesApi";
import singerApi from "@/services/singerApi";

// 가수 자료 페이지
export default function SingerResourcesPage() {
  const router = useRouter();
  const [resources, setResources] = useState<ResourceItem[]>([]);
  const [selectedResources, setSelectedResources] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [singerMap, setSingerMap] = useState<Record<string, string>>({});

  // 필터 상태
  const [filters, setFilters] = useState<ResourceFilters>({
    entityType: "singer",
  });

  // 자료 로드
  useEffect(() => {
    fetchResources();
    loadSingerData();
  }, [filters]);

  // 가수 데이터 로드
  const loadSingerData = async () => {
    try {
      const singers = await singerApi.getAll();
      const map: Record<string, string> = {};
      singers.forEach((singer) => {
        map[singer.id] = singer.name;
      });
      setSingerMap(map);
    } catch (error) {
      console.error("가수 데이터 로드 실패:", error);
    }
  };

  // 자료 로드 함수
  const fetchResources = async () => {
    setIsLoading(true);
    try {
      const data = await getResources(filters);
      setResources(data);
    } catch (error) {
      console.error("자료 로드 실패:", error);
      toast.error("자료를 불러오는데 실패했습니다");
    } finally {
      setIsLoading(false);
    }
  };

  // 필터 변경 핸들러
  const handleFilterChange = (
    key: keyof ResourceFilters,
    value: string | string[]
  ) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  // 자료 선택 핸들러
  const handleSelectResource = (id: string) => {
    setSelectedResources((prev) =>
      prev.includes(id)
        ? prev.filter((resourceId) => resourceId !== id)
        : [...prev, id]
    );
  };

  // 모든 자료 선택/해제 핸들러
  const handleSelectAll = () => {
    if (selectedResources.length === resources.length) {
      setSelectedResources([]);
    } else {
      setSelectedResources(resources.map((resource) => resource.id));
    }
  };

  // 자료 삭제 핸들러
  const handleDelete = async (id: string) => {
    if (window.confirm("이 자료를 삭제하시겠습니까?")) {
      try {
        await deleteResource(id);
        toast.success("자료가 삭제되었습니다");
        setResources((prev) => prev.filter((resource) => resource.id !== id));
      } catch (error) {
        console.error("자료 삭제 실패:", error);
        toast.error("자료 삭제에 실패했습니다");
      }
    }
  };

  // 선택된 자료 일괄 삭제 핸들러
  const handleBulkDelete = async () => {
    if (selectedResources.length === 0) {
      toast.error("삭제할 자료를 선택해주세요");
      return;
    }

    if (
      window.confirm(`${selectedResources.length}개의 자료를 삭제하시겠습니까?`)
    ) {
      try {
        await Promise.all(selectedResources.map((id) => deleteResource(id)));
        toast.success(`${selectedResources.length}개의 자료가 삭제되었습니다`);
        setResources((prev) =>
          prev.filter((resource) => !selectedResources.includes(resource.id))
        );
        setSelectedResources([]);
      } catch (error) {
        console.error("일괄 삭제 실패:", error);
        toast.error("일부 자료 삭제에 실패했습니다");
      }
    }
  };

  // 업로드 페이지 이동 핸들러
  const handleUpload = () => {
    router.push("/admin/customers/singer-resources/upload");
  };

  // 가수 이름 가져오기
  const getSingerName = (id: string): string => {
    return singerMap[id] || "알 수 없는 가수";
  };

  // 파일 확장자 아이콘 선택
  const getFileIcon = (fileType: string) => {
    switch (fileType) {
      case "image":
        return (
          <svg
            className="w-6 h-6 text-blue-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        );
      case "audio":
        return (
          <svg
            className="w-6 h-6 text-green-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
            />
          </svg>
        );
      case "video":
        return (
          <svg
            className="w-6 h-6 text-red-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
            />
          </svg>
        );
      case "document":
        return (
          <svg
            className="w-6 h-6 text-orange-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        );
      default:
        return (
          <svg
            className="w-6 h-6 text-gray-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2"
            />
          </svg>
        );
    }
  };

  // 파일 크기 형식화
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  // 날짜 형식화
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return `${date.getFullYear()}년 ${
      date.getMonth() + 1
    }월 ${date.getDate()}일`;
  };

  return (
    <div className="p-4 md:p-8">
      <PageHeader title="가수 자료" />

      {/* 검색 및 필터링 영역 */}
      <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="자료 검색"
              className="w-full rounded-md border-gray-300"
              onChange={(e) => handleFilterChange("searchTerm", e.target.value)}
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <select
              className="rounded-md border-gray-300"
              value={filters.entityId || ""}
              onChange={(e) => handleFilterChange("entityId", e.target.value)}
            >
              <option value="">모든 가수</option>
              {Object.entries(singerMap).map(([id, name]) => (
                <option key={id} value={id}>
                  {name}
                </option>
              ))}
            </select>

            <select
              className="rounded-md border-gray-300"
              value={filters.category || ""}
              onChange={(e) => handleFilterChange("category", e.target.value)}
            >
              <option value="">모든 카테고리</option>
              <option value="profile">프로필</option>
              <option value="portfolio">포트폴리오</option>
              <option value="performance">공연</option>
              <option value="contract">계약</option>
              <option value="other">기타</option>
            </select>

            <select
              className="rounded-md border-gray-300"
              value={filters.type || ""}
              onChange={(e) => handleFilterChange("type", e.target.value)}
            >
              <option value="">모든 파일 유형</option>
              <option value="image">이미지</option>
              <option value="audio">오디오</option>
              <option value="video">비디오</option>
              <option value="document">문서</option>
              <option value="other">기타</option>
            </select>
          </div>
        </div>
      </div>

      {/* 액션 버튼 영역 */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex gap-2">
          <button
            onClick={handleSelectAll}
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
          <div className="text-2xl text-gray-500">로딩 중...</div>
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
                    onChange={handleSelectAll}
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  파일
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  가수
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
                        {getFileIcon(resource.fileType)}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {resource.fileName}
                        </div>
                        <div className="text-sm text-gray-500">
                          {resource.description || "설명 없음"}
                        </div>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {resource.tags &&
                            resource.tags.map((tag, index) => (
                              <Badge
                                key={index}
                                variant="outline"
                                className="text-xs"
                              >
                                {tag}
                              </Badge>
                            ))}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {getSingerName(resource.entityId)}
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
                      {formatDate(
                        resource.uploadDate || resource.createdAt || ""
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <a
                      href={resource.url}
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
