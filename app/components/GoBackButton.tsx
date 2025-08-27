import { ArrowLeftIcon } from "@radix-ui/react-icons";
import { useRouter } from "next/navigation";

export default function GoBackButton() {
  const router = useRouter();

  return (
    <button className="flex items-center gap-2" onClick={() => router.back()}>
      <ArrowLeftIcon />
      Go back
    </button>
  );
}
