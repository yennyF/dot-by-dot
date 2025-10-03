"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../../supabase/server";
import { unstable_OneTimePasswordField as OneTimePasswordField } from "radix-ui";
import LoadingIcon from "@/app/components/Loading/LoadingIcon";

export default function OTPSection({ email }: { email: string }) {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const opt = formData.get("opt");

    if (!opt || typeof opt !== "string" || opt.length !== 6) {
      setError("Invalid data");
      return;
    }

    try {
      setIsLoading(true);

      const { error } = await supabase.auth.verifyOtp({
        email,
        token: opt,
        type: "email",
      });

      if (error) {
        console.error(error);
        setError("Your login code was incorrect. Please try again.");
      } else {
        router.push("/home");
      }
    } catch (error) {
      console.error(error);
      setError("Something unexpected happened. Please try again");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <section className="m-auto mt-[20px] w-[320px]">
      {/* <h1 className="mb-[15px] text-2xl font-bold">One-Time-Password</h1> */}

      <p className="mb-[25px] text-xs text-[var(--gray-9)]">
        {/* Enter the code sent to <b className="font-bold">{email}</b> */}
        This account requires email verification. Please check your inbox and
        paste in the verification code.
      </p>

      <form id="form-opt" onSubmit={handleSubmit} className="w-fit">
        <label className="label-auth">Verification code</label>
        <OneTimePasswordField.Root
          name="otp"
          className="flex flex-nowrap gap-2"
        >
          {Array.from({ length: 6 }).map((_, i) => (
            <OneTimePasswordField.Input
              key={i}
              className="h-[35px] w-[30px] appearance-none rounded bg-white text-center shadow-[0_0_0_1px_var(--gray)] outline-none hover:shadow-[0_0_0_1px_var(--gray-9)] focus:shadow-[0_0_0_1px_black]"
            />
          ))}
          <OneTimePasswordField.HiddenInput />
        </OneTimePasswordField.Root>
      </form>

      <button
        form="form-opt"
        className="button-accent relative m-auto my-[30px] px-[45px]"
        type="submit"
        disabled={isLoading}
      >
        {isLoading && (
          <LoadingIcon className="absolute left-[20px] size-4 text-white" />
        )}
        Verify email
      </button>

      {error && (
        <div className="my-[12px] text-center text-xs text-[var(--red)]">
          {error}
        </div>
      )}
    </section>
  );
}
