const https = require('https');
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const INDEX_URL = 'https://raw.githubusercontent.com/nimesha206/index.js/refs/heads/main/index.js';
const LOCAL_PATH = path.join(__dirname, 'index.js');

function download(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https.get(url, res => {
      if (res.statusCode !== 200) return reject(new Error('Download failed: ' + res.statusCode));
      res.pipe(file);
      file.on('finish', () => file.close(resolve));
    }).on('error', e => { fs.unlink(dest, () => {}); reject(e); });
  });
}

async function main() {
  console.log('\x1b[36m[UNITY] Fetching latest index.js...\x1b[0m');
  try {
    await download(INDEX_URL, LOCAL_PATH);
    console.log('\x1b[32m[UNITY] index.js loaded. Starting bot...\x1b[0m');
    require(LOCAL_PATH);
  } catch (err) {
    console.error('\x1b[31m[UNITY] Failed to fetch index.js:', err.message, '\x1b[0m');
    if (fs.existsSync(LOCAL_PATH)) {
      console.log('\x1b[33m[UNITY] Using cached index.js...\x1b[0m');
      require(LOCAL_PATH);
    } else {
      process.exit(1);
    }
  }
}

main();
