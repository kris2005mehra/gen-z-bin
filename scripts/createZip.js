import { createWriteStream } from 'fs';
import { resolve, join } from 'path';
import archiver from 'archiver';

const output = createWriteStream(resolve('genz-bin.zip'));
const archive = archiver('zip', {
  zlib: { level: 9 }
});

output.on('close', () => {
  console.log('Archive created successfully!');
  console.log('Total bytes:', archive.pointer());
});

archive.on('error', (err) => {
  throw err;
});

archive.pipe(output);

// Add files
archive.glob('src/**/*');
archive.glob('public/**/*');
archive.file('index.html', { name: 'index.html' });
archive.file('package.json', { name: 'package.json' });
archive.file('tsconfig.json', { name: 'tsconfig.json' });
archive.file('tsconfig.app.json', { name: 'tsconfig.app.json' });
archive.file('tsconfig.node.json', { name: 'tsconfig.node.json' });
archive.file('vite.config.ts', { name: 'vite.config.ts' });
archive.file('postcss.config.js', { name: 'postcss.config.js' });
archive.file('tailwind.config.js', { name: 'tailwind.config.js' });
archive.file('components.json', { name: 'components.json' });
archive.file('eslint.config.js', { name: 'eslint.config.js' });

archive.finalize();