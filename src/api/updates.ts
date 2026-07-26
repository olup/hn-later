import Constants from "expo-constants";

const LATEST_RELEASE_URL = "https://api.github.com/repos/olup/hn-later/releases/latest";

export type GitHubReleaseAsset = {
  name: string;
  browser_download_url: string;
  size: number;
};

type GitHubReleaseResponse = {
  tag_name: string;
  html_url: string;
  name?: string | null;
  assets: GitHubReleaseAsset[];
};

export type AppUpdate = {
  currentVersion: string;
  latestVersion: string;
  releaseUrl: string;
  apkUrl?: string;
  apkSize?: number;
  available: boolean;
};

export function getCurrentAppVersion(): string {
  return Constants.expoConfig?.version ?? "1.0.0";
}

export function normalizeReleaseVersion(tag: string): string {
  return tag.trim().replace(/^v/i, "");
}

function versionParts(version: string): number[] {
  return normalizeReleaseVersion(version)
    .split(".")
    .map((part) => Number.parseInt(part, 10))
    .map((part) => (Number.isFinite(part) ? part : 0));
}

export function isNewerVersion(candidate: string, current: string): boolean {
  const next = versionParts(candidate);
  const installed = versionParts(current);
  const length = Math.max(next.length, installed.length);

  for (let index = 0; index < length; index += 1) {
    const candidatePart = next[index] ?? 0;
    const currentPart = installed[index] ?? 0;
    if (candidatePart > currentPart) return true;
    if (candidatePart < currentPart) return false;
  }

  return false;
}

export function findApkAsset(assets: GitHubReleaseAsset[]): GitHubReleaseAsset | undefined {
  return assets.find((asset) => asset.name.toLowerCase().endsWith(".apk"));
}

export function normalizeGitHubRelease(release: GitHubReleaseResponse, currentVersion = getCurrentAppVersion()): AppUpdate {
  const latestVersion = normalizeReleaseVersion(release.tag_name);
  const apk = findApkAsset(release.assets);

  return {
    currentVersion,
    latestVersion,
    releaseUrl: release.html_url,
    apkUrl: apk?.browser_download_url,
    apkSize: apk?.size,
    available: isNewerVersion(latestVersion, currentVersion),
  };
}

export async function fetchLatestUpdate(currentVersion = getCurrentAppVersion()): Promise<AppUpdate> {
  const response = await fetch(LATEST_RELEASE_URL, {
    headers: {
      Accept: "application/vnd.github+json",
    },
  });

  if (!response.ok) {
    throw new Error(`GitHub release check failed: ${response.status}`);
  }

  return normalizeGitHubRelease((await response.json()) as GitHubReleaseResponse, currentVersion);
}
