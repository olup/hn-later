import * as WebBrowser from "expo-web-browser";
import { Download, ExternalLink, RefreshCw } from "lucide-react-native";
import { useState } from "react";
import { ActivityIndicator, Alert, Pressable, StyleSheet, Switch, Text, View } from "react-native";
import { Screen } from "@/components/Screen";
import { useSettings } from "@/hooks/useSettings";
import { useLatestUpdate } from "@/hooks/useUpdates";
import { colors } from "@/theme/colors";
import type { AppSettings } from "@/storage/settings";
import { downloadAndLaunchApk } from "@/utils/updateInstaller";

const fontOptions: AppSettings["fontScale"][] = ["small", "normal", "large"];

export default function SettingsScreen() {
  const { settings, setSettings } = useSettings();
  const update = useLatestUpdate();
  const [installing, setInstalling] = useState(false);

  async function openReleasePage() {
    if (!update.data?.releaseUrl) return;
    await WebBrowser.openBrowserAsync(update.data.releaseUrl, {
      presentationStyle: WebBrowser.WebBrowserPresentationStyle.FULL_SCREEN,
    });
  }

  async function installUpdate() {
    if (!update.data?.apkUrl) {
      await openReleasePage();
      return;
    }

    setInstalling(true);
    try {
      await downloadAndLaunchApk(update.data.apkUrl, update.data.latestVersion);
    } catch (error) {
      Alert.alert(
        "Install failed",
        "Android could not open the downloaded APK. The GitHub release page will open instead.",
        [{ text: "Open release", onPress: openReleasePage }, { text: "Cancel" }],
      );
    } finally {
      setInstalling(false);
    }
  }

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
      <View style={styles.section}>
        <Text style={styles.label}>Updates</Text>
        <View style={styles.updateCard}>
          <View style={styles.updateHeader}>
            <View style={styles.updateText}>
              <Text style={styles.rowTitle}>{update.data?.available ? "Update available" : "HN Later is up to date"}</Text>
              <Text style={styles.rowBody}>
                Installed {update.data?.currentVersion ?? "1.0.0"}
                {update.data ? ` · Latest ${update.data.latestVersion}` : ""}
              </Text>
            </View>
            {update.isFetching ? <ActivityIndicator color={colors.orange} /> : null}
          </View>

          {update.error ? <Text style={styles.errorText}>Could not check GitHub Releases.</Text> : null}

          <View style={styles.updateActions}>
            <Pressable onPress={() => update.refetch()} style={styles.secondaryButton}>
              <RefreshCw color={colors.textMuted} size={17} />
              <Text style={styles.secondaryButtonText}>Check</Text>
            </Pressable>
            <Pressable
              onPress={update.data?.available ? installUpdate : openReleasePage}
              disabled={installing || update.isLoading}
              style={[styles.primaryButton, (installing || update.isLoading) && styles.disabledButton]}
            >
              {installing ? <ActivityIndicator color={colors.text} /> : update.data?.available ? <Download color={colors.text} size={18} /> : <ExternalLink color={colors.text} size={18} />}
              <Text style={styles.primaryButtonText}>{installing ? "Downloading…" : update.data?.available ? "Download update" : "Releases"}</Text>
            </Pressable>
          </View>
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
  updateCard: {
    backgroundColor: colors.surface,
    borderColor: colors.borderSoft,
    borderRadius: 8,
    borderWidth: StyleSheet.hairlineWidth,
    padding: 14,
  },
  updateHeader: {
    alignItems: "center",
    flexDirection: "row",
    gap: 12,
    justifyContent: "space-between",
  },
  updateText: {
    flex: 1,
    minWidth: 0,
  },
  errorText: {
    color: colors.danger,
    fontSize: 13,
    marginTop: 10,
  },
  updateActions: {
    flexDirection: "row",
    gap: 10,
    marginTop: 14,
  },
  secondaryButton: {
    alignItems: "center",
    borderColor: colors.border,
    borderRadius: 8,
    borderWidth: StyleSheet.hairlineWidth,
    flexDirection: "row",
    gap: 7,
    justifyContent: "center",
    minHeight: 42,
    paddingHorizontal: 14,
  },
  secondaryButtonText: {
    color: colors.textMuted,
    fontSize: 14,
    fontWeight: "700",
  },
  primaryButton: {
    alignItems: "center",
    backgroundColor: colors.orange,
    borderRadius: 8,
    flex: 1,
    flexDirection: "row",
    gap: 8,
    justifyContent: "center",
    minHeight: 42,
    paddingHorizontal: 14,
  },
  disabledButton: {
    opacity: 0.58,
  },
  primaryButtonText: {
    color: colors.text,
    fontSize: 14,
    fontWeight: "800",
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
