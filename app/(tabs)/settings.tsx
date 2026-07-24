import { StyleSheet, Switch, Text, View, Pressable } from "react-native";
import { Screen } from "@/components/Screen";
import { useSettings } from "@/hooks/useSettings";
import { colors } from "@/theme/colors";
import type { AppSettings } from "@/storage/settings";

const fontOptions: AppSettings["fontScale"][] = ["small", "normal", "large"];

export default function SettingsScreen() {
  const { settings, setSettings } = useSettings();

  return (
    <Screen>
      <View style={styles.header}>
        <Text style={styles.title}>Réglages</Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.label}>Thème</Text>
        <View style={styles.row}>
          <View>
            <Text style={styles.rowTitle}>Mode sombre</Text>
            <Text style={styles.rowBody}>Toujours actif pour le MVP Android.</Text>
          </View>
          <Switch value disabled trackColor={{ true: colors.orange }} />
        </View>
      </View>
      <View style={styles.section}>
        <Text style={styles.label}>Taille de police</Text>
        <View style={styles.segmented}>
          {fontOptions.map((option) => (
            <Pressable
              key={option}
              onPress={() => setSettings({ ...settings, fontScale: option })}
              style={[styles.segment, settings.fontScale === option && styles.segmentActive]}
            >
              <Text style={[styles.segmentText, settings.fontScale === option && styles.segmentTextActive]}>{option}</Text>
            </Pressable>
          ))}
        </View>
      </View>
      <View style={styles.section}>
        <Text style={styles.label}>Ouverture des liens</Text>
        <View style={styles.segmented}>
          {(["internal", "chrome"] as const).map((option) => (
            <Pressable
              key={option}
              onPress={() => setSettings({ ...settings, linkMode: option })}
              style={[styles.segment, settings.linkMode === option && styles.segmentActive]}
            >
              <Text style={[styles.segmentText, settings.linkMode === option && styles.segmentTextActive]}>
                {option === "internal" ? "Interne" : "Chrome"}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    padding: 16,
  },
  title: {
    color: colors.text,
    fontSize: 24,
    fontWeight: "800",
  },
  section: {
    borderTopColor: colors.borderSoft,
    borderTopWidth: StyleSheet.hairlineWidth,
    padding: 16,
  },
  label: {
    color: colors.orange,
    fontSize: 12,
    fontWeight: "800",
    marginBottom: 12,
    textTransform: "uppercase",
  },
  row: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  rowTitle: {
    color: colors.text,
    fontSize: 17,
    fontWeight: "700",
  },
  rowBody: {
    color: colors.textMuted,
    fontSize: 13,
    marginTop: 4,
  },
  segmented: {
    backgroundColor: colors.surface,
    borderRadius: 8,
    flexDirection: "row",
    padding: 4,
  },
  segment: {
    alignItems: "center",
    borderRadius: 6,
    flex: 1,
    paddingVertical: 10,
  },
  segmentActive: {
    backgroundColor: colors.orange,
  },
  segmentText: {
    color: colors.textMuted,
    fontSize: 14,
    fontWeight: "700",
    textTransform: "capitalize",
  },
  segmentTextActive: {
    color: colors.text,
  },
});
