import { NextApiRequest, NextApiResponse } from "next";
import fetch from "@/lib/database/utils";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    const { name, address } = req.query;
    const query = { 'Owner Name': name, 'Address': address };
    await fetch("owners", query, res, "Owner");
  } else {
    res.status(405).json({ message: "Method not allowed!" });
  }
}