"use client";
import AddOrUpdateEntry from "@/components/AddOrUpdateEntry";
import { useState } from "react"
import Link from "next/link";
import { Utils } from "@/lib/utils";
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
    let utils = new Utils();
    const [isSearchingOwner, setIsSearchingOwner] = useState(false);
    const [isSearchingLand, setIsSearchingLand] = useState(false);
    const [isUpdatingOwner, setIsUpdatingOwner] = useState(false);
    const [isUpdatingLand, setIsUpdatingLand] = useState(false);

    const [ownerName, setOwnerName] = useState('');
    const [ownerAddress, setOwnerAddress] = useState('');
    const [legalEntity, setLegalEntity] = useState('');
    const [sectionName, setSectionName] = useState('');
    const [properties, setProperties] = useState<(string | boolean)[]>([]);
    const [error, setError] = useState('');

    const handleSubmitOwner = async (e: React.FormEvent) => {
        e.preventDefault()
        const result = await utils.ReadOwner(ownerName, ownerAddress, 1, 5)
        if (!result[0]) {
            setError(result[1] as string);
        } else {
            setError('');
            setProperties(result[1] as (string | boolean)[]);
            setIsUpdatingOwner(true);
            setIsSearchingOwner(false);
        }
    };

    const searchForm = (submitFunc: (e: React.FormEvent) => void, setFirst: (e: string) => void, 
    setSecond: (e: string) => void, firstLabel: string, secondLabel: string) => {
        return (
            <form onSubmit={submitFunc} className="flex flex-col gap-3">
                <label>
                    {firstLabel}
                </label>
                <input onChange={e => setFirst(e.target.value)} type="text" required/>
                <label>
                    {secondLabel}
                </label>
                <input onChange={e => setSecond(e.target.value)} type="text" required/>
                <button type="submit" className="w-full border border-solid border-black rounded">Search</button>
                {error && <div className="bg-red-500 text-white p-1 w-fit">{error}</div>}
            </form>
        )
    }

    const handleSubmitLand = async (e: React.FormEvent) => {
        e.preventDefault()
        const result = await utils.ReadLand(sectionName, legalEntity, 1, 10)
        if (!result[0]) {
            setError(result[1] as string);
        } else {
            let landProperties = (result[1] as (string | boolean)[])
            landProperties.push(true)
            setError('');
            setProperties(landProperties);
            setIsUpdatingLand(true);
            setIsSearchingLand(false);
        }
    };
    return (
        <>
        {(!isSearchingOwner && !isUpdatingOwner) && (!isSearchingLand && !isUpdatingLand) && (
            <div className="grid place-items-center h-screen">
                <div className="grid">
                    <button onClick={() => setIsSearchingOwner(true)} className="w-full border border-solid border-black rounded">
                        Update an owner
                    </button>
                    <button onClick={() => setIsSearchingLand(true)} className="w-full border border-solid border-black rounded">
                        Update a land holding
                    </button>
                    <Link href="/" className="m-3 py-2 px-4 rounded-md text-white bg-indigo-600" >Back</Link>
                </div>
            </div> 
        )}
        {isSearchingOwner && (
            <>
            {searchForm(handleSubmitOwner, setOwnerName, setOwnerAddress, "Owner Name", "Owner Address")}
            <button onClick={() => setIsSearchingOwner(false)} className="w-full border border-solid border-black rounded">
                Back
            </button>
            </>
        )}
        {isSearchingLand && (
            <>
            {searchForm(handleSubmitLand, setLegalEntity, setSectionName, "Legal Entity", "Section Name (formatted as [Section]-[Township]-[Range])")}
            <button onClick={() => setIsSearchingLand(false)} className="w-full border border-solid border-black rounded">
                Back
            </button>
            </>
        )}
        {isUpdatingOwner && (
            <>
            <AddOrUpdateEntry isUpdating={true} isUpdatingOwner={true} properties={properties}/>
            <button onClick={() => setIsUpdatingOwner(false)} className="w-full border border-solid border-black rounded">
                Back
            </button>
            </>
        )}
        {isUpdatingLand && (
            <>
            <AddOrUpdateEntry isUpdating={true} isUpdatingOwner={false} properties={properties}/>
            <button onClick={() => setIsUpdatingLand(false)} className="w-full border border-solid border-black rounded">
                Back
            </button>
            </>
        )}
        </>
    )
}