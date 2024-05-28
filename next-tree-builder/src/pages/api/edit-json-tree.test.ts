import { createMocks } from "node-mocks-http";
import handler from "./edit-json-tree";
import fs from "fs";
import path from "path";
import { z } from "zod";
import { treeSchema } from "@/utils/schemas/treeSchema";
import type { NextApiRequest, NextApiResponse } from "next";

// Мокируем функции файловой системы
jest.mock("fs");

describe("/api/edit-json-tree API Endpoint", () => {
  const filePath = path.join(process.cwd(), "tree.json");

  afterEach(() => {
    jest.resetAllMocks();
  });

  test("should return 200 and update file with valid data", async () => {
    const validData = [
      {
        id: 361607,
        name: "Container",
        attributes: [
          {
            name: "data-container-type",
            value: 3,
          },
        ],
        props: [],
        children: [
          {
            id: 199852,
            name: "Text",
            attributes: [],
            props: [
              {
                name: "textAlignment",
                label: "Выраванивание",
                type: "enum",
                description:
                  '[{"label":"По левому краю","value":"left"},{"label":"По центру","value":"center"},{"label":"По правому краю","value":"right"}]',
                value: null,
              },
              {
                name: "text",
                label: "Текст",
                type: "string",
                value: "aaaa",
              },
            ],
            children: [],
          },
          {
            id: 811559,
            name: "Image",
            attributes: [],
            props: [
              {
                name: "path",
                label: "Путь",
                type: "string",
                value: "/favicon.ico",
              },
            ],
            children: [],
          },
          {
            id: 462917,
            name: "Void",
            attributes: [],
            props: [],
            children: [],
          },
        ],
      },
      {
        id: 146867,
        name: "Container",
        attributes: [
          {
            name: "data-container-type",
            value: 2,
          },
        ],
        props: [],
        children: [
          {
            id: 176662,
            name: "Void",
            attributes: [],
            props: [],
            children: [],
          },
          {
            id: 657107,
            name: "Text",
            attributes: [],
            props: [
              {
                name: "textAlignment",
                label: "Выраванивание",
                type: "enum",
                description:
                  '[{"label":"По левому краю","value":"left"},{"label":"По центру","value":"center"},{"label":"По правому краю","value":"right"}]',
                value: null,
              },
              {
                name: "text",
                label: "Текст",
                type: "string",
                value: "qqq",
              },
            ],
            children: [],
          },
        ],
      },
    ];

    (fs.writeFile as unknown as jest.Mock).mockImplementation(
      (file, data, encoding, callback) => {
        callback(null);
      }
    );

    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: "POST",
      body: validData,
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(200);
    expect(res._getJSONData()).toEqual({
      message: "File successfully updated",
    });
  });

  test("should return 400 with invalid data", async () => {
    const invalidData = [{ val: "wow" }];

    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: "POST",
      body: invalidData,
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(400);
    expect(res._getJSONData()).toHaveProperty("error");
    expect(res._getJSONData().error).toHaveProperty("message", "Invalid data");
  });

  test("should return 500 if file write fails", async () => {
    const validData = [
      {
        id: 361607,
        name: "Container",
        attributes: [
          {
            name: "data-container-type",
            value: 3,
          },
        ],
        props: [],
        children: [
          {
            id: 199852,
            name: "Text",
            attributes: [],
            props: [
              {
                name: "textAlignment",
                label: "Выраванивание",
                type: "enum",
                description:
                  '[{"label":"По левому краю","value":"left"},{"label":"По центру","value":"center"},{"label":"По правому краю","value":"right"}]',
                value: null,
              },
              {
                name: "text",
                label: "Текст",
                type: "string",
                value: "aaaa",
              },
            ],
            children: [],
          },
          {
            id: 811559,
            name: "Image",
            attributes: [],
            props: [
              {
                name: "path",
                label: "Путь",
                type: "string",
                value: "/favicon.ico",
              },
            ],
            children: [],
          },
          {
            id: 462917,
            name: "Void",
            attributes: [],
            props: [],
            children: [],
          },
        ],
      },
      {
        id: 146867,
        name: "Container",
        attributes: [
          {
            name: "data-container-type",
            value: 2,
          },
        ],
        props: [],
        children: [
          {
            id: 176662,
            name: "Void",
            attributes: [],
            props: [],
            children: [],
          },
          {
            id: 657107,
            name: "Text",
            attributes: [],
            props: [
              {
                name: "textAlignment",
                label: "Выраванивание",
                type: "enum",
                description:
                  '[{"label":"По левому краю","value":"left"},{"label":"По центру","value":"center"},{"label":"По правому краю","value":"right"}]',
                value: null,
              },
              {
                name: "text",
                label: "Текст",
                type: "string",
                value: "qqq",
              },
            ],
            children: [],
          },
        ],
      },
    ];

    (fs.writeFile as unknown as jest.Mock).mockImplementation(
      (file, data, encoding, callback) => {
        callback(new Error("Write error"));
      }
    );

    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: "POST",
      body: validData,
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(500);
    expect(res._getJSONData()).toEqual({ error: "Error writing file" });
  });

  test("should return 405 for non-POST methods", async () => {
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: "GET",
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(405);
    expect(res._getJSONData()).toEqual({ error: "Method not allowed" });
  });
});
