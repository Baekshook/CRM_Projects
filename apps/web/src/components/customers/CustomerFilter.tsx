"use client";
import React, { useState } from "react";
import { CustomerFilters, EntityType, CustomerFilterProps } from "./types";

const CustomerFilter: React.FC<CustomerFilterProps> = ({
  onFilterChange,
  type,
}) => {
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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onFilterChange(filters);
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <form onSubmit={handleSearch} className="space-y-4">
        <div className="flex flex-wrap gap-4">
          <div className="w-full md:w-1/3 lg:w-1/4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              검색
            </label>
            <input
              type="text"
              name="search"
              value={filters.search}
              onChange={handleChange}
              placeholder="이름, 이메일, 회사/소속사"
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-orange-500"
            />
          </div>

          <div className="w-full md:w-1/4 lg:w-1/6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              상태
            </label>
            <select
              name="status"
              value={filters.status}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-orange-500"
            >
              <option value="all">전체</option>
              <option value="active">활성</option>
              <option value="inactive">비활성</option>
            </select>
          </div>

          <div className="w-full md:w-1/4 lg:w-1/6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              등급
            </label>
            <select
              name="grade"
              value={filters.grade}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-orange-500"
            >
              <option value="all">전체</option>
              <option value="1">1등급</option>
              <option value="2">2등급</option>
              <option value="3">3등급</option>
              <option value="4">4등급</option>
              <option value="5">5등급</option>
            </select>
          </div>

          <div className="w-full md:w-1/4 lg:w-1/6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              구분
            </label>
            <select
              name="role"
              value={filters.role}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-orange-500"
            >
              <option value="all">전체</option>
              <option value="customer">고객</option>
              <option value="singer">가수</option>
            </select>
          </div>

          <div className="w-full md:w-1/3 lg:w-1/5">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              정렬
            </label>
            <div className="flex space-x-2">
              <select
                name="sortBy"
                value={filters.sortBy}
                onChange={handleChange}
                className="w-2/3 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-orange-500"
              >
                <option value="name">이름</option>
                <option value="registrationDate">등록일</option>
                <option value="contractCount">계약수</option>
                <option value="grade">등급</option>
              </select>
              <select
                name="sortOrder"
                value={filters.sortOrder}
                onChange={handleChange}
                className="w-1/3 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-orange-500"
              >
                <option value="asc">↑</option>
                <option value="desc">↓</option>
              </select>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
          >
            검색
          </button>
        </div>
      </form>
    </div>
  );
};

export default CustomerFilter;
