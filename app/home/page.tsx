"use client";
import AddData from "@/components/AddData"
import UpdateData from "@/components/UpdateData"
import ViewData from "@/components/ViewData"
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

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
                <AddData />
                <UpdateData />
                <ViewData />
            </div>
        </div>
    )
}