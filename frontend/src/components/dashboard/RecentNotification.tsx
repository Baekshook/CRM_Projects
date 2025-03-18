"use client";

export interface NotificationProps {
  message: string;
  time: string;
  color: "orange" | "blue" | "green" | "red" | "purple" | "gray";
}

export const RecentNotification: React.FC<NotificationProps> = ({
  message,
  time,
  color,
}) => {
  return (
    <div
      className={`border-l-4 border-${color}-300 pl-3 py-2 mb-3 bg-gray-50 rounded-r`}
    >
      <p className="font-medium text-gray-800">{message}</p>
      <div className="text-xs text-gray-500 mt-1">{time}</div>
    </div>
  );
};

export default RecentNotification;
