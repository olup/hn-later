import { flattenComments } from "@/utils/comments";
import type { CommentNode } from "@/models/hn";

const tree: CommentNode[] = [
  {
    id: 1,
    author: "neom",
    text: "Top level",
    time: 1,
    kids: [
      {
        id: 2,
        author: "jdmm",
        text: "Reply",
        time: 2,
        kids: [{ id: 3, author: "curious_hn", text: "Deep reply", time: 3, kids: [] }],
      },
    ],
  },
  { id: 4, author: "tptacek", text: "Second top level", time: 4, kids: [] },
];

test("flattens comments and collapses deep replies by default", () => {
  const flat = flattenComments(tree, { collapsedIds: new Set(), collapseDepth: 2 });

  expect(flat.map((comment) => [comment.id, comment.depth, comment.hidden])).toEqual([
    [1, 0, false],
    [2, 1, false],
    [3, 2, true],
    [4, 0, false],
  ]);
});

test("hides descendants of collapsed comments", () => {
  const flat = flattenComments(tree, { collapsedIds: new Set([1]), collapseDepth: 99 });

  expect(flat.find((comment) => comment.id === 2)?.hidden).toBe(true);
  expect(flat.find((comment) => comment.id === 1)?.replyCount).toBe(2);
});
