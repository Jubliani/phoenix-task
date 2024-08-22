"use client";
import AddOrUpdateEntry from "@/components/AddOrUpdateEntry";
import { useState } from "react"
import Link from "next/link";
import { Utils } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import SearchForm from "@/components/SearchForm";


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
            return;
        }
        setError('');
        setProperties(result[1] as (string | boolean)[]);
        setIsUpdatingOwner(true);
        setIsSearchingOwner(false);
    };

    const handleSubmitLand = async (e: React.FormEvent) => {
        e.preventDefault()
        const result = await utils.ReadLand(sectionName, legalEntity, 1, 10)
        if (!result[0]) {
            setError(result[1] as string);
            return;
        }
        let landProperties = (result[1] as (string | boolean)[])
        landProperties.push(true)
        setError('');
        setProperties(landProperties);
        setOwnerName(landProperties[0] as string)
        setOwnerAddress(landProperties[1] as string)
        console.log("SET OWNER NAME: ", ownerName, ownerAddress, landProperties);
        setIsUpdatingLand(true);
        setIsSearchingLand(false);
    };

    const deleteOwner = async () => {
        const result = await utils.DeleteOwner(ownerName, ownerAddress);
        if (!result[0]) {
            alert("ERROR: Something went wrong. Owner couldn't be deleted!");
            return;
        }
        alert("Owner deleted successfully!");
        router.push("/");
    }

    const deleteLandHolding = async () => {
        console.log("THE OWNEREKJRWLJEL:: ", ownerName, ownerAddress)
        const result = await utils.DeleteLandHolding(`${sectionName}_${legalEntity}`, ownerName, ownerAddress);
        if (!result[0]) {
            alert("ERROR: Something went wrong. Owner couldn't be deleted!");
            return;
        }
        alert("Land holding deleted successfully!");
        router.push("/");
    }

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
            <SearchForm submitFunc={handleSubmitOwner} setFirst={setOwnerName} setSecond={setOwnerAddress}
            firstLabel={"Owner Name"} secondLabel={"Owner Address"} />
            {error && <div className="bg-red-500 text-white p-1 w-fit">{error}</div>}
            <button onClick={() => setIsSearchingOwner(false)} className="w-full border border-solid border-black rounded">
                Back
            </button>
            </>
        )}
        {isSearchingLand && (
            <>
            <SearchForm submitFunc={handleSubmitLand} setFirst={setLegalEntity} setSecond={setSectionName}
            firstLabel={"Legal Entity"} secondLabel={"Section Name (formatted as [Section]-[Township]-[Range])"} />
            {error && <div className="bg-red-500 text-white p-1 w-fit">{error}</div>}
            <button onClick={() => setIsSearchingLand(false)} className="w-full border border-solid border-black rounded">
                Back
            </button>
            </>
        )}
        {isUpdatingOwner && (
            <>
            <AddOrUpdateEntry isUpdating={true} isUpdatingOwner={true} properties={properties}/>
            <button onClick={() => deleteOwner()} className="m-3 py-2 px-4 rounded-md text-white bg-red-600">
                Delete Owner
            </button>
            <button onClick={() => setIsUpdatingOwner(false)} className="w-full border border-solid border-black rounded">
                Back
            </button>
            </>
        )}
        {isUpdatingLand && (
            <>
            <AddOrUpdateEntry isUpdating={true} isUpdatingOwner={false} properties={properties}/>
            <button onClick={() => deleteLandHolding()} className="m-3 py-2 px-4 rounded-md text-white bg-red-600">
                Delete Land Owning
            </button>
            <button onClick={() => setIsUpdatingLand(false)} className="w-full border border-solid border-black rounded">
                Back
            </button>
            </>
        )}
        </>
    )
}