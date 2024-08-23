"use client";
import Link from "next/link"
import { useState, useRef } from "react";
import { Utils } from "@/lib/utils";
import OwnerFormInputs from "@/components/OwnerFormInputs";
import LandHoldingFormInputs from "@/components/LandHoldingFormInputs";
import { useRouter } from "next/navigation";


interface AddOrUpdateEntryProps {
    isUpdating?: boolean;
    isUpdatingOwner?: boolean;
    properties?: any[];
    backButton?: boolean;
    isAddingLand?: boolean;
}

const AddOrUpdateEntry: React.FC<AddOrUpdateEntryProps> = ({isUpdating=false, isUpdatingOwner=false, properties=[], backButton=true, isAddingLand=false}) => {
    const submitButtonText = isUpdating? "Update": "Submit";
    let utils = new Utils();
    const router = useRouter();
    const formRef = useRef<HTMLFormElement | null>(null);
    const [landFormIndex, setLandFormIndex] = useState(0)
    const [landFormList, setLandFormList] = useState<number[]>([]);
    const AddLandForm = () => {
        setLandFormIndex(landFormIndex + 1);
        setLandFormList([...landFormList, landFormIndex]);
        console.log("LAND INDEX: ", landFormList, landFormIndex)
    }

    const RemoveLandForm = () => {
        if (landFormList.length == 0) {
            return;
        }
        setLandFormIndex(landFormIndex - 1);
        setLandFormList(landFormList.slice(0, -1));
        console.log("LAND INDEX: ", landFormList, landFormIndex)
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

    const handleSuccessOrError = (success: boolean, successMessage: string, message: string | null) => {
        if (!success) {
            showDataUploadError(message as string);
            return;
        }
        alert(successMessage)
        console.log("WE PUSHSSHIS")
        router.push("/");
        console.log("CAR PUSHED")
        return;
    }

    const updateOwner = async () => {
        const [success, message] = await utils.PutOwner(utils.GetOwnerFormInfo(), properties[0], properties[3]);
        handleSuccessOrError(success, "Owner updated successfully!", message)
    }

    const updateLand = async () => {
        if (!validateRoyaltyAndAcres()) {
            return;
        }
        let landForm = utils.GetLandHoldingFormInfo(
            0, properties[0]['Owner Name'], properties[0]['Owner Address'], utils.LAND_HOLDING_UPDATE_FORM_LENGTH
        )[0]
        console.log("LAND FORM IS: ", landForm);
        console.log("PROPERTIES IS: ", properties);
        const [success, message] = await utils.PutLand(landForm,
            properties[0]['Owner Name'], properties[0]['Owner Address'], `${properties[4]}-${properties[5]}-${properties[6]}_${properties[1]}`
        );
        handleSuccessOrError(success, "Land updated successfully!", message)
    }

    const addNewOwnerAndPossibleLandHoldings = async () => {
        if (!validateRoyaltyAndAcres()) {
            return;
        } 
        const [success, message] = await utils.AddNewOwnerAndLandOwningsToDatabase();
        handleSuccessOrError(success, "Owner added successfully!", message)
    }

    const addLandToOwner = async () => {
        if (!validateRoyaltyAndAcres()) {
            return;
        } 
        console.log("ADDING LAND TO OWNER: ", properties)
        const [success, message] = await utils.AddLandOwningToDatabase(properties[0], properties[1])
        handleSuccessOrError(success, "Land added successfully!", message)
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        showDataUploadError('');
        if (isAddingLand) {
            addLandToOwner();
            return
        }
        if (!isUpdating) {
            addNewOwnerAndPossibleLandHoldings();
            return;
        }
        if (isUpdatingOwner) {
            updateOwner();
            return;
        }
        updateLand();
    };

    return (
        <div className="max-w-lg mx-auto p-4">
        <form ref={formRef} onSubmit={handleSubmit}>
            {isAddingLand && (
            <>
                <LandHoldingFormInputs />
                {landFormList.map((_, index) => (
                <LandHoldingFormInputs key={index}/>
                ))}
            </>
            )}
            {(!isUpdating || isUpdatingOwner) && !isAddingLand && <OwnerFormInputs properties={properties}/>}
            {(isUpdating && !isUpdatingOwner) && <LandHoldingFormInputs properties={properties}/>}
            {!isUpdatingOwner && !isAddingLand && landFormList.map((_, index) => (
                <LandHoldingFormInputs key={index}/>
            ))}
            <span className="errorMsg"></span>
            <button
                type="submit"
                className="m-3 py-2 px-4 rounded-md text-white bg-indigo-600"
            >
                {submitButtonText}
            </button>
        </form>
        {!isUpdating && (
            <>
            <button onClick={ AddLandForm } className="m-3 py-2 px-4 rounded-md text-white bg-indigo-600">
                Add Land Holding
            </button>
            <button onClick={ RemoveLandForm } className="m-3 py-2 px-4 rounded-md text-white bg-indigo-600">
                Remove Land Holding
            </button> 
            {backButton && (
                <Link href="/" className="m-3 py-2 px-4 rounded-md text-white bg-indigo-600" >Back</Link>
            )}
            </>
        )}
        </div>
    )
}

export default AddOrUpdateEntry;