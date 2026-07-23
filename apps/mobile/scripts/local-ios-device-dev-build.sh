#!/usr/bin/env bash
set -euo pipefail

APP_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$APP_DIR"

DEVICE_ID="${DEVICE_ID:-00008110-000475662EF2601E}"
TEAM_ID="${TEAM_ID:-Q9B7K2SJ4D}"
BUILD_CONFIGURATION="${BUILD_CONFIGURATION:-Release}"
DERIVED_DATA_PATH="${DERIVED_DATA_PATH:-$APP_DIR/.local/ios-device-build/DerivedData}"

find_hq_signing_keychain() {
  local cursor="$APP_DIR"
  while [[ "$cursor" != "/" ]]; do
    if [[ -f "$cursor/repo_manifest.yaml" ]]; then
      printf '%s' "$cursor/.local/apple-signing/symposium-ios.keychain-db"
      return 0
    fi
    cursor="$(dirname "$cursor")"
  done
}

DEFAULT_SIGNING_KEYCHAIN_PATH="$(find_hq_signing_keychain || true)"
SIGNING_KEYCHAIN_PATH="${SIGNING_KEYCHAIN_PATH:-$DEFAULT_SIGNING_KEYCHAIN_PATH}"
SIGNING_IDENTITY="${SIGNING_IDENTITY:-Apple Development}"
XCODE_SIGNING_ARGS=()
if [[ -n "$SIGNING_KEYCHAIN_PATH" && -f "$SIGNING_KEYCHAIN_PATH" ]]; then
  SIGNING_KEYCHAIN_PASSWORD_FILE="${SIGNING_KEYCHAIN_PASSWORD_FILE:-$(dirname "$SIGNING_KEYCHAIN_PATH")/keychain-password}"
  if [[ -f "$SIGNING_KEYCHAIN_PASSWORD_FILE" ]]; then
    security unlock-keychain -p "$(<"$SIGNING_KEYCHAIN_PASSWORD_FILE")" "$SIGNING_KEYCHAIN_PATH"
  fi
  SIGNING_IDENTITIES="$(security find-identity -v -p codesigning "$SIGNING_KEYCHAIN_PATH")"
  if ! awk '/Apple Development/ && $0 !~ /CERT_REVOKED|REVOKED/ { found = 1 } END { exit(found ? 0 : 1) }' <<<"$SIGNING_IDENTITIES"; then
    echo "No valid code-signing identity found in $SIGNING_KEYCHAIN_PATH." >&2
    exit 1
  fi
  XCODE_SIGNING_ARGS+=("OTHER_CODE_SIGN_FLAGS=--keychain $SIGNING_KEYCHAIN_PATH")
  echo "Using dedicated signing keychain: $SIGNING_KEYCHAIN_PATH"
fi

mkdir -p "$APP_DIR/.local/ios-device-build"

CONFIG_JSON="$APP_DIR/.local/ios-device-build/expo-config.json"
npx expo config --json > "$CONFIG_JSON"

read_config() {
  node - "$CONFIG_JSON" "$1" <<'NODE'
const fs = require("fs");
const config = JSON.parse(fs.readFileSync(process.argv[2], "utf8"));
const path = process.argv[3].split(".");
let value = config;
for (const part of path) value = value?.[part];
if (value === undefined || value === null) process.exit(1);
process.stdout.write(String(value));
NODE
}

APP_NAME="$(read_config name)"
APP_SLUG="$(read_config slug)"
PROD_BUNDLE_ID="$(read_config ios.bundleIdentifier)"
DEV_NAME="${DEV_NAME:-$APP_NAME Dev}"
DEV_BUNDLE_ID="${DEV_BUNDLE_ID:-$PROD_BUNDLE_ID.dev}"

if [[ ! -d ios || "${FORCE_PREBUILD:-0}" == "1" ]]; then
  npx expo prebuild --platform ios --no-install
fi

POD_WORKSPACE="$(find ios -maxdepth 1 -name '*.xcworkspace' -print -quit 2>/dev/null)"
if [[ ! -d ios/Pods || -z "$POD_WORKSPACE" ]]; then
  npx pod-install ios
fi

