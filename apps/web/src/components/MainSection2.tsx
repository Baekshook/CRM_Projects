import Image from "next/image";

const MainSection2 = () => {
  const items = [
    {
      title: "공연팀 MC",
      image: "https://via.placeholder.com/300x200?text=MC",
    },
    {
      title: "연예인",
      image: "https://via.placeholder.com/300x200?text=Celebrity",
    },
    {
      title: "결혼식 MC",
      image: "https://via.placeholder.com/300x200?text=Wedding",
    },
    {
      title: "돌잔치 MC",
      image: "https://via.placeholder.com/300x200?text=Dol",
    },
    {
      title: "시스템",
      image: "https://via.placeholder.com/300x200?text=System",
    },
    { title: "음향", image: "https://via.placeholder.com/300x200?text=Sound" },
    { title: "조명", image: "https://via.placeholder.com/300x200?text=Light" },
    { title: "기타", image: "https://via.placeholder.com/300x200?text=Etc" },
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
                  unoptimized
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
