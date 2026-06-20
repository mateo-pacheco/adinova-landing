import sharp from 'sharp';
import { readdirSync, statSync, existsSync, cpSync, rmSync, mkdirSync } from 'fs';
import { join, extname, dirname } from 'path';
import { cwd } from 'process';
import { execSync } from 'child_process';

const SRC = join(cwd(), 'src', 'assets');
const TMP = join(cwd(), 'tmp-img');
const QUALITY = 80;
const MAX_WIDTH = 1920;
const SKIP = ['Logo-nav.webp', 'Logo.webp'];

const POWERSHELL = 'powershell.exe';

let saved = 0;
let total = 0;
let skipped = 0;

function walk(dir) {
  let results = [];
  const list = readdirSync(dir);
  for (const file of list) {
    const full = join(dir, file);
    const stat = statSync(full);
    if (stat.isDirectory()) {
      results = results.concat(walk(full));
    } else if (extname(file).toLowerCase() === '.webp') {
      results.push(full);
    }
  }
  return results;
}

if (existsSync(TMP)) rmSync(TMP, { recursive: true });

const images = walk(SRC);

// Phase 1: optimize
for (const file of images) {
  const name = file.split('\\').pop();
  const rel = file.replace(SRC + '\\', '');
  const tmp = join(TMP, rel);

  mkdirSync(dirname(tmp), { recursive: true });

  if (SKIP.includes(name)) {
    cpSync(file, tmp);
    skipped++;
    console.log(`  SKIP    (logo)  assets\\${rel}`);
    continue;
  }

  const before = statSync(file).size;

  try {
    const info = await sharp(file).metadata();
    const resizeWidth = Math.min(info.width || MAX_WIDTH, MAX_WIDTH);

    await sharp(file)
      .resize(resizeWidth, undefined, { fit: 'inside', withoutEnlargement: true })
      .webp({ quality: QUALITY })
      .toFile(tmp);

    const after = statSync(tmp).size;
    const ratio = ((before - after) / before * 100).toFixed(1);

    saved += before - after;
    total++;
    console.log(`  ${ratio.toString().padStart(5)}  ${(before / 1024).toFixed(0).toString().padStart(5)}K → ${(after / 1024).toFixed(0).toString().padStart(5)}K  assets\\${rel}`);
  } catch (e) {
    console.error(`  ERROR  assets\\${rel}: ${e.message}`);
    cpSync(file, tmp);
  }
}

console.log(`\nDone: ${total} optimized, ${skipped} skipped, ${(saved / 1024 / 1024).toFixed(1)} MB saved`);

// Phase 2: copy back using PowerShell
console.log(`\nReplacing originals with optimized versions (via PowerShell)...`);
for (const file of images) {
  const rel = file.replace(SRC + '\\', '');
  const tmp = join(TMP, rel);
  if (existsSync(tmp)) {
    try {
      execSync(`Copy-Item -LiteralPath "${tmp}" -Destination "${file}" -Force`, { shell: POWERSHELL });
    } catch (e) {
      try {
        // Fallback: del + copy via cmd
        execSync(`del /f /q "${file}"`, { shell: 'cmd.exe' });
        execSync(`copy /y "${tmp}" "${file}"`, { shell: 'cmd.exe' });
      } catch (e2) {
        console.error(`  FAIL   assets\\${rel}: ${e2.message}`);
      }
    }
  }
}

try { rmSync(TMP, { recursive: true }); } catch {}

console.log(`Done.`);
