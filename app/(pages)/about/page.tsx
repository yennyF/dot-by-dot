import { ExclamationTriangleIcon, MagicWandIcon } from "@radix-ui/react-icons";
import AppHeader from "../../components/AppHeader";

export default function AboutPage() {
  return (
    <>
      <AppHeader />
      <main className="page-main flex flex-col gap-[50px]">
        <h1 className="text-xl font-bold text-[var(--gray-9)]">
          About dot by dot
        </h1>

        <section>
          <h2 className="page-title-1">The thought behind it</h2>
          <p>
            Hello there! I built this little app to help you (and me!) keep
            track of your habits. It’s not about nagging you to get things done
            — it’s about giving you a clear picture of what you’ve been doing
            and what you might be skipping
          </p>
          <br />
          <p>
            Sometimes we pour all our energy into one thing and forget about the
            rest — like focusing too much on work. Becoming aware of those
            patterns can help you find a healthier balance and understand what
            might be holding you back from reaching your goals.
          </p>
          <br />
          <p className="text-[var(--gray-9)]">
            Progress isn’t one big leap — it is the mix of many things, repeated
            over time. Every effort counts, even the small ones!
          </p>
        </section>

        <section>
          <h2 className="page-title-2 flex items-center gap-3">
            <ExclamationTriangleIcon className="size-5" /> Heads up
          </h2>
          <p>
            - More is on the way! The app’s still experimental, which means new
            features coming — and yes, a few bugs too.
          </p>
        </section>

        <section>
          <h2 className="page-title-2 flex items-center gap-3">
            <MagicWandIcon className="size-5" /> See what’s under the hood
          </h2>
          <p>
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
