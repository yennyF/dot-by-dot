"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUserStore } from "../stores/userStore";

export default function Page() {
  const router = useRouter();
  const user = useUserStore((s) => s.user);

  useEffect(() => {
    if (user === undefined) return;
    if (user === null) {
      router.replace("/product");
    } else {
      router.replace("/home");
    }
  }, [user, router]);

  return null;
}
