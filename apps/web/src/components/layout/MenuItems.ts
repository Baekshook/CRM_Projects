// 사이드바 메뉴 아이템 타입 정의
export interface MenuItem {
  name: string;
  path: string;
  icon: JSX.Element;
  subMenus?: { name: string; path: string }[];
}

// 메뉴 아이템 데이터는 레이아웃 컴포넌트에서 가져와 사용합니다.
