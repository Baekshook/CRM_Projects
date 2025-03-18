import api from "@/lib/api";

export interface Customer {
  id: number;
  name: string;
  email: string;
  company?: string;
  phone?: string;
  status: "active" | "inactive";
  grade: "일반" | "VIP" | "VVIP";
  createdAt: Date;
  updatedAt: Date;
}

export interface CustomerFilters {
  search?: string;
  status?: string;
  grade?: string;
  page?: number;
  limit?: number;
}

export interface CustomerResponse {
  items: Customer[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

class CustomerService {
  async getCustomers(filters: CustomerFilters = {}): Promise<CustomerResponse> {
    const response = await api.get("/customers", { params: filters });
    return response.data;
  }

  async getCustomer(id: number): Promise<Customer> {
    const response = await api.get(`/customers/${id}`);
    return response.data;
  }

  async createCustomer(
    customerData: Omit<Customer, "id" | "createdAt" | "updatedAt">
  ): Promise<Customer> {
    const response = await api.post("/customers", customerData);
    return response.data;
  }

  async updateCustomer(
    id: number,
    customerData: Partial<Customer>
  ): Promise<Customer> {
    const response = await api.patch(`/customers/${id}`, customerData);
    return response.data;
  }

  async deleteCustomer(id: number): Promise<void> {
    await api.delete(`/customers/${id}`);
  }

  async bulkDeleteCustomer(ids: number[]): Promise<void> {
    await api.post("/customers/bulk-delete", { ids });
  }

  async bulkUpdateStatus(
    ids: number[],
    status: "active" | "inactive"
  ): Promise<void> {
    await api.post("/customers/bulk-status", { ids, status });
  }
}

export default new CustomerService();
