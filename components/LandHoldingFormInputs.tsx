"use client";
import { useState } from 'react';

type LandHoldingInputProps = {
    legalEntityVal?: string;
    netMineralAcresVal?: string;
    mineralOwnerRoyaltyVal?: string;
    sectionVal?: string;
    townshipVal?: string;
    rangeVal?: string;
    titleSourceVal?: string;
  };

const LandHoldingFormInputs: React.FC<LandHoldingInputProps> = ({
    legalEntityVal='',
    netMineralAcresVal='',
    mineralOwnerRoyaltyVal='',
    sectionVal='',
    townshipVal='',
    rangeVal='',
    titleSourceVal='Class A',
}) => {

  const [legalEntity, setLegalEntity] = useState(legalEntityVal);
  const [netMineralAcres, setNetMineralAcres] = useState(netMineralAcresVal);
  const [mineralOwnerRoyalty, setMineralOwnerRoyalty] = useState(mineralOwnerRoyaltyVal);
  const [section, setSection] = useState(sectionVal);
  const [township, setTownship] = useState(townshipVal);
  const [range, setRange] = useState(rangeVal);
  const [titleSource, setTitleSource] = useState(titleSourceVal);

  return (
    <>
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