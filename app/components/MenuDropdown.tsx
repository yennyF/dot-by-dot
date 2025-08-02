"use client";

import { DropdownMenu } from "radix-ui";
import { useRouter } from "next/navigation";
import { GearIcon, HomeIcon, InfoCircledIcon } from "@radix-ui/react-icons";

export default function MenuDropdown({
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
          className="dropdown-content z-20 w-[160px]"
          side="bottom"
          align="start"
        >
          <DropdownMenu.Item
            className="dropdown-item flex items-center gap-2"
            onClick={() => {
              router.push("/");
            }}
          >
            <HomeIcon />
            Home
          </DropdownMenu.Item>
          <DropdownMenu.Item
            className="dropdown-item flex items-center gap-2"
            onClick={() => {
              router.push("/settings");
            }}
          >
            <GearIcon />
            Settings
          </DropdownMenu.Item>
          <DropdownMenu.Item
            className="dropdown-item flex items-center gap-2"
            onClick={async () => {
              router.push("/about");
            }}
          >
            <InfoCircledIcon />
            About
          </DropdownMenu.Item>
          <DropdownMenu.Arrow className="arrow" />
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
