"use client";

import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import AddOrUpdateEntry from "@/components/AddOrUpdateEntry";


export default function AddEntry() {
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
        <>
            <AddOrUpdateEntry />
        </>
    )
}