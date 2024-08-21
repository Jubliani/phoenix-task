"use client";
import { useState } from "react";
import OwnerFormInputs from "./OwnerFormInputs";

type OwnerProps = {
    ownerNameVal?: string;
    entityTypeVal?: string;
    ownerTypeVal?: string;
    addressVal?: string;
  };

const OwnerForm: React.FC<OwnerProps> = ({
    ownerNameVal='',
    entityTypeVal='',
    ownerTypeVal='',
    addressVal=''
}) => {

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission logic here
  };

  return (
    <div className="max-w-lg mx-auto p-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <OwnerFormInputs />
      </form>
    </div>
  );
}

export default OwnerForm;