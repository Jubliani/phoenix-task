export class Utils {
    OWNER_FORM_LENGTH = 4
    LAND_HOLDING_FORM_LENGTH = 6 //0-indexed
    LAND_HOLDING_UPDATE_FORM_LENGTH = 8 //0-indexed

    GetOwnerFormInfo(): { [key: string]: any } {
        let ownerData: { [key: string]: any } = {};
        const form = document.forms[0];
        Array.from(form.elements).slice(0, this.OWNER_FORM_LENGTH).forEach((element) => {
            const inputElement = element as HTMLInputElement | HTMLSelectElement;
            ownerData[inputElement.name] = inputElement.value
        })
        return ownerData
    }
    GetLandHoldingFormInfo(formOffset: number, ownerName: string, ownerAddress: string, maximumIndex: number): any[] {
        let landHoldings: any[] = []
        let landHolding: { [key: string]: any } = {"Owner": ownerName, "Owner Address": ownerAddress};
        if (maximumIndex == this.LAND_HOLDING_UPDATE_FORM_LENGTH) {
            landHolding = {}
        }
        const form = document.forms[0];
        let index = 0;
        for (const element of Array.from(form.elements).slice(formOffset)) {
            if (index > maximumIndex && maximumIndex == this.LAND_HOLDING_UPDATE_FORM_LENGTH) {
                break;
            }
            console.log("ELEMENT", element)
            const inputElement = element as HTMLInputElement | HTMLSelectElement;
            landHolding[inputElement.name] = inputElement.value
            index += 1; 
            if (index > maximumIndex) {
                this.AddInferredInfoToLandHolding(landHolding);
                landHoldings.push(landHolding);
                index = 0;
                landHolding = {"Owner": ownerName, "Owner Address": ownerAddress};
            }
        }
        return landHoldings
    }

    AddInferredInfoToLandHolding(landHolding: {[key: string]: any }) {
        landHolding["Section Name"] = `${landHolding["Section"]}-${landHolding["Township"]}-${landHolding["Range"]}`
        landHolding["Name"] = `${landHolding["Section Name"]}_${landHolding["Legal Entity"]}`
    }

    ReadOwner(ownerName: string, ownerAddress: string, minParam: number, maxParam: number): Promise<[boolean, string[] | string | null]> {
        const query = new URLSearchParams({
            name: ownerName,
            address: ownerAddress
        }).toString();

        return this.FetchHelper(query, 'fetchOwner', minParam, maxParam)
    }

    ReadLand(sectionName: string, legalEntity: string, minParam: number, maxParam: number): Promise<[boolean, string[] | string | null]> {
        const name = `${sectionName}_${legalEntity}`;
        const query = new URLSearchParams({
            name: name,
        }).toString();

        return this.FetchHelper(query, 'fetchLand', minParam, maxParam)
    }

    async ResponseResolver(response: Response): Promise<[boolean, string | null]> {
        const result = await response.json();
        if (!response.ok) {
            return [false, result.message];
        }
        return [true, null];
    }

    async PutOwner(ownerForm: { [key: string]: any }, oldName: string, oldAddress: string) {
        const response = await fetch(`/api/updateOwner`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ ownerForm, oldName, oldAddress }),
        });
        return this.ResponseResolver(response)
    }

    async PutLand(landHolding: { [key: string]: any }, oldOwnerName: string, 
        oldOwnerAddress: string, oldName: string) {
        console.log("LANDLLDDL: ", landHolding);
        const response = await fetch(`/api/updateLand`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ landHolding, oldOwnerName, oldOwnerAddress, oldName }),
        });
        return this.ResponseResolver(response)
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

        return this.ResponseResolver(response);
    };

    AppendDataToDatabase(): Promise<[boolean, string | null]>  {
        let ownerData = this.GetOwnerFormInfo()
        const landHoldings = this.GetLandHoldingFormInfo(
            this.OWNER_FORM_LENGTH, ownerData["Owner Name"], ownerData["Address"], this.LAND_HOLDING_FORM_LENGTH
        );
        ownerData["Total Number of Land Holdings"] = landHoldings.length;
        return this.PostData(ownerData, landHoldings);
    }
}