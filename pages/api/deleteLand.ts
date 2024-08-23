import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next"
import { MongoClient } from "mongodb";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const session = await getServerSession(req, res, {})

    if (!session) { 
        res.status(405).json({ message: "You must be signed in!" });
        return;
    }

    if (req.method !== "DELETE") {
        res.status(405).json({ message: "Method not allowed!" });
        return;
    }
    const { landName, ownerName, ownerAddress } = req.body;

    const client = new MongoClient(process.env.MONGODB_DATA_URI as string);
    try {
        await client.connect();
        const ownerCollection = client.db().collection("owners");
        const landCollection = client.db().collection("land");

        const deletedLand = await landCollection.deleteOne({
            'Name': landName,
        });

        if (deletedLand.deletedCount === 0) {
            res.status(404).json({ message: "Land holding not found!" });
            return;
        }
        await ownerCollection.updateOne(
            { 'Owner Name': ownerName, 'Address': ownerAddress }, 
            { $inc: {"Total Number of Land Holdings": -1 } }
        );

        res.status(200).json({ message: "Land holding deleted successfully!" });
    } catch (error) {
        res.status(500).json({ message: "Something went wrong!" });
    } finally {
        await client.close();
    }
}