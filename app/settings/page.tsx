"use client";

import { ReactNode } from "react";
import AppHeader from "../components/AppHeader/AppHeader";
import ClearHistoryDialog from "./ClearHistoryDialog";
import ResetDialog from "./ResetDialog";

export default function Setting() {
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
              </span>
              <ClearHistoryDialog>Clear history</ClearHistoryDialog>
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
                <ResetDialog> Reset account</ResetDialog>
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
