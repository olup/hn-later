export type HNCategory = "top" | "best" | "new" | "ask" | "show" | "jobs";

export type HNItem = {
  id: number;
  deleted?: boolean;
  type?: string;
  by?: string;
  time?: number;
  text?: string;
  dead?: boolean;
  parent?: number;
  kids?: number[];
  url?: string;
  score?: number;
  title?: string;
  descendants?: number;
};

export type Story = {
  id: number;
  title: string;
  author: string;
  score: number;
  commentCount: number;
  time: number;
  domain: string;
  url?: string;
  type: string;
  kids?: number[];
};

export type CommentNode = {
  id: number;
  author: string;
  text: string;
  time: number;
  kids: CommentNode[];
  deleted?: boolean;
  dead?: boolean;
};

export type FlatComment = CommentNode & {
  depth: number;
  hidden: boolean;
  replyCount: number;
};

export type ReadLaterItem = Story & {
  addedAt: number;
  read: boolean;
};
