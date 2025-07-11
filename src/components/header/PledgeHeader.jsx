import Link from "next/link"
import Image from "next/image"

export default function PledgeHeader() {
  return (
    <header className="bg-white border-b">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center">
        <Link href="/">
          <Image
            src="/images/tumblbug_logo.png"
            alt="텀블벅 로고"
            width={132}
            height={36}
            className="h-9 w-auto cursor-pointer"
          />
        </Link>
        <div className="ml-4 text-gray-600">프로젝트 후원하기</div>
      </div>
    </header>
  )
}
