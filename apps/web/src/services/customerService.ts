import api from "@/lib/api";

export interface Customer {
  id: string;
  name: string;
  email: string;
  company?: string;
  phone?: string;
  status: "active" | "inactive";
  grade: "신규" | "일반";
  role: "고객" | "가수";
  profileImage?: string;
  requestCount: number;
  lastRequestDate?: string;
  contractCount?: number;
  reviewCount?: number;
  registrationDate: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CustomerFilters {
  search?: string;
  status?: string;
  grade?: string;
  role?: string;
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
    if (process.env.NODE_ENV === "development") {
      const DUMMY_CUSTOMERS: Customer[] = [
        {
          id: "CUST-001",
          name: "김민수",
          email: "minsu.kim@example.com",
          company: "(주)이벤트 플래닝",
          phone: "010-1234-5678",
          status: "active",
          grade: "일반",
          role: "고객",
          profileImage: "https://randomuser.me/api/portraits/men/1.jpg",
          requestCount: 5,
          lastRequestDate: "2023-03-15",
          contractCount: 3,
          reviewCount: 2,
          registrationDate: "2023-01-10",
        },
        {
          id: "CUST-002",
          name: "이지영",
          email: "jiyoung.lee@example.com",
          company: "웨딩 홀 A",
          phone: "010-2345-6789",
          status: "active",
          grade: "신규",
          role: "고객",
          profileImage: "https://randomuser.me/api/portraits/women/2.jpg",
          requestCount: 1,
          lastRequestDate: "2023-03-01",
          contractCount: 0,
          reviewCount: 0,
          registrationDate: "2023-01-15",
        },
        {
          id: "CUST-003",
          name: "박준호",
          email: "junho.park@example.com",
          company: "대학 축제 위원회",
          phone: "010-3456-7890",
          status: "active",
          grade: "신규",
          role: "고객",
          profileImage: "https://randomuser.me/api/portraits/men/3.jpg",
          requestCount: 1,
          lastRequestDate: "2023-02-28",
          contractCount: 0,
          reviewCount: 0,
          registrationDate: "2023-02-10",
        },
        {
          id: "CUST-004",
          name: "최유진",
          email: "yujin.choi@example.com",
          company: "(주)테크놀로지",
          phone: "010-4567-8901",
          status: "active",
          grade: "일반",
          role: "고객",
          profileImage: "https://randomuser.me/api/portraits/women/4.jpg",
          requestCount: 3,
          lastRequestDate: "2023-03-10",
          contractCount: 2,
          reviewCount: 1,
          registrationDate: "2023-02-20",
        },
        {
          id: "CUST-005",
          name: "정승현",
          email: "seunghyun.jung@example.com",
          company: "OO시 문화재단",
          phone: "010-5678-9012",
          status: "inactive",
          grade: "신규",
          role: "고객",
          profileImage: "https://randomuser.me/api/portraits/men/5.jpg",
          requestCount: 1,
          lastRequestDate: "2023-02-28",
          contractCount: 0,
          reviewCount: 0,
          registrationDate: "2023-01-25",
        },
        {
          id: "CUST-006",
          name: "권나은",
          email: "naeun.kwon@example.com",
          company: "(주)코스메틱 브랜드",
          phone: "010-6789-0123",
          status: "active",
          grade: "일반",
          role: "고객",
          profileImage: "https://randomuser.me/api/portraits/women/6.jpg",
          requestCount: 4,
          lastRequestDate: "2023-03-15",
          contractCount: 2,
          reviewCount: 2,
          registrationDate: "2023-01-05",
        },
      ];

      let filteredCustomers = [...DUMMY_CUSTOMERS];

      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        filteredCustomers = filteredCustomers.filter(
          (customer) =>
            customer.name.toLowerCase().includes(searchLower) ||
            customer.email.toLowerCase().includes(searchLower) ||
            (customer.company &&
              customer.company.toLowerCase().includes(searchLower))
        );
      }

      if (filters.status) {
        filteredCustomers = filteredCustomers.filter(
          (customer) => customer.status === filters.status
        );
      }

      if (filters.grade) {
        filteredCustomers = filteredCustomers.filter(
          (customer) => customer.grade === filters.grade
        );
      }

      if (filters.role) {
        filteredCustomers = filteredCustomers.filter(
          (customer) => customer.role === filters.role
        );
      }

      const page = filters.page || 1;
      const limit = filters.limit || 10;
      const total = filteredCustomers.length;
      const totalPages = Math.ceil(total / limit);
      const offset = (page - 1) * limit;
      const items = filteredCustomers.slice(offset, offset + limit);

      return {
        items,
        total,
        page,
        limit,
        totalPages,
      };
    }

    const response = await api.get("/customers", { params: filters });
    return response.data;
  }

  async getCustomer(id: string): Promise<Customer> {
    const response = await api.get(`/customers/${id}`);
    return response.data;
  }

  async createCustomer(
    customerData: Omit<
      Customer,
      | "id"
      | "registrationDate"
      | "createdAt"
      | "updatedAt"
      | "requestCount"
      | "lastRequestDate"
    >
  ): Promise<Customer> {
    const response = await api.post("/customers", customerData);
    return response.data;
  }

  async updateCustomer(
    id: string,
    customerData: Partial<Customer>
  ): Promise<Customer> {
    const response = await api.patch(`/customers/${id}`, customerData);
    return response.data;
  }

  async deleteCustomer(id: string): Promise<void> {
    await api.delete(`/customers/${id}`);
  }

  async bulkDeleteCustomer(ids: string[]): Promise<void> {
    await api.post("/customers/bulk-delete", { ids });
  }

  async bulkUpdateStatus(
    ids: string[],
    status: "active" | "inactive"
  ): Promise<void> {
    await api.post("/customers/bulk-status", { ids, status });
  }
}

export default new CustomerService();
