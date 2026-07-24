import { useQuery } from "@tanstack/react-query";
import { fetchCommentTree, fetchStories, fetchStory } from "@/api/hn";
import type { HNCategory } from "@/models/hn";

export function useStories(category: HNCategory) {
  return useQuery({
    queryKey: ["stories", category],
    queryFn: () => fetchStories(category),
    staleTime: 1000 * 60 * 3,
  });
}

export function useStory(id: number) {
  return useQuery({
    queryKey: ["story", id],
    queryFn: () => fetchStory(id),
    enabled: Number.isFinite(id),
    staleTime: 1000 * 60 * 10,
  });
}

export function useComments(storyId: number, kids: number[] = []) {
  return useQuery({
    queryKey: ["comments", storyId, kids.join(",")],
    queryFn: () => fetchCommentTree(kids),
    enabled: kids.length > 0,
    staleTime: 1000 * 60 * 5,
  });
}
