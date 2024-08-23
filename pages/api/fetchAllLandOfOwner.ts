import { MongoClient } from "mongodb";
import { getServerSession } from "next-auth/next"
import { NextApiRequest, NextApiResponse } from "next";

export default async function fetch(req: NextApiRequest, res: NextApiResponse) {
    const session = await getServerSession(req, res, {})

    if (!session) { 
        res.status(405).json({ message: "You must be signed in!" });
        return;
    }
    
    if (req.method !== "GET") {
        res.status(405).json({ message: "Method not allowed!" });
        return;
    }
    const { name, address } = req.query;
    const query = { 'Owner': {
        'Owner Name': name, 'Owner Address': address }
    };
    const client = new MongoClient(process.env.MONGODB_DATA_URI as string);

    try {
        await client.connect();
        const collection = client.db().collection("land");
        const result = await collection.find(query).toArray();
        if (!result) {
            res.status(409).json({ message: `ERROR: Owner does not own land!` });
        }
        res.status(200).json(result);
        } catch (error) {
            res.status(500).json({ message: "Something went wrong!" });
        } finally {
            await client.close();
    }
}