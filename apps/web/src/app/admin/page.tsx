import dynamic from "next/dynamic";

// 클라이언트 측에서만 동적으로, 그리고 클라이언트 컴포넌트에서만 로드되도록 설정
const DashboardPage = dynamic(() => import("@/app/admin/dashboard/page"), {
  ssr: false,
  loading: () => (
    <div className="p-8 text-center">대시보드를 불러오는 중...</div>
  ),
});

export default function AdminPage() {
  return <DashboardPage />;
}
