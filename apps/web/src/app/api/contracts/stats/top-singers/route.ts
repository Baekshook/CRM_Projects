import { NextResponse } from "next/server";

export async function GET() {
  // 상위 가수별 계약 통계 더미 데이터
  const data = {
    singers: [
      { id: "1", name: "김가수", count: 18, totalAmount: 90000000 },
      { id: "2", name: "이가수", count: 15, totalAmount: 75000000 },
      { id: "3", name: "박가수", count: 12, totalAmount: 60000000 },
      { id: "4", name: "정가수", count: 10, totalAmount: 50000000 },
      { id: "5", name: "최가수", count: 8, totalAmount: 40000000 },
    ],
  };

  return NextResponse.json(data);
}

export const dynamic = "force-dynamic";
