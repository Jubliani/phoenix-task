export class Utils {
    OWNER_FORM_LENGTH = 4
    LAND_HOLDING_FORM_LENGTH = 6 //0-indexed
    LAND_HOLDING_LENGTH = 9 //0-indexed

    GetOwnerFormInfo(): { [key: string]: any } {
        let ownerData: { [key: string]: any } = {};
        const form = document.forms[0];
        Array.from(form.elements).slice(0, this.OWNER_FORM_LENGTH).forEach((element) => {
            const inputElement = element as HTMLInputElement | HTMLSelectElement;
            ownerData[inputElement.name] = inputElement.value
        })
        return ownerData
    }
    GetLandHoldingFormInfo(formOffset: number, ownerName: string, ownerAddress: string): any[] {
        let landHoldings: any[] = []
        let landHolding: { [key: string]: any } = {"Owner": ownerName, "Owner Address": ownerAddress};
        const form = document.forms[0];
        let index = 0;
        Array.from(form.elements).slice(formOffset).forEach((element) => {
            const inputElement = element as HTMLInputElement | HTMLSelectElement;
            landHolding[inputElement.name] = inputElement.value
            index += 1; 
            if (index > this.LAND_HOLDING_FORM_LENGTH) {
                this.AddInferredInfoToLandHolding(landHolding);
                landHoldings.push(landHolding);
                index = 0;
                landHolding = {"Owner": ownerName, "Owner Address": ownerAddress};
            }
        })
        return landHoldings
    }

    AddInferredInfoToLandHolding(landHolding: {[key: string]: any }) {
        landHolding["Section Name"] = `${landHolding["Section"]}-${landHolding["Township"]}-${landHolding["Range"]}`
        landHolding["Name"] = `${landHolding["Section Name"]}_${landHolding["Legal Entity"]}`
    }

    ReadOwner(ownerName: string, ownerAddress: string): Promise<[boolean, string[] | string | null]> {
        const query = new URLSearchParams({
            name: ownerName,
            address: ownerAddress
        }).toString();

        return this.FetchHelper(query, 'fetchOwner', 1, 5)
    }

    ReadLand(sectionName: string, legalEntity: string): Promise<[boolean, string[] | string | null]> {
        const name = `${sectionName}_${legalEntity}`;
        console.log("NAMMMEIS: ", name)
        const query = new URLSearchParams({
            name: name,
        }).toString();

        return this.FetchHelper(query, 'fetchLand', 3, 10)
    }

    async FetchHelper(query: string, fetchWhich: string, minValue: number, maxValue: number): Promise<[boolean, string[] | string | null]> {
        const response = await fetch(`/api/${fetchWhich}?${query}`, { method: "GET" });
        const result = await response.json()

        if (!response.ok) {
            return [false, result.message]
        }
        return [true, Object.values(result).slice(minValue, maxValue) as string[]]
    }

    async PostData(ownerData: { [key: string]: any }, landHoldings: any[]): Promise<[boolean, string | null]>  {
        const response = await fetch("/api/addData", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ owner: ownerData, landHoldings: landHoldings }),
        });

        const result = await response.json()
        if (!response.ok) {
            return [false, result.message]
        }
        return [true, null]
    };

    AppendDataToDatabase(): Promise<[boolean, string | null]>  {
        let ownerData = this.GetOwnerFormInfo()
        const landHoldings = this.GetLandHoldingFormInfo(this.OWNER_FORM_LENGTH, ownerData["Owner Name"], ownerData["Address"])
        ownerData["Total Number of Land Holdings"] = landHoldings.length;
        return this.PostData(ownerData, landHoldings);
    }
}