import { FormEvent } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "./supabase/server";
import { useUserStore } from "./stores/userStore";
import { mapUserResponse } from "./types/user";

export default function LoginPage() {
  const router = useRouter();

  const setUser = useUserStore((s) => s.setUser);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const email = formData.get("email");
    const password = formData.get("password");

    // const response = await fetch("/api/auth/login", {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify({ email, password }),
    // });

    // if (response.ok) {
    //   console.log("Login successful");
    //   // router.push("/profile");
    // } else {
    //   // Handle errors
    // }

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

    console.log("Logged in:", data);

    setUser(mapUserResponse(data.user));
  }

  return (
    <form onSubmit={handleSubmit}>
      <input type="email" name="email" placeholder="Email" required />
      <input type="password" name="password" placeholder="Password" required />
      <button type="submit">Login</button>
    </form>
  );
}
