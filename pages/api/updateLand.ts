import { NextApiRequest, NextApiResponse } from "next";

import { MongoClient } from "mongodb";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "PUT") {
        const { landHolding, oldOwnerName, oldOwnerAddress, oldName } = req.body;
        const client = new MongoClient(process.env.MONGODB_DATA_URI as string);
        try {
            await client.connect();
            const ownerCollection = client.db().collection("owners");
            const landCollection = client.db().collection("land");
            const changedOwners = (landHolding['Owner'] != oldOwnerName || landHolding['Owner Address'] != oldOwnerAddress);
            const existingOwner = await ownerCollection.findOne({
                'Owner Name': landHolding['Owner'],
                'Address': landHolding['Owner Address']
            });
            if (!existingOwner) {
                res.status(400).json({ message: "ERROR: Owner doesn't exist!" });
                throw new Error("ERROR: Owner doesn't exist!")
            }

            if (landHolding['Name'] != oldName) {
                const foundExistingLandCollection = await landCollection.findOne({
                    'Name': landHolding['Name']
                })
                if (foundExistingLandCollection) {
                    res.status(400).json({ message: "ERROR: A land holding with the specified legal entity and section name already exists!" });
                    throw new Error("ERROR: A land holding with the specified legal entity and section name already exists!")
                }
            }

            await landCollection.updateOne(
                { 'Name': oldName }, 
                { $set: landHolding }
            );

            if (changedOwners) {
                await ownerCollection.updateOne(
                    { 'Owner Name': oldOwnerName, 'Address': oldOwnerAddress},
                    { $inc: { 'Total Number of Land Holdings': -1} }
                );
                await ownerCollection.updateOne(
                    { 'Owner Name': landHolding['Owner'], 'Address': landHolding['Owner Address']},
                    { $inc: { 'Total Number of Land Holdings': +1} }
                );
            }
            res.status(200).json({ message: "Data updated successfully!" });
        } catch (error) {
            res.status(500).json({ message: "Something went wrong!" });
        } finally {
            await client.close();
        }
    }
    res.status(405).json({ message: "Method not allowed!" });
}