import { ArrowLeftIcon } from "@radix-ui/react-icons";
import { useRouter } from "next/navigation";

interface GoBackButtonProps {
  path?: string;
  children?: React.ReactNode;
}

export default function GoBackButton({ path, children }: GoBackButtonProps) {
  const router = useRouter();

  return (
    <button
      className="flex items-center gap-2"
      onClick={() => {
        if (path) router.push(path);
        else router.back();
      }}
    >
      <ArrowLeftIcon />
      {children || "Go back"}
    </button>
  );
}
