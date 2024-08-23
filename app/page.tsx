"use client";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Home() {
  const { status } = useSession();
  const router = useRouter();

  const showSession = () => {
    if (status === "authenticated") {
      return (
        <>
        <Link className="btn-continue" href="/add">Add an entry</Link>
        <Link className="btn-continue" href="/update">Update an entry</Link>
        <Link className="btn-continue" href="/view">View an entry</Link>
        <button
          className="btn-warn"
          onClick={() => {
            signOut({ redirect: false }).then(() => {
              router.push("/");
            });

          }}
        >
          Sign Out
        </button>
        </>
      )
    } else if (status === "loading") {
      return (
        <span className="text-[#888] text-sm mt-7">Loading...</span>
      )
    } else {
      return (
        <Link
          href="/login"
          className="border border-solid border-black rounded"
        >
          Sign In
        </Link>
      )
    }
  }
  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <div className="text-xl font-bold">Home</div>
      {showSession()}
    </main>
  );
}