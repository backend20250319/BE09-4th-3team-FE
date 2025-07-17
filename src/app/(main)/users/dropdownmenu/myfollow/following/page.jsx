"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import "../page.css";

export default function FollowingPage() {
  const router = useRouter();
  const [following, setFollowing] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    // TODO: 실제 API 연동 시 fetch/axios 등으로 데이터 받아오기
    setLoading(true);
    setTimeout(() => {
      setFollowing([]);
      setLoading(false);
    }, 500);
  }, []);

  return (
    <div className="follows-container">
      <div className="sponsored-divider"></div>
      <h1 className="follows-title">팔로우</h1>
      <div className="follow-tab-group">
        <div
          className="follow-tab"
          onClick={() => router.push("/users/myfollow")}
        >
          후원한 창작자 0
        </div>
        <div className="follow-tab active">팔로잉 0</div>
        <div
          className="follow-tab"
          onClick={() => router.push("/users/myfollow/follows")}
        >
          팔로워 0
        </div>
      </div>
      {loading ? (
        <div style={{ padding: 40, textAlign: "center" }}>로딩 중...</div>
      ) : error ? (
        <div style={{ padding: 40, textAlign: "center", color: "red" }}>
          {error}
        </div>
      ) : following.length === 0 ? (
        <div className="follow-empty-block">
          <div className="follow-empty-text">팔로잉이 없습니다.</div>
        </div>
      ) : (
        <ul>
          {following.map((user) => (
            <li key={user.id}>{user.nickname}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
