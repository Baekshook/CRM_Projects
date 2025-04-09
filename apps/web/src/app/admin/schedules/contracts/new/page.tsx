"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import ClientOnly from "@/components/common/ClientOnly";
import dynamic from "next/dynamic";
import { Contract, Schedule } from "@/types/scheduleTypes";
import { createContract, getAllSchedules } from "@/services/schedulesApi";

// 동적으로 컴포넌트 로드
const NewContractForm = dynamic(
  () => import("@/components/contracts/NewContractForm"),
  {
    ssr: false,
    loading: () => (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div
            className="spinner-border inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent"
            role="status"
          >
            <span className="sr-only">로딩중...</span>
          </div>
          <p className="mt-2 text-gray-600">계약 양식을 불러오는 중...</p>
        </div>
      </div>
    ),
  }
);

export default function NewContractPage() {
  return (
    <div className="pb-10">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">새 계약 등록</h1>
          <p className="text-gray-600 mt-1">새로운 계약 정보를 입력하세요.</p>
        </div>
      </div>

      <ClientOnly>
        <NewContractForm />
      </ClientOnly>
    </div>
  );
}
