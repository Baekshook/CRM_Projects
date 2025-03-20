"use client";
import { useState } from "react";
import { CustomerFilters, EntityType } from "./types";

interface CustomerFilterProps {
  onFilterChange: (filters: CustomerFilters) => void;
  type: EntityType;
}

export default function CustomerFilter({
  onFilterChange,
  type,
}: CustomerFilterProps) {
  const [filters, setFilters] = useState<CustomerFilters>({
    search: "",
    status: "all",
    grade: "all",
    role: "all",
    sortBy: "name",
    sortOrder: "asc",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    const newFilters = { ...filters, [name]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label
            htmlFor="search"
            className="block text-sm font-medium text-gray-700"
          >
            검색
          </label>
          <input
            type="text"
            id="search"
            name="search"
            value={filters.search}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm"
            placeholder="이름, 이메일, 전화번호..."
          />
        </div>

        <div>
          <label
            htmlFor="status"
            className="block text-sm font-medium text-gray-700"
          >
            상태
          </label>
          <select
            id="status"
            name="status"
            value={filters.status}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm"
          >
            <option value="all">전체</option>
            <option value="active">활성</option>
            <option value="inactive">비활성</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="grade"
            className="block text-sm font-medium text-gray-700"
          >
            등급
          </label>
          <select
            id="grade"
            name="grade"
            value={filters.grade}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm"
          >
            <option value="all">전체</option>
            <option value={1}>1등급</option>
            <option value={2}>2등급</option>
            <option value={3}>3등급</option>
            <option value={4}>4등급</option>
            <option value={5}>5등급</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="role"
            className="block text-sm font-medium text-gray-700"
          >
            유형
          </label>
          <select
            id="role"
            name="role"
            value={filters.role}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm"
          >
            <option value="all">전체</option>
            <option value="customer">고객</option>
            <option value="singer">가수</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="sortBy"
            className="block text-sm font-medium text-gray-700"
          >
            정렬 기준
          </label>
          <select
            id="sortBy"
            name="sortBy"
            value={filters.sortBy}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm"
          >
            <option value="name">이름</option>
            <option value="email">이메일</option>
            <option value="status">상태</option>
            <option value="grade">등급</option>
            <option value="contractCount">계약 수</option>
            <option value="lastRequestDate">마지막 요청일</option>
            <option value="registrationDate">등록일</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="sortOrder"
            className="block text-sm font-medium text-gray-700"
          >
            정렬 순서
          </label>
          <select
            id="sortOrder"
            name="sortOrder"
            value={filters.sortOrder}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm"
          >
            <option value="asc">오름차순</option>
            <option value="desc">내림차순</option>
          </select>
        </div>
      </div>
    </div>
  );
}
