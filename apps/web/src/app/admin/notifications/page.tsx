"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import PageHeader from "@/components/common/PageHeader";
import { negotiationLogs } from "@/utils/dummyData";
import { toast } from "react-hot-toast";

// 알림 인터페이스 추가
interface Notification {
  id: string;
  title: string;
  content: string;
  type: "system" | "match" | "contract" | "payment" | "review" | "other";
  priority: "high" | "medium" | "low";
  status: "unread" | "read" | "archived";
  createdAt: string;
  targetId?: string;
  targetType?: string;
}

export default function NotificationsPage() {
  const router = useRouter();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [logs, setLogs] = useState([...negotiationLogs]);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<"notifications" | "logs">(
    "notifications"
  );
  const [filters, setFilters] = useState({
    search: "",
    type: "",
    status: "",
    priority: "",
    sortBy: "createdAt",
    sortOrder: "desc",
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (activeTab === "notifications") {
      fetchNotifications();
    } else {
      fetchLogs();
    }
  }, [activeTab, filters]);

  // 샘플 알림 데이터
  const dummyNotifications: Notification[] = [
    {
      id: "NOTIF-001",
      title: "신규 고객 등록",
      content: "김민수 고객이 새로 등록되었습니다.",
      type: "system",
      priority: "medium",
      status: "unread",
      createdAt: "2025-03-15T10:30:00Z",
      targetId: "CUST-001",
      targetType: "customer",
    },
    {
      id: "NOTIF-002",
      title: "협상 상태 변경",
      content: "매칭 ID: MATCH-001의 협상 상태가 '협상 중'으로 변경되었습니다.",
      type: "match",
      priority: "high",
      status: "unread",
      createdAt: "2025-03-14T15:45:00Z",
      targetId: "MATCH-001",
      targetType: "match",
    },
    {
      id: "NOTIF-003",
      title: "계약 체결 완료",
      content: "계약 ID: CON-001이 양측에 의해 서명되었습니다.",
      type: "contract",
      priority: "high",
      status: "read",
      createdAt: "2025-03-10T09:20:00Z",
      targetId: "CON-001",
      targetType: "contract",
    },
    {
      id: "NOTIF-004",
      title: "결제 완료",
      content: "김민수 고객의 계약금 1,900,000원이 입금되었습니다.",
      type: "payment",
      priority: "medium",
      status: "read",
      createdAt: "2025-03-05T14:10:00Z",
      targetId: "PAY-001",
      targetType: "payment",
    },
    {
      id: "NOTIF-005",
      title: "새로운 리뷰 등록",
      content: "박준호 고객이 박서연 가수에 대한 새 리뷰를 등록했습니다.",
      type: "review",
      priority: "low",
      status: "archived",
      createdAt: "2025-02-25T11:30:00Z",
      targetId: "REV-001",
      targetType: "review",
    },
  ];

  const fetchNotifications = () => {
    try {
      setIsLoading(true);

      // 실제 앱에서는 API 호출로 데이터 가져오기
      // setNotifications(await apiCall('/api/notifications'));

      // 필터링 로직
      let filteredNotifications = [...dummyNotifications];

      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        filteredNotifications = filteredNotifications.filter(
          (notification) =>
            notification.title.toLowerCase().includes(searchLower) ||
            notification.content.toLowerCase().includes(searchLower)
        );
      }

      if (filters.type) {
        filteredNotifications = filteredNotifications.filter(
          (notification) => notification.type === filters.type
        );
      }

      if (filters.status) {
        filteredNotifications = filteredNotifications.filter(
          (notification) => notification.status === filters.status
        );
      }

      if (filters.priority) {
        filteredNotifications = filteredNotifications.filter(
          (notification) => notification.priority === filters.priority
        );
      }

      // 정렬
      filteredNotifications.sort((a, b) => {
        if (filters.sortBy === "createdAt") {
          return filters.sortOrder === "asc"
            ? new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
            : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        } else {
          // title
          return filters.sortOrder === "asc"
            ? a.title.localeCompare(b.title)
            : b.title.localeCompare(a.title);
        }
      });

      setNotifications(filteredNotifications);
    } catch (error) {
      console.error("알림 목록 불러오기 오류:", error);
      toast.error("알림 목록을 불러오는데 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchLogs = () => {
    try {
      setIsLoading(true);

      // 필터링 로직
      let filteredLogs = [...negotiationLogs];

      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        filteredLogs = filteredLogs.filter(
          (log) =>
            log.content.toLowerCase().includes(searchLower) ||
            log.type.toLowerCase().includes(searchLower) ||
            log.user.toLowerCase().includes(searchLower)
        );
      }

      if (filters.type) {
        filteredLogs = filteredLogs.filter((log) => log.type === filters.type);
      }

      // 정렬
      filteredLogs.sort((a, b) => {
        if (filters.sortBy === "createdAt" || filters.sortBy === "date") {
          return filters.sortOrder === "asc"
            ? new Date(a.date).getTime() - new Date(b.date).getTime()
            : new Date(b.date).getTime() - new Date(a.date).getTime();
        } else {
          // type
          return filters.sortOrder === "asc"
            ? a.type.localeCompare(b.type)
            : b.type.localeCompare(a.type);
        }
      });

      setLogs(filteredLogs);
    } catch (error) {
      console.error("로그 목록 불러오기 오류:", error);
      toast.error("로그 목록을 불러오는데 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilterChange = (newFilters: Partial<typeof filters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      if (activeTab === "notifications") {
        setSelectedItems(notifications.map((notification) => notification.id));
      } else {
        setSelectedItems(logs.map((log) => log.id));
      }
    } else {
      setSelectedItems([]);
    }
  };

  const handleSelectItem = (id: string) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((itemId) => itemId !== id) : [...prev, id]
    );
  };

  const handleDeleteNotification = (id: string) => {
    if (confirm("정말로 이 알림을 삭제하시겠습니까?")) {
      try {
        // 실제 앱에서는 API 호출
        const updatedNotifications = notifications.filter(
          (notification) => notification.id !== id
        );
        setNotifications(updatedNotifications);
        setSelectedItems((prev) => prev.filter((itemId) => itemId !== id));
        toast.success("알림이 삭제되었습니다.");
      } catch (error) {
        toast.error("알림 삭제에 실패했습니다.");
      }
    }
  };

  const handleBulkDelete = () => {
    if (confirm(`선택된 ${selectedItems.length}개 항목을 삭제하시겠습니까?`)) {
      try {
        // 실제 앱에서는 API 호출
        if (activeTab === "notifications") {
          const updatedNotifications = notifications.filter(
            (notification) => !selectedItems.includes(notification.id)
          );
          setNotifications(updatedNotifications);
        } else {
          const updatedLogs = logs.filter(
            (log) => !selectedItems.includes(log.id)
          );
          setLogs(updatedLogs);
        }
        setSelectedItems([]);
        toast.success(`${selectedItems.length}개 항목이 삭제되었습니다.`);
      } catch (error) {
        toast.error("항목 삭제에 실패했습니다.");
      }
    }
  };

  const handleStatusChange = (
    id: string,
    newStatus: "unread" | "read" | "archived"
  ) => {
    try {
      // 실제 앱에서는 API 호출
      const updatedNotifications = notifications.map((notification) =>
        notification.id === id
          ? { ...notification, status: newStatus }
          : notification
      );
      setNotifications(updatedNotifications);
      toast.success(
        `알림 상태가 ${
          newStatus === "unread"
            ? "읽지 않음"
            : newStatus === "read"
            ? "읽음"
            : "보관됨"
        }으로 변경되었습니다.`
      );
    } catch (error) {
      toast.error("알림 상태 변경에 실패했습니다.");
    }
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getTypeText = (type: string): string => {
    switch (type) {
      case "system":
        return "시스템";
      case "match":
        return "매칭";
      case "contract":
        return "계약";
      case "payment":
        return "결제";
      case "review":
        return "리뷰";
      case "status_change":
        return "상태 변경";
      case "price_change":
        return "가격 변경";
      case "message":
        return "메시지";
      default:
        return "기타";
    }
  };

  const getTypeBadge = (type: string) => {
    let bgClass = "";
    let textClass = "";

    switch (type) {
      case "system":
        bgClass = "bg-blue-100";
        textClass = "text-blue-800";
        break;
      case "match":
        bgClass = "bg-green-100";
        textClass = "text-green-800";
        break;
      case "contract":
        bgClass = "bg-purple-100";
        textClass = "text-purple-800";
        break;
      case "payment":
        bgClass = "bg-yellow-100";
        textClass = "text-yellow-800";
        break;
      case "review":
        bgClass = "bg-orange-100";
        textClass = "text-orange-800";
        break;
      case "status_change":
        bgClass = "bg-indigo-100";
        textClass = "text-indigo-800";
        break;
      case "price_change":
        bgClass = "bg-pink-100";
        textClass = "text-pink-800";
        break;
      case "message":
        bgClass = "bg-gray-100";
        textClass = "text-gray-800";
        break;
      default:
        bgClass = "bg-gray-100";
        textClass = "text-gray-800";
    }

    return (
      <span
        className={`px-2 py-1 text-xs font-semibold rounded-full ${bgClass} ${textClass}`}
      >
        {getTypeText(type)}
      </span>
    );
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "unread":
        return (
          <span className="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
            읽지 않음
          </span>
        );
      case "read":
        return (
          <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
            읽음
          </span>
        );
      case "archived":
        return (
          <span className="px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
            보관됨
          </span>
        );
      default:
        return null;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "high":
        return (
          <span className="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
            높음
          </span>
        );
      case "medium":
        return (
          <span className="px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
            중간
          </span>
        );
      case "low":
        return (
          <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
            낮음
          </span>
        );
      default:
        return null;
    }
  };

  const getTargetLink = (targetType?: string, targetId?: string) => {
    if (!targetType || !targetId) return "#";

    switch (targetType) {
      case "customer":
        return `/admin/customers/${targetId}`;
      case "singer":
        return `/admin/customers/${targetId}`;
      case "match":
        return `/admin/negotiations/${targetId}`;
      case "contract":
        return `/admin/schedules/contracts/${targetId}`;
      case "payment":
        return `/admin/schedules/contracts/${targetId}`;
      case "review":
        return `/admin/reviews?id=${targetId}`;
      default:
        return "#";
    }
  };

  return (
    <div className="pb-10">
      <PageHeader
        title="알림/로그 관리"
        description="시스템 알림과 활동 로그를 관리합니다."
      />

      {/* 탭 */}
      <div className="mb-6 flex border-b border-gray-200">
        <button
          className={`px-4 py-2 font-medium ${
            activeTab === "notifications"
              ? "text-orange-600 border-b-2 border-orange-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
          onClick={() => {
            setActiveTab("notifications");
            setSelectedItems([]);
          }}
        >
          알림
        </button>
        <button
          className={`px-4 py-2 font-medium ${
            activeTab === "logs"
              ? "text-orange-600 border-b-2 border-orange-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
          onClick={() => {
            setActiveTab("logs");
            setSelectedItems([]);
          }}
        >
          활동 로그
        </button>
      </div>

      {/* 필터 및 액션 영역 */}
      <div className="mb-6 bg-white rounded-lg shadow p-4">
        <div className="flex flex-wrap justify-between items-center gap-4">
          {/* 검색 */}
          <div className="flex-grow max-w-md">
            <input
              type="text"
              placeholder="검색..."
              value={filters.search}
              onChange={(e) => handleFilterChange({ search: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded-lg"
            />
          </div>

          {/* 필터 */}
          <div className="flex gap-2">
            {activeTab === "notifications" && (
              <>
                <select
                  value={filters.type}
                  onChange={(e) => handleFilterChange({ type: e.target.value })}
                  className="p-2 border border-gray-300 rounded-lg"
                >
                  <option value="">모든 유형</option>
                  <option value="system">시스템</option>
                  <option value="match">매칭</option>
                  <option value="contract">계약</option>
                  <option value="payment">결제</option>
                  <option value="review">리뷰</option>
                  <option value="other">기타</option>
                </select>

                <select
                  value={filters.status}
                  onChange={(e) =>
                    handleFilterChange({ status: e.target.value })
                  }
                  className="p-2 border border-gray-300 rounded-lg"
                >
                  <option value="">모든 상태</option>
                  <option value="unread">읽지 않음</option>
                  <option value="read">읽음</option>
                  <option value="archived">보관됨</option>
                </select>

                <select
                  value={filters.priority}
                  onChange={(e) =>
                    handleFilterChange({ priority: e.target.value })
                  }
                  className="p-2 border border-gray-300 rounded-lg"
                >
                  <option value="">모든 중요도</option>
                  <option value="high">높음</option>
                  <option value="medium">중간</option>
                  <option value="low">낮음</option>
                </select>
              </>
            )}

            {activeTab === "logs" && (
              <select
                value={filters.type}
                onChange={(e) => handleFilterChange({ type: e.target.value })}
                className="p-2 border border-gray-300 rounded-lg"
              >
                <option value="">모든 유형</option>
                <option value="status_change">상태 변경</option>
                <option value="price_change">가격 변경</option>
                <option value="message">메시지</option>
              </select>
            )}

            <select
              value={filters.sortBy}
              onChange={(e) => handleFilterChange({ sortBy: e.target.value })}
              className="p-2 border border-gray-300 rounded-lg"
            >
              <option value="createdAt">일시</option>
              <option value="title">제목</option>
              {activeTab === "logs" && <option value="type">유형</option>}
            </select>

            <select
              value={filters.sortOrder}
              onChange={(e) =>
                handleFilterChange({ sortOrder: e.target.value })
              }
              className="p-2 border border-gray-300 rounded-lg"
            >
              <option value="desc">내림차순</option>
              <option value="asc">오름차순</option>
            </select>
          </div>

          {/* 버튼 */}
          <div className="flex gap-2">
            {selectedItems.length > 0 && (
              <button
                onClick={handleBulkDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                {selectedItems.length}개 삭제
              </button>
            )}
            {activeTab === "notifications" && (
              <button
                onClick={() => {
                  toast.success("모든 알림을 읽음으로 표시했습니다.");
                  setNotifications(
                    notifications.map((notification) => ({
                      ...notification,
                      status: "read",
                    }))
                  );
                }}
                className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
              >
                모두 읽음으로 표시
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 알림 목록 */}
      {activeTab === "notifications" && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {isLoading ? (
            <div className="p-6 text-center text-gray-500">
              알림을 불러오는 중...
            </div>
          ) : notifications.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              <p className="mb-4">알림이 없습니다.</p>
            </div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-8">
                    <input
                      type="checkbox"
                      checked={
                        selectedItems.length === notifications.length &&
                        notifications.length > 0
                      }
                      onChange={(e) => handleSelectAll(e.target.checked)}
                      className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    알림 내용
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    유형
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    중요도
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    발생 시간
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    상태
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    관리
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {notifications.map((notification) => (
                  <tr key={notification.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={selectedItems.includes(notification.id)}
                        onChange={() => handleSelectItem(notification.id)}
                        className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {notification.title}
                        </div>
                        <div className="text-sm text-gray-500">
                          {notification.content}
                        </div>
                        {notification.targetId && notification.targetType && (
                          <div className="mt-1">
                            <a
                              href={getTargetLink(
                                notification.targetType,
                                notification.targetId
                              )}
                              className="text-xs text-orange-600 hover:text-orange-900"
                            >
                              관련 항목 보기
                            </a>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getTypeBadge(notification.type)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getPriorityBadge(notification.priority)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(notification.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(notification.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      {notification.status === "unread" ? (
                        <button
                          onClick={() =>
                            handleStatusChange(notification.id, "read")
                          }
                          className="text-green-600 hover:text-green-900 mr-3"
                        >
                          읽음
                        </button>
                      ) : notification.status === "read" ? (
                        <button
                          onClick={() =>
                            handleStatusChange(notification.id, "archived")
                          }
                          className="text-blue-600 hover:text-blue-900 mr-3"
                        >
                          보관
                        </button>
                      ) : (
                        <button
                          onClick={() =>
                            handleStatusChange(notification.id, "read")
                          }
                          className="text-orange-600 hover:text-orange-900 mr-3"
                        >
                          복원
                        </button>
                      )}
                      <button
                        onClick={() =>
                          handleDeleteNotification(notification.id)
                        }
                        className="text-red-600 hover:text-red-900"
                      >
                        삭제
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* 로그 목록 */}
      {activeTab === "logs" && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {isLoading ? (
            <div className="p-6 text-center text-gray-500">
              로그를 불러오는 중...
            </div>
          ) : logs.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              <p className="mb-4">로그가 없습니다.</p>
            </div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-8">
                    <input
                      type="checkbox"
                      checked={
                        selectedItems.length === logs.length && logs.length > 0
                      }
                      onChange={(e) => handleSelectAll(e.target.checked)}
                      className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    매칭 ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    내용
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    유형
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    사용자
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    일시
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    관리
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={selectedItems.includes(log.id)}
                        onChange={() => handleSelectItem(log.id)}
                        className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <a
                        href={`/admin/negotiations/${log.matchId}`}
                        className="text-sm text-orange-600 hover:text-orange-900"
                      >
                        {log.matchId}
                      </a>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{log.content}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getTypeBadge(log.type)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {log.user}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(log.date)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => {
                          // 실제 앱에서는 API 호출
                          const updatedLogs = logs.filter(
                            (item) => item.id !== log.id
                          );
                          setLogs(updatedLogs);
                          setSelectedItems((prev) =>
                            prev.filter((itemId) => itemId !== log.id)
                          );
                          toast.success("로그가 삭제되었습니다.");
                        }}
                        className="text-red-600 hover:text-red-900"
                      >
                        삭제
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}
