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
import AppHeader from "../components/AppHeader";
import Loading from "../components/Loading/Loading";
import clsx from "clsx";
import { AppTooltip, AppTrigger, AppContent } from "../components/AppTooltip";

export default function ProductPage() {
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
              disabled={isLoading}
              onClick={() => router.push("/start")}
            >
              Get started
            </button>
            <AppTooltip>
              <AppTrigger asChild>
                <button
                  className={clsx(
                    "cursor-pointer text-nowrap text-xs hover:text-[var(--inverted)] hover:underline",
                    isLoading &&
                      "text-[var(--gray)] hover:cursor-default hover:text-[var(--gray)] hover:no-underline"
                  )}
                  disabled={isLoading}
                  onClick={handleClickTest}
                >
                  Only here for testing
                </button>
              </AppTrigger>
              <AppContent className="p-2" side="right" sideOffset={10}>
                <h2 className="text-sm font-bold">Want a quick preview?</h2>

                <p className="mt-[10px] leading-relaxed">
                  Fill with sample data to explore the app.
                  <br />
                  You can reset the data anytime from Settings.
                </p>
              </AppContent>
            </AppTooltip>
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
