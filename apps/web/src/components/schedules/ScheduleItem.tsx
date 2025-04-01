"use client";
import Link from "next/link";

// 오늘의 일정 컴포넌트
export interface ScheduleItemProps {
  id: string;
  title: string;
  time: string;
  customer: string;
  location: string;
}

export const ScheduleItem: React.FC<ScheduleItemProps> = ({
  id,
  title,
  time,
  customer,
  location,
}) => {
  return (
    <div className="p-4 border-b border-gray-200 hover:bg-gray-50">
      <div className="flex justify-between">
        <Link
          href={`/admin/schedules/${id}`}
          className="text-blue-600 hover:text-blue-800"
        >
          {title}
        </Link>
        <span className="text-gray-500">{time}</span>
      </div>
      <div className="mt-2 flex justify-between text-sm">
        <span className="text-gray-600">{customer}</span>
        <span className="text-gray-500">{location}</span>
      </div>
    </div>
  );
};

export default ScheduleItem;
