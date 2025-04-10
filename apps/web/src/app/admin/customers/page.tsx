"use client";

import { useState, useEffect, useMemo, Suspense } from "react";
import { useRouter } from "next/navigation";
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
import ClientOnly from "@/components/common/ClientOnly";
import dynamic from "next/dynamic";

// 클라이언트 컴포넌트로 분리
const CustomerPageContent = dynamic(
  () => import("@/components/customers/CustomerPageContent"),
  { ssr: false }
);

export default function CustomersPage() {
  return (
    <ClientOnly>
      <CustomerPageContent />
    </ClientOnly>
  );
}
