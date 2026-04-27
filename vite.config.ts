import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { createWriteStream, mkdirSync, statSync, unlink } from 'node:fs';
import { createHash } from 'node:crypto';
import { basename, join } from 'node:path';
import type { IncomingMessage, ServerResponse } from 'node:http';

const maxUploadBytes = 500 * 1024 * 1024;
const localHostnames = new Set(['localhost', '127.0.0.1', '0.0.0.0', '::1', '[::1]']);

function formatBytes(bytes: number) {
  if (bytes === 0) {
    return '0 B';
  }

  const units = ['B', 'KB', 'MB', 'GB'];
  const unitIndex = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  const value = bytes / 1024 ** unitIndex;

  return `${value >= 10 || unitIndex === 0 ? value.toFixed(0) : value.toFixed(1)} ${units[unitIndex]}`;
}

function sendJson(response: ServerResponse, statusCode: number, body: unknown) {
  if (response.headersSent || response.writableEnded) {
    return;
  }

  response.statusCode = statusCode;
  response.setHeader('content-type', 'application/json');
  response.end(JSON.stringify(body));
}

function getHostname(value: string | undefined) {
  if (!value) {
    return '';
  }

  try {
    return new URL(value.includes('://') ? value : `http://${value}`).hostname;
  } catch {
    return value.split(':')[0] || '';
  }
}

function isAllowedLocalRequest(request: IncomingMessage) {
  const host = getHostname(request.headers.host);
  const origin = request.headers.origin;

  if (!localHostnames.has(host)) {
    return false;
  }

  if (!origin) {
    return true;
  }

  return localHostnames.has(getHostname(origin));
}

function uploadExeMiddleware(root: string) {
  return function handleUpload(request: IncomingMessage, response: ServerResponse, next: () => void) {
    if (request.url !== '/__dev/upload-exe' || request.method !== 'POST') {
      next();
      return;
    }

    if (!isAllowedLocalRequest(request)) {
      sendJson(response, 403, { error: 'Installer uploads are only allowed from the local development host.' });
      request.resume();
      return;
    }

    const contentLength = Number(request.headers['content-length'] || 0);
    if (contentLength > maxUploadBytes) {
      sendJson(response, 413, { error: 'Installer is too large. Maximum upload size is 500 MB.' });
      request.resume();
      return;
    }

    const encodedFileName = request.headers['x-file-name'];
    const fileNameHeader = Array.isArray(encodedFileName) ? encodedFileName[0] : encodedFileName;
    let decodedFileName = '';

    try {
      decodedFileName = decodeURIComponent(fileNameHeader || '');
    } catch {
      sendJson(response, 400, { error: 'Invalid installer file name.' });
      request.resume();
      return;
    }

    const fileName = basename(decodedFileName).replace(/[^a-zA-Z0-9._-]/g, '-');

    if (!fileName.toLowerCase().endsWith('.exe')) {
      sendJson(response, 400, { error: 'Only .exe files can be uploaded.' });
      return;
    }

    const downloadsDir = join(root, 'public', 'downloads');
    mkdirSync(downloadsDir, { recursive: true });

    const outputPath = join(downloadsDir, fileName);
    const writeStream = createWriteStream(outputPath);
    const hash = createHash('sha256');
    let receivedBytes = 0;
    let settled = false;

    function fail(statusCode: number, error: string) {
      if (settled) {
        return;
      }

      settled = true;
      writeStream.destroy();
      unlink(outputPath, () => undefined);
      sendJson(response, statusCode, { error });
    }

    request.on('data', (chunk: Buffer) => {
      receivedBytes += chunk.length;

      if (receivedBytes > maxUploadBytes) {
        fail(413, 'Installer is too large. Maximum upload size is 500 MB.');
        request.destroy();
        return;
      }

      hash.update(chunk);
    });

    request.pipe(writeStream);

    request.on('error', () => {
      fail(500, 'Upload stream failed.');
    });

    request.on('aborted', () => {
      fail(400, 'Upload was aborted.');
    });

    writeStream.on('error', () => {
      fail(500, 'Could not save installer.');
    });

    writeStream.on('finish', () => {
      if (settled) {
        return;
      }

      settled = true;
      const sizeBytes = statSync(outputPath).size;
      sendJson(response, 200, {
        fileName,
        fileSize: formatBytes(sizeBytes),
        installerPath: `/downloads/${fileName}`,
        checksum: hash.digest('hex'),
        sizeBytes,
      });
    });
  };
}

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'local-exe-upload',
      configureServer(server) {
        server.middlewares.use(uploadExeMiddleware(server.config.root));
      },
    },
  ],
});
