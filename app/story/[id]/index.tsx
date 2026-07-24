import * as Sharing from "expo-sharing";
import * as WebBrowser from "expo-web-browser";
import { Bookmark, ChevronLeft, ExternalLink, MessageSquare, MoreVertical, Share2 } from "lucide-react-native";
import { router, useLocalSearchParams } from "expo-router";
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { EmptyState } from "@/components/EmptyState";
import { IconButton } from "@/components/IconButton";
import { Screen } from "@/components/Screen";
import { useStory } from "@/hooks/useHN";
import { useReadLater } from "@/hooks/useReadLater";
import { useSettings } from "@/hooks/useSettings";
import { colors } from "@/theme/colors";
import { formatCount, formatRelativeTime } from "@/utils/format";

export default function StoryDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const storyId = Number(id);
  const { data: story, isLoading, error } = useStory(storyId);
  const readLater = useReadLater();
  const { settings } = useSettings();
  const saved = story ? readLater.savedIds.has(story.id) : false;

  async function openLink() {
    if (!story?.url) return;
    await WebBrowser.openBrowserAsync(story.url, {
      presentationStyle: WebBrowser.WebBrowserPresentationStyle.FULL_SCREEN,
    });
  }

  async function shareStory() {
    const url = story?.url ?? `https://news.ycombinator.com/item?id=${story?.id}`;
    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(url);
    }
  }

  return (
    <Screen>
      <View style={styles.header}>
        <IconButton accessibilityLabel="Retour" onPress={() => router.back()}>
          <ChevronLeft color={colors.text} size={25} />
        </IconButton>
        <View style={styles.headerActions}>
          {story ? (
            <IconButton accessibilityLabel="Read Later" active={saved} onPress={() => readLater.toggle(story)}>
              <Bookmark color={saved ? colors.orange : colors.text} fill={saved ? colors.orange : "transparent"} size={22} />
            </IconButton>
          ) : null}
          <IconButton accessibilityLabel="Plus">
            <MoreVertical color={colors.text} size={21} />
          </IconButton>
        </View>
      </View>
      {isLoading ? (
        <View style={styles.center}>
          <ActivityIndicator color={colors.orange} />
        </View>
      ) : error || !story ? (
        <EmptyState title="Story introuvable" body="La story Hacker News n’est pas disponible." />
      ) : (
        <ScrollView contentContainerStyle={styles.content}>
          <Text style={[styles.title, settings.fontScale === "large" && styles.titleLarge]}>{story.title}</Text>
          <View style={styles.domainRow}>
            <Text style={styles.domain}>{story.domain}</Text>
            {story.url ? <ExternalLink color={colors.textMuted} size={15} /> : null}
          </View>
          <View style={styles.metaRow}>
            <Text style={styles.meta}>{formatCount(story.score)} points</Text>
            <Text style={styles.meta}>·</Text>
            <Text style={styles.meta}>{story.commentCount} comments</Text>
            <Text style={styles.meta}>·</Text>
            <Text style={styles.meta}>by {story.author}</Text>
          </View>
          <Text style={styles.time}>{formatRelativeTime(story.time)} ago</Text>
          <View style={styles.divider} />
          <Text style={styles.summary}>
            Discussion Hacker News avec accès rapide aux commentaires, aux branches principales et à la sauvegarde locale.
          </Text>
          <View style={styles.actions}>
            <Pressable
              onPress={() => router.push({ pathname: "/story/[id]/comments", params: { id: String(story.id) } })}
              style={styles.secondaryButton}
            >
              <MessageSquare color={colors.text} size={21} />
              <Text style={styles.secondaryText}>Voir les commentaires</Text>
            </Pressable>
            {story.url ? (
              <Pressable onPress={openLink} style={styles.primaryButton}>
                <ExternalLink color={colors.text} size={21} />
                <Text style={styles.primaryText}>{settings.linkMode === "chrome" ? "Ouvrir dans Chrome" : "Ouvrir le lien"}</Text>
              </Pressable>
            ) : null}
            <Pressable onPress={shareStory} style={styles.actionRow}>
              <Share2 color={colors.textMuted} size={20} />
              <Text style={styles.actionText}>Partager</Text>
            </Pressable>
          </View>
        </ScrollView>
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
  headerActions: {
    flexDirection: "row",
  },
  center: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
  },
  content: {
    padding: 22,
  },
  title: {
    color: colors.text,
    fontSize: 28,
    fontWeight: "800",
    lineHeight: 36,
  },
  titleLarge: {
    fontSize: 32,
    lineHeight: 40,
  },
  domainRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: 6,
    marginTop: 18,
  },
  domain: {
    color: colors.textMuted,
    fontSize: 16,
  },
  metaRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 18,
  },
  meta: {
    color: colors.textMuted,
    fontSize: 14,
  },
  time: {
    color: colors.textMuted,
    fontSize: 14,
    marginTop: 8,
  },
  divider: {
    backgroundColor: colors.border,
    height: StyleSheet.hairlineWidth,
    marginVertical: 26,
  },
  summary: {
    color: colors.text,
    fontSize: 16,
    lineHeight: 24,
  },
  actions: {
    gap: 12,
    marginTop: 72,
  },
  secondaryButton: {
    alignItems: "center",
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 8,
    borderWidth: StyleSheet.hairlineWidth,
    flexDirection: "row",
    gap: 12,
    justifyContent: "center",
    minHeight: 54,
  },
  secondaryText: {
    color: colors.text,
    fontSize: 16,
    fontWeight: "700",
  },
  primaryButton: {
    alignItems: "center",
    backgroundColor: colors.orange,
    borderRadius: 8,
    flexDirection: "row",
    gap: 12,
    justifyContent: "center",
    minHeight: 54,
  },
  primaryText: {
    color: colors.text,
    fontSize: 16,
    fontWeight: "800",
  },
  actionRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: 12,
    padding: 14,
  },
  actionText: {
    color: colors.textMuted,
    fontSize: 15,
  },
});
