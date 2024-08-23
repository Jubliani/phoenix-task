"use client";
import { useState } from 'react';

type LandHoldingInputProps = {
  properties?: any[];
  key?: number;
};

const LandHoldingFormInputs: React.FC<LandHoldingInputProps> = ({
  properties=[{'Owner Name': '', 'Owner Address': ''}, '', '', '', '', '', '', 'Class A', false],
}) => {
  const oldOwnerName = properties[0]
  const oldOwnerAddress = properties[1]
  const [ownerName, setOwnerName] = useState(properties[0]['Owner Name']);
  const [ownerAddress, setOwnerAddress] = useState(properties[0]['Owner Address'])
  const [legalEntity, setLegalEntity] = useState(properties[1]);
  const [netMineralAcres, setNetMineralAcres] = useState(properties[2]);
  const [mineralOwnerRoyalty, setMineralOwnerRoyalty] = useState(properties[3]);
  const [section, setSection] = useState(properties[4]);
  const [township, setTownship] = useState(properties[5]);
  const [range, setRange] = useState(properties[6]);
  const [titleSource, setTitleSource] = useState(properties[7]);

  return (
    <>
    {properties.at(-1) && (
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
        <label htmlFor="Owner Address">
          Owner Address
        </label>
        <input
          name="Owner Address"
          type="text"
          value={ownerAddress}
          onChange={(e) => setOwnerAddress(e.target.value)}
          className="mt-1 mb-1 w-full sm:text-sm p-2"
          required
        />
      </div>
      </>
    )}
      <div>
        <label htmlFor="Legal Entity">
          Legal Entity
        </label>
        <input
          name="Legal Entity"
          type="text"
          value={legalEntity}
          onChange={(e) => setLegalEntity(e.target.value)}
          className="mt-1 mb-1 w-full sm:text-sm p-2"
          required
        />
      </div>

      <div>
        <label htmlFor="Net Mineral Acres">
          Net Mineral Acres
        </label>
        <input
          name="Net Mineral Acres"
          type="number"
          value={netMineralAcres}
          onChange={(e) => setNetMineralAcres(e.target.value)}
          className="mt-1 mb-1 w-full sm:text-sm p-2"
          required
        />
        <span></span>
      </div>

      <div>
        <label htmlFor="Mineral Owner Royalty (%)">
          Mineral Owner Royalty (%)
        </label>
        <input
          name="Mineral Owner Royalty (%)"
          type="number"
          value={mineralOwnerRoyalty}
          onChange={(e) => setMineralOwnerRoyalty(e.target.value)}
          className="mt-1 mb-1 w-full sm:text-sm p-2"
          required
        />
        <span></span>
      </div>

      <div>
        <label htmlFor="Section">
          Section
        </label>
        <input
          name="Section"
          type="text"
          value={section}
          onChange={(e) => setSection(e.target.value)}
          maxLength={3}
          className="mt-1 mb-1 w-full sm:text-sm p-2"
          required
          pattern="^[0-9]{3}$"
          title="Input must be 3 numbers"
        />
      </div>

      <div>
        <label htmlFor="Township">
          Township
        </label>
        <input
          name="Township"
          type="text"
          value={township}
          onChange={(e) => setTownship(e.target.value)}
          maxLength={4}
          className="mt-1 mb-1 w-full sm:text-sm p-2"
          required
          pattern="^[0-9]{3}[NS]$"
          title="Input must start with 3 numbers and end in either N or S"
        />
      </div>

      <div>
        <label htmlFor="Range">
          Range
        </label>
        <input
          name="Range"
          type="text"
          value={range}
          onChange={(e) => setRange(e.target.value)}
          maxLength={4}
          className="mt-1 mb-1 w-full sm:text-sm p-2"
          required
          pattern="^[0-9]{3}[EW]$"
          title="Input must start with 3 numbers and end in either E or W"
        />
      </div>

      <div>
        <label htmlFor="Title Source">
          Title Source
        </label>
        <select
          name="Title Source"
          value={titleSource}
          onChange={(e) => setTitleSource(e.target.value)}
          className="mt-1 mb-1 w-full sm:text-sm p-2"
        >
          <option value="Class A">Class A</option>
          <option value="Class B">Class B</option>
          <option value="Class C">Class C</option>
          <option value="Class D">Class D</option>
        </select>
      </div>
  </>
  );
};

export default LandHoldingFormInputs;