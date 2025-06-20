import Link from "next/link";

export default function Home() {
  return (
    <div className="w-full min-h-screen overflow-hidden text-base justify-center items-center flex">
      <ul>
        <li>
          <Link href="">임나연</Link>
        </li>
        <li>
          <Link href="">조석근</Link>
        </li>
        <li>
          <Link href="">박준범</Link>
        </li>
        <li>
          <Link href="">이석진</Link>
        </li>
        <li>
          <Link href="">지정호</Link>
        </li>
      </ul>
    </div>
  );
}