PBXPROJ="$(find ios -maxdepth 2 -name project.pbxproj | head -n 1)"
INFO_PLIST="$(find ios -maxdepth 3 -path '*/Pods' -prune -o -name Info.plist -print | head -n 1)"
WORKSPACE="$(find ios -maxdepth 1 -name '*.xcworkspace' | head -n 1)"
if [[ -z "$WORKSPACE" ]]; then
  WORKSPACE="$(find ios -maxdepth 2 -name '*.xcworkspace' | head -n 1)"
fi

if [[ -z "$PBXPROJ" || -z "$INFO_PLIST" || -z "$WORKSPACE" ]]; then
  echo "Could not find generated iOS project files. Run with FORCE_PREBUILD=1 to regenerate." >&2
  exit 1
fi

perl -0pi -e "s/PRODUCT_BUNDLE_IDENTIFIER = \\Q$PROD_BUNDLE_ID\\E;/PRODUCT_BUNDLE_IDENTIFIER = $DEV_BUNDLE_ID;/g" "$PBXPROJ"
perl -0pi -e "s/DEVELOPMENT_TEAM = [^;]+;/DEVELOPMENT_TEAM = $TEAM_ID;/g" "$PBXPROJ"
plutil -replace CFBundleDisplayName -string "$DEV_NAME" "$INFO_PLIST"

SCHEMES_JSON="$APP_DIR/.local/ios-device-build/xcode-schemes.json"
xcodebuild -list -json -workspace "$WORKSPACE" > "$SCHEMES_JSON"
SCHEME="$(
  node - "$SCHEMES_JSON" "$APP_NAME" "$APP_SLUG" <<'NODE'
const fs = require("fs");
const schemesPath = process.argv[2];
const appName = process.argv[3] || "";
const appSlug = process.argv[4] || "";
const compact = (value) => String(value || "").replace(/[^A-Za-z0-9]/g, "");
const parsed = JSON.parse(fs.readFileSync(schemesPath, "utf8"));
const schemes = parsed.workspace?.schemes || [];
const candidates = [compact(appName), compact(appSlug), appName, appSlug].filter(Boolean);
const banned = /^(Pods-|Pods$|Expo|EX|React|RCT|Yoga|hermes|FBLazyVector|boost|glog|fmt|DoubleConversion|SocketRocket|fast_float)/i;
const exact = candidates.map((candidate) => schemes.find((scheme) => scheme === candidate)).find(Boolean);
const normalized = candidates
  .map((candidate) => schemes.find((scheme) => compact(scheme).toLowerCase() === compact(candidate).toLowerCase()))
  .find(Boolean);
const fallback = schemes.find((scheme) => !banned.test(scheme) && !scheme.includes("-")) || schemes.find((scheme) => !banned.test(scheme));
const scheme = exact || normalized || fallback || schemes[0];
if (!scheme) process.exit(1);
process.stdout.write(scheme);
NODE
)"

echo "Using workspace: $WORKSPACE"
echo "Using scheme: $SCHEME"

rm -rf "$DERIVED_DATA_PATH"
NODE_ENV=production xcodebuild \
  -workspace "$WORKSPACE" \
  -scheme "$SCHEME" \
  -configuration "$BUILD_CONFIGURATION" \
  -destination "id=$DEVICE_ID" \
  -derivedDataPath "$DERIVED_DATA_PATH" \
  DEVELOPMENT_TEAM="$TEAM_ID" \
  CODE_SIGN_STYLE=Automatic \
  CODE_SIGN_IDENTITY="$SIGNING_IDENTITY" \
  "${XCODE_SIGNING_ARGS[@]}" \
  build

APP_PATH="$(find "$DERIVED_DATA_PATH/Build/Products/$BUILD_CONFIGURATION-iphoneos" -maxdepth 1 -name '*.app' -type d | head -n 1)"
if [[ -z "$APP_PATH" ]]; then
  echo "Build succeeded but no .app was found." >&2
  exit 1
fi

xcrun devicectl device install app --device "$DEVICE_ID" "$APP_PATH"
xcrun devicectl device process launch --device "$DEVICE_ID" --terminate-existing "$DEV_BUNDLE_ID"

echo
echo "Installed and launched $DEV_NAME"
echo "Bundle: $DEV_BUNDLE_ID"
echo "App: $APP_PATH"
