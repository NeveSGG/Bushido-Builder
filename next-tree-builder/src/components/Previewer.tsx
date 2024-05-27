"use client";
import React, {
  FC,
  ReactElement,
  cloneElement,
  useEffect,
  useState,
} from "react";
import axios from "axios";
import { z } from "zod";
import { treeElementSchema, treeSchema } from "@/utils/schemas/treeSchema";

type FunctionsMap = Map<string, (...params: any) => ReactElement>;

interface OutputProps {
  compiledComponents: FunctionsMap;
  treeItem: z.infer<typeof treeElementSchema>;
}

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

const Output: FC<OutputProps> = ({ compiledComponents, treeItem }) => {
  const { name } = treeItem;
  const defaultFunc = compiledComponents.get(name);

  if (!defaultFunc || name === "Void") return undefined;

  const attributes = treeItem.attributes.reduce((acc, attr) => {
    acc[attr.name] = attr.value;

    return acc;
  }, {} as any);

  const props = treeItem.props.reduce((acc, prop) => {
    acc.push(prop.value);

    return acc;
  }, [] as Array<any>);

  const children = treeItem.children.reduce((acc, child) => {
    acc.push(
      <Output compiledComponents={compiledComponents} treeItem={child} />
    );

    return acc;
  }, [] as Array<ReactElement | undefined>);

  return cloneElement(defaultFunc(React, ...props), attributes, ...children);
};

const Previewer: FC = () => {
  const [tree, setTree] = useState<z.infer<typeof treeSchema> | null>(null);
  const [components, setComponents] = useState<FunctionsMap | null>(null);

  useEffect(() => {
    axios
      .get("/api/read-json-tree")
      .then((response) => {
        const tree = treeSchema.parse(response.data);

        setTree(tree);
        axios
          .get("/api/get-compiled-components")
          .then(
            (response: {
              data: Array<{ name: string; stringFunction: string }>;
            }) => {
              const { data } = response;
              const functionsMap = new Map<
                string,
                (...params: any) => ReactElement
              >();

              data.forEach((element) => {
                functionsMap.set(
                  element.name,
                  eval(atob(element.stringFunction))
                );
              });

              setComponents(functionsMap);
            }
          )
          .catch((error) => {
            console.error(error);
          });
      })
      .catch((error) => {});
  }, []);

  return (
    <>
      {tree &&
        components &&
        tree.map((treeItem, ind) => (
          <Output
            key={ind}
            compiledComponents={components}
            treeItem={treeItem}
          />
        ))}
    </>
  );
};

export default Previewer;
