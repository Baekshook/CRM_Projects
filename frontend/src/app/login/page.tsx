"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BottomNav from "@/components/BottomNav";

const LoginPage = () => {
  const router = useRouter();
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [saveId, setSaveId] = useState(false);

  useEffect(() => {
    // 저장된 아이디 불러오기
    const savedId = localStorage.getItem("savedId");
    if (savedId) {
      setId(savedId);
      setSaveId(true);
    }
  }, []);

  const handleSaveId = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSaveId(e.target.checked);
    if (!e.target.checked) {
      localStorage.removeItem("savedId");
    }
  };

  const handleLogin = () => {
    if (saveId) {
      localStorage.setItem("savedId", id);
    }
    // 로그인 로직 구현
    console.log("로그인 시도:", { id, password });
  };

  return (
    <div className="min-h-screen bg-white pb-16">
      <Header showBackButton={true} title="로그인" titleColor="text-black" />
      <main className="pt-16 px-4">
        <div className="max-w-md mx-auto space-y-6">
          <div className="space-y-4">
            <input
              type="text"
              placeholder="아이디"
              value={id}
              onChange={(e) => setId(e.target.value)}
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
