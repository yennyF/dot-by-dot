"use client";

import { FormEvent, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../../supabase/server";
import AppHeader from "../../../components/AppHeader";
import LoadingIcon from "@/app/components/Loading/LoadingIcon";
import NameInput from "../NameInput";
import { PasswordInputSignUp } from "../PasswordInput";
import { EmailInputSignUp } from "../EmailInput";
import {
  notifySuccessful,
  notifyUnexpectedError,
} from "@/app/components/Notification";
import Link from "next/link";

export default function SignUpPage() {
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
    const name = formData.get("name");
    const email = formData.get("email");
    const password = formData.get("password");

    if (
      typeof name !== "string" ||
      typeof email !== "string" ||
      typeof password !== "string"
    ) {
      setError("Invalid data");
      return;
    }

    try {
      setIsLoading(true);

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            display_name: name,
          },
        },
      });

      if (error) {
        console.error(error.message);
        setError(
          "We couldn’t log you in. Please try again with a different email or password."
        );
      } else if (data.user) {
        if (!data.user.identities || data.user.identities.length === 0) {
          setError(
            "We couldn’t log you in. Please try again with a different email"
          );
        } else {
          setError(null);
          notifySuccessful(
            "Account created! Welcome aboard — you’re all set to sign in"
          );
          router.push("/login");
        }
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
            <NameInput id="name" onValidChange={handleValidChange} />
            <EmailInputSignUp id="email" onValidChange={handleValidChange} />
            <PasswordInputSignUp
              id="password"
              onValidChange={handleValidChange}
            />
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
            Create account
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
