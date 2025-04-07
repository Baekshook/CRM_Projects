import { NextResponse } from "next/server";

export async function GET() {
  // 계약 유형별 통계 더미 데이터
  const data = {
    types: [
      { type: "일반 계약", count: 120 },
      { type: "독점 계약", count: 75 },
      { type: "단기 계약", count: 45 },
    ],
    total: 240,
  };

  return NextResponse.json(data);
}

export const dynamic = "force-dynamic";
