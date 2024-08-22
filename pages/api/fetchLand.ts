import { NextApiRequest, NextApiResponse } from "next";

import { MongoClient } from "mongodb";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "GET") {
        const { name } = req.query;
        const client = new MongoClient(process.env.MONGODB_DATA_URI as string)

        try {
            await client.connect();

            const landCollection = client.db().collection("land");

            const existingLand = await landCollection.findOne({
                'Name': name,
            });

            if (!existingLand) {
                res.status(409).json({ message: "ERROR: Land does not exist!" });
            } else {
                res.status(200).json(existingLand);
            }
        } catch (error) {
            res.status(500).json({ message: "Something went wrong!" });
        } finally {
            await client.close();
        }
    } else {
        res.status(405).json({ message: "Method not allowed!" });
    }
}