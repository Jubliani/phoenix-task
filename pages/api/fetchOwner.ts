import { NextApiRequest, NextApiResponse } from "next";
import fetch from "@/lib/database/utils";
import { getServerSession } from "next-auth/next"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
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
  const query = { 'Owner Name': name, 'Address': address };
  await fetch("owners", query, res, "Owner");
}