import { findApkAsset, isNewerVersion, normalizeReleaseVersion } from "@/api/updates";

test("normalizes GitHub release tags into version strings", () => {
  expect(normalizeReleaseVersion("v1.0.42")).toBe("1.0.42");
  expect(normalizeReleaseVersion("1.2.3")).toBe("1.2.3");
});

test("detects newer semantic versions", () => {
  expect(isNewerVersion("1.0.42", "1.0.0")).toBe(true);
  expect(isNewerVersion("1.0.0", "1.0.42")).toBe(false);
  expect(isNewerVersion("1.0.42", "1.0.42")).toBe(false);
});

test("finds the APK asset in a GitHub release", () => {
  const asset = findApkAsset([
    { name: "notes.txt", browser_download_url: "https://example.com/notes.txt", size: 1 },
    { name: "hn-later-v1.0.42.apk", browser_download_url: "https://example.com/app.apk", size: 42 },
  ]);

  expect(asset?.browser_download_url).toBe("https://example.com/app.apk");
});
