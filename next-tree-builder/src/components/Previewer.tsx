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
import { Box, Button, IconButton, Modal } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { renderToString } from "react-dom/server";

type FunctionsMap = Map<string, (...params: any) => ReactElement>;

interface OutputProps {
  compiledComponents: FunctionsMap;
  treeItem: z.infer<typeof treeElementSchema>;
}

interface IProps {
  open: boolean;
  onClose(): void;
  onSuccess(param: string): void;
  onError(param: string): void;
}

const modalStyle = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "80%",
  height: "80vh",
  overflow: "auto",
  borderRadius: "8px",
  bgcolor: "background.paper",
  boxShadow: 24,
  pt: 8,
  px: 4,
  pb: 3,
};

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

const Previewer: FC<IProps> = ({ open, onClose, onSuccess, onError }) => {
  const [tree, setTree] = useState<z.infer<typeof treeSchema> | null>(null);
  const [components, setComponents] = useState<FunctionsMap | null>(null);

  useEffect(() => {
    if (open)
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
  }, [open]);

  const elements =
    tree && components
      ? tree.map((treeItem, ind) => (
          <Output
            key={ind}
            compiledComponents={components}
            treeItem={treeItem}
          />
        ))
      : [];

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={{ ...modalStyle, width: "80%" }}>
        <IconButton
          sx={{
            position: "absolute",
            top: "20px",
            right: "20px",
            borderRadius: "5px",
          }}
          color="secondary"
          size="small"
          onClick={onClose}
        >
          <CloseIcon />
        </IconButton>

        {elements}

        <Button
          sx={{
            position: "absolute",
            bottom: "20px",
            right: "20px",
            borderRadius: "5px",
          }}
          variant="text"
          color="success"
          onClick={() => {
            const htmlString = renderToString(<>{elements}</>);

            axios
              .post("/api/generate-html", { message: btoa(htmlString) })
              .then((response) => {
                onSuccess("HTML успешно сгенерирован");
              })
              .catch((error) => {
                onError(
                  "Произошла ошибка во время генерации HTML. Попробуйте ещё раз"
                );
              });
          }}
        >
          Сгенерировать HTML
        </Button>
      </Box>
    </Modal>
  );
};

export default Previewer;
