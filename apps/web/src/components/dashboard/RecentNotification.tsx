"use client";

import React from "react";

interface RecentNotificationProps {
  notification: {
    message: string;
    time: string;
    color?: "orange" | "blue" | "green" | "red" | "purple" | "gray";
  };
}

const RecentNotification = ({ notification }: RecentNotificationProps) => {
  // 색상에 따른 스타일 클래스
  const getColorClass = () => {
    const colorMap = {
      orange: "bg-orange-100 text-orange-800",
      blue: "bg-blue-100 text-blue-800",
      green: "bg-green-100 text-green-800",
      red: "bg-red-100 text-red-800",
      purple: "bg-purple-100 text-purple-800",
      gray: "bg-gray-100 text-gray-800",
    };

    return colorMap[notification.color || "gray"];
  };

  // 아이콘 표시 (간단한 대체 텍스트로 표시)
  const getIndicator = () => {
    const color = notification.color || "gray";
    const indicatorColorMap = {
      orange: "bg-orange-500",
      blue: "bg-blue-500",
      green: "bg-green-500",
      red: "bg-red-500",
      purple: "bg-purple-500",
      gray: "bg-gray-500",
    };

    return (
      <div
        className={`w-2 h-2 rounded-full mr-2 ${indicatorColorMap[color]}`}
      />
    );
  };

  return (
    <div className="p-3 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors">
      <div className="flex items-start">
        {getIndicator()}
        <div className="flex-1 min-w-0">
          <p className="text-gray-900">{notification.message}</p>
          <p className="text-sm text-gray-500 mt-1">{notification.time}</p>
        </div>
      </div>
    </div>
  );
};

export default RecentNotification;
