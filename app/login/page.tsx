"use client";

import { FormEvent } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../supabase/server";
import AppHeader from "../components/AppHeader";

export default function LoginPage() {
  const router = useRouter();

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const email = formData.get("email");
    const password = formData.get("password");

    if (typeof email !== "string" || typeof password !== "string") {
      console.error("Invalid form data");
      return;
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      console.error(error.message);
      return;
    }
    if (!data.user) {
      return;
    }
    router.push("/dashboard");
  }

  return (
    <>
      <AppHeader>
        <div className="flex flex-1 items-center justify-end gap-10"></div>
      </AppHeader>
      <main className="mt-[70px] flex h-[calc(100dvh-70px)] flex-col items-center justify-center">
        <h1>Sign in</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label
              htmlFor="email"
              className="block text-xs text-[var(--gray-9)]"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              name="email"
              placeholder="Email"
              className="bg-white"
              required
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-xs text-[var(--gray-9)]"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              name="password"
              placeholder="Password"
              className="bg-white"
              required
            />
          </div>
          <button className="button-accent" type="submit">
            Sign in
          </button>
        </form>
      </main>
    </>
  );
}
