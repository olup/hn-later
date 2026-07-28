import { Bookmark, ChevronLeft, ChevronsDown, ChevronsUp, Minimize2, Plus } from "lucide-react-native";
import { FlashList } from "@shopify/flash-list";
import { router, useLocalSearchParams } from "expo-router";
import { useMemo, useRef, useState } from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from "react-native";
import { CommentItem } from "@/components/CommentItem";
import { EmptyState } from "@/components/EmptyState";
import { IconButton } from "@/components/IconButton";
import { Screen } from "@/components/Screen";
import { useComments, useStory } from "@/hooks/useHN";
import { useReadLater } from "@/hooks/useReadLater";
import type { FlatComment } from "@/models/hn";
import { colors } from "@/theme/colors";
import { formatCount } from "@/utils/format";
import { collectCollapsibleCommentIds, flattenComments, topLevelIndices, visibleComments } from "@/utils/comments";

export default function CommentsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const storyId = Number(id);
  const listRef = useRef<any>(null);
  const [collapsedIds, setCollapsedIds] = useState<Set<number>>(new Set());
  const [topIndex, setTopIndex] = useState(0);
  const { data: story, isLoading: storyLoading } = useStory(storyId);
  const comments = useComments(storyId, story?.kids ?? []);
  const readLater = useReadLater();

  const flat = useMemo(() => {
    return visibleComments(flattenComments(comments.data ?? [], { collapsedIds, collapseDepth: 2 }));
  }, [comments.data, collapsedIds]);

  const topLevels = useMemo(() => topLevelIndices(flat), [flat]);
  const saved = story ? readLater.savedIds.has(story.id) : false;

  function toggleComment(idToToggle: number) {
    setCollapsedIds((previous) => {
      const next = new Set(previous);
      if (next.has(idToToggle)) next.delete(idToToggle);
      else next.add(idToToggle);
      return next;
    });
  }

  function collapseAllComments() {
    setCollapsedIds(collectCollapsibleCommentIds(comments.data ?? []));
  }

  function jump(delta: number) {
    if (topLevels.length === 0) return;
    const next = Math.max(0, Math.min(topLevels.length - 1, topIndex + delta));
    setTopIndex(next);
    listRef.current?.scrollToIndex({ index: topLevels[next], animated: true, viewPosition: 0 });
  }

  return (
    <Screen>
      <View style={styles.header}>
        <IconButton accessibilityLabel="Retour" onPress={() => router.back()}>
          <ChevronLeft color={colors.text} size={25} />
        </IconButton>
        {story ? (
          <IconButton accessibilityLabel="Read Later" active={saved} onPress={() => readLater.toggle(story)}>
            <Bookmark color={saved ? colors.orange : colors.text} fill={saved ? colors.orange : "transparent"} size={22} />
          </IconButton>
        ) : null}
      </View>
      {storyLoading ? (
        <View style={styles.center}>
          <ActivityIndicator color={colors.orange} />
        </View>
      ) : !story ? (
        <EmptyState title="Discussion introuvable" body="La story n’est pas disponible." />
      ) : (
        <>
          <View style={styles.storyHeader}>
            <Text style={styles.title}>{story.title}</Text>
            <Text style={styles.meta}>
              {formatCount(story.score)} points · {story.commentCount} comments
            </Text>
          </View>
          {comments.isLoading ? (
            <View style={styles.center}>
              <ActivityIndicator color={colors.orange} />
              <Text style={styles.loadingText}>Chargement des meilleurs commentaires…</Text>
            </View>
          ) : comments.error ? (
            <EmptyState title="Commentaires indisponibles" body="Hacker News ne répond pas. Réessaie dans un instant." />
          ) : (
            <FlashList
              ref={listRef}
              data={flat}
              keyExtractor={(item) => String(item.id)}
              renderItem={({ item }) => (
                <CommentItem comment={item} collapsed={collapsedIds.has(item.id)} onToggle={() => toggleComment(item.id)} />
              )}
              ListEmptyComponent={<EmptyState title="Aucun commentaire" body="Cette discussion n’a pas encore de commentaires." />}
            />
          )}
          <View style={styles.floatBar}>
            <Pressable onPress={() => jump(-1)} style={styles.floatButton}>
              <ChevronsUp color={colors.text} size={20} />
            </Pressable>
            <Pressable onPress={() => jump(1)} style={styles.floatButton}>
              <ChevronsDown color={colors.text} size={20} />
            </Pressable>
            <Pressable onPress={collapseAllComments} style={styles.floatButton}>
              <Minimize2 color={colors.text} size={20} />
            </Pressable>
            <Pressable
              onPress={() => {
                setCollapsedIds(new Set());
              }}
              style={styles.floatButton}
            >
              <Plus color={colors.text} size={20} />
            </Pressable>
          </View>
        </>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  center: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
    padding: 24,
  },
  loadingText: {
    color: colors.textMuted,
    fontSize: 15,
    marginTop: 14,
    textAlign: "center",
  },
  storyHeader: {
    borderBottomColor: colors.borderSoft,
    borderBottomWidth: StyleSheet.hairlineWidth,
    paddingBottom: 14,
    paddingHorizontal: 16,
  },
  title: {
    color: colors.text,
    fontSize: 22,
    fontWeight: "800",
    lineHeight: 31,
  },
  meta: {
    color: colors.textMuted,
    fontSize: 13,
    marginTop: 8,
  },
  floatBar: {
    alignSelf: "center",
    backgroundColor: colors.surfaceStrong,
    borderColor: colors.border,
    borderRadius: 8,
    borderWidth: StyleSheet.hairlineWidth,
    bottom: 18,
    flexDirection: "row",
    gap: 4,
    padding: 4,
    position: "absolute",
  },
  floatButton: {
    alignItems: "center",
    height: 42,
    justifyContent: "center",
    width: 42,
  },
});
