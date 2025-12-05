"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import AppHeader from "../../components/AppHeader";
import { useUserStore } from "../../stores/userStore";
import ImageGallery from "./ImageGallery";
import { ViewGridIcon, ViewHorizontalIcon } from "@radix-ui/react-icons";

const basePath = process.env.NODE_ENV === "production" ? "/dot-by-dot" : "";

export default function ProductPage() {
  const router = useRouter();
  const user = useUserStore((s) => s.user);

  const images = [
    `${basePath}/preview-row.png`,
    `${basePath}/preview-grid.png`,
  ];

  return (
    <>
      <AppHeader />
      <main className="page-main !max-w-none">
        <section className="m-auto w-full max-w-[600px] text-center">
          <h1 className="page-title-1 mb-[20px]">
            One habit at a time
            {/* Progress is made of small repeats */}
          </h1>
          <p className="m-auto text-lg">
            This app isn’t about reminding you to get things done — it helps you
            track what you’ve been working on.
          </p>
          <div className="mb-[10px] mt-[40px] flex items-center justify-center gap-5">
            <button
              className="button-accent"
              onClick={() => {
                if (user === undefined) return;
                if (user) {
                  router.push("/start");
                } else {
                  router.push("/signUp");
                }
              }}
            >
              Get started
            </button>
          </div>
        </section>

        <ImageGallery.Root>
          <div className="mt-[50px]">
            <div className="my-[20px] flex justify-center gap-[15px]">
              <ImageGallery.Button value={0}>
                <ViewHorizontalIcon />
              </ImageGallery.Button>
              <ImageGallery.Button value={1}>
                <ViewGridIcon />
              </ImageGallery.Button>
            </div>
            <ImageGallery.Content>
              {images.map((src, index) => (
                <ImageGallery.Item key={index} value={index}>
                  <Image
                    src={src}
                    alt="App preview"
                    priority={true}
                    fill
                    className="object-contain object-top"
                  />
                  {/* <video
                  width="max-w-[1200px]"
                  autoPlay
                  muted
                  loop
                  playsInline
                  controlsList="nodownload"
                >
                  <source
                    src={`${basePath}/preview-row.mp4`}
                    type="video/mp4"
                  />
                  Your browser does not support the video tag.
                </video> */}
                </ImageGallery.Item>
              ))}
            </ImageGallery.Content>
          </div>
        </ImageGallery.Root>

        <section className="m-auto max-w-[1000px] py-[120px]">
          <div className="m-auto max-w-[500px] text-center">
            <h2 className="mb-[10px] text-xl font-bold">
              Progress is made of small repeats
            </h2>
            <p className="text-base text-[var(--gray-9)]">
              Track your effort, notice where your time goes, and keep a better
              balance across your habits {":)"}
            </p>
          </div>
        </section>
      </main>
    </>
  );
}
