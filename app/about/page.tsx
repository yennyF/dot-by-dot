import { ExclamationTriangleIcon, MagicWandIcon } from "@radix-ui/react-icons";
import AppHeader from "../components/AppHeader/AppHeader";

export default function About() {
  return (
    <>
      <AppHeader></AppHeader>

      <main className="m-auto flex w-[88vw] max-w-[800px] flex-col gap-[70px]">
        <section className="mt-[100px]">
          <h1 className="text-4xl font-bold">Hello</h1>
          <h2 className="mt-[20px] text-2xl">
            This app isn’t about nagging you to get things done — it simply
            helps you see what you’ve been working on.
          </h2>
          <p className="mt-[20px] text-[var(--gray-9)]">
            Track your effort, notice where your time goes, and try to keep a
            nice balance across your habits {":)"}
          </p>
        </section>

        <section>
          <h3 className="flex items-center gap-3 text-lg font-semibold">
            <ExclamationTriangleIcon className="size-5" /> Heads up
          </h3>
          <p className="mt-[10px]">
            - More is on the way! The app’s still experimental, which means
            exciting new features coming — and yes, a few bugs too.
            <br />
            <br />- For now, all your data is stored locally in your browser, so
            it’s only accessible from the same device and browser you’re using.
          </p>
        </section>

        <section>
          <h3 className="flex items-center gap-3 text-lg font-semibold">
            <MagicWandIcon className="size-5" /> See what’s under the hood
          </h3>
          <p className="mt-[10px]">
            Take a peek at the code here:{" "}
            <a
              href="https://github.com/yennyF/dot-by-dot"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--accent)] hover:text-[var(--inverted)] hover:underline"
            >
              view on GitHub
            </a>
          </p>
        </section>
      </main>
    </>
  );
}
