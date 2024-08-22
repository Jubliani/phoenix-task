import { MongoClient } from "mongodb";
import { NextApiRequest, NextApiResponse } from "next";

export default async function fetch(collectionName: string, query: { [key: string]: any }, res: NextApiResponse, item: string) {

    const client = new MongoClient(process.env.MONGODB_DATA_URI as string);

    try {
        await client.connect();
        const collection = client.db().collection(collectionName);
        const result = await collection.findOne(query);
        if (!result) {
            res.status(409).json({ message: `ERROR: ${item} does not exist!` });
        } else {
            res.status(200).json(result);
        }
        } catch (error) {
            res.status(500).json({ message: "Something went wrong!" });
        } finally {
            await client.close();
    }
}