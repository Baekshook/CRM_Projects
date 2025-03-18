"use client";

interface CustomerActionsProps {
  selectedCustomers: string[];
  onAddNewCustomer: () => void;
  onBulkDelete: () => void;
  onBulkStatus: (status: "active" | "inactive") => void;
}

export const CustomerActions: React.FC<CustomerActionsProps> = ({
  selectedCustomers,
  onAddNewCustomer,
  onBulkDelete,
  onBulkStatus,
}) => {
  const hasSelected = selectedCustomers.length > 0;

  return (
    <div className="flex justify-between mb-4">
      <div>
        <button
          className="px-4 py-2 bg-orange-600 text-white rounded-md shadow hover:bg-orange-700 focus:outline-none"
          onClick={onAddNewCustomer}
        >
          + 신규 고객 등록
        </button>
        {hasSelected && (
          <>
            <button
              className="ml-2 px-4 py-2 bg-red-600 text-white rounded-md shadow hover:bg-red-700 focus:outline-none"
              onClick={onBulkDelete}
            >
              선택 삭제 ({selectedCustomers.length})
            </button>
            <button
              className="ml-2 px-4 py-2 bg-green-600 text-white rounded-md shadow hover:bg-green-700 focus:outline-none"
              onClick={() => onBulkStatus("active")}
            >
              활성으로 변경
            </button>
            <button
              className="ml-2 px-4 py-2 bg-gray-600 text-white rounded-md shadow hover:bg-gray-700 focus:outline-none"
              onClick={() => onBulkStatus("inactive")}
            >
              비활성으로 변경
            </button>
          </>
        )}
      </div>
      <div>
        <span className="text-sm text-gray-500">
          {hasSelected ? `${selectedCustomers.length}명 선택됨` : ""}
        </span>
      </div>
    </div>
  );
};

export default CustomerActions;
