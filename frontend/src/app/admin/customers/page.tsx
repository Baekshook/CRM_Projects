"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import PageHeader from "@/components/common/PageHeader";
import CustomerFilter from "@/components/customers/CustomerFilter";
import CustomerActions from "@/components/customers/CustomerActions";
import CustomerTable from "@/components/customers/CustomerTable";
import Pagination from "@/components/common/Pagination";
import { Customer } from "@/components/customers/types";
import customerService, { CustomerFilters } from "@/services/customerService";
import { toast } from "react-hot-toast";

export default function CustomersPage() {
  const router = useRouter();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [selectedCustomers, setSelectedCustomers] = useState<number[]>([]);
  const [filters, setFilters] = useState<CustomerFilters>({
    page: 1,
    limit: 10,
  });
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchCustomers();
  }, [filters]);

  const fetchCustomers = async () => {
    try {
      setIsLoading(true);
      const response = await customerService.getCustomers(filters);
      setCustomers(response.items);
      setTotalPages(response.totalPages);
    } catch (error) {
      toast.error("고객 목록을 불러오는데 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (searchTerm: string) => {
    setFilters((prev) => ({ ...prev, search: searchTerm, page: 1 }));
  };

  const handleFilterChange = (newFilters: Partial<CustomerFilters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters, page: 1 }));
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedCustomers(customers.map((customer) => customer.id));
    } else {
      setSelectedCustomers([]);
    }
  };

  const handleSelectCustomer = (id: number) => {
    setSelectedCustomers((prev) =>
      prev.includes(id)
        ? prev.filter((customerId) => customerId !== id)
        : [...prev, id]
    );
  };

  const handleViewDetail = (id: number) => {
    router.push(`/admin/customers/${id}`);
  };

  const handleEdit = (id: number) => {
    router.push(`/admin/customers/${id}/edit`);
  };

  const handleDelete = async (id: number) => {
    if (confirm("정말로 이 고객을 삭제하시겠습니까?")) {
      try {
        await customerService.deleteCustomer(id);
        toast.success("고객이 삭제되었습니다.");
        fetchCustomers();
      } catch (error) {
        toast.error("고객 삭제에 실패했습니다.");
      }
    }
  };

  const handleBulkDelete = async () => {
    if (selectedCustomers.length === 0) {
      alert("삭제할 고객을 선택해주세요.");
      return;
    }

    if (
      confirm(`선택한 ${selectedCustomers.length}명의 고객을 삭제하시겠습니까?`)
    ) {
      try {
        await customerService.bulkDeleteCustomer(selectedCustomers);
        toast.success("선택한 고객들이 삭제되었습니다.");
        setSelectedCustomers([]);
        fetchCustomers();
      } catch (error) {
        toast.error("고객 삭제에 실패했습니다.");
      }
    }
  };

  const handleBulkStatus = async (status: "active" | "inactive") => {
    if (selectedCustomers.length === 0) {
      alert("상태를 변경할 고객을 선택해주세요.");
      return;
    }

    if (
      confirm(
        `선택한 ${selectedCustomers.length}명의 고객을 ${
          status === "active" ? "활성" : "비활성"
        } 상태로 변경하시겠습니까?`
      )
    ) {
      try {
        await customerService.bulkUpdateStatus(selectedCustomers, status);
        toast.success("선택한 고객들의 상태가 변경되었습니다.");
        setSelectedCustomers([]);
        fetchCustomers();
      } catch (error) {
        toast.error("상태 변경에 실패했습니다.");
      }
    }
  };

  const handlePageChange = (page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="고객 관리"
        description="고객 정보를 조회하고 관리할 수 있습니다."
      />

      <CustomerFilter
        filters={filters}
        onSearch={handleSearch}
        onFilterChange={handleFilterChange}
      />

      <CustomerActions
        selectedCustomers={selectedCustomers}
        onAddNewCustomer={() => router.push("/admin/customers/new")}
        onBulkDelete={handleBulkDelete}
        onBulkStatus={handleBulkStatus}
      />

      <CustomerTable
        customers={customers}
        selectedCustomers={selectedCustomers}
        selectAll={selectedCustomers.length === customers.length}
        onSelectAll={handleSelectAll}
        onSelectCustomer={handleSelectCustomer}
        onViewDetail={handleViewDetail}
        onEdit={handleEdit}
        onDelete={handleDelete}
        isLoading={isLoading}
      />

      <Pagination
        currentPage={filters.page || 1}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
}
