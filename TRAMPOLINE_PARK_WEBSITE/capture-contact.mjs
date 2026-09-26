import http from 'http';
import fs from 'fs';
import path from 'path';
import { spawn } from 'child_process';

const __dirname = path.resolve();
const mimeTypes = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
};

const server = http.createServer((req, res) => {
  let reqPath = req.url.split('?')[0];
  if (reqPath === '/') reqPath = '/contact.html';
  const filePath = path.join(__dirname, reqPath);
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404);
      res.end('Not Found');
      return;
    }
    const ext = path.extname(filePath).toLowerCase();
    res.writeHead(200, { 'Content-Type': mimeTypes[ext] || 'application/octet-stream' });
    res.end(data);
  });
});

const PORT = 3007;
await new Promise(r => server.listen(PORT, r));

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const debugPort = 9229;
const userDataDir = path.join(__dirname, '.edge-screenshot-profile');

const edge = spawn(edgePath, [
  '--headless=new',
  `--remote-debugging-port=${debugPort}`,
  `--user-data-dir=${userDataDir}`,
  '--disable-gpu',
  '--no-sandbox',
  'about:blank'
]);

for (let i = 0; i < 30; i++) {
  await new Promise(r => setTimeout(r, 200));
  try {
    const res = await fetch(`http://127.0.0.1:${debugPort}/json/version`);
    if ((await res.json()).webSocketDebuggerUrl) break;
  } catch (e) {}
}

const newTabRes = await fetch(`http://127.0.0.1:${debugPort}/json/new?about:blank`, { method: 'PUT' });
const ws = new WebSocket((await newTabRes.json()).webSocketDebuggerUrl);
await new Promise(r => ws.onopen = r);

let id = 1;
const callbacks = new Map();
ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  if (data.id && callbacks.has(data.id)) {
    const cb = callbacks.get(data.id);
    callbacks.delete(data.id);
    cb(data.result);
  }
};

function send(method, params = {}) {
  const msgId = id++;
  return new Promise(resolve => {
    callbacks.set(msgId, resolve);
    ws.send(JSON.stringify({ id: msgId, method, params }));
  });
}

await send('Page.enable');
await send('Runtime.enable');

async function capture(width, height, filename) {
  await send('Emulation.setDeviceMetricsOverride', {
    width,
    height,
    deviceScaleFactor: 1,
    mobile: width < 800
  });
  await send('Page.navigate', { url: `http://localhost:${PORT}/contact.html` });
  await new Promise(r => setTimeout(r, 700));

  const screenshot = await send('Page.captureScreenshot', { format: 'png' });
  const buffer = Buffer.from(screenshot.data, 'base64');
  fs.writeFileSync(path.join(__dirname, filename), buffer);
  console.log(`Saved screenshot: ${filename}`);
}

await capture(1200, 1000, 'contact-desktop.png');
await capture(768, 1000, 'contact-tablet.png');
await capture(360, 900, 'contact-mobile.png');

ws.close();
edge.kill();
server.close();
try { fs.rmSync(userDataDir, { recursive: true, force: true }); } catch (e) {}
