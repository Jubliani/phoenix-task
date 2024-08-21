export class Utils {
    OWNER_FORM_LENGTH = 4
    LAND_HOLDING_FORM_LENGTH = 6 //0-indexed
    LAND_HOLDING_LENGTH = 9 //0-indexed
    GetOwnerFormInfo(): { [key: string]: any } {
        let ownerData: { [key: string]: any } = {};
        const form = document.forms[0];
        let index = 0;
        Array.from(form.elements).slice(0, this.OWNER_FORM_LENGTH).forEach((element) => {
            const inputElement = element as HTMLInputElement | HTMLSelectElement;
            ownerData[inputElement.name] = inputElement.value
        })
        return ownerData
    }
    GetLandHoldingFormInfo(formOffset: number, ownerName: string, ownerAddress: string): any[] {
        let landData: any[] = []
        let landHolding: { [key: string]: any } = {"Owner": ownerName, "ownerID": `${ownerName}_${ownerAddress}`};
        const form = document.forms[0];
        let index = 0;
        Array.from(form.elements).slice(formOffset).forEach((element) => {
            //console.log(element);
            const inputElement = element as HTMLInputElement | HTMLSelectElement;
            landHolding[inputElement.name] = inputElement.value
            index += 1; 
            if (index > this.LAND_HOLDING_FORM_LENGTH) {
                this.AddInferredInfoToLandHolding(landHolding);
                landData.push(landHolding);
                index = 0;
                landHolding = {"Owner": ownerName, "ownerID": `${ownerName}_${ownerAddress}`};
            }
        })
        return landData
    }

    AddInferredInfoToLandHolding(landHolding: {[key: string]: any }) {
        landHolding["Section Name"] = `${landHolding["Section"]}-${landHolding["Township"]}-${landHolding["Range"]}`
        landHolding["Name"] = `${landHolding["Section Name"]}_${landHolding["Legal Entity"]}`
    }

    ParseOwnerAndLandHoldingsForms() {
        let ownerData = this.GetOwnerFormInfo()
        const landData = this.GetLandHoldingFormInfo(this.OWNER_FORM_LENGTH, ownerData["Owner Name"], ownerData["Address"])
        ownerData["Total Number of Land Holdings"] = landData.length;
        console.log(ownerData);
        console.log(landData);
    }
}