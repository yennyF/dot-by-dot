"use client";

import { DropdownMenu } from "radix-ui";
import { supabase } from "@/app/supabase/server";
import { ExitIcon, GearIcon } from "@radix-ui/react-icons";
import { useRouter } from "next/navigation";

export default function ProfileDropdown({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  return (
    <DropdownMenu.Root modal={false}>
      <DropdownMenu.Trigger asChild>{children}</DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          className="dropdown-content z-30 w-[160px]"
          side="bottom"
          align="end"
        >
          <DropdownMenu.Item
            className="dropdown-item dropdown-item-icon"
            onClick={() => {
              router.push("/settings");
            }}
          >
            <GearIcon /> Settings
          </DropdownMenu.Item>
          <DropdownMenu.Item
            className="dropdown-item dropdown-item-icon"
            onClick={async () => {
              await supabase.auth.signOut();
            }}
          >
            <ExitIcon /> Log out
          </DropdownMenu.Item>
          <DropdownMenu.Arrow className="arrow" />
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
