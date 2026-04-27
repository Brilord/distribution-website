import { useEffect, useMemo, useState, type ElementType, type FocusEvent, type ReactNode } from 'react';
import {
  AlertTriangle,
  ArrowDownToLine,
  BadgeCheck,
  Check,
  ChevronRight,
  Clock3,
  Edit3,
  FileText,
  Gauge,
  HardDriveDownload,
  Loader2,
  LockKeyhole,
  Menu,
  MonitorCog,
  RotateCcw,
  ScanSearch,
  ShieldCheck,
  Sparkles,
  TerminalSquare,
  UploadCloud,
  Workflow,
  X,
  Zap,
} from 'lucide-react';

const product = {
  name: 'MyApp',
  version: 'v2.4.1',
  fileSize: '86 MB',
  fileName: 'MyAppSetup.exe',
  windowsSupport: 'Windows 10 and 11',
  installerPath: '/downloads/MyAppSetup.exe',
  checksum: 'Upload or publish an installer to generate the SHA-256 checksum.',
  releaseDate: 'April 28, 2026',
  publisher: 'Replace with your code-signing publisher',
  supportEmail: 'support@myapp.example',
  screenshotPath: '/screenshots/main-preview.png',
};

const defaultCopy = {
  eyebrow: `Latest release ${product.version}`,
  heroTitle: `Download ${product.name} for Windows`,
  heroDescription:
    'A polished software distribution template for presenting your Windows app, explaining its value, and giving users a direct path to the latest .exe installer.',
  previewTitle: 'Show the desktop app before users download it.',
  previewDescription:
    'Use the built-in desktop mockup while preparing your real product screenshots, then swap in assets from /public/screenshots/main-preview.png.',
  featuresTitle: 'Everything a Windows product page needs.',
  featuresDescription:
    'Clear feature messaging, install details, release metadata, and user reassurance are all built into the template.',
  downloadTitle: 'Get the latest Windows installer.',
  downloadDescription:
    'Point the download button to your signed .exe installer. Keep version, file size, and checksum visible so users know exactly what they are installing.',
};

type CopyKey = keyof typeof defaultCopy;
type EditableCopy = Record<CopyKey, string>;
type InstallerMeta = {
  fileName: string;
  fileSize: string;
  installerPath: string;
  checksum: string;
  sizeBytes: number;
};

const features = [
  {
    icon: Zap,
    title: 'Fast daily workflow',
    text: 'Open, process, and export common tasks through a clean desktop interface designed for repeat use.',
  },
  {
    icon: MonitorCog,
    title: 'Native Windows experience',
    text: 'Installer-ready distribution with familiar system behavior, local file access, and desktop shortcuts.',
  },
  {
    icon: Workflow,
    title: 'Automated task paths',
    text: 'Use presets and guided flows to reduce setup time while keeping important controls easy to reach.',
  },
  {
    icon: ScanSearch,
    title: 'Clear activity history',
    text: 'Review recent actions, completed jobs, warnings, and outputs without digging through log files.',
  },
  {
    icon: Gauge,
    title: 'Performance focused',
    text: 'The interface keeps heavyweight operations visible, cancellable, and separate from lightweight browsing.',
  },
  {
    icon: ShieldCheck,
    title: 'Security-minded install',
    text: 'Publish version details, hashes, and update notes so users can verify what they are downloading.',
  },
];

const changelog = [
  'Improved startup time for large project folders.',
  'Added clearer installer messaging for managed Windows devices.',
  'Fixed a display issue in compact task history view.',
];

function isLocalEditingHost() {
  if (typeof window === 'undefined') {
    return false;
  }

  return ['localhost', '127.0.0.1', '0.0.0.0'].includes(window.location.hostname);
}

