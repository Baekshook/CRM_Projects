"use client";

import React from "react";
import { useRouter } from "next/navigation";

export interface PageHeaderProps {
  title: string;
  description?: string;
  backUrl?: string;
}

const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  description,
  backUrl,
}) => {
  const router = useRouter();

  return (
    <div className="mb-6">
      {backUrl && (
        <button
          onClick={() => router.push(backUrl)}
          className="mb-3 text-gray-600 hover:text-gray-800 flex items-center"
        >
          <svg
            className="w-4 h-4 mr-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          돌아가기
        </button>
      )}
      <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
      {description && <p className="mt-2 text-gray-600">{description}</p>}
    </div>
  );
};

export default PageHeader;
