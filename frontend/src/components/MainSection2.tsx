import Image from "next/image";

const MainSection2 = () => {
  const items = [
    { title: "공연팀 MC", image: "/mc.jpg" },
    { title: "연예인", image: "/celebrity.jpg" },
    { title: "결혼식 MC", image: "/wedding.jpg" },
    { title: "돌잔치 MC", image: "/dol.jpg" },
    { title: "시스템", image: "/system.jpg" },
    { title: "음향", image: "/sound.jpg" },
    { title: "조명", image: "/light.jpg" },
    { title: "기타", image: "/etc.jpg" },
  ];

  return (
    <section className="p-4">
      <div className="grid grid-cols-4 gap-4">
        {items.map((item, index) => (
          <div key={index} className="flex flex-col items-center">
            <div className="aspect-square w-full bg-gray-100 rounded-lg overflow-hidden mb-2">
              <div className="relative w-full h-full">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover"
                />
              </div>
            </div>
            <p className="text-black text-sm">{item.title}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default MainSection2;
