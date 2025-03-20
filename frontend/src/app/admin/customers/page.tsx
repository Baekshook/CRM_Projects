"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import PageHeader from "@/components/common/PageHeader";
import CustomerFilter from "@/components/customers/CustomerFilter";
import CustomerActions from "@/components/customers/CustomerActions";
import CustomerTable from "@/components/customers/CustomerTable";
import CustomerCard from "@/components/customers/CustomerCard";
import Pagination from "@/components/common/Pagination";
import {
  Entity,
  EntityType,
  ViewMode,
  CustomerFilters,
} from "@/components/customers/types";
import { toast } from "react-hot-toast";
import {
  customers as dummyCustomers,
  singers as dummySingers,
} from "@/utils/dummyData";

export default function CustomersPage() {
  const router = useRouter();
  const [entities, setEntities] = useState<Entity[]>([]);
  const [selectedEntities, setSelectedEntities] = useState<string[]>([]);
  const [filters, setFilters] = useState<CustomerFilters>({
    search: "",
    status: "all",
    grade: "all",
    role: "all",
    sortBy: "name",
    sortOrder: "asc",
  });
  const [viewMode, setViewMode] = useState<ViewMode>("table");
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [detailEntity, setDetailEntity] = useState<Entity | null>(null);
  const [entityType, setEntityType] = useState<EntityType>("customer");

  useEffect(() => {
    fetchEntities();
  }, [filters, entityType]);

  const fetchEntities = () => {
    try {
      setIsLoading(true);
      console.log("데이터 불러오기 시작:", filters);

      // 고객 및 가수 데이터 가져오기
      let allEntities: Entity[] = [];
      if (filters.role === "all" || filters.role === "customer") {
        allEntities = [...allEntities, ...dummyCustomers];
      }
      if (filters.role === "all" || filters.role === "singer") {
        allEntities = [...allEntities, ...dummySingers];
      }

      // 필터링
      let filteredEntities = [...allEntities];

      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        filteredEntities = filteredEntities.filter(
          (entity) =>
            entity.name.toLowerCase().includes(searchLower) ||
            entity.email.toLowerCase().includes(searchLower) ||
            (entity.type === "customer" &&
              entity.company &&
              entity.company.toLowerCase().includes(searchLower)) ||
            (entity.type === "singer" &&
              entity.agency &&
              entity.agency.toLowerCase().includes(searchLower))
        );
      }

      if (filters.status !== "all") {
        filteredEntities = filteredEntities.filter(
          (entity) => entity.status === filters.status
        );
      }

      if (filters.grade !== "all") {
        filteredEntities = filteredEntities.filter(
          (entity) => entity.grade === filters.grade
        );
      }

      // 정렬
      if (filters.sortBy && filters.sortOrder) {
        filteredEntities.sort((a, b) => {
          const aValue = a[filters.sortBy as keyof Entity];
          const bValue = b[filters.sortBy as keyof Entity];

          if (typeof aValue === "string" && typeof bValue === "string") {
            return filters.sortOrder === "asc"
              ? aValue.localeCompare(bValue)
              : bValue.localeCompare(aValue);
          }

          if (typeof aValue === "number" && typeof bValue === "number") {
            return filters.sortOrder === "asc"
              ? aValue - bValue
              : bValue - aValue;
          }

          return 0;
        });
      }

      setEntities(filteredEntities);
      setTotalPages(Math.ceil(filteredEntities.length / 10));
      console.log("데이터 로드 완료:", filteredEntities.length, "개 항목");
    } catch (error) {
      console.error("데이터 불러오기 오류:", error);
      toast.error("목록을 불러오는데 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilterChange = (newFilters: CustomerFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedEntities(entities.map((entity) => entity.id));
    } else {
      setSelectedEntities([]);
    }
  };

  const handleSelectEntity = (id: string) => {
    setSelectedEntities((prev) =>
      prev.includes(id)
        ? prev.filter((entityId) => entityId !== id)
        : [...prev, id]
    );
  };

  const handleEdit = (entity: Entity) => {
    router.push(`/admin/customers/${entity.id}/edit`);
  };

  const handleDelete = (id: string) => {
    if (confirm("정말로 삭제하시겠습니까?")) {
      try {
        // 실제 환경에서는 API 호출
        const updatedEntities = entities.filter((entity) => entity.id !== id);
        setEntities(updatedEntities);

        // 선택된 항목에서도 제거
        setSelectedEntities(
          selectedEntities.filter((entityId) => entityId !== id)
        );

        toast.success("삭제되었습니다.");
      } catch (error) {
        toast.error("삭제에 실패했습니다.");
      }
    }
  };

  const handleBulkDelete = () => {
    if (
      confirm(`선택된 ${selectedEntities.length}개 항목을 삭제하시겠습니까?`)
    ) {
      try {
        // 실제 환경에서는 API 호출
        const updatedEntities = entities.filter(
          (entity) => !selectedEntities.includes(entity.id)
        );
        setEntities(updatedEntities);
        setSelectedEntities([]);
        toast.success(`${selectedEntities.length}개 항목이 삭제되었습니다.`);
      } catch (error) {
        toast.error("삭제에 실패했습니다.");
      }
    }
  };

  const handleBulkStatus = (status: "active" | "inactive") => {
    try {
      // 실제 환경에서는 API 호출
      const updatedEntities = entities.map((entity) => {
        if (selectedEntities.includes(entity.id)) {
          return { ...entity, status };
        }
        return entity;
      });

      setEntities(updatedEntities);
      toast.success(
        `${selectedEntities.length}개 항목의 상태가 변경되었습니다.`
      );
    } catch (error) {
      toast.error("상태 변경에 실패했습니다.");
    }
  };

  const handleViewModeChange = (mode: ViewMode) => {
    setViewMode(mode);
  };

  const handleAddEntity = (type: EntityType) => {
    router.push(`/admin/customers/new?type=${type}`);
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center h-64">
          <p className="text-gray-500">데이터를 불러오는 중...</p>
        </div>
      );
    }

    if (entities.length === 0) {
      return (
        <div className="flex flex-col justify-center items-center h-64 bg-white rounded-lg shadow">
          <p className="text-gray-500 mb-4">데이터가 없습니다.</p>
          <button
            onClick={() => handleAddEntity(entityType)}
            className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
          >
            {entityType === "customer" ? "고객" : "가수"} 추가
          </button>
        </div>
      );
    }

    return viewMode === "table" ? (
      <CustomerTable
        entities={entities}
        selectedEntities={selectedEntities}
        onSelectAll={handleSelectAll}
        onSelectEntity={handleSelectEntity}
        onEdit={handleEdit}
        onDelete={handleDelete}
        type={entityType}
      />
    ) : (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {entities.map((entity) => (
          <CustomerCard
            key={entity.id}
            entity={entity}
            onEdit={handleEdit}
            onDelete={handleDelete}
            type={entityType}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <PageHeader
        title="고객 및 가수 관리"
        description="고객 및 가수 정보를 조회하고 관리합니다."
      />

      <div className="mb-6">
        <CustomerFilter onFilterChange={handleFilterChange} type={entityType} />
      </div>

      <div className="mb-6">
        <CustomerActions
          selectedCount={selectedEntities.length}
          viewMode={viewMode}
          onViewModeChange={handleViewModeChange}
          onAdd={handleAddEntity}
          onBulkDelete={handleBulkDelete}
          onBulkStatus={handleBulkStatus}
          type={entityType}
        />
      </div>

      {renderContent()}

      {entities.length > 0 && (
        <div className="mt-6">
          <Pagination
            currentPage={1}
            totalPages={totalPages}
            onPageChange={() => {}}
          />
        </div>
      )}
    </div>
  );
}
