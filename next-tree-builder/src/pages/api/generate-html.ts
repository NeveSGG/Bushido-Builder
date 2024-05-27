import type { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";
import fs from "fs";
import path from "path";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const filePath = path.join(process.cwd(), "content.html");

  if (req.method === "POST") {
    const newData = atob(req.body.message);

    fs.writeFile(filePath, newData, "utf8", (err) => {
      if (err) {
        res.status(500).json({ error: "Error writing file" });
        return;
      }

      res.status(200).json({ message: "File successfully updated" });
    });
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
