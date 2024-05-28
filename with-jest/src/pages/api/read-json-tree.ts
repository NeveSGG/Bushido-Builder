import type { NextApiRequest, NextApiResponse } from 'next'
import fs from 'fs';
import path from 'path';

import { treeSchema } from '@/utils/schemas/treeSchema';
 
export default function handler(req: NextApiRequest, res: NextApiResponse) {
    const filePath = path.join(process.cwd(), 'tree.json');

    if (req.method === 'GET') {
        fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) {
              res.status(500).json({ error: 'An error occured while reading file' });
              return;
            }

            try {
                var tree = JSON.parse(data)
            } catch (e) {
                return res.status(500).json({
                    error: { message: "An error occured while parsing json" },
                });
            }

            const parsing = treeSchema.safeParse(tree);

            if (!parsing.success) {
                const { errors } = parsing.error;
            
                return res.status(500).json({
                  error: { message: "Invalid data", errors },
                });
            }

            return res.status(200).json(parsing.data);
        });
    } else {
        return res.status(405).json({ error: 'Method not allowed' });
    }
}