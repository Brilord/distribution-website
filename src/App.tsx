import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type CSSProperties,
  type ElementType,
  type FocusEvent,
  type ReactNode,
} from 'react';
import {
  AlertTriangle,
  Apple,
  ArrowDownToLine,
  BadgeCheck,
  Check,
  ChevronRight,
  Clock3,
  Cloud,
  Download,
  Edit3,
  ExternalLink,
  FileText,
  Gauge,
  Github,
  HardDriveDownload,
  Image,
  Loader2,
  LockKeyhole,
  Menu,
  MonitorCog,
  Palette,
  PanelRightOpen,
  RotateCcw,
  Save,
  ScanSearch,
  ShieldCheck,
  Sparkles,
  Smartphone,
  TerminalSquare,
  Upload,
  UploadCloud,
  Workflow,
  X,
  Zap,
} from 'lucide-react';

const product = {
  name: 'MyApp',
  version: 'v2.4.1',
  fileSize: '2.3 MB',
  fileName: 'HertPicture_0.1.0_x64-setup.exe',
  windowsSupport: 'Windows 10 and 11',
  installerPath: '/downloads/HertPicture_0.1.0_x64-setup.exe',
  checksum: '4b9e2791aacd9e0112b5dc50f44a8a6ffb9a914f8a912a72d42064e4894b5d5f',
  releaseDate: 'April 28, 2026',
  publisher: 'Replace with your code-signing publisher',
  supportEmail: 'support@myapp.example',
  screenshotPath: '/screenshots/main-preview.png',
  githubUrl: 'https://github.com/Brilord/distribution-website',
};

const defaultCopy = {
  eyebrow: `Latest release ${product.version}`,
  heroTitle: `Download ${product.name} for Windows, Android, and iOS`,
  heroDescription:
    'A polished software distribution template for presenting your app, explaining its value, and giving users a direct path to the latest desktop and mobile releases.',
  previewTitle: 'Show the desktop app before users download it.',
  previewDescription:
    'Use the built-in desktop mockup while preparing your real product screenshots, then swap in assets from /public/screenshots/main-preview.png.',
  featuresTitle: 'Everything a cross-platform product page needs.',
  featuresDescription:
    'Clear feature messaging, install details, release metadata, and user reassurance are all built into the template.',
  downloadTitle: 'Get the latest release for your device.',
  downloadDescription:
    'Point each platform button to your signed Windows installer, Android package, or iOS App Store listing. Keep version, file size, and verification details visible.',
  featureFastTitle: 'Fast daily workflow',
  featureFastText:
    'Open, process, and export common tasks through a clean desktop interface designed for repeat use.',
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
  changelogOne: 'Improved startup time for large project folders.',
  changelogTwo: 'Added clearer installer messaging for managed Windows devices.',
  changelogThree: 'Fixed a display issue in compact task history view.',
};

const defaultProductMeta = {
  name: product.name,
  version: product.version,
  windowsSupport: product.windowsSupport,
  releaseDate: product.releaseDate,
  publisher: product.publisher,
  supportEmail: product.supportEmail,
  screenshotPath: product.screenshotPath,
  githubUrl: product.githubUrl,
};

const defaultInstallerMeta = {
  fileName: product.fileName,
  fileSize: product.fileSize,
  installerPath: product.installerPath,
  checksum: product.checksum,
  sizeBytes: 0,
  githubOwner: 'Brilord',
  githubRepo: 'distribution-website',
  githubAssetName: product.fileName,
  mirrors: [
    { id: 'github-releases', label: 'GitHub Releases', url: '', enabled: false },
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
      fileName: 'MyApp.apk',
      fileSize: 'Add APK size',
      url: '',
      buttonLabel: 'Download APK',
      enabled: true,
    },
    {
      id: 'ios' as MobilePlatform,
      label: 'iOS',
      platformSupport: 'iOS 15 and newer',
      fileName: 'App Store or TestFlight',
      fileSize: 'Store listing',
      url: '',
      buttonLabel: 'Open App Store',
      enabled: true,
    },
  ],
};

const defaultTheme = {
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
  backgroundImage: '',
  overlayOpacity: 0.45,
  density: 'normal',
} satisfies LandingTheme;

