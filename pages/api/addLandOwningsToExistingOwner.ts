import { NextApiRequest, NextApiResponse } from "next";

import { MongoClient } from "mongodb";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "POST") {
        const { landHoldings } = req.body;
        const client = new MongoClient(process.env.MONGODB_DATA_URI as string)

        try {
            await client.connect();

            const ownerCollection = client.db().collection("owners");
            const landCollection = client.db().collection("land");

            for (const landHolding of landHoldings) {
                const foundExistingLandCollection = await landCollection.findOne({
                    'Name': landHolding['Name']
                })

                if (foundExistingLandCollection) {
                    res.status(400).json({ message: "ERROR: One or more land holdings already have an owner!" });
                    throw new Error("ERROR: One or more land holdings already have an owner!")
                }
            }
            await landCollection.insertMany(landHoldings);

            await ownerCollection.updateOne(
                { 'Owner Name': landHoldings[0]['Owner'], 'Address': landHoldings[0]['Owner Address'] }, 
                { $inc: {"Total Number of Land Holdings": +landHoldings.length } }
            );

            res.status(201).json({ message: "Data saved successfully!" });
        } catch (error) {
            res.status(500).json({ message: "Something went wrong!" });
        } finally {
            await client.close();
        }
    }
    res.status(405).json({ message: "Method not allowed!" });
}