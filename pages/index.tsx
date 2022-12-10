import Link from "next/link";

export default function Home() {
  return (
    <>
      <main className="w-full flex items-center justify-center flex-grow">
        <Link href="/themes">
          <span className="text-3xl font-semibold">View Themes</span>
        </Link>
      </main>
    </>
  );
}
