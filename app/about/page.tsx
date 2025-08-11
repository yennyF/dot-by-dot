import { GitHubLogoIcon } from "@radix-ui/react-icons";
import AppHeader from "../components/AppHeader/AppHeader";

export default function About() {
  return (
    <>
      <AppHeader></AppHeader>
      <div className="flex w-screen justify-center">
        <div className="mb-[200px] max-w-[800px]">
          <h1 className="mt-[100px] text-4xl font-bold">About</h1>
          <p className="mt-[30px]">
            Hi 👋 — This little app helps you (and me!) keep track daily tasks
            and habits. It’s simple on purpose: no clutter, just a place to add
            what matters and check it off.
          </p>

          <h2 className="mt-[60px] text-lg font-semibold">More on the way</h2>
          <p className="mt-[10px]">
            I’m still building and experimenting, so expect new features soon —
            like stats, progress tracking, and more ways to view your habits.
          </p>

          <h3 className="mt-[60px] text-lg font-semibold">Data storage</h3>
          <p className="mt-[10px]">
            For now, all data is stored locally in your browser, so it’s only
            accessible from the same browser and device you’ve been using.
          </p>

          {/* <p className="mt-[30px]">
            Fun fact: the “Load Sample Data” button exists so I can test the app
            without touching my real tasks!
          </p> */}

          <p className="mt-[60px]">
            It’s open source — peek at the code here:{" "}
            <a
              href="https://github.com/yennyF/ticked"
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
            >
              View on GitHub
              <GitHubLogoIcon className="ml-2 inline" />
            </a>
          </p>
        </div>
      </div>
    </>
  );
}
