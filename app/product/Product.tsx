"use client";

import { useRef, useState } from "react";
import {
  notifyLoadError,
  notifyLoading,
  notifySuccessful,
} from "../components/Notification";
import { Id, toast } from "react-toastify";
import AppHeader from "../components/AppHeader/AppHeader";
import { useAppStore } from "../stores/AppStore";
import Image from "next/image";
import TestButton from "./TestButton";
import { redirect, RedirectType } from "next/navigation";

export default function Product() {
  const startMock = useAppStore((s) => s.startMock);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const toastId = useRef<Id>(null);

  async function handleClickStartMock() {
    setIsLoading(true);

    if (toastId.current) toast.dismiss(toastId.current);
    toastId.current = notifyLoading();

    try {
      await startMock();
      toast.dismiss(toastId.current);
      notifySuccessful("Ready to start");
      redirect("/", RedirectType.replace);
    } catch {
      toast.dismiss(toastId.current);
      notifyLoadError();
    }

    setIsLoading(false);
  }

  return (
    <>
      <AppHeader></AppHeader>
      <main className="m-auto flex w-[88vw] flex-col items-center gap-[50px]">
        <section className="mt-[150px] w-full text-center">
          <h1 className="m-auto max-w-[800] text-4xl font-bold">
            One habit at a time
          </h1>
          <p className="m-auto mt-[20px] max-w-[800] text-lg">
            Progress is really just a bunch of small repeats.
            {/* Progress is an endless cycle of small repetitions and refinement. */}
          </p>
          <div
            className="relative m-auto w-full max-w-[1000]"
            style={{ aspectRatio: "16 / 9" }}
          >
            <Image
              src="/preview.png"
              alt="App preview"
              fill
              className="object-cover"
            />
          </div>
          <div className="m-auto w-fit">
            <button
              className="button-accent"
              onClick={() => redirect("/start")}
            >
              Get started
            </button>
            <TestButton isLoading={isLoading} onClick={handleClickStartMock} />
          </div>
        </section>

        {/* <section className="flex h-[100dvh] w-[800px] gap-[40px]">
          <div className="flex flex-1 shrink-0 flex-col justify-center">
            <h2 className="text-2xl font-bold">Process over outcome</h2>
            <h3 className="mt-[20px] text-xl">
              This app isn’t about nagging you to get things done, it helps you
              track what you’ve been working on.
            </h3>
            <p className="mt-[20px] text-[var(--gray-9)]">
              Track your effort, notice where your time goes, and keep a nice
              balance across your habits
            </p>
          </div>
        </section> */}
      </main>
    </>
  );
}
