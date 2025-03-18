"use client";
import { Customer } from "./types";

interface CustomerTableProps {
  customers: Customer[];
  selectedCustomers: string[];
  selectAll: boolean;
  onSelectAll: () => void;
  onSelectCustomer: (id: string) => void;
  onViewDetail: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export const CustomerTable: React.FC<CustomerTableProps> = ({
  customers,
  selectedCustomers,
  selectAll,
  onSelectAll,
  onSelectCustomer,
  onViewDetail,
  onEdit,
  onDelete,
}) => {
  // 상태에 따른 배지 색상
  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "inactive":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // 등급에 따른 배지 색상
  const getGradeColor = (grade: string) => {
    switch (grade) {
      case "VVIP":
        return "bg-red-100 text-red-800";
      case "VIP":
        return "bg-purple-100 text-purple-800";
      case "일반":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow mb-6">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 w-10">
              <input
                type="checkbox"
                className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                checked={selectAll}
                onChange={onSelectAll}
              />
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              고객 정보
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              연락처
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              등록일
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              상태
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              등급
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              요청 내역
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              작업
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {customers.map((customer) => (
            <tr
              key={customer.id}
              className={
                selectedCustomers.includes(customer.id)
                  ? "bg-orange-50"
                  : "hover:bg-gray-50"
              }
            >
              <td className="px-6 py-4 whitespace-nowrap w-10">
                <input
                  type="checkbox"
                  className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                  checked={selectedCustomers.includes(customer.id)}
                  onChange={() => onSelectCustomer(customer.id)}
                />
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {customer.name}
                    </div>
                    <div className="text-sm text-gray-500">
                      {customer.email}
                    </div>
                    <div className="text-sm text-gray-500">
                      {customer.company}
                    </div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {customer.phone}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {customer.registrationDate}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span
                  className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                    customer.status
                  )}`}
                >
                  {customer.status === "active" ? "활성" : "비활성"}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span
                  className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getGradeColor(
                    customer.grade
                  )}`}
                >
                  {customer.grade}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <div>
                  <div>
                    {customer.requestCount > 0
                      ? `${customer.requestCount}건`
                      : "없음"}
                  </div>
                  {customer.requestCount > 0 && (
                    <div className="text-xs text-gray-400">
                      최근: {customer.lastRequestDate}
                    </div>
                  )}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <div className="flex space-x-2">
                  <button
                    onClick={() => onViewDetail(customer.id)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    상세
                  </button>
                  <button
                    onClick={() => onEdit(customer.id)}
                    className="text-green-600 hover:text-green-800"
                  >
                    수정
                  </button>
                  <button
                    onClick={() => onDelete(customer.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    삭제
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CustomerTable;
