"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  CustomerTableProps,
  Entity,
  CustomerEntity,
  SingerEntity,
  SortableField,
} from "./types";
import { formatDate } from "../../utils/dateUtils";

export default function CustomerTable({
  entities = [],
  selectedEntities = [],
  onSelectAll,
  onSelectEntity,
  onEdit,
  onDelete,
  type,
}: CustomerTableProps) {
  const [sortField, setSortField] = useState<SortableField>("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  const handleSort = (field: SortableField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const getStatusColor = (status: string) => {
    return status === "active"
      ? "bg-green-100 text-green-800"
      : "bg-red-100 text-red-800";
  };

  const getGradeColor = (grade: number) => {
    switch (grade) {
      case 1:
        return "bg-gray-100 text-gray-800";
      case 2:
        return "bg-blue-100 text-blue-800";
      case 3:
        return "bg-green-100 text-green-800";
      case 4:
        return "bg-purple-100 text-purple-800";
      case 5:
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getGradeText = (grade: number) => {
    switch (grade) {
      case 1:
        return "1등급 (최하)";
      case 2:
        return "2등급 (하)";
      case 3:
        return "3등급 (중)";
      case 4:
        return "4등급 (상)";
      case 5:
        return "5등급 (최상)";
      default:
        return `${grade}등급`;
    }
  };

  const getTypeColor = (type: string) => {
    return type === "customer"
      ? "bg-indigo-100 text-indigo-800"
      : "bg-purple-100 text-purple-800";
  };

  const isCustomer = (entity: Entity): entity is CustomerEntity => {
    return entity.type === "customer";
  };

  const isSinger = (entity: Entity): entity is SingerEntity => {
    return entity.type === "singer";
  };

  const handleImageError = (id: string) => {
    setImageErrors((prev) => ({ ...prev, [id]: true }));
  };

  const renderAvatar = (entity: Entity) => {
    if (entity.profileImage && !imageErrors[entity.id]) {
      return (
        <div className="h-10 w-10 rounded-full bg-gray-200 relative overflow-hidden">
          <Image
            src={entity.profileImage}
            alt={entity.name}
            fill
            className="object-cover"
            onError={() => handleImageError(entity.id)}
          />
        </div>
      );
    } else {
      // 이미지가 없거나 오류가 발생한 경우 이니셜 표시
      return (
        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center">
          <span className="text-white font-bold">{entity.name.charAt(0)}</span>
        </div>
      );
    }
  };

  const sortedEntities = [...entities].sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];

    if (typeof aValue === "string" && typeof bValue === "string") {
      return sortDirection === "asc"
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }

    if (typeof aValue === "number" && typeof bValue === "number") {
      return sortDirection === "asc" ? aValue - bValue : bValue - aValue;
    }

    if (sortField === "lastRequestDate" || sortField === "registrationDate") {
      const aDate = new Date(aValue as string);
      const bDate = new Date(bValue as string);
      return sortDirection === "asc"
        ? aDate.getTime() - bDate.getTime()
        : bDate.getTime() - aDate.getTime();
    }

    return 0;
  });

  return (
    <div className="overflow-x-auto rounded-lg shadow">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left">
              <input
                type="checkbox"
                className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                checked={
                  selectedEntities.length === entities.length &&
                  entities.length > 0
                }
                onChange={(e) => onSelectAll(e.target.checked)}
              />
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer group hover:bg-gray-100"
              onClick={() => handleSort("name")}
            >
              <div className="flex items-center">
                이름
                {sortField === "name" && (
                  <span className="ml-1">
                    {sortDirection === "asc" ? "↑" : "↓"}
                  </span>
                )}
              </div>
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              유형
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              {type === "customer" ? "회사" : "소속사"}
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer group hover:bg-gray-100"
              onClick={() => handleSort("email")}
            >
              <div className="flex items-center">
                이메일
                {sortField === "email" && (
                  <span className="ml-1">
                    {sortDirection === "asc" ? "↑" : "↓"}
                  </span>
                )}
              </div>
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer group hover:bg-gray-100"
              onClick={() => handleSort("status")}
            >
              <div className="flex items-center">
                상태
                {sortField === "status" && (
                  <span className="ml-1">
                    {sortDirection === "asc" ? "↑" : "↓"}
                  </span>
                )}
              </div>
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer group hover:bg-gray-100"
              onClick={() => handleSort("grade")}
            >
              <div className="flex items-center">
                등급
                {sortField === "grade" && (
                  <span className="ml-1">
                    {sortDirection === "asc" ? "↑" : "↓"}
                  </span>
                )}
              </div>
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer group hover:bg-gray-100"
              onClick={() => handleSort("contractCount")}
            >
              <div className="flex items-center">
                계약 수
                {sortField === "contractCount" && (
                  <span className="ml-1">
                    {sortDirection === "asc" ? "↑" : "↓"}
                  </span>
                )}
              </div>
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer group hover:bg-gray-100"
              onClick={() => handleSort("lastRequestDate")}
            >
              <div className="flex items-center">
                마지막 요청일
                {sortField === "lastRequestDate" && (
                  <span className="ml-1">
                    {sortDirection === "asc" ? "↑" : "↓"}
                  </span>
                )}
              </div>
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer group hover:bg-gray-100"
              onClick={() => handleSort("registrationDate")}
            >
              <div className="flex items-center">
                등록일
                {sortField === "registrationDate" && (
                  <span className="ml-1">
                    {sortDirection === "asc" ? "↑" : "↓"}
                  </span>
                )}
              </div>
            </th>
            <th scope="col" className="relative px-6 py-3">
              <span className="sr-only">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {sortedEntities.map((entity) => (
            <tr key={entity.id} className="hover:bg-gray-50 transition-colors">
              <td className="px-6 py-4 whitespace-nowrap">
                <input
                  type="checkbox"
                  className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                  checked={selectedEntities.includes(entity.id)}
                  onChange={() => onSelectEntity(entity.id)}
                />
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="flex-shrink-0">{renderAvatar(entity)}</div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900">
                      {entity.name}
                    </div>
                    <div className="text-sm text-gray-500">{entity.phone}</div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeColor(
                    entity.type
                  )}`}
                >
                  {entity.type === "customer" ? "고객" : "가수"}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">
                  {isCustomer(entity) ? entity.company : entity.agency}
                </div>
                <div className="text-sm text-gray-500">
                  {isCustomer(entity) ? entity.department || "-" : entity.genre}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">{entity.email}</div>
                {entity.statusMessage && (
                  <div className="text-xs text-gray-500 mt-1 italic">
                    {entity.statusMessage}
                  </div>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                    entity.status
                  )}`}
                >
                  {entity.status === "active" ? "활성" : "비활성"}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getGradeColor(
                    entity.grade
                  )}`}
                >
                  {getGradeText(entity.grade)}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {entity.contractCount}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {formatDate(entity.lastRequestDate)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {formatDate(entity.registrationDate)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div className="flex items-center justify-end space-x-3">
                  <button
                    onClick={() => onEdit(entity)}
                    className="text-orange-600 hover:text-orange-900"
                    title="수정"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                  </button>
                  <button
                    onClick={() => onDelete(entity.id)}
                    className="text-red-600 hover:text-red-900"
                    title="삭제"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                  <Link
                    href={`/${type}s/${entity.id}`}
                    className="text-blue-600 hover:text-blue-900"
                    title="상세"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  </Link>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
