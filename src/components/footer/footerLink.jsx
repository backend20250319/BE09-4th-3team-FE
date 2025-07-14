import Link from "next/link";

export default function FooterLink({ href, label, isNew = false, highlight = false }) {
  return (
    <li
      className={`transition-all duration-200 ease-in-out hover:text-[#1c1c1c] ${
        highlight ? "text-[#FA6462]" : "hover:font-semibold"
      }`}
    >
      <Link href={href} className="relative">
        {label}
        {isNew && (
          <span className="absolute -top-[2px] -right-[16px] inline-flex items-center pt-[1px] justify-center w-[14px] h-[14px] rounded-full bg-[#f05757] text-white text-[8px] font-bold">
            N
          </span>
        )}
      </Link>
    </li>
  );
}
