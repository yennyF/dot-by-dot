"use client";

import { FormEvent, useRef, useState } from "react";
import { supabase } from "../../../supabase/server";
import AppHeader from "../../../components/AppHeader";
import LoadingIcon from "@/app/components/Loading/LoadingIcon";
import EmailInput from "../EmailInput";
import Link from "next/link";
import OTPForm from "../OTPForm";
import { useUserStore } from "@/app/stores/userStore";

export default function LoginPage() {
  const defaultEmail = useUserStore((state) => state.email);

  const [email, setEmail] = useState<string>(defaultEmail || "");
  const [showOPT, setShowOPT] = useState(email.length > 0);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validEmail = useRef(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      setIsLoading(true);
      const formData = new FormData(event.currentTarget);
      const email = formData.get("email");

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
          shouldCreateUser: false,
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
        setShowOPT(true);
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
            <div className="w-full">
              <label htmlFor={"email"} className="label-auth">
                Email
              </label>
              <EmailInput
                id="email"
                value={email}
                onValueChange={(value) => {
                  setEmail(value);
                  setShowOPT(false);
                }}
                onValid={(valid) => {
                  validEmail.current = valid;
                }}
              />
            </div>
          </form>

          {!showOPT ? (
            <>
              <button
                form="form-login"
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
            <OTPForm email={email} />
          )}
        </section>
      </main>
    </>
  );
}
