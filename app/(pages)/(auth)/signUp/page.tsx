"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { supabase } from "../../../supabase/server";
import AppHeader from "../../../components/AppHeader";
import LoadingIcon from "@/app/components/Loading/LoadingIcon";
import NameInput from "../NameInput";
import EmailInput from "../EmailInput";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/app/stores/userStore";

export default function SignUpPage() {
  const email = useUserStore((state) => state.email);
  const setEmail = useUserStore((state) => state.setEmail);

  useEffect(() => {
    setEmail(undefined);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <AppHeader>
        <div className="flex flex-1 items-center justify-end gap-10"></div>
      </AppHeader>
      <main className="page-main">
        {email ? <SuccessfulContent /> : <SignUpContent />}
      </main>
    </>
  );
}

function SignUpContent() {
  const setEmail = useUserStore((state) => state.setEmail);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validEmail = useRef(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      setIsLoading(true);
      const formData = new FormData(event.currentTarget);
      const name = formData.get("name");
      const email = formData.get("email");

      if (typeof name !== "string" || name.length === 0) {
        setError("Invalid name");
        return;
      }
      if (
        typeof email !== "string" ||
        email.length === 0 ||
        !validEmail.current
      ) {
        setError("Invalid email address");
        return;
      }

      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          shouldCreateUser: true,
          emailRedirectTo: undefined, // this is key! don't set redirect
          data: {
            display_name: name,
          },
        },
      });

      if (error) {
        console.log(error.status, error.code, error.message);
        if (error.status === 429) {
          setError(
            "Too many login attempts. Please wait a minute before trying again"
          );
        } else {
          setError(
            "We couldn’t log you in. Please try again with a different email"
          );
        }
      } else {
        setError(null);
        setEmail(email);
      }
    } catch (error) {
      console.error(error);
      setError("Something unexpected happened. Please try again");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <section className="m-auto mt-[80px] w-[320px]">
      <h1 className="mb-[15px] text-2xl font-bold">Create your account</h1>

      <p className="mb-[30px]">
        Already have an account?{" "}
        <Link href="/login" className="text-[var(--inverted)]">
          Login
        </Link>
      </p>

      <form
        id="form-signUp"
        onSubmit={handleSubmit}
        autoComplete="off"
        className="flex flex-col items-center gap-[15px]"
      >
        <div className="w-full">
          <label htmlFor={"name"} className="label-auth flex justify-between">
            Name
          </label>
          <NameInput id="name" />
        </div>
        <div className="w-full">
          <label htmlFor={"email"} className="label-auth">
            Email
          </label>
          <EmailInput
            id="email"
            onValid={(valid) => {
              validEmail.current = valid;
            }}
          />
        </div>
      </form>

      <button
        form="form-signUp"
        className="button-accent relative m-auto my-[30px] px-[45px]"
        type="submit"
        disabled={isLoading}
      >
        {isLoading && (
          <LoadingIcon className="absolute left-[20px] size-4 text-white" />
        )}
        Continue
      </button>

      {error && (
        <div className="my-[12px] text-center text-xs text-[var(--red)]">
          {error}
        </div>
      )}
    </section>
  );
}

function SuccessfulContent() {
  const router = useRouter();
  const email = useUserStore((state) => state.email);

  return (
    <section className="m-auto mt-[80px] w-[320px]">
      <h1 className="mb-[15px] text-2xl font-bold">Create your account</h1>

      <p>
        A verification code has been sent to: <b>{email}</b>, use it to log in
        and get started!
      </p>

      <button
        form="form-signUp"
        className="button-accent relative m-auto my-[30px] px-[45px]"
        onClick={() => {
          router.push("/login");
        }}
      >
        Go to log in
      </button>
    </section>
  );
}
