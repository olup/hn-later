import { ChevronRight, MessageSquare } from "lucide-react-native";
import { Pressable, StyleSheet, Text, View, useWindowDimensions } from "react-native";
import RenderHTML from "react-native-render-html";
import type { FlatComment } from "@/models/hn";
import { colors } from "@/theme/colors";
import { formatRelativeTime } from "@/utils/format";

export function CommentItem({
  comment,
  collapsed,
  onToggle,
}: {
  comment: FlatComment;
  collapsed: boolean;
  onToggle: () => void;
}) {
  const { width } = useWindowDimensions();
  const indent = Math.min(comment.depth * 16, 64);

  return (
    <View style={[styles.wrapper, { paddingLeft: 14 + indent }]}>
      <Pressable onPress={onToggle} style={({ pressed }) => [styles.card, pressed && styles.pressed]}>
        <View style={styles.header}>
          <Text style={styles.author}>{comment.author}</Text>
          <Text style={styles.time}>{formatRelativeTime(comment.time)}</Text>
          {comment.replyCount > 0 ? (
            <View style={styles.replyBadge}>
              {collapsed ? <ChevronRight size={13} color={colors.orange} /> : <MessageSquare size={13} color={colors.textMuted} />}
              <Text style={styles.replyText}>{comment.replyCount}</Text>
            </View>
          ) : null}
        </View>
        <RenderHTML
          contentWidth={width - 44 - indent}
          source={{ html: comment.text || "<p>[deleted]</p>" }}
          baseStyle={styles.html}
          tagsStyles={{
            p: styles.p,
            a: styles.a,
            code: styles.code,
            pre: styles.pre,
          }}
        />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    borderLeftColor: colors.borderSoft,
    borderLeftWidth: StyleSheet.hairlineWidth,
    paddingRight: 12,
    paddingVertical: 4,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 8,
    padding: 12,
  },
  pressed: {
    opacity: 0.78,
  },
  header: {
    alignItems: "center",
    flexDirection: "row",
    gap: 8,
    marginBottom: 6,
  },
  author: {
    color: colors.text,
    fontSize: 13,
    fontWeight: "700",
  },
  time: {
    color: colors.textSubtle,
    fontSize: 12,
  },
  replyBadge: {
    alignItems: "center",
    flexDirection: "row",
    gap: 3,
    marginLeft: "auto",
  },
  replyText: {
    color: colors.textMuted,
    fontSize: 12,
  },
  html: {
    color: colors.textMuted,
    fontSize: 14,
    lineHeight: 20,
  },
  p: {
    marginBottom: 8,
  },
  a: {
    color: colors.orange,
    textDecorationLine: "none",
  },
  code: {
    backgroundColor: colors.backgroundSoft,
    borderRadius: 4,
    color: colors.text,
    fontFamily: "monospace",
    paddingHorizontal: 4,
  },
  pre: {
    backgroundColor: colors.backgroundSoft,
    borderRadius: 6,
    color: colors.text,
    padding: 8,
  },
});
