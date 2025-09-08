import {
  AppTooltip,
  AppTrigger,
  AppContent,
} from "@/app/components/AppTooltip";
import { GearIcon } from "@radix-ui/react-icons";
import { useRouter } from "next/navigation";

export default function SettingsButton() {
  const router = useRouter();

  return (
    <AppTooltip>
      <AppTrigger asChild>
        <button
          className="button-outline button-sm"
          onClick={() => {
            router.push("/settings");
          }}
        >
          <GearIcon />
        </button>
      </AppTrigger>
      <AppContent align="center">Settings</AppContent>
    </AppTooltip>
  );
}
