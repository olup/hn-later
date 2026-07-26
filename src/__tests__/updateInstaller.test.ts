import { buildApkFileName } from "@/utils/updateInstaller";

test("builds a stable APK filename for a release version", () => {
  expect(buildApkFileName("1.0.42")).toBe("hn-later-v1.0.42.apk");
});

test("sanitizes release versions before using them as filenames", () => {
  expect(buildApkFileName("v1.0.42 beta")).toBe("hn-later-v1.0.42-beta.apk");
});