type CopyKey = keyof typeof defaultCopy;
type EditableCopy = Record<CopyKey, string>;
type ProductMeta = typeof defaultProductMeta;
type LandingTheme = {
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
  backgroundImage: string;
  overlayOpacity: number;
  density: 'compact' | 'normal' | 'spacious';
};
type InstallerMeta = {
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
type DownloadMirror = {
  id: string;
  label: string;
  url: string;
  enabled: boolean;
};
type MobilePlatform = 'android' | 'ios';
type MobileDownload = {
  id: MobilePlatform;
  label: string;
  platformSupport: string;
  fileName: string;
  fileSize: string;
  url: string;
  buttonLabel: string;
  enabled: boolean;
};
type SaveState = 'saved' | 'saving';
type LinkStatus = 'unchecked' | 'checking' | 'reachable' | 'blocked' | 'missing';
type PrimaryHost = 'local' | 'github-releases' | 'google-drive' | 'onedrive' | 'custom';

const copyStorageKey = 'myapp-landing-copy';
const productStorageKey = 'myapp-product-meta';
const installerStorageKey = 'myapp-installer-meta';
const themeStorageKey = 'myapp-landing-theme-v2';

const featureCards: Array<{ icon: ElementType; titleKey: CopyKey; textKey: CopyKey }> = [
  { icon: Zap, titleKey: 'featureFastTitle', textKey: 'featureFastText' },
  { icon: MonitorCog, titleKey: 'featureNativeTitle', textKey: 'featureNativeText' },
  { icon: Workflow, titleKey: 'featureAutomationTitle', textKey: 'featureAutomationText' },
  { icon: ScanSearch, titleKey: 'featureHistoryTitle', textKey: 'featureHistoryText' },
  { icon: Gauge, titleKey: 'featurePerformanceTitle', textKey: 'featurePerformanceText' },
  { icon: ShieldCheck, titleKey: 'featureSecurityTitle', textKey: 'featureSecurityText' },
];

const changelogKeys: CopyKey[] = ['changelogOne', 'changelogTwo', 'changelogThree'];

const themePresets: Array<{ label: string; value: LandingTheme }> = [
  { label: 'Dark', value: defaultTheme },
  {
    label: 'Light',
    value: {
      ...defaultTheme,
      backgroundColor: '#f8fafc',
      gradientStart: '#f8fafc',
      gradientEnd: '#dff7ec',
      patternColor: '#d1fae5',
      pageBackground: '#f8fafc',
      sectionBackground: '#ffffff',
      alternateSectionBackground: '#f1f5f9',
      surfaceColor: '#ffffff',
      subtleSurfaceColor: '#f8fafc',
      borderColor: '#dbe3ef',
      textColor: '#0f172a',
      mutedTextColor: '#526071',
      headerBackground: '#ffffff',
      downloadBackground: '#0f172a',
      downloadTextColor: '#f8fafc',
      accentColor: '#059669',
      buttonTextColor: '#ffffff',
      overlayOpacity: 0.15,
    },
  },
  {
    label: 'High contrast',
    value: {
      ...defaultTheme,
      backgroundColor: '#000000',
      gradientStart: '#000000',
      gradientEnd: '#0b0b0b',
      pageBackground: '#000000',
      sectionBackground: '#050505',
      alternateSectionBackground: '#111111',
      surfaceColor: '#000000',
      subtleSurfaceColor: '#161616',
      borderColor: '#facc15',
      textColor: '#ffffff',
      mutedTextColor: '#e5e7eb',
      headerBackground: '#000000',
      downloadBackground: '#000000',
      downloadTextColor: '#ffffff',
      accentColor: '#facc15',
      buttonTextColor: '#000000',
    },
  },
  {
    label: 'Blue',
    value: {
      ...defaultTheme,
      gradientStart: '#08111f',
      gradientEnd: '#123a5f',
      accentColor: '#38bdf8',
      buttonTextColor: '#031421',
      patternColor: '#1e3a8a',
    },
  },
  {
    label: 'Green',
    value: defaultTheme,
  },
  {
    label: 'Neutral',
    value: {
      ...defaultTheme,
      gradientStart: '#111827',
      gradientEnd: '#27272a',
      pageBackground: '#0a0a0a',
      sectionBackground: '#18181b',
      alternateSectionBackground: '#111113',
      surfaceColor: '#202024',
      subtleSurfaceColor: '#151518',
      borderColor: '#3f3f46',
      accentColor: '#e5e7eb',
      buttonTextColor: '#111827',
    },
  },
  {
    label: 'Product launch',
    value: {
      ...defaultTheme,
      gradientStart: '#0f1028',
      gradientEnd: '#3d1b57',
      sectionBackground: '#111827',
      alternateSectionBackground: '#17152c',
      surfaceColor: '#1f2937',
      subtleSurfaceColor: '#181a32',
      borderColor: '#3b315f',
      accentColor: '#f97316',
      buttonTextColor: '#111827',
      patternColor: '#6d28d9',
    },
  },
];

function isLocalEditingHost() {
  if (typeof window === 'undefined') {
    return false;
  }

  return ['localhost', '127.0.0.1', '0.0.0.0'].includes(window.location.hostname);
}

function isChanged<T>(value: T, defaultValue: T) {
  return JSON.stringify(value) !== JSON.stringify(defaultValue);
}

function useLocalConfig<T extends object>(canEdit: boolean, storageKey: string, defaultValue: T) {
  const [value, setValue] = useState<T>(defaultValue);
  const [saveState, setSaveState] = useState<SaveState>('saved');

  useEffect(() => {
    if (!canEdit) {
      return;
    }

    const saved = window.localStorage.getItem(storageKey);
    if (!saved) {
      return;
    }

    try {
      setValue({ ...defaultValue, ...JSON.parse(saved) });
    } catch {
      window.localStorage.removeItem(storageKey);
    }
  }, [canEdit, defaultValue, storageKey]);

  function replaceValue(nextValue: T) {
    setValue(nextValue);
    if (canEdit) {
      setSaveState('saving');
      window.localStorage.setItem(storageKey, JSON.stringify(nextValue));
      window.setTimeout(() => setSaveState('saved'), 250);
    }
  }

  function patchValue(patch: Partial<T>) {
    setValue((current) => {
      const nextValue = { ...current, ...patch };
      if (canEdit) {
        setSaveState('saving');
        window.localStorage.setItem(storageKey, JSON.stringify(nextValue));
        window.setTimeout(() => setSaveState('saved'), 250);
      }
      return nextValue;
    });
  }

  function resetValue() {
    setValue(defaultValue);
    if (canEdit) {
      window.localStorage.removeItem(storageKey);
      setSaveState('saved');
    }
  }

  return {
    value,
    replaceValue,
    patchValue,
    resetValue,
    saveState,
    hasChanges: isChanged(value, defaultValue),
  };
}

function useEditableCopy() {
  const canEdit = useMemo(isLocalEditingHost, []);
  const [editMode, setEditMode] = useState(false);
  const copyConfig = useLocalConfig<EditableCopy>(canEdit, copyStorageKey, defaultCopy);

  function updateCopy(key: CopyKey, value: string) {
    copyConfig.patchValue({ [key]: value } as Partial<EditableCopy>);
  }

  return { canEdit, copyConfig, editMode, setEditMode, updateCopy };
}

function useInstallerMeta(canEdit: boolean) {
  return useLocalConfig<InstallerMeta>(canEdit, installerStorageKey, defaultInstallerMeta);
}

function sectionPadding(theme: LandingTheme) {
  if (theme.density === 'compact') {
    return 'py-14';
  }

  if (theme.density === 'spacious') {
    return 'py-24';
  }

  return 'py-20';
}

function getHeroStyle(theme: LandingTheme): CSSProperties {
  if (theme.backgroundType === 'solid') {
    return { background: theme.backgroundColor, color: theme.textColor };
  }

  if (theme.backgroundType === 'image' && theme.backgroundImage) {
    const overlay = Math.round(theme.overlayOpacity * 255)
      .toString(16)
      .padStart(2, '0');
    return {
      backgroundImage: `linear-gradient(135deg, #ffffff${overlay}, #ffffff${overlay}), url("${theme.backgroundImage}")`,
      backgroundPosition: 'center',
      backgroundSize: 'cover',
      color: theme.textColor,
    };
  }

  if (theme.backgroundType === 'pattern') {
    return {
      backgroundColor: theme.backgroundColor,
      backgroundImage: `radial-gradient(${theme.patternColor} 1px, transparent 1px)`,
      backgroundSize: '18px 18px',
      color: theme.textColor,
    };
  }

  return {
    backgroundImage: `linear-gradient(135deg, ${theme.gradientStart} 0%, ${theme.gradientEnd} 54%, ${theme.pageBackground} 100%)`,
    color: theme.textColor,
  };
}

function getAccentStyle(theme: LandingTheme): CSSProperties {
  return { backgroundColor: theme.accentColor };
}

function getSurfaceStyle(theme: LandingTheme): CSSProperties {
  return { backgroundColor: theme.surfaceColor, borderColor: theme.borderColor, color: theme.textColor };
}

function getSubtleSurfaceStyle(theme: LandingTheme): CSSProperties {
  return { backgroundColor: theme.subtleSurfaceColor, borderColor: theme.borderColor, color: theme.textColor };
}

function getSectionStyle(theme: LandingTheme, alternate = false): CSSProperties {
  return {
    backgroundColor: alternate ? theme.alternateSectionBackground : theme.sectionBackground,
    color: theme.textColor,
  };
}

function getInstallerMirrors(installer: InstallerMeta) {
  const currentMirrors = installer.mirrors ?? [];
  const defaultIds = new Set(defaultInstallerMeta.mirrors.map((mirror) => mirror.id));
  const mergedDefaults = defaultInstallerMeta.mirrors.map((defaultMirror) => ({
    ...defaultMirror,
    ...currentMirrors.find((mirror) => mirror.id === defaultMirror.id),
  }));
  const customMirrors = currentMirrors.filter((mirror) => !defaultIds.has(mirror.id));

  return [...mergedDefaults, ...customMirrors];
}

function getMobileDownloads(installer: InstallerMeta) {
  const currentDownloads = installer.mobileDownloads ?? [];

  return defaultInstallerMeta.mobileDownloads.map((defaultDownload) => ({
    ...defaultDownload,
    ...currentDownloads.find((download) => download.id === defaultDownload.id),
  }));
}

function getPlatformDownloads(installer: InstallerMeta, productMeta: ProductMeta) {
  return [
    {
      id: 'windows',
      label: 'Windows',
      platformSupport: productMeta.windowsSupport,
      fileName: installer.fileName,
      fileSize: installer.fileSize,
      url: installer.installerPath,
      buttonLabel: 'Download .exe',
      enabled: true,
      icon: HardDriveDownload,
    },
    ...getMobileDownloads(installer).map((download) => ({
      ...download,
      icon: download.id === 'ios' ? Apple : Smartphone,
    })),
  ];
}

function isExternalUrl(url: string) {
  return /^https?:\/\//i.test(url.trim());
}

function getLandingConfigPayload(
  copy: EditableCopy,
  productMeta: ProductMeta,
  installer: InstallerMeta,
  theme: LandingTheme,
) {
  return { copy, productMeta, installer, theme };
}

function buildAiConfigPrompt(
  copy: EditableCopy,
  productMeta: ProductMeta,
  installer: InstallerMeta,
  theme: LandingTheme,
) {
  const config = getLandingConfigPayload(copy, productMeta, installer, theme);
  const schema = {
    copy: defaultCopy,
    productMeta: defaultProductMeta,
    installer: defaultInstallerMeta,
    theme: defaultTheme,
  };

  return `Create production-ready JSON for this Windows, Android, and iOS app download page.

Return only valid JSON. Do not wrap it in Markdown. Do not include comments or explanations.

The JSON must keep this exact top-level shape:
{
  "copy": {},
  "productMeta": {},
  "installer": {},
  "theme": {}
}

Rules:
- Keep every key shown in the schema.
- Write concise landing-page copy for a real downloadable product across Windows, Android, and iOS.
- Preserve browser-safe paths only. Do not use local filesystem paths.
- Use /downloads/<file-name>.exe for Windows installers and /downloads/<file-name>.apk for Android packages unless a hosted URL is provided.
- Use an App Store or TestFlight URL for iOS unless it is intentionally unavailable.
- Use /screenshots/<file-name> for screenshot paths.
- Keep colors as hex strings.
- Keep installer.mirrors as an array with the same mirror ids.
- Keep installer.mobileDownloads as an array with the android and ios ids.
- Use realistic release, publisher, support, checksum, changelog, and download metadata when supplied. If unknown, leave a clear placeholder.

Schema with required keys:
${JSON.stringify(schema, null, 2)}

Current site JSON to rewrite:
${JSON.stringify(config, null, 2)}`;
}

function getGitHubReleaseUrl(installer: InstallerMeta) {
  const owner = installer.githubOwner.trim();
  const repo = installer.githubRepo.trim();
  const assetName = installer.githubAssetName.trim() || installer.fileName.trim();

  if (!owner || !repo || !assetName) {
    return '';
  }

  return `https://github.com/${owner}/${repo}/releases/latest/download/${encodeURIComponent(assetName)}`;
}

function getGoogleDriveDirectUrl(url: string) {
  const trimmedUrl = url.trim();
  const fileMatch = trimmedUrl.match(/\/file\/d\/([^/]+)/);
  const idMatch = trimmedUrl.match(/[?&]id=([^&]+)/);
  const fileId = fileMatch?.[1] || idMatch?.[1];

  if (!fileId) {
    return trimmedUrl;
  }

  return `https://drive.google.com/uc?export=download&id=${fileId}`;
}

function getPrimaryHost(installer: InstallerMeta): PrimaryHost {
  const path = installer.installerPath.trim();
  const githubUrl = getGitHubReleaseUrl(installer);
  const googleMirror = getInstallerMirrors(installer).find((mirror) => mirror.id === 'google-drive');
  const oneDriveMirror = getInstallerMirrors(installer).find((mirror) => mirror.id === 'onedrive');

  if (path.startsWith('/downloads/')) {
    return 'local';
  }

  if (githubUrl && path === githubUrl) {
    return 'github-releases';
  }

  if (googleMirror?.url.trim() && path === googleMirror.url.trim()) {
    return 'google-drive';
  }

  if (oneDriveMirror?.url.trim() && path === oneDriveMirror.url.trim()) {
    return 'onedrive';
  }

  return 'custom';
}

async function validateDownloadUrl(url: string): Promise<LinkStatus> {
  const trimmedUrl = url.trim();

  if (!trimmedUrl) {
    return 'missing';
  }

  try {
    const response = await fetch(trimmedUrl, { method: 'HEAD', cache: 'no-store', mode: 'no-cors' });
    return response.type === 'opaque' || response.ok ? 'reachable' : 'blocked';
  } catch {
    try {
      const response = await fetch(trimmedUrl, { method: 'GET', cache: 'no-store', mode: 'no-cors' });
      return response.type === 'opaque' || response.ok ? 'reachable' : 'blocked';
    } catch {
      return 'blocked';
    }
  }
}

async function uploadLocalFile(file: File, endpoint: string) {
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'content-type': 'application/octet-stream',
      'x-file-name': encodeURIComponent(file.name),
    },
    body: file,
  });

  if (!response.ok) {
    const body = await response.json().catch(() => undefined);
    throw new Error(body?.error || (await response.text()) || 'Upload failed.');
  }

  return response.json();
}

function EditableText({
  as: Component = 'span',
  copyKey,
  copy,
  editMode,
  updateCopy,
  className = '',
  style,
}: {
  as?: ElementType;
  copyKey: CopyKey;
  copy: EditableCopy;
  editMode: boolean;
  updateCopy: (key: CopyKey, value: string) => void;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <Component
      className={`${className} ${editMode ? 'editable-copy' : ''}`}
      contentEditable={editMode}
      style={style}
      suppressContentEditableWarning
      onBlur={(event: FocusEvent<HTMLElement>) =>
        updateCopy(copyKey, event.currentTarget.textContent?.trim() || defaultCopy[copyKey])
      }
    >
      {copy[copyKey]}
    </Component>
  );
}

