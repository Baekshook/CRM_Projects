import { NextResponse } from "next/server";

export async function GET() {
  // 월별 계약 통계 더미 데이터
  const data = {
    months: [
      { month: "1월", count: 12 },
      { month: "2월", count: 15 },
      { month: "3월", count: 18 },
      { month: "4월", count: 20 },
      { month: "5월", count: 22 },
      { month: "6월", count: 25 },
      { month: "7월", count: 18 },
      { month: "8월", count: 15 },
      { month: "9월", count: 20 },
      { month: "10월", count: 22 },
      { month: "11월", count: 25 },
      { month: "12월", count: 28 },
    ],
    total: 240,
  };

  return NextResponse.json(data);
}

export const dynamic = "force-dynamic";
