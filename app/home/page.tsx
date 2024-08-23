"use client";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link"

export default function Homepage() {
    const { status } = useSession();
    const router = useRouter();
    if (status === "loading") {
        return (
            <span className="text-[#888] text-sm mt-7">Loading...</span>
        )
    } else if (status !== "authenticated") {
        router.push("/");
        return
    }
    return (
        <div className="grid place-items-center h-screen">
            <div className="grid">
                <Link className="btn-continue" href="/add">Add an entry</Link>
                <Link className="btn-continue" href="/update">Update an entry</Link>
                <Link className="btn-continue" href="/view">View an entry</Link>
            </div>
        </div>
    )
}