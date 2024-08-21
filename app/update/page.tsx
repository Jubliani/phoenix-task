"use client";
import AddOrUpdateEntry from "@/components/AddOrUpdateEntry";
import { useState } from "react"

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
                    <button onClick={() => setIsUpdatingOwner(false)} className="w-full border border-solid border-black rounded">
                        Update a land holding
                    </button>
                </div>
            </div> 
        )}
        {isUpdatingOwner && (
            <>
            <AddOrUpdateEntry isUpdating={true} />
            <button onClick={() => setIsUpdatingOwner(false)} className="w-full border border-solid border-black rounded">
                Update an owner
            </button>
            </>
        )}
        </>
    )
}