function useEditableCopy() {
  const canEdit = useMemo(isLocalEditingHost, []);
  const [copy, setCopy] = useState<EditableCopy>(defaultCopy);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    if (!canEdit) {
      return;
    }

    const saved = window.localStorage.getItem('myapp-landing-copy');
    if (!saved) {
      return;
    }

    try {
      setCopy({ ...defaultCopy, ...JSON.parse(saved) });
    } catch {
      window.localStorage.removeItem('myapp-landing-copy');
    }
  }, [canEdit]);

  useEffect(() => {
    if (canEdit) {
      window.localStorage.setItem('myapp-landing-copy', JSON.stringify(copy));
    }
  }, [canEdit, copy]);

  function updateCopy(key: CopyKey, value: string) {
    setCopy((current) => ({ ...current, [key]: value }));
  }

  function resetCopy() {
    setCopy(defaultCopy);
    window.localStorage.removeItem('myapp-landing-copy');
  }

  return { canEdit, copy, editMode, setEditMode, updateCopy, resetCopy };
}

function useInstallerMeta(canEdit: boolean) {
  const [installer, setInstaller] = useState<InstallerMeta>({
    fileName: product.fileName,
    fileSize: product.fileSize,
    installerPath: product.installerPath,
    checksum: product.checksum,
    sizeBytes: 0,
  });

  useEffect(() => {
    if (!canEdit) {
      return;
    }

    const saved = window.localStorage.getItem('myapp-installer-meta');
    if (!saved) {
      return;
    }

    try {
      setInstaller({
        fileName: product.fileName,
        fileSize: product.fileSize,
        installerPath: product.installerPath,
        checksum: product.checksum,
        sizeBytes: 0,
        ...JSON.parse(saved),
      });
    } catch {
      window.localStorage.removeItem('myapp-installer-meta');
    }
  }, [canEdit]);

  function updateInstaller(nextInstaller: InstallerMeta) {
    setInstaller(nextInstaller);
    if (canEdit) {
      window.localStorage.setItem('myapp-installer-meta', JSON.stringify(nextInstaller));
    }
  }

  function resetInstaller() {
    const defaultInstaller = {
      fileName: product.fileName,
      fileSize: product.fileSize,
      installerPath: product.installerPath,
      checksum: product.checksum,
      sizeBytes: 0,
    };

    setInstaller(defaultInstaller);
    if (canEdit) {
      window.localStorage.removeItem('myapp-installer-meta');
    }
  }

  return { installer, updateInstaller, resetInstaller };
}

