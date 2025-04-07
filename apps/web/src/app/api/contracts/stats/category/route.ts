import { NextResponse } from "next/server";

export async function GET() {
  // 카테고리별 계약 통계 더미 데이터
  const data = {
    categories: [
      { name: "웨딩", count: 35 },
      { name: "기업행사", count: 25 },
      { name: "콘서트", count: 18 },
      { name: "축제", count: 12 },
      { name: "기타", count: 10 },
    ],
    total: 100,
  };

  return NextResponse.json(data);
}

export const dynamic = "force-dynamic";
