import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import axios from "axios";
import Previewer from "../components/Previewer";

jest.mock("axios");

const mockTreeData = [
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

const mockComponentsData = [
  {
    name: "TestComponent",
    stringFunction: btoa(`() => <div>Test Component</div>`),
  },
];

describe("Previewer component", () => {
  it("renders modal when open is true", () => {
    render(
      <Previewer
        open={true}
        onClose={jest.fn()}
        onSuccess={jest.fn()}
        onError={jest.fn()}
      />
    );
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("does not render modal when open is false", () => {
    render(
      <Previewer
        open={false}
        onClose={jest.fn()}
        onSuccess={jest.fn()}
        onError={jest.fn()}
      />
    );
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("fetches tree and components data when opened", async () => {
    axios.get.mockImplementation((url) => {
      if (url === "/api/read-json-tree") {
        return Promise.resolve({ data: mockTreeData });
      } else if (url === "/api/get-compiled-components") {
        return Promise.resolve({ data: mockComponentsData });
      }
      return Promise.reject(new Error("not found"));
    });

    render(
      <Previewer
        open={true}
        onClose={jest.fn()}
        onSuccess={jest.fn()}
        onError={jest.fn()}
      />
    );

    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledWith("/api/read-json-tree");
      expect(axios.get).toHaveBeenCalledWith("/api/get-compiled-components");
    });
  });

  it("renders components based on fetched data", async () => {
    axios.get.mockImplementation((url) => {
      if (url === "/api/read-json-tree") {
        return Promise.resolve({ data: mockTreeData });
      } else if (url === "/api/get-compiled-components") {
        return Promise.resolve({ data: mockComponentsData });
      }
      return Promise.reject(new Error("not found"));
    });

    render(
      <Previewer
        open={true}
        onClose={jest.fn()}
        onSuccess={jest.fn()}
        onError={jest.fn()}
      />
    );

    await waitFor(() => {
      expect(screen.getByText("Test Component")).toBeInTheDocument();
    });
  });

  it("handles error when fetching data fails", async () => {
    const mockOnError = jest.fn();

    axios.get.mockRejectedValue(new Error("Failed to fetch"));

    render(
      <Previewer
        open={true}
        onClose={jest.fn()}
        onSuccess={jest.fn()}
        onError={mockOnError}
      />
    );

    await waitFor(() => {
      expect(mockOnError).toHaveBeenCalled();
    });
  });

  it("calls onSuccess when HTML generation succeeds", async () => {
    const mockOnSuccess = jest.fn();

    axios.post.mockResolvedValue({ data: "success" });

    render(
      <Previewer
        open={true}
        onClose={jest.fn()}
        onSuccess={mockOnSuccess}
        onError={jest.fn()}
      />
    );

    fireEvent.click(screen.getByText("Сгенерировать HTML"));

    await waitFor(() => {
      expect(mockOnSuccess).toHaveBeenCalledWith("HTML успешно сгенерирован");
    });
  });

  it("calls onError when HTML generation fails", async () => {
    const mockOnError = jest.fn();

    axios.post.mockRejectedValue(new Error("Generation failed"));

    render(
      <Previewer
        open={true}
        onClose={jest.fn()}
        onSuccess={jest.fn()}
        onError={mockOnError}
      />
    );

    fireEvent.click(screen.getByText("Сгенерировать HTML"));

    await waitFor(() => {
      expect(mockOnError).toHaveBeenCalledWith(
        "Произошла ошибка во время генерации HTML. Попробуйте ещё раз"
      );
    });
  });
});
