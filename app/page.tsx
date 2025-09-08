"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppStore } from "./stores/appStore";
import { useUserStore } from "./stores/userStore";

export default function Page() {
  const router = useRouter();
  const user = useUserStore((s) => s.user);
  const isDataEmpty = useAppStore((s) => s.isDataEmpty);

  useEffect(() => {
    if (user === undefined) return;
    if (user === null || isDataEmpty === true) {
      router.replace("/product");
    } else if (isDataEmpty === false) {
      router.push("/home");
    }
  }, [user, isDataEmpty, router]);

  return null;
}
