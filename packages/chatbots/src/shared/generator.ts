/**
 * Shared document generator for chat integrations
 */

import {
  generateAllDocuments,
  writeDocuments,
  type TemplateContext,
} from '@intentsolutions/blueprint-core';
import * as fs from 'fs';
import * as path from 'path';
import archiver from 'archiver';

export interface GeneratorOptions {
  projectName: string;
  projectDescription: string;
  scope?: 'mvp' | 'standard' | 'comprehensive';
  audience?: 'startup' | 'business' | 'enterprise';
  outputDir?: string;
}

export interface GeneratedDocs {
  files: string[];
  zipPath: string;
  outputDir: string;
}

export class DocGenerator {
  private tempDir: string;

  constructor(tempDir: string = '/tmp/blueprint-docs') {
    this.tempDir = tempDir;
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }
  }

  async generate(options: GeneratorOptions): Promise<GeneratedDocs> {
    const {
      projectName,
      projectDescription,
      scope = 'standard',
      audience = 'business',
    } = options;

    const context: TemplateContext = {
      projectName,
      projectDescription,
      scope,
      audience,
    };

    // Generate documents
    const docs = generateAllDocuments(context);

    // Create unique output directory
    const timestamp = Date.now();
    const safeName = projectName.toLowerCase().replace(/[^a-z0-9]/g, '-');
    const outputDir = path.join(this.tempDir, `${safeName}-${timestamp}`);

    // Write documents
    const files = writeDocuments(docs, outputDir);

    // Create zip archive
    const zipPath = await this.createZip(outputDir, safeName);

    return {
      files,
      zipPath,
      outputDir,
    };
  }

  private async createZip(sourceDir: string, name: string): Promise<string> {
    const zipPath = path.join(this.tempDir, `${name}-${Date.now()}.zip`);
    const output = fs.createWriteStream(zipPath);
    const archive = archiver('zip', { zlib: { level: 9 } });

    return new Promise((resolve, reject) => {
      output.on('close', () => resolve(zipPath));
      archive.on('error', reject);

      archive.pipe(output);
      archive.directory(sourceDir, false);
      archive.finalize();
    });
  }

  cleanup(outputDir: string, zipPath: string): void {
    try {
      fs.rmSync(outputDir, { recursive: true, force: true });
      fs.rmSync(zipPath, { force: true });
    } catch {
      // Ignore cleanup errors
    }
  }
}
