import { Briefcase, Clock3, Flame, Megaphone, Star, X, CircleHelp } from "lucide-react-native";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import type { HNCategory } from "@/models/hn";
import { colors } from "@/theme/colors";

const categories: Array<{ id: HNCategory; label: string; icon: typeof Flame }> = [
  { id: "top", label: "Top Stories", icon: Flame },
  { id: "best", label: "Best Stories", icon: Star },
  { id: "new", label: "New Stories", icon: Clock3 },
  { id: "ask", label: "Ask HN", icon: CircleHelp },
  { id: "show", label: "Show HN", icon: Megaphone },
  { id: "jobs", label: "Jobs", icon: Briefcase },
];

export function categoryLabel(category: HNCategory) {
  return categories.find((item) => item.id === category)?.label ?? "Top Stories";
}

export function CategorySheet({
  visible,
  selected,
  onSelect,
  onClose,
}: {
  visible: boolean;
  selected: HNCategory;
  onSelect: (category: HNCategory) => void;
  onClose: () => void;
}) {
  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Catégories</Text>
          <Pressable onPress={onClose} hitSlop={12}>
            <X color={colors.text} size={24} />
          </Pressable>
        </View>
        <View style={styles.list}>
          {categories.map((category) => {
            const Icon = category.icon;
            const active = selected === category.id;
            return (
              <Pressable
                key={category.id}
                onPress={() => {
                  onSelect(category.id);
                  onClose();
                }}
                style={[styles.row, active && styles.activeRow]}
              >
                <Icon color={active ? colors.orange : colors.textMuted} size={22} />
                <Text style={[styles.label, active && styles.activeLabel]}>{category.label}</Text>
              </Pressable>
            );
          })}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 42,
  },
  header: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  title: {
    color: colors.text,
    fontSize: 22,
    fontWeight: "700",
  },
  list: {
    backgroundColor: colors.surface,
    borderRadius: 8,
    overflow: "hidden",
  },
  row: {
    alignItems: "center",
    borderBottomColor: colors.borderSoft,
    borderBottomWidth: StyleSheet.hairlineWidth,
    flexDirection: "row",
    gap: 18,
    minHeight: 58,
    paddingHorizontal: 18,
  },
  activeRow: {
    backgroundColor: colors.orangeSoft,
  },
  label: {
    color: colors.text,
    fontSize: 16,
    fontWeight: "500",
  },
  activeLabel: {
    color: colors.orange,
  },
});
