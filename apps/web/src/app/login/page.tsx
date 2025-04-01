"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BottomNav from "@/components/BottomNav";
import api from "@/lib/api";
import { toast } from "react-hot-toast";

interface LoginResponse {
  access_token: string;
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
  };
}

const LoginPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [saveId, setSaveId] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // 저장된 아이디 불러오기
    const savedId = localStorage.getItem("savedId");
    if (savedId) {
      setEmail(savedId);
      setSaveId(true);
    }
  }, []);

  const handleSaveId = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSaveId(e.target.checked);
    if (!e.target.checked) {
      localStorage.removeItem("savedId");
    }
  };

  const handleLogin = async () => {
    try {
      if (saveId) {
        localStorage.setItem("savedId", email);
      }

      console.log("로그인 시도:", { email, password });

      const response = await api.post<LoginResponse>("/auth/login", {
        email,
        password,
      });

      console.log("로그인 응답:", response.data);

      // 로그인 성공 시 토큰 저장
      localStorage.setItem("token", response.data.access_token);

      toast.success("로그인에 성공했습니다!");

      // admin 역할이라면 어드민 페이지로, 그렇지 않으면 홈 화면으로 이동
      if (response.data.user.role === "admin") {
        router.push("/admin");
      } else {
        router.push("/");
      }
    } catch (error) {
      console.error("로그인 오류:", error);
      toast.error("로그인에 실패했습니다.");
      setError("이메일 또는 비밀번호가 올바르지 않습니다.");
    }
  };

  return (
    <div className="min-h-screen bg-white pb-16">
      <Header showBackButton={true} title="로그인" titleColor="text-black" />
      <main className="pt-16 px-4">
        <div className="max-w-md mx-auto space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}
          <div className="space-y-4">
            <input
              type="email"
              placeholder="이메일"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-black placeholder-gray-400"
            />
            <input
              type="password"
              placeholder="비밀번호"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-black placeholder-gray-400"
            />
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="saveId"
              checked={saveId}
              onChange={handleSaveId}
              className="w-4 h-4 rounded-full border-gray-300 text-orange-500 focus:ring-orange-500"
            />
            <label htmlFor="saveId" className="text-sm text-gray-600">
              아이디 저장
            </label>
          </div>

          <button
            onClick={handleLogin}
            className="w-full py-3 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600 transition-colors"
          >
            로그인
          </button>

          <button
            onClick={() => router.push("/signup")}
            className="w-full py-3 bg-white text-black border border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
          >
            회원가입
          </button>

          <div className="flex justify-center space-x-4 text-sm text-gray-500">
            <button
              onClick={() => router.push("/find-id")}
              className="hover:text-orange-500"
            >
              아이디 찾기
            </button>
            <span>|</span>
            <button
              onClick={() => router.push("/find-password")}
              className="hover:text-orange-500"
            >
              비밀번호 찾기
            </button>
          </div>
        </div>
      </main>
      <Footer />
      <BottomNav />
    </div>
  );
};

export default LoginPage;
