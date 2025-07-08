import Link from "next/link";

export default function Page() {
  return (
    <>
      <Link href="/nayeon/notification">알림 페이지 이동</Link>
      <br />
      <br />
      <Link href="/nayeon/review">리뷰 작성 페이지 이동</Link>
      <br />
      <br />
      <Link href="/nayeon/review/reviews">작성한 리뷰 목록 보기</Link>
    </>
  );
}
