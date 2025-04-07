import { NextResponse } from "next/server";

export async function GET() {
  // 상위 고객별 계약 통계 더미 데이터
  const data = {
    customers: [
      { id: "1", name: "삼성전자", count: 15, totalAmount: 75000000 },
      { id: "2", name: "현대그룹", count: 12, totalAmount: 60000000 },
      { id: "3", name: "SK그룹", count: 10, totalAmount: 50000000 },
      { id: "4", name: "LG전자", count: 8, totalAmount: 40000000 },
      { id: "5", name: "롯데그룹", count: 7, totalAmount: 35000000 },
    ],
  };

  return NextResponse.json(data);
}

export const dynamic = "force-dynamic";
