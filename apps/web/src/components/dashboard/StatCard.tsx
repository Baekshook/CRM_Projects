"use client";

import React from "react";

// 통계 카드 컴포넌트
interface StatCardProps {
  title: string;
  value: number;
  unit?: string;
  icon?: "document" | "chat" | "check" | "clock" | "user" | "money";
  color?: "blue" | "green" | "orange" | "purple" | "red" | "gray";
}

const StatCard = ({
  title,
  value,
  unit = "",
  icon = "document",
  color = "blue",
}: StatCardProps) => {
  // 아이콘 및 색상 매핑
  const getIconClass = () => {
    const iconMap = {
      document: "i-bi-file-earmark-text",
      chat: "i-bi-chat-dots",
      check: "i-bi-check-circle",
      clock: "i-bi-clock",
      user: "i-bi-person",
      money: "i-bi-currency-exchange",
    };

    return iconMap[icon] || "i-bi-file-earmark-text";
  };

  const getColorClass = () => {
    const colorMap = {
      blue: "bg-blue-100 text-blue-800",
      green: "bg-green-100 text-green-800",
      orange: "bg-orange-100 text-orange-800",
      purple: "bg-purple-100 text-purple-800",
      red: "bg-red-100 text-red-800",
      gray: "bg-gray-100 text-gray-800",
    };

    return colorMap[color] || "bg-blue-100 text-blue-800";
  };

  // 실제 아이콘 클래스가 없으므로 간단한 대체 UI로 표시
  const IconPlaceholder = ({ color }: { color: string }) => {
    const bgColorMap = {
      blue: "bg-blue-500",
      green: "bg-green-500",
      orange: "bg-orange-500",
      purple: "bg-purple-500",
      red: "bg-red-500",
      gray: "bg-gray-500",
    };

    return (
      <div
        className={`w-10 h-10 rounded-full flex items-center justify-center ${
          bgColorMap[color] || "bg-blue-500"
        } text-white`}
      >
        {icon === "document" && "D"}
        {icon === "chat" && "C"}
        {icon === "check" && "✓"}
        {icon === "clock" && "T"}
        {icon === "user" && "U"}
        {icon === "money" && "M"}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-5">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-gray-500 text-sm">{title}</p>
          <p className="text-2xl font-bold mt-2">
            {value.toLocaleString()}
            {unit && <span className="text-lg ml-1">{unit}</span>}
          </p>
        </div>
        <IconPlaceholder color={color} />
      </div>
    </div>
  );
};

export default StatCard;