function EditorToolbar({
  canEdit,
  editMode,
  setEditMode,
  isDrawerOpen,
  setIsDrawerOpen,
  installer,
  updateInstaller,
  saveState,
  hasChanges,
}: {
  canEdit: boolean;
  editMode: boolean;
  setEditMode: (value: boolean) => void;
  isDrawerOpen: boolean;
  setIsDrawerOpen: (value: boolean) => void;
  installer: InstallerMeta;
  updateInstaller: (installer: InstallerMeta) => void;
  saveState: SaveState;
  hasChanges: boolean;
}) {
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState('Drop a Windows .exe installer here.');

  if (!canEdit) {
    return null;
  }

  async function uploadInstaller(file: File) {
    if (!file.name.toLowerCase().endsWith('.exe')) {
      setMessage('Use a Windows .exe installer file.');
      return;
    }

    setIsUploading(true);
    setMessage(`Uploading ${file.name}...`);

    try {
      const uploaded = (await uploadLocalFile(file, '/__dev/upload-exe')) as Omit<InstallerMeta, 'mirrors'>;
      updateInstaller({ ...installer, ...uploaded });
      setMessage(`${uploaded.fileName} deployed locally. Size: ${uploaded.fileSize}. SHA-256 generated.`);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Upload failed.');
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <div className="fixed bottom-4 left-1/2 z-50 w-[calc(100%-2rem)] max-w-4xl -translate-x-1/2 rounded-xl border border-gray-200 bg-white/95 p-2 shadow-soft backdrop-blur">
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => setEditMode(!editMode)}
          className={`inline-flex min-h-10 items-center gap-2 rounded-md px-4 text-sm font-semibold transition ${
            editMode ? 'bg-emerald-600 text-white' : 'bg-gray-950 text-white hover:bg-gray-800'
          }`}
        >
          <Edit3 size={16} />
          {editMode ? 'Inline Edit On' : 'Inline Edit'}
        </button>
        <button
          type="button"
          onClick={() => setIsDrawerOpen(!isDrawerOpen)}
          className="inline-flex min-h-10 items-center gap-2 rounded-md border border-gray-200 bg-white px-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
        >
          <PanelRightOpen size={16} />
          Customize
        </button>
        <span className="inline-flex min-h-10 items-center gap-2 rounded-md bg-gray-50 px-3 text-xs font-semibold text-gray-600">
          <Save size={15} />
          {saveState === 'saving' ? 'Saving...' : hasChanges ? 'Saved locally' : 'Defaults active'}
        </span>
        <span className="text-xs font-medium text-gray-500">Localhost only</span>
      </div>
      {editMode ? (
        <label
          className="mt-2 flex cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-emerald-300 bg-emerald-50/70 p-4 text-center transition hover:bg-emerald-50"
          onDragOver={(event) => event.preventDefault()}
          onDrop={(event) => {
            event.preventDefault();
            const file = event.dataTransfer.files[0];
            if (file) {
              void uploadInstaller(file);
            }
          }}
        >
          {isUploading ? (
            <Loader2 className="animate-spin text-emerald-700" size={22} />
          ) : (
            <UploadCloud className="text-emerald-700" size={24} />
          )}
          <span className="mt-2 text-sm font-semibold text-gray-950">Drop installer or click to upload</span>
          <span className="mt-1 text-xs text-gray-600">
            {installer.installerPath} - {message}
          </span>
          <input
            className="sr-only"
            type="file"
            accept=".exe,application/vnd.microsoft.portable-executable,application/x-msdownload"
            onChange={(event) => {
              const file = event.currentTarget.files?.[0];
              if (file) {
                void uploadInstaller(file);
              }
              event.currentTarget.value = '';
            }}
          />
        </label>
      ) : null}
    </div>
  );
}

