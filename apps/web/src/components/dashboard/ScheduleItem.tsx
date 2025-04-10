"use client";

import React from "react";
import Link from "next/link";

interface ScheduleItemProps {
  schedule: {
    id: string;
    title?: string;
    time?: string;
    customer?: string;
    location?: string;
  };
}

const ScheduleItem = ({ schedule }: ScheduleItemProps) => {
  return (
    <Link href={`/admin/schedules/${schedule.id}`}>
      <div className="p-3 border border-gray-200 rounded-md hover:bg-gray-50 cursor-pointer transition-colors">
        <div className="flex items-start gap-3">
          <div className="min-w-[60px] text-center">
            <span className="font-medium text-orange-600">
              {schedule.time || "시간 정보 없음"}
            </span>
          </div>
          <div className="flex-1">
            <h3 className="font-medium text-gray-900">
              {schedule.title || "제목 없음"}
            </h3>
            <div className="flex items-center mt-1 text-sm text-gray-500">
              <span className="mr-2">{schedule.customer || "고객명 없음"}</span>
              {schedule.location && (
                <>
                  <span className="mx-1">•</span>
                  <span>{schedule.location}</span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ScheduleItem;
