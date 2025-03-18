"use client";
import Link from "next/link";
import { ReactNode } from "react";

interface SectionProps {
  title: string;
  children: ReactNode;
  viewAllLink?: string;
}

export const Section: React.FC<SectionProps> = ({
  title,
  children,
  viewAllLink,
}) => {
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="flex justify-between items-center p-5 border-b border-gray-200">
        <h2 className="text-lg font-bold text-gray-800">{title}</h2>
        {viewAllLink && (
          <Link
            href={viewAllLink}
            className="text-orange-600 hover:text-orange-800 text-sm"
          >
            모두 보기
          </Link>
        )}
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
};

export default Section;
