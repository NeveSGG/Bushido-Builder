import type { NextApiRequest, NextApiResponse } from 'next'
import { z } from "zod";
import fs from 'fs';
import path from 'path';
import { treeSchema } from '@/utils/schemas/treeSchema';
 
export default function handler(req: NextApiRequest, res: NextApiResponse) {
    const filePath = path.join(process.cwd(), 'tree.json');

    if (req.method === 'POST') {
        const newData = req.body;

        const parsing = treeSchema.safeParse(newData);

        if (!parsing.success) {
            const { errors } = parsing.error;
            
            return res.status(400).json({
                error: { message: "Invalid data", errors },
            });
        }

        fs.writeFile(filePath, JSON.stringify(newData, null, 4), 'utf8', (err) => {
            if (err) {
                res.status(500).json({ error: 'Error writing file' });
                return;
            }

            res.status(200).json({ message: 'File successfully updated' });
        });
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
}