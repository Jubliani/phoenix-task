"use client";
import AddOrUpdateEntry from "@/components/AddOrUpdateEntry";
import { useState } from "react"
import Link from "next/link";
import { Utils } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import SearchForm from "@/components/SearchForm";
import '@/app/globals.css';


export default function Homepage() {
    const { status } = useSession();
    const router = useRouter();
    let utils = new Utils();
    const [isSearchingOwner, setIsSearchingOwner] = useState(false);
    const [isSearchingLand, setIsSearchingLand] = useState(false);
    const [isUpdatingOwner, setIsUpdatingOwner] = useState(false);
    const [isUpdatingLand, setIsUpdatingLand] = useState(false);

    const [ownerName, setOwnerName] = useState('');
    const [ownerAddress, setOwnerAddress] = useState('');
    const [legalEntity, setLegalEntity] = useState('');
    const [sectionName, setSectionName] = useState('');
    const [properties, setProperties] = useState<(string[] | string | boolean)[]>([]);
    const [error, setError] = useState('');

    const handleSubmitOwner = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('');
        const result = await utils.ReadOwner(ownerName, ownerAddress, 1, 5)
        if (!result[0]) {
            setError(result[1] as string);
            return;
        }
        setProperties(result[1] as (string | boolean)[]);
        setIsUpdatingOwner(true);
        setIsSearchingOwner(false);
    };

    const handleSubmitLand = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('');
        const result = await utils.ReadLand(sectionName, legalEntity, 1, 9)
        if (!result[0]) {
            setError(result[1] as string);
            return;
        }
        let landProperties = (result[1] as (any | string | boolean)[])
        let ownerProperties = landProperties[0] as {[key: string]: string}
        setProperties(landProperties);
        setOwnerName(ownerProperties['Owner Name'])
        setOwnerAddress(ownerProperties['Owner Address'])
        console.log("SET OWNER NAME: ", ownerName, ownerAddress, landProperties);
        console.log("SETRTING: ", ownerProperties['Owner Name'], ownerProperties['Owner Address']);
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
        {(!isSearchingOwner && !isUpdatingOwner) && (!isSearchingLand && !isUpdatingLand) && (
            <div className="grid place-items-center h-screen">
                <div className="grid">
                    <button onClick={() => setIsSearchingOwner(true)} className="btn-continue">
                        Update or delete an owner
                    </button>
                    <button onClick={() => setIsSearchingLand(true)} className="btn-continue">
                        Update or delete a land holding
                    </button>
                    <Link href="/" className="btn-back" >Back</Link>
                </div>
            </div> 
        )}
        {isSearchingOwner && (
            <div className="min-h-screen flex flex-col items-center justify-center">
                <SearchForm submitFunc={handleSubmitOwner} setFirst={setOwnerName} setSecond={setOwnerAddress} buttonFunc={setIsSearchingOwner}
                firstLabel={"Owner Name"} secondLabel={"Owner Address"} />
                {error && <div className="error-msg">{error}</div>}
            </div>
        )}
        {isSearchingLand && (
            <div className="min-h-screen flex flex-col items-center justify-center">
                <SearchForm submitFunc={handleSubmitLand} setFirst={setLegalEntity} setSecond={setSectionName} buttonFunc={setIsSearchingLand}
                firstLabel={"Legal Entity"} secondLabel={"Section Name (formatted as [Section]-[Township]-[Range])"} />
                {error && <div className="error-msg">{error}</div>}
            </div>
        )}
        {isUpdatingOwner && (
            <div className="min-h-screen flex flex-col items-center justify-center">
            <AddOrUpdateEntry isUpdating={true} isUpdatingOwner={true} properties={properties}/>
            <button onClick={() => deleteOwner()} className="btn-warn">
                Delete Owner
            </button>
            <button onClick={() => setIsUpdatingOwner(false)} className="btn-back">
                Back
            </button>
            </div>
        )}
        {isUpdatingLand && (
            <div className="min-h-screen flex flex-col items-center justify-center">
            <AddOrUpdateEntry isUpdating={true} isUpdatingOwner={false} properties={properties}/>
            <button onClick={() => deleteLandHolding()} className="btn-warn">
                Delete Land Owning
            </button>
            <button onClick={() => setIsUpdatingLand(false)} className="btn-back">
                Back
            </button>
            </div>
        )}
        </>
    )
}