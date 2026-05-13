import type { EditableCopy, InstallerMeta, LinkStatus, ProductMeta } from '../types';

export type ReadinessState = 'pass' | 'warn' | 'fail';

export type ReadinessItem = {
  id: string;
  label: string;
  detail: string;
  state: ReadinessState;
};

export function getVerifyCommand(fileName: string) {
  return `Get-FileHash .\\${fileName} -Algorithm SHA256`;
}

export function getJsonDownloadHref(payload: unknown) {
  return `data:application/json;charset=utf-8,${encodeURIComponent(JSON.stringify(payload, null, 2))}`;
}

function isPlaceholder(value: string) {
  return !value.trim() || /(placeholder|replace|unknown|todo|add)/i.test(value);
}

function versionWithoutPrefix(version: string) {
  return version.trim().replace(/^v/i, '');
}

export function getReleaseReadinessItems({
  copy,
  productMeta,
  installer,
  linkStatuses,
}: {
  copy: EditableCopy;
  productMeta: ProductMeta;
  installer: InstallerMeta;
  linkStatuses?: Record<string, LinkStatus>;
}): ReadinessItem[] {
  const enabledMirrors = installer.mirrors.filter((mirror) => mirror.enabled);
  const enabledMobileDownloads = installer.mobileDownloads.filter((download) => download.enabled);
  const hasVersionInFilename = installer.fileName.includes(versionWithoutPrefix(productMeta.version));
  const changelog = [copy.changelogOne, copy.changelogTwo, copy.changelogThree].filter((item) => item.trim());

  return [
    {
      id: 'support-email',
      label: 'Support contact',
      detail: productMeta.supportEmail,
      state: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(productMeta.supportEmail) ? 'pass' : 'fail',
    },
    {
      id: 'checksum',
      label: 'SHA-256 checksum',
      detail: /^[a-f0-9]{64}$/i.test(installer.checksum)
        ? '64-character SHA-256 value present.'
        : 'Replace placeholder checksum with the real installer hash.',
      state: /^[a-f0-9]{64}$/i.test(installer.checksum) ? 'pass' : 'fail',
    },
    {
      id: 'installer-path',
      label: 'Installer path',
      detail: installer.installerPath.startsWith('/downloads/')
        ? 'Uses a relative browser download path.'
        : 'Uses an external primary download URL.',
      state: /^(\/downloads\/|https?:\/\/)/i.test(installer.installerPath) ? 'pass' : 'fail',
    },
    {
      id: 'filename-version',
      label: 'Version and filename',
      detail: hasVersionInFilename
        ? `${installer.fileName} includes ${productMeta.version}.`
        : `${installer.fileName} does not include ${productMeta.version}.`,
      state: hasVersionInFilename ? 'pass' : 'warn',
    },
    {
      id: 'screenshot',
      label: 'Product screenshot',
      detail: productMeta.screenshotPath || 'No screenshot path configured.',
      state: /^\/screenshots\/|^https?:\/\//i.test(productMeta.screenshotPath) ? 'pass' : 'fail',
    },
    {
      id: 'changelog',
      label: 'Changelog',
      detail:
        changelog.length > 0 && !changelog.some(isPlaceholder)
          ? `${changelog.length} release notes ready.`
          : 'Add release-specific changelog notes.',
      state: changelog.length > 0 && !changelog.some(isPlaceholder) ? 'pass' : 'warn',
    },
    {
      id: 'mirrors',
      label: 'Mirror links',
      detail:
        enabledMirrors.length > 0
          ? `${enabledMirrors.length} mirror option${enabledMirrors.length === 1 ? '' : 's'} enabled.`
          : 'No backup mirrors enabled.',
      state:
        enabledMirrors.length === 0 || enabledMirrors.some((mirror) => !mirror.url.trim())
          ? 'warn'
          : enabledMirrors.some((mirror) => linkStatuses?.[mirror.id] === 'blocked' || linkStatuses?.[mirror.id] === 'missing')
            ? 'fail'
            : 'pass',
    },
    {
      id: 'mobile',
      label: 'Mobile downloads',
      detail:
        enabledMobileDownloads.length > 0
          ? `${enabledMobileDownloads.map((download) => download.label).join(', ')} shown publicly.`
          : 'Mobile downloads are hidden until Android or iOS links are enabled.',
      state:
        enabledMobileDownloads.length === 0
          ? 'pass'
          : enabledMobileDownloads.every((download) => download.url.trim())
            ? 'pass'
            : 'fail',
    },
  ];
}
