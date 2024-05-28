import type { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";

import { treeSchema } from "@/utils/schemas/treeSchema";
import { z } from "zod";

type ImportPromiseResolveType = (val: any) => void;
const componentsDir = path.join(__dirname, "compiledComponents");
const componentsToSkip = new Set<string>([]);

function getFunctionBody(f: string) {
  const matches = f.match(
    /^(?:\s*\(?(?:\s*\w*\s*,?\s*)*\)?\s*?=>\s*){?([\s\S]*)}?$/
  );
  if (!matches) {
    const funcMatches = f.match(/function[^{]+\{([\s\S]*)\}$/);

    if (funcMatches) {
      return funcMatches[1];
    } else {
      return null;
    }
  }

  const firstPass = matches![1];

  // Needed because the RegExp doesn't handle the last '}'.
  const secondPass =
    (firstPass.match(/{/g) || []).length ===
    (firstPass.match(/}/g) || []).length - 1
      ? firstPass.slice(0, firstPass.lastIndexOf("}"))
      : firstPass;

  return secondPass;
}

const findComponentByName = (
  tree: z.infer<typeof treeSchema>,
  name: string
) => {
  for (let i = 0; i < tree.length; i++) {
    if (tree[i].name === name) {
      return tree[i];
    }

    for (let j = 0; j < tree[i].children.length; j++) {
      if (tree[i].children[j].name === name) {
        return tree[i].children[j];
      }
    }
  }

  return null;
};

const getUniqueTreeItems = (
  arr: z.infer<typeof treeSchema>,
  resultSet: Set<string>
) => {
  arr.forEach((arrItem) => {
    if (!componentsToSkip.has(arrItem.name)) resultSet.add(arrItem.name);
    getUniqueTreeItems(arrItem.children, resultSet);
  });
};

const importComponentDynamically = (componentPath: string): Promise<string> => {
  return new Promise((res: ImportPromiseResolveType, rej) => {
    import(`/compiledComponents/${componentPath}/index.js`)
      .then((module) => {
        res(module.default.toString());
      })
      .catch((err) => {
        rej({ ...err, path: `/compiledComponents/${componentPath}/index.js` });
      });
  });
};

const createComponentsMap = async (
  componentsDir: string,
  componentNames: Set<string>
) => {
  return new Promise((res: (v: Map<string, string>) => void, rej) => {
    const names = Array.from(componentNames);
    const components = Promise.all(names.map(importComponentDynamically));

    components
      .then((compns) => {
        const map = new Map<string, any>();

        names.forEach((name, ind) => {
          map.set(name, compns[ind]);
        });

        res(map);
      })
      .catch((err) => {
        rej(names);
      });
  });
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const filePath = path.join(process.cwd(), "tree.json");

  if (req.method === "GET") {
    fs.readFile(filePath, "utf8", (err, rawData) => {
      if (err) {
        res.status(500).json({ error: "An error occured while reading file" });
        return;
      }

      try {
        var tree = JSON.parse(rawData);
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

      const { data } = parsing;
      const uniqueTreeItems = new Set<string>();
      getUniqueTreeItems(data, uniqueTreeItems);

      createComponentsMap(componentsDir, uniqueTreeItems)
        .then((values) => {
          return res.status(200).json(
            Array.from(values, ([name, stringFunction]) => ({
              name,
              stringFunction: btoa(stringFunction),
            }))
          );
        })
        .catch((err) => {
          res.status(500).json({
            error: err,
          });
        });
    });
  } else {
    return res.status(405).json({ error: "Method not allowed" });
  }
}
