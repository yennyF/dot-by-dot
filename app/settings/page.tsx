"use client";

import { ReactNode, useRef, useState } from "react";
import { Id, toast } from "react-toastify";
import { notifyLoading, notifyLoadError } from "../components/Notification";
import { db } from "../repositories/db";
import { useRouter } from "next/navigation";
import AppHeader from "../components/AppHeader/AppHeader";

export default function Settings() {
  const toastId = useRef<Id>(null);

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const router = useRouter();

  async function clearHistory() {
    setIsLoading(true);

    if (toastId.current) toast.dismiss(toastId.current);
    toastId.current = notifyLoading();

    try {
      await db.tracks.clear();
      router.push("/");
    } catch (error) {
      console.error(error);
      notifyLoadError();
    }

    toast.dismiss(toastId.current);
    setIsLoading(false);
  }

  async function deleteDB() {
    setIsLoading(true);

    if (toastId.current) toast.dismiss(toastId.current);
    toastId.current = notifyLoading();

    try {
      db.tables.forEach((table) => table.clear());
      router.push("/");
    } catch (error) {
      console.error(error);
      notifyLoadError();
    }

    toast.dismiss(toastId.current);
    setIsLoading(false);
  }

  return (
    <>
      <AppHeader></AppHeader>
      <div className="flex w-screen justify-center">
        <div className="mb-[200px] max-w-[800px]">
          <h1 className="mt-[100px] text-4xl font-bold">Settings</h1>

          <div className="mt-[80px] flex flex-col gap-[60px]">
            <div>
              <Subhead>
                <h2 className="text-xl font-bold">Clear history</h2>
              </Subhead>
              <span className="block">
                This will remove all your progress — like streaks and
                completions — but keep your habits.
                {/* Once you delete your history, there is no going back. Please be
              certain. */}
              </span>
              <button
                className="button-outline mt-[15px]"
                disabled={isLoading}
                onClick={clearHistory}
              >
                Clear history
              </button>
            </div>

            <div>
              <Subhead>
                <h2 className="text-xl font-bold">Reset account</h2>
              </Subhead>
              <div>
                <span className="mt-2 block">
                  This will fully reset your account: it will delete all your
                  habits, groups, and tracking history — like starting fresh.
                  {/* Once you delete your history, there is no going back. Please be
                certain. */}
                </span>
                <button
                  className="button-outline mt-[15px]"
                  disabled={isLoading}
                  onClick={deleteDB}
                >
                  Reset account
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function Subhead({ children }: { children: ReactNode }) {
  return (
    <div className="mb-2 border-b-[1px] border-[var(--gray)] pb-2">
      {children}
    </div>
  );
}
