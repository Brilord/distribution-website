import { Gauge, HardDriveDownload, MonitorCog, ScanSearch, ShieldCheck, Workflow, Zap } from 'lucide-react';
import releaseConfig from './release.config.json';
import type { FeatureCard, InstallerMeta, LandingTheme, MobilePlatform, ProductMeta } from './types';

export const product = releaseConfig.product;

export const landingConfigSchemaVersion = 1;
export const landingConfigAppName = 'distribution-website';

export const defaultCopy = {
  eyebrow: `Latest release ${product.version}`,
  heroTitle: `Download ${product.name} for Windows`,
  heroDescription:
    'Install the latest HertPicture Windows release and start managing picture workflows from a focused desktop app.',
  previewTitle: 'Preview HertPicture before you install.',
  previewDescription:
    'The product preview shows the desktop layout users can expect from the current Windows release.',
  featuresTitle: 'A focused Windows app for picture workflows.',
  featuresDescription:
    'HertPicture keeps common image tasks, status details, and release verification easy to find.',
  downloadTitle: 'Get the latest Windows release.',
  downloadDescription:
    'Download the signed Windows installer, then verify the file hash against the published SHA-256 checksum.',
  featureFastTitle: 'Fast daily workflow',
  featureFastText:
    'Open, review, and process picture tasks through a clean desktop interface designed for repeat use.',
  featureNativeTitle: 'Native Windows experience',
  featureNativeText:
    'Installer-ready distribution with familiar system behavior, local file access, and desktop shortcuts.',
  featureAutomationTitle: 'Automated task paths',
  featureAutomationText:
    'Use presets and guided flows to reduce setup time while keeping important controls easy to reach.',
  featureHistoryTitle: 'Clear activity history',
  featureHistoryText: 'Review recent actions, completed jobs, warnings, and outputs without digging through log files.',
  featurePerformanceTitle: 'Performance focused',
  featurePerformanceText:
    'The interface keeps heavyweight operations visible, cancellable, and separate from lightweight browsing.',
  featureSecurityTitle: 'Security-minded install',
  featureSecurityText: 'Publish version details, hashes, and update notes so users can verify what they are downloading.',
  changelogOne: 'Initial Windows installer release for HertPicture.',
  changelogTwo: 'Added downloadable setup package with published SHA-256 verification.',
  changelogThree: 'Published release metadata, support contact, and security notes for the Windows build.',
};

export const defaultProductMeta: ProductMeta = {
  name: product.name,
  version: product.version,
  windowsSupport: product.windowsSupport,
  systemRequirements: product.systemRequirements,
  releaseDate: product.releaseDate,
  publisher: product.publisher,
  supportEmail: product.supportEmail,
  screenshotPath: product.screenshotPath,
  githubUrl: product.githubUrl,
};

export const defaultInstallerMeta: InstallerMeta = {
  fileName: product.fileName,
  fileSize: product.fileSize,
  installerPath: product.installerPath,
  checksum: product.checksum,
  sizeBytes: 0,
  githubOwner: 'Brilord',
  githubRepo: 'distribution-website',
  githubAssetName: product.fileName,
  mirrors: [
    {
      id: 'github-releases',
      label: 'GitHub Releases',
      url: 'https://github.com/Brilord/distribution-website/releases/latest/download/HertPicture_0.1.0_x64-setup.exe',
      enabled: false,
    },
    { id: 'google-drive', label: 'Google Drive', url: '', enabled: false },
    { id: 'onedrive', label: 'OneDrive', url: '', enabled: false },
    { id: 'dropbox', label: 'Dropbox', url: '', enabled: false },
    { id: 'custom', label: 'Custom mirror', url: '', enabled: false },
  ],
  mobileDownloads: [
    {
      id: 'android' as MobilePlatform,
      label: 'Android',
      platformSupport: 'Android 8.0 and newer',
      fileName: 'HertPicture.apk',
      fileSize: 'Add APK size',
      url: '',
      buttonLabel: 'Download APK',
      enabled: false,
    },
    {
      id: 'ios' as MobilePlatform,
      label: 'iOS',
      platformSupport: 'iOS 15 and newer',
      fileName: 'App Store or TestFlight',
      fileSize: 'Store listing',
      url: '',
      buttonLabel: 'Open App Store',
      enabled: false,
    },
  ],
};

export const defaultTheme = {
  backgroundType: 'gradient',
  backgroundColor: '#060a12',
  gradientStart: '#07111f',
  gradientEnd: '#0f2f2a',
  patternColor: '#12352f',
  pageBackground: '#060a12',
  sectionBackground: '#0b1220',
  alternateSectionBackground: '#111827',
  surfaceColor: '#151f2e',
  subtleSurfaceColor: '#0f172a',
  borderColor: '#2b3648',
  textColor: '#f8fafc',
  mutedTextColor: '#a7b0c0',
  headerBackground: '#080d16',
  downloadBackground: '#050812',
  downloadTextColor: '#f8fafc',
  accentColor: '#22c55e',
  buttonTextColor: '#04130a',
  bodyFontFamily: 'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  headingFontFamily: 'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  monoFontFamily: '"SFMono-Regular", Consolas, "Liberation Mono", Menlo, monospace',
  baseFontSize: 16,
  backgroundImage: '',
  overlayOpacity: 0.45,
  density: 'normal',
} satisfies LandingTheme;

export const featureCards: FeatureCard[] = [
  { icon: Zap, titleKey: 'featureFastTitle', textKey: 'featureFastText' },
  { icon: MonitorCog, titleKey: 'featureNativeTitle', textKey: 'featureNativeText' },
  { icon: Workflow, titleKey: 'featureAutomationTitle', textKey: 'featureAutomationText' },
  { icon: ScanSearch, titleKey: 'featureHistoryTitle', textKey: 'featureHistoryText' },
  { icon: Gauge, titleKey: 'featurePerformanceTitle', textKey: 'featurePerformanceText' },
  { icon: ShieldCheck, titleKey: 'featureSecurityTitle', textKey: 'featureSecurityText' },
];

export const changelogKeys = ['changelogOne', 'changelogTwo', 'changelogThree'] as const;
