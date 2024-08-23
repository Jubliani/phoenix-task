

import { NextApiRequest, NextApiResponse } from "next";
import fetch from "@/lib/database/utils";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    res.status(405).json({ message: "Method not allowed!" });
    return;
  }
  const { name } = req.query;
  const query = { 'Name': name };
  await fetch("land", query, res, "Land holding");
}