"use client";
import LandHoldingForm from "@/components/LandHoldingForm"
import OwnerForm from "@/components/OwnerForm"
import Link from "next/link"
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useState, useRef } from "react";
import { Utils } from "@/lib/utils";
import OwnerFormInputs from "@/components/OwnerFormInputs";
import LandHoldingFormInputs from "@/components/LandHoldingFormInputs";

export default function AddEntry() {
    const { status } = useSession();
    const router = useRouter();
    let utils = new Utils();
    const formRef = useRef<HTMLFormElement | null>(null);
    const [landFormIndex, setLandFormIndex] = useState(0)
    const [landFormList, setLandFormList] = useState<number[]>([]);
    const AddLandForm = () => {
        setLandFormIndex(landFormIndex + 1);
        setLandFormList([...landFormList, landFormIndex]);
    }

    const RemoveLandForm = () => {
        setLandFormIndex(landFormIndex - 1);
        setLandFormList(landFormList.slice(0, -1));
    }

    const validateInput = (query: string, errorMsg: string, upperBound: number = Infinity) => {
        let isValid = true
        if (!formRef.current) {
            return;
        }
        const elements = formRef.current.querySelectorAll<HTMLInputElement>(query);
        elements.forEach((element) => {
            const errorMessage = element.nextElementSibling as HTMLElement;
            const percentage = parseFloat(element.value);
            if (percentage < 0 || percentage > upperBound) {
                isValid = false
                errorMessage.textContent = errorMsg;
                errorMessage.style.color = 'red';
            } else {
                errorMessage.textContent = '';
            }
        });
        return isValid
    }

    const showDataUploadError = (errorMsg: string) => {
        if (!formRef.current) {
            return;
        }
        const errorPlaceholder = formRef.current.querySelector<HTMLSpanElement>(".errorMsg") as HTMLSpanElement;
        errorPlaceholder.textContent = errorMsg;
        errorPlaceholder.style.color = 'red';

    }

    const validateRoyaltyAndAcres = () => {
        const valid0 = validateInput('input[name="Mineral Owner Royalty (%)"]', 'Value must be between 0 and 100', 100);
        const valid1 = validateInput('input[name="Net Mineral Acres"]', 'Value must be greater than 0');
        return valid0 && valid1;
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateRoyaltyAndAcres()) {
            return;
        } 
        const [success, message] = await utils.AppendDataToDatabase();
        if (success) {
            showDataUploadError('');
            alert("Info added successfully!")
            return;
        }
        showDataUploadError(message as string);
        return;

    };
    if (status === "loading") {
        return (
            <span className="text-[#888] text-sm mt-7">Loading...</span>
        )
    } else if (status !== "authenticated") {
        router.push("/");
        return
    }
    return (
        <div className="max-w-lg mx-auto p-4">
        <form ref={formRef} onSubmit={handleSubmit}>
            <OwnerFormInputs />
            {landFormList.map(() => (
                <LandHoldingFormInputs />
            ))}
        <span className="errorMsg"></span>
        <button
            type="submit"
            className="m-3 py-2 px-4 rounded-md text-white bg-indigo-600"
        >
            Submit
        </button>
        </form>
        <button onClick={ AddLandForm }
        className="m-3 py-2 px-4 rounded-md text-white bg-indigo-600"
        >
            Add Land Holding
        </button>
        <button onClick={ RemoveLandForm }
        className="m-3 py-2 px-4 rounded-md text-white bg-indigo-600"
        >
            Remove Land Holding
        </button>
        <Link href="/" className="m-3 py-2 px-4 rounded-md text-white bg-indigo-600" >Back</Link>
        </div>
    )
}