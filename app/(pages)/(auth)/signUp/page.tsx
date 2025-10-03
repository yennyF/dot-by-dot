"use client";

import { FormEvent, useRef, useState } from "react";
import { supabase } from "../../../supabase/server";
import AppHeader from "../../../components/AppHeader";
import LoadingIcon from "@/app/components/Loading/LoadingIcon";
import NameInput from "../NameInput";
import { EmailInputSignUp } from "../EmailInput";
import Link from "next/link";
import OTPSection from "../login/OTPSection";

export default function SignUpPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);

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

    if (typeof name !== "string" || typeof email !== "string") {
      setError("Invalid data");
      return;
    }

    try {
      setIsLoading(true);

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
        console.error(error.message);
        setError(
          "We couldn’t log you in. Please try again with a different email."
        );
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
          </form>

          {!email ? (
            <>
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
            </>
          ) : (
            <OTPSection email={email} />
          )}
        </section>
      </main>
    </>
  );
}
