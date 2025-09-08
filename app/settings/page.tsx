"use client";

import { useEffect } from "react";
import AppHeader from "../components/AppHeader";
import ClearHistoryDialog from "./ClearHistoryDialog";
import ResetDialog from "./ResetDialog";
import { useRouter } from "next/navigation";
import { useAppStore } from "../stores/appStore";
import Loading from "../components/Loading/Loading";
import GoBackButton from "../components/GoBackButton";
import { useUserStore } from "../stores/userStore";

export default function SettingsPage() {
  const router = useRouter();
  const user = useUserStore((s) => s.user);
  const isDataEmpty = useAppStore((s) => s.isDataEmpty);

  useEffect(() => {
    if (user === null) {
      router.replace("/product");
    } else if (isDataEmpty === true) {
      router.replace("/start");
    }
  }, [user, isDataEmpty, router]);

  return isDataEmpty === false ? <Content /> : <Loading />;
}

function Content() {
  return (
    <>
      <AppHeader />
      <main className="page-main flex flex-col gap-[50px]">
        <GoBackButton />

        <section>
          <h1 className="page-title-1">Settings</h1>

          <div className="flex flex-col gap-[50px]">
            <div>
              <h2 className="page-title-2">Clear history</h2>
              <Separator />
              <p>Remove all your progress, but keep your habits.</p>
              <ClearHistoryDialog>Clear history</ClearHistoryDialog>
            </div>

            <div>
              <h2 className="page-title-2">Reset account</h2>
              <Separator />
              <p>
                Delete all your habits, groups, and progress — like starting
                fresh.
              </p>
              <ResetDialog> Reset account</ResetDialog>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

function Separator() {
  return <div className="my-3 border-b-[1px] border-[var(--gray)]" />;
}
