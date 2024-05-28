/**
 * @jest-environment jsdom
 */
import React, { act } from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import axios from "axios";
import Previewer from "./Previewer";
import { treeSchema } from "@/utils/schemas/treeSchema";
import { z } from "zod";

global.clearImmediate = jest.fn();

jest.mock("axios");

describe("Previewer component", () => {
  const mockOnClose = jest.fn();
  const mockOnSuccess = jest.fn();
  const mockOnError = jest.fn();

  const sampleTree = [
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

  const sampleComponents = [
    {
      name: "Component1",
      stringFunction: btoa("() => <div>Component1</div>"),
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders correctly when open", async () => {
    (axios.get as jest.Mock)
      .mockResolvedValueOnce({ data: sampleTree })
      .mockResolvedValueOnce({ data: sampleComponents });

    await act(async () => {
      render(
        <Previewer
          open={true}
          onClose={mockOnClose}
          onSuccess={mockOnSuccess}
          onError={mockOnError}
        />
      );
    });

    expect(axios.get).toHaveBeenCalledTimes(2);
    expect(screen.getByText("Component1")).toBeInTheDocument();
  });

  it("calls onClose when close button is clicked", async () => {
    (axios.get as jest.Mock)
      .mockResolvedValueOnce({ data: sampleTree })
      .mockResolvedValueOnce({ data: sampleComponents });

    await act(async () => {
      render(
        <Previewer
          open={true}
          onClose={mockOnClose}
          onSuccess={mockOnSuccess}
          onError={mockOnError}
        />
      );
    });

    const closeButton = screen.getByRole("button", { name: /close/i });
    fireEvent.click(closeButton);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it("calls onSuccess when HTML generation succeeds", async () => {
    (axios.get as jest.Mock)
      .mockResolvedValueOnce({ data: sampleTree })
      .mockResolvedValueOnce({ data: sampleComponents });
    (axios.post as jest.Mock).mockResolvedValueOnce({ data: {} });

    await act(async () => {
      render(
        <Previewer
          open={true}
          onClose={mockOnClose}
          onSuccess={mockOnSuccess}
          onError={mockOnError}
        />
      );
    });

    const generateButton = screen.getByRole("button", {
      name: /сгенерировать html/i,
    });
    fireEvent.click(generateButton);

    expect(axios.post).toHaveBeenCalledWith(
      "/api/generate-html",
      expect.anything()
    );
    expect(mockOnSuccess).toHaveBeenCalledWith("HTML успешно сгенерирован");
  });

  it("calls onError when HTML generation fails", async () => {
    (axios.get as jest.Mock)
      .mockResolvedValueOnce({ data: sampleTree })
      .mockResolvedValueOnce({ data: sampleComponents });
    (axios.post as jest.Mock).mockRejectedValueOnce(new Error("error"));

    await act(async () => {
      render(
        <Previewer
          open={true}
          onClose={mockOnClose}
          onSuccess={mockOnSuccess}
          onError={mockOnError}
        />
      );
    });

    const generateButton = screen.getByRole("button", {
      name: /сгенерировать html/i,
    });
    fireEvent.click(generateButton);

    expect(mockOnError).toHaveBeenCalledWith(
      "Произошла ошибка во время генерации HTML. Попробуйте ещё раз"
    );
  });
});
