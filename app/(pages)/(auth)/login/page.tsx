"use client";

import { FormEvent, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../../supabase/server";
import AppHeader from "../../../components/AppHeader";
import LoadingIcon from "@/app/components/Loading/LoadingIcon";
import { PasswordInputLogin } from "../PasswordInput";
import { EmailInputLogin } from "../EmailInput";
import { notifyUnexpectedError } from "@/app/components/Notification";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const nonValidArray = useRef<Set<string>>(new Set());

  function handleValidChange(isValid: boolean, id: string) {
    if (isValid) {
      nonValidArray.current.delete(id);
    } else {
      nonValidArray.current.add(id);
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (nonValidArray.current.size > 0) {
      setError("Missing or invalid data");
      return;
    }

    const formData = new FormData(event.currentTarget);
    const email = formData.get("email");
    const password = formData.get("password");

    if (typeof email !== "string" || typeof password !== "string") {
      setError("Invalid data");
      return;
    }

    try {
      setIsLoading(true);

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error(error.message);
        setError(
          "We couldn’t log you in. Please try again with a different email or password."
        );
      } else if (data.user) {
        setError(null);
        router.push("/home");
      } else {
        setError("Something unexpected happened. Please try again");
      }
    } catch (error) {
      console.error(error);
      notifyUnexpectedError();
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <AppHeader>
        <div className="flex flex-1 items-center justify-end gap-10"></div>
      </AppHeader>
      <main className="page-main">
        <section className="m-auto mt-[80px] w-[320px]">
          <h1 className="mb-[15px] text-2xl font-bold">
            Sign in to your account
          </h1>

          <p className="mb-[30px]">
            Don&apos;t have an account?{" "}
            <Link href="/signUp" className="text-[var(--inverted)]">
              Join here
            </Link>
          </p>

          <form
            id="form-login"
            onSubmit={handleSubmit}
            className="flex flex-col items-center gap-[15px]"
          >
            <EmailInputLogin id="email" onValidChange={handleValidChange} />
            <PasswordInputLogin
              id="password"
              onValidChange={handleValidChange}
            />
          </form>

          <button
            form="form-login"
            className="button-accent relative m-auto my-[30px] px-[45px]"
            type="submit"
            disabled={isLoading}
          >
            {isLoading && (
              <LoadingIcon className="absolute left-[20px] size-4 text-white" />
            )}
            Sign in
          </button>

          {error && (
            <div className="my-[12px] text-center text-xs text-[var(--red)]">
              {error}
            </div>
          )}
        </section>
      </main>
    </>
  );
}
