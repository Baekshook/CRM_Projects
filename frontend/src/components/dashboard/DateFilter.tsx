"use client";

interface DateFilterProps {
  dateFilter: string;
  setDateFilter: (filter: string) => void;
}

export const DateFilter: React.FC<DateFilterProps> = ({
  dateFilter,
  setDateFilter,
}) => {
  return (
    <div className="bg-white rounded-lg shadow p-4 mb-6">
      <div className="flex space-x-2">
        <button
          className={`px-4 py-2 rounded-md text-sm font-medium ${
            dateFilter === "today"
              ? "bg-orange-500 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
          onClick={() => setDateFilter("today")}
        >
          오늘
        </button>
        <button
          className={`px-4 py-2 rounded-md text-sm font-medium ${
            dateFilter === "week"
              ? "bg-orange-500 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
          onClick={() => setDateFilter("week")}
        >
          이번 주
        </button>
        <button
          className={`px-4 py-2 rounded-md text-sm font-medium ${
            dateFilter === "month"
              ? "bg-orange-500 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
          onClick={() => setDateFilter("month")}
        >
          이번 달
        </button>
      </div>
    </div>
  );
};

export default DateFilter;
