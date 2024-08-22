"use client";

import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import AddOrUpdateEntry from "@/components/AddOrUpdateEntry";
import { useEffect, useState } from "react";
import SearchForm from "@/components/SearchForm";
import Link from "next/link";
import { Utils } from "@/lib/utils";


export default function AddEntry() {
    const { status } = useSession();
    const router = useRouter();
    let utils = new Utils();
    const [isAddingOwner, setIsAddingOwner] = useState(false);
    const [isSearchingLandOwner, setIsSearchingLandOwner] = useState(false);
    const [isAddingLand, setIsAddingLand] = useState(false);
    const [ownerName, setOwnerName] = useState('');
    const [ownerAddress, setOwnerAddress] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        console.log(isAddingLand, isAddingOwner, isSearchingLandOwner)
    }, [isAddingLand, isSearchingLandOwner, isAddingOwner]);

    const handleSubmitOwnerSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        const result = await utils.ReadOwner(ownerName, ownerAddress, 1, 5)
        if (!result[0]) {
            setError(result[1] as string);
        } else {
            setError('');
            setOwnerName((result[1] as string[])[0])
            setOwnerAddress((result[1] as string[])[3])
            console.log(ownerName, ownerAddress)
            setIsAddingLand(true);
            setIsSearchingLandOwner(false);
        }
    }

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
                {!isAddingOwner && !isAddingLand && (
                    <>
                    <button onClick={() => setIsAddingOwner(true)} className="w-full border border-solid border-black rounded">
                        Add a new owner
                    </button>
                    <button onClick={() => {
                        setIsSearchingLandOwner(true);
                        setIsAddingLand(true);
                    }} className="w-full border border-solid border-black rounded">
                        Add a land holding to an existing owner
                    </button>
                    <Link href="/" className="m-3 py-2 px-4 rounded-md text-white bg-indigo-600" >Back</Link>
                    </>
                )}
                {isAddingOwner && (
                    <>
                    <AddOrUpdateEntry backButton={false}/>
                    <button onClick={() => {
                        setIsAddingOwner(false);
                    }} className="m-3 py-2 px-4 rounded-md text-white bg-indigo-600" >Back</button>
                    </>
                )}
                {isSearchingLandOwner && (
                    <>
                    <SearchForm submitFunc={handleSubmitOwnerSearch} setFirst={setOwnerName} setSecond={setOwnerAddress} firstLabel="Owner Name" secondLabel="Owner Address" />
                    {error && <div className="bg-red-500 text-white p-1 w-fit">{error}</div>}
                    <button onClick={() => {
                        setIsSearchingLandOwner(false);
                        setIsAddingLand(false);
                        setError('');
                    }} className="m-3 py-2 px-4 rounded-md text-white bg-indigo-600" >Back</button>
                    </>
                )}
                {isAddingLand && !isSearchingLandOwner && (
                    <>
                    <AddOrUpdateEntry isAddingLand={true} isUpdating={false} isUpdatingOwner={false} />
                    </>
                )}
            </div>
        </div>
    )
}