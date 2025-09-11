import LoadingIcon from "./LoadingIcon";

export default function Loading() {
  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <LoadingIcon className="-ml-1 mr-3 size-5 text-[var(--black)]" />
    </div>
  );
}
