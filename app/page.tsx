"use client";

import Home from "./home/Home";
import LoginPage from "./login";
import { useUserStore } from "./stores/userStore";

// import Home from "./home/Home";

export default function Page() {
  const user = useUserStore((s) => s.user);

  if (user) {
    return <Home />;
  }
  return <LoginPage />;
}
