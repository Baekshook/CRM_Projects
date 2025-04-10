"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
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
  SortBy,
} from "@/components/customers/types";
import { toast } from "react-hot-toast";
import customerApi, { Customer } from "@/services/customerApi";
import singerApi from "@/services/singerApi";
import type { Singer } from "@/lib/api/singerApi";
import { formatDate } from "@/utils/dateUtils";
import { getApiPath } from "@/services/apiConfig";

export default function CustomerPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // 상태 관리
  const [viewMode, setViewMode] = useState<ViewMode>("table");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [customers, setCustomers] = useState<any[]>([]);
  const [singers, setSingers] = useState<any[]>([]);
  const [selectedEntityIds, setSelectedEntityIds] = useState<string[]>([]);
  const [entityType, setEntityType] = useState<"customer" | "singer">(
    "customer"
  );

  // 페이지네이션
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // 필터 - useSearchParams는 클라이언트 컴포넌트에서만 사용해야 함
  const [filters, setFilters] = useState<Filter>(() => {
    // 초기값은 상수로 설정하고, useEffect에서 searchParams 값으로 업데이트
    return {
      searchTerm: "",
      status: "" as "" | CustomerStatus,
      grade: "" as "" | CustomerGrade,
      sortBy: "name" as SortBy,
      order: "asc" as "asc" | "desc",
    };
  });

  // 마운트 후에 SearchParams 반영
  useEffect(() => {
    if (searchParams) {
      setFilters({
        searchTerm: searchParams.get("search") || "",
        status: (searchParams.get("status") || "") as "" | CustomerStatus,
        grade: (searchParams.get("grade") || "") as "" | CustomerGrade,
        sortBy: (searchParams.get("sortBy") as SortBy) || "name",
        order: (searchParams.get("sortOrder") as "asc" | "desc") || "asc",
      });
    }
  }, [searchParams]);

  // 데이터 로딩
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // 실제 데이터 로드 시도
        try {
          console.log("API 데이터 로드 시작");
          // 목록 데이터 가져오기
          const [apiCustomers, apiSingers] = await Promise.all([
            customerApi.getAll(),
            singerApi.getAll(),
          ]);
          console.log("API 데이터 로드 완료:", {
            고객수: apiCustomers.length,
            가수수: apiSingers.length,
          });

          // 고객 데이터 처리
          const formattedCustomers = apiCustomers.map((customer: any) => {
            // 이미지 URL 처리 - getApiPath 유틸리티 사용
            const profileImage = customer.profileImage
              ? getApiPath(`/files/${customer.profileImage}/data`)
              : null;

            return {
              ...customer,
              tableType: "customer",
              type: "customer",
              profileImage: profileImage,
              lastRequestDate: formatDate(customer.lastRequestDate),
              registrationDate: formatDate(customer.registrationDate),
            };
          });
          setCustomers(formattedCustomers);

          // 가수 데이터 처리
          const formattedSingers = apiSingers.map((singer: any) => {
            // 이미지 URL 처리 - getApiPath 유틸리티 사용
            const profileImage = singer.profileImage
              ? getApiPath(`/files/${singer.profileImage}/data`)
              : null;

            return {
              ...singer,
              tableType: "singer",
              type: "singer",
              profileImage: profileImage,
              lastRequestDate: formatDate(singer.lastRequestDate),
              registrationDate: formatDate(singer.registrationDate),
            };
          });
          setSingers(formattedSingers);
        } catch (apiError) {
          console.error("API 데이터 로딩 실패:", apiError);
          toast.error("서버 연결에 실패했습니다.");
          throw apiError;
        }
      } catch (error) {
        console.error("데이터 로딩 중 오류 발생:", error);
        setError("데이터를 불러오는 데 실패했습니다.");
        toast.error("데이터 로딩 중 오류가 발생했습니다.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // 필터링 및 정렬된 엔티티
  const filteredEntities = useMemo(() => {
    // 표시할 엔티티 타입에 따라 선택
    const entities = entityType === "customer" ? customers : singers;

    // 검색 및 필터링
    return entities
      .filter((entity) => {
        // 검색어 필터링
        if (
          filters.searchTerm &&
          !entity.name
            .toLowerCase()
            .includes(filters.searchTerm.toLowerCase()) &&
          !(
            (entityType === "customer" &&
              entity.company
                ?.toLowerCase()
                .includes(filters.searchTerm.toLowerCase())) ||
            (entityType === "singer" &&
              entity.agency
                ?.toLowerCase()
                .includes(filters.searchTerm.toLowerCase()))
          )
        ) {
          return false;
        }

        // 상태 필터링
        if (filters.status && entity.status !== filters.status) {
          return false;
        }

        // 등급 필터링 (고객과 가수에 따라 다른 필드 사용)
        if (filters.grade) {
          if (entityType === "customer" && entity.grade !== filters.grade) {
            return false;
          } else if (
            entityType === "singer" &&
            entity.rating !== parseInt(filters.grade)
          ) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        // 정렬 로직
        const sortField = filters.sortBy as string;
        const sortOrder = filters.order === "asc" ? 1 : -1;

        if (sortField === "name") {
          return sortOrder * a.name.localeCompare(b.name);
        } else if (sortField === "company" || sortField === "agency") {
          const aCompany = entityType === "customer" ? a.company : a.agency;
          const bCompany = entityType === "customer" ? b.company : b.agency;
          return sortOrder * (aCompany || "").localeCompare(bCompany || "");
        } else if (sortField === "registrationDate") {
          return (
            sortOrder *
            (new Date(a.registrationDate).getTime() -
              new Date(b.registrationDate).getTime())
          );
        } else if (sortField === "lastRequestDate") {
          if (!a.lastRequestDate) return sortOrder;
          if (!b.lastRequestDate) return -sortOrder;
          return (
            sortOrder *
            (new Date(a.lastRequestDate).getTime() -
              new Date(b.lastRequestDate).getTime())
          );
        } else if (sortField === "grade" || sortField === "rating") {
          const aGrade = Number(entityType === "customer" ? a.grade : a.rating);
          const bGrade = Number(entityType === "customer" ? b.grade : b.rating);
          return sortOrder * (aGrade - bGrade);
        } else if (sortField === "contractCount") {
          return sortOrder * ((a.contractCount || 0) - (b.contractCount || 0));
        }

        return 0;
      });
  }, [customers, singers, entityType, filters]);

  // 페이징처리된 엔티티
  const paginatedEntities = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredEntities.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredEntities, currentPage, itemsPerPage]);

  // 필터 변경 처리
  const handleFilterChange = (newFilters: Filter) => {
    setCurrentPage(1); // 필터 변경 시 첫 페이지로 이동
    setFilters(newFilters);
  };

  // 타입 변경 처리
  const handleTypeChange = (type: "customer" | "singer") => {
    setEntityType(type);
    setSelectedEntityIds([]);
    setCurrentPage(1);
  };

  // 뷰 모드 변경 처리
  const handleViewModeChange = (mode: ViewMode) => {
    setViewMode(mode);
  };

  // 선택 항목 처리
  const handleSelectAll = (isSelected: boolean) => {
    if (isSelected) {
      setSelectedEntityIds(paginatedEntities.map((entity) => entity.id));
    } else {
      setSelectedEntityIds([]);
    }
  };

  const handleSelectEntity = (entityId: string, isSelected: boolean) => {
    if (isSelected) {
      setSelectedEntityIds([...selectedEntityIds, entityId]);
    } else {
      setSelectedEntityIds(selectedEntityIds.filter((id) => id !== entityId));
    }
  };

  // 항목 삭제 처리
  const handleDelete = async (entityId: string) => {
    if (!confirm("정말로 이 항목을 삭제하시겠습니까?")) {
      return;
    }

    try {
      // 엔티티 타입에 따라 다른 API 호출
      if (entityType === "customer") {
        await customerApi.delete(entityId);
        setCustomers(customers.filter((c) => c.id !== entityId));
      } else {
        await singerApi.delete(entityId);
        setSingers(singers.filter((s) => s.id !== entityId));
      }

      // 선택된 항목에서 제거
      setSelectedEntityIds(selectedEntityIds.filter((id) => id !== entityId));
      toast.success("삭제되었습니다.");
    } catch (error) {
      console.error("삭제 중 오류 발생:", error);
      toast.error("삭제 중 오류가 발생했습니다.");
    }
  };

  // 일괄 삭제 처리
  const handleBulkDelete = async () => {
    if (!selectedEntityIds.length) {
      toast.error("선택된 항목이 없습니다.");
      return;
    }

    if (
      !confirm(
        `선택한 ${selectedEntityIds.length}개 항목을 정말로 삭제하시겠습니까?`
      )
    ) {
      return;
    }

    try {
      // 여러 항목 삭제 요청
      const deletePromises = selectedEntityIds.map((id) => {
        if (entityType === "customer") {
          return customerApi.delete(id);
        } else {
          return singerApi.delete(id);
        }
      });

      await Promise.all(deletePromises);

      // 상태 업데이트
      if (entityType === "customer") {
        setCustomers(
          customers.filter((c) => !selectedEntityIds.includes(c.id))
        );
      } else {
        setSingers(singers.filter((s) => !selectedEntityIds.includes(s.id)));
      }

      setSelectedEntityIds([]);
      toast.success(`${selectedEntityIds.length}개 항목이 삭제되었습니다.`);
    } catch (error) {
      console.error("일괄 삭제 중 오류 발생:", error);
      toast.error("일괄 삭제 중 오류가 발생했습니다.");
    }
  };

  // 일괄 상태 변경 처리
  const handleBulkStatus = async (status: CustomerStatus) => {
    if (!selectedEntityIds.length) {
      toast.error("선택된 항목이 없습니다.");
      return;
    }

    try {
      // 여러 항목 상태 변경 요청
      const updatePromises = selectedEntityIds.map((id) => {
        if (entityType === "customer") {
          return customerApi.updateStatus(id, status);
        } else {
          // 가수 API에 updateStatus가 없을 경우 update를 사용
          return singerApi.update(id, { status });
        }
      });

      await Promise.all(updatePromises);

      // 상태 업데이트
      if (entityType === "customer") {
        setCustomers(
          customers.map((c) =>
            selectedEntityIds.includes(c.id) ? { ...c, status } : c
          )
        );
      } else {
        setSingers(
          singers.map((s) =>
            selectedEntityIds.includes(s.id) ? { ...s, status } : s
          )
        );
      }

      toast.success(
        `${selectedEntityIds.length}개 항목의 상태가 변경되었습니다.`
      );
    } catch (error) {
      console.error("일괄 상태 변경 중 오류 발생:", error);
      toast.error("일괄 상태 변경 중 오류가 발생했습니다.");
    }
  };

  // 로딩 중 상태 표시
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  // 오류 상태 표시
  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 페이지 헤더 */}
      <div className="flex flex-wrap justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">
          {entityType === "customer" ? "고객 관리" : "가수 관리"}
        </h1>
        <div className="flex space-x-2">
          <button
            onClick={() => handleTypeChange("customer")}
            className={`px-4 py-2 rounded-md ${
              entityType === "customer"
                ? "bg-orange-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            고객
          </button>
          <button
            onClick={() => handleTypeChange("singer")}
            className={`px-4 py-2 rounded-md ${
              entityType === "singer"
                ? "bg-orange-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            가수
          </button>
        </div>
      </div>

      {/* 필터 및 액션 */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="mb-6">
          <CustomerFilter
            onFilterChange={handleFilterChange}
            type={entityType}
          />
        </div>
        <CustomerActions
          selectedCount={selectedEntityIds.length}
          viewMode={viewMode}
          onViewModeChange={handleViewModeChange}
          onAdd={() => router.push("/admin/customers/new")}
          onBulkDelete={handleBulkDelete}
          onBulkStatus={handleBulkStatus}
          type={entityType}
        />
      </div>

      {/* 고객 목록 */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {viewMode === "table" ? (
          <CustomerTable
            entities={paginatedEntities}
            selectedEntities={new Set(selectedEntityIds)}
            onSelectAll={handleSelectAll}
            onSelectEntity={handleSelectEntity}
            onEdit={(id) => {
              console.log("Edit customer/singer with ID:", id);
              router.push(`/admin/customers/${id}/edit`);
            }}
            onDelete={handleDelete}
            type={entityType}
          />
        ) : (
          <CustomerGrid
            entities={paginatedEntities}
            onView={(id) => {
              console.log("View customer/singer with ID:", id);
              router.push(`/admin/customers/${id}`);
            }}
            onEdit={(id) => {
              console.log("Edit customer/singer with ID:", id);
              router.push(`/admin/customers/${id}/edit`);
            }}
            onDelete={handleDelete}
            type={entityType}
          />
        )}

        {/* 페이지네이션 */}
        <div className="p-4 border-t border-gray-200">
          <Pagination
            currentPage={currentPage}
            totalPages={Math.ceil(filteredEntities.length / itemsPerPage)}
            totalItems={
              entityType === "customer" ? customers.length : singers.length
            }
            filteredItems={filteredEntities.length}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>
    </div>
  );
}
