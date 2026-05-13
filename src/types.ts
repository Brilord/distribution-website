import type { ElementType } from 'react';

export type ProductMeta = {
  name: string;
  version: string;
  windowsSupport: string;
  systemRequirements: string;
  releaseDate: string;
  publisher: string;
  supportEmail: string;
  screenshotPath: string;
  githubUrl: string;
};

export type LandingTheme = {
  backgroundType: 'solid' | 'gradient' | 'image' | 'pattern';
  backgroundColor: string;
  gradientStart: string;
  gradientEnd: string;
  patternColor: string;
  pageBackground: string;
  sectionBackground: string;
  alternateSectionBackground: string;
  surfaceColor: string;
  subtleSurfaceColor: string;
  borderColor: string;
  textColor: string;
  mutedTextColor: string;
  headerBackground: string;
  downloadBackground: string;
  downloadTextColor: string;
  accentColor: string;
  buttonTextColor: string;
  bodyFontFamily: string;
  headingFontFamily: string;
  monoFontFamily: string;
  baseFontSize: number;
  backgroundImage: string;
  overlayOpacity: number;
  density: 'compact' | 'normal' | 'spacious';
};

export type MobilePlatform = 'android' | 'ios';

export type MobileDownload = {
  id: MobilePlatform;
  label: string;
  platformSupport: string;
  fileName: string;
  fileSize: string;
  url: string;
  buttonLabel: string;
  enabled: boolean;
};

export type DownloadMirror = {
  id: string;
  label: string;
  url: string;
  enabled: boolean;
};

export type InstallerMeta = {
  fileName: string;
  fileSize: string;
  installerPath: string;
  checksum: string;
  sizeBytes: number;
  githubOwner: string;
  githubRepo: string;
  githubAssetName: string;
  mirrors: DownloadMirror[];
  mobileDownloads: MobileDownload[];
};

export type SaveState = 'saved' | 'saving';
export type LinkStatus = 'unchecked' | 'checking' | 'reachable' | 'blocked' | 'missing';
export type PrimaryHost = 'local' | 'github-releases' | 'google-drive' | 'onedrive' | 'custom';

export type ReleaseManifestDownload = {
  platform: 'windows' | MobilePlatform;
  label: string;
  platformSupport: string;
  fileName: string;
  fileSize: string;
  sizeBytes?: number;
  url: string;
  sha256?: string;
  buttonLabel: string;
  enabled: boolean;
  mirrors?: Array<Pick<DownloadMirror, 'id' | 'label' | 'url'>>;
};

export type ReleaseManifest = {
  schemaVersion: number;
  exportedAt: string;
  app: string;
  product: Pick<ProductMeta, 'name' | 'version' | 'releaseDate' | 'publisher' | 'supportEmail' | 'githubUrl'>;
  downloads: ReleaseManifestDownload[];
  changelog: string[];
};

export type FeatureCard = {
  icon: ElementType;
  titleKey: CopyKey;
  textKey: CopyKey;
};

export type CopyKey =
  | 'eyebrow'
  | 'heroTitle'
  | 'heroDescription'
  | 'previewTitle'
  | 'previewDescription'
  | 'featuresTitle'
  | 'featuresDescription'
  | 'downloadTitle'
  | 'downloadDescription'
  | 'featureFastTitle'
  | 'featureFastText'
  | 'featureNativeTitle'
  | 'featureNativeText'
  | 'featureAutomationTitle'
  | 'featureAutomationText'
  | 'featureHistoryTitle'
  | 'featureHistoryText'
  | 'featurePerformanceTitle'
  | 'featurePerformanceText'
  | 'featureSecurityTitle'
  | 'featureSecurityText'
  | 'changelogOne'
  | 'changelogTwo'
  | 'changelogThree';

export type EditableCopy = Record<CopyKey, string>;

export type LandingConfigPayload = {
  schemaVersion: number;
  exportedAt: string;
  app: string;
  copy: EditableCopy;
  productMeta: ProductMeta;
  installer: InstallerMeta;
  theme: LandingTheme;
};
