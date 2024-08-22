import { NextApiRequest, NextApiResponse } from "next";

import { MongoClient } from "mongodb";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "PUT") {
        const { ownerForm, oldName, oldAddress } = req.body;
        const client = new MongoClient(process.env.MONGODB_DATA_URI as string);
        try {
            await client.connect();
            const ownerCollection = client.db().collection("owners");
            const changedOwners = (ownerForm['Owner Name'] != oldName || ownerForm['Address'] != oldAddress);
            const existingOwner = await ownerCollection.findOne({
                'Owner Name': ownerForm['Owner Name'],
                'Address': ownerForm['Address']
            });
            if (changedOwners && existingOwner) {
                console.log("CANT UPDATE OWNER, OWNER ALREADY EXISTS")
                res.status(404).json({ message: "ERROR: Owner already exists!" });
                throw new Error("ERROR: Owner already exists!")
            }

            await ownerCollection.updateOne(
                { 'Owner Name': oldName, 'Address': oldAddress }, 
                { $set: ownerForm }
            );

            if (changedOwners) {
                console.log("OWNER ", ownerForm['Owner Name'], "OWNER ADDRESS: ", ownerForm['Address'])
                const landCollection = client.db().collection("land");
                await landCollection.updateMany(
                    { 'Owner': oldName, 'Owner Address': oldAddress},
                    { $set: { 'Owner': ownerForm['Owner Name'], 'Owner Address': ownerForm['Address'] } }
                )
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