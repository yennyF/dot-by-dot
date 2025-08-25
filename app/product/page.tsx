"use client";

import { useEffect, useRef, useState } from "react";
import {
  notifyLoadError,
  notifyLoading,
  notifySuccessful,
} from "../components/Notification";
import { Id, toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { useAppStore } from "../stores/AppStore";
import Image from "next/image";
import TestButton from "./TestButton";
import AppHeader from "../components/AppHeader/AppHeader";
import Loading from "../components/Loading/Loading";

export default function Product() {
  const router = useRouter();

  const isDataEmpty = useAppStore((s) => s.isDataEmpty);

  useEffect(() => {
    if (isDataEmpty === false) {
      router.replace("/");
    }
  }, [isDataEmpty, router]);

  return isDataEmpty === true ? <Content /> : <Loading />;
}

function Content() {
  const router = useRouter();

  const startMock = useAppStore((s) => s.startMock);

  const [isLoading, setIsLoading] = useState(false);
  const toastId = useRef<Id>(null);

  async function handleClickTest() {
    if (isLoading) return;
    setIsLoading(true);

    if (toastId.current) toast.dismiss(toastId.current);
    toastId.current = notifyLoading();

    try {
      await startMock();
      toast.dismiss(toastId.current);
      notifySuccessful("Ready to start");
    } catch (error) {
      console.log(error);
      toast.dismiss(toastId.current);
      notifyLoadError();
    }

    setIsLoading(false);
  }

  return (
    <>
      <AppHeader />
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
              disabled={isLoading}
              onClick={() => router.push("/start")}
            >
              Get started
            </button>
            <TestButton disabled={isLoading} onClick={handleClickTest} />
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
