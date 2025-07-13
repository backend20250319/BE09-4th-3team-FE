import Image from "next/image";

export const CategoryBtn = ({ src, alt, label }) => (
  <button className="flex gap-2 min-w-[68px] flex-col items-center w-[58px]">
    <div className="w-[68px] h-[68px] py-[7px] overflow-hidden flex items-center justify-center mx-[6px] rounded-[16px] bg-[#f6f6f6]">
      <Image src={src} alt={alt} width={68} height={68} />
    </div>
    <p className="text-[13px] font-normal">{label}</p>
  </button>
);
