"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import AppHeader from "../components/AppHeader";
import { useUserStore } from "../stores/userStore";

export default function ProductPage() {
  const router = useRouter();
  const user = useUserStore((s) => s.user);

  return (
    <>
      <AppHeader />
      <main className="page-main !max-w-none">
        <section className="m-auto w-full max-w-[600] text-center">
          <h1 className="page-title-1 mb-[20px]">
            One habit at a time
            {/* Progress is made of small repeats */}
          </h1>
          <p className="m-auto text-lg">
            This app isn’t about reminding you to get things done — it helps you
            track what you’ve been working on.
          </p>
          <div className="mb-[10px] mt-[40px] flex items-center justify-center gap-5">
            <button
              className="button-accent"
              onClick={() => {
                if (user) {
                  router.push("/start");
                } else {
                  router.push("/login");
                }
              }}
            >
              Get started
            </button>
          </div>
        </section>

        <div
          className="relative m-auto w-full max-w-[1000]"
          style={{ aspectRatio: "16 / 9" }}
        >
          <Image
            src="/preview.png"
            alt="App preview"
            priority={true}
            fill
            className="object-cover"
          />
        </div>

        {/* <section className="m-auto max-w-[600] py-[100px] text-center">
          <h2 className="mb-[10px] text-xl font-bold">
            Progress is made of small repeats
          </h2>
          <p className="text-base text-[var(--gray-9)]">
            Track your effort, notice where your time goes, and keep a better
            balance across your habits {":)"}
          </p>
        </section> */}
      </main>
    </>
  );
}
