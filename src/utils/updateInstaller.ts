import * as FileSystem from "expo-file-system/legacy";
import * as IntentLauncher from "expo-intent-launcher";
import { Platform } from "react-native";

const APK_MIME_TYPE = "application/vnd.android.package-archive";
const ACTION_VIEW = "android.intent.action.VIEW";
const FLAG_GRANT_READ_URI_PERMISSION = 1;
const FLAG_ACTIVITY_NEW_TASK = 0x10000000;

export function buildApkFileName(version: string): string {
  const cleanVersion = version.replace(/^v/i, "").trim().replace(/[^a-zA-Z0-9._-]+/g, "-");
  return `hn-later-v${cleanVersion}.apk`;
}

export async function downloadAndLaunchApk(apkUrl: string, version: string): Promise<string> {
  if (Platform.OS !== "android") {
    throw new Error("APK updates can only be installed on Android.");
  }

  if (!FileSystem.cacheDirectory) {
    throw new Error("Cache directory is unavailable.");
  }

  const destination = `${FileSystem.cacheDirectory}${buildApkFileName(version)}`;
  const download = await FileSystem.downloadAsync(apkUrl, destination);
  const contentUri = await FileSystem.getContentUriAsync(download.uri);

  await IntentLauncher.startActivityAsync(ACTION_VIEW, {
    data: contentUri,
    type: APK_MIME_TYPE,
    flags: FLAG_GRANT_READ_URI_PERMISSION | FLAG_ACTIVITY_NEW_TASK,
  });

  return download.uri;
}
