import {
  getDashboardData,
  getDashboardDataTemp,
} from "@/services/dashboardApi";
import { getDashboardData as getDashboardDataDirect } from "@/services/dashboardApiDirect";

export default function DashboardPage() {
  const [stats, setStats] = useState<{
    requestCount: number;
    negotiationCount: number;
    contractCount: number;
    avgNegotiationDays: number;
  } | null>(null);
  const [recentRequests, setRecentRequests] = useState<any[]>([]);
  const [todaySchedules, setTodaySchedules] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dateFilter, setDateFilter] = useState<string>("today");
  const [dateRange, setDateRange] = useState<{
    startDate: Date | null;
    endDate: Date | null;
  }>({
    startDate: null,
    endDate: null,
  });

  // 대시보드 데이터 로드
  const loadDashboardData = useCallback(async () => {
    try {
      setLoading(true);

      // 직접 API를 사용하여 데이터 가져오기
      const data = await getDashboardDataDirect(
        dateFilter,
        dateRange.startDate?.toISOString().split("T")[0],
        dateRange.endDate?.toISOString().split("T")[0]
      );

      // 상태 업데이트
      setStats(data.stats);
      setRecentRequests(data.recentRequests);
      setTodaySchedules(data.todaySchedules);
      setNotifications(data.notifications);
    } catch (error) {
      console.error("대시보드 데이터 로드 오류:", error);
      // 오류 발생 시 임시 데이터로 대체
      const tempData = await getDashboardDataTemp(
        dateFilter,
        dateRange.startDate?.toISOString().split("T")[0],
        dateRange.endDate?.toISOString().split("T")[0]
      );

      setStats(tempData.stats);
      setRecentRequests(tempData.recentRequests);
      setTodaySchedules(tempData.todaySchedules);
      setNotifications(tempData.notifications);
    } finally {
      setLoading(false);
    }
  }, [dateFilter, dateRange]);

  // ... existing code ...
}
