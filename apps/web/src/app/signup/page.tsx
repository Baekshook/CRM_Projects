"use client";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Footer from "@/components/Footer";
import BottomNav from "@/components/BottomNav";

const SignupPage = () => {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-white pb-16">
      <main className="px-4 pt-8">
        <div className="max-w-md mx-auto">
          <h1 className="text-2xl font-bold text-black text-center mb-4">
            회원가입
          </h1>
          <p className="text-black text-center mb-8">
            이용하고자 하는 서비스를 선택해주세요
          </p>

          <div className="space-y-4">
            <button
              onClick={() => router.push("/signup/customer")}
              className="w-full bg-white border-2 border-gray-200 rounded-xl p-6 flex flex-col items-center hover:border-orange-500 transition-colors"
            >
              <div className="w-24 h-24 mb-4 relative">
                <Image
                  src="/customer-icon.svg"
                  alt="고객 회원가입"
                  fill
                  className="object-contain"
                />
              </div>
              <span className="text-lg font-semibold text-black">
                고객 회원가입
              </span>
              <p className="text-sm text-gray-500 mt-2 text-center">
                공연 및 행사를 의뢰하고 싶으신가요?
              </p>
            </button>

            <button
              onClick={() => router.push("/signup/artist")}
              className="w-full bg-white border-2 border-gray-200 rounded-xl p-6 flex flex-col items-center hover:border-orange-500 transition-colors"
            >
              <div className="w-24 h-24 mb-4 relative">
                <Image
                  src="/artist-icon.svg"
                  alt="아티스트 회원가입"
                  fill
                  className="object-contain"
                />
              </div>
              <span className="text-lg font-semibold text-black">
                아티스트 회원가입
              </span>
              <p className="text-sm text-gray-500 mt-2 text-center">
                공연 및 행사를 진행하고 싶으신가요?
              </p>
            </button>

            <button
              onClick={() => router.push("/signup/admin")}
              className="w-full bg-white border-2 border-gray-200 rounded-xl p-6 flex flex-col items-center hover:border-orange-500 transition-colors"
            >
              <div className="w-24 h-24 mb-4 relative">
                <Image
                  src="/admin-icon.svg"
                  alt="관리자 회원가입"
                  fill
                  className="object-contain"
                />
              </div>
              <span className="text-lg font-semibold text-black">
                관리자 회원가입
              </span>
              <p className="text-sm text-gray-500 mt-2 text-center">
                서비스 관리 및 운영을 담당하시나요?
              </p>
            </button>
          </div>
        </div>
      </main>
      <Footer />
      <BottomNav />
    </div>
  );
};

export default SignupPage;
