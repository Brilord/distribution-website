import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { createWriteStream, mkdirSync, statSync } from 'node:fs';
import { basename, join } from 'node:path';
import type { IncomingMessage, ServerResponse } from 'node:http';

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
  response.statusCode = statusCode;
  response.setHeader('content-type', 'application/json');
  response.end(JSON.stringify(body));
}

function uploadExeMiddleware(root: string) {
  return function handleUpload(request: IncomingMessage, response: ServerResponse, next: () => void) {
    if (request.url !== '/__dev/upload-exe' || request.method !== 'POST') {
      next();
      return;
    }

    const encodedFileName = request.headers['x-file-name'];
    const fileNameHeader = Array.isArray(encodedFileName) ? encodedFileName[0] : encodedFileName;
    const decodedFileName = decodeURIComponent(fileNameHeader || '');
    const fileName = basename(decodedFileName).replace(/[^a-zA-Z0-9._-]/g, '-');

    if (!fileName.toLowerCase().endsWith('.exe')) {
      sendJson(response, 400, { error: 'Only .exe files can be uploaded.' });
      return;
    }

    const downloadsDir = join(root, 'public', 'downloads');
    mkdirSync(downloadsDir, { recursive: true });

    const outputPath = join(downloadsDir, fileName);
    const writeStream = createWriteStream(outputPath);

    request.pipe(writeStream);

    request.on('error', () => {
      sendJson(response, 500, { error: 'Upload stream failed.' });
    });

    writeStream.on('error', () => {
      sendJson(response, 500, { error: 'Could not save installer.' });
    });

    writeStream.on('finish', () => {
      const sizeBytes = statSync(outputPath).size;
      sendJson(response, 200, {
        fileName,
        fileSize: formatBytes(sizeBytes),
        installerPath: `/downloads/${fileName}`,
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
