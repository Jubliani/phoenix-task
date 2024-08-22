"use client";
import AddOrUpdateEntry from "@/components/AddOrUpdateEntry";
import { useState } from "react"
import Link from "next/link";

export default function Homepage() {

    const [isUpdatingOwner, setIsUpdatingOwner] = useState(false);
    const [isUpdatingLand, setIsUpdatingLand] = useState(false);
    return (
        <>
        {!isUpdatingOwner && !isUpdatingLand && (
            <div className="grid place-items-center h-screen">
                <div className="grid">
                    <button onClick={() => setIsUpdatingOwner(true)} className="w-full border border-solid border-black rounded">
                        Update an owner
                    </button>
                    <button onClick={() => setIsUpdatingLand(true)} className="w-full border border-solid border-black rounded">
                        Update a land holding
                    </button>
                    <Link href="/" className="m-3 py-2 px-4 rounded-md text-white bg-indigo-600" >Back</Link>
                </div>
            </div> 
        )}
        {isUpdatingOwner && (
            <>
            <AddOrUpdateEntry isUpdating={true} isUpdatingOwner={true}/>
            <button onClick={() => setIsUpdatingOwner(false)} className="w-full border border-solid border-black rounded">
                Back
            </button>
            </>
        )}
        {isUpdatingLand && (
            <>
            <AddOrUpdateEntry isUpdating={true} isUpdatingOwner={false}/>
            <button onClick={() => setIsUpdatingLand(false)} className="w-full border border-solid border-black rounded">
                Back
            </button>
            </>
        )}
        </>
    )
}