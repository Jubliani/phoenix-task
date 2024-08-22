"use client";
import { useState } from "react";

type OwnerInputsProps = {
  properties?: any[];
  };

const OwnerFormInputs: React.FC<OwnerInputsProps> = ({ 
  properties=['','','',''] 
}) => {
  const [ownerName, setOwnerName] = useState(properties[0]);
  const [entityType, setEntityType] = useState(properties[1]);
  const [ownerType, setOwnerType] = useState(properties[2]);
  const [address, setAddress] = useState(properties[3]);

  return (
    <>
        <div>
          <label htmlFor="Owner Name">
            Owner Name
          </label>
          <input
            name="Owner Name"
            type="text"
            value={ownerName}
            onChange={(e) => setOwnerName(e.target.value)}
            className="mt-1 mb-1 w-full sm:text-sm p-2"
            required
          />
        </div>

        <div>
          <label htmlFor="Entity Type">
            Entity Type
          </label>
          <select
            name="Entity Type"
            value={entityType}
            onChange={(e) => setEntityType(e.target.value)}
            className="mt-1 mb-1 w-full sm:text-sm p-2"
            required
          >
            <option value="Company">Company</option>
            <option value="Individual">Individual</option>
            <option value="Investor">Investor</option>
            <option value="Trust">Trust</option>
          </select>
        </div>

        <div>
          <label htmlFor="Owner Type">
            Owner Type
          </label>
          <select
            name="Owner Type"
            value={ownerType}
            onChange={(e) => setOwnerType(e.target.value)}
            className="mt-1 mb-1 w-full sm:text-sm p-2"
            required
          >
            <option value="Competitor">Competitor</option>
            <option value="Seller">Seller</option>
            <option value="Investor">Investor</option>
            <option value="Professional">Professional</option>
          </select>
        </div>

        <div>
          <label htmlFor="Address">
            Address
          </label>
          <input
            name="Address"
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="mt-1 mb-1 w-full sm:text-sm p-2"
            required
          />
        </div>
    </>
  );
}

export default OwnerFormInputs;