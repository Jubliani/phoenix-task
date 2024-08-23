import { NextApiRequest, NextApiResponse } from "next";

import { MongoClient } from "mongodb";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "POST") {
        const { owner, landHoldings } = req.body;
        const client = new MongoClient(process.env.MONGODB_DATA_URI as string)

        try {
            await client.connect();

            const ownerCollection = client.db().collection("owners");
            const landCollection = client.db().collection("land");

            const existingOwner = await ownerCollection.findOne({
                'Owner Name': owner['Owner Name'],
                'Address': owner['Address']
            });

            if (existingOwner) {
                res.status(409).json({ message: "ERROR: An owner with the same name and address already exists!" });
                throw new Error("ERROR: An owner with the same name and address already exists!")
            }

            let seenLandNames: string[] = []

            for (const landHolding of landHoldings) {

                const landHoldingName = landHolding['Name']

                if (seenLandNames.includes(landHoldingName)) {
                    res.status(400).json({ message: "ERROR: One or more land holdings have the same name!" });
                    throw new Error("ERROR: One or more land holdings have the same name!")
                }

                seenLandNames.push(landHoldingName)

                const foundExistingLandCollection = await landCollection.findOne({
                    'Name': landHolding['Name']
                })

                if (foundExistingLandCollection) {
                    res.status(400).json({ message: "ERROR: One or more land holdings already have an owner!" });
                    throw new Error("ERROR: One or more land holdings already have an owner!")
                }
            }
            await ownerCollection.insertOne(owner);
            if (landHoldings.length > 0) {
                await landCollection.insertMany(landHoldings);
            }
            res.status(201).json({ message: "Data saved successfully!" });

            res.status(201).json({ message: "Data saved successfully!" });
        } catch (error) {
            res.status(500).json({ message: "Something went wrong!" });
        } finally {
            await client.close();
        }
    }
    res.status(405).json({ message: "Method not allowed!" });
}