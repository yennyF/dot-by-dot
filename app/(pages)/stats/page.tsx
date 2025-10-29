"use client";

import { useEffect, useState } from "react";
import AppHeader from "../../components/AppHeader";
import Loading from "../../components/Loading/Loading";
import { notifyLoadError } from "../../components/Notification";
import { useAppStore } from "../../stores/appStore";
import { useRouter } from "next/navigation";
import { useUserStore } from "../../stores/userStore";
import GoBackButton from "@/app/components/GoBackButton";
import { supabase } from "@/app/supabase/server";
import { Group } from "@/app/types";
import { GroupSection } from "./GroupSection";
import { PageSection } from "./PageSection";

export default function HomePage() {
  const router = useRouter();

  const user = useUserStore((s) => s.user);
  const init = useAppStore((s) => s.init);
  const isEmpty = useAppStore((s) => s.isEmpty);

  useEffect(() => {
    if (user === undefined) return;
    if (user === null) {
      router.replace("/product");
    } else {
      init().catch(() => {
        notifyLoadError();
      });
    }
  }, [user, init, router]);

  useEffect(() => {
    if (isEmpty === undefined) return;
    if (isEmpty === true) {
      router.replace("/start");
    }
  }, [isEmpty, router]);

  return user && isEmpty === false ? <Content /> : <Loading />;
}

function Content() {
  const [groups, setGroups] = useState<Pick<Group, "id" | "name">[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const { data, error } = await supabase
          .from("groups")
          .select("id, name")
          .order("order", { ascending: true });

        if (error) throw error;

        setGroups(data || []);
      } catch (error) {
        console.error(error);
        throw error;
      }
    })();
  }, []);

  return (
    <>
      <AppHeader></AppHeader>
      <main className="page-main flex flex-col gap-[50px]">
        <GoBackButton />

        <h1 className="page-title-1">Stats</h1>

        <PageSection />

        {groups.map((group) => (
          <GroupSection key={group.id} group={group} />
        ))}
      </main>
    </>
  );
}
