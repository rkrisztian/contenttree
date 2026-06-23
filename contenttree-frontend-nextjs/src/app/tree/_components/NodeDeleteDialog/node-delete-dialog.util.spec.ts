import { describe, expect, it } from "vitest";
import { convertTreeToList } from "./node-delete-dialog-util";

describe("calculateTreeAsList", () => {
  it("should return flattened list", () => {
    expect(
      convertTreeToList({
        id: 1,
        name: "root node",
        parentId: null,
        children: [
          {
            id: 2,
            name: "child node",
            parentId: 1,
            children: [
              {
                id: 3,
                name: "grandchild node",
                parentId: 2,
                children: [],
              },
            ],
          },
          {
            id: 4,
            name: "child node 2",
            parentId: 1,
            children: [],
          },
        ],
      }),
    ).toMatchObject([
      { indentLevel: 0, node: expect.objectContaining({ id: 1 }) },
      { indentLevel: 1, node: expect.objectContaining({ id: 2 }) },
      { indentLevel: 2, node: expect.objectContaining({ id: 3 }) },
      { indentLevel: 1, node: expect.objectContaining({ id: 4 }) },
    ]);
  });
});
