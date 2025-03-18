"use client";
import Link from "next/link";

// 최근 요청서 컴포넌트
export interface RecentRequestProps {
  id: string;
  title: string;
  customer: string;
  date: string;
  status: string;
}

export const RecentRequest: React.FC<RecentRequestProps> = ({
  id,
  title,
  customer,
  date,
  status,
}) => {
  // 상태에 따른 배지 색상
  const getStatusColor = (status: string) => {
    switch (status) {
      case "요청중":
        return "bg-blue-100 text-blue-800";
      case "검토중":
        return "bg-yellow-100 text-yellow-800";
      case "협상 진행":
        return "bg-purple-100 text-purple-800";
      case "견적 완료":
      case "견적 검토중":
        return "bg-indigo-100 text-indigo-800";
      case "계약 완료":
        return "bg-green-100 text-green-800";
      case "요청 접수":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="p-4 border-b border-gray-200 hover:bg-gray-50">
      <div className="flex justify-between">
        <Link
          href={`/admin/requests/${id}`}
          className="text-blue-600 hover:text-blue-800"
        >
          {title}
        </Link>
        <span
          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
            status
          )}`}
        >
          {status}
        </span>
      </div>
      <div className="mt-2 flex justify-between text-sm">
        <span className="text-gray-600">{customer}</span>
        <span className="text-gray-500">{date}</span>
      </div>
    </div>
  );
};

export default RecentRequest;
