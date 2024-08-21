"use client";
import { useState, useRef } from 'react';
import LandHoldingFormInputs from './LandHoldingFormInputs';
import { Utils } from "@/lib/utils";

type LandHoldingProps = {
    ownerVal?: string;
    legalEntityVal?: string;
    mineralOwnerRoyaltyVal?: string;
    sectionVal?: string;
    townshipVal?: string;
    rangeVal?: string;
    titleSourceVal?: string;
    index?: number;
  };

const LandHoldingForm: React.FC<LandHoldingProps> = ({
    ownerVal='',
    legalEntityVal='',
    mineralOwnerRoyaltyVal='',
    sectionVal='',
    townshipVal='',
    rangeVal='',
    titleSourceVal='Class A',
}) => {

    const formRef = useRef<HTMLFormElement | null>(null);

    const EnsureCorrectPercentage = (mineralOwnerRoyalty: string) => {
        let percentage = parseFloat(mineralOwnerRoyalty)
        if (percentage < 0 || percentage > 100) {
            console.log("give valid percentage")
            return false
        }
        return true
    }

    // const extractMineralOwnerRoyaltyValues = () => {
    //     var form = document.forms[0];
    //     var selectElement = form.querySelectorAll<HTMLInputElement>('input[name="mineralOwnerRoyalty"]');
    //     selectElement.forEach((element) => {
    //         console.log(element)
    //     })
    //   };

    const extractMineralOwnerRoyaltyValues = () => {
        if (formRef.current) {
          // Select all inputs with the name attribute "mineralOwnerRoyalty"
          const elements = formRef.current.querySelectorAll<HTMLInputElement>('input[name="mineralOwnerRoyalty"]');
          elements.forEach((element) => {
            console.log(element.value)
          })
        }
      };

    let utils1 = new Utils();

    const [landFormIndex, setLandFormIndex] = useState(0)
    const [landFormList, setLandFormList] = useState<number[]>([]);
    const AddLandForm = () => {
        setLandFormIndex(landFormIndex + 1);
        setLandFormList([...landFormList, landFormIndex]);
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        extractMineralOwnerRoyaltyValues();
    };

    return (
        <>
        <form ref={formRef} onSubmit={extractMineralOwnerRoyaltyValues} className="max-w-md mx-auto p-4 space-y-4" name='landHoldingForm'>
            {landFormList.map((index) => (
                <LandHoldingFormInputs index={index}/>
            ))}
        <button
            type="submit"
            className="inline-flex justify-center py-2 px-4 shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600"
        >
            Submit
        </button>
        </form>
        <button onClick={ AddLandForm }
        className="inline-flex justify-center py-2 px-4 shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600"
        >
            Add land form
        </button>
      </>
    );
};

export default LandHoldingForm;