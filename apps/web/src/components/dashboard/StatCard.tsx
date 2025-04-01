"use client";

// 통계 카드 컴포넌트
interface StatCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  color: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  color,
}) => {
  return (
    <div className={`bg-white rounded-lg shadow p-5 border-l-4 ${color}`}>
      <div className="flex justify-between items-center">
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <p className="text-2xl font-bold mt-1">{value}</p>
        </div>
        <div className="text-gray-400">{icon}</div>
      </div>
    </div>
  );
};

export default StatCard;
