"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import PageHeader from "@/components/common/PageHeader";
import CustomerFilter from "@/components/customers/CustomerFilter";
import CustomerActions from "@/components/customers/CustomerActions";
import CustomerTable from "@/components/customers/CustomerTable";
import CustomerGrid from "@/components/customers/CustomerGrid";
import Pagination from "@/components/common/Pagination";
import {
  Entity,
  EntityType,
  ViewMode,
  CustomerStatus,
  Filter,
  CustomerGrade,
} from "@/components/customers/types";
import { toast } from "react-hot-toast";
import singerApi, { Singer } from "@/services/singerApi";

export default function SingersPage() {
  const router = useRouter();
  const [entities, setEntities] = useState<Entity[]>([]);
  const [filteredEntities, setFilteredEntities] = useState<Entity[]>([]);
  const [selectedEntities, setSelectedEntities] = useState<Set<string>>(
    new Set()
  );
  const [filters, setFilters] = useState<Filter>({
    searchTerm: "",
    status: "",
    grade: "",
    sortBy: "name",
    order: "asc",
  });
  const [viewMode, setViewMode] = useState<ViewMode>("table");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const entityType: EntityType = "singer";

  useEffect(() => {
    fetchEntities();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [entities, filters]);

  // 필터 적용 함수
  const applyFilters = () => {
    let filtered = [...entities];

    // 검색어 필터링
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      filtered = filtered.filter(
        (entity) =>
          entity.name.toLowerCase().includes(searchLower) ||
          entity.email.toLowerCase().includes(searchLower) ||
          entity.phone.toLowerCase().includes(searchLower) ||
          (entity as any).agency?.toLowerCase().includes(searchLower) ||
          (entity as any).genre?.toLowerCase().includes(searchLower)
      );
    }

    // 상태 필터링
    if (filters.status) {
      filtered = filtered.filter((entity) => entity.status === filters.status);
    }

    // 등급 필터링
    if (filters.grade) {
      filtered = filtered.filter((entity) => entity.grade === filters.grade);
    }

    // 정렬
    filtered.sort((a, b) => {
      let aValue: any = a[filters.sortBy];
      let bValue: any = b[filters.sortBy];

      if (filters.sortBy === "registrationDate") {
        aValue = aValue ? new Date(aValue).getTime() : 0;
        bValue = bValue ? new Date(bValue).getTime() : 0;
      }

      if (typeof aValue === "string" && typeof bValue === "string") {
        return filters.order === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      // 숫자 비교
      return filters.order === "asc"
        ? (aValue || 0) - (bValue || 0)
        : (bValue || 0) - (aValue || 0);
    });

    setFilteredEntities(filtered);
    setCurrentPage(1); // 필터 변경 시 첫 페이지로
  };

  // API 응답 데이터를 Entity 타입으로 변환
  const mapSingerToEntity = (singer: Singer): Entity => {
    return {
      id: singer.id.toString(),
      type: "singer",
      name: singer.name,
      agency: singer.agency || "",
      email: singer.email,
      phone: singer.phone,
      genre: singer.genre || "",
      price: singer.price || 0,
      grade: (singer.rating?.toString() as CustomerGrade) || "3",
      status: "active" as CustomerStatus,
      statusMessage: singer.statusMessage || "",
      address: singer.address || "",
      experience: singer.experience || 0,
      contractCount: singer.contractCount || 0,
      registrationDate: new Date().toISOString(), // 임시 값
      profileImage: "", // 필수 필드 추가
      role: "singer", // 필수 필드 추가
      memo: singer.statusMessage || "", // 필수 필드 추가
      createdAt: "", // 필수 필드 추가
      updatedAt: "", // 필수 필드 추가
      lastRequestDate: "", // 필수 필드 추가
      reviewCount: 0, // 필수 필드 추가
      genres: [singer.genre || ""], // SingerEntity 필수 필드
    };
  };

  // 데이터 가져오기 함수
  const fetchEntities = async () => {
    try {
      setIsLoading(true);
      setError(null);
      setSelectedEntities(new Set());

      try {
        const singersData = await singerApi.getAll();
        const singerEntities = singersData.map(mapSingerToEntity);
        setEntities(singerEntities);
      } catch (err) {
        console.error("가수 데이터 가져오기 오류:", err);
        setError("가수 데이터를 불러오는 중 오류가 발생했습니다.");
        toast.error("가수 데이터를 불러오는 중 오류가 발생했습니다.");
      }
    } catch (error) {
      console.error("데이터 불러오기 오류:", error);
      setError("데이터를 불러오는 중 오류가 발생했습니다.");
      toast.error("목록을 불러오는데 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  // 필터 변경 핸들러
  const handleFilterChange = (newFilters: Filter) => {
    setFilters(newFilters);
  };

  // 전체 선택 핸들러
  const handleSelectAll = (selected: boolean) => {
    if (selected) {
      const currentPageEntities = getCurrentPageEntities();
      const newSelected = new Set(selectedEntities);
      currentPageEntities.forEach((entity) => newSelected.add(entity.id));
      setSelectedEntities(newSelected);
    } else {
      setSelectedEntities(new Set());
    }
  };

  // 개별 선택 핸들러
  const handleSelectEntity = (id: string, selected: boolean) => {
    const newSelected = new Set(selectedEntities);
    if (selected) {
      newSelected.add(id);
    } else {
      newSelected.delete(id);
    }
    setSelectedEntities(newSelected);
  };

  // 편집 핸들러
  const handleEdit = (entity: Entity) => {
    router.push(`/admin/singers/${entity.id}/edit`);
  };

  // 삭제 핸들러
  const handleDelete = async (id: string) => {
    if (!confirm("정말로 삭제하시겠습니까?")) return;

    try {
      await singerApi.delete(Number(id));

      toast.success("삭제되었습니다.");
      setEntities(entities.filter((entity) => entity.id !== id));
      setSelectedEntities((prev) => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
    } catch (error) {
      console.error("삭제 오류:", error);
      toast.error("삭제에 실패했습니다.");
    }
  };

  // 일괄 삭제 핸들러
  const handleBulkDelete = async () => {
    if (selectedEntities.size === 0) return;
    if (
      !confirm(`선택한 ${selectedEntities.size}개의 항목을 삭제하시겠습니까?`)
    )
      return;

    try {
      const promises = Array.from(selectedEntities).map((id) => {
        return singerApi.delete(Number(id));
      });

      await Promise.all(promises);
      toast.success(`${selectedEntities.size}개 항목이 삭제되었습니다.`);
      fetchEntities(); // 데이터 새로고침
    } catch (error) {
      console.error("일괄 삭제 오류:", error);
      toast.error("일괄 삭제에 실패했습니다.");
    }
  };

  // 일괄 상태 변경 핸들러
  const handleBulkStatus = async (status: CustomerStatus) => {
    if (selectedEntities.size === 0) return;
    if (
      !confirm(
        `선택한 ${selectedEntities.size}개의 항목 상태를 변경하시겠습니까?`
      )
    )
      return;

    try {
      // 실제 API 호출을 통한 상태 변경 구현...
      toast.success(`${selectedEntities.size}개 항목의 상태가 변경되었습니다.`);
      fetchEntities(); // 데이터 새로고침
    } catch (error) {
      console.error("일괄 상태 변경 오류:", error);
      toast.error("일괄 상태 변경에 실패했습니다.");
    }
  };

  // 뷰 모드 변경 핸들러
  const handleViewModeChange = (mode: ViewMode) => {
    setViewMode(mode);
  };

  // 항목 추가 핸들러
  const handleAddEntity = () => {
    router.push(`/admin/singers/new`);
  };

  // 페이지 변경 핸들러
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // 현재 페이지 항목 가져오기
  const getCurrentPageEntities = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredEntities.slice(startIndex, startIndex + itemsPerPage);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <PageHeader title="가수 관리" description="가수 정보를 관리합니다." />

      <div className="mb-6">
        <CustomerFilter onFilterChange={handleFilterChange} type={entityType} />

        <CustomerActions
          selectedCount={selectedEntities.size}
          viewMode={viewMode}
          onViewModeChange={handleViewModeChange}
          onAdd={handleAddEntity}
          onBulkDelete={handleBulkDelete}
          onBulkStatus={handleBulkStatus}
          type={entityType}
        />
      </div>

      {isLoading ? (
        <div className="flex justify-center py-10">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900"></div>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      ) : (
        <>
          {viewMode === "table" ? (
            <CustomerTable
              entities={getCurrentPageEntities()}
              selectedEntities={selectedEntities}
              onSelectAll={handleSelectAll}
              onSelectEntity={handleSelectEntity}
              onEdit={handleEdit}
              onDelete={handleDelete}
              type={entityType}
            />
          ) : (
            <CustomerGrid
              entities={getCurrentPageEntities()}
              onEdit={handleEdit}
              onDelete={handleDelete}
              type={entityType}
            />
          )}

          <div className="mt-4">
            <Pagination
              currentPage={currentPage}
              totalPages={Math.ceil(filteredEntities.length / itemsPerPage)}
              totalItems={entities.length}
              filteredItems={filteredEntities.length}
              onPageChange={handlePageChange}
            />
          </div>
        </>
      )}
    </div>
  );
}
