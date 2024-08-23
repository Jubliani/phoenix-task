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
    let utils = new Utils();
    const [isSearchingOwner, setIsSearchingOwner] = useState(false);
    const [isSearchingLand, setIsSearchingLand] = useState(false);
    const [isViewingOwner, setIsViewingOwner] = useState(false);
    const [isViewingLand, setIsViewingLand] = useState(false);
    const [isViewingLandOfOwner, setIsViewingLandOfOwner] = useState(false);

    const [ownerName, setOwnerName] = useState('');
    const [ownerAddress, setOwnerAddress] = useState('');
    const [legalEntity, setLegalEntity] = useState('');
    const [sectionName, setSectionName] = useState('');
    const [properties, setProperties] = useState({});
    const [error, setError] = useState('');
    const [landOfOwner, setLandOfOwner] = useState<[{[key: number]: string | {[key: string]: string}}]>();

    const handleSubmitOwner = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('');
        const result = await utils.ReadOwner(ownerName, ownerAddress, 1, 6, false)
        if (!result[0]) {
            setError(result[1] as string);
            return;
        }
        const attributes = (result[1] as {[key: string]: any})
        setProperties(attributes);
        setIsViewingOwner(true);
        setIsSearchingOwner(false);
    };

    const viewOwnerLand = async () => {
        setError('');
        const result = await utils.GetAllLandOfOwner(ownerName, ownerAddress)
        if (!result[0]) {
            setError(result[1] as string);
            return;
        }
        let listOfLand = (result[1] as [{ [key: number]: string | { [ key: string]: string;} }]);
        setLandOfOwner(listOfLand);
        console.log("RETURNED LAND FROM OWNER IS: ", listOfLand, typeof(listOfLand));
        setIsViewingLandOfOwner(true)
    }

    const handleSubmitLand = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('');
        const result = await utils.ReadLand(sectionName, legalEntity, 1, 11, false)
        if (!result[0]) {
            setError(result[1] as string);
            return;
        }
        let landProperties = (result[1] as {[key: string]: any})
        const ownerInfo = await utils.ReadOwner(landProperties['Owner']['Owner Name'], landProperties['Owner']['Owner Address'], 
            1, 6, false)
        if (!ownerInfo[0]) {
            setError(ownerInfo[1] as string);
            return;
        }
        let ownerProperties = (ownerInfo[1] as {[key: string]: any})
        delete landProperties['Owner']
        Object.assign(landProperties, ownerProperties)
        setProperties(landProperties);
        setIsViewingLand(true);
        setIsSearchingLand(false);
    };

    const viewingTitle = (viewWhat: String) => {
        return (
            <div className="grid grid-cols-2 gap-4 border-b-2 pb-2 mb-2">
                <div className="font-bold text-center col-span-2 text-xl">{viewWhat}</div>
            </div>
        )
    }

    const viewingComponent = (viewWhat: string, properties: {}, includeOwner: boolean = false) => {
        return (
            <div className="w-full max-w-lg bg-white shadow-md rounded-lg">
                <div className="p-4">
                    {viewWhat && viewingTitle(viewWhat)}
                    {Object.entries(properties).slice(0, 9).map(([key, value]) => (
                        <div key={key} className="grid grid-cols-2 gap-4 py-2 border-b border-gray-200">
                            <div className="text-gray-700">{key}</div>
                            <div className="text-gray-900">{value as string}</div>
                        </div>
                    ))}
                    {includeOwner && (
                        <>
                        <div className="mt-5" />
                        {viewingTitle("Land Holding's Owner")}
                        {Object.entries(properties).slice(9, 14).map(([key, value]) => (
                            <div key={key} className="grid grid-cols-2 gap-4 py-2 border-b border-gray-200">
                                <div className="text-gray-700">{key}</div>
                                <div className="text-gray-900">{value as string}</div>
                            </div>
                        ))}
                        </>
                    )}
                </div>
            </div>
        )
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
        {(!isSearchingOwner && !isViewingOwner) && (!isSearchingLand && !isViewingLand) && (
            <div className="grid place-items-center h-screen">
                <div className="grid">
                    <button onClick={() => setIsSearchingOwner(true)} className="btn-continue">
                        Search for an owner
                    </button>
                    <button onClick={() => setIsSearchingLand(true)} className="btn-continue">
                        Search for a land holding
                    </button>
                    <Link href="/" className="btn-back" >Back</Link>
                </div>
            </div> 
        )}
        {isSearchingOwner && (
            <div className="min-h-screen flex flex-col items-center justify-center">
                <SearchForm submitFunc={handleSubmitOwner} setFirst={setOwnerName} setSecond={setOwnerAddress} buttonFunc={setIsSearchingOwner}
                firstLabel={"Owner Name"} secondLabel={"Owner Address"} />
                {error && <div className="bg-red-500 text-white p-1 w-fit">{error}</div>}
            </div>
        )}
        {isSearchingLand && (
            <div className="min-h-screen flex flex-col items-center justify-center">
                <SearchForm submitFunc={handleSubmitLand} setFirst={setLegalEntity} setSecond={setSectionName} buttonFunc={setIsSearchingLand}
                firstLabel={"Legal Entity"} secondLabel={"Section Name (formatted as [Section]-[Township]-[Range])"} />
                {error && <div className="bg-red-500 text-white p-1 w-fit">{error}</div>}
            </div>
        )}
        {isViewingOwner && (
            <div className="min-h-screen flex flex-col items-center justify-center mt-10">
                {viewingComponent("Owner Details", properties)}
                {(!isViewingLandOfOwner && <button
                    onClick={() => viewOwnerLand()}
                    className="mt-4 py-2 px-4 rounded-md text-white bg-indigo-600"
                >View {ownerName}'s land ownings </button>) || 
                    <div className="font-bold text-xl text-center col-span-2 mt-5">Land Holdings</div>
                 }
                { landOfOwner && (
                    <>
                    {Object.entries(landOfOwner).map(([key, value]) => (
                        <>
                        <div className="pb-4" /> 
                        {viewingComponent("", Object.fromEntries(Object.entries(value).slice(2, 11)))}
                        </>
                    ))}
                    </>
                )}
                <button
                    onClick={() => {
                        setIsViewingOwner(false);
                        setIsSearchingOwner(true);
                    }}
                    className="mt-4 py-2 px-4 rounded-md text-white bg-indigo-600"
                >Back </button>
            </div>
        )}
        {isViewingLand && (
            <div className="min-h-screen flex flex-col items-center justify-center">
                {viewingComponent("Land Holding Details", properties, true)}
                <button
                    onClick={() => {
                        setIsViewingLand(false);
                        setIsSearchingLand(true);
                    }}
                    className="mt-4 py-2 px-4 rounded-md text-white bg-indigo-600"
                >Back </button>
            </div>
        )}
        </>
    )
}