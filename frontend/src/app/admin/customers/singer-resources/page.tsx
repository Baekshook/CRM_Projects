"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import PageHeader from "@/components/common/PageHeader";
import {
  ResourceItem,
  ResourceType,
  ResourceFilters,
  SingerResourceCategory,
} from "@/components/customers/types";
import { singers } from "@/utils/dummyData";
import { toast } from "react-hot-toast";

export default function SingerResourcesPage() {
  const router = useRouter();
  const [resources, setResources] = useState<ResourceItem[]>([]);
  const [selectedResources, setSelectedResources] = useState<string[]>([]);
  const [filters, setFilters] = useState<
    ResourceFilters & { category?: SingerResourceCategory }
  >({
    search: "",
    sortBy: "uploadedAt",
    sortOrder: "desc",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [singerId, setSingerId] = useState<string | null>(null);

  useEffect(() => {
    fetchResources();
  }, [filters]);

  // 샘플 자료 데이터
  const dummyResources: ResourceItem[] = [
    {
      id: "RES-101",
      entityId: "SINGER-001",
      name: "고화질 프로필 사진.jpg",
      type: "image",
      fileUrl: "/files/singers/high_res_photos/singer001_profile.jpg",
      fileSize: 8542000,
      uploadedAt: "2025-02-15T10:30:00Z",
      description: "김태희 가수 고화질 프로필 이미지",
      category: "photo",
      tags: ["프로필", "공식사진", "김태희"],
    },
    {
      id: "RES-102",
      entityId: "SINGER-001",
      name: "웨딩 축가 선곡리스트.pdf",
      type: "document",
      fileUrl: "/files/singers/song_lists/wedding_songs.pdf",
      fileSize: 1254000,
      uploadedAt: "2025-02-14T14:15:00Z",
      description: "웨딩 행사용 추천 선곡 리스트",
      category: "songList",
      tags: ["웨딩", "축가", "선곡", "김태희"],
    },
    {
      id: "RES-103",
      entityId: "SINGER-001",
      name: "가나다 MR.mp3",
      type: "audio",
      fileUrl: "/files/singers/mr_tracks/song1_mr.mp3",
      fileSize: 4256000,
      uploadedAt: "2025-02-13T09:45:00Z",
      description: "가나다 곡 MR",
      category: "mrTrack",
      tags: ["MR", "가나다", "김태희"],
    },
    {
      id: "RES-104",
      entityId: "SINGER-002",
      name: "콘서트 프로필.jpg",
      type: "image",
      fileUrl: "/files/singers/high_res_photos/singer002_profile.jpg",
      fileSize: 7845000,
      uploadedAt: "2025-02-12T11:20:00Z",
      description: "이준호 가수 콘서트용 프로필 이미지",
      category: "photo",
      tags: ["프로필", "콘서트", "이준호"],
    },
    {
      id: "RES-105",
      entityId: "SINGER-002",
      name: "기업행사 선곡리스트.xlsx",
      type: "document",
      fileUrl: "/files/singers/song_lists/corporate_songs.xlsx",
      fileSize: 2180000,
      uploadedAt: "2025-02-10T16:00:00Z",
      description: "기업 행사용 추천 선곡 리스트",
      category: "songList",
      tags: ["기업행사", "선곡", "이준호"],
    },
    {
      id: "RES-106",
      entityId: "SINGER-002",
      name: "라마바 MR.mp3",
      type: "audio",
      fileUrl: "/files/singers/mr_tracks/song2_mr.mp3",
      fileSize: 3980000,
      uploadedAt: "2025-02-08T13:30:00Z",
      description: "라마바 곡 MR",
      category: "mrTrack",
      tags: ["MR", "라마바", "이준호"],
    },
    {
      id: "RES-107",
      entityId: "SINGER-003",
      name: "재즈 공연 이력서.pdf",
      type: "document",
      fileUrl: "/files/singers/other/jazz_resume.pdf",
      fileSize: 3240000,
      uploadedAt: "2025-02-05T15:45:00Z",
      description: "박서연 가수 재즈 공연 이력서",
      category: "other",
      tags: ["이력서", "재즈", "박서연"],
    },
    {
      id: "RES-108",
      entityId: "SINGER-003",
      name: "공연 기술 요구사항.docx",
      type: "document",
      fileUrl: "/files/singers/other/technical_requirements.docx",
      fileSize: 1520000,
      uploadedAt: "2025-02-03T09:15:00Z",
      description: "박서연 가수 공연 기술 요구사항",
      category: "other",
      tags: ["기술요구사항", "공연", "박서연"],
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

  const handleFilterChange = (
    newFilters: Partial<ResourceFilters & { category?: SingerResourceCategory }>
  ) => {
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

  const getCategoryLabel = (category?: string): string => {
    switch (category) {
      case "photo":
        return "고화질 사진";
      case "songList":
        return "선곡 리스트";
      case "mrTrack":
        return "MR 자료";
      case "other":
        return "기타 자료";
      default:
        return "기타";
    }
  };

  const getSingerName = (singerId: string): string => {
    const singer = singers.find((s) => s.id === singerId);
    return singer ? singer.name : singerId;
  };

  return (
    <div className="pb-10">
      <PageHeader
        title="가수 자료 관리"
        description="가수별 고화질 사진, 선곡 리스트, MR 자료 등을 관리하고 조회합니다."
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
              value={filters.category || ""}
              onChange={(e) =>
                handleFilterChange({
                  category:
                    (e.target.value as SingerResourceCategory) || undefined,
                })
              }
              className="p-2 border border-gray-300 rounded-lg"
            >
              <option value="">모든 카테고리</option>
              <option value="photo">고화질 사진</option>
              <option value="songList">선곡 리스트</option>
              <option value="mrTrack">MR 자료</option>
              <option value="other">기타 자료</option>
            </select>

            <select
              value={filters.type || ""}
              onChange={(e) =>
                handleFilterChange({
                  type: (e.target.value as ResourceType) || undefined,
                })
              }
              className="p-2 border border-gray-300 rounded-lg"
            >
              <option value="">모든 파일 타입</option>
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
              <option value="">모든 가수</option>
              {singers.map((singer) => (
                <option key={singer.id} value={singer.id}>
                  {singer.name}
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
                  카테고리
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
                  가수
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
                    {getCategoryLabel(resource.category)}
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
                      {getSingerName(resource.entityId)}
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
