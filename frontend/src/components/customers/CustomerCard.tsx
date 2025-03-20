"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  CustomerCardProps,
  Entity,
  CustomerEntity,
  SingerEntity,
} from "./types";
import { formatDate } from "../../utils/dateUtils";

export default function CustomerCard({
  entity,
  onEdit,
  onDelete,
  type,
}: CustomerCardProps) {
  const [imageError, setImageError] = useState(false);

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

  const renderAvatar = () => {
    if (entity.profileImage && !imageError) {
      return (
        <div className="h-16 w-16 rounded-full bg-gray-200 relative overflow-hidden">
          <Image
            src={entity.profileImage}
            alt={entity.name}
            fill
            className="object-cover"
            onError={() => setImageError(true)}
          />
        </div>
      );
    } else {
      // 이미지가 없거나 오류가 발생한 경우 이니셜 표시
      return (
        <div className="h-16 w-16 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center">
          <span className="text-white text-xl font-bold">
            {entity.name.charAt(0)}
          </span>
        </div>
      );
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="p-4 relative">
        <div className="absolute top-2 right-2 flex gap-1">
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeColor(
              entity.type
            )}`}
          >
            {entity.type === "customer" ? "고객" : "가수"}
          </span>
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
              entity.status
            )}`}
          >
            {entity.status === "active" ? "활성" : "비활성"}
          </span>
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getGradeColor(
              entity.grade
            )}`}
          >
            {getGradeText(entity.grade)}
          </span>
        </div>

        <div className="flex items-center space-x-4 mb-4 mt-2">
          <div className="flex-shrink-0">{renderAvatar()}</div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">{entity.name}</h3>
            <div className="flex items-center text-sm text-gray-500">
              <svg
                className="w-4 h-4 mr-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                />
              </svg>
              {entity.phone}
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 py-3 bg-gray-50 border-t border-gray-100">
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col">
            <p className="text-xs text-gray-500 mb-1">이메일</p>
            <p
              className="text-sm font-medium text-gray-900 truncate"
              title={entity.email}
            >
              {entity.email}
            </p>
          </div>
          <div className="flex flex-col">
            <p className="text-xs text-gray-500 mb-1">
              {isCustomer(entity) ? "회사" : "소속사"}
            </p>
            <p
              className="text-sm font-medium text-gray-900 truncate"
              title={isCustomer(entity) ? entity.company : entity.agency}
            >
              {isCustomer(entity) ? entity.company : entity.agency}
            </p>
          </div>
          <div className="flex flex-col">
            <p className="text-xs text-gray-500 mb-1">
              {isCustomer(entity) ? "부서" : "장르"}
            </p>
            <p className="text-sm font-medium text-gray-900">
              {isCustomer(entity) ? entity.department || "-" : entity.genre}
            </p>
          </div>
          <div className="flex flex-col">
            <p className="text-xs text-gray-500 mb-1">계약 수</p>
            <p className="text-sm font-medium text-gray-900">
              {entity.contractCount}
            </p>
          </div>
          <div className="flex flex-col">
            <p className="text-xs text-gray-500 mb-1">마지막 요청일</p>
            <p className="text-sm font-medium text-gray-900">
              {formatDate(entity.lastRequestDate)}
            </p>
          </div>
          <div className="flex flex-col">
            <p className="text-xs text-gray-500 mb-1">등록일</p>
            <p className="text-sm font-medium text-gray-900">
              {formatDate(entity.registrationDate)}
            </p>
          </div>
        </div>
      </div>

      {entity.statusMessage && (
        <div className="px-4 py-2 bg-gray-50 border-t border-gray-100">
          <p className="text-xs text-gray-500 mb-1">상태 메시지</p>
          <p className="text-sm text-gray-600 italic">{entity.statusMessage}</p>
        </div>
      )}

      <div className="px-4 py-3 bg-white border-t border-gray-100 flex justify-end space-x-3">
        <button
          onClick={() => onEdit(entity)}
          className="inline-flex items-center px-3 py-1.5 text-sm rounded-md text-orange-600 hover:bg-orange-50"
        >
          <svg
            className="w-4 h-4 mr-1"
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
          수정
        </button>
        <button
          onClick={() => onDelete(entity.id)}
          className="inline-flex items-center px-3 py-1.5 text-sm rounded-md text-red-600 hover:bg-red-50"
        >
          <svg
            className="w-4 h-4 mr-1"
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
          삭제
        </button>
        <Link
          href={`/${type}s/${entity.id}`}
          className="inline-flex items-center px-3 py-1.5 text-sm rounded-md text-blue-600 hover:bg-blue-50"
        >
          <svg
            className="w-4 h-4 mr-1"
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
          상세
        </Link>
      </div>
    </div>
  );
}
