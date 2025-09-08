"use client";

import "./globals.scss";
import { ToastContainer } from "react-toastify";
import { useEffect } from "react";
import { supabase } from "./supabase/server";
import { useUserStore } from "./stores/userStore";

export default function RootLayoutContent({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const setUser = useUserStore((s) => s.setUser);

  useEffect(() => {
    // 1. Check session on load
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
    });

    // 2. Listen for changes
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => listener.subscription.unsubscribe();
  }, [setUser]);

  return (
    <>
      {children}
      <ToastContainer autoClose={false} draggable={false} />
    </>
  );
}
