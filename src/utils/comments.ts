import type { CommentNode, FlatComment } from "@/models/hn";

type Options = {
  collapsedIds: Set<number>;
  collapseDepth: number;
};

function countReplies(comment: CommentNode): number {
  return comment.kids.reduce((total, child) => total + 1 + countReplies(child), 0);
}

export function flattenComments(comments: CommentNode[], options: Options): FlatComment[] {
  const flat: FlatComment[] = [];

  const visit = (comment: CommentNode, depth: number, hiddenByParent: boolean) => {
    const isDepthCollapsed = depth >= options.collapseDepth;
    const hidden = hiddenByParent || isDepthCollapsed;
    const collapsed = options.collapsedIds.has(comment.id);

    flat.push({
      ...comment,
      depth,
      hidden,
      replyCount: countReplies(comment),
    });

    comment.kids.forEach((child) => visit(child, depth + 1, hidden || collapsed));
  };

  comments.forEach((comment) => visit(comment, 0, false));
  return flat;
}

export function visibleComments(comments: FlatComment[]): FlatComment[] {
  return comments.filter((comment) => !comment.hidden);
}

export function topLevelIndices(comments: FlatComment[]): number[] {
  return comments.reduce<number[]>((indices, comment, index) => {
    if (comment.depth === 0 && !comment.hidden) indices.push(index);
    return indices;
  }, []);
}