function EditableText({
  as: Component = 'span',
  copyKey,
  copy,
  editMode,
  updateCopy,
  className = '',
}: {
  as?: ElementType;
  copyKey: CopyKey;
  copy: EditableCopy;
  editMode: boolean;
  updateCopy: (key: CopyKey, value: string) => void;
  className?: string;
}) {
  return (
    <Component
      className={`${className} ${editMode ? 'editable-copy' : ''}`}
      contentEditable={editMode}
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
  resetCopy,
  resetInstaller,
  updateInstaller,
}: {
  canEdit: boolean;
  editMode: boolean;
  setEditMode: (value: boolean) => void;
  resetCopy: () => void;
  resetInstaller: () => void;
  updateInstaller: (installer: InstallerMeta) => void;
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
      const response = await fetch('/__dev/upload-exe', {
        method: 'POST',
        headers: {
          'content-type': 'application/octet-stream',
          'x-file-name': encodeURIComponent(file.name),
        },
        body: file,
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }

      const uploaded = (await response.json()) as InstallerMeta;
      updateInstaller(uploaded);
      setMessage(`${uploaded.fileName} deployed locally. Size: ${uploaded.fileSize}. SHA-256 generated.`);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Upload failed.');
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <div className="fixed bottom-4 left-1/2 z-50 w-[calc(100%-2rem)] max-w-2xl -translate-x-1/2 rounded-xl border border-gray-200 bg-white/95 p-2 shadow-soft backdrop-blur">
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => setEditMode(!editMode)}
          className={`inline-flex min-h-10 items-center gap-2 rounded-md px-4 text-sm font-semibold transition ${
            editMode ? 'bg-emerald-600 text-white' : 'bg-gray-950 text-white hover:bg-gray-800'
          }`}
        >
          <Edit3 size={16} />
          {editMode ? 'Developer Edit On' : 'Developer Edit'}
        </button>
        <button
          type="button"
          onClick={() => {
            resetCopy();
            resetInstaller();
            setMessage('Local edits and installer metadata reset.');
          }}
          className="inline-flex min-h-10 items-center gap-2 rounded-md border border-gray-200 bg-white px-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
        >
          <RotateCcw size={16} />
          Reset
        </button>
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
          <span className="mt-1 text-xs text-gray-600">{message}</span>
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

function ButtonLink({
  href,
  children,
  variant = 'primary',
}: {
  href: string;
  children: ReactNode;
  variant?: 'primary' | 'secondary';
}) {
  const classes =
    variant === 'primary'
      ? 'bg-gray-950 text-white shadow-soft hover:-translate-y-0.5 hover:bg-gray-800 focus-visible:outline-gray-950'
      : 'border border-gray-300 bg-white text-gray-950 hover:-translate-y-0.5 hover:border-gray-400 hover:bg-gray-50 focus-visible:outline-gray-500';

  return (
    <a
      href={href}
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

function Header({ installer }: { installer: InstallerMeta }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navLinks = [
    ['Features', '#features'],
    ['Preview', '#preview'],
    ['Changelog', '#changelog'],
    ['Security', '#security'],
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-gray-200 bg-white/85 backdrop-blur-xl">
      <nav className="container-page flex h-16 items-center justify-between">
        <a href="#" className="flex items-center gap-2 text-sm font-semibold text-gray-950">
          <span className="grid size-9 place-items-center rounded-md bg-gray-950 text-white shadow-sm">
            <TerminalSquare size={18} />
          </span>
          {product.name}
        </a>
        <div className="hidden items-center gap-6 text-sm font-medium text-gray-600 md:flex">
          {navLinks.map(([label, href]) => (
            <a className="transition hover:text-gray-950" href={href} key={href}>
              {label}
            </a>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <a
            href={installer.installerPath}
            className="inline-flex min-h-10 items-center justify-center gap-2 rounded-md bg-emerald-600 px-3 text-sm font-semibold text-white transition hover:bg-emerald-700 sm:px-4"
          >
            <ArrowDownToLine size={17} />
            <span className="hidden sm:inline">Download</span>
          </a>
          <button
            type="button"
            className="inline-grid size-10 place-items-center rounded-md border border-gray-200 bg-white text-gray-700 transition hover:bg-gray-50 md:hidden"
            onClick={() => setIsMenuOpen((value) => !value)}
            aria-expanded={isMenuOpen}
            aria-label="Toggle navigation"
          >
            {isMenuOpen ? <X size={19} /> : <Menu size={19} />}
          </button>
        </div>
      </nav>
      {isMenuOpen ? (
        <div className="border-t border-gray-200 bg-white md:hidden">
          <div className="container-page grid gap-1 py-3 text-sm font-medium text-gray-700">
            {navLinks.map(([label, href]) => (
              <a
                className="rounded-md px-2 py-3 transition hover:bg-gray-50 hover:text-gray-950"
                href={href}
                key={href}
                onClick={() => setIsMenuOpen(false)}
              >
                {label}
              </a>
            ))}
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
}: {
  copy: EditableCopy;
  editMode: boolean;
  updateCopy: (key: CopyKey, value: string) => void;
  installer: InstallerMeta;
}) {
  return (
    <section className="relative overflow-hidden border-b border-gray-200 bg-[linear-gradient(135deg,#f8fafc_0%,#eefbf6_48%,#fff7ed_100%)]">
      <div className="container-page grid min-h-[calc(100vh-4rem)] items-center gap-10 py-14 lg:grid-cols-[1fr_0.92fr] lg:py-20">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white/80 px-3 py-1 text-sm font-medium text-gray-700 shadow-sm">
            <BadgeCheck size={16} className="text-emerald-600" />
            <EditableText
              copyKey="eyebrow"
              copy={copy}
              editMode={editMode}
              updateCopy={updateCopy}
            />
          </div>
          <EditableText
            as="h1"
            copyKey="heroTitle"
            copy={copy}
            editMode={editMode}
            updateCopy={updateCopy}
            className="mt-6 block max-w-3xl text-5xl font-semibold tracking-normal text-gray-950 sm:text-6xl lg:text-7xl"
          />
          <EditableText
            as="p"
            copyKey="heroDescription"
            copy={copy}
            editMode={editMode}
            updateCopy={updateCopy}
            className="mt-6 block max-w-2xl text-lg leading-8 text-gray-600"
          />
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href={installer.installerPath}>
              <HardDriveDownload size={19} />
              Download Installer
            </ButtonLink>
            <ButtonLink href="#features" variant="secondary">
              View Features
              <ChevronRight size={18} />
            </ButtonLink>
          </div>
          <dl className="mt-8 grid max-w-2xl grid-cols-1 gap-3 text-sm text-gray-600 sm:grid-cols-3">
            {[
              ['Latest version', product.version],
              ['Windows support', product.windowsSupport],
              ['File size', installer.fileSize],
            ].map(([label, value]) => (
              <div className="rounded-lg border border-white/70 bg-white/75 p-4 shadow-sm backdrop-blur" key={label}>
                <dt className="font-medium text-gray-950">{label}</dt>
                <dd className="mt-1">{value}</dd>
              </div>
            ))}
          </dl>
        </div>
        <ProductVisual compact />
      </div>
    </section>
  );
}

function ProductVisual({ compact = false }: { compact?: boolean }) {
  const [showScreenshot, setShowScreenshot] = useState(true);

  if (!showScreenshot) {
    return <DesktopMockup compact={compact} />;
  }

  return (
    <div className="rounded-xl border border-gray-300 bg-gray-950 p-2 shadow-soft">
      <div className="flex h-9 items-center gap-2 border-b border-gray-800 px-3">
        <span className="size-3 rounded-full bg-red-400" />
        <span className="size-3 rounded-full bg-amber-400" />
        <span className="size-3 rounded-full bg-emerald-400" />
        <span className="ml-3 truncate text-xs text-gray-300">{product.name} Preview</span>
      </div>
      <div className={`overflow-hidden rounded-b-lg bg-gray-900 ${compact ? 'min-h-[340px]' : 'min-h-[430px]'}`}>
        <img
          src={product.screenshotPath}
          alt={`${product.name} application screenshot`}
          className={`${compact ? 'min-h-[340px]' : 'min-h-[430px]'} h-full w-full object-cover object-top`}
          onError={() => setShowScreenshot(false)}
        />
      </div>
    </div>
  );
}

function DesktopMockup({ compact = false }: { compact?: boolean }) {
  return (
    <div className="rounded-xl border border-gray-300 bg-gray-950 p-2 shadow-soft">
      <div className="flex h-9 items-center gap-2 border-b border-gray-800 px-3">
        <span className="size-3 rounded-full bg-red-400" />
        <span className="size-3 rounded-full bg-amber-400" />
        <span className="size-3 rounded-full bg-emerald-400" />
        <span className="ml-3 truncate text-xs text-gray-300">{product.name} Dashboard</span>
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
              <div className="rounded-md bg-emerald-100 px-3 py-2 text-xs font-semibold text-emerald-800">
                Ready
              </div>
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
}: {
  copy: EditableCopy;
  editMode: boolean;
  updateCopy: (key: CopyKey, value: string) => void;
}) {
  return (
    <section id="preview" className="bg-slate-50 py-20">
      <div className="container-page">
        <div className="grid items-center gap-10 lg:grid-cols-[0.95fr_1fr]">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-emerald-700">Product preview</p>
            <EditableText
              as="h2"
              copyKey="previewTitle"
              copy={copy}
              editMode={editMode}
              updateCopy={updateCopy}
              className="section-title mt-3 block"
            />
            <EditableText
              as="p"
              copyKey="previewDescription"
              copy={copy}
              editMode={editMode}
              updateCopy={updateCopy}
              className="section-copy block"
            />
            <div className="mt-6 grid gap-3 text-sm text-gray-700 sm:grid-cols-2">
              {['Task-focused dashboard', 'Readable status panels', 'Installer-ready download path', 'Responsive screenshot layout'].map(
                (item) => (
                  <div className="flex items-center gap-2 rounded-md bg-white p-3 shadow-sm" key={item}>
                    <Check size={17} className="text-emerald-600" />
                    {item}
                  </div>
                ),
              )}
            </div>
          </div>
          <ProductVisual />
        </div>
      </div>
    </section>
  );
}

function Features({
  copy,
  editMode,
  updateCopy,
}: {
  copy: EditableCopy;
  editMode: boolean;
  updateCopy: (key: CopyKey, value: string) => void;
}) {
  return (
    <section id="features" className="bg-white py-20">
      <div className="container-page">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-wider text-emerald-700">Features</p>
          <EditableText
            as="h2"
            copyKey="featuresTitle"
            copy={copy}
            editMode={editMode}
            updateCopy={updateCopy}
            className="section-title mt-3 block"
          />
          <EditableText
            as="p"
            copyKey="featuresDescription"
            copy={copy}
            editMode={editMode}
            updateCopy={updateCopy}
            className="section-copy block"
          />
        </div>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <article
                className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-emerald-200 hover:shadow-soft"
                key={feature.title}
              >
                <div className="grid size-11 place-items-center rounded-lg bg-emerald-50 text-emerald-700">
                  <Icon size={22} />
                </div>
                <h3 className="mt-5 text-lg font-semibold text-gray-950">{feature.title}</h3>
                <p className="mt-3 text-sm leading-6 text-gray-600">{feature.text}</p>
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
}: {
  copy: EditableCopy;
  editMode: boolean;
  updateCopy: (key: CopyKey, value: string) => void;
  installer: InstallerMeta;
}) {
  return (
    <section id="download" className="bg-gray-950 py-20 text-white">
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
          />
        </div>
        <div className="rounded-xl border border-white/10 bg-white/5 p-6 shadow-soft">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="text-xl font-semibold">{product.name} Setup</h3>
              <p className="mt-1 text-sm text-gray-300">
                {product.version} for {product.windowsSupport}
              </p>
            </div>
            <FileText className="text-emerald-300" size={28} />
          </div>
          <dl className="mt-6 grid gap-3 text-sm">
            <div className="flex justify-between gap-4 border-t border-white/10 pt-3">
              <dt className="text-gray-400">File</dt>
              <dd className="text-right font-medium">{installer.fileName}</dd>
            </div>
            <div className="flex justify-between gap-4 border-t border-white/10 pt-3">
              <dt className="text-gray-400">Size</dt>
              <dd className="font-medium">{installer.fileSize}</dd>
            </div>
            <div className="flex justify-between gap-4 border-t border-white/10 pt-3">
              <dt className="text-gray-400">Released</dt>
              <dd className="font-medium">{product.releaseDate}</dd>
            </div>
            <div className="flex justify-between gap-4 border-t border-white/10 pt-3">
              <dt className="text-gray-400">Publisher</dt>
              <dd className="text-right font-medium">{product.publisher}</dd>
            </div>
            <div className="border-t border-white/10 pt-3">
              <dt className="text-gray-400">SHA-256</dt>
              <dd className="mt-1 break-all font-mono text-xs font-medium text-gray-200">{installer.checksum}</dd>
            </div>
          </dl>
          <a
            href={installer.installerPath}
            className="mt-6 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-md bg-emerald-400 px-5 text-sm font-semibold text-gray-950 transition hover:bg-emerald-300"
          >
            <HardDriveDownload size={19} />
            Download .exe
          </a>
        </div>
      </div>
    </section>
  );
}

function TrustSections({ installer }: { installer: InstallerMeta }) {
  return (
    <section className="bg-[linear-gradient(180deg,#ffffff_0%,#f8fafc_100%)] py-20">
      <div className="container-page grid gap-10 lg:grid-cols-2">
        <div id="changelog">
          <div className="flex items-center gap-3">
            <Clock3 className="text-emerald-700" />
            <h2 className="text-2xl font-semibold text-gray-950">Changelog</h2>
          </div>
          <div className="mt-5 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-semibold text-gray-950">
              {product.version} - {product.releaseDate}
            </p>
            <ul className="mt-4 space-y-3 text-sm leading-6 text-gray-700">
              {changelog.map((item) => (
                <li className="flex gap-3" key={item}>
                  <Sparkles className="mt-0.5 shrink-0 text-emerald-600" size={17} />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div id="security">
          <div className="flex items-center gap-3">
            <LockKeyhole className="text-emerald-700" />
            <h2 className="text-2xl font-semibold text-gray-950">Security Notes</h2>
          </div>
          <div className="mt-5 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <ul className="space-y-4 text-sm leading-6 text-gray-700">
              <li className="flex gap-3">
                <ShieldCheck className="mt-0.5 shrink-0 text-emerald-600" size={18} />
                <span>Publisher: {product.publisher}</span>
              </li>
              <li className="flex gap-3">
                <ShieldCheck className="mt-0.5 shrink-0 text-emerald-600" size={18} />
                <span className="break-all">SHA-256: {installer.checksum}</span>
              </li>
              <li className="flex gap-3">
                <ShieldCheck className="mt-0.5 shrink-0 text-emerald-600" size={18} />
                <span>
                  Support and vulnerability contact:{' '}
                  <a className="font-semibold text-gray-950 hover:text-emerald-700" href={`mailto:${product.supportEmail}`}>
                    {product.supportEmail}
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

function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-slate-50 py-8">
      <div className="container-page flex flex-col gap-4 text-sm text-gray-600 sm:flex-row sm:items-center sm:justify-between">
        <p>Copyright 2026 {product.name}. Replace with your company details.</p>
        <div className="flex gap-5">
          <a className="hover:text-gray-950" href="#download">
            Download
          </a>
          <a className="hover:text-gray-950" href="#security">
            Security
          </a>
          <a className="hover:text-gray-950" href={`mailto:${product.supportEmail}`}>
            Support
          </a>
        </div>
      </div>
    </footer>
  );
}

export function App() {
  const { canEdit, copy, editMode, setEditMode, updateCopy, resetCopy } = useEditableCopy();
  const { installer, updateInstaller, resetInstaller } = useInstallerMeta(canEdit);

  return (
    <div className="min-h-screen bg-white">
      <LocalPreflightWarning canEdit={canEdit} installer={installer} />
      <Header installer={installer} />
      <main>
        <Hero copy={copy} editMode={editMode} updateCopy={updateCopy} installer={installer} />
        <Preview copy={copy} editMode={editMode} updateCopy={updateCopy} />
        <Features copy={copy} editMode={editMode} updateCopy={updateCopy} />
        <DownloadPanel copy={copy} editMode={editMode} updateCopy={updateCopy} installer={installer} />
        <TrustSections installer={installer} />
      </main>
      <Footer />
      <EditorToolbar
        canEdit={canEdit}
        editMode={editMode}
        setEditMode={setEditMode}
        resetCopy={resetCopy}
        resetInstaller={resetInstaller}
        updateInstaller={updateInstaller}
      />
    </div>
  );
}
