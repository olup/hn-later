import { Bookmark } from "lucide-react-native";
import { Pressable, StyleSheet, Text, View } from "react-native";
import type { Story } from "@/models/hn";
import { colors } from "@/theme/colors";
import { formatCount, formatRelativeTime } from "@/utils/format";

type Props = {
  story: Story;
  rank?: number;
  saved?: boolean;
  compact?: boolean;
  addedLabel?: string;
  onPress: () => void;
  onToggleSave?: () => void;
};

export function StoryCard({ story, rank, saved, compact, addedLabel, onPress, onToggleSave }: Props) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.card, compact && styles.compact, pressed && styles.pressed]}>
      <View style={styles.rankColumn}>
        {rank ? <Text style={styles.rank}>{rank}</Text> : <View style={[styles.dot, saved && styles.dotSaved]} />}
      </View>
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={compact ? 2 : 3}>
          {story.title}
        </Text>
        <Text style={styles.domain}>{story.domain}</Text>
        <View style={styles.metaRow}>
          <Text style={styles.meta}>{formatCount(story.score)} points</Text>
          <Text style={styles.meta}>·</Text>
          <Text style={styles.meta}>{story.commentCount} commentaires</Text>
          <Text style={styles.meta}>·</Text>
          <Text style={styles.meta}>by {story.author}</Text>
          {!compact ? <Text style={styles.time}>{formatRelativeTime(story.time)}</Text> : null}
        </View>
      </View>
      <View style={styles.side}>
        {onToggleSave ? (
          <Pressable accessibilityRole="button" accessibilityLabel="Read Later" onPress={onToggleSave} hitSlop={12}>
            <Bookmark size={22} color={saved ? colors.orange : colors.textMuted} fill={saved ? colors.orange : "transparent"} />
          </Pressable>
        ) : null}
        {addedLabel ? <Text style={styles.added}>{addedLabel}</Text> : null}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    alignItems: "flex-start",
    backgroundColor: colors.backgroundSoft,
    borderBottomColor: colors.borderSoft,
    borderBottomWidth: StyleSheet.hairlineWidth,
    flexDirection: "row",
    gap: 12,
    minHeight: 92,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  compact: {
    backgroundColor: colors.surface,
    borderRadius: 8,
    borderWidth: 0,
    marginBottom: 8,
    minHeight: 86,
  },
  pressed: {
    opacity: 0.72,
  },
  rankColumn: {
    alignItems: "center",
    paddingTop: 2,
    width: 22,
  },
  rank: {
    color: colors.orange,
    fontSize: 16,
    fontWeight: "700",
  },
  dot: {
    backgroundColor: colors.textSubtle,
    borderRadius: 5,
    height: 10,
    marginTop: 4,
    width: 10,
  },
  dotSaved: {
    backgroundColor: colors.orange,
  },
  content: {
    flex: 1,
    minWidth: 0,
  },
  title: {
    color: colors.text,
    fontSize: 16,
    fontWeight: "600",
    lineHeight: 21,
  },
  domain: {
    color: colors.textSubtle,
    fontSize: 13,
    marginTop: 4,
  },
  metaRow: {
    alignItems: "center",
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    marginTop: 8,
  },
  meta: {
    color: colors.textMuted,
    fontSize: 12,
  },
  time: {
    color: colors.textMuted,
    fontSize: 12,
    marginLeft: "auto",
  },
  side: {
    alignItems: "flex-end",
    gap: 18,
    minHeight: 56,
  },
  added: {
    color: colors.textSubtle,
    fontSize: 11,
    maxWidth: 76,
    textAlign: "right",
  },
});
