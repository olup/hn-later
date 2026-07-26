import { Bookmark, ExternalLink, MessageSquare } from "lucide-react-native";
import { Pressable, StyleSheet, Text, View, type GestureResponderEvent } from "react-native";
import type { Story } from "@/models/hn";
import { colors } from "@/theme/colors";
import { formatCount, formatRelativeTime } from "@/utils/format";

type Props = {
  story: Story;
  saved?: boolean;
  compact?: boolean;
  addedLabel?: string;
  onPress: () => void;
  onOpenComments?: () => void;
  onToggleSave?: () => void;
};

export function StoryCard({ story, saved, compact, addedLabel, onPress, onOpenComments, onToggleSave }: Props) {
  function handleNestedPress(event: GestureResponderEvent, action?: () => void) {
    event.stopPropagation();
    action?.();
  }

  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.card, compact && styles.compact, saved && styles.savedCard, pressed && styles.pressed]}>
      <View style={styles.titleRow}>
        <Text style={styles.title} numberOfLines={compact ? 3 : 4}>
          {story.title}
        </Text>
        {story.url ? <ExternalLink size={15} color={colors.textSubtle} style={styles.externalIcon} /> : null}
      </View>

      <Text style={styles.domain} numberOfLines={1}>
        {story.domain}
      </Text>

      <View style={styles.bottomRow}>
        <View style={styles.metaBlock}>
          <Text style={styles.meta} numberOfLines={1}>
            {formatCount(story.score)} pts · by {story.author}
            {!compact ? ` · ${formatRelativeTime(story.time)}` : ""}
          </Text>
          {addedLabel ? <Text style={styles.added}>{addedLabel}</Text> : null}
        </View>

        <View style={styles.actions}>
          {onOpenComments ? (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Lire les commentaires"
              onPress={(event) => handleNestedPress(event, onOpenComments)}
              hitSlop={10}
              style={styles.actionButton}
            >
              <MessageSquare size={16} color={colors.textMuted} />
              <Text style={styles.actionText}>{story.commentCount}</Text>
            </Pressable>
          ) : null}
          {onToggleSave ? (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Read Later"
              onPress={(event) => handleNestedPress(event, onToggleSave)}
              hitSlop={10}
              style={styles.iconAction}
            >
              <Bookmark size={19} color={saved ? colors.orange : colors.textMuted} fill={saved ? colors.orange : "transparent"} />
            </Pressable>
          ) : null}
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.background,
    borderBottomColor: colors.borderSoft,
    borderBottomWidth: StyleSheet.hairlineWidth,
    minHeight: 116,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  compact: {
    backgroundColor: colors.surface,
    borderRadius: 8,
    borderWidth: 0,
    marginBottom: 8,
    minHeight: 108,
  },
  savedCard: {
    borderLeftColor: colors.orange,
    borderLeftWidth: 2,
  },
  pressed: {
    opacity: 0.72,
  },
  titleRow: {
    alignItems: "flex-start",
    flexDirection: "row",
    gap: 8,
  },
  title: {
    color: colors.text,
    flex: 1,
    fontSize: 18,
    fontWeight: "500",
    lineHeight: 26,
  },
  externalIcon: {
    marginTop: 5,
  },
  domain: {
    color: colors.textSubtle,
    fontSize: 14,
    marginTop: 7,
  },
  bottomRow: {
    alignItems: "flex-end",
    flexDirection: "row",
    gap: 12,
    justifyContent: "space-between",
    marginTop: 13,
  },
  metaBlock: {
    flex: 1,
    minWidth: 0,
  },
  meta: {
    color: colors.textMuted,
    fontSize: 13,
    lineHeight: 18,
  },
  actions: {
    alignItems: "center",
    flexDirection: "row",
    gap: 4,
  },
  actionButton: {
    alignItems: "center",
    flexDirection: "row",
    gap: 5,
    minHeight: 36,
    paddingHorizontal: 8,
  },
  actionText: {
    color: colors.textMuted,
    fontSize: 13,
    fontWeight: "600",
  },
  iconAction: {
    alignItems: "center",
    height: 36,
    justifyContent: "center",
    width: 36,
  },
  added: {
    color: colors.textSubtle,
    fontSize: 12,
    marginTop: 3,
  },
});
