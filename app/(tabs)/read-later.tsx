import { MoreHorizontal, Search } from "lucide-react-native";
import { useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { FlashList } from "@shopify/flash-list";
import { router } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import { EmptyState } from "@/components/EmptyState";
import { IconButton } from "@/components/IconButton";
import { Screen } from "@/components/Screen";
import { StoryCard } from "@/components/StoryCard";
import { useReadLater } from "@/hooks/useReadLater";
import type { ReadLaterStatus } from "@/storage/readLater";
import { colors } from "@/theme/colors";
import { formatDateTime } from "@/utils/format";

const filters: Array<{ id: ReadLaterStatus; label: string }> = [
  { id: "all", label: "Tous" },
  { id: "unread", label: "Non lus" },
  { id: "read", label: "Lus" },
];

export default function ReadLaterScreen() {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<ReadLaterStatus>("all");
  const readLater = useReadLater();
  const items = useMemo(() => readLater.filter({ status, query }), [readLater.items, status, query]);

  async function openItem(url?: string) {
    if (!url) return;
    await WebBrowser.openBrowserAsync(url, {
      presentationStyle: WebBrowser.WebBrowserPresentationStyle.FULL_SCREEN,
    });
  }

  return (
    <Screen>
      <View style={styles.header}>
        <Text style={styles.title}>Read Later</Text>
        <View style={styles.headerActions}>
          <IconButton accessibilityLabel="Recherche">
            <Search color={colors.text} size={21} />
          </IconButton>
          <IconButton accessibilityLabel="Supprimer les lus" onPress={readLater.removeRead}>
            <MoreHorizontal color={colors.text} size={22} />
          </IconButton>
        </View>
      </View>
      <View style={styles.searchWrap}>
        <TextInput
          placeholder="Rechercher titre, URL ou domaine"
          placeholderTextColor={colors.textSubtle}
          value={query}
          onChangeText={setQuery}
          style={styles.search}
        />
      </View>
      <View style={styles.filters}>
        {filters.map((filter) => (
          <Pressable key={filter.id} onPress={() => setStatus(filter.id)} style={[styles.filter, status === filter.id && styles.activeFilter]}>
            <Text style={[styles.filterText, status === filter.id && styles.activeFilterText]}>{filter.label}</Text>
          </Pressable>
        ))}
      </View>
      <FlashList
        data={items}
        contentContainerStyle={styles.list}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item, index }) => (
          <StoryCard
            story={item}
            rank={index + 1}
            compact
            saved={!item.read}
            addedLabel={formatDateTime(item.addedAt)}
            onPress={() => openItem(item.url)}
            onOpenComments={() => router.push({ pathname: "/story/[id]/comments", params: { id: String(item.id) } })}
            onToggleSave={() => readLater.remove(item.id)}
          />
        )}
        ListEmptyComponent={<EmptyState title="Rien à lire plus tard" body="Ajoute une story depuis l’accueil ou une discussion." />}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 10,
  },
  title: {
    color: colors.text,
    fontSize: 24,
    fontWeight: "800",
  },
  headerActions: {
    flexDirection: "row",
  },
  searchWrap: {
    paddingHorizontal: 16,
  },
  search: {
    backgroundColor: colors.surface,
    borderRadius: 8,
    color: colors.text,
    fontSize: 15,
    height: 42,
    paddingHorizontal: 12,
  },
  filters: {
    flexDirection: "row",
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  filter: {
    backgroundColor: colors.surface,
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 9,
  },
  activeFilter: {
    backgroundColor: colors.orange,
  },
  filterText: {
    color: colors.textMuted,
    fontSize: 13,
    fontWeight: "700",
  },
  activeFilterText: {
    color: colors.text,
  },
  list: {
    paddingHorizontal: 12,
    paddingBottom: 24,
  },
});
