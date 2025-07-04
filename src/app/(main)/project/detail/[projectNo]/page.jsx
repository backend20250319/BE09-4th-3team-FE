"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";

export default function Page() {
  const { projectNo } = useParams();
  const [project, setProject] = useState(null);

  useEffect(() => {
    if (projectNo) {
      axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/project/${projectNo}`).then((res) => {
        setProject(res.data.data);
      });
    }
  }, [projectNo]);

  if (!project) return <div>로딩중...</div>;

  return <div>{project.title}</div>;
}
