"use client";
import Header from "@/components/Header";
import MainSection1 from "@/components/MainSection1";
import MainSection2 from "@/components/MainSection2";
import MainSection3 from "@/components/MainSection3";
import Footer from "@/components/Footer";
import BottomNav from "@/components/BottomNav";

export default function Home() {
  return (
    <div className="min-h-screen bg-white pb-16">
      <Header />
      <main>
        <MainSection1 />
        <MainSection2 />
        <MainSection3 />
      </main>
      <Footer />
      <BottomNav />
    </div>
  );
}
