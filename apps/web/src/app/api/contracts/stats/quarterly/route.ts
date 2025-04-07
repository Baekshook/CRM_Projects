import { NextResponse } from "next/server";

export async function GET() {
  // 분기별 계약 통계 더미 데이터
  const data = {
    quarters: [
      { quarter: "1분기", count: 45 },
      { quarter: "2분기", count: 67 },
      { quarter: "3분기", count: 53 },
      { quarter: "4분기", count: 75 },
    ],
    total: 240,
  };

  return NextResponse.json(data);
}

export const dynamic = "force-dynamic";
