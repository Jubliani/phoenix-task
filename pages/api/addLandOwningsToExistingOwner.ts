import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { MongoClient } from "mongodb";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const session = await getServerSession(req, res, {})

    if (!session) { 
        res.status(405).json({ message: "You must be signed in!" });
        return;
    }

    if (req.method !== "POST") {
        res.status(405).json({ message: "Method not allowed!" });
        return;
    }
    const { landHoldings } = req.body;
    const client = new MongoClient(process.env.MONGODB_DATA_URI as string)

    try {
        await client.connect();

        const ownerCollection = client.db().collection("owners");
        const landCollection = client.db().collection("land");
        
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
                res.status(400).json({ message: "ERROR: One or more land holdings already exist in the database!" });
                throw new Error("ERROR: One or more land holdings already exist in the database!")
            }
        }
        await landCollection.insertMany(landHoldings);

        await ownerCollection.updateOne(
            { 'Owner Name': landHoldings[0]['Owner']['Owner Name'], 
                'Address': landHoldings[0]['Owner']['Owner Address'] }, 
            { $inc: {"Total Number of Land Holdings": +landHoldings.length } }
        );

        res.status(201).json({ message: "Data saved successfully!" });
    } catch (error) {
        res.status(500).json({ message: "Something went wrong!" });
    } finally {
        await client.close();
    }
}