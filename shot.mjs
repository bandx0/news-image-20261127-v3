// Render page.html to raw_2x.png (2048x2048) via headless Chrome + CDP.
// The sandboxed Chromium has no network, so DevTools runs over
// --remote-debugging-pipe: fd 3 carries messages from Chrome, fd 4
// carries our commands, each a NUL-delimited JSON object.
// Node stdlib only.
import { spawn } from 'node:child_process';
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const CHROME = '/opt/hatch/bin/hatch-chromium-sandbox';
const here = dirname(fileURLToPath(import.meta.url));
const pageUrl = `file://${join(here, 'page.html')}`;
const outPath = join(here, 'raw_2x.png');

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const chrome = spawn(CHROME, [
  '--headless=new', '--no-sandbox', '--disable-gpu', '--disable-dev-shm-usage',
  '--hide-scrollbars', '--user-data-dir=/tmp/chrome-v3-profile',
  '--remote-debugging-pipe', '--window-size=1024,1024',
  '--force-device-scale-factor=2', 'about:blank',
], { stdio: ['ignore', 'ignore', 'ignore', 'pipe', 'pipe'] });

const readPipe = chrome.stdio[4];
const writePipe = chrome.stdio[3];
if (!readPipe || !writePipe) throw new Error('devtools pipe fds missing');

let nextId = 1;
const pending = new Map();
const events = [];
let buf = Buffer.alloc(0);
readPipe.on('data', (chunk) => {
  buf = Buffer.concat([buf, chunk]);
  let at;
  while ((at = buf.indexOf(0)) >= 0) {
    const raw = buf.subarray(0, at).toString('utf8');
    buf = buf.subarray(at + 1);
    if (!raw.trim()) continue;
    let msg;
    try { msg = JSON.parse(raw); } catch { continue; }
    if (msg.id && pending.has(msg.id)) {
      const { resolve, reject } = pending.get(msg.id);
      pending.delete(msg.id);
      if (msg.error) reject(new Error(JSON.stringify(msg.error)));
      else resolve(msg.result);
    } else if (msg.method) {
      events.push(msg);
    }
  }
});
const send = (method, params = {}, sessionId) => new Promise((resolve, reject) => {
  const id = nextId++;
  pending.set(id, { resolve, reject });
  const frame = { id, method, params };
  if (sessionId) frame.sessionId = sessionId;
  writePipe.write(JSON.stringify(frame) + '\0');
});
const waitFor = async (method, sessionId, timeoutMs = 20000) => {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    const i = events.findIndex((e) => e.method === method && (!sessionId || e.sessionId === sessionId));
    if (i >= 0) return events.splice(i, 1)[0];
    await sleep(100);
  }
  throw new Error(`timed out waiting for ${method}`);
};

try {
  // The browser-level target speaks first: create a page via Target.
  const { targetId } = await send('Target.createTarget', { url: 'about:blank' });
  const { sessionId } = await send('Target.attachToTarget', { targetId, flatten: true });
  await send('Page.enable', {}, sessionId);
  await send('Emulation.setDeviceMetricsOverride', { width: 1024, height: 1024, deviceScaleFactor: 2, mobile: false }, sessionId);
  await send('Page.navigate', { url: pageUrl }, sessionId);
  await waitFor('Page.loadEventFired', sessionId);
  await sleep(600);
  await send('Runtime.enable', {}, sessionId);
  const h = await send('Runtime.evaluate', { expression: "document.querySelector('.page').scrollHeight + 'px content vs 1024px box; footer visible: ' + (document.querySelector('.footer').getBoundingClientRect().bottom <= 1024)" }, sessionId);
  console.log('height check:', h.result.value);
  const shot = await send('Page.captureScreenshot', { format: 'png' }, sessionId);
  writeFileSync(outPath, Buffer.from(shot.data, 'base64'));
  console.log('wrote', outPath);
} finally {
  chrome.kill('SIGKILL');
}
