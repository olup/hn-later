import { ChevronDown, RefreshCw, Search } from "lucide-react-native";
import { useMemo, useState } from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from "react-native";
import { FlashList } from "@shopify/flash-list";
import { router } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import type { HNCategory, Story } from "@/models/hn";
import { CategorySheet, categoryLabel } from "@/components/CategorySheet";
import { EmptyState } from "@/components/EmptyState";
import { IconButton } from "@/components/IconButton";
import { Screen } from "@/components/Screen";
import { StoryCard } from "@/components/StoryCard";
import { useStories } from "@/hooks/useHN";
import { useReadLater } from "@/hooks/useReadLater";
import { colors } from "@/theme/colors";

export default function HomeScreen() {
  const [category, setCategory] = useState<HNCategory>("top");
  const [sheetOpen, setSheetOpen] = useState(false);
  const { data, isLoading, isRefetching, error, refetch } = useStories(category);
  const readLater = useReadLater();
  const stories = useMemo(() => data ?? [], [data]);

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
        <IconButton accessibilityLabel="Recherche">
          <Search color={colors.text} size={22} />
        </IconButton>
      </View>
      {isLoading ? (
        <View style={styles.center}>
          <ActivityIndicator color={colors.orange} />
        </View>
      ) : error ? (
        <EmptyState title="Impossible de charger Hacker News" body="Vérifie la connexion puis tire pour rafraîchir." />
      ) : (
        <FlashList
          data={stories}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item, index }) => (
            <StoryCard
              story={item}
              rank={index + 1}
              saved={readLater.savedIds.has(item.id)}
              onPress={() => openStory(item)}
              onOpenComments={() => openComments(item)}
              onToggleSave={() => readLater.toggle(item)}
            />
          )}
          refreshing={isRefetching}
          onRefresh={refetch}
          ListEmptyComponent={<EmptyState title="Aucune story" body="Cette catégorie ne contient rien pour le moment." />}
        />
      )}
      <Pressable onPress={() => refetch()} style={styles.floatingRefresh}>
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
