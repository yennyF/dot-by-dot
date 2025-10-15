import {
  AppTooltip,
  AppTooltipTrigger,
  AppContentTrigger,
} from "@/app/components/AppTooltip";
import { GearIcon } from "@radix-ui/react-icons";
import { useRouter } from "next/navigation";

export default function SettingsButton() {
  const router = useRouter();

  return (
    <AppTooltip>
      <AppTooltipTrigger asChild>
        <button
          className="button-outline button-sm"
          onClick={() => {
            router.push("/settings");
          }}
        >
          <GearIcon />
        </button>
      </AppTooltipTrigger>
      <AppContentTrigger align="center">Settings</AppContentTrigger>
    </AppTooltip>
  );
}
