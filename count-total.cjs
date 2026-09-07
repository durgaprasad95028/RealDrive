const fs = require('fs');
const path = require('path');

function countLinesInDir(dir, extensions = ['.ts', '.tsx', '.js', '.jsx', '.css', '.html', '.json']) {
  let totalLines = 0;
  let fileCount = 0;
  const breakdown = {};

  function traverse(currentDir) {
    const entries = fs.readdirSync(currentDir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(currentDir, entry.name);
      if (entry.isDirectory()) {
        if (entry.name !== 'node_modules' && entry.name !== 'dist' && entry.name !== '.git') {
          traverse(fullPath);
        }
      } else if (entry.isFile()) {
        const ext = path.extname(entry.name);
        if (extensions.includes(ext)) {
          const content = fs.readFileSync(fullPath, 'utf-8');
          const lines = content.split('\n').length;
          totalLines += lines;
          fileCount++;
          breakdown[ext] = (breakdown[ext] || 0) + lines;
        }
      }
    }
  }

  traverse(dir);
  return { totalLines, fileCount, breakdown };
}

const totalStats = countLinesInDir(__dirname);
const srcStats = countLinesInDir(path.join(__dirname, 'src'));

console.log('==================================================');
console.log('REALDRIVE TOTAL CODEBASE REPORT:');
console.log('==================================================');
console.log(`Source Code (src/):       ${srcStats.totalLines.toLocaleString()} LOC (${srcStats.fileCount} files)`);
console.log(`Total Project Repository: ${totalStats.totalLines.toLocaleString()} LOC (${totalStats.fileCount} files)`);
console.log('--------------------------------------------------');
console.log('Breakdown by Extension (Entire Project):');
for (const [ext, count] of Object.entries(totalStats.breakdown).sort((a, b) => b[1] - a[1])) {
  console.log(`  ${ext.padEnd(8)}: ${count.toLocaleString().padStart(8)} LOC`);
}
console.log('==================================================');
