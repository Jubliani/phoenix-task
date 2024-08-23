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
        setError('');
        const result = await utils.ReadOwner(ownerName, ownerAddress, 1, 5)
        if (!result[0]) {
            setError(result[1] as string);
            return;
        }
        setOwnerName((result[1] as string[])[0])
        setOwnerAddress((result[1] as string[])[3])
        console.log(ownerName, ownerAddress)
        setIsAddingLand(true);
        setIsSearchingLandOwner(false);
    }

    const setVarsAndErrors = (param: boolean) => {
        setIsSearchingLandOwner(param);
        setIsAddingLand(param);
        setError('')
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
        <>
            {!isAddingOwner && !isAddingLand && (
                <div className="flex min-h-screen flex-col items-center justify-center">
                    <button onClick={() => setIsAddingOwner(true)} className="btn-continue">
                        Add a new owner
                    </button>
                    <button onClick={() => {
                        setIsSearchingLandOwner(true);
                        setIsAddingLand(true);
                    }} className="btn-continue">
                        Add a land holding to an existing owner
                    </button>
                    <Link href="/" className="btn-back" >Back</Link>
                </div>
            )}
            {isAddingOwner && (
                <div className="min-h-screen flex flex-col items-center justify-center">
                <AddOrUpdateEntry backButton={false}/>
                <button onClick={() => {
                    setIsAddingOwner(false);
                }} className="btn-back" >Back</button>
                </div>
            )}
            {isSearchingLandOwner && (
                <div className="min-h-screen flex flex-col items-center justify-center">
                    <SearchForm submitFunc={handleSubmitOwnerSearch} setFirst={setOwnerName} setSecond={setOwnerAddress} buttonFunc={setVarsAndErrors}
                    firstLabel="Owner Name" secondLabel="Owner Address" />
                    {error && <div className="error-msg">{error}</div>}
                </div>
            )}
            {isAddingLand && !isSearchingLandOwner && (
                <>
                <AddOrUpdateEntry isAddingLand={true} isUpdating={false} isUpdatingOwner={false} properties={[ownerName, ownerAddress]}/>
                </>
            )}
        </>
    )
}