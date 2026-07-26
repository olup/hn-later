import { ChevronDown, RefreshCw, Search, X } from "lucide-react-native";
import { useMemo, useState } from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { FlashList } from "@shopify/flash-list";
import { router } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import type { HNCategory, Story } from "@/models/hn";
import { CategorySheet, categoryLabel } from "@/components/CategorySheet";
import { EmptyState } from "@/components/EmptyState";
import { IconButton } from "@/components/IconButton";
import { Screen } from "@/components/Screen";
import { StoryCard } from "@/components/StoryCard";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { useSearchStories, useStories } from "@/hooks/useHN";
import { useReadLater } from "@/hooks/useReadLater";
import { colors } from "@/theme/colors";

export default function HomeScreen() {
  const [category, setCategory] = useState<HNCategory>("top");
  const [sheetOpen, setSheetOpen] = useState(false);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebouncedValue(search, 350);
  const { data, isLoading, isRefetching, error, refetch } = useStories(category);
  const searchResults = useSearchStories(debouncedSearch);
  const readLater = useReadLater();
  const isSearching = debouncedSearch.trim().length >= 2;
  const stories = useMemo(() => (isSearching ? searchResults.data ?? [] : data ?? []), [data, isSearching, searchResults.data]);
  const loading = isSearching ? searchResults.isLoading : isLoading;
  const refreshing = isSearching ? searchResults.isRefetching : isRefetching;
  const listError = isSearching ? searchResults.error : error;

  async function openStory(story: Story) {
    if (!story.url) {
      openComments(story);
      return;
    }
    await WebBrowser.openBrowserAsync(story.url, {
      presentationStyle: WebBrowser.WebBrowserPresentationStyle.FULL_SCREEN,
    });
  }

  function openComments(story: Story) {
    router.push({ pathname: "/story/[id]/comments", params: { id: String(story.id) } });
  }

  return (
    <Screen>
      <View style={styles.header}>
        <Pressable onPress={() => setSheetOpen(true)} style={styles.categoryButton}>
          <View style={styles.logo}>
            <Text style={styles.logoText}>H</Text>
          </View>
          <Text style={styles.title}>{categoryLabel(category)}</Text>
          <ChevronDown color={colors.text} size={18} />
        </Pressable>
        {search.length > 0 ? (
          <IconButton accessibilityLabel="Effacer la recherche" onPress={() => setSearch("")}>
            <X color={colors.text} size={22} />
          </IconButton>
        ) : (
          <Search color={colors.textMuted} size={22} />
        )}
      </View>
      <View style={styles.searchWrap}>
        <Search color={colors.textSubtle} size={19} />
        <TextInput
          autoCapitalize="none"
          autoCorrect={false}
          placeholder="Search Hacker News with Algolia"
          placeholderTextColor={colors.textSubtle}
          value={search}
          onChangeText={setSearch}
          style={styles.searchInput}
          returnKeyType="search"
        />
      </View>
      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator color={colors.orange} />
          <Text style={styles.loadingText}>{isSearching ? "Searching Hacker News…" : "Loading stories…"}</Text>
        </View>
      ) : listError ? (
        <EmptyState
          title={isSearching ? "Search failed" : "Impossible de charger Hacker News"}
          body={isSearching ? "Algolia did not respond. Try again in a moment." : "Vérifie la connexion puis tire pour rafraîchir."}
        />
      ) : (
        <FlashList
          data={stories}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => (
            <StoryCard
              story={item}
              saved={readLater.savedIds.has(item.id)}
              onPress={() => openStory(item)}
              onOpenComments={() => openComments(item)}
              onToggleSave={() => readLater.toggle(item)}
            />
          )}
          refreshing={refreshing}
          onRefresh={isSearching ? searchResults.refetch : refetch}
          ListHeaderComponent={
            isSearching ? (
              <View style={styles.resultHeader}>
                <Text style={styles.resultLabel}>Search results</Text>
                <Text style={styles.resultQuery}>{debouncedSearch}</Text>
              </View>
            ) : null
          }
          ListEmptyComponent={
            <EmptyState
              title={isSearching ? "No results" : "Aucune story"}
              body={isSearching ? "Try a broader query or another keyword." : "Cette catégorie ne contient rien pour le moment."}
            />
          }
        />
      )}
      <Pressable onPress={() => (isSearching ? searchResults.refetch() : refetch())} style={styles.floatingRefresh}>
        <RefreshCw color={colors.text} size={18} />
      </Pressable>
      <CategorySheet visible={sheetOpen} selected={category} onSelect={setCategory} onClose={() => setSheetOpen(false)} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    alignItems: "center",
    borderBottomColor: colors.borderSoft,
    borderBottomWidth: StyleSheet.hairlineWidth,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  categoryButton: {
    alignItems: "center",
    flexDirection: "row",
    gap: 10,
  },
  logo: {
    alignItems: "center",
    backgroundColor: colors.orange,
    borderRadius: 4,
    height: 32,
    justifyContent: "center",
    width: 32,
  },
  logoText: {
    color: colors.text,
    fontSize: 21,
    fontWeight: "900",
  },
  title: {
    color: colors.text,
    fontSize: 18,
    fontWeight: "700",
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
    marginTop: 12,
    textAlign: "center",
  },
  searchWrap: {
    alignItems: "center",
    backgroundColor: colors.surface,
    borderColor: colors.borderSoft,
    borderRadius: 8,
    borderWidth: StyleSheet.hairlineWidth,
    flexDirection: "row",
    gap: 10,
    marginHorizontal: 16,
    marginVertical: 12,
    minHeight: 46,
    paddingHorizontal: 12,
  },
  searchInput: {
    color: colors.text,
    flex: 1,
    fontSize: 16,
    minHeight: 44,
  },
  resultHeader: {
    borderBottomColor: colors.borderSoft,
    borderBottomWidth: StyleSheet.hairlineWidth,
    paddingBottom: 10,
    paddingHorizontal: 16,
    paddingTop: 2,
  },
  resultLabel: {
    color: colors.orange,
    fontSize: 12,
    fontWeight: "800",
    textTransform: "uppercase",
  },
  resultQuery: {
    color: colors.text,
    fontSize: 18,
    fontWeight: "800",
    marginTop: 3,
  },
  floatingRefresh: {
    alignItems: "center",
    backgroundColor: colors.surfaceStrong,
    borderColor: colors.border,
    borderRadius: 8,
    borderWidth: StyleSheet.hairlineWidth,
    bottom: 20,
    height: 42,
    justifyContent: "center",
    position: "absolute",
    right: 16,
    width: 42,
  },
});
