import Image from "next/image";

export const CategoryBtn = ({ src, alt, label }) => (
  <button className="flex gap-2 min-w-[68px] flex-col items-center w-[58px]">
    <div className="w-[68px] h-[68px] py-[7px] overflow-hidden hover:border hover:border-[#1c1c1c] transition-all duration-300 ease-in-out flex items-center justify-center mx-[6px] rounded-[16px] bg-[#f6f6f6]">
      <Image src={src} alt={alt} width={68} height={68} />
    </div>
    <p className="text-[13px] font-normal">{label}</p>
  </button>
);