function EditorDrawer({
  canEdit,
  isOpen,
  onClose,
  copy,
  updateCopy,
  replaceCopy,
  resetCopy,
  productMeta,
  updateProductMeta,
  replaceProductMeta,
  resetProductMeta,
  installer,
  updateInstaller,
  replaceInstaller,
  resetInstaller,
  theme,
  updateTheme,
  replaceTheme,
  resetTheme,
}: {
  canEdit: boolean;
  isOpen: boolean;
  onClose: () => void;
  copy: EditableCopy;
  updateCopy: (key: CopyKey, value: string) => void;
  replaceCopy: (copy: EditableCopy) => void;
  resetCopy: () => void;
  productMeta: ProductMeta;
  updateProductMeta: (patch: Partial<ProductMeta>) => void;
  replaceProductMeta: (meta: ProductMeta) => void;
  resetProductMeta: () => void;
  installer: InstallerMeta;
  updateInstaller: (patch: Partial<InstallerMeta>) => void;
  replaceInstaller: (installer: InstallerMeta) => void;
  resetInstaller: () => void;
  theme: LandingTheme;
  updateTheme: (patch: Partial<LandingTheme>) => void;
  replaceTheme: (theme: LandingTheme) => void;
  resetTheme: () => void;
}) {
  const importInputRef = useRef<HTMLInputElement>(null);
  const [uploadMessage, setUploadMessage] = useState('Upload background or screenshot images to /public/screenshots.');
  const [linkStatuses, setLinkStatuses] = useState<Record<string, LinkStatus>>({});
  const [isValidatingLinks, setIsValidatingLinks] = useState(false);
  const [aiJson, setAiJson] = useState('');
  const [aiMessage, setAiMessage] = useState('Copy the prompt, paste it into Claude Code, then paste the returned JSON here.');

  if (!canEdit) {
    return null;
  }

  function exportJson() {
    const payload = JSON.stringify(getLandingConfigPayload(copy, productMeta, installer, theme), null, 2);
    const blob = new Blob([payload], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `${productMeta.name.toLowerCase()}-landing-config.json`;
    anchor.click();
    URL.revokeObjectURL(url);
  }

  async function copyAiPrompt() {
    const prompt = buildAiConfigPrompt(copy, productMeta, installer, theme);

    try {
      await navigator.clipboard.writeText(prompt);
      setAiMessage('AI prompt copied. Paste it into Claude Code.');
    } catch {
      setAiJson(prompt);
      setAiMessage('Clipboard was blocked. The prompt is in the box below.');
    }
  }

  function applyConfigJson(parsed: {
    copy?: Partial<EditableCopy>;
    productMeta?: Partial<ProductMeta>;
    installer?: Partial<InstallerMeta>;
    theme?: Partial<LandingTheme>;
  }) {
    if (parsed.copy) {
      replaceCopy({ ...defaultCopy, ...parsed.copy });
    }
    if (parsed.productMeta) {
      replaceProductMeta({ ...defaultProductMeta, ...parsed.productMeta });
    }
    if (parsed.installer) {
      replaceInstaller({ ...defaultInstallerMeta, ...parsed.installer });
    }
    if (parsed.theme) {
      replaceTheme({ ...defaultTheme, ...parsed.theme });
    }
  }

  async function importJson(file: File) {
    const parsed = JSON.parse(await file.text()) as {
      copy?: Partial<EditableCopy>;
      productMeta?: Partial<ProductMeta>;
      installer?: Partial<InstallerMeta>;
      theme?: Partial<LandingTheme>;
    };

    applyConfigJson(parsed);
  }

  function applyAiJson() {
    try {
      const parsed = JSON.parse(aiJson) as {
        copy?: Partial<EditableCopy>;
        productMeta?: Partial<ProductMeta>;
        installer?: Partial<InstallerMeta>;
        theme?: Partial<LandingTheme>;
      };

      applyConfigJson(parsed);
      setAiMessage('AI JSON applied locally.');
    } catch {
      setAiMessage('That is not valid JSON yet. Paste Claude Code output without Markdown fences.');
    }
  }

  async function uploadImage(file: File, target: 'background' | 'screenshot') {
    setUploadMessage(`Uploading ${file.name}...`);

    try {
      const uploaded = (await uploadLocalFile(file, '/__dev/upload-image')) as { imagePath: string; fileSize: string };
      if (target === 'background') {
        updateTheme({ backgroundImage: uploaded.imagePath, backgroundType: 'image' });
      } else {
        updateProductMeta({ screenshotPath: uploaded.imagePath });
      }
      setUploadMessage(`${uploaded.imagePath} saved locally (${uploaded.fileSize}).`);
    } catch (error) {
      setUploadMessage(error instanceof Error ? error.message : 'Image upload failed.');
    }
  }

  function updateMirror(id: string, patch: Partial<DownloadMirror>) {
    updateInstaller({
      mirrors: getInstallerMirrors(installer).map((mirror) => (mirror.id === id ? { ...mirror, ...patch } : mirror)),
    });
  }

  function getMirror(id: string) {
    return getInstallerMirrors(installer).find((mirror) => mirror.id === id) ?? {
      id,
      label: id,
      url: '',
      enabled: false,
    };
  }

  function updateDistributionLink(id: string, url: string) {
    updateMirror(id, { url, enabled: Boolean(url.trim()) });
  }

  function updateMobileDownload(id: MobilePlatform, patch: Partial<MobileDownload>) {
    updateInstaller({
      mobileDownloads: getMobileDownloads(installer).map((download) =>
        download.id === id ? { ...download, ...patch } : download,
      ),
    });
  }

  function useMirrorAsPrimary(id: string) {
    const mirror = getMirror(id);
    if (mirror.url.trim()) {
      updateInstaller({ installerPath: mirror.url.trim() });
    }
  }

  function setPrimaryHost(host: PrimaryHost) {
    if (host === 'local') {
      updateInstaller({ installerPath: `/downloads/${installer.fileName || product.fileName}` });
      return;
    }

    if (host === 'github-releases') {
      applyGitHubReleaseUrl(true);
      return;
    }

    if (host === 'google-drive' || host === 'onedrive') {
      useMirrorAsPrimary(host);
    }
  }

  async function validateLinks() {
    const links = [
      { id: 'primary', url: installer.installerPath },
      { id: 'github-releases', url: getGitHubReleaseUrl(installer) || getMirror('github-releases').url },
      { id: 'google-drive', url: googleDriveMirror.url },
      { id: 'onedrive', url: oneDriveMirror.url },
      ...getMobileDownloads(installer).map((download) => ({ id: download.id, url: download.url })),
    ];

    setIsValidatingLinks(true);
    setLinkStatuses((current) => ({
      ...current,
      ...Object.fromEntries(links.map((link) => [link.id, 'checking' as LinkStatus])),
    }));

    const entries = await Promise.all(
      links.map(async (link) => [link.id, await validateDownloadUrl(link.url)] as const),
    );

    setLinkStatuses((current) => ({ ...current, ...Object.fromEntries(entries) }));
    setIsValidatingLinks(false);
  }

  function applyGitHubReleaseUrl(useAsPrimary = false) {
    const url = getGitHubReleaseUrl(installer);

    if (!url) {
      return;
    }

    const mirrors = getInstallerMirrors(installer).map((mirror) =>
      mirror.id === 'github-releases' ? { ...mirror, url, enabled: true } : mirror,
    );

    updateInstaller({
      mirrors,
      ...(useAsPrimary ? { installerPath: url } : {}),
    });
  }

  const googleDriveMirror = getMirror('google-drive');
  const oneDriveMirror = getMirror('onedrive');

  return (
    <>
      <div
        className={`fixed inset-0 z-[55] bg-gray-950/30 transition ${isOpen ? 'opacity-100' : 'pointer-events-none opacity-0'}`}
        onClick={onClose}
      />
      <aside
        className={`fixed right-0 top-0 z-[60] h-full w-full max-w-xl overflow-y-auto border-l border-gray-200 bg-white shadow-2xl transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        aria-hidden={!isOpen}
      >
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-200 bg-white/95 px-5 py-4 backdrop-blur">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-emerald-700">Developer editor</p>
            <h2 className="text-xl font-semibold text-gray-950">Copy, release, and theme</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-grid size-10 place-items-center rounded-md border border-gray-200 text-gray-700 transition hover:bg-gray-50"
            aria-label="Close editor"
          >
            <X size={18} />
          </button>
        </div>

        <div className="space-y-5 p-5 pb-32">
          <EditorSection title="Actions" icon={Download}>
            <div className="grid gap-2 sm:grid-cols-2">
              <button type="button" className="editor-button" onClick={exportJson}>
                <Download size={16} />
                Export JSON
              </button>
              <button type="button" className="editor-button" onClick={() => void copyAiPrompt()}>
                <TerminalSquare size={16} />
                Copy AI prompt
              </button>
              <button type="button" className="editor-button" onClick={() => importInputRef.current?.click()}>
                <Upload size={16} />
                Import JSON
              </button>
              <button
                type="button"
                className="editor-button sm:col-span-2"
                onClick={() => {
                  resetCopy();
                  resetProductMeta();
                  resetInstaller();
                  resetTheme();
                }}
              >
                <RotateCcw size={16} />
                Reset all local edits
              </button>
            </div>
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-3">
              <label className="editor-label">
                Paste AI JSON
                <textarea
                  className="editor-input min-h-36 resize-y font-mono text-xs leading-5"
                  value={aiJson}
                  placeholder='{"copy": {...}, "productMeta": {...}, "installer": {...}, "theme": {...}}'
                  onChange={(event) => setAiJson(event.currentTarget.value)}
                />
              </label>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <button type="button" className="editor-button" onClick={applyAiJson} disabled={!aiJson.trim()}>
                  <Check size={16} />
                  Apply pasted JSON
                </button>
                <p className="text-xs font-medium leading-5 text-gray-500">{aiMessage}</p>
              </div>
            </div>
            <input
              ref={importInputRef}
              className="sr-only"
              type="file"
              accept="application/json,.json"
              onChange={(event) => {
                const file = event.currentTarget.files?.[0];
                if (file) {
                  void importJson(file);
                }
                event.currentTarget.value = '';
              }}
            />
          </EditorSection>

          <EditorSection title="Distribution links" icon={Cloud}>
            <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-950">
              <p className="font-semibold">Simple setup</p>
              <p className="mt-1 leading-6">
                Paste a hosted installer link, then choose whether it is a mirror or the main download button.
              </p>
            </div>
            <div className="grid gap-3 rounded-lg border border-gray-200 p-3">
              <label className="editor-label">
                Primary host
                <select
                  className="editor-input"
                  value={getPrimaryHost(installer)}
                  onChange={(event) => setPrimaryHost(event.currentTarget.value as PrimaryHost)}
                >
                  <option value="local">Local uploaded file</option>
                  <option value="github-releases">GitHub Releases</option>
                  <option value="google-drive">Google Drive</option>
                  <option value="onedrive">OneDrive</option>
                  <option value="custom">Custom URL</option>
                </select>
              </label>
              <div className="flex flex-wrap items-center gap-2">
                <LinkStatusBadge label="Primary" status={linkStatuses.primary ?? 'unchecked'} />
                <button
                  type="button"
                  className="editor-button"
                  onClick={() => void validateLinks()}
                  disabled={isValidatingLinks}
                >
                  {isValidatingLinks ? <Loader2 size={16} className="animate-spin" /> : <ScanSearch size={16} />}
                  Validate links
                </button>
              </div>
            </div>
            <TextField
              label="Current main download URL"
              value={installer.installerPath}
              onChange={(value) => updateInstaller({ installerPath: value })}
            />

            <div className="rounded-lg border border-gray-200 p-3">
              <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-gray-500">
                <Github size={15} />
                GitHub Releases
              </div>
              <div className="grid gap-3 sm:grid-cols-3">
                <TextField
                  label="Owner"
                  value={installer.githubOwner}
                  onChange={(value) => updateInstaller({ githubOwner: value })}
                />
                <TextField
                  label="Repo"
                  value={installer.githubRepo}
                  onChange={(value) => updateInstaller({ githubRepo: value })}
                />
                <TextField
                  label="Asset file"
                  value={installer.githubAssetName}
                  onChange={(value) => updateInstaller({ githubAssetName: value })}
                />
              </div>
              <TextField
                label="Generated GitHub URL"
                value={getGitHubReleaseUrl(installer)}
                onChange={() => undefined}
              />
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                <button type="button" className="editor-button justify-center" onClick={() => applyGitHubReleaseUrl(false)}>
                  <ExternalLink size={16} />
                  Show as mirror
                </button>
                <button type="button" className="editor-button justify-center" onClick={() => applyGitHubReleaseUrl(true)}>
                  <HardDriveDownload size={16} />
                  Make main download
                </button>
              </div>
              <div className="mt-3">
                <LinkStatusBadge label="GitHub" status={linkStatuses['github-releases'] ?? 'unchecked'} />
              </div>
            </div>

            <QuickMirrorEditor
              label="Google Drive"
              mirror={googleDriveMirror}
              status={linkStatuses['google-drive'] ?? 'unchecked'}
              onChange={(value) => updateDistributionLink('google-drive', value)}
              onPrimary={() => useMirrorAsPrimary('google-drive')}
              extraAction={
                googleDriveMirror.url.trim() ? (
                  <button
                    type="button"
                    className="editor-button justify-center"
                    onClick={() => updateDistributionLink('google-drive', getGoogleDriveDirectUrl(googleDriveMirror.url))}
                  >
                    <Download size={16} />
                    Convert Drive link
                  </button>
                ) : null
              }
            />

            <QuickMirrorEditor
              label="OneDrive"
              mirror={oneDriveMirror}
              status={linkStatuses.onedrive ?? 'unchecked'}
              onChange={(value) => updateDistributionLink('onedrive', value)}
              onPrimary={() => useMirrorAsPrimary('onedrive')}
            />

            <div className="grid gap-2 rounded-lg border border-gray-200 p-3 text-sm text-gray-600">
              <p>
                Active mirrors:{' '}
                <span className="font-semibold text-gray-950">
                  {getInstallerMirrors(installer).filter((mirror) => mirror.enabled && mirror.url.trim()).length}
                </span>
              </p>
              <p>Google Drive and OneDrive links are easiest as backup mirrors. GitHub Releases is better as the main host.</p>
            </div>
          </EditorSection>

          <EditorSection title="Mobile downloads" icon={Smartphone}>
            <div className="rounded-lg border border-blue-200 bg-blue-50 p-3 text-sm text-blue-950">
              <p className="font-semibold">Android and iOS setup</p>
              <p className="mt-1 leading-6">
                Use Android for APK, AAB, Play Store, or hosted package links. Use iOS for App Store or TestFlight links.
              </p>
            </div>
            <div className="space-y-4">
              {getMobileDownloads(installer).map((download) => {
                const Icon = download.id === 'ios' ? Apple : Smartphone;

                return (
                  <div className="grid gap-3 rounded-lg border border-gray-200 p-3" key={download.id}>
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2 text-sm font-semibold text-gray-950">
                        <Icon size={17} />
                        {download.label}
                      </div>
                      <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                        <input
                          type="checkbox"
                          checked={download.enabled}
                          onChange={(event) => updateMobileDownload(download.id, { enabled: event.currentTarget.checked })}
                        />
                        Show
                      </label>
                    </div>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <TextField
                        label="Platform label"
                        value={download.label}
                        onChange={(value) => updateMobileDownload(download.id, { label: value })}
                      />
                      <TextField
                        label="Support"
                        value={download.platformSupport}
                        onChange={(value) => updateMobileDownload(download.id, { platformSupport: value })}
                      />
                      <TextField
                        label="File or listing"
                        value={download.fileName}
                        onChange={(value) => updateMobileDownload(download.id, { fileName: value })}
                      />
                      <TextField
                        label="Size or note"
                        value={download.fileSize}
                        onChange={(value) => updateMobileDownload(download.id, { fileSize: value })}
                      />
                      <TextField
                        label="Button label"
                        value={download.buttonLabel}
                        onChange={(value) => updateMobileDownload(download.id, { buttonLabel: value })}
                      />
                      <TextField
                        label="Download URL"
                        value={download.url}
                        onChange={(value) => updateMobileDownload(download.id, { url: value })}
                      />
                    </div>
                    <LinkStatusBadge label={download.label} status={linkStatuses[download.id] ?? 'unchecked'} />
                  </div>
                );
              })}
            </div>
          </EditorSection>

          <EditorSection title="Hero and preview" icon={Edit3}>
            <TextField label="Eyebrow" value={copy.eyebrow} onChange={(value) => updateCopy('eyebrow', value)} />
            <TextField label="Hero title" value={copy.heroTitle} onChange={(value) => updateCopy('heroTitle', value)} />
            <TextField
              label="Hero description"
              value={copy.heroDescription}
              onChange={(value) => updateCopy('heroDescription', value)}
              multiline
            />
            <TextField label="Preview title" value={copy.previewTitle} onChange={(value) => updateCopy('previewTitle', value)} />
            <TextField
              label="Preview description"
              value={copy.previewDescription}
              onChange={(value) => updateCopy('previewDescription', value)}
              multiline
            />
          </EditorSection>

          <EditorSection title="Features" icon={Sparkles}>
            <TextField
              label="Section title"
              value={copy.featuresTitle}
              onChange={(value) => updateCopy('featuresTitle', value)}
            />
            <TextField
              label="Section description"
              value={copy.featuresDescription}
              onChange={(value) => updateCopy('featuresDescription', value)}
              multiline
            />
            {featureCards.map((feature, index) => (
              <div className="rounded-lg border border-gray-200 p-3" key={feature.titleKey}>
                <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-500">Feature {index + 1}</p>
                <TextField
                  label="Title"
                  value={copy[feature.titleKey]}
                  onChange={(value) => updateCopy(feature.titleKey, value)}
                />
                <TextField
                  label="Text"
                  value={copy[feature.textKey]}
                  onChange={(value) => updateCopy(feature.textKey, value)}
                  multiline
                />
              </div>
            ))}
          </EditorSection>

          <EditorSection title="CTA and changelog" icon={HardDriveDownload}>
            <TextField
              label="Download title"
              value={copy.downloadTitle}
              onChange={(value) => updateCopy('downloadTitle', value)}
            />
            <TextField
              label="Download description"
              value={copy.downloadDescription}
              onChange={(value) => updateCopy('downloadDescription', value)}
              multiline
            />
            {changelogKeys.map((key, index) => (
              <TextField
                key={key}
                label={`Changelog item ${index + 1}`}
                value={copy[key]}
                onChange={(value) => updateCopy(key, value)}
                multiline
              />
            ))}
          </EditorSection>

          <EditorSection title="Release and installer" icon={FileText}>
            <div className="grid gap-3 sm:grid-cols-2">
              <TextField label="Product name" value={productMeta.name} onChange={(value) => updateProductMeta({ name: value })} />
              <TextField label="Version" value={productMeta.version} onChange={(value) => updateProductMeta({ version: value })} />
              <TextField
                label="Windows support"
                value={productMeta.windowsSupport}
                onChange={(value) => updateProductMeta({ windowsSupport: value })}
              />
              <TextField
                label="Release date"
                value={productMeta.releaseDate}
                onChange={(value) => updateProductMeta({ releaseDate: value })}
              />
              <TextField
                label="Publisher"
                value={productMeta.publisher}
                onChange={(value) => updateProductMeta({ publisher: value })}
              />
              <TextField
                label="Support email"
                value={productMeta.supportEmail}
                onChange={(value) => updateProductMeta({ supportEmail: value })}
              />
              <TextField
                label="GitHub project URL"
                value={productMeta.githubUrl}
                onChange={(value) => updateProductMeta({ githubUrl: value })}
              />
              <TextField
                label="Installer filename"
                value={installer.fileName}
                onChange={(value) => updateInstaller({ fileName: value })}
              />
              <TextField
                label="Installer path"
                value={installer.installerPath}
                onChange={(value) => updateInstaller({ installerPath: value })}
              />
              <TextField label="File size" value={installer.fileSize} onChange={(value) => updateInstaller({ fileSize: value })} />
            </div>
            <TextField
              label="SHA-256 checksum"
              value={installer.checksum}
              onChange={(value) => updateInstaller({ checksum: value })}
              multiline
            />
            <div className="rounded-lg border border-gray-200 p-3">
              <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-gray-500">
                <Github size={15} />
                GitHub Releases
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <TextField
                  label="Owner or org"
                  value={installer.githubOwner}
                  onChange={(value) => updateInstaller({ githubOwner: value })}
                />
                <TextField
                  label="Repository"
                  value={installer.githubRepo}
                  onChange={(value) => updateInstaller({ githubRepo: value })}
                />
                <TextField
                  label="Release asset filename"
                  value={installer.githubAssetName}
                  onChange={(value) => updateInstaller({ githubAssetName: value })}
                />
                <label className="editor-label">
                  Generated latest-release URL
                  <input className="editor-input" readOnly value={getGitHubReleaseUrl(installer)} />
                </label>
              </div>
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                <button type="button" className="editor-button justify-center" onClick={() => applyGitHubReleaseUrl(false)}>
                  <Github size={16} />
                  Add as mirror
                </button>
                <button type="button" className="editor-button justify-center" onClick={() => applyGitHubReleaseUrl(true)}>
                  <HardDriveDownload size={16} />
                  Use as primary
                </button>
              </div>
            </div>
            <div className="rounded-lg border border-gray-200 p-3">
              <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-gray-500">
                <Cloud size={15} />
                External drive mirrors
              </div>
              <div className="space-y-4">
                {getInstallerMirrors(installer).map((mirror) => (
                  <div className="grid gap-3 rounded-md bg-gray-50 p-3" key={mirror.id}>
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-800">
                      <input
                        type="checkbox"
                        checked={mirror.enabled}
                        onChange={(event) => updateMirror(mirror.id, { enabled: event.currentTarget.checked })}
                      />
                      Show {mirror.label} option
                    </label>
                    <div className="grid gap-3 sm:grid-cols-[0.45fr_1fr]">
                      <TextField
                        label="Button label"
                        value={mirror.label}
                        onChange={(value) => updateMirror(mirror.id, { label: value })}
                      />
                      <TextField
                        label="Share link"
                        value={mirror.url}
                        onChange={(value) => updateMirror(mirror.id, { url: value })}
                      />
                    </div>
                    {mirror.url.trim() ? (
                      <button
                        type="button"
                        className="editor-button justify-center"
                        onClick={() => updateInstaller({ installerPath: mirror.url })}
                      >
                        <HardDriveDownload size={16} />
                        Use this as primary
                      </button>
                    ) : null}
                  </div>
                ))}
              </div>
            </div>
          </EditorSection>

          <EditorSection title="Background and style" icon={Palette}>
            <div className="grid gap-2 sm:grid-cols-2">
              {themePresets.map((preset) => (
                <button
                  type="button"
                  className="editor-button justify-between"
                  key={preset.label}
                  onClick={() => replaceTheme(preset.value)}
                >
                  <span>{preset.label}</span>
                  <span
                    className="size-5 rounded-full border border-gray-300"
                    style={{ backgroundColor: preset.value.accentColor }}
                  />
                </button>
              ))}
            </div>
            <label className="editor-label">
              Background type
              <select
                className="editor-input"
                value={theme.backgroundType}
                onChange={(event) => updateTheme({ backgroundType: event.currentTarget.value as LandingTheme['backgroundType'] })}
              >
                <option value="solid">Solid color</option>
                <option value="gradient">Gradient</option>
                <option value="image">Image</option>
                <option value="pattern">Subtle pattern</option>
              </select>
            </label>
            <div className="grid gap-3 sm:grid-cols-2">
              <ColorField label="Accent color" value={theme.accentColor} onChange={(value) => updateTheme({ accentColor: value })} />
              <ColorField
                label="Button text"
                value={theme.buttonTextColor}
                onChange={(value) => updateTheme({ buttonTextColor: value })}
              />
              <ColorField
                label="Background color"
                value={theme.backgroundColor}
                onChange={(value) => updateTheme({ backgroundColor: value })}
              />
              <ColorField
                label="Page background"
                value={theme.pageBackground}
                onChange={(value) => updateTheme({ pageBackground: value })}
              />
              <ColorField
                label="Gradient start"
                value={theme.gradientStart}
                onChange={(value) => updateTheme({ gradientStart: value })}
              />
              <ColorField
                label="Gradient end"
                value={theme.gradientEnd}
                onChange={(value) => updateTheme({ gradientEnd: value })}
              />
              <ColorField
                label="Pattern color"
                value={theme.patternColor}
                onChange={(value) => updateTheme({ patternColor: value })}
              />
              <ColorField
                label="Section background"
                value={theme.sectionBackground}
                onChange={(value) => updateTheme({ sectionBackground: value })}
              />
              <ColorField
                label="Alt section background"
                value={theme.alternateSectionBackground}
                onChange={(value) => updateTheme({ alternateSectionBackground: value })}
              />
              <ColorField
                label="Card surface"
                value={theme.surfaceColor}
                onChange={(value) => updateTheme({ surfaceColor: value })}
              />
              <ColorField
                label="Subtle surface"
                value={theme.subtleSurfaceColor}
                onChange={(value) => updateTheme({ subtleSurfaceColor: value })}
              />
              <ColorField
                label="Border color"
                value={theme.borderColor}
                onChange={(value) => updateTheme({ borderColor: value })}
              />
              <ColorField label="Text color" value={theme.textColor} onChange={(value) => updateTheme({ textColor: value })} />
              <ColorField
                label="Muted text"
                value={theme.mutedTextColor}
                onChange={(value) => updateTheme({ mutedTextColor: value })}
              />
              <ColorField
                label="Header background"
                value={theme.headerBackground}
                onChange={(value) => updateTheme({ headerBackground: value })}
              />
              <ColorField
                label="Download background"
                value={theme.downloadBackground}
                onChange={(value) => updateTheme({ downloadBackground: value })}
              />
              <ColorField
                label="Download text"
                value={theme.downloadTextColor}
                onChange={(value) => updateTheme({ downloadTextColor: value })}
              />
              <label className="editor-label">
                Section density
                <select
                  className="editor-input"
                  value={theme.density}
                  onChange={(event) => updateTheme({ density: event.currentTarget.value as LandingTheme['density'] })}
                >
                  <option value="compact">Compact</option>
                  <option value="normal">Normal</option>
                  <option value="spacious">Spacious</option>
                </select>
              </label>
            </div>
            <TextField
              label="Background image path"
              value={theme.backgroundImage}
              onChange={(value) => updateTheme({ backgroundImage: value })}
            />
            <label className="editor-label">
              Overlay opacity
              <input
                className="editor-input"
                type="range"
                min="0"
                max="0.75"
                step="0.05"
                value={theme.overlayOpacity}
                onChange={(event) => updateTheme({ overlayOpacity: Number(event.currentTarget.value) })}
              />
            </label>
            <div className="grid gap-2 sm:grid-cols-2">
              <ImageUploadButton label="Upload background" onUpload={(file) => uploadImage(file, 'background')} />
              <ImageUploadButton label="Upload screenshot" onUpload={(file) => uploadImage(file, 'screenshot')} />
            </div>
            <p className="text-xs leading-5 text-gray-500">{uploadMessage}</p>
          </EditorSection>
        </div>
      </aside>
    </>
  );
}

function EditorSection({ title, icon: Icon, children }: { title: string; icon: ElementType; children: ReactNode }) {
  return (
    <section className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-gray-950">
        <Icon size={17} className="text-emerald-700" />
        {title}
      </div>
      <div className="space-y-3">{children}</div>
    </section>
  );
}

function QuickMirrorEditor({
  label,
  mirror,
  status,
  onChange,
  onPrimary,
  extraAction,
}: {
  label: string;
  mirror: DownloadMirror;
  status: LinkStatus;
  onChange: (value: string) => void;
  onPrimary: () => void;
  extraAction?: ReactNode;
}) {
  return (
    <div className="rounded-lg border border-gray-200 p-3">
      <div className="mb-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-gray-500">
          <Cloud size={15} />
          {label}
        </div>
        <span
          className={`rounded-full px-2 py-1 text-xs font-semibold ${
            mirror.enabled && mirror.url.trim() ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-500'
          }`}
        >
          {mirror.enabled && mirror.url.trim() ? 'Shown' : 'Hidden'}
        </span>
      </div>
      <TextField label={`${label} share link`} value={mirror.url} onChange={onChange} />
      <div className="mt-3">
        <LinkStatusBadge label={label} status={status} />
      </div>
      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        <button type="button" className="editor-button justify-center" onClick={() => onChange(mirror.url)}>
          <ExternalLink size={16} />
          Show as mirror
        </button>
        <button
          type="button"
          className="editor-button justify-center"
          disabled={!mirror.url.trim()}
          onClick={onPrimary}
        >
          <HardDriveDownload size={16} />
          Make main download
        </button>
        {extraAction}
      </div>
    </div>
  );
}

function LinkStatusBadge({ label, status }: { label: string; status: LinkStatus }) {
  const styles: Record<LinkStatus, string> = {
    unchecked: 'bg-gray-100 text-gray-500',
    checking: 'bg-blue-100 text-blue-800',
    reachable: 'bg-emerald-100 text-emerald-800',
    blocked: 'bg-amber-100 text-amber-800',
    missing: 'bg-rose-100 text-rose-800',
  };
  const text: Record<LinkStatus, string> = {
    unchecked: 'Not checked',
    checking: 'Checking',
    reachable: 'Reachable',
    blocked: 'Blocked or unknown',
    missing: 'Missing URL',
  };

  return (
    <span className={`inline-flex min-h-7 items-center gap-2 rounded-full px-3 text-xs font-semibold ${styles[status]}`}>
      {status === 'checking' ? <Loader2 size={13} className="animate-spin" /> : null}
      {label}: {text[status]}
    </span>
  );
}

function TextField({
  label,
  value,
  onChange,
  multiline = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  multiline?: boolean;
}) {
  return (
    <label className="editor-label">
      {label}
      {multiline ? (
        <textarea className="editor-input min-h-24 resize-y" value={value} onChange={(event) => onChange(event.currentTarget.value)} />
      ) : (
        <input className="editor-input" type="text" value={value} onChange={(event) => onChange(event.currentTarget.value)} />
      )}
    </label>
  );
}

function ColorField({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="editor-label">
      {label}
      <span className="flex gap-2">
        <input
          className="h-11 w-14 rounded-md border border-gray-300 bg-white p-1"
          type="color"
          value={value}
          onChange={(event) => onChange(event.currentTarget.value)}
        />
        <input className="editor-input" type="text" value={value} onChange={(event) => onChange(event.currentTarget.value)} />
      </span>
    </label>
  );
}

function ImageUploadButton({ label, onUpload }: { label: string; onUpload: (file: File) => void }) {
  return (
    <label className="editor-button cursor-pointer justify-center">
      <Image size={16} />
      {label}
      <input
        className="sr-only"
        type="file"
        accept="image/png,image/jpeg,image/webp,image/gif"
        onChange={(event: ChangeEvent<HTMLInputElement>) => {
          const file = event.currentTarget.files?.[0];
          if (file) {
            void onUpload(file);
          }
          event.currentTarget.value = '';
        }}
      />
    </label>
  );
}

function ButtonLink({
  href,
  children,
  variant = 'primary',
  theme,
  external = false,
}: {
  href: string;
  children: ReactNode;
  variant?: 'primary' | 'secondary';
  theme: LandingTheme;
  external?: boolean;
}) {
  const classes =
    variant === 'primary'
      ? 'shadow-soft hover:-translate-y-0.5 focus-visible:outline-gray-950'
      : 'border hover:-translate-y-0.5 focus-visible:outline-gray-500';

  return (
    <a
      href={href}
      target={external ? '_blank' : undefined}
      rel={external ? 'noreferrer' : undefined}
      style={
        variant === 'primary'
          ? { ...getAccentStyle(theme), color: theme.buttonTextColor }
          : { ...getSurfaceStyle(theme), color: theme.textColor }
      }
      className={`inline-flex min-h-12 items-center justify-center gap-2 rounded-md px-5 text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${classes}`}
    >
      {children}
    </a>
  );
}

function LocalPreflightWarning({ canEdit, installer }: { canEdit: boolean; installer: InstallerMeta }) {
  const [status, setStatus] = useState<'checking' | 'available' | 'missing'>('checking');

  useEffect(() => {
    if (!canEdit) {
      return;
    }

    let isCurrent = true;

    setStatus('checking');
    fetch(installer.installerPath, { method: 'HEAD', cache: 'no-store' })
      .then((response) => {
        if (isCurrent) {
          setStatus(response.ok ? 'available' : 'missing');
        }
      })
      .catch(() => {
        if (isCurrent) {
          setStatus('missing');
        }
      });

    return () => {
      isCurrent = false;
    };
  }, [canEdit, installer.installerPath]);

  if (!canEdit || status !== 'missing') {
    return null;
  }

  return (
    <div className="border-b border-amber-200 bg-amber-50">
      <div className="container-page flex items-start gap-3 py-3 text-sm text-amber-900">
        <AlertTriangle className="mt-0.5 shrink-0" size={18} />
        <p>
          Local preflight: the configured installer <span className="font-semibold">{installer.installerPath}</span> is
          missing. Drop an .exe into the developer toolbar or place the installer in public/downloads before publishing.
        </p>
      </div>
    </div>
  );
}

function Header({ installer, productMeta, theme }: { installer: InstallerMeta; productMeta: ProductMeta; theme: LandingTheme }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navLinks = [
    ['Features', '#features'],
    ['Preview', '#preview'],
    ['Changelog', '#changelog'],
    ['Security', '#security'],
  ];

  return (
    <header
      className="sticky top-0 z-40 border-b backdrop-blur-xl"
      style={{ backgroundColor: `${theme.headerBackground}e6`, borderColor: theme.borderColor }}
    >
      <nav className="container-page flex h-16 items-center justify-between">
        <a href="#" className="flex items-center gap-2 text-sm font-semibold" style={{ color: theme.textColor }}>
          <span className="grid size-9 place-items-center rounded-md text-white shadow-sm" style={getAccentStyle(theme)}>
            <TerminalSquare size={18} />
          </span>
          {productMeta.name}
        </a>
        <div className="hidden items-center gap-6 text-sm font-medium md:flex" style={{ color: theme.mutedTextColor }}>
          {navLinks.map(([label, href]) => (
            <a className="transition hover:opacity-80" href={href} key={href}>
              {label}
            </a>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <a
            href={productMeta.githubUrl}
            target="_blank"
            rel="noreferrer"
            aria-label="View project on GitHub"
            title="View project on GitHub"
            className="inline-grid size-10 place-items-center rounded-md border transition hover:opacity-80"
            style={getSurfaceStyle(theme)}
          >
            <Github size={18} />
          </a>
          <a
            href="#download"
            style={{ ...getAccentStyle(theme), color: theme.buttonTextColor }}
            className="inline-flex min-h-10 items-center justify-center gap-2 rounded-md px-3 text-sm font-semibold transition brightness-100 hover:brightness-95 sm:px-4"
          >
            <ArrowDownToLine size={17} />
            <span className="hidden sm:inline">Downloads</span>
          </a>
          <button
            type="button"
            className="inline-grid size-10 place-items-center rounded-md border transition hover:opacity-80 md:hidden"
            style={getSurfaceStyle(theme)}
            onClick={() => setIsMenuOpen((value) => !value)}
            aria-expanded={isMenuOpen}
            aria-label="Toggle navigation"
          >
            {isMenuOpen ? <X size={19} /> : <Menu size={19} />}
          </button>
        </div>
      </nav>
      {isMenuOpen ? (
        <div className="border-t md:hidden" style={{ backgroundColor: theme.headerBackground, borderColor: theme.borderColor }}>
          <div className="container-page grid gap-1 py-3 text-sm font-medium" style={{ color: theme.mutedTextColor }}>
            {navLinks.map(([label, href]) => (
              <a
                className="rounded-md px-2 py-3 transition hover:opacity-80"
                href={href}
                key={href}
                onClick={() => setIsMenuOpen(false)}
              >
                {label}
              </a>
            ))}
            <a
              className="rounded-md px-2 py-3 transition hover:opacity-80"
              href={productMeta.githubUrl}
              target="_blank"
              rel="noreferrer"
              onClick={() => setIsMenuOpen(false)}
            >
              GitHub
            </a>
          </div>
        </div>
      ) : null}
    </header>
  );
}

function Hero({
  copy,
  editMode,
  updateCopy,
  installer,
  productMeta,
  theme,
}: {
  copy: EditableCopy;
  editMode: boolean;
  updateCopy: (key: CopyKey, value: string) => void;
  installer: InstallerMeta;
  productMeta: ProductMeta;
  theme: LandingTheme;
}) {
  return (
    <section className="relative overflow-hidden border-b" style={{ ...getHeroStyle(theme), borderColor: theme.borderColor }}>
      <div className="container-page grid min-h-[calc(100vh-4rem)] items-center gap-10 py-14 lg:grid-cols-[1fr_0.92fr] lg:py-20">
        <div>
          <div
            className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-sm font-medium shadow-sm"
            style={getSurfaceStyle(theme)}
          >
            <BadgeCheck size={16} style={{ color: theme.accentColor }} />
            <EditableText copyKey="eyebrow" copy={copy} editMode={editMode} updateCopy={updateCopy} />
          </div>
          <EditableText
            as="h1"
            copyKey="heroTitle"
            copy={copy}
            editMode={editMode}
            updateCopy={updateCopy}
            className="mt-6 block max-w-3xl text-5xl font-semibold tracking-normal text-gray-950 sm:text-6xl lg:text-7xl"
            style={{ color: theme.textColor }}
          />
          <EditableText
            as="p"
            copyKey="heroDescription"
            copy={copy}
            editMode={editMode}
            updateCopy={updateCopy}
            className="mt-6 block max-w-2xl text-lg leading-8 text-gray-600"
            style={{ color: theme.mutedTextColor }}
          />
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href="#download" theme={theme}>
              <HardDriveDownload size={19} />
              Download Apps
            </ButtonLink>
            <ButtonLink href="#features" variant="secondary" theme={theme}>
              View Features
              <ChevronRight size={18} />
            </ButtonLink>
            <ButtonLink href={productMeta.githubUrl} variant="secondary" theme={theme} external>
              <Github size={19} />
              GitHub
            </ButtonLink>
          </div>
          <dl className="mt-8 grid max-w-2xl grid-cols-1 gap-3 text-sm sm:grid-cols-3" style={{ color: theme.mutedTextColor }}>
            {[
              ['Latest version', productMeta.version],
              ['Platforms', 'Windows, Android, iOS'],
              ['Windows size', installer.fileSize],
            ].map(([label, value]) => (
              <div className="rounded-lg border p-4 shadow-sm backdrop-blur" style={getSurfaceStyle(theme)} key={label}>
                <dt className="font-medium" style={{ color: theme.textColor }}>{label}</dt>
                <dd className="mt-1">{value}</dd>
              </div>
            ))}
          </dl>
        </div>
        <ProductVisual productMeta={productMeta} compact />
      </div>
    </section>
  );
}

function ProductVisual({ productMeta, compact = false }: { productMeta: ProductMeta; compact?: boolean }) {
  const [showScreenshot, setShowScreenshot] = useState(true);

  if (!showScreenshot) {
    return <DesktopMockup productMeta={productMeta} compact={compact} />;
  }

  return (
    <div className="rounded-xl border border-gray-300 bg-gray-950 p-2 shadow-soft">
      <div className="flex h-9 items-center gap-2 border-b border-gray-800 px-3">
        <span className="size-3 rounded-full bg-red-400" />
        <span className="size-3 rounded-full bg-amber-400" />
        <span className="size-3 rounded-full bg-emerald-400" />
        <span className="ml-3 truncate text-xs text-gray-300">{productMeta.name} Preview</span>
      </div>
      <div className={`overflow-hidden rounded-b-lg bg-gray-900 ${compact ? 'min-h-[340px]' : 'min-h-[430px]'}`}>
        <img
          src={productMeta.screenshotPath}
          alt={`${productMeta.name} application screenshot`}
          className={`${compact ? 'min-h-[340px]' : 'min-h-[430px]'} h-full w-full object-cover object-top`}
          onError={() => setShowScreenshot(false)}
        />
      </div>
    </div>
  );
}

function DesktopMockup({ productMeta, compact = false }: { productMeta: ProductMeta; compact?: boolean }) {
  return (
    <div className="rounded-xl border border-gray-300 bg-gray-950 p-2 shadow-soft">
      <div className="flex h-9 items-center gap-2 border-b border-gray-800 px-3">
        <span className="size-3 rounded-full bg-red-400" />
        <span className="size-3 rounded-full bg-amber-400" />
        <span className="size-3 rounded-full bg-emerald-400" />
        <span className="ml-3 truncate text-xs text-gray-300">{productMeta.name} Dashboard</span>
      </div>
      <div className={`grid gap-3 rounded-b-lg bg-gray-900 p-3 ${compact ? 'min-h-[340px]' : 'min-h-[430px]'}`}>
        <div className="grid grid-cols-[0.35fr_1fr] gap-3">
          <div className="space-y-2 rounded-lg bg-gray-950 p-3">
            {['Overview', 'Projects', 'Exports', 'Settings'].map((item, index) => (
              <div
                className={`rounded-md px-3 py-2 text-xs ${
                  index === 0 ? 'bg-emerald-400 text-gray-950' : 'bg-gray-800 text-gray-300'
                }`}
                key={item}
              >
                {item}
              </div>
            ))}
          </div>
          <div className="rounded-lg bg-white p-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <div className="h-3 w-28 rounded bg-gray-300" />
                <div className="mt-3 h-6 w-44 rounded bg-gray-900" />
              </div>
              <div className="rounded-md bg-emerald-100 px-3 py-2 text-xs font-semibold text-emerald-800">Ready</div>
            </div>
            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              {[72, 48, 88].map((width) => (
                <div className="rounded-lg border border-gray-200 bg-slate-50 p-3" key={width}>
                  <div className="h-3 w-16 rounded bg-gray-200" />
                  <div className="mt-4 h-7 rounded bg-gray-900" style={{ width: `${width}%` }} />
                </div>
              ))}
            </div>
            <div className="mt-6 space-y-3">
              {[1, 2, 3].map((row) => (
                <div className="grid grid-cols-[1fr_0.45fr_0.25fr] gap-3 rounded-lg border border-gray-200 p-3" key={row}>
                  <div className="h-3 rounded bg-gray-200" />
                  <div className="h-3 rounded bg-gray-200" />
                  <div className="h-3 rounded bg-emerald-300" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Preview({
  copy,
  editMode,
  updateCopy,
  productMeta,
  theme,
}: {
  copy: EditableCopy;
  editMode: boolean;
  updateCopy: (key: CopyKey, value: string) => void;
  productMeta: ProductMeta;
  theme: LandingTheme;
}) {
  return (
    <section id="preview" className={sectionPadding(theme)} style={getSectionStyle(theme, true)}>
      <div className="container-page">
        <div className="grid items-center gap-10 lg:grid-cols-[0.95fr_1fr]">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider" style={{ color: theme.accentColor }}>
              Product preview
            </p>
            <EditableText
              as="h2"
              copyKey="previewTitle"
              copy={copy}
              editMode={editMode}
              updateCopy={updateCopy}
              className="section-title mt-3 block"
              style={{ color: theme.textColor }}
            />
            <EditableText
              as="p"
              copyKey="previewDescription"
              copy={copy}
              editMode={editMode}
              updateCopy={updateCopy}
              className="section-copy block"
              style={{ color: theme.mutedTextColor }}
            />
            <div className="mt-6 grid gap-3 text-sm sm:grid-cols-2" style={{ color: theme.textColor }}>
              {['Task-focused dashboard', 'Readable status panels', 'Installer-ready download path', 'Responsive screenshot layout'].map(
                (item) => (
                  <div className="flex items-center gap-2 rounded-md p-3 shadow-sm" style={getSurfaceStyle(theme)} key={item}>
                    <Check size={17} style={{ color: theme.accentColor }} />
                    {item}
                  </div>
                ),
              )}
            </div>
          </div>
          <ProductVisual productMeta={productMeta} />
        </div>
      </div>
    </section>
  );
}

function Features({
  copy,
  editMode,
  updateCopy,
  theme,
}: {
  copy: EditableCopy;
  editMode: boolean;
  updateCopy: (key: CopyKey, value: string) => void;
  theme: LandingTheme;
}) {
  return (
    <section id="features" className={sectionPadding(theme)} style={getSectionStyle(theme)}>
      <div className="container-page">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-wider" style={{ color: theme.accentColor }}>
            Features
          </p>
          <EditableText
            as="h2"
            copyKey="featuresTitle"
            copy={copy}
            editMode={editMode}
            updateCopy={updateCopy}
            className="section-title mt-3 block"
            style={{ color: theme.textColor }}
          />
          <EditableText
            as="p"
            copyKey="featuresDescription"
            copy={copy}
            editMode={editMode}
            updateCopy={updateCopy}
            className="section-copy block"
            style={{ color: theme.mutedTextColor }}
          />
        </div>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {featureCards.map((feature) => {
            const Icon = feature.icon;
            return (
              <article
                className="rounded-xl border p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-soft"
                style={getSurfaceStyle(theme)}
                key={feature.titleKey}
              >
                <div
                  className="grid size-11 place-items-center rounded-lg"
                  style={{ backgroundColor: theme.subtleSurfaceColor, color: theme.accentColor }}
                >
                  <Icon size={22} />
                </div>
                <EditableText
                  as="h3"
                  copyKey={feature.titleKey}
                  copy={copy}
                  editMode={editMode}
                  updateCopy={updateCopy}
                  className="mt-5 block text-lg font-semibold text-gray-950"
                  style={{ color: theme.textColor }}
                />
                <EditableText
                  as="p"
                  copyKey={feature.textKey}
                  copy={copy}
                  editMode={editMode}
                  updateCopy={updateCopy}
                  className="mt-3 block text-sm leading-6 text-gray-600"
                  style={{ color: theme.mutedTextColor }}
                />
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function DownloadPanel({
  copy,
  editMode,
  updateCopy,
  installer,
  productMeta,
  theme,
}: {
  copy: EditableCopy;
  editMode: boolean;
  updateCopy: (key: CopyKey, value: string) => void;
  installer: InstallerMeta;
  productMeta: ProductMeta;
  theme: LandingTheme;
}) {
  const activeMirrors = getInstallerMirrors(installer).filter((mirror) => mirror.enabled && mirror.url.trim());
  const platformDownloads = getPlatformDownloads(installer, productMeta).filter((download) => download.enabled);

  return (
    <section
      id="download"
      className={sectionPadding(theme)}
      style={{ backgroundColor: theme.downloadBackground, color: theme.downloadTextColor }}
    >
      <div className="container-page grid gap-8 lg:grid-cols-[1fr_0.8fr] lg:items-center">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-emerald-300">Download</p>
          <EditableText
            as="h2"
            copyKey="downloadTitle"
            copy={copy}
            editMode={editMode}
            updateCopy={updateCopy}
            className="mt-3 block text-3xl font-semibold tracking-normal sm:text-4xl"
          />
          <EditableText
            as="p"
            copyKey="downloadDescription"
            copy={copy}
            editMode={editMode}
            updateCopy={updateCopy}
            className="mt-4 block max-w-2xl text-base leading-7 text-gray-300"
            style={{ color: theme.mutedTextColor }}
          />
        </div>
        <div className="rounded-xl border p-6 shadow-soft" style={getSubtleSurfaceStyle(theme)}>
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="text-xl font-semibold">{productMeta.name} downloads</h3>
              <p className="mt-1 text-sm" style={{ color: theme.mutedTextColor }}>
                {productMeta.version} released {productMeta.releaseDate}
              </p>
            </div>
            <FileText className="text-emerald-300" size={28} />
          </div>
          <div className="mt-6 grid gap-3">
            {platformDownloads.map((download) => {
              const Icon = download.icon;
              const hasUrl = Boolean(download.url.trim());

              return (
                <article className="rounded-lg border p-4" style={getSurfaceStyle(theme)} key={download.id}>
                  <div className="flex items-start gap-3">
                    <div
                      className="grid size-10 shrink-0 place-items-center rounded-md"
                      style={{ backgroundColor: theme.subtleSurfaceColor, color: theme.accentColor }}
                    >
                      <Icon size={20} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <h4 className="font-semibold">{download.label}</h4>
                        <span className="text-xs font-medium" style={{ color: theme.mutedTextColor }}>
                          {download.fileSize}
                        </span>
                      </div>
                      <p className="mt-1 text-sm" style={{ color: theme.mutedTextColor }}>
                        {download.platformSupport}
                      </p>
                      <p className="mt-2 truncate text-xs" style={{ color: theme.mutedTextColor }}>
                        {download.fileName}
                      </p>
                      {hasUrl ? (
                        <a
                          href={download.url}
                          target={isExternalUrl(download.url) ? '_blank' : undefined}
                          rel={isExternalUrl(download.url) ? 'noreferrer' : undefined}
                          style={{ backgroundColor: theme.accentColor, color: theme.buttonTextColor }}
                          className="mt-4 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-md px-4 text-sm font-semibold transition brightness-100 hover:brightness-95"
                        >
                          <Icon size={18} />
                          {download.buttonLabel}
                        </a>
                      ) : (
                        <span
                          className="mt-4 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-md border px-4 text-sm font-semibold"
                          style={{ borderColor: theme.borderColor, color: theme.mutedTextColor }}
                        >
                          <Icon size={18} />
                          Add download link
                        </span>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
          <dl className="mt-6 grid gap-3 text-sm">
            <MetaRow label="Publisher" value={productMeta.publisher} theme={theme} />
            <div className="border-t pt-3" style={{ borderColor: theme.borderColor }}>
              <dt style={{ color: theme.mutedTextColor }}>Windows SHA-256</dt>
              <dd className="mt-1 break-all font-mono text-xs font-medium text-gray-200">{installer.checksum}</dd>
            </div>
          </dl>
          {activeMirrors.length > 0 ? (
            <div className="mt-4 border-t pt-4" style={{ borderColor: theme.borderColor }}>
              <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: theme.mutedTextColor }}>
                External drive options
              </p>
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                {activeMirrors.map((mirror) => (
                  <a
                    className="inline-flex min-h-10 items-center justify-center gap-2 rounded-md border px-3 text-sm font-semibold transition hover:opacity-80"
                    style={getSurfaceStyle(theme)}
                    href={mirror.url}
                    key={mirror.id}
                    rel="noreferrer"
                    target="_blank"
                  >
                    <Cloud size={16} />
                    {mirror.label}
                    <ExternalLink size={14} />
                  </a>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}

function MetaRow({ label, value, theme }: { label: string; value: string; theme: LandingTheme }) {
  return (
    <div className="flex justify-between gap-4 border-t pt-3" style={{ borderColor: theme.borderColor }}>
      <dt style={{ color: theme.mutedTextColor }}>{label}</dt>
      <dd className="text-right font-medium">{value}</dd>
    </div>
  );
}

function TrustSections({
  installer,
  productMeta,
  copy,
  editMode,
  updateCopy,
  theme,
}: {
  installer: InstallerMeta;
  productMeta: ProductMeta;
  copy: EditableCopy;
  editMode: boolean;
  updateCopy: (key: CopyKey, value: string) => void;
  theme: LandingTheme;
}) {
  return (
    <section className={sectionPadding(theme)} style={getSectionStyle(theme, true)}>
      <div className="container-page grid gap-10 lg:grid-cols-2">
        <div id="changelog">
          <div className="flex items-center gap-3">
            <Clock3 style={{ color: theme.accentColor }} />
            <h2 className="text-2xl font-semibold" style={{ color: theme.textColor }}>Changelog</h2>
          </div>
          <div className="mt-5 rounded-xl border p-6 shadow-sm" style={getSurfaceStyle(theme)}>
            <p className="text-sm font-semibold" style={{ color: theme.textColor }}>
              {productMeta.version} - {productMeta.releaseDate}
            </p>
            <ul className="mt-4 space-y-3 text-sm leading-6" style={{ color: theme.mutedTextColor }}>
              {changelogKeys.map((key) => (
                <li className="flex gap-3" key={key}>
                  <Sparkles className="mt-0.5 shrink-0" style={{ color: theme.accentColor }} size={17} />
                  <EditableText
                    as="span"
                    copyKey={key}
                    copy={copy}
                    editMode={editMode}
                    updateCopy={updateCopy}
                    className="block"
                  />
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div id="security">
          <div className="flex items-center gap-3">
            <LockKeyhole style={{ color: theme.accentColor }} />
            <h2 className="text-2xl font-semibold" style={{ color: theme.textColor }}>Security Notes</h2>
          </div>
          <div className="mt-5 rounded-xl border p-6 shadow-sm" style={getSurfaceStyle(theme)}>
            <ul className="space-y-4 text-sm leading-6" style={{ color: theme.mutedTextColor }}>
              <li className="flex gap-3">
                <ShieldCheck className="mt-0.5 shrink-0" style={{ color: theme.accentColor }} size={18} />
                <span>Publisher: {productMeta.publisher}</span>
              </li>
              <li className="flex gap-3">
                <ShieldCheck className="mt-0.5 shrink-0" style={{ color: theme.accentColor }} size={18} />
                <span className="break-all">SHA-256: {installer.checksum}</span>
              </li>
              <li className="flex gap-3">
                <ShieldCheck className="mt-0.5 shrink-0" style={{ color: theme.accentColor }} size={18} />
                <span>
                  Support and vulnerability contact:{' '}
                  <a className="font-semibold hover:underline" style={{ color: theme.textColor }} href={`mailto:${productMeta.supportEmail}`}>
                    {productMeta.supportEmail}
                  </a>
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer({ productMeta, theme }: { productMeta: ProductMeta; theme: LandingTheme }) {
  return (
    <footer className="border-t py-8" style={{ backgroundColor: theme.pageBackground, borderColor: theme.borderColor }}>
      <div
        className="container-page flex flex-col gap-4 text-sm sm:flex-row sm:items-center sm:justify-between"
        style={{ color: theme.mutedTextColor }}
      >
        <p>Copyright 2026 {productMeta.name}. Replace with your company details.</p>
        <div className="flex gap-5">
          <a className="hover:opacity-80" href="#download">
            Download
          </a>
          <a className="hover:opacity-80" href="#security">
            Security
          </a>
          <a className="hover:opacity-80" href={productMeta.githubUrl} target="_blank" rel="noreferrer">
            GitHub
          </a>
          <a className="hover:opacity-80" href={`mailto:${productMeta.supportEmail}`}>
            Support
          </a>
        </div>
      </div>
    </footer>
  );
}

export function App() {
  const { canEdit, copyConfig, editMode, setEditMode, updateCopy } = useEditableCopy();
  const productConfig = useLocalConfig<ProductMeta>(canEdit, productStorageKey, defaultProductMeta);
  const installerConfig = useInstallerMeta(canEdit);
  const themeConfig = useLocalConfig<LandingTheme>(canEdit, themeStorageKey, defaultTheme);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const copy = copyConfig.value;
  const productMeta = productConfig.value;
  const installer = installerConfig.value;
  const theme = themeConfig.value;
  const hasChanges =
    copyConfig.hasChanges || productConfig.hasChanges || installerConfig.hasChanges || themeConfig.hasChanges;
  const saveState: SaveState =
    copyConfig.saveState === 'saving' ||
    productConfig.saveState === 'saving' ||
    installerConfig.saveState === 'saving' ||
    themeConfig.saveState === 'saving'
      ? 'saving'
      : 'saved';

  return (
    <div className="min-h-screen" style={{ backgroundColor: theme.pageBackground, color: theme.textColor }}>
      <LocalPreflightWarning canEdit={canEdit} installer={installer} />
      <Header installer={installer} productMeta={productMeta} theme={theme} />
      <main>
        <Hero
          copy={copy}
          editMode={editMode}
          updateCopy={updateCopy}
          installer={installer}
          productMeta={productMeta}
          theme={theme}
        />
        <Preview copy={copy} editMode={editMode} updateCopy={updateCopy} productMeta={productMeta} theme={theme} />
        <Features copy={copy} editMode={editMode} updateCopy={updateCopy} theme={theme} />
        <DownloadPanel
          copy={copy}
          editMode={editMode}
          updateCopy={updateCopy}
          installer={installer}
          productMeta={productMeta}
          theme={theme}
        />
        <TrustSections
          installer={installer}
          productMeta={productMeta}
          copy={copy}
          editMode={editMode}
          updateCopy={updateCopy}
          theme={theme}
        />
      </main>
      <Footer productMeta={productMeta} theme={theme} />
      <EditorToolbar
        canEdit={canEdit}
        editMode={editMode}
        setEditMode={setEditMode}
        isDrawerOpen={isDrawerOpen}
        setIsDrawerOpen={setIsDrawerOpen}
        installer={installer}
        updateInstaller={installerConfig.replaceValue}
        saveState={saveState}
        hasChanges={hasChanges}
      />
      <EditorDrawer
        canEdit={canEdit}
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        copy={copy}
        updateCopy={updateCopy}
        replaceCopy={copyConfig.replaceValue}
        resetCopy={copyConfig.resetValue}
        productMeta={productMeta}
        updateProductMeta={productConfig.patchValue}
        replaceProductMeta={productConfig.replaceValue}
        resetProductMeta={productConfig.resetValue}
        installer={installer}
        updateInstaller={installerConfig.patchValue}
        replaceInstaller={installerConfig.replaceValue}
        resetInstaller={installerConfig.resetValue}
        theme={theme}
        updateTheme={themeConfig.patchValue}
        replaceTheme={themeConfig.replaceValue}
        resetTheme={themeConfig.resetValue}
      />
    </div>
  );
}
