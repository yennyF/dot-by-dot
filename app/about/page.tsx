import AppHeader from "../components/AppHeader/AppHeader";

export default function About() {
  return (
    <>
      <AppHeader></AppHeader>
      <div className="flex w-screen justify-center">
        <div className="mb-[200px] max-w-[800px]">
          <h1 className="mt-[100px] text-4xl font-bold">About</h1>
        </div>
      </div>
    </>
  );
}
